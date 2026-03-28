---
name: "ppa-market-skill"
description: "支持支付 $PCT 代币调用 PPA 合约 buy 和 sell 接口，购买或出售 yes/no token 的 AI Skill。通过自然语言交互，用户可以直接在 AI 对话界面参与预测市场交易。"
---

# PPA Market AI Skill

## 概述

PPA Market AI Skill 是一个基于 OpenClaw 框架的 AI 技能，使用户能够通过自然语言交互直接调用 predp.red 平台的智能合约，支付 $PCT 代币购买或出售 yes/no token。

### 核心功能

- **支付 $PCT 购买 yes/no token**：支持通过 `buy` 接口购买预测市场的份额
- **出售 yes/no token 获得 $PCT**：支持通过 `sell` 接口出售持有的份额
- **智能价格计算**：价格由智能合约的 `_calcPrice` 函数自动计算
- **平台费用管理**：交易过程中自动扣除平台费用
- **多语言支持**：支持中英文双语交互

## 技术架构

### 核心组件

1. **自然语言理解层**：解析用户指令，识别购买/出售意图
2. **交易参数解析层**：提取市场 digest、NFT ID、支付金额等参数
3. **区块链交互层**：与 X Layer 区块链进行通信，调用智能合约
4. **安全验证层**：验证用户身份，管理钱包连接和授权
5. **交易执行层**：处理 buy/sell 操作，管理支付和确认

### 使用的技术

- **区块链网络**：X Layer (EVM 兼容的 L2 网络)
- **智能合约**：predp.red 的 PPA 合约 (Facet.sol)
- **支付代币**：$PCT (ERC20 代币)
- **开发框架**：Node.js + TypeScript
- **区块链库**：ethers.js
- **钱包集成**：OKX Agentic Wallet API

## 智能合约接口

### 核心方法

#### buy(digest, nftId)

```solidity
function buy(bytes32 digest, uint256 nftId) external;
```

**功能**：购买指定市场的 yes/no token

**参数**：
- `digest`：市场的唯一标识符 (bytes32)
- `nftId`：要购买的 token 的 NFT ID (yes 或 no)

**支付流程**：
1. 从用户钱包转账 $PCT 代币到合约
2. 根据当前供应计算价格
3. 自动扣除平台费用 (platformFeeBps)
4. 铸造对应的 NFT 到用户钱包

#### sell(digest, nftId)

```solidity
function sell(bytes32 digest, uint256 nftId) external;
```

**功能**：出售持有的 yes/no token

**参数**：
- `digest`：市场的唯一标识符 (bytes32)
- `nftId`：要出售的 token 的 NFT ID (yes 或 no)

**支付流程**：
1. 从用户钱包燃烧对应的 NFT
2. 根据当前供应计算价格
3. 自动扣除平台费用 (platformFeeBps)
4. 转账 $PCT 代币到用户钱包

#### getMarket(digest, targetSupply)

```solidity
function getMarket(bytes32 digest, uint256 targetSupply) external view returns (Market memory market, PriceMeta memory priceMeta);
```

**功能**：获取市场信息和价格

**参数**：
- `digest`：市场的唯一标识符 (bytes32)
- `targetSupply`：目标供应量

**返回**：
- `market`：市场详细信息
- `priceMeta`：价格元数据（当前价格、目标供应价格）

## 使用方法

### 基本命令格式

#### 购买操作

```
购买 [数量] 个 [yes/no] token
```

**示例**：
- "购买 100 个 yes token"
- "买入 50 个 no token"
- "支付 $PCT 购买 200 个 yes token"

#### 出售操作

```
出售 [市场] 的 [yes/no] token
```

**示例**：
- "出售 BTC2026 市场的 yes token"
- "卖出我持有的 no token"

#### 查看市场

```
查看 [市场] 信息
```

**示例**：
- "查看 BTC2026 市场信息"
- "显示所有市场"

### 交互示例

**用户**：我想购买 100 个 yes token

