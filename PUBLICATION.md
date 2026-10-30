# Reviewed application source

This branch contains the portable `get-to-obsidian` application source and maintenance documentation reviewed on 2026-10-13. It continues the existing reviewed documentation branch and includes the current TypeScript source, JavaScript modules, package lock, plugin metadata, styles, and build scripts.

Build with `npm ci` and `npm run build`. The generated `main.js` stays local; deploy it to a vault only after setting `VAULT_PATH` for that installation. Authentication state, downloaded notes, original attachments, private workspace notes, and release ZIP files are excluded. `AGENTS.md` is the maintained project instruction file.

The source passes the existing TypeScript and esbuild production build. `npm run lint` currently cannot run because the project does not provide an ESLint configuration. Existing release documentation retains its original version; this branch does not create a new plugin release or deploy to Obsidian.

The reviewed source is prepared as the consolidated main candidate. Original historical snapshots are retained in a verified local archive; they are not imported into this source history.
