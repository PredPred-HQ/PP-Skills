/**
 * Configuration Management for PredP.red Skill
 * 
 * This module provides configuration management functionality for the PredP.red Skill.
 * It handles environment variables, API keys, and other configuration options.
 */

import * as dotenv from 'dotenv';

// Load environment variables from .env file if present
dotenv.config();

export interface PredPRedConfig {
  // API configuration
  apiUrl: string;
  timeout: number;
  
  // Wallet configuration
  apiKey: string;
  secretKey: string;
  passphrase: string;
  chainId: number;
  
  // Payment configuration
  recipientAddress: string;
  usdtTokenAddress: string;
  pctTokenAddress: string;
  
  // Environment configuration
  environment: 'development' | 'production' | 'test';
  debug: boolean;
}

// Default configuration
const defaultConfig: PredPRedConfig = {
  apiUrl: 'https://xlayer.predp.red',
  timeout: 10000,
  
  apiKey: '',
  secretKey: '',
  passphrase: '',
  chainId: 196, // X Layer Mainnet
  
  recipientAddress: '0x779ded0c9e1022225f8e0630b35a9b54be713736',
  usdtTokenAddress: '0x779ded0c9e1022225f8e0630b35a9b54be713736',
  pctTokenAddress: '0x779ded0c9e1022225f8e0630b35a9b54be713736',
  
  environment: 'development',
  debug: false
};

// Create a singleton instance of the config
class Config {
  private static instance: PredPRedConfig;

  static getInstance(): PredPRedConfig {
    if (!Config.instance) {
      Config.instance = {
        ...defaultConfig,
        ...Config.getEnvironmentVariables()
      };
    }
    
    return Config.instance;
  }

  private static getEnvironmentVariables(): Partial<PredPRedConfig> {
    const env = process.env;
    
    return {
      apiUrl: env.PREDPR_RED_API_URL || defaultConfig.apiUrl,
      timeout: parseInt(env.PREDPR_RED_TIMEOUT || defaultConfig.timeout.toString()),
      
      apiKey: env.PREDPR_RED_API_KEY || '',
      secretKey: env.PREDPR_RED_SECRET_KEY || '',
      passphrase: env.PREDPR_RED_PASSPHRASE || '',
      chainId: parseInt(env.PREDPR_RED_CHAIN_ID || defaultConfig.chainId.toString()),
      
      recipientAddress: env.PREDPR_RED_RECIPIENT_ADDRESS || defaultConfig.recipientAddress,
      usdtTokenAddress: env.PREDPR_RED_USDT_TOKEN_ADDRESS || defaultConfig.usdtTokenAddress,
      pctTokenAddress: env.PREDPR_RED_PCT_TOKEN_ADDRESS || defaultConfig.pctTokenAddress,
      
      environment: (env.PREDPR_RED_ENVIRONMENT as 'development' | 'production' | 'test') || 'development',
      debug: (env.PREDPR_RED_DEBUG === 'true') || false
    };
  }

  static updateConfig(newConfig: Partial<PredPRedConfig>): PredPRedConfig {
    Config.instance = {
      ...Config.getInstance(),
      ...newConfig
    };
    
    return Config.instance;
  }

  static resetConfig(): PredPRedConfig {
    Config.instance = {
      ...defaultConfig,
      ...Config.getEnvironmentVariables()
    };
    
    return Config.instance;
  }
}

export default Config;
