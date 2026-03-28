/**
 * PPA Market AI Skill - Core Implementation
 * Handles user commands, transaction execution, and contract interaction
 */

import { ethers } from 'ethers';
import { AgenticWallet } from '../utils/agentic-wallet';
import { HARDCODED_MARKET } from '../utils/config';

export interface SkillOptions {
  apiKey: string;
  secretKey: string;
  passphrase: string;
  rpcUrl?: string;
  chainId?: number;
}

export interface MarketInfo {
  id: string;
  title: string;
  description: string;
  endTime: number;
  yesPrice: bigint;
  noPrice: bigint;
  platformFeeBps: number;
  yesNftId: number;
  noNftId: number;
  status: 'ACTIVE' | 'CLOSED' | 'RESOLVED';
}

export interface Position {
  marketId: string;
  outcome: 'YES' | 'NO';
  amount: bigint;
  averagePrice: bigint;
  currentValue: bigint;
  pnl: bigint;
}

export interface TradeIntent {
  action: 'BUY' | 'SELL' | 'VIEW_MARKET' | 'VIEW_POSITIONS' | 'APPROVE';
  amount?: number;
  outcome?: 'YES' | 'NO';
  percentage?: number;
}

export class PPAMarketSkill {
  private wallet: AgenticWallet;
  private contractAddress: string;
  private pctTokenAddress: string;

  constructor(options: SkillOptions) {
    this.wallet = new AgenticWallet({
      apiKey: options.apiKey,
      secretKey: options.secretKey,
      passphrase: options.passphrase,
      rpcUrl: options.rpcUrl,
      chainId: options.chainId,
    });
    this.contractAddress = '0xbE03338A630B948A043b5e8eA390813bF28A5Ff4'; // 硬编码
    this.pctTokenAddress = '0x4ACc6ce38a319a6D0689a5eC84B6d0a39B64c475'; // 硬编码
  }

  /**
   * Handle user message and execute appropriate action
   */
  async handleMessage(message: string): Promise<string> {
    const intent = this.parseIntent(message);
    
    switch (intent.action) {
      case 'BUY':
        return await this.handleBuy(intent);
      case 'SELL':
        return await this.handleSell(intent);
      case 'VIEW_MARKET':
        return await this.handleViewMarket();
      case 'VIEW_POSITIONS':
        return await this.handleViewPositions();
      case 'APPROVE':
        return await this.handleApprove(intent);
      default:
        return this.getHelpMessage();
    }
  }

  /**
   * Parse user message to determine intent
   */
  private parseIntent(message: string): TradeIntent {
    const lowerMessage = message.toLowerCase();
    
    // Chinese patterns
    const zhBuy = lowerMessage.includes('购买') || lowerMessage.includes('买入') || lowerMessage.includes('支付');
    const zhSell = lowerMessage.includes('出售') || lowerMessage.includes('卖出') || lowerMessage.includes('平仓');
    const zhPositions = lowerMessage.includes('持仓') || lowerMessage.includes('我的');
    const zhMarket = lowerMessage.includes('市场') || lowerMessage.includes('查看');
    const zhApprove = lowerMessage.includes('批准') || lowerMessage.includes('approve');
    
    // English patterns
    const enBuy = lowerMessage.includes('buy') || lowerMessage.includes('invest');
    const enSell = lowerMessage.includes('sell') || lowerMessage.includes('close');
    const enPositions = lowerMessage.includes('position') || lowerMessage.includes('holding');
    const enMarket = lowerMessage.includes('market') || lowerMessage.includes('view');
    const enApprove = lowerMessage.includes('approve');
    
    if (zhApprove || enApprove) {
      const amount = this.extractAmount(message);
      
      return {
        action: 'APPROVE',
        amount,
      };
    }
    
    if (zhBuy || enBuy) {
      const amount = this.extractAmount(message);
      const outcome = this.extractOutcome(message);
      
      return {
        action: 'BUY',
        amount,
        outcome,
      };
    }
    
    if (zhSell || enSell) {
      const percentage = this.extractPercentage(message);
      
      return {
        action: 'SELL',
        percentage,
      };
    }
    
    if (zhPositions || enPositions) {
      return { action: 'VIEW_POSITIONS' };
    }
    
    if (zhMarket || enMarket) {
      return { action: 'VIEW_MARKET' };
    }
    
    return { action: 'VIEW_MARKET' };
  }