**AI**：
```
📊 **BTC 2026 年均价市场**
标题：2026年比特币(BTC)年均收盘价是否会超过10万美元？
截止时间：2026-12-31 23:59:59 UTC (2年8个月后)
当前价格：是 0.55 $PCT / 否 0.45 $PCT
平台费用：1%

⚠️ 风险提示：预测市场存在本金损失风险，如果预测错误可能损失全部投资

请确认是否继续？(回复"确认"或"取消")
```

**用户**：确认

**AI**：
```
✅ 交易成功！
- 市场：BTC2026
- 方向：yes
- 数量：100 个
- 支付金额：55 $PCT (含平台费用 0.55 $PCT)
- 交易哈希：0x123...abc
```

## 配置要求

### 固定参数（写死）

技能中已硬编码以下关键参数：

```typescript
// 市场信息
const HARDCODED_MARKET = {
  marketDigest: '0x1438dc0705c42ad47d91aa7dae2dddcd3017456c3a27b93b316c676934b28d65',
  title: '2026年比特币(BTC)年均收盘价是否会超过10万美元？',
  endTime: 1801439999, // 2026-12-31 23:59:59 UTC
  yesNftId: 1,
  noNftId: 2,
  platformFeeBps: 100, // 1%
};

// 合约地址
const CONTRACT_ADDRESSES = {
  ppa: '0xbE03338A630B948A043b5e8eA390813bF28A5Ff4',
  pct: '0x4ACc6ce38a319a6D0689a5eC84B6d0a39B64c475',
};

// X Layer 网络配置
const NETWORK_CONFIG = {
  rpcUrl: 'https://xlayerrpc.okx.com',
  chainId: 196,
};
```

### 环境变量

```bash
# OKX API 配置
OKX_API_KEY=your_api_key
OKX_SECRET_KEY=your_secret_key
OKX_PASSPHRASE=your_passphrase
```

### 依赖安装

```bash
npm install
npm run build
```

## 安全考虑

### 交易安全

1. **用户确认机制**：所有交易都需要用户明确确认
2. **智能合约验证**：调用的智能合约已通过审计
3. **交易模拟**：执行前会模拟交易，检查潜在错误
4. **价格透明**：实时显示价格和费用信息

### 风险提示

- 预测市场交易存在本金损失风险
- 市场价格可能波动较大
- 用户需要自行承担交易风险

## 错误处理

### 常见错误

1. **MarketNotExists**：市场不存在或已关闭
2. **InvalidNftId**：NFT ID 无效
3. **MarketNotEnabled**：市场未启用
4. **MarketEnded**：市场已结束
5. **PaymentTransferFailed**：支付失败

### 错误恢复

- 提供清晰的错误信息
- 指导用户如何解决问题
- 记录错误日志，便于调试

## 开发和维护

### 项目结构

```
ppa-market-skill/
├── src/
│   ├── skills/
│   │   └── ppa-skill.ts       # 核心技能实现
│   ├── utils/
│   │   ├── agentic-wallet.ts  # 钱包集成
│   │   └── config.ts          # 配置管理
│   ├── contracts/
│   │   └── abi.json           # 合约 ABI
│   └── i18n/
│       ├── zh.json            # 中文翻译
│       └── en.json            # 英文翻译
├── SKILL.md                    # 技能文档
├── package.json               # 项目配置
└── tsconfig.json              # TypeScript 配置
```

### 开发流程

1. 克隆仓库到本地
2. 安装依赖：`npm install`
3. 配置环境变量
4. 开发和调试
5. 运行测试：`npm run test`
6. 构建：`npm run build`

## 版本历史

### v1.0.0 (2026-03-29)

- 初始版本
- 支持购买 yes/no token
- 支持出售 yes/no token
- 多语言支持 (中文/英文)
- 集成 OKX Agentic Wallet

## 许可证

MIT License

## 联系方式

- 项目仓库：[GitHub 链接]
- 问题反馈：[Issues 页面]
- 支持邮箱：[support@predp.red]
