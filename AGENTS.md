# AGENTS for Get笔记 Importer (root scope)

`AGENTS.md` is the canonical instruction file for coding agents working in this project.
- Purpose: guidance for agentic coding assistants working in this repository.
- Scope: applies to entire repo until overridden by a deeper AGENTS.md (none exist currently).
- Audience: agents making code changes; follow when reading/writing any file here.
- Keep edits minimal, targeted, and consistent with existing patterns.
- When instructions conflict, precedence is system > user > developer > this file.

## Quick project facts
- Plugin name: Get笔记 Importer (Get笔记 to Obsidian).
- Entry point: `main.ts`; bundled output: `main.js`.
- Core logic: `lib/get/*` (auth, exporter, core, importer).
- UI components: `lib/ui/*`; visuals: `lib/obIntegration/*`, `styles.css`.
- Hard-coded cache paths live in `lib/get/const.ts`.
- Incremental-sync IDs defined in `lib/get/core.ts`—avoid breaking format.
- Attachments default path: `get attachment/` under chosen vault folder.
- Target folders default to `get/notes`, configurable via settings.
- No tests or CI present; verify manually.
- Playwright desktop-only dependency; package.json declares `^1.43.1`; keep dependency updates deliberate.

## Setup commands
- Install deps: `npm install` (node 16+ recommended).
- Install Playwright (required): `npx playwright@1.43.1 install`.
- Optional: `npm run dev` for watch build (esbuild + sourcemaps).
- Ensure Obsidian desktop available for runtime validation.

## Build / lint / format commands
- Fast dev build: `npm run dev` (rebuilds to `main.js`).
- Prod build: `npm run build` (tsc noEmit + esbuild production bundle).
- Type-only compile: `npm run compile` (tsc emit per tsconfig).
- Lint check: `npm run lint` (gts / ESLint Google TS style).
- Auto-fix + format: `npm run fix` (gts fix, includes prettier rules).
- Clean generated artifacts: `npm run clean` (gts clean).
- Deploy script: `npm run deploy` (build then `./deploy.sh`).
- Version bump helper: `npm run version` (updates manifest/versions.json).
- There is no `test` script; see test section below.

## Testing status
- No automated tests exist; `npm test` is undefined.
- Single-test execution is unavailable because no test runner/config exists.
- If manual verification needed, run build then load plugin in Obsidian.
- Do not add new test frameworks unless explicitly requested.

## Runtime constraints and cautions
- Do not modify memo ID generation in `lib/get/core.ts` without approval; it underpins incremental sync.
- Preserve hard-coded cache paths in `lib/get/const.ts` unless task requires change.
- Playwright flows assume desktop; avoid adding mobile-only features.
- Attachment path assumptions exist in importer/exporter; keep consistent with settings.
- Background sync uses timers; ensure intervals cleared on unload to prevent leaks.
- Avoid introducing new global state; rely on plugin settings storage (`saveData`).

## TypeScript / lint baseline
- Codebase follows `gts` (Google TypeScript Style) via ESLint/Prettier.
- Use semicolons; prefer single quotes; 2-space indents (respect local file indentation where tabs already exist).
- Keep lines ≤ 100 chars when practical; wrap long strings thoughtfully.
- Enable strictness manually only if task requires; `tsconfig` sets `strict: false` and `skipLibCheck: true`.
- Target ES2022, module `commonjs`, `esModuleInterop: true`; avoid ESM-only syntax.
- Avoid unused imports/vars; lint will flag.

## Imports
- Order: node/third-party modules first, then absolute aliases (none), then relative paths.
- Group and separate categories with blank lines only when already present.
- Use named imports when available; default imports only when module exports default (e.g., `turndown`).
- Prefer `import type` for type-only references to keep runtime bundle small.
- Avoid deep relative traversals when existing barrel exports suffice (none currently).
- Keep Obsidian imports explicit (`Plugin`, `Notice`, etc.).

## Formatting
- Run `npm run fix` before handing off if time allows; it applies ESLint+Prettier.
- Maintain existing indentation style in touched files to avoid noisy diffs (tabs in `main.ts`, 4-space blocks elsewhere).
- Use trailing commas in multi-line objects/arrays when formatter expects.
- Place braces on same line; always brace conditional/loop bodies.
- Keep blank lines minimal; preserve logical grouping around sections.

## Types and interfaces
- Prefer explicit return types on exported functions/methods.
- Use interfaces for data shapes (`GetNote`, memo objects) rather than type aliases when extendable.
- Avoid `any`; use `unknown` with narrowing if necessary.
- Favor `readonly` for configuration objects that should not mutate.
- Use `string | undefined` instead of nullable magic values; default via parameters.
- Narrow HTML/DOM query results before use; check for nulls in Obsidian DOM APIs.