  private extractAmount(message: string): number | undefined {
    const match = message.match(/(\d+(?:\.\d+)?)\s*(?:token|个|pct)?/i);
    return match ? parseFloat(match[1]) : undefined;
  }

  private extractOutcome(message: string): 'YES' | 'NO' | undefined {
    // Chinese
    if (message.includes('是') || message.includes('会') || message.includes('正确') || message.includes('yes')) {
      return 'YES';
    }
    if (message.includes('否') || message.includes('不会') || message.includes('错误') || message.includes('no')) {
      return 'NO';
    }
    
    return undefined;
  }

  private extractPercentage(message: string): number | undefined {
    const match = message.match(/(\d+)%|所有 | 全部 | 全额|all|full/i);
    if (match && match[0].includes('%')) {
      return parseInt(match[1]);
    }
    if (match && (match[0] === '所有' || match[0] === '全部' || match[0] === '全额' || 
                  match[0].toLowerCase() === 'all' || match[0].toLowerCase() === 'full')) {
      return 100;
    }
    return undefined;
  }

  private async handleViewMarket(): Promise<string> {
    const endDate = new Date(HARDCODED_MARKET.endTime * 1000);
    const daysRemaining = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    return `📊 **${HARDCODED_MARKET.title}**

**截止时间**: ${endDate.toLocaleString('zh-CN')} (${daysRemaining} 天后)
**平台费用**: ${HARDCODED_MARKET.platformFeeBps / 100}%
**状态**: 活跃

💡 想参与吗？告诉我你想购买多少个 token 以及选择"是"还是"否"~
示例："购买 100 个 yes token"
或 "买入 50 个 no token"`;
  }

  private async handleViewPositions(): Promise<string> {
    return `💼 **我的持仓**

加载中... (需要连接钱包)

💡 请连接您的 X Layer 钱包以查看持仓信息`;
  }

  private async handleBuy(intent: TradeIntent): Promise<string> {
    if (!intent.amount || !intent.outcome) {
      return `❌ 请提供完整信息：
- 购买数量 (例如：100 个)
- 预测方向 (是/否)

示例："购买 100 个 yes token" 或 "买入 50 个 no token"`;
    }

    try {
      // Check if we need to approve PCT token for PPA contract
      const walletAddress = await this.wallet.getAddress();
      const requiredAmount = intent.amount;
      const allowance = await this.wallet.checkPCTAllowance(
        this.pctTokenAddress,
        walletAddress,
        this.contractAddress
      );

      if (allowance < ethers.parseEther(requiredAmount.toString())) {
        return `⚠️ **需要批准 PCT 代币**

需要先批准 PPA 合约使用您的 $PCT 代币。

请发送 "批准 PCT" 或 "approve PCT" 来进行批准操作。
需要批准的金额：${requiredAmount} $PCT
当前批准的金额：${Number(ethers.formatEther(allowance)).toFixed(2)} $PCT

或者直接发送 "批准 PCT ${requiredAmount}" 来批准指定金额。`;
      }

      const nftId = intent.outcome === 'YES' ? HARDCODED_MARKET.yesNftId : HARDCODED_MARKET.noNftId;

      return `📋 **购买确认**

市场: ${HARDCODED_MARKET.title}
方向: ${intent.outcome === 'YES' ? '是 (YES)' : '否 (NO)'}
数量: ${intent.amount} 个
平台费用: ${HARDCODED_MARKET.platformFeeBps / 100}%

⚠️ **风险提示**: 预测市场存在本金损失风险，如果预测错误可能损失全部投资

请确认是否继续？(回复"确认"或"取消")

📋 **交易参数**:
- Market Digest: \`${HARDCODED_MARKET.marketDigest}\`
- NFT ID: ${nftId} (${intent.outcome})`;
    } catch (error) {
      return `❌ **操作失败**：${error instanceof Error ? error.message : '未知错误'}`;
    }
  }

