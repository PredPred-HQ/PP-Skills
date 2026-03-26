# Multi-Language Guide / 多语言使用指南

## 🌐 Language Support / 语言支持

PredP.red AI Skill supports **Chinese (中文)** and **English** out of the box.

PredP.red AI Skill 原生支持 **中文** 和 **英文**。

---

## 🎯 Setting Language / 设置语言

### Method 1: Environment Variable / 方法 1: 环境变量

**Chinese / 中文**:
```bash
export LANGUAGE=zh
npm run dev
```

**English**:
```bash
export LANGUAGE=en
npm run dev
```

### Method 2: In-Chat Command / 方法 2: 聊天命令

**Switch to English / 切换到英文**:
```
Switch to English
切换到英文
```

**Switch to Chinese / 切换到中文**:
```
Switch to Chinese
切换到中文
```

### Method 3: Code Configuration / 方法 3: 代码配置

```typescript
import { PredPSkill } from './skills/predp-skill';

// Initialize with Chinese / 初始化为中文
const skill = new PredPSkill({
  // ... other options
  language: 'zh',  // or 'en'
});

// Switch language dynamically / 动态切换语言
skill.setLanguage('en');  // Switch to English / 切换到英文
skill.setLanguage('zh');  // Switch to Chinese / 切换到中文
```

---

## 📝 Example Commands / 示例命令

### View Markets / 查看市场

| Chinese | English |
|---------|---------|
| 查看 predp.red 热门市场 | View predp.red popular markets |
| 显示市场 #123 的详细信息 | Show market #123 details |
| 这个市场怎么样？ | How about this market? |

### Buy / 买入

| Chinese | English |
|---------|---------|
| 在市场 #123 买入 100 USDT 的是 | Buy 100 USDT of Yes in market #123 |
| 我想投资这个预测，买 50 块 | I want to invest in this prediction, buy 50 |
| 买入市场 456 的"否" | Buy No in market 456 |

### Sell / 卖出

| Chinese | English |
|---------|---------|
| 卖出我在市场 #123 的所有份额 | Sell all my positions in market #123 |
| 平仓，卖出 50% 的持仓 | Close position, sell 50% of holdings |
| 卖出市场 789 的全部 | Sell all of market 789 |

### View Positions / 查看持仓

| Chinese | English |
|---------|---------|
| 我有哪些持仓？ | What are my positions? |
| 显示我的投资组合 | Show my portfolio |
| 我的收益如何？ | How are my profits? |

---

## 🎨 Response Examples / 响应示例

### Market View / 市场查看

**Chinese**:
```
📊 **市场 #123**

**标题**: 比特币本周能否突破 100K?
**描述**: 预测比特币是否会在本周内突破 100,000 美元
**结束时间**: 2026 年 3 月 29 日 23:59:59
**总流动性**: $50,000
**赔率**: 
  - 是 (YES): 1.8x
  - 否 (NO): 2.2x
**状态**: 进行中

💡 想参与吗？告诉我你想投资多少 USDT 以及选择"是"还是"否"~
```

**English**:
```
📊 **Market #123**

**Title**: Will Bitcoin break $100K this week?
**Description**: Predict whether Bitcoin will break $100,000 this week
**End Time**: March 29, 2026 23:59:59
**Total Liquidity**: $50,000
**Odds**: 
  - Yes (YES): 1.8x
  - No (NO): 2.2x
**Status**: Active

💡 Want to participate? Tell me how much USDT you want to invest and choose "Yes" or "No"~
```

### Trade Confirmation / 交易确认

**Chinese**:
```
✅ **交易确认**

市场：比特币本周能否突破 100K? (#123)
方向：是 (YES)
金额：100 USDT
当前赔率：1.8x
预期收益：180 USDT (如果预测正确)

⚠️ **风险提示**: 预测市场存在本金损失风险，如果预测错误可能损失全部投资

请确认是否继续？(回复"确认"或"取消")
```

**English**:
```
✅ **Trade Confirmation**

Market: Will Bitcoin break $100K this week? (#123)
Direction: Yes (YES)
Amount: 100 USDT
Current Odds: 1.8x
Expected Return: 180 USDT (if prediction is correct)

⚠️ **Risk Warning**: Prediction markets carry risk of loss, you may lose your entire investment if prediction is wrong

Please confirm to continue? (Reply "Confirm" or "Cancel")
```

