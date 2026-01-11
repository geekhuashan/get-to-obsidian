# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Get笔记 Importer** is an Obsidian plugin that syncs notes from Get笔记 (a Chinese note-taking service) into Obsidian. It's a desktop-only plugin that uses Playwright for browser automation to authenticate and export data from Get笔记.

**Key Features:**
- Incremental sync (only imports new memos using content-based ID generation)
- Multiple sync methods: auto-sync on startup, hourly intervals, manual sync
- Optional Canvas and Moments visualization
- Experimental bi-directional link support and date-based memo merging

## Development Commands

### Setup
```bash
npm install
npx playwright@1.43.1 install  # REQUIRED - plugin depends on this exact version
```

### Building
```bash
npm run dev        # Development mode with watch (esbuild + sourcemaps)
npm run build      # Production build (TypeScript check + minified esbuild)
npm run compile    # TypeScript compilation only
```

### Code Quality
```bash
npm run lint       # Run ESLint (gts - Google TypeScript Style)
npm run fix        # Auto-fix linting issues
```

### Versioning
```bash
npm run version    # Bump version (updates manifest.json & versions.json for BRAT)
```

**Build Output:** Single bundled file `main.js` (CommonJS, ES2018 target)

## Architecture

### Core Data Flow

```
Authentication (lib/get/auth.ts)
    ↓ - Playwright-based login
    ↓ - Stores credentials in ~/.get/cache/playwright/get_auth.json
    ↓
Export (lib/get/exporter.ts)
    ↓ - Playwright automates browser to download HTML export
    ↓ - Saves to ~/.get/cache/playwright/get_export.zip
    ↓
Parse & Process (lib/get/core.ts - Get笔记Core class)
    ↓ - Parses HTML with node-html-parser
    ↓ - Generates unique memo IDs: ${timestamp}_${contentHash}_${occurrence}_${total}
    ↓ - Filters against syncedMemoIds array for incremental sync
    ↓ - Supports backward compatibility with old ID format
    ↓
Import (lib/get/importer.ts - Get笔记Importer class)
    ↓ - Creates markdown files using Obsidian Vault API
    ↓ - Copies attachments to "10 get/get picture/" (hardcoded path)
    ↓ - Optionally generates Canvas/Moments visualizations
    ↓
State Update (main.ts)
    ↓ - Saves new syncedMemoIds to plugin settings
    ↓ - Updates lastSyncTime
```

### Key Classes & Responsibilities

- **main.ts:** Plugin entry point
  - `Get笔记ImporterPlugin` class extends Obsidian's Plugin
  - Manages settings, auto-sync timers (startup + hourly interval)
  - Registers commands (`open-get-importer`, `sync-get-now`)
  - Ribbon icon for quick access

- **lib/get/core.ts:** Core data processing
  - `Get笔记Core` class: HTML parsing, memo extraction, ID generation
  - `loadMemos()`: Iterates through `<div class="memo">` elements
  - `generateMemoId()`: Creates unique IDs for incremental sync
  - Content hashing using simple sum algorithm

- **lib/get/auth.ts:** Authentication layer
  - `Get笔记Auth` class: Playwright-based login automation
  - Handles email/phone + password + CAPTCHA scenarios
  - Caches authentication state

- **lib/get/exporter.ts:** Export automation
  - `Get笔记Exporter` class: Automates Get笔记 export via Playwright
  - Downloads HTML backup zip file

- **lib/get/importer.ts:** Import orchestration
  - `Get笔记Importer` class: Coordinates import process
  - `importGet笔记File()`: Main entry point
  - Groups memos by date, handles merge-by-date option
  - Manages attachment copying (recursive directory operations)

- **lib/obIntegration/canvas.ts:** Canvas generation
  - `generateCanvas()`: Creates Obsidian Canvas JSON
  - Two modes: content embedding or file linking

- **lib/obIntegration/moments.ts:** Moments generation
  - `generateMoments()`: Creates timeline markdown file
  - Embeds links to all imported memos chronologically

### Incremental Sync Algorithm

**Critical Implementation Detail:**

