# AGENTS for Get笔记 Importer (root scope)
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
- Playwright desktop-only dependency; version locked.

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
- Classes: PascalCase (`Get笔记Importer`, `Get笔记Core`).
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