## Naming conventions
- Classes: PascalCase (`GetImporter`, `GetCore`).
- Functions/methods: camelCase; booleans read as predicates (`isAuthFileExist`, `mergeByDate`).
- Constants: SCREAMING_SNAKE for module-level immutables (`AUTH_FILE`, `DOWNLOAD_FILE`).
- Private helpers: prefix with `_` only if lint permits; otherwise keep camelCase.
- Avoid single-letter variables except for small loops.

## Async / promises
- Prefer `async/await`; avoid raw promise chains.
- Always await filesystem and Playwright operations (`fs-extra` returns promises).
- When running timed tasks, clear intervals on unload to avoid duplicate syncs.
- Debounce or guard repeated UI-triggered syncs to prevent concurrent Playwright runs.
- Do not block UI thread with long loops; chunk work when processing many notes.

## Error handling and logging
- Never swallow errors silently; log via `console.error`/`console.warn` with context.
- Surface user-facing failures with `new Notice(...)` in Obsidian UI.
- When catching unknown errors, narrow to `Error` before reading `.message`; fallback to `String(error)`.
- Avoid throwing raw strings; use `Error` subclasses if adding new errors.
- Validate inputs from settings before filesystem operations to prevent path issues.
- Keep Chinese/English mixed notices consistent with existing phrasing.

## Data and file handling
- Use `fs-extra` helpers (copy, ensureDir) instead of manual fs where possible.
- Keep attachment moves consistent with `get attachment/` path; update both importer/exporter if changing.
- Respect `syncedMemoIds` persistence; append new IDs after successful imports only.
- When adding settings, update defaults and persistence in `main.ts` plus UI surfaces.
- Avoid hardcoding user vault paths; rely on Obsidian APIs and existing constants.

## UI conventions
- Use Obsidian components (`Modal`, `ButtonComponent`, notices) rather than raw DOM when available.
- Keep UI strings concise; maintain bilingual tone where already used.
- Update `styles.css` when introducing new UI elements; reuse classes where possible.
- Ensure modals close/cleanup correctly to avoid dangling elements.

## Build outputs and artifacts
- Do not commit generated `main.js` changes unless user requests; builds produce it.
- `deploy.sh` expected to package plugin; review before modifying.
- `versions.json` and `manifest.json` must stay in sync with releases; `npm run version` updates them.

## Repository hygiene
- No Cursor rules found (.cursor/ or .cursorrules absent) as of this file.
- No Copilot repo rules (.github/copilot-instructions.md) present.
- Hidden config: `.claude/settings.local.json` lists allowed commands; honor sandbox/approval model.
- Keep secrets out of repo; auth cache lives in user home (`~/.get/cache/playwright`).
- Large sample zip exists (`voicenotes_...zip`); avoid committing derivatives.

## Review checklist before submit
- Commands run (when feasible): `npm run build` or `npm run dev`, `npm run lint`, `npm run fix` if edits touched TS.
- Confirm Playwright dependency unchanged or updated intentionally.
- Validate incremental sync logic untouched unless required.
- Ensure settings additions update defaults, load/save paths, and UI toggles.
- Keep language consistency (English + Chinese mix) in notices and logs.
- Avoid introducing new dependencies without need; prefer existing stack.
- Ensure imports resolved and relative paths correct after moves.
- Re-run formatter or lint to match repository style.
- Provide concise summary to user with file paths and line refs when done.

## If you need tests
- With no test runner, manual smoke test: build, copy plugin into Obsidian vault `.obsidian/plugins/get-importer`, enable, run sync on sample data.
- For Playwright flows, verify cache files at `~/.get/cache/playwright/get_auth.json` and `get_export.zip` exist.
- When adding any tests in future, document invocation syntax here (e.g., `npm test -- <pattern>`), but do not scaffold without explicit request.

## Communication tips
- Share preamble before running tool commands per harness rules.
- Use TODO list tool for multi-step tasks; keep one item in progress.
- Avoid committing unless explicitly asked; do not push branches.
- Cite file paths with line numbers in final summaries for easy navigation.
- Keep responses concise and actionable; prefer bullet lists.

## When uncertain
- Ask the user before changing ID formats, cache paths, or bundle outputs.
- Default to minimal changes; follow surrounding style even if mixed tabs/spaces.
- If lint conflicts with existing formatting, favor linted output unless instructed otherwise.
- Preserve backwards compatibility with prior memo ID formats.

## Final note
- This AGENTS.md governs the entire repository until another appears deeper in the tree.
- Update this file when build/lint/test tooling or style rules change.
- Approximate length ~150 lines to remain readable for agents.

## Project Overview

**Get笔记 Importer** is an Obsidian plugin that syncs notes from Get笔记 (a Chinese note-taking service) into Obsidian. It's a desktop-only plugin that uses Playwright for browser automation to authenticate and export data from Get笔记.

**Key Features:**
- Incremental sync (only imports new notes using IDs from exported HTML filenames)
- Multiple sync methods: auto-sync on startup, hourly intervals, manual sync
- Optional Canvas and Moments visualization
- Experimental bi-directional link support and date-based memo merging

## Build Target Details