---

## 🔧 Technical Implementation / 技术实现

### i18n Module / i18n 模块

Located at / 位于：`src/i18n/index.ts`

**Features / 功能**:
- Translation management / 翻译管理
- Language detection / 语言检测
- Dynamic switching / 动态切换
- Locale formatting / 区域格式化

### Usage in Code / 代码中使用

```typescript
import { I18nService } from './i18n';

const i18n = new I18nService('zh');  // or 'en'

// Get translation / 获取翻译
const text = i18n.t('loading');  // "加载中..." or "Loading..."

// Interpolate variables / 插值变量
const message = i18n.interpolate(
  i18n.t('marketClosed'), 
  { status: i18n.t('active') }
);
```

---

## 📚 Available Translations / 可用翻译

### Common / 通用
- loading / 加载中
- error / 错误
- success / 成功
- confirm / 确认
- cancel / 取消

### Actions / 操作
- viewMarket / 查看市场
- buy / 买入
- sell / 卖出
- viewPositions / 查看持仓

### Market / 市场
- market / 市场
- markets / 市场（复数）
- popularMarkets / 热门市场
- marketTitle / 市场标题
- marketDescription / 市场描述
- endTime / 结束时间
- liquidity / 流动性
- odds / 赔率
- yes / 是
- no / 否
- status / 状态
- active / 进行中
- closed / 已关闭
- resolved / 已结算

### Trading / 交易
- amount / 金额
- direction / 方向
- expectedReturn / 预期收益
- currentOdds / 当前赔率
- riskWarning / 风险提示
- tradeConfirmation / 交易确认

### Messages / 消息
- marketNotFound / 无法获取市场信息
- marketClosed / 市场已关闭
- invalidAmount / 金额无效
- insufficientBalance / 余额不足
- transactionSuccess / 交易成功
- transactionFailed / 交易失败
- waitingForConfirmation / 等待确认

---

## 🎯 Best Practices / 最佳实践

### 1. Always Use i18n / 始终使用 i18n

**✅ Good / 好**:
```typescript
const t = this.i18n;
return `${t.t('error')}: ${message}`;
```

**❌ Bad / 不好**:
```typescript
return `错误：${message}`;  // Hardcoded Chinese / 硬编码中文
```

### 2. Support Both Languages / 支持两种语言

**✅ Good / 好**:
```typescript
if (lowerMessage.includes('买入') || lowerMessage.includes('buy')) {
  // Handle buy intent
}
```

**❌ Bad / 不好**:
```typescript
if (lowerMessage.includes('买入')) {  // Only Chinese / 仅中文
  // Handle buy intent
}
```

### 3. Use Locale Formatting / 使用区域格式化

**✅ Good / 好**:
```typescript
const isZh = t.getLanguage() === 'zh';
const dateStr = new Date(timestamp).toLocaleString(
  isZh ? 'zh-CN' : 'en-US'
);
```

**❌ Bad / 不好**:
```typescript
const dateStr = new Date(timestamp).toLocaleString('zh-CN');  // Always Chinese / 总是中文
```

---

## 🐛 Troubleshooting / 故障排除

### Issue / 问题：Language not switching / 语言不切换

**Solution / 解决方案**:
1. Check if `language` option is set in constructor / 检查构造函数中是否设置了 `language` 选项
2. Use `setLanguage()` method / 使用 `setLanguage()` 方法
3. Verify environment variable / 验证环境变量

### Issue / 问题：Missing translations / 翻译缺失

**Solution / 解决方案**:
1. Add translation key to `src/i18n/index.ts` / 在 `src/i18n/index.ts` 中添加翻译键
2. Provide both Chinese and English versions / 提供中文和英文版本
3. Use fallback to English / 使用英文作为后备

---

## 📖 Additional Resources / 额外资源

- [i18n Module Source / i18n 模块源码](./src/i18n/index.ts)
- [Skill Implementation / Skill 实现源码](./src/skills/predp-skill.ts)
- [Main Entry / 主入口](./src/index.ts)

---

**Version / 版本**: v1.0.0  
**Last Updated / 最后更新**: 2026-03-26
