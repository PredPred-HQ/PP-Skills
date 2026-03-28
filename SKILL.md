---
name: predp-red-x402-payment
description: This skill should be used when the user wants to purchase $PCT tokens from PredP.red platform using x402 payment protocol. Supports purchasing $PCT tokens with USDT on X Layer. Primary path signs via TEE with a wallet session (JWT); fallback path guides local EIP-3009 signing with the user's own private key if they have no wallet. Returns the payment proof (signature + authorization) that the caller can attach as a payment header to access the resource. Do NOT use for swap or token transfers — use okx-dex-swap instead. Do NOT use for wallet balance or portfolio queries — use okx-agentic-wallet or okx-wallet-portfolio. Do NOT use for security scanning — use okx-security. Do NOT use for transaction broadcasting — use okx-onchain-gateway. Do NOT use for general programming questions.
license: MIT
metadata:
  author: PredP.red
  version: 1.0.0
  homepage: https://predp.red
---

# PredP.red $PCT x402 Payment

Purchase $PCT tokens from PredP.red platform using x402 payment protocol on X Layer. Supports purchasing $PCT tokens with USDT through Try, Love, or Host services.

## Pre-flight Checks

Every time before running any onchainos command, always follow these steps in order. Do not echo routine command output to the user; only provide a brief status update when installing, updating, or handling a failure.

1. **Resolve latest stable version**: Fetch the latest stable release tag from the GitHub API:
   ```bash
   curl -sSL "https://api.github.com/repos/okx/onchainos-skills/releases/latest"
   ```

2. **Install or update**: If onchainos is not found, or if the cache at `~/.onchainos/last_check` ($env:USERPROFILE\.onchainos\last_check on Windows) is older than 12 hours:
   - Download the installer and its checksum file from the latest release tag
   - Verify the installer's SHA256 against checksums.txt
   - Execute the installer

3. **Verify binary integrity (once per session)**: Run `onchainos --version` to get the installed version, then verify the checksum.

4. **Check for skill version drift (once per session)**: If onchainos --version is newer than this skill's metadata.version, display a one-time notice.

## Skill Routing

For purchasing $PCT tokens using x402 payment on PredP.red platform.

## Chain Support

Only **X Layer Mainnet** (CAIP-2: eip155:196) is supported for $PCT purchases.

## $PCT Purchase Services

### 1. Try Service (Custom Amount)
- **Price**: Custom amount in USDT
- **$PCT Reward**: 1:1 ratio of USDT to $PCT
- **Description**: Supports any amount purchase, suitable for trying out
- **Example**: Buy 100 USDT gets 100 $PCT

### 2. Love Service (Fixed Price)
- **Price**: 99 USDT
- **$PCT Reward**: 200 $PCT
- **Description**: Includes all basic features, high cost-effectiveness
- **Discount**: ~2.02 $PCT per USDT

### 3. Host Service (Fixed Price)
- **Price**: 999 USDT
- **$PCT Reward**: 999 $PCT
- **Description**: For professional users, includes advanced features
- **Discount**: 1:1 ratio with premium features

## Background: $PCT Purchase Flow

1. User selects a service package (Try/Love/Host)
2. Server returns HTTP 402 Payment Required with x402 payload
3. User signs payment authorization via x402 skill
4. Server verifies payment and transfers $PCT tokens
5. Records transaction in database

## Quickstart

### Buy Try Service (Custom Amount)
```bash
onchainos payment x402-pay \
  --network eip155:196 \
  --amount 100000000 \
  --pay-to 0x779ded0c9e1022225f8e0630b35a9b54be713736 \
  --asset 0x779ded0c9e1022225f8e0630b35a9b54be713736 \
  --max-timeout-seconds 300
```

### Buy Love Service (Fixed Price)
```bash
onchainos payment x402-pay \
  --network eip155:196 \
  --amount 99000000 \
  --pay-to 0x779ded0c9e1022225f8e0630b35a9b54be713736 \
  --asset 0x779ded0c9e1022225f8e0630b35a9b54be713736 \
  --max-timeout-seconds 300
```

### Buy Host Service (Fixed Price)
```bash
onchainos payment x402-pay \
  --network eip155:196 \
  --amount 999000000 \
  --pay-to 0x779ded0c9e1022225f8e0630b35a9b54be713736 \
  --asset 0x779ded0c9e1022225f8e0630b35a9b54be713736 \
  --max-timeout-seconds 300
```

