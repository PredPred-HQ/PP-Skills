# PredP.red AI Skill - 项目总览

欢迎参加 X Layer Onchain OS AI Hackathon！这是一个完整的项目框架，帮助你快速构建和提交作品。

## 📁 项目结构

```
xlayer-hackathon/
│
├── 📄 核心文档
│   ├── README.md                      # 项目说明和使用指南
│   ├── QUICKSTART.md                  # 5 分钟快速开始指南
│   ├── SUBMISSION.md                  # 比赛提交总结文档
│   ├── spec.md                        # 项目规范和技术规格
│   ├── tasks.md                       # 开发任务分解
│   └── checklist.md                   # 提交检查清单
│
├── 💻 源代码
│   └── src/
│       ├── index.ts                   # 主入口文件
│       ├── skills/
│       │   └── predp-skill.ts         # 核心 AI Skill 实现
│       ├── utils/
│       │   ├── config.ts              # 配置加载工具
│       │   └── x402-payment.ts        # x402 支付模块
│       └── contracts/
│           └── predp-abi.json         # 智能合约 ABI
│
├── ⚙️ 配置文件
│   ├── package.json                   # 项目依赖和脚本
│   ├── tsconfig.json                  # TypeScript 配置
│   ├── skill.json                     # OpenClaw Skill 配置
│   ├── .env.example                   # 环境变量模板
│   └── .gitignore                     # Git 忽略规则
│
└── 🛠️ 工具和脚本
    └── scripts/
        └── demo.sh                    # 演示脚本
```

## 🚀 快速开始

### 1. 阅读文档 (推荐顺序)

1. **QUICKSTART.md** - 5 分钟快速体验项目
2. **README.md** - 了解完整功能和使用方法
3. **spec.md** - 理解技术架构和设计
4. **tasks.md** - 查看开发任务和进度
5. **checklist.md** - 准备比赛提交

### 2. 安装和运行

```bash
# 安装依赖
npm install

# 配置环境
cp .env.example .env
# 编辑 .env 填入你的 API 凭证

# 编译
npm run build

# 运行演示
npm run dev "查看 predp.red 热门市场"
```

### 3. 完整演示

```bash
# 运行完整演示流程（适合录制视频）
./scripts/demo.sh full
```

## 🎯 核心功能

### 功能 1: 市场查看
```bash
npm run dev "查看 predp.red 热门市场"
npm run dev "显示市场 #123 的详细信息"
```

### 功能 2: 买入操作
```bash
npm run dev "在市场 #123 买入 100 USDT 的是"
```

### 功能 3: 卖出操作
```bash
npm run dev "卖出市场 #123 的所有持仓"
```

### 功能 4: 持仓查询
```bash
npm run dev "我有哪些持仓？"
```

## 🏗️ 技术架构

```
用户 (OpenClaw)
    ↓
AI 意图识别 (predp-skill.ts)
    ↓
x402 支付授权 (x402-payment.ts)
    ↓
智能合约调用 (predp-abi.json)
    ↓
X Layer 区块链
```

### 核心模块

1. **predp-skill.ts** - AI Skill 核心逻辑
   - 自然语言解析
   - 意图识别
   - 参数提取
   - 响应生成

2. **x402-payment.ts** - 支付集成
   - TEE 签名授权
   - 支付验证
   - 交易广播
   - 订单追踪

3. **config.ts** - 配置管理
   - 环境变量加载
   - 参数验证
   - 类型安全

## 📋 比赛提交清单

### ✅ 必须项

- [ ] GitHub 仓库公开
- [ ] 完整源代码
- [ ] README.md 文档
- [ ] X Layer 主网交易 Hash
- [ ] X 推文发布
- [ ] 演示材料（视频/截图）

### 📝 提交文档

使用 `SUBMISSION.md` 作为模板填写你的项目信息：

- 项目简介（300 字符）
- AI 模型和 Prompt 设计（600 字符）
- 使用的 OnchainOS 能力
- 交易 Hash 和合约地址
- 团队信息
- 社交媒体链接

### 🔗 重要链接

