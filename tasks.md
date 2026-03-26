# PredP.red AI Skill - 开发任务清单

## 任务分解

### 任务 1: 项目初始化与环境设置
**优先级**: HIGH  
**预计时间**: 2 小时  
**状态**: ⏳ PENDING

#### 子任务
- [ ] 1.1 创建项目目录结构
- [ ] 1.2 初始化 Node.js/TypeScript 项目
- [ ] 1.3 配置 OpenClaw Skills 开发环境
- [ ] 1.4 设置 .env 和密钥管理
- [ ] 1.5 安装依赖包

#### 技术细节
```bash
# 项目结构
xlayer-hackathon/
├── src/
│   ├── index.ts              # Skill 入口
│   ├── skills/
│   │   ├── predp-skill.ts    # 主 Skill 实现
│   │   └── x402-payment.ts   # x402 支付模块
│   ├── contracts/
│   │   ├── predp-abi.json    # predp.red 合约 ABI
│   │   └── contract.ts       # 合约交互封装
│   ├── utils/
│   │   ├── market-parser.ts  # 市场参数解析
│   │   └── tx-broadcaster.ts # 交易广播
│   └── ai/
│       ├── prompt-engine.ts  # Prompt 工程
│       └── market-analyzer.ts# 市场分析
├── tests/
│   ├── buy.test.ts
│   ├── sell.test.ts
│   └── market.test.ts
├── package.json
├── tsconfig.json
└── README.md
```

#### 依赖包
- `openclaw-sdk` 或对应框架
- `@okx/onchainos-sdk`
- `ethers` 或 `viem` (合约交互)
- `axios` (API 调用)
- `typescript`
- `jest` (测试)

---

### 任务 2: Smart Contract 集成
**优先级**: HIGH  
**预计时间**: 3 小时  
**状态**: ⏳ PENDING

#### 子任务
- [ ] 2.1 导入 predp.red 合约 ABI
- [ ] 2.2 封装合约调用接口
- [ ] 2.3 实现 buy 方法
- [ ] 2.4 实现 sell 方法
- [ ] 2.5 实现 getMarketInfo 方法
- [ ] 2.6 实现 getUserPositions 方法

#### 代码框架
```typescript
// src/contracts/predp-contract.ts
import { ethers } from 'ethers';
import PREDP_ABI from './predp-abi.json';

const CONTRACT_ADDRESS = '0x...'; // predp.red 合约地址

export class PredPContract {
  private contract: ethers.Contract;
  
  constructor(provider: ethers.Provider, signer: ethers.Signer) {
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, PREDP_ABI, signer);
  }

  async buy(positionId: string, amount: bigint, outcome: boolean): Promise<string> {
    // 调用合约 buy 接口
    const tx = await this.contract.buy(positionId, amount, outcome);
    return tx.hash;
  }

  async sell(positionId: string, amount: bigint): Promise<string> {
    // 调用合约 sell 接口
    const tx = await this.contract.sell(positionId, amount);
    return tx.hash;
  }

  async getMarketInfo(marketId: string): Promise<MarketInfo> {
    // 获取市场信息
    return await this.contract.getMarketInfo(marketId);
  }

  async getUserPositions(user: string): Promise<Position[]> {
    // 获取用户持仓
    return await this.contract.getUserPositions(user);
  }
}
```

---

### 任务 3: x402 支付集成
**优先级**: HIGH  
**预计时间**: 4 小时  
**预计时间**: 4 小时  
**状态**: ⏳ PENDING

#### 子任务
- [ ] 3.1 研究 x402 支付协议文档
- [ ] 3.2 配置 OKX API 凭证
- [ ] 3.3 实现支付授权签名 (TEE)
- [ ] 3.4 集成 okx-x402-payment skill
- [ ] 3.5 实现支付状态检查
- [ ] 3.6 错误处理和重试机制

#### 工作流程
```
1. 用户确认交易 → 2. 生成支付请求 → 3. TEE 签名 → 4. 提交支付 → 5. 验证结果
```

#### 代码示例
```typescript
// src/skills/x402-payment.ts
import { OnchainOS } from '@okx/onchainos-sdk';

export class X402Payment {
  private sdk: OnchainOS;

  constructor(apiKey: string, secretKey: string, passphrase: string) {
    this.sdk = new OnchainOS({ apiKey, secretKey, passphrase });
  }

  async authorizePayment(amount: string, recipient: string): Promise<string> {
    // 使用 x402 协议进行支付授权
    const authorization = await this.sdk.x402.sign({
      amount,
      recipient,
      chain: 'xlayer'
    });
    return authorization;
  }

  async verifyPayment(txHash: string): Promise<boolean> {
    // 验证支付状态
    const status = await this.sdk.onchainGateway.trackOrder(txHash);
    return status === 'SUCCESS';
  }
}
```

