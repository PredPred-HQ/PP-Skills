/**
 * Internationalization (i18n) Support for PredP.red Skill
 * 
 * This module provides internationalization support for the PredP.red Skill,
 * allowing it to communicate in both Chinese and English.
 */

export type Language = 'zh' | 'en';

export interface TranslationKey {
  // Common
  error: string;
  success: string;
  helpTitle: string;
  helpDescription: string;
  
  // Services
  services: string;
  try: string;
  love: string;
  host: string;
  customAmount: string;
  fixedPrice: string;
  
  // Payment
  buy: string;
  purchase: string;
  price: string;
  amount: string;
  payTo: string;
  paymentRequired: string;
  paymentAuthorized: string;
  paymentVerified: string;
  paymentFailed: string;
  
  // Wallet
  balance: string;
  checkBalance: string;
  walletAddress: string;
  
  // Instructions
  howToBuy: string;
  selectService: string;
  enterAmount: string;
  confirmPurchase: string;
  transaction: string;
  transactionSuccess: string;
  transactionFailed: string;
  txHash: string;
  
  // Error messages
  invalidAmount: string;
  insufficientBalance: string;
  serviceNotFound: string;
  paymentCancelled: string;
  networkError: string;
  serverError: string;
  unknownError: string;
}

const zh: TranslationKey = {
  // Common
  error: '错误',
  success: '成功',
  helpTitle: '帮助',
  helpDescription: '这是一个帮助您购买 $PCT 代币的 AI Skill，支持使用 x402 支付协议。',
  
  // Services
  services: '服务套餐',
  try: 'Try 服务',
  love: 'Love 服务',
  host: 'Host 服务',
  customAmount: '自定义金额',
  fixedPrice: '固定价格',
  
  // Payment
  buy: '购买',
  purchase: '购买',
  price: '价格',
  amount: '金额',
  payTo: '收款人地址',
  paymentRequired: '需要支付',
  paymentAuthorized: '支付已授权',
  paymentVerified: '支付已验证',
  paymentFailed: '支付失败',
  
  // Wallet
  balance: '余额',
  checkBalance: '查看余额',
  walletAddress: '钱包地址',
  
  // Instructions
  howToBuy: '如何购买',
  selectService: '请选择服务套餐',
  enterAmount: '请输入购买金额',
  confirmPurchase: '确认购买',
  transaction: '交易',
  transactionSuccess: '交易成功',
  transactionFailed: '交易失败',
  txHash: '交易哈希',
  
  // Error messages
  invalidAmount: '无效的金额',
  insufficientBalance: '余额不足',
  serviceNotFound: '未找到服务',
  paymentCancelled: '支付已取消',
  networkError: '网络错误',
  serverError: '服务器错误',
  unknownError: '未知错误'
};

const en: TranslationKey = {
  // Common
  error: 'Error',
  success: 'Success',
  helpTitle: 'Help',
  helpDescription: 'This is an AI Skill that helps you buy $PCT tokens using the x402 payment protocol.',
  
  // Services
  services: 'Service Packages',
  try: 'Try Service',
  love: 'Love Service',
  host: 'Host Service',
  customAmount: 'Custom Amount',
  fixedPrice: 'Fixed Price',
  
  // Payment
  buy: 'Buy',
  purchase: 'Purchase',
  price: 'Price',
  amount: 'Amount',
  payTo: 'Pay To',
  paymentRequired: 'Payment Required',
  paymentAuthorized: 'Payment Authorized',
  paymentVerified: 'Payment Verified',
  paymentFailed: 'Payment Failed',
  
  // Wallet
  balance: 'Balance',
  checkBalance: 'Check Balance',
  walletAddress: 'Wallet Address',
  
  // Instructions
  howToBuy: 'How to Buy',
  selectService: 'Please select a service package',
  enterAmount: 'Please enter purchase amount',
  confirmPurchase: 'Confirm Purchase',
  transaction: 'Transaction',
  transactionSuccess: 'Transaction Success',
  transactionFailed: 'Transaction Failed',
  txHash: 'Transaction Hash',
  
  // Error messages
  invalidAmount: 'Invalid amount',
  insufficientBalance: 'Insufficient balance',
  serviceNotFound: 'Service not found',
  paymentCancelled: 'Payment cancelled',
  networkError: 'Network error',
  serverError: 'Server error',
  unknownError: 'Unknown error'
};

export class I18nService {
  private language: Language;
  private translations: { [key in Language]: TranslationKey } = { zh, en };

  constructor(language: Language = 'zh') {
    this.language = language;
  }

  setLanguage(language: Language): void {
    this.language = language;
  }

  getLanguage(): Language {
    return this.language;
  }

  t(key: keyof TranslationKey): string {
    return this.translations[this.language][key];
  }

  getTranslations(): TranslationKey {
    return this.translations[this.language];
  }
}
