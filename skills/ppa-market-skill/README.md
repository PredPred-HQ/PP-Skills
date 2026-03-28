# PPA Market AI Skill

PPA Market AI Skill 是一个基于 OpenClaw 框架的 AI 技能，允许用户通过自然语言交互直接调用 predp.red 平台上的 PPA 智能合约，使用 $PCT 代币购买或出售 yes/no token。

## 功能特性

### 核心功能

- **购买 yes/no token**：支持支付 $PCT 代币购买预测市场的 yes 或 no token
- **出售 yes/no token**：支持出售持有的 yes 或 no token，获得 $PCT 代币
- **市场信息查询**：提供市场信息、截止时间、费用等详细信息
- **智能合约交互**：与 predp.red 平台的 PPA 智能合约直接交互
- **风险提示**：在购买前显示风险提示，提醒用户注意风险

### 技术特性

- **硬编码参数**：技能已预配置以下关键参数：
  - Market Digest: `0x1438dc0705c42ad47d91aa7dae2dddcd3017456c3a27b93b316c676934b28d65`
  - PPA Contract Address: `0xbE03338A630B948A043b5e8eA390813bF28A5Ff4`
  - PCT Token Address: `0x4ACc6ce38a319a6D0689a5eC84B6d0a39B64c475`

- **支持的网络**：X Layer (Chain ID: 196)
- **费用结构**：平台费用为 10%

## 安装和配置

### 1. 安装依赖

```bash
cd /path/to/ppa-market-skill
npm install
npm run build
```

### 2. 配置环境变量

将 `.env.example` 文件复制到 `.env` 并填入您的 OKX API 密钥：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```bash
# OKX API Configuration
OKX_API_KEY=your-api-key-here
OKX_SECRET_KEY=your-secret-key-here
OKX_PASSPHRASE=your-passphrase-here
```

## 使用方法

### 启动技能

```bash
cd /path/to/ppa-market-skill
node dist/index.js "您的命令"
```

### 常用命令

#### 查看市场信息

```bash
node dist/index.js "查看市场信息"
```

#### 购买 yes/no token

```bash
node dist/index.js "购买 100 个 yes token"
node dist/index.js "买入 50 个 no token"
node dist/index.js "支付 $PCT 购买 200 个 yes token"
```

#### 出售 yes/no token

```bash
node dist/index.js "出售所有 token"
node dist/index.js "卖出 50% 的持仓"
node dist/index.js "平仓"
```

#### 批准 PCT 代币

在首次购买前，您需要批准 PPA 合约使用您的 $PCT 代币：

```bash
node dist/index.js "批准 PCT"
node dist/index.js "approve PCT"
node dist/index.js "批准 PCT 1000"
```

#### 查看帮助信息

```bash
node dist/index.js "帮助"
node dist/index.js "help"
```

## 技能结构

```
ppa-market-skill/
├── src/
│   ├── skills/
│   │   └── ppa-skill.ts          # 核心技能类
│   ├── utils/
│   │   ├── agentic-wallet.ts    # 与 OKX Agentic Wallet 集成的工具
│   │   └── config.ts           # 配置管理
│   └── __tests__/
│       └── ppa-skill.test.ts   # 测试文件
├── dist/                        # 编译输出目录
├── SKILL.md                     # 技能详细文档
├── README.md                    # 项目说明
├── package.json                 # 项目依赖
├── tsconfig.json                # TypeScript 配置
├── skill.json                   # 技能配置
└── .env.example                 # 环境变量示例
```

## 技术架构

### 核心组件

1. **PPAMarketSkill 类**：技能的核心实现，处理用户指令和交易流程
2. **AgenticWallet 类**：与 OKX Agentic Wallet 集成，负责交易签名和广播
3. **配置管理**：使用 Zod 验证配置，确保技能正常运行
4. **硬编码参数**：技能已预配置关键参数，简化用户使用

### 交易流程

1. 用户发送自然语言指令
2. 技能解析指令，提取意图和参数
3. 验证用户配置和授权状态
4. 显示确认信息和风险提示
5. 执行智能合约交易
6. 显示交易结果

## 注意事项

1. **风险提示**：预测市场存在本金损失风险，请谨慎参与
2. **网络连接**：需要可靠的网络连接和 X Layer 访问
3. **OKX API 密钥**：需要有效的 OKX API 密钥才能使用
4. **授权过程**：首次购买需要批准 PPA 合约使用您的 $PCT 代币
5. **测试环境**：建议先在测试网络上测试功能

## 开发

### 运行测试

```bash
cd /path/to/ppa-market-skill
npm run test
```

### 代码结构

- 技能核心实现：`src/skills/ppa-skill.ts`
- 测试文件：`src/__tests__/ppa-skill.test.ts`
- 配置管理：`src/utils/config.ts`
- 与 OKX Agentic Wallet 集成：`src/utils/agentic-wallet.ts`

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系项目维护团队。
