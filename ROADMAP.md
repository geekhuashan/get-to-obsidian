# 项目路线图 | Roadmap

本文档展示 Get笔记 Importer 的开发计划和未来愿景。

[中文](#中文) | [English](#english)

---

## 中文

### 📍 当前版本：v2.0.0

最后更新：2026-01-12

---

## 🎯 短期目标（1-3 个月）

### 🧪 测试框架 [高优先级]
**状态**: 📋 计划中
**预计时间**: 2026年2月

**目标**：
- 建立自动化测试框架
- 单元测试覆盖核心功能
- 集成测试覆盖同步流程

**原因**：
- 提高代码质量和稳定性
- 减少回归问题
- 方便重构和添加新功能

**任务**：
- [ ] 选择测试框架（Jest/Vitest）
- [ ] 为核心类编写单元测试
  - [ ] `GetCore` - HTML 解析和 ID 生成
  - [ ] `GetImporter` - 导入逻辑
  - [ ] `GetAuth` - 认证流程（模拟）
- [ ] 编写集成测试
  - [ ] 完整同步流程
  - [ ] Canvas 生成
  - [ ] Moments 生成
- [ ] 配置 CI/CD（GitHub Actions）

---

### 🌐 UI 国际化 [中优先级]
**状态**: 📋 计划中
**预计时间**: 2026年2月

**目标**：
- 支持多语言 UI
- 英文界面支持
- 自动语言检测

**原因**：
- 扩大用户群体
- Get笔记 有国际用户
- 提升用户体验

**任务**：
- [ ] 提取所有 UI 文本到语言文件
- [ ] 实现 i18n 框架
- [ ] 添加英文翻译
- [ ] 添加语言切换选项
- [ ] 测试不同语言环境

---

### ⚡ 性能优化 [中优先级]
**状态**: 📋 计划中
**预计时间**: 2026年3月

**目标**：
- 加快大量笔记的同步速度
- 减少内存占用
- 优化 UI 响应性

**任务**：
- [ ] 分析性能瓶颈
- [ ] 优化 HTML 解析算法
- [ ] 实现分批处理（大量笔记）
- [ ] 优化附件下载并发
- [ ] 添加进度条和取消功能

---

## 🚀 中期目标（3-6 个月）

### 📤 导出功能 [高优先级]
**状态**: 💡 构思中
**预计时间**: 2026年4月

**目标**：
- 支持从 Obsidian 导出到 Get笔记
- 双向同步能力

**功能设计**：
- 选择 Obsidian 笔记导出到 Get笔记
- 支持批量导出
- 保留格式和附件
- 同步状态追踪

**挑战**：
- Get笔记 API 调研（如果有）
- 或使用 Playwright 模拟网页操作
- 格式转换（Markdown → Get笔记 格式）

**任务**：
- [ ] 调研 Get笔记 API
- [ ] 设计导出界面
- [ ] 实现 Markdown 转换器
- [ ] 实现上传逻辑
- [ ] 添加冲突处理

---

### 🔍 高级搜索和筛选 [中优先级]
**状态**: 💡 构思中
**预计时间**: 2026年5月

**目标**：
- 在插件内搜索已同步的笔记
- 按标签、日期、关键词筛选
- 快速访问特定笔记

**功能设计**：
- 搜索框 UI
- 标签云展示
- 日期选择器
- 搜索结果预览
- 快速跳转到笔记

**任务**：
- [ ] 设计搜索界面
- [ ] 实现全文搜索
- [ ] 实现标签筛选
- [ ] 实现日期范围筛选
- [ ] 添加搜索历史

---

### 📊 统计和分析 [低优先级]
**状态**: 💡 构思中
**预计时间**: 2026年6月

**目标**：
- 展示笔记统计信息
- 可视化数据分析

**功能设计**：
- 总笔记数、字数统计
- 每日/每月笔记趋势图
- 标签使用频率
- 最活跃时间段分析

**任务**：
- [ ] 收集统计数据
- [ ] 选择图表库
- [ ] 设计统计页面
- [ ] 实现数据可视化

---

## 🌟 长期愿景（6+ 个月）

### 🔄 实时同步 [研究中]
**状态**: 🔬 研究中

**目标**：
- 监听 Get笔记 变化，实时同步
- 监听 Obsidian 变化，实时上传

**挑战**：
- Get笔记 没有公开 API
- 需要轮询或 WebSocket 连接
- 性能和电池消耗考虑

---

### 🤖 AI 功能集成 [构思中]
**状态**: 💡 构思中

**目标**：
- 智能标签建议
- 笔记自动分类
- 内容摘要生成
- 相关笔记推荐

**技术栈**：
- 本地 LLM 或云端 API
- 向量数据库（相似度搜索）

---

### 📱 移动端支持 [待评估]
**状态**: ❓ 待评估

**目标**：
- 支持 Obsidian Mobile
- 移动端友好的同步方式

**挑战**：
- Playwright 不支持移动端
- 需要寻找替代方案（API、网页爬虫等）
- 性能和存储限制

---

### 🔌 插件生态系统 [构思中]
**状态**: 💡 构思中

**目标**：
- 与其他 Obsidian 插件集成
- 提供 API 供其他插件使用

**可能集成**：
- Dataview：查询 Get笔记 数据
- Templater：使用 Get笔记 数据创建模板
- Calendar：在日历中显示 Get笔记

---

## 🐛 持续改进

### 质量保证
- 持续修复 Bug
- 优化用户体验
- 改进错误处理
- 增强日志系统

### 文档维护
- 保持文档更新
- 添加更多示例
- 录制视频教程
- 翻译文档到其他语言

### 社区建设
- 及时响应 Issues
- 审核 Pull Requests
- 收集用户反馈
- 定期发布更新

---

## 📝 功能请求投票

我们使用 GitHub Issues 收集功能请求。如果你希望看到某个功能，请：

1. 检查 [Issues](https://github.com/geekhuashan/get-to-obsidian/issues) 是否已有相关建议
2. 如果有，点赞 👍 表示支持
3. 如果没有，[创建新 Issue](https://github.com/geekhuashan/get-to-obsidian/issues/new?labels=enhancement)

**高票功能会优先开发！**

---

## 🤝 如何贡献

想要帮助实现路线图上的功能？太棒了！

1. 查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何贡献
2. 在 Issue 中评论你想要实现的功能
3. 提交 Pull Request

所有贡献者都会被认可！

---

## 📊 版本发布计划

| 版本 | 预计时间 | 主要功能 |
|------|---------|---------|
| **v2.1.0** | 2026年2月 | 测试框架、UI 国际化 |
| **v2.2.0** | 2026年3月 | 性能优化、批量操作 |
| **v2.3.0** | 2026年4月 | 导出功能（Beta） |
| **v3.0.0** | 2026年6月 | 双向同步、高级搜索 |

> **注意**：时间表可能根据开发进度和社区反馈调整。

---

## 💬 反馈和建议

对路线图有想法？

- **GitHub Issues**: [提出建议](https://github.com/geekhuashan/get-to-obsidian/issues/new?labels=enhancement)
- **GitHub Discussions**: [参与讨论](https://github.com/geekhuashan/get-to-obsidian/discussions)

你的反馈对项目发展至关重要！

---

## English

### 📍 Current Version: v2.0.0

Last Updated: 2026-01-12

---

## 🎯 Short-term Goals (1-3 months)

### 🧪 Testing Framework [High Priority]
**Status**: 📋 Planned
**Timeline**: February 2026

**Objective**:
- Establish automated testing framework
- Unit test coverage for core features
- Integration tests for sync workflow

**Tasks**:
- [ ] Choose testing framework (Jest/Vitest)
- [ ] Write unit tests for core classes
- [ ] Write integration tests
- [ ] Configure CI/CD (GitHub Actions)

---

### 🌐 UI Internationalization [Medium Priority]
**Status**: 📋 Planned
**Timeline**: February 2026

**Objective**:
- Multi-language UI support
- English interface
- Automatic language detection

**Tasks**:
- [ ] Extract all UI text to language files
- [ ] Implement i18n framework
- [ ] Add English translation
- [ ] Add language switcher
- [ ] Test different locales

---

### ⚡ Performance Optimization [Medium Priority]
**Status**: 📋 Planned
**Timeline**: March 2026

**Objective**:
- Faster sync for large memo collections
- Reduced memory usage
- Better UI responsiveness

**Tasks**:
- [ ] Performance profiling
- [ ] Optimize HTML parsing
- [ ] Implement batch processing
- [ ] Optimize attachment downloads
- [ ] Add progress bar and cancel option

---

## 🚀 Mid-term Goals (3-6 months)

### 📤 Export Functionality [High Priority]
**Status**: 💡 Ideation
**Timeline**: April 2026

**Objective**:
- Export from Obsidian to Get笔记
- Bi-directional sync capability

**Features**:
- Select Obsidian notes to export
- Batch export support
- Preserve formatting and attachments
- Sync status tracking

**Challenges**:
- Get笔记 API research
- Or use Playwright for web automation
- Format conversion (Markdown → Get笔记)

---

### 🔍 Advanced Search and Filtering [Medium Priority]
**Status**: 💡 Ideation
**Timeline**: May 2026

**Objective**:
- Search synced memos within plugin
- Filter by tags, dates, keywords
- Quick access to specific memos

---

### 📊 Statistics and Analytics [Low Priority]
**Status**: 💡 Ideation
**Timeline**: June 2026

**Objective**:
- Display memo statistics
- Data visualization

---

## 🌟 Long-term Vision (6+ months)

### 🔄 Real-time Sync [Under Research]
**Status**: 🔬 Research

**Objective**:
- Monitor Get笔记 changes, sync in real-time
- Monitor Obsidian changes, upload in real-time

---

### 🤖 AI Integration [Ideation]
**Status**: 💡 Ideation

**Objective**:
- Smart tag suggestions
- Automatic memo categorization
- Content summary generation
- Related memo recommendations

---

### 📱 Mobile Support [To Be Evaluated]
**Status**: ❓ TBE

**Objective**:
- Support Obsidian Mobile
- Mobile-friendly sync methods

**Challenges**:
- Playwright doesn't support mobile
- Need alternative solutions

---

## 📝 Feature Request Voting

We collect feature requests via GitHub Issues:

1. Check existing [Issues](https://github.com/geekhuashan/get-to-obsidian/issues)
2. Upvote 👍 features you want
3. [Create new Issue](https://github.com/geekhuashan/get-to-obsidian/issues/new?labels=enhancement) if not exists

**High-voted features get priority!**

---

## 📊 Release Schedule

| Version | Timeline | Major Features |
|---------|----------|----------------|
| **v2.1.0** | Feb 2026 | Testing, UI i18n |
| **v2.2.0** | Mar 2026 | Performance, Batch ops |
| **v2.3.0** | Apr 2026 | Export (Beta) |
| **v3.0.0** | Jun 2026 | Bi-directional sync |

> **Note**: Timeline subject to change based on progress and feedback.

---

<div align="center">

**Your feedback shapes the future of this project!**

Made with ❤️ by the community

</div>
