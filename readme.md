# X Layer Hackathon - PredP.red AI Skill

🤖 **AI-Powered Prediction Market Trading Assistant**  
🤖 **AI 驱动的预测市场交易助手**

基于 x402 支付协议的 AI Skill，让用户在 OpenClaw 中通过自然语言即可交易 predp.red 去中心化预测市场。

AI Skill with x402 payment integration, enabling users to trade on predp.red decentralized prediction market through natural language in OpenClaw.

---

## 🌐 Language / 语言设置

**默认语言 / Default Language**: 中文 (Chinese)

**切换语言 / Switch Language**:
- 发送 "Switch to English" 切换到英文
- 发送 "切换到中文" 切换到中文

**环境变量 / Environment Variable**:
```bash
# 设置语言 / Set language
export LANGUAGE=en  # English
export LANGUAGE=zh  # 中文
```

---

## ⚡ Quick Start / 快速开始

### Prerequisites / 前置条件

- Node.js >= 18.x
- OKX API Credentials / OKX API 凭证
- X Layer Wallet / X Layer 钱包
- OpenClaw Environment / OpenClaw 环境

### Installation / 安装

```bash
# Install dependencies / 安装依赖
npm install

# Copy environment configuration / 复制环境变量配置
cp .env.example .env

# Edit .env and fill in your API credentials / 编辑 .env 填入你的 API 凭证
```

### Configuration / 配置

Configure in `.env` file / 在 `.env` 文件中配置：

```env
# OKX API Credentials (Required for OnchainOS/x402)
OKX_API_KEY=your_api_key_here
OKX_SECRET_KEY=your_secret_key_here
OKX_PASSPHRASE=your_passphrase_here

# X Layer Network Configuration
X_LAYER_RPC_URL=https://xlayerrpc.okx.com
X_LAYER_CHAIN_ID=196

# predp.red Smart Contract
PREDP_CONTRACT_ADDRESS=0xYourContractAddressHere
PCT_TOKEN_ADDRESS=0xYourPctTokenAddressHere
PREDP_SERVICE_URL=https://xlayer.predp.red

# AI Model Configuration (optional)
AI_MODEL=gpt-4-turbo
AI_API_KEY=your_ai_api_key_here

# Development Mode
NODE_ENV=development
```

---

## 📖 Features / 功能特性

### 1. 预测市场交易 (PredPSkill)

**Chinese / 中文**:
```
用户：查看 predp.red 热门市场
用户：显示市场 #123 的详细信息
用户：我有哪些持仓？
用户：在市场 #123 买入 100 USDT 的"是"份额
用户：卖出我在市场 #123 的所有份额
用户：平仓，卖出 50% 的持仓
```

**English**:
```
User: View predp.red popular markets
User: Show market #123 details
User: What are my positions?
User: Buy 100 USDT of Yes in market #123
User: Sell all my positions in market #123
User: Close position, sell 50% of holdings
```

### 2. $PCT 购买支付 (X402Skill)

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

### 3. AI Enhancement / AI 增强

- **Chinese**: 市场洞察和趋势分析、风险评估和提示、收益计算、智能市场推荐
- **English**: Market insights and trend analysis, Risk assessment and warnings, Profit calculation, Smart market recommendations

### 4. 多语言支持

- **默认语言**: 中文 (Chinese)
- **支持切换**: 发送 "Switch to English" 或 "切换到英文" 切换到英文
- **环境变量**: 设置 `LANGUAGE=en` 或 `LANGUAGE=zh`

## 🏗️ 技术架构

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
           ├──────────────┐
           │              │
           ↓              ↓
┌──────────────────────┐ ┌──────────────────────┐
│  PredPSkill          │ │  X402Skill           │
│  预测市场交易处理    │ │  $PCT 购买支付处理   │
└──────────┬───────────┘ └──────────┬───────────┘
           │                        │
           └──────────┬─────────────┘
                      │
                      ↓
┌──────────────────────┐
│  Agentic Wallet      │ ← OKX API 集成
└──────────┬───────────┘
           │
           ├──────────────┐
           │              │
           ↓              ↓
┌──────────────────────┐ ┌──────────────────────┐
│  x402 Payment        │ │ Smart Contract       │
│  x402 支付协议       │ │ predp.red 合约调用   │
└──────────┬───────────┘ └──────────┬───────────┘
           │                        │
           └──────────┬─────────────┘
                      │
                      ↓
┌──────────────────────┐
│   X Layer L2         │ ← 交易上链
└──────────────────────┘
```

## 💻 使用示例

### 基础使用

```typescript
import { PredPSkill } from './src/skills/predp-skill';
import { loadConfig } from './src/utils/config';

const config = loadConfig();

