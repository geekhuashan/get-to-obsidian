# Changelog

All notable changes to the Get笔记 Importer plugin will be documented in this file.

## [2.0.0] - 2025-11-03

### ✨ Major Features

#### 🔇 Silent Background Sync
- **Headless browser mode**: Export process now runs silently in the background without opening visible browser windows
- Authentication still shows browser window for CAPTCHA/login when needed
- Significantly improves user experience during automatic sync operations

#### 📁 Simplified Attachment Structure
- **Flattened directory hierarchy**: Changed from complex 4-level to simple 2-level structure
  - Old: `get picture/file/2025-11-03/4852/filename.m4a`
  - New: `get attachment/2025-11-03/filename.m4a`
- Removed unnecessary `file/` directory layer
- Removed user ID directory layer (e.g., `4852/`)
- Renamed `get picture` to `get attachment` for clarity (supports all file types)
- Automatically handles attachment reference updates in memo markdown

#### ⚙️ Dynamic Path Configuration
- Attachment paths now respect the "Get笔记 Home" setting in plugin UI
- No more hardcoded paths - fully customizable based on user preferences
- Example: If Get笔记 Home is set to "10 get", attachments go to "10 get/get attachment/"

#### 🔄 Content Update Detection
- **Smart change detection**: Plugin now detects when memos are edited in Get笔记
- Compares both timestamp AND content hash to identify updates
- Automatically re-imports updated memos without manual intervention
- Prevents duplicate imports while ensuring latest content is synced

#### 🗑️ Reset Sync History
- New "Reset Sync History" button in plugin settings UI
- Allows clearing all synced memo IDs to re-import entire Get笔记 database
- Useful when changing attachment paths or structure
- Shows confirmation dialog with clear warnings about file overwrites
- Displays current sync statistics (last sync time, synced memo count)

### 🐛 Bug Fixes

#### Fixed Attachment Reference Updates
- **Regex improvement**: Now correctly updates attachment references in memo content
- Previously only matched `![]()` with empty alt text
- Now matches `![any text]()` and preserves alt text
- Handles all attachment types (images, audio, video, etc.)

#### Fixed Variable Scope Issue
- Resolved compilation error in `copyAttachmentsRecursively()` method
- Moved `targetPath` variable declaration outside try-catch block for proper scoping

### 🔧 Technical Improvements

#### Refactored Attachment Copying
- New specialized method: `copyAttachmentsSkipUserIdDir()`
- Efficiently handles Get笔记's 3-level export structure (date/userID/files)
- Flattens to 2-level vault structure (date/files)
- Skips empty directories to keep vault clean

#### Enhanced Incremental Sync Algorithm
- Improved memo ID generation for better uniqueness
- Format: `${timestamp}_${contentHash}_${occurrence}_${total}`
- Backward compatible with old ID formats from previous versions
- More reliable detection of duplicate vs. updated content

#### Better Debugging Support
- Enhanced console logging throughout sync process
- Shows attachment path decisions and file operations
- Helps troubleshoot sync issues

### 📝 Documentation
- Created comprehensive CLAUDE.md with project overview and architecture details
- Added deploy.sh script for easier local development workflow
- Improved inline code comments

### 🔄 Migration Notes

**If upgrading from 1.x to 2.0:**

1. **Attachment path has changed** - The plugin now uses `get attachment/` instead of `get picture/file/`
2. **You need to decide**: Keep old attachments or re-import?

   **Option A: Clean re-import (recommended)**
   - Click "Reset Sync History" button in plugin settings
   - Manually delete old folders:
     - `[Get笔记 Home]/memos/`
     - `[Get笔记 Home]/get picture/` (if exists)
   - Run sync again - all memos and attachments will be re-imported with new structure

   **Option B: Keep existing memos**
   - Just sync normally - only new memos will be imported
   - Old memos will keep old attachment paths
   - New memos will use new attachment paths
   - Mixed structure, but nothing breaks

3. **Content update detection**: If you edit a memo in Get笔记 after upgrading, it will be automatically detected and re-imported

### 🙏 Credits

This release includes significant improvements forked from [jia6y/get-to-obsidian](https://github.com/jia6y/get-to-obsidian).

Special thanks to the original author for creating this excellent plugin.

---

## [1.4.0] - Previous Releases

See git history for changes in versions 1.0.0 - 1.4.0.
