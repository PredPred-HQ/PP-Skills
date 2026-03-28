/**
 * Configuration management module
 * Handles loading and validation of skill configuration
 */

import { config } from 'dotenv';
import { z } from 'zod';

// Load environment variables
config();

// Configuration schema
const ConfigSchema = z.object({
  // OKX API configuration
  okx: z.object({
    apiKey: z.string().min(1, 'OKX API Key is required'),
    secretKey: z.string().min(1, 'OKX Secret Key is required'),
    passphrase: z.string().min(1, 'OKX Passphrase is required'),
  }),
  
  // X Layer configuration
  xlayer: z.object({
    rpcUrl: z.string().url().default('https://xlayerrpc.okx.com'),
    chainId: z.number().default(196),
  }),
  
  // Contract addresses (hardcoded)
  predp: z.object({
    contractAddress: z.string().default('0xbE03338A630B948A043b5e8eA390813bF28A5Ff4'),
    pctTokenAddress: z.string().default('0x4ACc6ce38a319a6D0689a5eC84B6d0a39B64c475'),
  }),
});

// Hardcoded market configuration (as requested)
export const HARDCODED_MARKET = {
  marketDigest: '0x1438dc0705c42ad47d91aa7dae2dddcd3017456c3a27b93b316c676934b28d65',
  title: '2026年比特币(BTC)年均收盘价是否会超过10万美元？',
  titleEn: 'Will the annual average closing price of Bitcoin (BTC) in 2026 exceed $100,000?',
  endTime: 1801439999, // 2026-12-31 23:59:59 UTC
  yesNftId: 1,
  noNftId: 2,
  platformFeeBps: 100, // 1%
};

// Load and validate configuration
export function loadConfig() {
  try {
    const config = ConfigSchema.parse({
      okx: {
        apiKey: process.env.OKX_API_KEY,
        secretKey: process.env.OKX_SECRET_KEY,
        passphrase: process.env.OKX_PASSPHRASE,
      },
      xlayer: {
        rpcUrl: process.env.XLAYER_RPC_URL,
        chainId: process.env.XLAYER_CHAIN_ID ? parseInt(process.env.XLAYER_CHAIN_ID) : undefined,
      },
      predp: {
        contractAddress: process.env.PPA_CONTRACT_ADDRESS,
        pctTokenAddress: process.env.PCT_TOKEN_ADDRESS,
      },
    });
    
    return config;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Configuration validation error:', error.issues);
    } else {
      console.error('Error loading configuration:', error);
    }
    process.exit(1);
  }
}