const skill = new PredPSkill({
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

### x402 Payment Skill 使用

```typescript
import { X402Skill } from './src/skills/x402-skill';
import { loadConfig } from './src/utils/config';

const config = loadConfig();

const skill = new X402Skill({
  apiKey: config.okx.apiKey,
  secretKey: config.okx.secretKey,
  passphrase: config.okx.passphrase,
  rpcUrl: config.xlayer.rpcUrl,
  pctTokenAddress: config.predp.pctTokenAddress,
  serviceUrl: config.predp.serviceUrl,
  language: 'zh', // or 'en'
});

// 处理用户购买 $PCT 指令
const response = await skill.handleMessage('购买 100 USDT 的 PCT');
console.log(response);
```

### 作为 OpenClaw Skill

```bash
# 在 OpenClaw 中加载
npx skills add okx/onchainos-skills
```

然后在对话中使用：

```
/predp 查看热门市场
/predp 买入市场 123 100 USDT 是
/x402 购买 100 USDT 的 PCT
/x402 查看服务套餐
```

## 🔧 API 参考

### PredPSkill 类

#### constructor(options)

初始化 Skill 实例

```typescript
interface PredPSkillOptions {
  apiKey: string;
  secretKey: string;
  passphrase: string;
  contractAddress: string;
  pctTokenAddress: string;
  rpcUrl?: string;
  chainId?: number;
  language?: 'zh' | 'en';
}
```

#### handleMessage(message: string): Promise<string>

处理用户消息并返回响应

#### getMarketInfo(marketId: string): Promise<MarketInfo>

获取市场详细信息

#### buy(marketId: string, amount: number, outcome: 'YES' | 'NO'): Promise<string>

执行买入操作，返回交易 Hash

#### sell(marketId: string, amount: number): Promise<string>

执行卖出操作，返回交易 Hash

#### getUserPositions(address: string): Promise<Position[]>

获取用户持仓信息

### X402Skill 类

#### constructor(options)

初始化 x402 支付 Skill 实例

```typescript
interface X402SkillOptions {
  apiKey: string;
  secretKey: string;
  passphrase: string;
  rpcUrl?: string;
  chainId?: number;
  language?: Language;
  recipientAddress?: string; // x402 payment recipient address
  pctTokenAddress?: string; // $PCT token contract address
  usdtTokenAddress?: string; // USDT token contract address on X Layer
  serviceUrl?: string; // predp.red service URL
}
```

#### handleMessage(message: string): Promise<string>

处理用户购买 $PCT 的消息并返回响应

#### buyPCT(amount: number): Promise<string>

购买指定金额的 $PCT (1:1 ratio of USDT to $PCT)

#### buyLovePackage(): Promise<string>

购买 Love 套餐：固定 99 USDT → 200 $PCT

#### buyHostPackage(): Promise<string>

购买 Host 套餐：固定 999 USDT → 999 $PCT

#### checkBalance(): Promise<string>

检查用户 USDT 和 $PCT 余额

## 📝 交易流程

### Buy 流程

```
1. 用户指令 → "在市场 #123 买入 100 USDT 的是"
   ↓
2. 意图解析 → 提取 marketId, amount, outcome
   ↓
3. 参数验证 → 检查市场状态、金额格式
   ↓
4. x402 授权 → 签名支付授权
   ↓
5. 合约调用 → 调用 predp.red.buy()
   ↓
6. 交易广播 → 发送到 X Layer
   ↓
7. 返回结果 → 交易 Hash + 确认信息
```

### Sell 流程

```
1. 用户指令 → "卖出市场 #123 的所有持仓"
   ↓
2. 查询持仓 → 获取可卖出数量
   ↓
3. 计算收益 → 预估收益和滑点
   ↓
4. 用户确认 → 展示详细信息
   ↓
5. x402 授权 → 签名支付授权
   ↓
6. 合约调用 → 调用 predp.red.sell()
   ↓
7. 交易广播 → 发送到 X Layer
   ↓
8. 返回结果 → 交易 Hash + 收益信息
```

## 🛡️ 安全考虑

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

## 🧪 测试

```bash
# 运行单元测试
npm test

# 运行特定测试
npm test -- buy.test.ts

# 端到端测试
npm run test:e2e
```

## 📚 资源

- [X Layer 文档](https://web3.okx.com/xlayer/docs)
- [OnchainOS SDK](https://github.com/okx/onchainos-skills)
- [x402 支付协议](https://docs.okx.com/x402)
- [OpenClaw 文档](https://openclaw.ai)

## 🏆 比赛信息

**赛道**: Agentic Payment / 链上支付场景

**技术栈**:
- X Layer (OKX Layer 2)
- x402 Payment Protocol
- OnchainOS Skills API
- OpenClaw AI Framework

**核心功能**:
- ✅ x402 支付集成
- ✅ 智能合约交互
- ✅ AI 自然语言界面
- ✅ 实时交易追踪

## 📄 License

MIT
