#!/usr/bin/env node
/**
 * PPA Market AI Skill - Main Entry Point
 * Handles CLI commands and initializes the skill
 */

import { config } from 'dotenv';
import { PPAMarketSkill } from './skills/ppa-skill';
import { loadConfig } from './utils/config';

// Load environment variables from .env file
config();

async function main() {
  try {
    // Load and validate configuration
    const skillConfig = loadConfig();
    
    // Initialize the PPA Market Skill
    const skill = new PPAMarketSkill({
      apiKey: skillConfig.okx.apiKey,
      secretKey: skillConfig.okx.secretKey,
      passphrase: skillConfig.okx.passphrase,
      rpcUrl: skillConfig.xlayer.rpcUrl,
      chainId: skillConfig.xlayer.chainId,
    });
    
    // Handle CLI commands
    if (process.argv.length > 2) {
      const command = process.argv.slice(2).join(' ');
      const response = await skill.handleMessage(command);
      console.log(response);
    } else {
      // If no command specified, show help
      console.log('PPA Market AI Skill');
      console.log('Usage: node dist/index.js <command>');
      console.log('');
      console.log('Example commands:');
      console.log('  node dist/index.js "查看市场信息"');
      console.log('  node dist/index.js "购买 100 个 yes token"');
      console.log('  node dist/index.js "批准 PCT 1000"');
      console.log('');
      console.log('For more information, see the SKILL.md documentation');
    }
  } catch (error) {
    console.error('Error initializing PPA Market AI Skill:');
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('Unknown error occurred');
    }
    process.exit(1);
  }
}

// Execute the main function
main().catch(console.error);
