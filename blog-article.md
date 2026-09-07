---
title: "Get笔记 to Obsidian Importer 2.0 - All in AI 时代的笔记迁移方案"
date: 2025-01-14
slug: get-to-obsidian-importer
tags: ["Obsidian", "Get笔记", "AI开发", "Vibe Coding", "插件开发"]
description: "从 flomo 到 Get笔记，我用 AI 重新打造了一个笔记同步插件。分享 All in AI 开发的完整过程。"
---

# Get笔记 to Obsidian Importer 2.0 - All in AI 时代的笔记迁移方案

## 为什么从 flomo 换到 Get笔记？

之前我写过一篇 [flomo-to-obsidian-importer](/blog/2025-11-03_flomo-to-obsidian-importer) 的文章，分享了如何将 flomo 笔记同步到 Obsidian。那个插件帮助了不少朋友，我自己也用得很开心。

但最近，我做了一个决定：**All in AI**。

这意味着我需要重新审视我的工具链。Get笔记（biji.com）作为一个国产的轻量级笔记服务，有几个让我心动的点：

- 🚀 **更轻量**：专注于快速记录，没有过多花哨功能
- 💬 **语音笔记**：支持语音输入，适合碎片化记录
- 🔄 **数据可导出**：支持 HTML 格式完整导出

既然换了笔记服务，同步到 Obsidian 的需求还在。于是我决定：**用 AI 重新造一个轮子**。

---

## 🤖 Vibe Coding：用 AI 来写代码

如果你看过我之前的文章，应该知道我一直在实践一种叫做 **Vibe Coding** 的开发方式：

> 把想法告诉 AI，让它帮你翻译成代码。你负责 **What**，AI 负责 **How**。

这次开发 get-to-obsidian 插件，我更加深刻地体会到了这种方式的强大。我并不是一个专业的前端开发者，TypeScript 对我来说也只是略懂。但借助 AI，我可以：

1. **描述需求**：「我需要一个插件，用 Playwright 自动登录 Get笔记，导出数据，解析 HTML，然后导入 Obsidian」
2. **迭代改进**：「导出的附件路径太深了，能不能简化成两层？」
3. **Debug**：「为什么浏览器打开后找不到登录按钮？帮我看看选择器」
4. **学习**：「这段代码是什么意思？为什么要用 async/await？」

整个开发过程，**我没有从零写过一行代码**，但我完全理解每一个功能是如何实现的。

---

## ✨ 插件功能一览

### 核心功能

- ✅ **增量同步**：智能识别已同步的笔记，只导入新增内容
- ✅ **智能更新检测**：自动识别修改过的笔记并重新导入
- ✅ **多种同步方式**：
  - 启动时自动同步
  - 每小时定时同步
  - 手动一键同步
  - 手动导入 ZIP 文件

### 可视化功能

- 🎨 **Moments 时间线**：按时间倒序显示所有笔记
- 🎨 **Canvas 画布**：画布模式展示笔记网络

### 高级功能

- 🔗 **双向链接支持**：保留 `[[wiki-links]]` 格式
- 📅 **按日期合并笔记**：可选将同一天的笔记合并
- 🖼️ **附件支持**：自动下载图片、音频等
- ⚡ **高亮转换**：`<mark>` → `==高亮==`

---

## 🛠️ Version 2.0 的重大更新

相比原版插件，2.0 版本做了几个关键改进：

### 1. 🔇 静默后台同步

**问题**：原版每次同步都会弹出浏览器窗口，很打扰工作流。

**解决**：

```typescript
// 使用 headless 模式
const browser = await chromium.launch({
  headless: true,  // 关键：后台静默运行
});
```

现在同步完全在后台进行，你甚至不会注意到它在工作。

### 2. 📁 简化的附件结构

**问题**：Get笔记 导出的附件路径是 `file/日期/用户ID/文件名`，层级太深。

**解决**：

```
❌ 之前：get picture/file/2024-01-15/abc123/image.jpg
✅ 现在：get attachment/2024-01-15/image.jpg
```

扁平化处理，vault 结构更清晰。

### 3. 🔄 智能内容更新检测

**问题**：如果在 Get笔记 中修改了一条笔记，插件不会重新导入。

**解决**：

```typescript
// 基于笔记 ID 而非内容哈希来判断
// 如果笔记 ID 相同但内容变化，会重新导入
const memoId = extractMemoIdFromFilename(filename);
```

现在修改过的笔记会被检测到并更新。

### 4. 🗑️ 重置同步历史

**问题**：有时需要完全重新导入所有笔记，但没有简单的方法。

**解决**：设置中新增「重置同步历史」按钮，一键清空同步记录。