The plugin generates a unique ID for each memo based on:
1. **Timestamp:** Exact date/time of the memo
2. **Content Hash:** Simple sum of character codes from title + body + attachments
3. **Occurrence Counter:** Differentiates memos with identical timestamps
4. **Total Counter:** Sequential counter across all memos

**ID Format:** `${dateTime}_${contentHash}_${occurrenceCount}_${totalCount}`

**Backward Compatibility:** The code checks both new format and old format (without occurrence/total counters) to avoid re-importing existing memos after plugin updates.

**State Storage:** The array of synced IDs (`syncedMemoIds`) is persisted in Obsidian's plugin settings and grows over time. On each sync, only memos with IDs not in this array are imported.

### File Structure

```
main.ts                   # Plugin entry point
lib/
  get/
    auth.ts              # Playwright auth automation
    const.ts             # Constants (cache paths: ~/.get/cache/)
    core.ts              # HTML parsing & memo ID generation
    exporter.ts          # Playwright export automation
    importer.ts          # Import orchestration & file writing
  obIntegration/
    canvas.ts            # Canvas visualization generator
    moments.ts           # Moments timeline generator
  ui/
    auth_ui.ts           # Authentication modal
    main_ui.ts           # Main plugin UI & settings
    manualsync_ui.ts     # Manual zip import UI
    message_ui.ts        # Notice/message utilities
    common.ts            # Shared UI helpers
```

## Important Constraints & Quirks

### Hard-Coded Paths
- **Attachment Directory:** `10 get/get picture/` - This path is hardcoded in the importer
- **Cache Location:** `~/.get/cache/playwright/` - Defined in `lib/get/const.ts`
- **Auth File:** `get_auth.json` in cache directory
- **Download File:** `get_export.zip` in cache directory
- **Temp Workspace:** `~/.get/cache/data/` for extraction

### Playwright Dependency
- **Desktop Only:** Plugin requires Playwright, cannot work on mobile
- **Version Locked:** Must use Playwright 1.43.1 (specified in package.json)
- **Installation Required:** Users must run `npx playwright@1.43.1 install` after plugin installation

### Settings Structure
Key settings in `Get笔记ImporterSettings`:
- `getTarget`: Main folder (default: "get")
- `memoTarget`: Memo subfolder (default: "memos")
- `syncedMemoIds`: Array of synced memo IDs (grows indefinitely)
- `lastSyncTime`: Timestamp of last sync
- `autoSyncOnStartup`: Boolean for startup sync
- `autoSyncInterval`: Boolean for hourly sync
- `mergeByDate`: Boolean to merge memos by date
- `expOptionAllowbilink`: Boolean for bi-directional links
- Canvas/Moments display options

### Content Processing
- **Markdown Conversion:** Uses `turndown` and `node-html-markdown` for HTML → Markdown
- **Highlight Syntax:** Converts Get笔记's `<mark>` to Obsidian's `==highlight==`
- **Bi-directional Links:** Experimental feature to preserve `[[wiki-links]]`
- **Attachment Handling:** Recursively copies images/files from extracted zip to vault

## Testing

**No testing infrastructure exists in this project.** There are no test files, test runners, or CI/CD configuration.

## Common Modification Scenarios

### Changing Import Format/Template
- Edit [lib/get/importer.ts](lib/get/importer.ts) - Controls markdown output format and frontmatter

### Modifying Visualizations
- Edit [lib/obIntegration/moments.ts](lib/obIntegration/moments.ts) - Moments display logic
- Edit [lib/obIntegration/canvas.ts](lib/obIntegration/canvas.ts) - Canvas layout and styling

### Adjusting Sync Logic
- Edit [lib/get/core.ts](lib/get/core.ts) - Memo parsing and ID generation
- **Caution:** Changing ID generation will break incremental sync for existing users

### UI Modifications
- Edit files in [lib/ui/](lib/ui/) directory
- Edit [styles.css](styles.css) for styling changes

### Changing Cache/Storage Paths
- Edit [lib/get/const.ts](lib/get/const.ts) - All path constants defined here

## Plugin Metadata

- **Current Version:** 1.4.0 (manifest.json) vs 1.1.2 (package.json) - Version discrepancy exists
- **Minimum Obsidian Version:** 0.15.0
- **Author:** Jason
- **BRAT Support:** Yes (versions.json tracks compatibility)
