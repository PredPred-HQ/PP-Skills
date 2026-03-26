/**
 * PredP.red AI Skill - Main Entry Point
 * 
 * AI-powered trading assistant for predp.red prediction market
 * with x402 payment integration on X Layer
 * 
 * 多语言支持 / Multi-language Support: 中文 (Chinese) & English
 */

import { PredPSkill } from './skills/predp-skill.js';
import { loadConfig } from './utils/config.js';
import { Language } from './i18n/index.js';

async function main() {
  const config = loadConfig();
  
  // Detect language from environment or default to Chinese
  const envLanguage = process.env.LANGUAGE || process.env.LANG || 'zh';
  const language: Language = envLanguage.includes('zh') ? 'zh' : 'en';
  
  const skill = new PredPSkill({
    apiKey: config.okx.apiKey,
    secretKey: config.okx.secretKey,
    passphrase: config.okx.passphrase,
    contractAddress: config.predp.contractAddress,
    rpcUrl: config.xlayer.rpcUrl,
    language: language,
  });

  console.log('🚀 PredP.red AI Skill initialized');
  console.log('🌐 Language / 语言:', language.toUpperCase());
  console.log('Ready to process commands...');
  console.log('\nExample commands / 示例命令:');
  console.log('  - 查看 predp.red 热门市场 / View predp.red popular markets');
  console.log('  - 在市场 #123 买入 100 USDT 的是 / Buy 100 USDT of Yes in market #123');
  console.log('  - 卖出市场 #123 的所有持仓 / Sell all positions in market #123');
  console.log('  - Switch to English / 切换到英文');
  console.log('  - Switch to Chinese / 切换到中文\n');

  if (process.argv.length > 2) {
    const command = process.argv.slice(2).join(' ');
    
    // Handle language switch commands
    if (command.toLowerCase().includes('switch to english') || command.includes('切换到英文')) {
      skill.setLanguage('en');
      console.log('Language switched to English / 语言已切换为英文\n');
    } else if (command.toLowerCase().includes('switch to chinese') || command.includes('切换到中文')) {
      skill.setLanguage('zh');
      console.log('Language switched to Chinese / 语言已切换为中文\n');
    }
    
    console.log(`Processing / 处理：${command}`);
    const response = await skill.handleMessage(command);
    console.log('\nResponse / 响应:', response);
  }
}

main().catch(console.error);
