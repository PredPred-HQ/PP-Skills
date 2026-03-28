# PredP.red x402 Payment AI Skill

## 概述

PredP.red x402 Payment AI Skill 是一个基于 OpenClaw 框架的 AI 技能，使用户能够通过自然语言交互在 X Layer 上使用 USDT 进行 x402 支付，购买 predp.red 平台的服务和 $PCT 代币。

## 主要特点

- **支持 x402 支付处理**：使用 x402 协议进行安全的支付
- **提供服务查询功能**：支持查询可用的服务套餐
- **支持余额检查**：可以检查 USDT 和 $PCT 余额
- **支付交易验证**：验证支付交易的状态
- **中英文双语支持**：提供中英文两种语言版本
- **服务套餐**：
  - Try 服务：自定义金额购买，1:1 比例获得 $PCT
  - Love 服务：99 USDT 购买 200 $PCT（约 2.02 倍）
  - Host 服务：999 USDT 购买 999 $PCT（1:1 比例）

## 安装和配置

```bash
# 进入技能目录
cd /Users/stark/Desktop/PP/xlayer-hackathon/skills/predp-red-x402-payment

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

# Service Configuration
PREDP_SERVICE_URL=https://xlayer.predp.red
```

## 使用方法

### 基础使用

```typescript
import { X402Skill } from './src/skills/x402-skill';
import { loadConfig } from './src/utils/config';

const config = loadConfig();

const skill = new X402Skill({
  apiKey: config.okx.apiKey,
  secretKey: config.okx.secretKey,
  passphrase: config.okx.passphrase,
  rpcUrl: config.xlayer.rpcUrl,
  chainId: config.xlayer.chainId,
  language: 'zh', // or 'en'
  serviceUrl: config.predp.serviceUrl,
  pctTokenAddress: config.predp.pctTokenAddress,
});

// 处理用户指令
const response = await skill.handleMessage('购买 100 USDT 的 PCT');
console.log(response);
```

### 命令示例

**Chinese / 中文**:
```
用户：购买 100 USDT 的 PCT
用户：查看服务套餐
用户：买 Love 套餐
用户：购买 Host 服务
用户：检查我的余额
```

**English**:
```
User: Buy 100 USDT of PCT
User: View service plans
User: Buy Love package
User: Purchase Host service
User: Check my balance
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
│  X402Skill           │ ← 核心交易逻辑
└──────────┬───────────┘
           │
           ├──────────────┐
           │              │
           ↓              ↓
┌──────────────────────┐ ┌──────────────────────┐
│  Agentic Wallet      │ │ x402 Payment Protocol│
│  OKX API 集成        │ │ 链上支付协议        │
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
npm test -- x402-skill.test.ts
```

## 资源

- [X Layer 文档](https://web3.okx.com/xlayer/docs)
- [OnchainOS SDK](https://github.com/okx/onchainos-skills)
- [x402 支付协议](https://docs.okx.com/x402)
- [OpenClaw 文档](https://openclaw.ai)

## 许可证

MIT
