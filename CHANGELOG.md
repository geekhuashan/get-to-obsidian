# Changelog

All notable changes to the Get笔记 Importer plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Automated testing framework
- English UI localization
- Export functionality (Obsidian → Get笔记)
- Batch operations for memo management

---

## [2.0.0] - 2026-01-12

### 🎉 Major Release - Complete Rebranding

This is a major release with complete rebranding from "flomo" to "Get笔记" and significant UI improvements.

### Added
- ✨ **New UI Design**: Complete redesign of plugin interface with modern, organized sections
- ✨ **Chinese UI**: Full Chinese localization of all UI elements
- ✨ **New Icon**: Notebook-style SVG icon replacing old icon
- ✨ **Sync Status Display**: Real-time display of sync status, last sync time, and memo count
- ✨ **Reset Sync History**: New button to clear sync history and re-import all memos
- ✨ **Comprehensive Documentation**: Complete rewrite of README with detailed guides
- ✨ **Contributing Guidelines**: Added CONTRIBUTING.md for open-source contributors
- ✨ **Roadmap**: Added ROADMAP.md showing future development plans
- ✨ **Architecture Documentation**: Added ARCHITECTURE.md explaining technical details
- ✨ **English Documentation**: Added README.en.md for international users

### Changed
- 🔄 **Global Rename**: All "flomo" references changed to "Get" or "Get笔记"
  - Directory: `lib/flomo/` → `lib/get/`
  - Classes: `FlomoImporter` → `GetImporter`, `FlomoCore` → `GetCore`, etc.
  - Settings: `flomoTarget` → `getTarget`
  - All variable and method names updated
- 🎨 **UI Reorganization**: Settings organized into clear sections:
  - Manual Import
  - Basic Settings
  - Visualization Settings
  - Advanced Options
  - Auto Sync
  - Data Management
- 📝 **Documentation Updates**: All documentation files updated with new terminology
- 🚀 **Deploy Script**: Removed hardcoded paths, added environment variable support

### Fixed
- 🐛 **Canvas File Paths**: Fixed file path matching issue causing empty Canvas
- 🐛 **Moments Sorting**: Fixed time sorting to show newest memos first
- 🐛 **HTML Parsing**: Fixed `cloneNode is not a function` error by using node-html-parser compatible methods
- 🐛 **Login URL Detection**: Updated URL pattern from `**/syncNote**` to `**/note**`

### Security
- 🔒 **Removed Sensitive Files**: Updated .gitignore to exclude:
  - `.claude/` directory
  - Build artifacts (`main.js`, `*.js.map`)
  - Local cache (`.get/`)
  - IDE settings
- 🔒 **Path Sanitization**: Removed all hardcoded personal paths from deploy scripts

### Documentation
- 📖 **README.md**: Complete rewrite with 500+ lines of detailed documentation
  - Installation guide with troubleshooting
  - Step-by-step usage instructions with screenshots
  - FAQ section
  - Development guide
  - Architecture explanation
- 📖 **CONTRIBUTING.md**: Comprehensive contribution guidelines
- 📖 **ROADMAP.md**: Project roadmap and future plans
- 📖 **ARCHITECTURE.md**: Technical architecture documentation
- 📖 **README.en.md**: English version of main documentation
- 📖 **.gitignore**: Enhanced with build artifacts and sensitive files

### Migration Notes

**Upgrading from 1.x:**
- The plugin has been completely rebranded to "Get笔记"
- All functionality remains the same
- Settings will be automatically migrated
- No action required for existing users

---

## [1.4.0] - 2025-11-03

### Added
- 🔇 **Silent Background Sync**: Export process runs without opening browser windows
- 🔄 **Content Update Detection**: Automatically detects and re-imports edited memos
- 🗑️ **Reset Sync History Button**: UI button to clear sync history

### Changed
- 📁 **Simplified Attachment Structure**:
  - Old: `get picture/file/2025-11-03/4852/filename.m4a`
  - New: `get attachment/2025-11-03/filename.m4a`
- ⚙️ **Dynamic Path Configuration**: Attachment paths now respect "Get笔记 Home" setting

### Fixed
- 🐛 **Attachment Reference Updates**: Fixed regex to match all `![text]()` patterns
- 🐛 **Variable Scope Issue**: Fixed compilation error in attachment copying

### Technical
- Refactored attachment copying with specialized method
- Enhanced incremental sync algorithm
- Improved debugging support with better logging

### Documentation
- Created CLAUDE.md with project overview
- Added deploy.sh script for development
- Improved inline code comments

### Migration from 1.3.x to 1.4.0

**Option A: Clean re-import (recommended)**
1. Click "Reset Sync History" in settings
2. Delete old folders: `memos/` and `get picture/`
3. Run sync again

**Option B: Keep existing memos**
- Sync normally
- Old memos keep old paths
- New memos use new paths

---

## [1.3.0] - 2025-09-15

### Added
- Manual sync from ZIP file
- Hourly auto-sync option
- Canvas size customization

### Changed
- Improved error messages
- Better sync progress indication

### Fixed
- Fixed authentication timeout issues
- Fixed memo parsing for special characters

---

## [1.2.0] - 2025-07-20

### Added
- Bi-directional link support (experimental)
- Merge memos by date option
- Tag extraction and display

### Fixed
- Fixed highlight mark conversion
- Fixed attachment download failures

---

## [1.1.0] - 2025-05-10

### Added
- Moments visualization
- Canvas visualization
- Auto-sync on startup

### Changed
- Improved incremental sync algorithm
- Better memo ID generation

---

## [1.0.0] - 2025-03-01

### Added
- Initial release
- Basic sync functionality
- Incremental sync
- Manual authentication
- Playwright-based export

---

## Version Numbering

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality in a backwards compatible manner
- **PATCH** version for backwards compatible bug fixes

## Links

- [Unreleased Changes](https://github.com/geekhuashan/get-to-obsidian/compare/v2.0.0...HEAD)
- [2.0.0 Release](https://github.com/geekhuashan/get-to-obsidian/releases/tag/v2.0.0)
- [Full Changelog](https://github.com/geekhuashan/get-to-obsidian/blob/main/CHANGELOG.md)