  private async handleApprove(intent: TradeIntent): Promise<string> {
    const approveAmount = intent.amount || 1000; // Default to 1000 PCT if no amount specified

    try {
      const result = await this.wallet.approvePCT(
        this.pctTokenAddress,
        this.contractAddress,
        approveAmount.toString()
      );

      if (result.status === 'success') {
        return `✅ **批准成功**

已成功批准 PPA 合约使用您的 $PCT 代币。

- 批准金额: ${approveAmount} $PCT
- 交易哈希: \`${result.txHash}\`

现在您可以继续进行购买操作了。`;
      } else {
        return `❌ **批准失败**

批准操作失败：${result.error}

请重试或联系支持团队。`;
      }
    } catch (error) {
      return `❌ **操作失败**：${error instanceof Error ? error.message : '未知错误'}`;
    }
  }

  private async handleSell(intent: TradeIntent): Promise<string> {
    const nftId = '需要指定持仓方向 (1=YES, 2=NO)';

    return `💰 **卖出确认**

市场: ${HARDCODED_MARKET.title}
卖出比例: ${intent.percentage || 100}%

⚠️ 请确认是否继续？(回复"确认"或"取消")

(注：实际卖出数量和收益将根据当前市场价格计算)

📋 **交易参数**:
- Market Digest: \`${HARDCODED_MARKET.marketDigest}\`
- NFT ID: ${nftId}`;
  }

  private getHelpMessage(): string {
    return `📚 **PPA Market Skill 使用帮助**

**支持的功能**:

1️⃣ **查看市场信息**
   - "查看市场"
   - "显示所有市场"
   - "market info"

2️⃣ **购买 token**
   - "购买 100 个 yes token"
   - "买入 50 个 no token"
   - "支付 $PCT 购买 200 个 yes token"

3️⃣ **出售 token**
   - "出售所有 token"
   - "卖出 50% 的持仓"
   - "平仓"

4️⃣ **查看持仓**
   - "我的持仓"
   - "显示我的持仓"
   - "view positions"

5️⃣ **批准 PCT 代币**
   - "批准 PCT"
   - "approve PCT"
   - "批准 PCT 1000"

**示例交互**:
- "我想购买 100 个 yes token"
- "查看 BTC2026 市场信息"
- "卖出 50% 的 no token"

💡 随时告诉我您想要执行的操作，我会引导您完成交易！`;
  }

  /**
   * Execute actual buy transaction
   */
  async buy(nftId: string): Promise<string> {
    try {
      const result = await this.wallet.executeBuy(
        this.contractAddress,
        HARDCODED_MARKET.marketDigest,
        nftId
      );
      
      if (result.status === 'success') {
        return `✅ **购买成功**
- 交易哈希: \`${result.txHash}\`
- 区块高度: ${result.blockNumber}
- Gas 使用: ${result.gasUsed}

您的 token 已成功购买并发送到钱包。`;
      } else {
        throw new Error(result.error || '购买失败');
      }
    } catch (error) {
      return `❌ **购买失败**：${error instanceof Error ? error.message : '未知错误'}`;
    }
  }

  /**
   * Execute actual sell transaction
   */
  async sell(nftId: string): Promise<string> {
    try {
      const result = await this.wallet.executeSell(
        this.contractAddress,
        HARDCODED_MARKET.marketDigest,
        nftId
      );
      
      if (result.status === 'success') {
        return `✅ **出售成功**
- 交易哈希: \`${result.txHash}\`
- 区块高度: ${result.blockNumber}
- Gas 使用: ${result.gasUsed}

您的 token 已成功出售，$PCT 代币已发送到钱包。`;
      } else {
        throw new Error(result.error || '出售失败');
      }
    } catch (error) {
      return `❌ **出售失败**：${error instanceof Error ? error.message : '未知错误'}`;
    }
  }
}
