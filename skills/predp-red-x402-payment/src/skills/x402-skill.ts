/**
 * x402 Payment Skill for $PCT Token Purchase
 * 
 * This skill enables AI agents to initiate x402 payments to purchase $PCT tokens
 * from PredP.red platform using USDT on X Layer.
 * 
 * Supported services:
 * - Try: Custom amount (1:1 ratio of USDT to $PCT)
 * - Love: Fixed 99 USDT → 200 $PCT
 * - Host: Fixed 999 USDT → 999 $PCT
 */

import { I18nService, Language } from '../i18n';
import { X402Payment, PaymentAuthorization } from '../utils/x402-payment';
import { AgenticWallet } from '../utils/agentic-wallet';

export interface X402SkillOptions {
  apiKey: string;
  secretKey: string;
  passphrase: string;
  rpcUrl?: string;
  chainId?: number;
  language?: Language;
  recipientAddress?: string; // x402 payment recipient address
  pctTokenAddress?: string; // $PCT token contract address
  usdtTokenAddress?: string; // USDT token contract address on X Layer
  serviceUrl?: string; // predp.red service URL
}

export interface PurchaseIntent {
  action: 'BUY_PCT' | 'VIEW_SERVICES' | 'CHECK_BALANCE' | 'VERIFY_PAYMENT';
  service?: 'try' | 'love' | 'host';
  amount?: number;
  txHash?: string;
}

export class X402Skill {
  private i18n: I18nService;
  private x402Payment: X402Payment;
  private agenticWallet: AgenticWallet;
  private options: X402SkillOptions;

  constructor(options: X402SkillOptions) {
    this.options = options;
    this.i18n = new I18nService(options.language || 'zh');

    this.x402Payment = new X402Payment({
      apiKey: options.apiKey,
      secretKey: options.secretKey,
      passphrase: options.passphrase,
      chainId: options.chainId || 196, // X Layer default
    });

    this.agenticWallet = new AgenticWallet({
      apiKey: options.apiKey,
      secretKey: options.secretKey,
      passphrase: options.passphrase,
      rpcUrl: options.rpcUrl,
      chainId: options.chainId,
    });
  }

  setLanguage(language: Language): void {
    this.i18n.setLanguage(language);
  }

  getLanguage(): Language {
    return this.i18n.getLanguage();
  }