`tsconfig.json` targets ES2022/CommonJS for TypeScript checking; `esbuild.config.mjs` emits a single CommonJS `main.js` bundle targeting ES2018. Development builds include inline source maps. The production command runs TypeScript checks and esbuild; the current esbuild configuration does not enable minification.

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
Parse & Process (lib/get/core.ts - GetCore class)
    ↓ - Parses HTML with node-html-parser
    ↓ - Uses each exported HTML filename without .html as the note ID
    ↓ - Filters against syncedMemoIds array for incremental sync
    ↓ - Converts parsed notes to the memos interface used by downstream import code
    ↓
Import (lib/get/importer.ts - GetImporter class)
    ↓ - Creates markdown files using Obsidian Vault API
    ↓ - Copies attachments to "${getTarget}/get attachment/"
    ↓ - Optionally generates Canvas/Moments visualizations
    ↓
State Update (main.ts)
    ↓ - Saves new syncedMemoIds to plugin settings
    ↓ - Updates lastSyncTime
```

### Key Classes & Responsibilities

- **main.ts:** Plugin entry point
  - `GetImporterPlugin` class extends Obsidian's Plugin
  - Manages settings, auto-sync timers (startup + hourly interval)
  - Registers commands (`open-get-importer`, `sync-get-now`)
  - Ribbon icon for quick access

- **lib/get/core.ts:** Core data processing
  - `GetCore` class: HTML parsing, memo extraction, ID generation
  - `loadNotes()`: Iterates through exported note files; `parseNote()` reads `.note` elements
  - Note IDs come from filenames; existing `syncedMemoIds` are skipped before parsing

- **lib/get/auth.ts:** Authentication layer
  - `GetAuth` class: Playwright-based login automation
  - Handles phone/SMS login through Playwright
  - Caches authentication state

- **lib/get/exporter.ts:** Export automation
  - `GetExporter` class: Automates Get笔记 export via Playwright
  - Downloads HTML backup zip file

- **lib/get/importer.ts:** Import orchestration
  - `GetImporter` class: Coordinates import process
  - `importGetFile()`: Main entry point
  - Groups memos by date, handles merge-by-date option
  - Manages attachment copying (recursive directory operations)

- **lib/obIntegration/canvas.ts:** Canvas generation
  - `generateCanvas()`: Creates Obsidian Canvas JSON
  - Two modes: content embedding or file linking

- **lib/obIntegration/moments.ts:** Moments generation
  - `generateMoments()`: Creates timeline markdown file
  - Embeds links to all imported memos chronologically

### Incremental Sync Algorithm

`GetCore.loadNotes()` uses the exported HTML filename without `.html` as the note ID. It skips filenames already present in `syncedMemoIds`, then parses the `.note` element and converts successfully parsed notes to the downstream memos interface.

The persisted `syncedMemoIds` array supports incremental imports. Preserve these identifiers and only persist successful imports; changing the ID format requires the existing approval and compatibility rules above.

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

### Storage Paths
- **Attachment Directory:** `${getTarget}/get attachment/`; the selected folder comes from settings, and importer/core must agree
- **Cache Location:** `~/.get/cache/playwright/` - Defined in `lib/get/const.ts`
- **Auth File:** `get_auth.json` in cache directory
- **Download File:** `get_export.zip` in cache directory
- **Temp Workspace:** `~/.get/cache/data/` for extraction

### Playwright Dependency
- **Desktop Only:** Plugin requires Playwright, cannot work on mobile
- **Dependency Range:** `package.json` declares Playwright `^1.43.1`; the documented browser installation command is `npx playwright@1.43.1 install`
- **Installation Required:** Users must run `npx playwright@1.43.1 install` after plugin installation

### Settings Structure
Key settings in `MyPluginSettings`:
- `getTarget`: Main folder (default: "get")
- `memoTarget`: Memo subfolder (default: "notes")
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

## Common Modification Scenarios

### Changing Import Format/Template
- Edit [lib/get/importer.ts](lib/get/importer.ts) - Controls markdown output format and frontmatter

### Modifying Visualizations
- Edit [lib/obIntegration/moments.ts](lib/obIntegration/moments.ts) - Moments display logic
- Edit [lib/obIntegration/canvas.ts](lib/obIntegration/canvas.ts) - Canvas layout and styling

### Adjusting Sync Logic
- Edit [lib/get/core.ts](lib/get/core.ts) - Memo parsing and ID generation
- Changing IDs can cause duplicate imports; follow the approval and compatibility rules above

### UI Modifications
- Edit files in [lib/ui/](lib/ui/) directory
- Edit [styles.css](styles.css) for styling changes

### Changing Cache/Storage Paths
- Edit [lib/get/const.ts](lib/get/const.ts) - All path constants defined here

## Plugin Metadata

- **Version Source:** Check `manifest.json`, `package.json`, and `versions.json` when releasing; the first two both declare `2.0.0` as of 2026-09-04
- **Minimum Obsidian Version:** 0.15.0
- **Author:** Jason
- **BRAT Support:** Yes (versions.json tracks compatibility)
