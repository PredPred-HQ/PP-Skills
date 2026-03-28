# PredP.red x402 Payment Skill

## Description

A PredP.red payment skill that supports x402 payment with USDT on X Layer. This skill enables users to interact with the PredP.red platform's payment system, purchase services, and verify transactions.

## Features

- **Payment Processing**: Handle x402 payment requests for PredP.red services
- **Service Inquiry**: Display available service packages and prices
- **Balance Check**: Verify USDT balance on X Layer
- **Transaction Verification**: Validate payment transactions using txHash
- **Multi-language Support**: Respond in both Chinese (zh) and English (en)
- **Service Selection**: Allow users to choose from Try, Love, or Host services

## Installation

1. Navigate to the skill directory:
   ```bash
   cd ./skills/predp-red-x402-payment
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

## Configuration

The skill requires configuration with PredP.red API credentials. You can configure it using environment variables or by passing options directly.

### Environment Variables

Create a `.env` file in the skill directory with the following variables:

```env
PREDPRED_API_KEY=your_api_key
PREDPRED_SECRET_KEY=your_secret_key
PREDPRED_PASSPHRASE=your_passphrase
PREDPRED_CHAIN_ID=196
PREDPRED_RECIPIENT_ADDRESS=0x779ded0c9e1022225f8e0630b35a9b54be713736
PREDPRED_SERVICE_URL=https://xlayer.predp.red
PREDPRED_LANGUAGE=zh
```

### Configuration Options

You can also configure the skill programmatically:

```typescript
import { createPredPRedX402Skill } from './src';

const skill = createPredPRedX402Skill({
  apiKey: 'your_api_key',
  secretKey: 'your_secret_key',
  passphrase: 'your_passphrase',
  chainId: 196,
  language: 'zh',
  recipientAddress: '0x779ded0c9e1022225f8e0630b35a9b54be713736',
  serviceUrl: 'https://xlayer.predp.red',
});
```

## Usage

### Basic Usage

```typescript
import { processPredPRedX402Skill } from './src';

async function main() {
  const options = {
    apiKey: 'your_api_key',
    secretKey: 'your_secret_key',
    passphrase: 'your_passphrase',
    language: 'zh',
  };

  // Example 1: Check available services
  const servicesResponse = await processPredPRedX402Skill('查看服务', options);
  console.log('Services Response:', servicesResponse);

  // Example 2: Check balance
  const balanceResponse = await processPredPRedX402Skill('查看余额', options);
  console.log('Balance Response:', balanceResponse);

  // Example 3: Purchase Love service
  const purchaseResponse = await processPredPRedX402Skill('购买 Love 服务', options);
  console.log('Purchase Response:', purchaseResponse);
}

main().catch(console.error);
```

### Available Commands

#### Service Inquiry

- Chinese: `查看服务`, `服务价格`, `购买选项`, `服务套餐`
- English: `view services`, `service prices`, `purchase options`, `service packages`

#### Balance Check

- Chinese: `查看余额`, `查询余额`, `我的余额`
- English: `check balance`, `view balance`, `my balance`

#### Purchase Services

- Chinese: `购买 Try 服务 50 USDT`, `购买 Love 服务`, `购买 Host 服务`
- English: `buy Try service 50 USDT`, `buy Love service`, `buy Host service`

#### Transaction Verification

- Chinese: `验证支付 0x123...`, `检查交易 0x123...`, `支付验证 0x123...`
- English: `verify payment 0x123...`, `check transaction 0x123...`, `payment verify 0x123...`

#### Language Switch

- `切换到中文` or `Switch to Chinese`
- `切换到英文` or `Switch to English`

## Service Packages

### Try Service (Custom Amount)

- **Price**: Custom amount in USDT
- **PCT Reward**: 1:1 ratio of USDT to $PCT
- **Description**: Supports any amount purchase, suitable for trying out
- **Example**: Buy 100 USDT gets 100 $PCT

### Love Service (Fixed Price)

- **Price**: 99 USDT
- **PCT Reward**: 200 $PCT
- **Description**: Includes all basic features, high cost-effectiveness
- **Discount**: ~2.02 $PCT per USDT

### Host Service (Fixed Price)

- **Price**: 999 USDT
- **PCT Reward**: 999 $PCT
- **Description**: For professional users, includes advanced features
- **Discount**: 1:1 ratio, with more features

## Payment Flow

1. **User Inquiry**: User asks about services or prices
2. **Service Selection**: User chooses a service package
3. **Payment Authorization**: System creates x402 payment authorization
4. **Transaction Execution**: User signs and executes the payment
5. **Verification**: System verifies the transaction and confirms purchase
6. **Delivery**: $PCT tokens are transferred to the user's wallet

## API Endpoints

The skill interacts with the following PredP.red API endpoints:

- `GET /api/x402/paymentRequired`: Get payment information for services
- `POST /api/x402/verifyPayment`: Verify payment transaction and confirm purchase

## Technology Stack

- **TypeScript**: Core implementation language
- **Node.js**: Runtime environment
- **Axios**: HTTP client for API calls
- **dotenv**: Environment variable management
- **OKX x402 Protocol**: Payment processing
- **X Layer**: Blockchain network

## Testing

To run tests:

```bash
npm run test
```

## Linting

To run linting:

```bash
npm run lint
```

## Build

To build the project:

```bash
npm run build
```

## License

MIT License

## Contributing

Contributions are welcome. Please feel free to submit a Pull Request.

## Support

For support, please contact PredP.red customer service or refer to the documentation at https://predp.red.