- **比赛提交表**: https://docs.google.com/forms/d/e/1FAIpQLSfDy85BtAkzjWk2_S88RBlVfNMM_7Qfq2sU_tg-NNb99bfaQA/viewform
- **X Layer 文档**: https://web3.okx.com/zh-hans/xlayer/docs
- **OnchainOS SDK**: https://github.com/okx/onchainos-skills

## 🎨 自定义指南

### 修改合约地址

编辑 `.env` 文件：
```env
PREDP_CONTRACT_ADDRESS=0xYourContractAddress
```

### 修改 AI 模型

编辑 `src/skills/predp-skill.ts` 中的 `parseIntent` 方法，集成你选择的 AI 模型。

### 添加新功能

1. 在 `src/skills/predp-skill.ts` 添加处理方法
2. 在 `parseIntent` 中添加意图识别
3. 更新 `handleMessage` 路由

### 自定义 UI/UX

修改 `src/skills/predp-skill.ts` 中的响应生成方法，调整输出格式和风格。

## 🧪 测试指南

### 单元测试
```bash
npm test
```

### 集成测试
```bash
./scripts/demo.sh demo1  # 测试市场查看
./scripts/demo.sh demo3  # 测试买入操作
./scripts/demo.sh demo4  # 测试卖出操作
```

### 端到端测试
```bash
./scripts/demo.sh full
```

## 📱 演示和宣传

### 社交媒体模板

查看 `docs/social-media-templates.md` 获取：
- X 推文模板（多个版本）
- 演示视频脚本
- 截图清单
- 发布建议

### 演示脚本

使用 `scripts/demo.sh` 进行演示录制：
```bash
# 完整演示（推荐录制）
./scripts/demo.sh full

# 单独功能演示
./scripts/demo.sh demo3  # 买入操作
```

## 🆘 常见问题

### Q: 如何获取 OKX API 凭证？
访问 [OKX Developer Portal](https://www.okx.com/web3/build/dev-portal)

### Q: 如何获取 predp.red 合约地址？
- 联系项目方获取
- 或部署自己的测试合约

### Q: 交易失败怎么办？
检查：
- 钱包余额（OKB 作为 Gas）
- API 凭证正确性
- 市场状态（ACTIVE）
- 金额格式

### Q: 如何在 X Layer 浏览器验证交易？
使用交易 Hash 访问：
```
https://www.okx.com/explorer/xlayer/tx/<YOUR_TX_HASH>
```

## 📊 开发进度追踪

查看 `tasks.md` 了解：
- 已完成的任务 ✅
- 进行中的任务 🔄
- 待开始的任务 ⏳

## 🎯 下一步行动

### 立即开始
1. ✅ 阅读 QUICKSTART.md
2. ✅ 安装依赖并运行
3. ✅ 测试所有功能
4. ✅ 准备比赛提交

### 比赛提交前
1. ✅ 填写 SUBMISSION.md
2. ✅ 运行 `./scripts/demo.sh full` 录制演示
3. ✅ 发布 X 推文
4. ✅ 使用 checklist.md 检查所有项目
5. ✅ 提交 Google Form

## 📞 获取帮助

### 文档资源
- 📚 X Layer 文档：https://web3.okx.com/xlayer/docs
- 🛠️ OnchainOS SDK: https://github.com/okx/onchainos-skills
- 🤖 OpenClaw: https://openclaw.ai

### 社区支持
- 💬 Discord: [比赛 Discord 服务器]
- 🐦 Twitter: @XLayerOfficial
- 📧 Email: [比赛官方邮箱]

## 🏆 评分标准

### 创新性 (30%)
- AI + 预测市场 + x402 支付的组合
- 自然语言交易交互
- 用户体验创新

### 技术深度 (30%)
- x402 支付协议实现
- 智能合约交互
- OnchainOS API 集成

### 实用性 (20%)
- 完整可用的产品
- 降低用户门槛
- 良好的错误处理

### 完整性 (20%)
- 功能完整度
- 文档质量
- 演示效果

---

**祝你好运！🚀**

准备好参加 X Layer Onchain OS AI Hackathon 了吗？让我们开始构建未来！

**项目版本**: v1.0.0  
**最后更新**: 2026-03-26  
**维护者**: Your Team
