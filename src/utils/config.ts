/**
 * Configuration loader
 */

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  okx: z.object({
    apiKey: z.string(),
    secretKey: z.string(),
    passphrase: z.string(),
  }),
  predp: z.object({
    contractAddress: z.string(),
    pctTokenAddress: z.string(),
    serviceUrl: z.string().default('http://localhost:3001'),
  }),
  xlayer: z.object({
    rpcUrl: z.string(),
    chainId: z.number().default(196),
  }),
  ai: z.object({
    model: z.string().default('gpt-4-turbo'),
    apiKey: z.string().optional(),
  }),
});

export type Config = z.infer<typeof configSchema>;

export function loadConfig(): Config {
  const config = {
    okx: {
      apiKey: process.env.OKX_API_KEY || '',
      secretKey: process.env.OKX_SECRET_KEY || '',
      passphrase: process.env.OKX_PASSPHRASE || '',
    },
    predp: {
      contractAddress: process.env.PREDP_CONTRACT_ADDRESS || '',
      pctTokenAddress: process.env.PCT_TOKEN_ADDRESS || '',
      serviceUrl: process.env.PREDP_SERVICE_URL || 'http://localhost:3001',
    },
    xlayer: {
      rpcUrl: process.env.X_LAYER_RPC_URL || 'https://xlayerrpc.okx.com',
      chainId: 196,
    },
    ai: {
      model: process.env.AI_MODEL || 'gpt-4-turbo',
      apiKey: process.env.AI_API_KEY || '',
    },
  };

  return configSchema.parse(config);
}
