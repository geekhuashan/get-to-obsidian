# 贡献指南 | Contributing Guide

首先，感谢你考虑为 Get笔记 Importer 做出贡献！这是一个社区驱动的开源项目，我们欢迎所有形式的贡献。

[中文](#中文) | [English](#english)

---

## 中文

### 📋 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
  - [报告 Bug](#报告-bug)
  - [提出功能建议](#提出功能建议)
  - [提交代码](#提交代码)
- [开发指南](#开发指南)
  - [环境搭建](#环境搭建)
  - [代码规范](#代码规范)
  - [提交信息规范](#提交信息规范)
  - [测试](#测试)
- [Pull Request 流程](#pull-request-流程)
- [获取帮助](#获取帮助)

---

### 行为准则

参与本项目，即表示你同意遵守以下准则：

- **尊重他人**：尊重所有贡献者，无论他们的经验水平如何
- **建设性沟通**：提供有建设性的反馈，避免负面或攻击性语言
- **协作精神**：帮助他人，分享知识
- **包容性**：欢迎来自不同背景的贡献者

### 如何贡献

#### 报告 Bug

在报告 Bug 之前：

1. **检查现有 Issues**：确保该问题尚未被报告
2. **确认是 Bug**：尝试在不同环境下复现问题
3. **收集信息**：准备好环境信息、错误日志等

**报告 Bug 时请包含：**

```markdown
### 环境信息
- Obsidian 版本：[例如 1.4.0]
- 操作系统：[例如 macOS 14.1]
- 插件版本：[例如 2.0.0]
- Node.js 版本（如果相关）：[例如 18.0.0]
- Playwright 版本：[例如 1.43.1]

### 问题描述
[清晰描述遇到的问题]

### 复现步骤
1. 打开插件
2. 点击"立即同步"
3. 观察到错误...

### 期望行为
[描述你期望发生什么]

### 实际行为
[描述实际发生了什么]

### 截图/日志
[如果可能，附上截图或错误日志]

### 其他信息
[任何可能相关的额外信息]
```

**创建 Issue**：[点击这里创建 Bug 报告](https://github.com/geekhuashan/get-to-obsidian/issues/new?labels=bug)

#### 提出功能建议

我们欢迎新功能建议！

**提出建议时请包含：**

```markdown
### 功能描述
[清晰描述建议的功能]

### 使用场景
[说明这个功能解决什么问题，帮助谁]

### 建议的实现方式（可选）
[如果有想法，可以描述如何实现]

### 替代方案（可选）
[是否考虑过其他解决方案]

### 优先级
- [ ] 关键（Critical）
- [ ] 重要（High）
- [ ] 一般（Medium）
- [ ] 较低（Low）
```

**创建 Issue**：[点击这里提出功能建议](https://github.com/geekhuashan/get-to-obsidian/issues/new?labels=enhancement)

#### 提交代码

想要直接贡献代码？太棒了！

**适合新手的 Issue**：查找标记为 `good first issue` 的问题

**开始前：**
- 对于小改动（修复拼写错误、更新文档等），可以直接提 PR
- 对于大改动（新功能、重构等），请先创建 Issue 讨论

### 开发指南

#### 环境搭建

```bash
# 1. Fork 仓库到你的 GitHub 账号

# 2. 克隆你 fork 的仓库
git clone git@github.com:你的用户名/get-to-obsidian.git
cd get-to-obsidian

# 3. 添加上游仓库
git remote add upstream git@github.com:geekhuashan/get-to-obsidian.git

# 4. 安装依赖
npm install

# 5. 安装 Playwright（必需）
npx playwright@1.43.1 install

# 6. 创建开发分支
git checkout -b feature/your-feature-name
```

#### 代码规范

本项目使用 **Google TypeScript Style (gts)** 作为代码规范。

**重要规则：**

1. **使用 TypeScript**：所有新代码必须使用 TypeScript
2. **缩进**：使用 2 个空格缩进
3. **命名规范**：
   - 类名：`PascalCase`（例如：`GetImporter`）
   - 方法/变量：`camelCase`（例如：`importMemos`）
   - 常量：`UPPER_SNAKE_CASE`（例如：`GET_CACHE_LOC`）
   - 私有成员：前缀 `_`（例如：`_privateMethod`）
4. **注释**：为复杂逻辑添加清晰的注释
5. **类型安全**：避免使用 `any`，尽量明确类型

**检查代码规范：**

```bash
# 运行 lint 检查
npm run lint

# 自动修复格式问题
npm run fix
```

**提交前必须：**
- ✅ `npm run lint` 无错误
- ✅ `npm run build` 构建成功

#### 提交信息规范

使用 [约定式提交](https://www.conventionalcommits.org/) 格式：

```
<类型>(<范围>): <描述>

[可选的正文]

[可选的脚注]
```

**类型（type）：**
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档修改
- `style`: 代码格式（不影响代码运行）
- `refactor`: 重构（既不是新功能也不是修复）
- `perf`: 性能优化
- `test`: 添加测试
- `chore`: 构建过程或辅助工具的变动

**示例：**

```bash
# 好的提交信息
git commit -m "feat(sync): 添加断点续传功能"
git commit -m "fix(canvas): 修复文件路径匹配问题"
git commit -m "docs(readme): 更新安装说明"

# 不好的提交信息
git commit -m "更新"
git commit -m "修复 bug"
git commit -m "优化代码"
```

**多行提交信息示例：**

```bash
git commit -m "feat(moments): 添加时间线过滤功能

- 支持按标签过滤笔记
- 支持按日期范围筛选
- 添加搜索功能

Closes #123"
```

#### 测试

目前项目**没有自动化测试**（这是一个可以贡献的领域！）。

**手动测试清单：**

在提交 PR 前，请确保测试以下功能：

- [ ] 插件能够正常加载
- [ ] 登录 Get笔记 成功
- [ ] 同步功能正常（增量同步、全量同步）
- [ ] Canvas 生成正确
- [ ] Moments 生成正确
- [ ] 设置保存和加载正常
- [ ] 没有控制台错误

**测试环境建议：**
- 在干净的 Obsidian vault 中测试
- 测试不同的设置组合
- 检查边界情况（空笔记、大量笔记等）

### Pull Request 流程

#### 1. 准备你的更改

```bash
# 确保你的分支是最新的
git checkout main
git pull upstream main

# 切换回你的功能分支
git checkout feature/your-feature-name

# 合并最新的 main 分支
git merge main

# 或使用 rebase（推荐）
git rebase main
```

#### 2. 推送到你的 fork

```bash
git push origin feature/your-feature-name
```

#### 3. 创建 Pull Request

1. 访问 [Pull Request 页面](https://github.com/geekhuashan/get-to-obsidian/pulls)
2. 点击 "New Pull Request"
3. 选择你的分支
4. 填写 PR 模板

**PR 标题格式：**
```
<类型>: <简短描述>
```

**PR 描述应包含：**

```markdown
## 变更说明
[描述这个 PR 做了什么改动]

## 变更类型
- [ ] Bug 修复
- [ ] 新功能
- [ ] 文档更新
- [ ] 代码重构
- [ ] 性能优化
- [ ] 其他（请说明）

## 关联 Issue
Closes #[Issue 编号]

## 测试
[描述如何测试这些更改]

- [ ] 在 macOS 上测试
- [ ] 在 Windows 上测试
- [ ] 在 Linux 上测试

## 截图（如果适用）
[添加截图展示变更]

## Checklist
- [ ] 代码遵循项目规范（`npm run lint` 通过）
- [ ] 已添加必要的注释
- [ ] 文档已更新（如果需要）
- [ ] 手动测试通过
- [ ] 没有引入新的警告
```

#### 4. 代码审查

- 维护者会审查你的 PR
- 可能会提出修改建议
- 请及时响应反馈
- 根据反馈进行修改

#### 5. 合并

- PR 被批准后，维护者会合并你的代码
- 感谢你的贡献！🎉

### 开发技巧

#### 调试插件

1. **启用开发者工具**
   ```
   Ctrl/Cmd + Shift + I
   ```

2. **查看控制台日志**
   - 所有 `console.log` 输出会显示在这里
   - 错误堆栈也会显示

3. **实时重载**
   ```bash
   # 开发模式（修改后自动构建）
   npm run dev
   ```
   然后在 Obsidian 中使用 `Ctrl/Cmd + R` 重载插件

#### 常见开发任务

```bash
# 开发模式（监听文件变化）
npm run dev

# 生产构建
npm run build

# 代码检查
npm run lint

# 自动修复代码风格
npm run fix

# 清理构建产物
npm run clean

# 更新版本号
npm run version
```

#### 推荐的开发工具

- **IDE**: VSCode（推荐）或 WebStorm
- **VSCode 插件**:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - GitLens

### 文档贡献

文档和代码一样重要！

**可以改进的文档：**
- 修复拼写错误
- 改进措辞
- 添加示例
- 翻译文档
- 添加截图/GIF

**文档位置：**
- `README.md` - 主要使用文档
- `README.en.md` - 英文版
- `AGENTS.md` - 项目技术文档
- `ARCHITECTURE.md` - 架构说明
- `CHANGELOG.md` - 更新日志

### 获取帮助

遇到问题？我们很乐意帮助！

- **GitHub Issues**: [提问](https://github.com/geekhuashan/get-to-obsidian/issues/new?labels=question)
- **GitHub Discussions**: [加入讨论](https://github.com/geekhuashan/get-to-obsidian/discussions)

### 贡献者认可

所有贡献者都会被添加到 README 的致谢部分。

感谢你的贡献！❤️

---

## English

### 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Submitting Code](#submitting-code)
- [Development Guide](#development-guide)
  - [Setting Up](#setting-up)
  - [Code Style](#code-style)
  - [Commit Messages](#commit-messages)
  - [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Getting Help](#getting-help)

---

### Code of Conduct

By participating in this project, you agree to:

- **Respect others**: Respect all contributors regardless of experience level
- **Constructive communication**: Provide constructive feedback, avoid negative language
- **Collaboration**: Help others and share knowledge
- **Inclusivity**: Welcome contributors from all backgrounds

### How to Contribute

#### Reporting Bugs

Before reporting a bug:

1. **Check existing Issues**: Ensure the issue hasn't been reported
2. **Confirm it's a bug**: Try to reproduce in different environments
3. **Gather information**: Prepare environment info, error logs, etc.

**When reporting bugs, include:**

```markdown
### Environment
- Obsidian Version: [e.g., 1.4.0]
- Operating System: [e.g., macOS 14.1]
- Plugin Version: [e.g., 2.0.0]
- Node.js Version (if relevant): [e.g., 18.0.0]
- Playwright Version: [e.g., 1.43.1]

### Description
[Clear description of the issue]

### Steps to Reproduce
1. Open plugin
2. Click "Sync Now"
3. Observe error...

### Expected Behavior
[What you expected to happen]

### Actual Behavior
[What actually happened]

### Screenshots/Logs
[If possible, include screenshots or error logs]

### Additional Context
[Any other relevant information]
```

**Create Issue**: [Click here to report a bug](https://github.com/geekhuashan/get-to-obsidian/issues/new?labels=bug)

#### Suggesting Features

We welcome new feature suggestions!

**When suggesting features, include:**

```markdown
### Feature Description
[Clear description of the proposed feature]

### Use Case
[Explain what problem this solves and who it helps]

### Proposed Implementation (Optional)
[If you have ideas, describe how to implement]

### Alternatives (Optional)
[Have you considered other solutions?]

### Priority
- [ ] Critical
- [ ] High
- [ ] Medium
- [ ] Low
```

**Create Issue**: [Click here to suggest a feature](https://github.com/geekhuashan/get-to-obsidian/issues/new?labels=enhancement)

#### Submitting Code

Want to contribute code directly? Awesome!

**Good first issues**: Look for issues labeled `good first issue`

**Before starting:**
- For small changes (typo fixes, documentation updates), feel free to submit PR directly
- For major changes (new features, refactoring), please create an Issue first to discuss

### Development Guide

#### Setting Up

```bash
# 1. Fork the repository to your GitHub account

# 2. Clone your forked repository
git clone git@github.com:your-username/get-to-obsidian.git
cd get-to-obsidian

# 3. Add upstream repository
git remote add upstream git@github.com:geekhuashan/get-to-obsidian.git

# 4. Install dependencies
npm install

# 5. Install Playwright (required)
npx playwright@1.43.1 install

# 6. Create development branch
git checkout -b feature/your-feature-name
```

#### Code Style

This project uses **Google TypeScript Style (gts)**.

**Important rules:**

1. **Use TypeScript**: All new code must be in TypeScript
2. **Indentation**: Use 2 spaces
3. **Naming conventions**:
   - Class names: `PascalCase` (e.g., `GetImporter`)
   - Methods/variables: `camelCase` (e.g., `importMemos`)
   - Constants: `UPPER_SNAKE_CASE` (e.g., `GET_CACHE_LOC`)
   - Private members: prefix with `_` (e.g., `_privateMethod`)
4. **Comments**: Add clear comments for complex logic
5. **Type safety**: Avoid `any`, specify types explicitly

**Check code style:**

```bash
# Run lint check
npm run lint

# Auto-fix formatting issues
npm run fix
```

**Before committing:**
- ✅ `npm run lint` passes
- ✅ `npm run build` succeeds

#### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no code logic changes)
- `refactor`: Refactoring (neither feature nor fix)
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Build process or tooling changes

**Examples:**

```bash
# Good commit messages
git commit -m "feat(sync): add resume from interruption"
git commit -m "fix(canvas): fix file path matching"
git commit -m "docs(readme): update installation guide"

# Bad commit messages
git commit -m "update"
git commit -m "fix bug"
git commit -m "optimize code"
```

#### Testing

Currently the project **has no automated tests** (this is an area you can contribute to!).

**Manual testing checklist:**

Before submitting PR, ensure you test:

- [ ] Plugin loads correctly
- [ ] Login to Get笔记 succeeds
- [ ] Sync functions work (incremental and full sync)
- [ ] Canvas generates correctly
- [ ] Moments generates correctly
- [ ] Settings save and load properly
- [ ] No console errors

### Pull Request Process

#### 1. Prepare Your Changes

```bash
# Ensure your branch is up to date
git checkout main
git pull upstream main

# Switch back to your feature branch
git checkout feature/your-feature-name

# Merge latest main
git merge main

# Or use rebase (recommended)
git rebase main
```

#### 2. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

#### 3. Create Pull Request

1. Visit [Pull Request page](https://github.com/geekhuashan/get-to-obsidian/pulls)
2. Click "New Pull Request"
3. Select your branch
4. Fill in PR template

**PR description should include:**

```markdown
## Changes
[Describe what this PR does]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance optimization
- [ ] Other (please specify)

## Related Issue
Closes #[Issue number]

## Testing
[Describe how to test these changes]

- [ ] Tested on macOS
- [ ] Tested on Windows
- [ ] Tested on Linux

## Screenshots (if applicable)
[Add screenshots to demonstrate changes]

## Checklist
- [ ] Code follows project standards (`npm run lint` passes)
- [ ] Added necessary comments
- [ ] Documentation updated (if needed)
- [ ] Manual testing passed
- [ ] No new warnings introduced
```

#### 4. Code Review

- Maintainers will review your PR
- May suggest modifications
- Please respond to feedback promptly
- Make changes based on feedback

#### 5. Merge

- After PR approval, maintainers will merge your code
- Thank you for your contribution! 🎉

### Getting Help

Need help? We're here!

- **GitHub Issues**: [Ask a question](https://github.com/geekhuashan/get-to-obsidian/issues/new?labels=question)
- **GitHub Discussions**: [Join discussion](https://github.com/geekhuashan/get-to-obsidian/discussions)

### Contributor Recognition

All contributors will be acknowledged in the README.

Thank you for your contribution! ❤️

---

<div align="center">

**Every contribution, no matter how small, is valuable!**

Made with ❤️ by the community

</div>
