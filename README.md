# PredP.red AI Skills

PredP.red AI Skills 是一组基于 OpenClaw 框架的 AI 技能，允许用户通过自然语言交互直接访问和使用 predp.red 平台的功能。

## 技能列表

### 1. ppa-market-skill

**功能**：支持支付 $PCT 代币调用 PPA 合约 buy 和 sell 接口，购买或出售 yes/no token 的 AI Skill。通过自然语言交互，用户可以直接在 AI 对话界面参与预测市场交易。

**主要特点**：
- 支持支付 $PCT 购买 yes/no token
- 支持出售 yes/no token 获得 $PCT
- 价格由智能合约的 `_calcPrice` 函数自动计算
- 交易过程中自动扣除平台费用
- 支持中英文双语交互
- 已硬编码以下关键参数：
  - Market Digest: `0x1438dc0705c42ad47d91aa7dae2dddcd3017456c3a27b93b316c676934b28d65`
  - PPA Contract Address: `0xbE03338A630B948A043b5e8eA390813bF28A5Ff4`
  - PCT Token Address: `0x4ACc6ce38a319a6D0689a5eC84B6d0a39B64c475`

**详细文档**：[ppa-market-skill/SKILL.md](ppa-market-skill/SKILL.md)

---

### 2. predp-red-x402-payment

**功能**：PredP.red 支付技能，支持在 X Layer 上使用 USDT 进行 x402 支付。该技能使用户能够与 PredP.red 平台的支付系统交互，购买服务并验证交易。

**主要特点**：
- 支持 x402 支付处理
- 提供服务查询功能
- 支持余额检查
- 支付交易验证
- 中英文双语支持
- 提供以下服务套餐：
  - Try 服务：自定义金额购买，1:1 比例获得 $PCT
  - Love 服务：99 USDT 购买 200 $PCT（约 2.02 倍）
  - Host 服务：999 USDT 购买 999 $PCT（1:1 比例）

**详细文档**：[predp-red-x402-payment/SKILL.md](predp-red-x402-payment/SKILL.md)

---

## 安装和配置

### 1. 安装依赖

```bash
# 进入技能目录
cd ./skills/[skill-name]

# 安装依赖
npm install

# 编译项目
npm run build
```

### 2. 配置环境变量

创建 `.env` 文件并填入以下内容：

```env
# OKX API Configuration
OKX_API_KEY=your_api_key
OKX_SECRET_KEY=your_secret_key
OKX_PASSPHRASE=your_passphrase

# Optional configurations
RPC_URL=https://xlayerrpc.okx.com
CHAIN_ID=196
```

---

## 使用方法

### 1. 启动技能

```bash
# 进入技能目录
cd ./skills/[skill-name]

# 启动技能（使用中文）
node dist/index.js "查看市场信息"

# 或使用英文
node dist/index.js "view market info"
```

### 2. 交互示例

#### 使用 ppa-market-skill

```bash
# 查看市场信息
node dist/index.js "查看市场信息"

# 购买 100 个 yes token
node dist/index.js "购买 100 个 yes token"

# 批准 PCT 代币
node dist/index.js "批准 PCT 1000"

# 查看帮助
node dist/index.js "帮助"
```

#### 使用 predp-red-x402-payment

```bash
# 查看服务信息
node dist/index.js "查看服务"

# 购买 Love 服务（99 USDT）
node dist/index.js "购买 Love 服务"

# 查看余额
node dist/index.js "查看余额"

# 验证支付
node dist/index.js "验证支付 0xabc123..."
```

---

## 开发和维护

### 项目结构

```
./skills/
├── ppa-market-skill/
│   ├── src/
│   │   ├── skills/
│   │   │   └── ppa-skill.ts
│   │   ├── utils/
│   │   │   ├── agentic-wallet.ts
│   │   │   └── config.ts
│   │   ├── __tests__/
│   │   │   └── ppa-skill.test.ts
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── SKILL.md
│   └── README.md
├── predp-red-x402-payment/
│   ├── src/
│   │   ├── skills/
│   │   │   └── x402-skill.ts
│   │   ├── utils/
│   │   │   ├── x402-payment.ts
│   │   │   ├── agentic-wallet.ts
│   │   │   └── config.ts
│   │   ├── i18n/
│   │   │   ├── zh.json
│   │   │   └── en.json
│   │   ├── __tests__/
│   │   │   └── x402-skill.test.ts
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── SKILL.md
│   └── README.md
```

### 开发流程

```bash
# 克隆项目
git clone https://github.com/PredPred-HQ/PP-Skills.git
cd PP-Skills

# 安装依赖
npm install

# 编译项目
npm run build

# 运行测试
npm run test

# 开发模式
npm run dev
```

---

## 贡献

我们欢迎社区贡献。请遵循以下准则：

1. 创建一个功能分支
2. 进行您的更改
3. 运行测试
4. 提交您的更改
5. 创建一个拉取请求

---

## 支持

如有问题或建议，请通过以下方式联系：

- 查看项目文档：[SKILL.md 文件]
- 提交问题：[GitHub Issues]
- 联系开发团队：[支持邮箱]

---

## 许可证

所有技能均采用 MIT 许可证。详情请见各个技能目录下的 LICENSE 文件。