### 5. ⚙️ 动态路径配置

**问题**：附件路径和主目录设置不联动。

**解决**：附件目录现在跟随「Get笔记主目录」设置自动调整。

---

## 📦 安装使用

### 前置要求

- Obsidian 0.15.0+
- Node.js（用于构建）
- **仅支持桌面端**（需要 Playwright）

### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/geekhuashan/get-to-obsidian.git
cd get-to-obsidian

# 2. 安装依赖
npm install

# 3. 安装 Playwright（重要！）
npx playwright@1.43.1 install

# 4. 构建
npm run build

# 5. 复制到 Obsidian 插件目录
# 将 main.js、manifest.json、styles.css 复制到
# .obsidian/plugins/get-importer/
```

> ⚠️ **必须安装 Playwright**：这是浏览器自动化的核心依赖，不装的话同步功能完全无法使用。

### 首次使用

1. 点击左侧边栏的 📓 图标
2. 点击「登录 Get笔记 账号」
3. 在弹出的浏览器中完成短信验证登录
4. 点击「立即同步」

就这么简单。

---

## 🔧 技术架构

对于想要了解或修改代码的朋友，这里是核心流程：

```
用户触发同步
    ↓
Playwright 加载认证状态
    ↓
自动导出 HTML 压缩包
    ↓
解析 HTML，提取笔记内容
    ↓
生成唯一 ID，过滤已同步笔记
    ↓
转换为 Markdown
    ↓
保存到 Obsidian vault
    ↓
可选：生成 Moments/Canvas
    ↓
更新同步记录
```

### 项目结构

```
get-to-obsidian/
├── main.ts                 # 插件入口
├── lib/
│   ├── get/
│   │   ├── auth.ts        # 短信验证登录
│   │   ├── exporter.ts    # Playwright 自动导出
│   │   ├── core.ts        # HTML 解析
│   │   └── importer.ts    # 导入逻辑
│   ├── obIntegration/
│   │   ├── canvas.ts      # Canvas 生成
│   │   └── moments.ts     # 时间线生成
│   └── ui/                # 用户界面
```

### 核心依赖

- **Playwright 1.43.1**：浏览器自动化
- **node-html-parser**：HTML 解析
- **turndown**：HTML → Markdown 转换
- **fs-extra**：文件操作

---

## 💡 开发过程中的学习

### 技术层面

1. **Playwright 的 headless 模式**：后台运行浏览器，用户无感知
2. **增量同步的 ID 设计**：如何用简单的方式实现去重
3. **Obsidian Plugin API**：理解 Vault API 的正确使用方式
4. **TypeScript 的类型体操**：虽然 AI 帮我写，但我终于理解了为什么需要类型

### 产品层面

1. **用户体验的细节**：静默同步 vs 弹窗，差异巨大
2. **路径设计**：扁平 > 嵌套，除非有明确理由
3. **向后兼容**：升级不应该破坏用户现有数据

### AI 开发层面

1. **描述清晰的需求比写代码更重要**
2. **AI 是工具，不是魔法**：你需要理解它在做什么
3. **迭代 > 一次到位**：先跑起来，再优化
4. **Debug 是最好的学习机会**：AI 的错误往往揭示了你理解的盲区

---

## 🎯 适合谁用？

- ✅ 正在使用 Get笔记，想把内容同步到 Obsidian
- ✅ 希望自动化同步，不想手动导出导入
- ✅ 需要 Moments/Canvas 可视化来回顾笔记
- ✅ 愿意折腾一下安装 Playwright

**不适合**：

- ❌ 手机端用户（Playwright 只能在桌面运行）
- ❌ 不想安装额外依赖的用户

---

## 🚀 未来计划？

老实说，我没有太多「计划」。这个插件解决了我自己的问题，我把它分享出来。

如果你有新的需求：

1. **Fork 它**
2. **让 AI 帮你改**
3. **提 PR 回来**

这是一个普通人也能参与的开源时代。你不需要是专业开发者，你只需要有想法，然后**让 AI 帮你实现**。

---

## 📮 链接

- **GitHub**: [github.com/geekhuashan/get-to-obsidian](https://github.com/geekhuashan/get-to-obsidian)
- **相关文章**: [flomo-to-obsidian-importer](/blog/2025-11-03_flomo-to-obsidian-importer)

---

> 📅 2025-01-14
>
> 这篇文章记录了我从 flomo 迁移到 Get笔记，并用 AI 重新开发同步插件的过程。希望对同样在 All in AI 路上的你有所启发。
>
> **本项目完全免费开源，欢迎 Star、Fork、PR！**

---

*Made with ❤️ and AI*
