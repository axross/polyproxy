# Naming and Organization

Apply these rules to keep file and symbol names predictable across the codebase.

## File Naming

File names follow a simple Hono source layout: use kebab-case for source files when the exported concept is a phrase, keep route modules under `src/routes/`, helpers under `src/helpers/`, views under `src/views/`, and tests next to the files they verify.

**Good Examples:**

> `src/routes/obsidian.tsx`

> `src/helpers/bridge-url.ts`

**Bad Examples:**

> `src/routes/Obsidian.tsx`

> `src/helpers/bridgeUrl.ts`

**Guidelines:**

- MUST use kebab-case for `.ts`, `.tsx`, and `.css` source files when the exported concept is a phrase.
- MUST use kebab-case for pure helper files in `src/helpers/`, e.g. `bridge-url.ts`, `decode-link.ts`, and `obsidian-uri.ts`.
- MAY use generic names such as `types.ts` for shared type-only files when the containing directory is already specific.
- MUST end test files in `.test.ts` or `.test.tsx`.
- SHOULD mirror the helper being tested in the test filename.

## Folder Layout

The current layout is intentionally shallow. Adding familiar folders from larger apps should wait until the local code has a real domain split.

**Guidelines:**

- MUST keep app source under `src/`.
- MUST keep route registration under `src/routes/`.
- MUST keep server-rendered Hono JSX under `src/views/`.
- SHOULD keep pure helpers flat under `src/helpers/` until a real subdomain grows large enough to justify a folder.
- MUST keep unit tests next to the target file they verify.
- MUST NOT introduce a detached test directory without a reason.
- MUST NOT add `features/`, `components/`, or `hooks/` folders just because another project uses them.

## Export Conventions

Exports should make direct imports easy to trace. This repo defaults to named exports for helpers, routes, and views; configured Hono entry modules are the narrow exception because Wrangler imports the default Worker entry.

**Guidelines:**

- SHOULD use named exports from helper modules.
- SHOULD use named exports from route and view modules.
- SHOULD reserve default exports for single-entry modules such as `src/app.tsx` and `src/worker.tsx`.
- SHOULD NOT add `index.ts` barrel files unless they remove meaningful repetition; this repo currently reads more clearly without barrels.

## Symbol Naming

Symbol names should use normal TypeScript conventions while preserving this app's bridge-domain vocabulary. Use camelCase constants instead of shouty constants and `interface` for object-only shapes.

**Good Examples:**

> `const fieldLimits = { vault: 100, path: 500 } as const;`

> `export interface BridgePayload { vault: string; path: string; }`

**Bad Examples:**

> `const FIELD_LIMITS = { vault: 100, path: 500 } as const;`

> `export type BridgePayload = { vault: string; path: string; };`

**Guidelines:**

- MUST name types and interfaces in PascalCase.
- MUST use camelCase for constants, including module-level constants and exported constants.
- MUST NOT use UPPER_SNAKE_CASE for constants.
- MUST use `interface` instead of `type` for object-only shapes.
- MAY use `type` for unions, intersections, mapped types, and utility-type aliases.
- MAY use camelCase for local configuration.
- SHOULD start boolean values with `is`, `has`, `should`, or `can`.
- SHOULD use bridge-domain vocabulary consistently: `bridge`, `payload`, `query`, `obsidianUri`, `sourceUrl`, `vault`, and `path`.

## File-to-Symbol Correspondence

When one file has one primary concept, the filename and export should point to the same idea so readers can navigate without searching.

**Guidelines:**

- SHOULD make the primary helper obvious from the filename when a file exports one main helper.
- MUST NOT export a differently named primary symbol from a file when it would surprise a reader.
- SHOULD keep tests named after the target file or behavior surface they verify, such as `bridge-url.test.ts` for `bridge-url.ts` and `buildBridgeUrl()`.
