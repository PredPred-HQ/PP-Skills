# PredP.red AI Skill - 比赛提交检查清单

## 📋 提交前必查项目

### 一、GitHub 仓库 (截止时间前 24 小时完成)
- [ ] 仓库设置为 Public
- [ ] 包含完整源代码
- [ ] README.md 文档完整
  - [ ] 项目简介
  - [ ] 功能特性列表
  - [ ] 安装和配置说明
  - [ ] 使用示例
  - [ ] 技术架构图
- [ ] 代码质量检查
  - [ ] 无硬编码密钥
  - [ ] .env 已添加到 .gitignore
  - [ ] 代码有适当注释
- [ ] LICENSE 文件
- [ ] package.json 包含所有依赖

**仓库 URL**: ____________________

---

### 二、X Layer 链上活动 (截止时间前 12 小时完成)

#### 必须提供的交易
- [ ] **部署交易** (如部署了新合约)
  - Transaction Hash: ____________________
  - 验证链接：https://www.okx.com/explorer/xlayer/tx/____________________
  
- [ ] **Buy 操作交易** (至少 1 笔)
  - Transaction Hash: ____________________
  - 验证链接：https://www.okx.com/explorer/xlayer/tx/____________________
  
- [ ] **Sell 操作交易** (至少 1 笔，可选)
  - Transaction Hash: ____________________
  - 验证链接：https://www.okx.com/explorer/xlayer/tx/____________________

#### 合约/钱包地址
- [ ] 主要合约地址：____________________
- [ ] 测试钱包地址：____________________

#### 验证步骤
```bash
# 1. 在 X Layer 浏览器验证交易
# 2. 确认交易状态为 Success
# 3. 截图保存作为备份
```

---

### 三、社交媒体 (截止时间前 6 小时完成)

#### X (Twitter) 推文
- [ ] 推文已发布
- [ ] 推文内容包含:
  - [ ] 项目介绍
  - [ ] 演示视频/GIF
  - [ ] GitHub 链接
  - [ ] @XLayerOfficial
  - [ ] 相关标签：#XLayer #Hackathon #OnchainOS #AI
- [ ] 推文链接：____________________
- [ ] 截图备份：____________________

#### 推文模板
```
🎯 参加 @XLayerOfficial Onchain OS AI Hackathon!

PredP.red AI Skill - 让 AI 帮你交易预测市场！

✨ 功能:
- x402 支付集成
- 一键 Buy/Sell
- AI 市场分析
- OpenClaw 无缝体验

🔗 GitHub: [你的链接]
📺 Demo: [视频链接]

#XLayer #OnchainOS #AI #DeFi #PredictionMarket
```

---

### 四、比赛提交表 (Google Forms)

#### 基本信息
- [ ] **Project Name**: PredP.red AI Skill
- [ ] **Project Description** (300 字符内):
  ```
  AI-powered trading assistant for predp.red decentralized prediction market. 
  Integrates x402 payment protocol for seamless buy/sell operations directly 
  in OpenClaw. Users can trade prediction shares with natural language commands.
  Built on X Layer for low fees and fast transactions.
  ```

- [ ] **Primary Track**: Agentic Payment / 链上支付场景 (推荐)
  或 AI DeFi / AI 交易

- [ ] **Project X Handle**: @____________________
- [ ] **Personal Telegram**: @____________________

#### 团队成员
- [ ] 成员 1: ____________ (X: @____________)
- [ ] 成员 2: ____________ (X: @____________)
- [ ] 成员 3: ____________ (X: @____________)

#### 技术细节
- [ ] **X Post URL**: ____________________
- [ ] **Demo URL** (视频/截图): ____________________
- [ ] **GitHub Repository**: ____________________

#### X Layer 交易信息
- [ ] **Transaction Hash**: ____________________
- [ ] **Contract/Wallet Address**: ____________________

#### OnchainOS Capabilities (多选)
- [x] x402 Payments
- [x] Wallet API
- [ ] Trade API
- [ ] Market API
- [ ] DApp Wallet Connect
- [ ] None

#### AI 模型信息
- [ ] **AI Model & Version**: 
  ```
  例如：GPT-4 Turbo / Claude 3.5 Sonnet / 自定义模型
  ```

- [ ] **Prompt Design Overview** (600 字符):
  ```
  System prompt architecture:
  1. Role: Professional prediction market trading assistant
  2. Intent recognition: Parse user commands for market/view/buy/sell actions
  3. Parameter extraction: marketId, amount, outcome, percentage
  4. Validation: Check balance, market status, x402 authorization
  5. Risk disclosure: Always warn about potential losses
  6. Response format: Structured market info, clear confirmations
  
  Core instructions:
  - Use x402 for all payments
  - Require explicit user confirmation
  - Provide objective analysis, not financial advice
  - Handle errors gracefully with helpful messages
  ```

