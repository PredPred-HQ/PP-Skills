# 快速开始指南

## 5 分钟快速体验

### 步骤 1: 克隆项目 (1 分钟)

```bash
git clone <你的仓库链接>
cd xlayer-hackathon
```

### 步骤 2: 安装依赖 (2 分钟)

```bash
npm install
```

### 步骤 3: 配置环境 (1 分钟)

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入你的配置
# - OKX API 凭证 (https://www.okx.com/web3/build/dev-portal)
# - predp.red 合约地址
# - X Layer RPC URL
```

### 步骤 4: 编译项目 (1 分钟)

```bash
npm run build
```

### 步骤 5: 运行演示 (1 分钟)

```bash
# 查看市场
npm run dev "查看 predp.red 热门市场"

# 买入操作
npm run dev "在市场 #123 买入 100 USDT 的是"

# 卖出操作
npm run dev "卖出市场 #123 的所有持仓"
```

## 完整演示

运行完整演示脚本：

```bash
./scripts/demo.sh full
```

这会依次演示所有功能，适合录制演示视频。

## 在 OpenClaw 中使用

### 方法 1: 使用技能市场

```bash
# 在 OpenClaw 中
npx skills add okx/onchainos-skills
```

然后在对话中使用 `/predp` 命令。

### 方法 2: 本地开发

1. 启动开发服务器：
```bash
npm run dev
```

2. 在 OpenClaw 中配置本地技能路径

3. 开始对话

## 常见问题

### Q: 如何获取 OKX API 凭证？

A: 访问 [OKX Developer Portal](https://www.okx.com/web3/build/dev-portal) 注册并创建应用。

### Q: predp.red 合约地址是什么？

A: 联系项目方获取最新的合约地址，或部署自己的测试合约。

### Q: 交易失败怎么办？

A: 检查以下几点：
- 钱包是否有足够的 OKB (Gas)
- OKX API 凭证是否正确
- 市场是否处于 ACTIVE 状态
- 金额格式是否正确

### Q: 如何查看交易状态？

A: 使用返回的交易 Hash 在 [X Layer Explorer](https://www.okx.com/explorer/xlayer) 查看。

## 下一步

- 📖 阅读 [README.md](./README.md) 了解详细功能
- 🏗️ 查看 [spec.md](./spec.md) 了解技术架构
- 📝 参考 [tasks.md](./tasks.md) 了解开发任务
- ✅ 使用 [checklist.md](./checklist.md) 准备比赛提交

## 获取帮助

- 📧 Email: [团队邮箱]
- 💬 Discord: [服务器链接]
- 🐦 Twitter: @XLayerOfficial
- 📚 文档：https://web3.okx.com/xlayer/docs

---

**提示**: 第一次运行时建议先使用测试网络和测试代币，熟悉流程后再使用主网。
