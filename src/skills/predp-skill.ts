/**
 * PredP.red AI Skill - Core Implementation
 * Multi-language support (Chinese & English)
 */

import { ethers } from 'ethers';
import { OnchainOS } from '@okx/onchainos-sdk';
import PREDP_ABI from '../contracts/predp-abi.json' assert { type: 'json' };
import { I18nService, Language } from '../i18n';
import { AgenticWallet } from '../utils/agentic-wallet';

export interface PredPSkillOptions {
  apiKey: string;
  secretKey: string;
  passphrase: string;
  contractAddress: string;
  pctTokenAddress: string;
  rpcUrl?: string;
  chainId?: number;
  language?: Language;
}

export interface MarketInfo {
  id: string;
  title: string;
  description: string;
  endTime: number;
  totalLiquidity: bigint;
  yesOdds: number;
  noOdds: number;
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
  action: 'BUY' | 'SELL' | 'VIEW_MARKET' | 'VIEW_POSITIONS';
  marketId?: string;
  amount?: number;
  outcome?: 'YES' | 'NO';
  percentage?: number;
}

export class PredPSkill {
  private provider: ethers.Provider;
  private contract: ethers.Contract;
  private onchainOS: OnchainOS;
  private agenticWallet: AgenticWallet;
  private options: PredPSkillOptions;
  private i18n: I18nService;

