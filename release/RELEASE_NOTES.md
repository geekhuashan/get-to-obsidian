# Get笔记 Importer v2.0.0 - 重大更新

## 🎉 主要变更

### 全新品牌
- ✨ **完全重命名**：从 "flomo" 全面更名为 "Get笔记"
- ✨ **新图标**：采用笔记本样式的 SVG 图标
- ✨ **中文 UI**：全新的中文用户界面，更友好易用

### 界面优化
- 🎨 **现代化设计**：完全重新设计的插件界面
- 📊 **同步状态显示**：实时显示上次同步时间和笔记数量
- 🗂️ **分类清晰**：设置按功能模块组织（手动导入、基本设置、可视化、高级选项等）

### 核心功能
- ✅ **增量同步**：智能识别新笔记，避免重复导入
- ✅ **智能更新检测**：自动检测 Get笔记 中的笔记修改并重新导入
- ✅ **多种同步方式**：支持启动时自动同步、定时同步、手动同步
- ✅ **重置同步历史**：新增按钮可清除同步历史重新导入

### 技术改进
- 🐛 **修复 Canvas 文件路径匹配**：解决 Canvas 显示为空的问题
- 🐛 **修复 Moments 排序**：按时间倒序正确显示
- 🐛 **修复 HTML 解析**：兼容 node-html-parser 库
- 🐛 **修复登录 URL 检测**：更新为正确的登录成功 URL

### 文档完善
- 📚 **完整文档体系**：
  - README.md（中文，500+ 行详细文档）
  - README.en.md（英文版）
  - CONTRIBUTING.md（贡献指南，中英双语）
  - ROADMAP.md（项目路线图）
  - ARCHITECTURE.md（技术架构文档）
  - CHANGELOG.md（标准格式更新日志）
- 🔒 **安全优化**：移除敏感文件，优化 .gitignore

---

## 📥 安装方式

### 方式一：手动安装（推荐新用户）

1. **下载文件**
   - 从本 Release 下载 `get-importer-v2.0.0.zip`
   - 或分别下载 `main.js`, `manifest.json`, `styles.css`

2. **安装到 Obsidian**
   ```bash
   # 解压到插件目录
   unzip get-importer-v2.0.0.zip -d ~/.obsidian/plugins/get-importer/

   # 或手动复制三个文件到
   # YourVault/.obsidian/plugins/get-importer/
   ```

3. **安装 Playwright（必需！）**
   ```bash
   npx playwright@1.43.1 install
   ```

4. **启用插件**
   - 重启 Obsidian
   - 设置 → 第三方插件 → 关闭安全模式
   - 找到 "Get笔记 Importer" 并启用

### 方式二：从源码构建

```bash
git clone https://github.com/geekhuashan/get-to-obsidian.git
cd get-to-obsidian
npm install
npx playwright@1.43.1 install
npm run build
# 复制 main.js, manifest.json, styles.css 到插件目录
```

---

## ⚠️ 重要说明

### 必须安装 Playwright
本插件使用 Playwright 进行浏览器自动化，这是同步功能的核心依赖。

```bash
# 安装 Playwright（必需）
npx playwright@1.43.1 install
```

如果在中国大陆安装失败，使用镜像：
```bash
export PLAYWRIGHT_DOWNLOAD_HOST=https://npmmirror.com/mirrors/playwright/
npx playwright@1.43.1 install
```

### 从旧版本升级
如果从 1.x 版本升级：
- 插件已完全重命名为 "Get笔记 Importer"
- 所有功能保持不变
- 设置会自动迁移
- **无需额外操作**

---

## 📖 使用指南

### 首次使用

1. **打开插件**：点击左侧边栏笔记本图标 📓
2. **登录账号**：点击"登录 Get笔记 账号"，在浏览器中完成登录
3. **配置设置**（可选）：调整主文件夹、笔记子目录等
4. **开始同步**：点击"立即同步"

### 日常使用

- **自动同步**：在设置中启用"启动时自动同步"或"每小时自动同步"
- **手动同步**：随时点击"立即同步"按钮
- **查看状态**：界面显示上次同步时间和已同步笔记数

---

## 🐛 已知问题

- Playwright 仅支持桌面端，移动端暂不可用
- 首次同步可能需要较长时间（取决于笔记数量）
- 大量笔记（1000+）可能需要分批同步

---

## 📚 文档资源

- [完整中文文档](https://github.com/geekhuashan/get-to-obsidian/blob/main/README.md)
- [English Documentation](https://github.com/geekhuashan/get-to-obsidian/blob/main/README.en.md)
- [贡献指南](https://github.com/geekhuashan/get-to-obsidian/blob/main/CONTRIBUTING.md)
- [项目路线图](https://github.com/geekhuashan/get-to-obsidian/blob/main/ROADMAP.md)
- [技术架构](https://github.com/geekhuashan/get-to-obsidian/blob/main/ARCHITECTURE.md)
- [更新日志](https://github.com/geekhuashan/get-to-obsidian/blob/main/CHANGELOG.md)

---

## 🤝 贡献

欢迎贡献！这是一个免费开源项目。

- 报告问题：[GitHub Issues](https://github.com/geekhuashan/get-to-obsidian/issues)
- 提交代码：查看 [CONTRIBUTING.md](https://github.com/geekhuashan/get-to-obsidian/blob/main/CONTRIBUTING.md)
- 参与讨论：[GitHub Discussions](https://github.com/geekhuashan/get-to-obsidian/discussions)

---

## 💖 致谢

- 感谢 [Obsidian](https://obsidian.md/) 提供强大的知识管理平台
- 感谢 [Get笔记](https://www.biji.com/) 的优质笔记服务
- 感谢原始项目 [jia6y/get-to-obsidian](https://github.com/jia6y/get-to-obsidian)
- 感谢所有贡献者和使用者

---

## 📄 许可证

MIT License - 完全免费开源，欢迎使用和分享！

---

<div align="center">

**如果这个插件对你有帮助，请给个 ⭐️ Star！**

Made with ❤️ by the Community

</div>
