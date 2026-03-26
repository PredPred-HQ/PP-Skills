/**
 * Internationalization (i18n) Configuration
 * Multi-language support for PredP.red AI Skill
 */

export type Language = 'zh' | 'en';

export interface Translation {
  // Common
  loading: string;
  error: string;
  success: string;
  confirm: string;
  cancel: string;
  
  // Actions
  viewMarket: string;
  buy: string;
  sell: string;
  viewPositions: string;
  
  // Market
  market: string;
  markets: string;
  popularMarkets: string;
  marketTitle: string;
  marketDescription: string;
  endTime: string;
  liquidity: string;
  odds: string;
  yes: string;
  no: string;
  status: string;
  active: string;
  closed: string;
  resolved: string;
  
  // Trading
  amount: string;
  direction: string;
  expectedReturn: string;
  currentOdds: string;
  riskWarning: string;
  tradeConfirmation: string;
  
  // Positions
  myPositions: string;
  position: string;
  holdings: string;
  
  // Help
  helpTitle: string;
  helpDescription: string;
  examples: string;
  
  // Messages
  marketNotFound: string;
  marketClosed: string;
  invalidAmount: string;
  insufficientBalance: string;
  transactionSuccess: string;
  transactionFailed: string;
  waitingForConfirmation: string;
  
  // Time
  days: string;
  hours: string;
  minutes: string;
  
  // Currency
  usdt: string;
  okb: string;
}

export const translations: Record<Language, Translation> = {
  zh: {
    // Common
    loading: '加载中...',
    error: '❌ 错误',
    success: '✅ 成功',
    confirm: '确认',
    cancel: '取消',
    
    // Actions
    viewMarket: '查看市场',
    buy: '买入',
    sell: '卖出',
    viewPositions: '查看持仓',
    
    // Market
    market: '市场',
    markets: '市场',
    popularMarkets: '📊 PredP.red 热门市场',
    marketTitle: '标题',
    marketDescription: '描述',
    endTime: '结束时间',
    liquidity: '流动性',
    odds: '赔率',
    yes: '是',
    no: '否',
    status: '状态',
    active: '进行中',
    closed: '已关闭',
    resolved: '已结算',
    
    // Trading
    amount: '金额',
    direction: '方向',
    expectedReturn: '预期收益',
    currentOdds: '当前赔率',
    riskWarning: '⚠️ 风险提示',
    tradeConfirmation: '✅ 交易确认',
    
    // Positions
    myPositions: '💼 我的持仓',
    position: '持仓',
    holdings: '持仓',
    
    // Help
    helpTitle: '🤖 PredP.red AI Skill',
    helpDescription: '我可以帮你',
    examples: '示例',
    
    // Messages
    marketNotFound: '❌ 无法获取市场信息',
    marketClosed: '❌ 市场已{status}，无法交易',
    invalidAmount: '❌ 金额无效',
    insufficientBalance: '❌ 余额不足',
    transactionSuccess: '🎉 交易成功',
    transactionFailed: '❌ 交易失败',
    waitingForConfirmation: '⏳ 等待确认',
    
    // Time
    days: '天',
    hours: '小时',
    minutes: '分钟',
    
    // Currency
    usdt: 'USDT',
    okb: 'OKB',
  },
  
  en: {
    // Common
    loading: 'Loading...',
    error: '❌ Error',
    success: '✅ Success',
    confirm: 'Confirm',
    cancel: 'Cancel',
    
    // Actions
    viewMarket: 'View Market',
    buy: 'Buy',
    sell: 'Sell',
    viewPositions: 'View Positions',
    
    // Market
    market: 'Market',
    markets: 'Markets',
    popularMarkets: '📊 PredP.red Popular Markets',
    marketTitle: 'Title',
    marketDescription: 'Description',
    endTime: 'End Time',
    liquidity: 'Liquidity',
    odds: 'Odds',
    yes: 'Yes',
    no: 'No',
    status: 'Status',
    active: 'Active',
    closed: 'Closed',
    resolved: 'Resolved',
    
    // Trading
    amount: 'Amount',
    direction: 'Direction',
    expectedReturn: 'Expected Return',
    currentOdds: 'Current Odds',
    riskWarning: '⚠️ Risk Warning',
    tradeConfirmation: '✅ Trade Confirmation',
    
    // Positions
    myPositions: '💼 My Positions',
    position: 'Position',
    holdings: 'Holdings',
    
    // Help
    helpTitle: '🤖 PredP.red AI Skill',
    helpDescription: 'I can help you with',
    examples: 'Examples',
    
    // Messages
    marketNotFound: '❌ Failed to get market information',
    marketClosed: '❌ Market is {status}, trading not available',
    invalidAmount: '❌ Invalid amount',
    insufficientBalance: '❌ Insufficient balance',
    transactionSuccess: '🎉 Transaction successful',
    transactionFailed: '❌ Transaction failed',
    waitingForConfirmation: '⏳ Waiting for confirmation',
    
    // Time
    days: 'days',
    hours: 'hours',
    minutes: 'minutes',
    
    // Currency
    usdt: 'USDT',
    okb: 'OKB',
  },
};

export interface I18nConfig {
  defaultLanguage: Language;
  supportedLanguages: Language[];
}

export const i18nConfig: I18nConfig = {
  defaultLanguage: 'zh',
  supportedLanguages: ['zh', 'en'],
};

export class I18nService {
  private currentLanguage: Language;
  
  constructor(language?: Language) {
    this.currentLanguage = language || i18nConfig.defaultLanguage;
  }
  
  setLanguage(language: Language): void {
    if (i18nConfig.supportedLanguages.includes(language)) {
      this.currentLanguage = language;
    } else {
      throw new Error(`Unsupported language: ${language}`);
    }
  }
  
  getLanguage(): Language {
    return this.currentLanguage;
  }
  
  t(key: keyof Translation): string {
    return translations[this.currentLanguage][key];
  }
  
  interpolate(template: string, params: Record<string, string>): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] || match;
    });
  }
}

// Export default instance
export const i18n = new I18nService();