## Command Index

| Command | Description |
|---------|-------------|
| `onchainos payment x402-pay` | Sign an x402 payment and return the payment proof for purchasing $PCT tokens |

## Operation Flow

### Step 1: Send Purchase Request
Make a request to purchase $PCT tokens. If the response status is not 402, return the result directly — no payment needed.

```typescript
// Example purchase request
const response = await fetch('http://localhost:3001/api/x402/paymentRequired', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    service: 'love', // try, love, or host
    fromAddress: '0xYourAddress',
    amount: 99 // Only for try service
  })
})
```

### Step 2: Decode the 402 Payload
If the response is HTTP 402, the body is a base64-encoded JSON string. Decode it:

```typescript
const rawBody = await response.text();
const decoded = JSON.parse(atob(rawBody));
const paymentOption = decoded.accepts[0];
```

### Step 3: Display Payment Details and Confirm
```typescript
const amountInUIUnits = paymentOption.amount / Math.pow(10, 6); // USDT has 6 decimals
const serviceType = paymentOption.metadata?.service || 'unknown';

// Display to user:
`This resource requires payment (x402):
Network: X Layer Mainnet (eip155:196)
Token: USDT (0x779ded0c9e1022225f8e0630b35a9b54be713736)
Amount: ${amountInUIUnits} USDT
Service: ${serviceType}
Pay to: 0x779ded0c9e1022225f8e0630b35a9b54be713736

Proceed with payment? (yes / no)`
```

### Step 4: Sign Payment Authorization
Run `onchainos payment x402-pay` with the extracted parameters.

```bash
onchainos payment x402-pay \
  --network eip155:196 \
  --amount ${paymentOption.amount} \
  --pay-to ${paymentOption.payTo} \
  --asset ${paymentOption.asset} \
  [--from <address>] \
  [--max-timeout-seconds 300]
```

### Step 5: Assemble Header and Replay
Build the payment payload and replay the request:

```typescript
const { signature, authorization } = await signX402Payment(paymentOption);

// Determine payment header name based on x402 version
const headerName = decoded.x402Version >= 2 ? 'PAYMENT-SIGNATURE' : 'X-PAYMENT';
const paymentPayload = { ...decoded, payload: { signature, authorization } };
const headerValue = btoa(JSON.stringify(paymentPayload));

const finalResponse = await fetch('http://localhost:3001/api/x402/verifyPayment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    [headerName]: headerValue
  },
  body: JSON.stringify({
    txHash: '0xTransactionHash',
    fromAddress: '0xYourAddress',
    service: paymentOption.metadata?.service
  })
})
```

### Step 6: Verification and Token Transfer
Once payment is received and verified, the server will transfer $PCT tokens to the user's wallet and record the transaction in the database.

## Skill Implementation

The TypeScript implementation follows the PredP.red AI Skill architecture with multi-language support. The implementation file is at `/src/skills/x402-skill.ts`.

Key features:
- **Multi-language support**: Chinese and English
- **Intent parsing**: Recognizes purchase commands, amount extraction
- **Service selection**: Handles try, love, and host services with their respective prices
- **Payment verification**: After payment, verifies the transaction and tracks token transfer
- **Integration with Nuxt API**: Communicates with Nuxt app's API for payment processing

## Security Considerations

- **Payment validation**: Verifies actual payment amount before transferring $PCT tokens
- **Duplicate payment protection**: Prevents duplicate token transfers for the same transaction hash
- **Transaction records**: Stores all transactions in Supabase database for audit purposes
- **Error handling**: Handles payment failures and network errors gracefully

## Error Handling

- **Network errors**: Retry mechanism with exponential backoff
- **Payment failures**: Handles declined payments, insufficient funds, etc.
- **Transaction verification**: Checks if transaction has been processed before
- **Wallet session management**: Handles expired wallet sessions and re-login flow

## Local Signing Fallback

If the user does not have a wallet or chooses local signing, guide them through EIP-3009 signing with their own private key.

## Skill Routing

For all $PCT token purchase queries, use this skill. For other operations:
- **Wallet management**: Use `okx-agentic-wallet`
- **Balance checks**: Use `okx-wallet-portfolio`
- **Swap or transfers**: Use `okx-dex-swap`
- **Security checks**: Use `okx-security`
