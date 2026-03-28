# PPA Market AI Skill

## 概述

PPA Market AI Skill 是一个基于 OpenClaw 框架的 AI 技能，使用户能够通过自然语言交互直接调用 predp.red 平台的智能合约，支付 $PCT 代币购买或出售 yes/no token。

## 主要特点

- **支付 $PCT 购买 yes/no token**：支持通过 `buy` 接口购买预测市场的份额
- **出售 yes/no token 获得 $PCT**：支持通过 `sell` 接口出售持有的份额
- **智能价格计算**：价格由智能合约的 `_calcPrice` 函数自动计算
- **平台费用管理**：交易过程中自动扣除平台费用
- **多语言支持**：支持中英文双语交互
- **已硬编码参数**：
  - Market Digest: `0x1438dc0705c42ad47d91aa7dae2dddcd3017456c3a27b93b316c676934b28d65`
  - PPA Contract Address: `0xbE03338A630B948A043b5e8eA390813bF28A5Ff4`
  - PCT Token Address: `0x4ACc6ce38a319a6D0689a5eC84B6d0a39B64c475`

## 安装和配置

```bash
# 进入技能目录
cd ./skills/ppa-market-skill

# 安装依赖
npm install

# 编译项目
npm run build

# 复制环境变量配置
cp .env.example .env

# 编辑 .env 填入你的 API 凭证
```

## 环境变量配置

在 `.env` 文件中配置：

```env
# OKX API Configuration (Required for OnchainOS/x402)
OKX_API_KEY=your_api_key_here
OKX_SECRET_KEY=your_secret_key_here
OKX_PASSPHRASE=your_passphrase_here

# X Layer Network Configuration
X_LAYER_RPC_URL=https://xlayerrpc.okx.com
X_LAYER_CHAIN_ID=196

# predp.red Smart Contract
PREDP_CONTRACT_ADDRESS=0xbE03338A630B948A043b5e8eA390813bF28A5Ff4  # PPA Contract
PCT_TOKEN_ADDRESS=0x4ACc6ce38a319a6D0689a5eC84B6d0a39B64c475      # PCT Token
```

## 使用方法

### 基础使用

```typescript
import { PPAMarketSkill } from './src/skills/ppa-skill';
import { loadConfig } from './src/utils/config';

const config = loadConfig();

const skill = new PPAMarketSkill({
  apiKey: config.okx.apiKey,
  secretKey: config.okx.secretKey,
  passphrase: config.okx.passphrase,
  contractAddress: config.predp.contractAddress,
  pctTokenAddress: config.predp.pctTokenAddress,
  rpcUrl: config.xlayer.rpcUrl,
  language: 'zh', // or 'en'
});

// 处理用户指令
const response = await skill.handleMessage('在市场 #123 买入 100 USDT 的是');
console.log(response);
```

### 命令示例

**Chinese / 中文**:
```
用户：查看市场信息
用户：显示市场 #123 的详细信息
用户：我有哪些持仓？
用户：在市场 #123 支付 100 PCT 的是
用户：卖出我在市场 #123 的所有份额
用户：平仓，卖出 50% 的持仓
用户：批准 PCT
用户：approve PCT 1000
```

**English**:
```
User: View market information
User: Show market #123 details
User: What are my positions?
User: Pay 100 PCT of Yes in market #123
User: Sell all my positions in market #123
User: Close position, sell 50% of holdings
User: Approve PCT
User: approve PCT 1000
```

## 技术架构

```
┌──────────────────────┐
│   OpenClaw AI        │
│    Interface         │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│  Intent Parser       │ ← AI 意图识别
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│  PPAMarketSkill      │ ← 核心交易逻辑
└──────────┬───────────┘
           │
           ├──────────────┐
           │              │
           ↓              ↓
┌──────────────────────┐ ┌──────────────────────┐
│  Agentic Wallet      │ │ Smart Contract       │
│  OKX API 集成        │ │ predp.red 合约调用   │
└──────────┬───────────┘ └──────────┬───────────┘
           │                        │
           └──────────┬─────────────┘
                      │
                      ↓
┌──────────────────────┐
│   X Layer L2         │ ← 直接交易上链
└──────────────────────┘
```

## 安全考虑

### x402 支付安全

- 使用 TEE 环境签名
- 每次交易需用户确认
- 设置支付上限

### 交易安全

- 交易前模拟
- Gas 估算和滑点保护
- 重入攻击防护

### 用户保护

- 清晰风险提示
- 交易确认步骤
- 持仓透明展示

## 测试

```bash
# 运行单元测试
npm test

# 运行特定测试
npm test -- ppa-skill.test.ts
```

## 资源

- [X Layer 文档](https://web3.okx.com/xlayer/docs)
- [OnchainOS SDK](https://github.com/okx/onchainos-skills)
- [x402 支付协议](https://docs.okx.com/x402)
- [OpenClaw 文档](https://openclaw.ai)

## 许可证

MIT
