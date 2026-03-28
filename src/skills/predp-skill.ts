/**
 * PredP.red AI Skill - Core Implementation
 * Multi-language support (Chinese & English)
 */

import { ethers } from 'ethers';
import PREDP_ABI from '../contracts/predp-abi.json';
import { I18nService, Language } from '../i18n';
import { AgenticWallet } from '../utils/agentic-wallet';

// Hardcoded market data
const HARDCODED_MARKET = {
  digest: '0x1438dc0705c42ad47d91aa7dae2dddcd3017456c3a27b93b316c676934b28d65',
  createdAt: 1711670400000, // 2024-03-29
  title: 'Will the annual average closing price of Bitcoin (BTC) in 2026 exceed $100,000?',
  titleZh: '2026年比特币(BTC)年均收盘价是否会超过10万美元？',
  description: `Daily closing price definition: The daily closing price from CoinGecko's market chart API at https://www.coingecko.com/en/apidocumentation (close price in the prices array).
The final average will be precise to 2 decimal places (e.g., $100,234.56).
Specific API request (CoinGecko):
https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=usd&from=1767225600&to=1801439999
Calculation method: Take the arithmetic average (simple average, unweighted) of all daily closing prices from 00:00:00 GMT+0000 on January 1, 2026 (UNIX timestamp: 1767225600) to 23:59:59 GMT+0000 on December 31, 2026 (UNIX timestamp: 1801439999).

Yes: Wins if the annual average price of BTC in 2026 is ≥ $100,000.
No: Wins if the annual average price of BTC in 2026 is < $100,000.
Boundary handling: $100,000 is inclusive (i.e., ≥100k = Yes), avoiding disputes over decimal points.

Anti-manipulation mechanisms:
1. 365-day smoothing: Using annual average ensures single-day manipulation has <0.3% impact.
2. Data anomaly detection: If daily price shows abnormal fluctuation (>30% in single day), exclude that data point.
3. UTC standard: All times in UTC to avoid timezone manipulation.

If the source data shows obvious anomalies (such as clear errors or missing values >5 days), the final settlement value will be determined by community vote.`,
  descriptionZh: `每日收盘价定义：来自 CoinGecko 市场图表 API 的每日收盘价（prices 数组中的收盘价）。
最终平均值精确到小数点后2位（例如：$100,234.56）。
CoinGecko API 请求：
https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=usd&from=1767225600&to=1801439999
计算方法：取2026年1月1日00:00:00 GMT+0000（UNIX时间戳：1767225600）至2026年12月31日23:59:59 GMT+0000（UNIX时间戳：1801439999）所有每日收盘价的算术平均值（简单平均，无加权）。

是(Yes)：如果2026年BTC年均价格 ≥ $100,000 则获胜。
否(No)：如果2026年BTC年均价格 < $100,000 则获胜。
边界处理：$100,000 为包含边界（即 ≥100k = Yes），避免小数点争议。

防操纵机制：
1. 365天平滑：使用年均价确保单日操纵影响 <0.3%。
2. 数据异常检测：如果单日价格出现异常波动（>30%），排除该数据点。
3. UTC标准：所有时间使用UTC，避免时区操纵。

如果源数据出现明显异常（如明显错误或缺失值超过5天），最终结算值将由社区投票决定。`,
  endTime: 1801439999, // 2026-12-31 23:59:59 UTC
  yesOdds: 1.85,
  noOdds: 2.15,
  totalLiquidity: ethers.parseEther('100000'), // $100,000
  status: 'ACTIVE' as const,
};

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
  private agenticWallet: AgenticWallet;
  private options: PredPSkillOptions;
  private i18n: I18nService;

  constructor(options: PredPSkillOptions) {
    this.options = options;
    this.i18n = new I18nService(options.language || 'zh');
    
    this.provider = new ethers.JsonRpcProvider(options.rpcUrl || 'https://xlayerrpc.okx.com');
    this.contract = new ethers.Contract(options.contractAddress, PREDP_ABI, this.provider);

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
      const isHardcodedMarket = marketInfo.id === HARDCODED_MARKET.digest;
      const endDate = new Date(marketInfo.endTime * 1000);
      const daysRemaining = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

      return `📊 **${t.t('market')}**

**${t.t('marketTitle')}**: ${marketInfo.title}

**${t.t('marketDescription')}**:
${marketInfo.description}

**${t.t('endTime')}**: ${endDate.toLocaleString(isZh ? 'zh-CN' : 'en-US')} (${daysRemaining} ${isZh ? '天后' : 'days remaining'})
**${t.t('liquidity')}**: $${ethers.formatEther(marketInfo.totalLiquidity)}
**${t.t('odds')}**:
  - ${t.t('yes')} (YES): ${marketInfo.yesOdds}x
  - ${t.t('no')} (NO): ${marketInfo.noOdds}x
**${t.t('status')}**: ${t.t(marketInfo.status.toLowerCase() as any)}
${isHardcodedMarket ? `**Digest**: \`${HARDCODED_MARKET.digest}\`` : ''}

