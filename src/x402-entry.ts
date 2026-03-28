#!/usr/bin/env node

/**
 * PredP.red x402 Payment Skill - Main Entry Point
 * 
 * AI-powered x402 payment assistant for purchasing $PCT tokens
 * on X Layer
 * 
 * 多语言支持 / Multi-language Support: 中文 (Chinese) & English
 */

import { X402Skill } from './skills/x402-skill';
import { loadConfig } from './utils/config';
import { Language } from './i18n/index';

async function main() {
  const config = loadConfig();
  
  // Detect language from environment or default to Chinese
  const envLanguage = process.env.LANGUAGE || process.env.LANG || 'zh';
  const language: Language = envLanguage.includes('zh') ? 'zh' : 'en';
  
  const skill = new X402Skill({
    apiKey: config.okx.apiKey,
    secretKey: config.okx.secretKey,
    passphrase: config.okx.passphrase,
    recipientAddress: config.predp.contractAddress, // 使用合约地址作为默认接收地址
    pctTokenAddress: config.predp.pctTokenAddress,
    rpcUrl: config.xlayer.rpcUrl,
    chainId: config.xlayer.chainId,
    language: language,
    serviceUrl: config.predp.serviceUrl, // 添加服务 URL 配置
  });

  console.log('🚀 PredP.red x402 Payment Skill initialized');
  console.log('🌐 Language / 语言:', language.toUpperCase());
  console.log('📡 Service URL / 服务地址:', config.predp.serviceUrl);
  console.log('Ready to process commands...');
  console.log('\nExample commands / 示例命令:');
  console.log('  - 购买 Love 服务 / Buy Love service');
  console.log('  - 购买 Try 服务 50 USDT / Buy Try service 50 USDT');
  console.log('  - 查看我的钱包余额 / Check my wallet balance');
  console.log('  - 验证支付 0xabc123... / Verify payment 0xabc123...');
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