  async handleMessage(message: string): Promise<string> {
    try {
      const intent = this.parseIntent(message);
      
      switch (intent.action) {
        case 'BUY_PCT':
          return this.handleBuyPCT(intent);
        case 'VIEW_SERVICES':
          return this.getServicesInfo();
        case 'CHECK_BALANCE':
          return this.getBalanceInfo();
        case 'VERIFY_PAYMENT':
          return this.handleVerifyPayment(intent);
        default:
          return this.getHelpMessage();
      }
    } catch (error) {
      const t = this.i18n;
      return `${t.t('error')}：${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  private parseIntent(message: string): PurchaseIntent {
    const lowerMessage = message.toLowerCase();
    
    // Chinese patterns
    const zhBuy = lowerMessage.includes('购买') || lowerMessage.includes('买') || 
                   lowerMessage.includes('购买pct') || lowerMessage.includes('购买pct');
    const zhViewServices = lowerMessage.includes('服务') || lowerMessage.includes('套餐') || 
                           lowerMessage.includes('价格') || lowerMessage.includes('多少钱');
    const zhCheckBalance = lowerMessage.includes('余额') || lowerMessage.includes('查看余额');
    const zhVerifyPayment = lowerMessage.includes('验证') || lowerMessage.includes('支付验证') || 
                           lowerMessage.includes('txhash') || lowerMessage.includes('transaction');
    
    // English patterns
    const enBuy = lowerMessage.includes('buy') || lowerMessage.includes('purchase') || 
                  lowerMessage.includes('buy pct') || lowerMessage.includes('buy pct');
    const enViewServices = lowerMessage.includes('services') || lowerMessage.includes('packages') || 
                          lowerMessage.includes('price') || lowerMessage.includes('how much');
    const enCheckBalance = lowerMessage.includes('balance') || lowerMessage.includes('check balance');
    const enVerifyPayment = lowerMessage.includes('verify') || lowerMessage.includes('payment verify') || 
                          lowerMessage.includes('txhash') || lowerMessage.includes('transaction');
    
    if (zhBuy || enBuy) {
      const service = this.extractService(message);
      const amount = this.extractAmount(message);
      
      return {
        action: 'BUY_PCT',
        service,
        amount,
      };
    }
    
    if (zhViewServices || enViewServices) {
      return { action: 'VIEW_SERVICES' };
    }
    
    if (zhCheckBalance || enCheckBalance) {
      return { action: 'CHECK_BALANCE' };
    }
    
    if (zhVerifyPayment || enVerifyPayment) {
      const txHash = this.extractTxHash(message);
      return {
        action: 'VERIFY_PAYMENT',
        txHash,
      };
    }
    
    return { action: 'VIEW_SERVICES' };
  }

  private extractService(message: string): 'try' | 'love' | 'host' | undefined {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('love') || lowerMessage.includes('love')) {
      return 'love';
    }
    if (lowerMessage.includes('host') || lowerMessage.includes('host')) {
      return 'host';
    }
    if (lowerMessage.includes('try') || lowerMessage.includes('自定义')) {
      return 'try';
    }
    
    return undefined;
  }

  private extractAmount(message: string): number | undefined {
    const match = message.match(/(\d+(\.\d+)?)\s*(?:usdt|u|刀|块|元|dollars?)?/i);
    return match ? parseFloat(match[1]) : undefined;
  }

  private extractTxHash(message: string): string | undefined {
    const match = message.match(/0x[0-9a-f]{64}/i);
    return match ? match[0] : undefined;
  }

  private async handleBuyPCT(intent: PurchaseIntent): Promise<string> {
    const t = this.i18n;
    const isZh = t.getLanguage() === 'zh';
    
    if (!intent.service) {
      return this.getServicesInfo();
    }

    if (intent.service === 'try' && (!intent.amount || intent.amount <= 0)) {
      if (isZh) {
        return `❌ 请提供购买金额

Try 服务支持自定义金额，请告诉我您想购买的 USDT 数量。

示例：
- "购买 Try 服务 50 USDT"
- "我想购买 100 USDT 的 $PCT"
- "买 200 USDT 的 Try 服务"`;
      } else {
        return `❌ Please provide purchase amount

Try service supports custom amount, please tell me how much USDT you want to spend.

Examples:
- "Buy Try service 50 USDT"
- "I want to buy $PCT with 100 USDT"
- "Buy Try service for 200 USDT"`;
      }
    }

    const paymentDetails = this.getPaymentDetails(intent.service, intent.amount);
    
    try {
      // Create x402 payment authorization
      const authorization = await this.x402Payment.authorizePayment(
        paymentDetails.usdtAmount.toString(),
        this.options.recipientAddress || '0x779ded0c9e1022225f8e0630b35a9b54be713736',
        'USDT'
      );

      return this.formatPurchaseConfirmation(paymentDetails, authorization);
    } catch (error) {
      return `${t.t('error')}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  private async handleVerifyPayment(intent: PurchaseIntent): Promise<string> {
    const t = this.i18n;
    const isZh = t.getLanguage() === 'zh';
    
    if (!intent.txHash) {
      if (isZh) {
        return `❌ 请提供交易哈希 (txHash)

示例：
- "验证支付 0xabc123def456abc123456defabc1234567890"
- "检查支付状态 0x1234567890abcdef1234567890abcdef1234567"`;
      } else {
        return `❌ Please provide transaction hash (txHash)

Examples:
- "Verify payment 0xabc123def456abc123456defabc1234567890"
- "Check payment status 0x1234567890abcdef1234567890abcdef1234567"`;
      }
    }

    try {
      const axios = await import('axios');
      // Call Nuxt app's x402 verify API to verify payment and get PCT transfer info
      const response = await axios.default.post(`${this.options.serviceUrl || 'https://xlayer.predp.red'}/api/x402/verifyPayment`, {
        txHash: intent.txHash,
        fromAddress: await this.agenticWallet.getAddress(), // Get user's address from wallet
      });

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = response.data;

      if (result.success) {
        return this.formatVerificationResult(result.data);
      } else {
        return `${t.t('error')}: ${result.error}`;
      }
    } catch (error) {
      return `${t.t('error')}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  private getPaymentDetails(service: string, amount?: number): {
    service: string;
    usdtAmount: number;
    pctAmount: number;
    description: string;
  } {
    switch (service) {
      case 'love':
        return {
          service: 'Love',
          usdtAmount: 99,
          pctAmount: 200,
          description: this.i18n.getLanguage() === 'zh' 
            ? '包含所有基础功能，适合普通用户' 
            : 'Includes all basic features, suitable for regular users',
        };
      case 'host':
        return {
          service: 'Host',
          usdtAmount: 999,
          pctAmount: 999,
          description: this.i18n.getLanguage() === 'zh' 
            ? '包含所有高级功能，适合专业用户和企业' 
            : 'Includes all advanced features, suitable for professionals and enterprises',
        };
      case 'try':
      default:
        const usdtAmount = amount || 10; // Default to 10 USDT if no amount specified
        return {
          service: 'Try',
          usdtAmount,
          pctAmount: usdtAmount, // 1:1 ratio for Try service
          description: this.i18n.getLanguage() === 'zh' 
            ? `自定义金额购买 $PCT，比例 1:1` 
            : `Custom amount purchase, 1:1 ratio of USDT to $PCT`,
        };
    }
  }

  private getServicesInfo(): string {
    const t = this.i18n;
    const isZh = t.getLanguage() === 'zh';
    
    if (isZh) {
      return `💳 **PredP.red $PCT 购买服务**

📋 **可用服务套餐**：

1️⃣ **Try 服务 (自定义金额)**
   - 💰 价格：自定义金额 (USDT)
   - 🎁 获得：1:1 比例 $PCT
   - 📝 说明：支持任意金额购买，适合尝试使用
   - 💡 示例：购买 100 USDT 可获得 100 $PCT

2️⃣ **Love 服务 (固定价格)**
   - 💰 价格：**99 USDT**
   - 🎁 获得：**200 $PCT**
   - 📝 说明：包含所有基础功能，性价比高
   - 📈 优惠：每 USDT 可获得约 2.02 $PCT

3️⃣ **Host 服务 (固定价格)**
   - 💰 价格：**999 USDT**
   - 🎁 获得：**999 $PCT**
   - 📝 说明：适合专业用户，包含高级功能
   - 📈 优惠：1:1 比例，提供更多功能

💡 **如何购买**：
- 回复 "购买 Love 服务" 或 "Buy Love service"
- 回复 "购买 Try 服务 50 USDT" 或 "Buy Try service 50 USDT"
- 回复 "查看余额" 或 "Check balance"

⚠️ **支付说明**：
- 仅支持 X Layer 主网 USDT 支付
- 所有交易均通过 OKX x402 协议安全处理
- 支付后请保存交易哈希 (txHash) 以便验证和查询`;
    } else {
      return `💳 **PredP.red $PCT Purchase Services**

📋 **Available Service Packages**：

1️⃣ **Try Service (Custom Amount)**
   - 💰 Price: Custom amount (USDT)
   - 🎁 Get: 1:1 ratio of $PCT
   - 📝 Description: Support any amount purchase, suitable for trying out
   - 💡 Example: Buy 100 USDT gets 100 $PCT

2️⃣ **Love Service (Fixed Price)**
   - 💰 Price: **99 USDT**
   - 🎁 Get: **200 $PCT**
   - 📝 Description: Includes all basic features, high cost-effectiveness
   - 📈 Discount: ~2.02 $PCT per USDT

3️⃣ **Host Service (Fixed Price)**
   - 💰 Price: **999 USDT**
   - 🎁 Get: **999 $PCT**
   - 📝 Description: For professional users, includes advanced features
   - 📈 Discount: 1:1 ratio, with more features

💡 **How to Buy**：
- Reply "Buy Love service"
- Reply "Buy Try service 50 USDT"
- Reply "Check balance"

⚠️ **Payment Instructions**：
- Only supports X Layer Mainnet USDT payment
- All transactions are securely processed via OKX x402 protocol
- Please save the transaction hash (txHash) after payment for verification and query`;
    }
  }

  private async getBalanceInfo(): Promise<string> {
    const t = this.i18n;
    const isZh = t.getLanguage() === 'zh';
    
    try {
      const address = await this.agenticWallet.getAddress();
      const balance = await this.x402Payment.getBalance(address);
      const balanceNumber = parseFloat(balance);
      
      if (isZh) {
        return `💼 **我的钱包余额**
🏦 **地址**: ${address}
💰 **USDT 余额**: ${balance} USDT
🌐 **网络**: X Layer Mainnet

💡 ${balanceNumber < 50
            ? '您的余额低于 50 USDT，建议先充值再购买 $PCT。'
            : '您的余额充足，可以开始购买 $PCT！'}`;
      } else {
        return `💼 **My Wallet Balance**
🏦 **Address**: ${address}
💰 **USDT Balance**: ${balance} USDT
🌐 **Network**: X Layer Mainnet

💡 ${balanceNumber < 50
            ? 'Your balance is less than 50 USDT. Please recharge before purchasing $PCT.'
            : 'Your balance is sufficient. You can start purchasing $PCT!'}`;
      }
    } catch (error) {
      const errorMsg = isZh ? '获取余额失败' : 'Failed to get balance';
      return `❌ ${errorMsg}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  private formatPurchaseConfirmation(paymentDetails: any, authorization: PaymentAuthorization): string {
    const t = this.i18n;
    const isZh = t.getLanguage() === 'zh';
    
    if (isZh) {
      return `✅ **$PCT 购买确认**

📋 **服务详情**：
- 🛍️ 服务类型：${paymentDetails.service}
- 💰 支付金额：${paymentDetails.usdtAmount} USDT
- 🎁 获得 $PCT：${paymentDetails.pctAmount} PCT
- 📊 汇率：${paymentDetails.pctAmount / paymentDetails.usdtAmount} PCT/USDT

🔐 **支付授权信息**：
- 🔐 签名：${authorization.signature.slice(0, 12)}...
- 🎯 收款人地址：${this.options.recipientAddress || '0x779ded0c9e1022225f8e0630b35a9b54be713736'}
- 🌐 网络：X Layer Mainnet

💳 **支付步骤**：
1. 确认支付信息无误
2. 使用您的 OKX 钱包签署支付授权
3. 交易将自动验证并执行
4. $PCT 代币将发送到您的钱包

⚠️ **重要提示**：
- 请确保您的钱包中有足够的 USDT 余额
- 交易将在 X Layer Mainnet 上执行
- 支付成功后无法取消
- 如果您有任何问题，请联系客服

🔄 回复 "确认" 或 "Confirm" 继续支付，回复 "取消" 或 "Cancel" 取消购买。`;
    } else {
      return `✅ **$PCT Purchase Confirmation**

📋 **Service Details**：
- 🛍️ Service Type：${paymentDetails.service}
- 💰 Payment Amount：${paymentDetails.usdtAmount} USDT
- 🎁 $PCT to Receive：${paymentDetails.pctAmount} PCT
- 📊 Exchange Rate：${paymentDetails.pctAmount / paymentDetails.usdtAmount} PCT/USDT

🔐 **Payment Authorization**：
- 🔐 Signature：${authorization.signature.slice(0, 12)}...
- 🎯 Recipient Address：${this.options.recipientAddress || '0x779ded0c9e1022225f8e0630b35a9b54be713736'}
- 🌐 Network：X Layer Mainnet

💳 **Payment Steps**：
1. Verify the payment information is correct
2. Sign the payment authorization with your OKX Wallet
3. Transaction will be automatically verified and executed
4. $PCT tokens will be sent to your wallet

⚠️ **Important Note**：
- Ensure your wallet has sufficient USDT balance
- The transaction will be executed on X Layer Mainnet
- Payments cannot be canceled after confirmation
- If you have any questions, please contact support

🔄 Reply "Confirm" to continue, reply "Cancel" to cancel purchase.`;
    }
  }

  private formatVerificationResult(data: any): string {
    const t = this.i18n;
    const isZh = t.getLanguage() === 'zh';
    
    if (isZh) {
      return `✅ **支付验证成功**

📊 **支付信息**：
- 📝 服务类型：${data.service || '未知'}
- 💰 支付金额：${data.amount} USDT
- 🎁 获得 $PCT：${data.pctTransferred || 0} 个
- 📅 处理时间：${new Date().toLocaleString()}

🔍 **验证详情**：
- 📄 状态：${data.verified ? '已验证' : '待验证'}
- 🔗 交易哈希：${data.txHash}
- 🏦 付款地址：${data.from}
- 🛍️ 收款地址：${data.to}

💡 **下一步**：
您的 $PCT 代币已自动发放到您的钱包中。您可以：
- 回复 "查看余额" 检查 $PCT 余额
- 回复 "购买 Love 服务" 继续购买
- 回复 "使用 $PCT" 了解如何使用 $PCT`;
    } else {
      return `✅ **Payment Verification Successful**

📊 **Payment Information**：
- 📝 Service Type: ${data.service || 'Unknown'}
- 💰 Payment Amount: ${data.amount} USDT
- 🎁 Get $PCT: ${data.pctTransferred || 0} units
- 📅 Processing Time: ${new Date().toLocaleString()}

🔍 **Verification Details**：
- 📄 Status: ${data.verified ? 'Verified' : 'Pending'}
- 🔗 Transaction Hash: ${data.txHash}
- 🏦 Sender Address: ${data.from}
- 🛍️ Recipient Address: ${data.to}

💡 **Next Steps**：
Your $PCT tokens have been automatically issued to your wallet. You can:
- Reply "Check balance" to view $PCT balance
- Reply "Buy Love service" to continue purchasing
- Reply "Use $PCT" to learn how to use $PCT`;
    }
  }

  private getHelpMessage(): string {
    const t = this.i18n;
    const isZh = t.getLanguage() === 'zh';
    
    if (isZh) {
      return `${t.t('helpTitle')} - x402 支付

${t.t('helpDescription')}:

1️⃣ **购买 $PCT**
   - "购买 Love 服务"
   - "我想购买 100 USDT 的 $PCT"
   - "Buy Host service"
   - "Purchase 50 USDT worth of $PCT"

2️⃣ **查看服务**
   - "查看 $PCT 购买服务"
   - "服务价格"
   - "查看套餐"
   - "Show services"

3️⃣ **余额查询**
   - "查看我的钱包余额"
   - "我的 USDT 余额"
   - "Check balance"

4️⃣ **支付验证**
   - "验证支付 0xabc123..."
   - "Payment verify txhash 0x123..."

💡 随时告诉我你想做什么，我会引导你完成 $PCT 购买流程~

---

**语言切换**: 发送 "Switch to English" 或 "切换到英文"`;
    } else {
      return `${t.t('helpTitle')} - x402 Payment

${t.t('helpDescription')}:

1️⃣ **Buy $PCT**
   - "Buy Love service"
   - "I want to buy $PCT with 100 USDT"
   - "Purchase Host service"
   - "Buy 50 USDT worth of $PCT"

2️⃣ **View Services**
   - "Show $PCT purchase services"
   - "Service prices"
   - "View packages"
   - "Show services"

3️⃣ **Balance Check**
   - "Check my wallet balance"
   - "My USDT balance"
   - "Check balance"

4️⃣ **Payment Verification**
   - "Verify payment 0xabc123..."
   - "Payment verify txhash 0x123..."

💡 Tell me what you want to do anytime, I will guide you through the $PCT purchase process~

---

**Language Switch**: Send "Switch to Chinese" or "切换到中文"`;
    }
  }

  async executePayment(): Promise<string> {
    try {
      const result = await this.agenticWallet.executeBuy(
        this.options.recipientAddress || '0x779ded0c9e1022225f8e0630b35a9b54be713736',
        'pct-purchase',
        '1'
      );
      
      const t = this.i18n;
      if (result.status === 'success') {
        return `${t.t('success')} - ${t.t('transactionSuccess')}: ${result.txHash}`;
      } else {
        throw new Error(result.error || t.t('transactionFailed'));
      }
    } catch (error) {
      const t = this.i18n;
      throw new Error(`${t.t('error')} - ${t.t('buy')}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async verifyPayment(txHash: string): Promise<any> {
    return this.x402Payment.verifyPayment(txHash);
  }
}