  constructor(options: PredPSkillOptions) {
    this.options = options;
    this.i18n = new I18nService(options.language || 'zh');
    
    this.provider = new ethers.JsonRpcProvider(options.rpcUrl || 'https://xlayerrpc.okx.com');
    this.contract = new ethers.Contract(options.contractAddress, PREDP_ABI, this.provider);
    
    this.onchainOS = new OnchainOS({
      apiKey: options.apiKey,
      secretKey: options.secretKey,
      passphrase: options.passphrase,
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
        case 'VIEW_MARKET':
          return this.handleViewMarket(intent);
        case 'VIEW_POSITIONS':
          return this.handleViewPositions();
        case 'BUY':
          return this.handleBuy(intent);
        case 'SELL':
          return this.handleSell(intent);
        default:
          return this.getHelpMessage();
      }
    } catch (error) {
      const t = this.i18n;
      return `${t.t('error')}：${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  private parseIntent(message: string): TradeIntent {
    const lowerMessage = message.toLowerCase();
    
    // Chinese patterns
    const zhBuy = lowerMessage.includes('买入') || lowerMessage.includes('买') || lowerMessage.includes('投资');
    const zhSell = lowerMessage.includes('卖出') || lowerMessage.includes('卖') || lowerMessage.includes('平仓');
    const zhPositions = lowerMessage.includes('持仓') || lowerMessage.includes('我的');
    const zhMarket = lowerMessage.includes('市场') || lowerMessage.includes('查看');
    
    // English patterns
    const enBuy = lowerMessage.includes('buy') || lowerMessage.includes('invest');
    const enSell = lowerMessage.includes('sell') || lowerMessage.includes('close');
    const enPositions = lowerMessage.includes('position') || lowerMessage.includes('holding');
    const enMarket = lowerMessage.includes('market') || lowerMessage.includes('view');
    
    if (zhBuy || enBuy) {
      const marketId = this.extractMarketId(message);
      const amount = this.extractAmount(message);
      const outcome = this.extractOutcome(message);
      
      return {
        action: 'BUY',
        marketId,
        amount,
        outcome,
      };
    }
    
    if (zhSell || enSell) {
      const marketId = this.extractMarketId(message);
      const percentage = this.extractPercentage(message);
      
      return {
        action: 'SELL',
        marketId,
        percentage,
      };
    }
    
    if (zhPositions || enPositions) {
      return { action: 'VIEW_POSITIONS' };
    }
    
    if (zhMarket || enMarket) {
      const marketId = this.extractMarketId(message);
      return {
        action: 'VIEW_MARKET',
        marketId,
      };
    }
    
    return { action: 'VIEW_MARKET' };
  }

  private extractMarketId(message: string): string | undefined {
    // Match both Chinese and English patterns
    const match = message.match(/(?:market|市场)\s*[#＃]?(\d+)/i);
    return match ? match[1] : undefined;
  }

  private extractAmount(message: string): number | undefined {
    const match = message.match(/(\d+(?:\.\d+)?)\s*(?:usdt|u|刀|块|元|dollars?)?/i);
    return match ? parseFloat(match[1]) : undefined;
  }

  private extractOutcome(message: string): 'YES' | 'NO' | undefined {
    // Chinese
    if (message.includes('是') || message.includes('会') || message.includes('正确')) {
      return 'YES';
    }
    if (message.includes('否') || message.includes('不会') || message.includes('错误')) {
      return 'NO';
    }
    
    // English
    if (message.toLowerCase().includes('yes') || message.toLowerCase().includes('will')) {
      return 'YES';
    }
    if (message.toLowerCase().includes('no') || message.toLowerCase().includes('not')) {
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

  private async handleViewMarket(intent: TradeIntent): Promise<string> {
    const t = this.i18n;
    
    if (!intent.marketId) {
      return this.getPopularMarkets();
    }

    try {
      const marketInfo = await this.getMarketInfo(intent.marketId);
      const isZh = t.getLanguage() === 'zh';
      
      return `📊 **${t.t('market')} #${marketInfo.id}**

**${t.t('marketTitle')}**: ${marketInfo.title}
**${t.t('marketDescription')}**: ${marketInfo.description}
**${t.t('endTime')}**: ${new Date(marketInfo.endTime * 1000).toLocaleString(isZh ? 'zh-CN' : 'en-US')}
**${t.t('liquidity')}**: $${ethers.formatEther(marketInfo.totalLiquidity)}
**${t.t('odds')}**: 
  - ${t.t('yes')} (YES): ${marketInfo.yesOdds}x
  - ${t.t('no')} (NO): ${marketInfo.noOdds}x
**${t.t('status')}**: ${t.t(marketInfo.status.toLowerCase() as any)}

💡 ${isZh ? '想参与吗？告诉我你想投资多少 USDT 以及选择"是"还是"否"~' : 'Want to participate? Tell me how much USDT you want to invest and choose "Yes" or "No"~'}`;
    } catch (error) {
      return `${t.t('marketNotFound')}：${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  private async getPopularMarkets(): Promise<string> {
    const t = this.i18n;
    const isZh = t.getLanguage() === 'zh';
    
    if (isZh) {
      return `📊 **PredP.red 热门市场**

🔥 **市场 #123**: 比特币本周能否突破 100K?
   - 当前赔率：是 1.8x / 否 2.2x
   - 流动性：$50,000
   - 截止时间：3 天后
   - 参与人数：1,234

🔥 **市场 #456**: 以太坊 ETF 本月获批？
   - 当前赔率：是 3.5x / 否 1.3x
   - 流动性：$30,000
   - 截止时间：7 天后
   - 参与人数：892

🔥 **市场 #789**: 美联储下月降息？
   - 当前赔率：是 2.1x / 否 1.7x
   - 流动性：$45,000
   - 截止时间：14 天后
   - 参与人数：1,567

💡 想参与哪个市场？告诉我市场编号和你想投资的金额~`;
    } else {
      return `📊 **PredP.red Popular Markets**

🔥 **Market #123**: Will Bitcoin break $100K this week?
   - Current Odds: Yes 1.8x / No 2.2x
   - Liquidity: $50,000
   - Ends in: 3 days
   - Participants: 1,234

🔥 **Market #456**: Will Ethereum ETF be approved this month?
   - Current Odds: Yes 3.5x / No 1.3x
   - Liquidity: $30,000
   - Ends in: 7 days
   - Participants: 892

🔥 **Market #789**: Will Fed cut rates next month?
   - Current Odds: Yes 2.1x / No 1.7x
   - Liquidity: $45,000
   - Ends in: 14 days
   - Participants: 1,567

💡 Which market do you want to participate in? Tell me the market number and your investment amount~`;
    }
  }

  private async handleViewPositions(): Promise<string> {
    const t = this.i18n;
    const isZh = t.getLanguage() === 'zh';
    
    return `💼 **${t.t('myPositions')}**

${isZh ? '加载中... (需要连接钱包)' : 'Loading... (Wallet connection required)'}

💡 ${isZh ? '请连接您的 X Layer 钱包以查看持仓信息' : 'Please connect your X Layer wallet to view positions'}`;
  }

  private async handleBuy(intent: TradeIntent): Promise<string> {
    const t = this.i18n;
    const isZh = t.getLanguage() === 'zh';
    
    if (!intent.marketId || !intent.amount || !intent.outcome) {
      if (isZh) {
        return `❌ 请提供完整信息：
- 市场编号 (例如：#123)
- 投资金额 (例如：100 USDT)
- 预测方向 (是/否)

示例："在市场 #123 买入 100 USDT 的是"`;
      } else {
        return `❌ Please provide complete information:
- Market number (e.g., #123)
- Investment amount (e.g., 100 USDT)
- Prediction direction (Yes/No)

Example: "Buy 100 USDT of Yes in market #123"`;
      }
    }

    try {
      const marketInfo = await this.getMarketInfo(intent.marketId);
      
      if (marketInfo.status !== 'ACTIVE') {
        return t.interpolate(t.t('marketClosed'), { 
          status: t.t(marketInfo.status.toLowerCase() as any) 
        });
      }

      const expectedReturn = intent.amount * (intent.outcome === 'YES' ? marketInfo.yesOdds : marketInfo.noOdds);
      
      // Generate digest and nftId (simplified for demo)
      const digest = ethers.keccak256(ethers.toUtf8Bytes(`market_${intent.marketId}_${Date.now()}`));
      const nftId = ethers.toBigInt(intent.outcome === 'YES' ? `1000${intent.marketId}` : `2000${intent.marketId}`);

      if (isZh) {
        return `${t.t('tradeConfirmation')}

${t.t('market')}: ${marketInfo.title} (#${intent.marketId})
${t.t('direction')}: ${intent.outcome === 'YES' ? '是 (YES)' : '否 (NO)'}
${t.t('amount')}: ${intent.amount} ${t.t('usdt')}
${t.t('currentOdds')}: ${intent.outcome === 'YES' ? marketInfo.yesOdds : marketInfo.noOdds}x
${t.t('expectedReturn')}: ${expectedReturn.toFixed(2)} ${t.t('usdt')} (${isZh ? '如果预测正确' : 'if prediction is correct'})

⚠️ **${t.t('riskWarning')}**: ${isZh ? '预测市场存在本金损失风险，如果预测错误可能损失全部投资' : 'Prediction markets carry risk of loss, you may lose your entire investment if prediction is wrong'}

${isZh ? '请确认是否继续？(回复"确认"或"取消")' : 'Please confirm to continue? (Reply "Confirm" or "Cancel")'}

(Digest: ${digest.substring(0, 10)}... | NFT ID: ${nftId})`;
      } else {
        return `${t.t('tradeConfirmation')}

${t.t('market')}: ${marketInfo.title} (#${intent.marketId})
${t.t('direction')}: ${intent.outcome === 'YES' ? 'Yes (YES)' : 'No (NO)'}
${t.t('amount')}: ${intent.amount} ${t.t('usdt')}
${t.t('currentOdds')}: ${intent.outcome === 'YES' ? marketInfo.yesOdds : marketInfo.noOdds}x
${t.t('expectedReturn')}: ${expectedReturn.toFixed(2)} ${t.t('usdt')} (${isZh ? 'if prediction is correct' : 'if prediction is correct'})

⚠️ **${t.t('riskWarning')}**: Prediction markets carry risk of loss, you may lose your entire investment if prediction is wrong

Please confirm to continue? (Reply "Confirm" or "Cancel")

(Digest: ${digest.substring(0, 10)}... | NFT ID: ${nftId})`;
      }
    } catch (error) {
      return `${t.t('error')}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  private async handleSell(intent: TradeIntent): Promise<string> {
    const t = this.i18n;
    const isZh = t.getLanguage() === 'zh';
    
    if (!intent.marketId) {
      if (isZh) {
        return `❌ 请提供市场编号

示例："卖出市场 #123 的所有持仓"`;
      } else {
        return `❌ Please provide market number

Example: "Sell all positions in market #123"`;
      }
    }

    // Generate digest and nftId (simplified for demo)
    const digest = ethers.keccak256(ethers.toUtf8Bytes(`market_${intent.marketId}_${Date.now()}`));
    const nftId = ethers.toBigInt(`1000${intent.marketId}`);

    if (isZh) {
      return `💰 **卖出确认**

${t.t('market')}: #${intent.marketId}
${isZh ? '卖出比例' : 'Sell percentage'}: ${intent.percentage || 100}%

⚠️ ${isZh ? '请确认是否继续？(回复"确认"或"取消")' : 'Please confirm to continue? (Reply "Confirm" or "Cancel")'}

(${isZh ? '注：实际卖出数量和收益将根据当前市场价格计算' : 'Note: Actual sell amount and proceeds will be calculated based on current market price'})

(Digest: ${digest.substring(0, 10)}... | NFT ID: ${nftId})`;
    } else {
      return `💰 **Sell Confirmation**

${t.t('market')}: #${intent.marketId}
Sell percentage: ${intent.percentage || 100}%

⚠️ Please confirm to continue? (Reply "Confirm" or "Cancel")

(Note: Actual sell amount and proceeds will be calculated based on current market price)

(Digest: ${digest.substring(0, 10)}... | NFT ID: ${nftId})`;
    }
  }

  private getHelpMessage(): string {
    const t = this.i18n;
    const isZh = t.getLanguage() === 'zh';
    
    if (isZh) {
      return `${t.t('helpTitle')}

${t.t('helpDescription')}:

1️⃣ **${t.t('viewMarket')}**
   - "查看 predp.red 热门市场"
   - "显示市场 #123 的详细信息"

2️⃣ **${t.t('buy')}**
   - "在市场 #123 买入 100 USDT 的是"
   - "我想投资这个预测，买 50 块"

3️⃣ **${t.t('sell')}**
   - "卖出我在市场 #123 的所有份额"
   - "平仓，卖出 50% 的持仓"

4️⃣ **${t.t('viewPositions')}**
   - "我有哪些持仓？"
   - "显示我的投资组合"

💡 随时告诉我你想做什么，我会引导你完成交易~

---

**语言切换**: 发送 "Switch to English" 或 "切换到英文"`;
    } else {
      return `${t.t('helpTitle')}

${t.t('helpDescription')}:

1️⃣ **${t.t('viewMarket')}**
   - "View predp.red popular markets"
   - "Show market #123 details"

2️⃣ **${t.t('buy')}**
   - "Buy 100 USDT of Yes in market #123"
   - "I want to invest in this prediction"

3️⃣ **${t.t('sell')}**
   - "Sell all my positions in market #123"
   - "Close position, sell 50% of holdings"

4️⃣ **${t.t('viewPositions')}**
   - "What are my positions?"
   - "Show my portfolio"

💡 Tell me what you want to do anytime, I will guide you through the trade~

---

**Language Switch**: Send "Switch to Chinese" or "切换到中文"`;
    }
  }

  async getMarketInfo(marketId: string): Promise<MarketInfo> {
    try {
      const marketData = await this.contract.getMarketInfo(marketId);
      
      return {
        id: marketId,
        title: marketData.title,
        description: marketData.description,
        endTime: Number(marketData.endTime),
        totalLiquidity: marketData.totalLiquidity,
        yesOdds: Number(marketData.yesOdds) / 1000,
        noOdds: Number(marketData.noOdds) / 1000,
        status: ['ACTIVE', 'CLOSED', 'RESOLVED'][marketData.status] as any,
      };
    } catch (error) {
      const t = this.i18n;
      throw new Error(`${t.t('error')} - Market #${marketId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async buy(digest: string, nftId: string): Promise<string> {
    try {
      const result = await this.agenticWallet.executeBuy(
        this.options.contractAddress,
        digest,
        nftId,
        this.options.pctTokenAddress
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

  async sell(digest: string, nftId: string): Promise<string> {
    try {
      const result = await this.agenticWallet.executeSell(
        this.options.contractAddress,
        digest,
        nftId
      );
      
      const t = this.i18n;
      if (result.status === 'success') {
        return `${t.t('success')} - ${t.t('transactionSuccess')}: ${result.txHash}`;
      } else {
        throw new Error(result.error || t.t('transactionFailed'));
      }
    } catch (error) {
      const t = this.i18n;
      throw new Error(`${t.t('error')} - ${t.t('sell')}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