#### 补充说明
- [ ] **Anything else**:
  ```
  - Integrated with OKX OnchainOS Skills API
  - Supports full EVM-compatible smart contract interaction
  - Real-time transaction tracking on X Layer
  - AI-powered market insights and risk assessment
  ```

---

### 五、演示材料准备

#### 演示视频 (2-3 分钟)
- [ ] 开场：项目介绍 (15 秒)
- [ ] 功能 1：查看市场 (30 秒)
- [ ] 功能 2：执行 Buy 操作 (45 秒)
- [ ] 功能 3：执行 Sell 操作 (45 秒)
- [ ] 功能 4：x402 支付展示 (30 秒)
- [ ] 结尾：技术亮点总结 (15 秒)

#### 截图清单
- [ ] OpenClaw 对话界面
- [ ] 市场信息展示
- [ ] Buy 确认界面
- [ ] 交易成功界面
- [ ] X Layer 浏览器交易详情
- [ ] x402 支付授权界面

#### 演示脚本
```markdown
1. 打开 OpenClaw，加载 PredP.red Skill
2. 输入："查看 predp.red 热门市场"
3. 展示市场列表和 AI 分析
4. 输入："在市场 #123 买入 100 USDT 的是"
5. 展示交易确认和 x402 支付
6. 展示交易成功和 TX Hash
7. 在 X Layer 浏览器验证交易
8. 输入："卖出我的持仓"
9. 展示完整交易流程
```

---

### 六、技术验证

#### 功能测试
- [ ] ✅ 市场查询功能正常
- [ ] ✅ Buy 操作成功执行
- [ ] ✅ Sell 操作成功执行
- [ ] ✅ x402 支付正常工作
- [ ] ✅ 交易广播到 X Layer
- [ ] ✅ 交易状态可追踪
- [ ] ✅ 错误处理正常

#### 性能测试
- [ ] 响应时间 < 3 秒
- [ ] 并发请求处理
- [ ] 内存使用合理
- [ ] 无内存泄漏

#### 安全测试
- [ ] 无密钥泄露
- [ ] 交易签名安全
- [ ] x402 授权正确
- [ ] 重入攻击防护
- [ ] 输入验证完整

---

### 七、文档完整性

#### 技术文档
- [ ] spec.md - 项目规范
- [ ] tasks.md - 任务分解
- [ ] checklist.md - 检查清单 (本文档)
- [ ] API.md - API 文档 (如有)

#### 用户文档
- [ ] README.md - 项目说明
- [ ] INSTALL.md - 安装指南
- [ ] USAGE.md - 使用指南
- [ ] FAQ.md - 常见问题

---

### 八、最终检查 (提交前 1 小时)

#### 链接验证
- [ ] GitHub 链接可访问
- [ ] X 推文链接可访问
- [ ] 演示视频可播放
- [ ] 交易 Hash 可验证

#### 内容检查
- [ ] 所有必填字段已填写
- [ ] 字符数符合要求
- [ ] 无拼写错误
- [ ] 格式正确

#### 备份
- [ ] 所有材料本地备份
- [ ] 截图保存
- [ ] 视频下载保存
- [ ] 交易记录截图

---

### 九、提交确认

#### 提交前最后确认
```markdown
## 提交确认清单

✓ GitHub repo is public & code is live
✓ TX Hash is valid on X Layer mainnet
✓ Social post is live
✓ Demo is accessible
✓ All form fields completed
✓ Character limits respected
✓ Links verified

提交时间：____________________
提交人：____________________
```

#### 提交后
- [ ] 确认收到提交确认邮件
- [ ] 截图保存提交成功页面
- [ ] 加入参赛者社区/Discord
- [ ] 关注比赛官方更新

---

## 🎯 评分标准对照

### 创新性 (30%)
- [x] AI + 预测市场 + x402 支付的创新组合
- [x] 自然语言交易交互
- [x] 无缝的链上体验

### 技术深度 (30%)
- [x] 完整的智能合约集成
- [x] x402 支付协议实现
- [x] OnchainOS API 使用
- [x] X Layer 主网部署

### 实用性 (20%)
- [x] 真实可用的产品
- [x] 降低用户参与门槛
- [x] 良好的用户体验

### 完整性 (20%)
- [x] 功能完整
- [x] 文档齐全
- [x] 演示充分
- [x] 代码质量高

---

## 📞 紧急联系

### 技术支持
- OKX Developer Discord: ____________________
- X Layer 文档：https://web3.okx.com/xlayer/docs
- OnchainOS SDK: https://github.com/okx/onchainos-skills

### 比赛官方
- 比赛邮箱：____________________
- 官方 Discord: ____________________
- 官方 Twitter: @XLayerOfficial

---

## 📝 备注

### 重要时间节点
- 提交截止：____________________
- 评审开始：____________________
- 结果公布：____________________

### 其他事项
```
在此记录其他需要注意的事项...
```

---

**版本**: v1.0  
**最后更新**: 2026-03-26  
**打印此清单并在完成每项后打勾 ✓**