---

### 任务 4: AI Skill 核心逻辑
**优先级**: HIGH  
**预计时间**: 6 小时  
**状态**: ⏳ PENDING

#### 子任务
- [ ] 4.1 设计系统 Prompt
- [ ] 4.2 实现意图识别
- [ ] 4.3 参数提取和验证
- [ ] 4.4 自然语言响应生成
- [ ] 4.5 错误消息友好化
- [ ] 4.6 上下文管理

#### Prompt 设计
```markdown
# System Prompt for PredP.red AI Skill

## Role
你是一个专业的预测市场交易助手，帮助用户在 predp.red 去中心化预测市场上进行交易。

## Capabilities
1. 查看市场信息：提供市场详情、赔率、流动性等
2. 执行买入：帮助用户购买预测份额
3. 执行卖出：帮助用户卖出持仓
4. 投资建议：基于数据分析提供客观建议

## Constraints
- 必须使用 x402 协议完成支付授权
- 所有交易需用户明确确认
- 不提供财务建议，仅提供信息和分析
- 始终提示风险

## Response Format
- 市场信息：结构化展示关键数据
- 交易确认：清晰列出金额、市场、预期收益
- 错误处理：友好解释问题并提供解决方案
```

#### 意图识别示例
```typescript
// src/ai/intent-parser.ts
export interface TradeIntent {
  action: 'BUY' | 'SELL' | 'VIEW_MARKET' | 'VIEW_POSITIONS';
  marketId?: string;
  amount?: number;
  outcome?: 'YES' | 'NO';
  percentage?: number; // 卖出百分比
}

export function parseIntent(userMessage: string, context: any): TradeIntent {
  // 使用 AI 模型解析用户意图
  // 返回结构化的交易意图
}
```

---

### 任务 5: OnchainOS API 集成
**优先级**: HIGH  
**预计时间**: 3 小时  
**状态**: ⏳ PENDING

#### 子任务
- [ ] 5.1 配置 OKX API 凭证
- [ ] 5.2 集成 okx-dex-token (市场数据)
- [ ] 5.3 集成 okx-onchain-gateway (交易广播)
- [ ] 5.4 集成 okx-wallet-portfolio (持仓查询)
- [ ] 5.5 实现 Gas 估算
- [ ] 5.6 实现交易模拟

#### API 工作流
```typescript
// src/utils/tx-broadcaster.ts
export async function broadcastTransaction(txData: any) {
  // 1. Gas 估算
  const gasEstimate = await okxOnchainGateway.estimateGas(txData);
  
  // 2. 交易模拟
  const simulation = await okxOnchainGateway.simulate(txData);
  if (!simulation.success) throw new Error('Simulation failed');
  
  // 3. 广播交易
  const order = await okxOnchainGateway.broadcast(txData);
  
  // 4. 追踪订单
  const result = await okxOnchainGateway.trackOrder(order.id);
  
  return result;
}
```

---

### 任务 6: 用户界面与交互
**优先级**: MEDIUM  
**预计时间**: 4 小时  
**状态**: ⏳ PENDING

#### 子任务
- [ ] 6.1 设计对话流程
- [ ] 6.2 实现市场卡片展示
- [ ] 6.3 实现交易确认界面
- [ ] 6.4 添加进度指示器
- [ ] 6.5 实现错误提示
- [ ] 6.6 添加帮助文档

#### 对话示例
```
用户：查看 predp.red 热门市场

AI: 📊 **PredP.red 热门市场**

1️⃣ **市场 #123**: 比特币本周能否突破 100K?
   - 当前赔率：是 1.8x / 否 2.2x
   - 流动性：$50,000
   - 截止时间：3 天后
   - 参与人数：1,234

2️⃣ **市场 #456**: 以太坊 ETF 本月获批？
   - 当前赔率：是 3.5x / 否 1.3x
   - 流动性：$30,000
   - 截止时间：7 天后

💡 想参与哪个市场？告诉我市场编号和你想投资的金额~

---

用户：在市场 #123 买入 100 USDT 的"是"

AI: ✅ **交易确认**

市场：比特币本周能否突破 100K? (#123)
方向：是 (YES)
金额：100 USDT
预期收益：80 USDT (如果预测正确)
当前赔率：1.8x

⚠️ 风险提示：预测市场存在本金损失风险

请确认是否继续？(回复"确认"或"取消")

---

用户：确认

AI: 🔄 正在处理您的交易...

1. ✓ x402 支付授权完成
2. ✓ 合约调用成功
3. ✓ 交易已广播到 X Layer
4. ⏳ 等待确认...

📝 交易 Hash: 0xabc123...
🔍 在浏览器查看：https://xlayer.okx.com/tx/0xabc123...

🎉 交易成功！您现在持有市场 #123 的"是"份额。
```