💡 ${isZh ? '想参与吗？告诉我你想投资多少 USDT 以及选择"是"还是"否"~' : 'Want to participate? Tell me how much USDT you want to invest and choose "Yes" or "No"~'}
${isZh ? '示例："买入 100 USDT 的是"' : 'Example: "Buy 100 USDT of Yes"'}`;
    } catch (error) {
      return `${t.t('marketNotFound')}：${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  private async getPopularMarkets(): Promise<string> {
    const t = this.i18n;
    const isZh = t.getLanguage() === 'zh';
    const endDate = new Date(HARDCODED_MARKET.endTime * 1000);
    const daysRemaining = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    if (isZh) {
      return `📊 **PredP.red 热门市场**

🔥 **BTC 2026 年均价市场**
   - **标题**: ${HARDCODED_MARKET.titleZh}
   - 当前赔率：是 ${HARDCODED_MARKET.yesOdds}x / 否 ${HARDCODED_MARKET.noOdds}x
   - 流动性：$${ethers.formatEther(HARDCODED_MARKET.totalLiquidity)}
   - 截止时间：${daysRemaining} 天后 (${endDate.toLocaleDateString('zh-CN')})
   - Digest: \`${HARDCODED_MARKET.digest.substring(0, 18)}...\`

📝 **市场描述**:
${HARDCODED_MARKET.descriptionZh.split('\n').slice(0, 3).join('\n')}
...

💡 想参与这个市场？告诉我你想投资多少 USDT 以及选择"是"还是"否"
   示例："买入 100 USDT 的是" 或 "buy 50 USDT yes"`;
    } else {
      return `📊 **PredP.red Popular Markets**

🔥 **BTC 2026 Annual Average Market**
   - **Title**: ${HARDCODED_MARKET.title}
   - Current Odds: Yes ${HARDCODED_MARKET.yesOdds}x / No ${HARDCODED_MARKET.noOdds}x
   - Liquidity: $${ethers.formatEther(HARDCODED_MARKET.totalLiquidity)}
   - Ends in: ${daysRemaining} days (${endDate.toLocaleDateString('en-US')})
   - Digest: \`${HARDCODED_MARKET.digest.substring(0, 18)}...\`

📝 **Market Description**:
${HARDCODED_MARKET.description.split('\n').slice(0, 3).join('\n')}
...

💡 Want to participate? Tell me how much USDT and choose "Yes" or "No"
   Example: "Buy 100 USDT of Yes" or "买入 50 USDT 的否"`;
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

    // Default to hardcoded BTC market if no market specified
    if (!intent.marketId) {
      intent.marketId = 'btc2026';
    }

    if (!intent.amount || !intent.outcome) {
      if (isZh) {
        return `❌ 请提供完整信息：
- 投资金额 (例如：100 USDT)
- 预测方向 (是/否)

示例："买入 100 USDT 的是" 或 "buy 50 yes"`;
      } else {
        return `❌ Please provide complete information:
- Investment amount (e.g., 100 USDT)
- Prediction direction (Yes/No)

Example: "Buy 100 USDT of Yes" or "买入 50 的否"`;
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

      // Use hardcoded digest for BTC market, otherwise generate
      const isHardcodedMarket = marketInfo.id === HARDCODED_MARKET.digest;
      const digest = isHardcodedMarket
        ? HARDCODED_MARKET.digest
        : ethers.keccak256(ethers.toUtf8Bytes(`market_${intent.marketId}_${Date.now()}`));
      const nftId = intent.outcome === 'YES' ? '1' : '2';

      const marketTitle = isZh ? HARDCODED_MARKET.titleZh : marketInfo.title;

      if (isZh) {
        return `${t.t('tradeConfirmation')}

${t.t('market')}: ${marketTitle}
${t.t('direction')}: ${intent.outcome === 'YES' ? '是 (YES)' : '否 (NO)'}
${t.t('amount')}: ${intent.amount} ${t.t('usdt')}
${t.t('currentOdds')}: ${intent.outcome === 'YES' ? marketInfo.yesOdds : marketInfo.noOdds}x
${t.t('expectedReturn')}: ${expectedReturn.toFixed(2)} ${t.t('usdt')} (如果预测正确)

⚠️ **${t.t('riskWarning')}**: 预测市场存在本金损失风险，如果预测错误可能损失全部投资

请确认是否继续？(回复"确认"或"取消")

📋 **交易参数**:
- Digest: \`${digest}\`
- NFT ID: ${nftId} (${intent.outcome})`;
      } else {
        return `${t.t('tradeConfirmation')}

${t.t('market')}: ${marketInfo.title}
${t.t('direction')}: ${intent.outcome === 'YES' ? 'Yes (YES)' : 'No (NO)'}
${t.t('amount')}: ${intent.amount} ${t.t('usdt')}
${t.t('currentOdds')}: ${intent.outcome === 'YES' ? marketInfo.yesOdds : marketInfo.noOdds}x
${t.t('expectedReturn')}: ${expectedReturn.toFixed(2)} ${t.t('usdt')} (if prediction is correct)

⚠️ **${t.t('riskWarning')}**: Prediction markets carry risk of loss, you may lose your entire investment if prediction is wrong

Please confirm to continue? (Reply "Confirm" or "Cancel")

📋 **Trade Parameters**:
- Digest: \`${digest}\`
- NFT ID: ${nftId} (${intent.outcome})`;
      }
    } catch (error) {
      return `${t.t('error')}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  private async handleSell(intent: TradeIntent): Promise<string> {
    const t = this.i18n;
    const isZh = t.getLanguage() === 'zh';

    // Default to hardcoded BTC market if no market specified
    if (!intent.marketId) {
      intent.marketId = 'btc2026';
    }

    // Use hardcoded digest for BTC market
    const isHardcodedMarket = intent.marketId.toLowerCase().includes('btc') ||
                              intent.marketId === 'btc2026';
    const digest = isHardcodedMarket
      ? HARDCODED_MARKET.digest
      : ethers.keccak256(ethers.toUtf8Bytes(`market_${intent.marketId}_${Date.now()}`));

    const marketTitle = isZh ? HARDCODED_MARKET.titleZh : HARDCODED_MARKET.title;

    if (isZh) {
      return `💰 **卖出确认**

${t.t('market')}: ${marketTitle}
卖出比例: ${intent.percentage || 100}%

⚠️ 请确认是否继续？(回复"确认"或"取消")

(注：实际卖出数量和收益将根据当前市场价格计算)

📋 **交易参数**:
- Digest: \`${digest}\`
- NFT ID: 需要指定持仓方向 (1=YES, 2=NO)`;
    } else {
      return `💰 **Sell Confirmation**

${t.t('market')}: ${HARDCODED_MARKET.title}
Sell percentage: ${intent.percentage || 100}%

⚠️ Please confirm to continue? (Reply "Confirm" or "Cancel")

(Note: Actual sell amount and proceeds will be calculated based on current market price)

📋 **Trade Parameters**:
- Digest: \`${digest}\`
- NFT ID: Please specify position direction (1=YES, 2=NO)`;
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
    const isZh = this.i18n.getLanguage() === 'zh';

    // Check if requesting the hardcoded market (by digest prefix or "btc" keyword)
    if (marketId.toLowerCase().includes('btc') ||
        marketId.toLowerCase().includes('bitcoin') ||
        HARDCODED_MARKET.digest.toLowerCase().includes(marketId.toLowerCase()) ||
        marketId === 'btc2026') {
      return {
        id: HARDCODED_MARKET.digest,
        title: isZh ? HARDCODED_MARKET.titleZh : HARDCODED_MARKET.title,
        description: isZh ? HARDCODED_MARKET.descriptionZh : HARDCODED_MARKET.description,
        endTime: HARDCODED_MARKET.endTime,
        totalLiquidity: HARDCODED_MARKET.totalLiquidity,
        yesOdds: HARDCODED_MARKET.yesOdds,
        noOdds: HARDCODED_MARKET.noOdds,
        status: HARDCODED_MARKET.status,
      };
    }

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
