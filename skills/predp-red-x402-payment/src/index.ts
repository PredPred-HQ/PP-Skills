import { X402Skill, X402SkillOptions } from './skills/x402-skill';

/**
 * PredP.red x402 Payment Skill
 * 
 * This module exports the PredP.red x402 Payment Skill for use in AI applications.
 * It provides a simple interface to interact with the PredP.red platform's x402 payment endpoints.
 */

// Default configuration options
const defaultOptions: Partial<X402SkillOptions> = {
  chainId: 196, // X Layer default
  language: 'zh', // Default to Chinese
  recipientAddress: '0x779ded0c9e1022225f8e0630b35a9b54be713736',
  serviceUrl: 'https://xlayer.predp.red',
};

/**
 * Creates and initializes a new instance of the PredP.red x402 Payment Skill
 * 
 * @param options Configuration options for the skill
 * @returns Initialized X402Skill instance
 */
export function createPredPRedX402Skill(options: X402SkillOptions): X402Skill {
  // Merge user-provided options with default values
  const mergedOptions: X402SkillOptions = {
    ...defaultOptions,
    ...options,
  } as X402SkillOptions;

  // Validate required options
  if (!mergedOptions.apiKey || !mergedOptions.secretKey || !mergedOptions.passphrase) {
    throw new Error('API key, secret key, and passphrase are required for PredP.red x402 Payment Skill');
  }

  return new X402Skill(mergedOptions);
}

/**
 * Main entry point for the PredP.red x402 Payment Skill
 * 
 * This function is typically called by the AI application to process user requests
 * related to PredP.red's x402 payment functionality.
 * 
 * @param message User's input message
 * @param options Configuration options for the skill
 * @returns Processed response from the skill
 */
export async function processPredPRedX402Skill(
  message: string,
  options: X402SkillOptions
): Promise<string> {
  const skill = createPredPRedX402Skill(options);
  return await skill.handleMessage(message);
}

// Export types for TypeScript support
export { X402Skill, X402SkillOptions } from './skills/x402-skill';
export type { PurchaseIntent } from './skills/x402-skill';
export { Language } from './i18n';
export { X402Payment, PaymentAuthorization } from './utils/x402-payment';
export { AgenticWallet } from './utils/agentic-wallet';
export type { PredPRedConfig } from './utils/config';

// Export as default for easy import
export default {
  createPredPRedX402Skill,
  processPredPRedX402Skill,
  X402Skill,
};