---

### 任务 7: 测试与调试
**优先级**: HIGH  
**预计时间**: 4 小时  
**状态**: ⏳ PENDING

#### 子任务
- [ ] 7.1 编写单元测试
- [ ] 7.2 编写集成测试
- [ ] 7.3 端到端测试
- [ ] 7.4 错误场景测试
- [ ] 7.5 性能测试
- [ ] 7.6 安全审计

#### 测试用例
```typescript
// tests/buy.test.ts
describe('Buy Function', () => {
  test('should execute buy with valid parameters', async () => {
    // 测试正常买入流程
  });

  test('should reject insufficient balance', async () => {
    // 测试余额不足
  });

  test('should handle market not found', async () => {
    // 测试市场不存在
  });

  test('should handle x402 payment failure', async () => {
    // 测试支付失败
  });
});
```

---

### 任务 8: 文档与演示材料
**优先级**: MEDIUM  
**预计时间**: 3 小时  
**状态**: ⏳ PENDING

#### 子任务
- [ ] 8.1 编写 README.md
- [ ] 8.2 创建 API 文档
- [ ] 8.3 录制演示视频
- [ ] 8.4 准备截图
- [ ] 8.5 编写 X 推文
- [ ] 8.6 准备比赛提交表单

#### README 大纲
```markdown
# PredP.red AI Skill

## 简介
基于 x402 支付的 AI Skill，让用户在 OpenClaw 中直接交易 predp.red 预测市场。

## 功能特性
- ✅ 查看市场信息
- ✅ 执行买入操作
- ✅ 执行卖出操作
- ✅ x402 支付集成
- ✅ AI 市场分析

## 快速开始
### 前置条件
- OpenClaw 环境
- OKX API 凭证
- X Layer 钱包

### 安装
```bash
npx skills add okx/onchainos-skills
```

### 配置
```bash
OKX_API_KEY=your_key
OKX_SECRET_KEY=your_secret
OKX_PASSPHRASE=your_passphrase
```

### 使用示例
查看市场：
"显示 predp.red 热门市场"

买入：
"在市场 #123 买入 100 USDT 的是"

卖出：
"卖出市场 #123 的所有持仓"

## 技术架构
[架构图]

## 比赛信息
- 赛道：Agentic Payment / 链上支付场景
- 使用技术：x402, X Layer, OnchainOS
```

---

### 任务 9: 比赛提交
**优先级**: HIGH  
**预计时间**: 2 小时  
**状态**: ⏳ PENDING

#### 子任务
- [ ] 9.1 GitHub 仓库公开化
- [ ] 9.2 在 X Layer 主网执行真实交易
- [ ] 9.3 获取交易 Hash
- [ ] 9.4 发布 X 推文并@XLayerOfficial
- [ ] 9.5 填写 Google Forms 提交表
- [ ] 9.6 最终检查清单

#### 提交检查清单
```markdown
## 比赛提交检查清单

### 代码仓库
- [ ] GitHub 仓库已公开
- [ ] 包含完整源代码
- [ ] README 文档完整
- [ ] 安装说明清晰

### 链上活动
- [ ] 至少 1 个 X Layer 主网交易 Hash
- [ ] 交易 Hash 有效且可验证
- [ ] 合约或钱包地址已记录

### 社交媒体
- [ ] X 推文已发布
- [ ] 推文包含演示内容
- [ ] 已@XLayerOfficial
- [ ] 推文链接已保存

### 技术文档
- [ ] AI 模型和版本已说明
- [ ] Prompt 设计概述已提供
- [ ] OnchainOS 能力使用已列出

### 演示材料
- [ ] 演示视频或截图
- [ ] 功能可正常展示
- [ ] 用户体验流畅
```

---

## 时间线

```
Day 1-2: 任务 1-2 (项目初始化 + 合约集成)
Day 3-4: 任务 3-5 (x402 + AI Skill + OnchainOS)
Day 5-6: 任务 6-7 (UI + 测试)
Day 7:   任务 8-9 (文档 + 提交)
```

## 依赖关系

```
任务 1 → 任务 2 → 任务 3 → 任务 4 → 任务 5
                          ↓
任务 6 (可并行) → 任务 7 → 任务 8 → 任务 9
```

## 风险管理

### 高风险项
1. **x402 集成复杂度**: 预留额外时间，提前联系 OKX 技术支持
2. **智能合约接口**: 确认 ABI 稳定性，准备 mock 数据
3. **OpenClaw 兼容性**: 早期测试，快速迭代

### 缓解措施
- 每日进度检查
- 提前完成核心功能
- 准备 Plan B (录屏演示)

---

**文档版本**: v1.0  
**最后更新**: 2026-03-26
