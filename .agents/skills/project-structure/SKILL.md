---
name: project-structure
description: |
  Navigation reference for this Hono URL proxy repo. Use when writing, reviewing, or navigating code: covers the Cloudflare Worker entry under src/worker.tsx, source files under src/, helper modules under src/helpers/, route registration under src/routes/, Hono JSX views under src/views/, colocated unit tests, agent skills under .agents/, the @/* path alias, and where Wrangler configuration, docs, and static assets belong.
---

# Project Structure

Apply this skill when writing, creating, or navigating files in this project. This app is small; prefer the existing flat structure over introducing feature folders.

## Source Tree

Use this tree to decide where code belongs before adding files. Cloudflare Worker-specific middleware and bindings live in `src/worker.tsx`; shared Hono bootstrap, route wiring, and error handlers live in `src/app.tsx`; shared bridge helpers live under `src/helpers/`; public route registration lives under `src/routes/`; server-rendered Hono JSX lives under `src/views/`; unit tests live next to the files they verify.

```
src/
├── app.tsx                  # shared Hono app, route wiring, 404/500 handlers
├── hono-env.ts              # shared Hono Env interface over generated Worker bindings
├── worker.tsx               # Cloudflare Worker entry, bindings, Sentry middleware
├── helpers/
│   ├── base64url.ts
│   ├── base64url.test.ts
│   ├── bot-detection.ts
│   ├── bot-detection.test.ts
│   ├── bridge-url.ts
│   ├── bridge-url.test.ts
│   ├── decode-link.ts
│   ├── decode-link.test.ts
│   ├── obsidian-uri.ts
│   ├── obsidian-uri.test.ts
│   ├── sentry-privacy.ts
│   ├── sentry-privacy.test.ts
│   ├── types.ts
│   └── validation.ts
├── logger.ts                # structured Worker console logger
├── routes/
│   └── obsidian.tsx         # /ob and /ob/:query route registration
└── views/
    ├── metadata.tsx         # document metadata helpers
    └── obsidian.tsx         # Hono JSX route views
e2e/
├── helpers/
│   └── bridge-payload.ts
└── tests/
    └── routes/
        └── ob/
            ├── page.test.ts
            └── query/
                └── page.test.ts
```

**Guidelines:**

- MUST prefer the existing flat structure before adding feature, component, or source-root folders.
- SHOULD update this tree when a durable new top-level file or directory becomes part of the project structure.
- MUST keep the tree descriptive rather than exhaustive when generated, dependency, build, or cache directories are involved.

## Routing Conventions

Routing follows Hono's grouping pattern. Route modules should expose top-level grouped Hono sub-app instances mounted from `src/app.tsx` with `app.route(basePath, routes)` while leaving reusable parsing, validation, URL construction, and rendered view structure in their owning helper/view modules.

**Guidelines:**

- MUST define grouped public route modules under `src/routes/**` and mount them from `src/app.tsx`.
- MUST define grouped route handlers at module scope with `routes.get()`, `routes.post()`, or the equivalent Hono route methods instead of route factory functions.
- MUST keep the root route as a 404 unless the user explicitly changes the public route contract.
- MUST keep `/ob` as the overview route and `/ob/:query` as the encoded Obsidian bridge route.
- SHOULD keep route modules as orchestration glue over helpers and views, not as a place to reimplement base64, schema, bot detection, or URI logic.
- SHOULD keep metadata generation in the route/view path that owns the URL.

## Repository Support Files

Support files carry workflow, documentation, configuration, and agent guidance around the app source. They should stay at the repository root or in the established skill tree instead of being mixed into route folders.

| Path | Purpose |
| ---- | ------- |
| `AGENTS.md` | Repository-level agent routing, response approach, and skill index |
| `.agents/skills/**` | Agent skills and reference files |
| `README.md` | Public overview, tech stack, and development/test instructions only |
| `.dev.vars.example` | Example local variables loaded by Wrangler dev |
| `.env.example` | Documented environment variables |
| `biome.jsonc` | Biome lint and format configuration |
| `playwright.config.ts` | Playwright E2E configuration |
| `public/**` | Static assets served by Cloudflare Workers Assets |
| `tsconfig.json` | TypeScript configuration |
| `vitest.config.mts` | Vitest configuration |
| `worker-configuration.d.ts` | Generated Wrangler Worker runtime and `CloudflareBindings` types |
| `wrangler.jsonc` | Cloudflare Workers entry point, compatibility, assets, and bindings |
| `package.json` / `package-lock.json` | npm scripts and dependency graph |

**Guidelines:**

- MUST update `AGENTS.md` when skill discoverability or the skill index changes.
- MUST place agent guidance under `.agents/skills/**` unless it is repository-wide routing that belongs in `AGENTS.md`.
- MUST keep public overview, tech stack, and development/test documentation in `README.md`.
- MUST NOT document proxy usage, route payload formats, URL examples, or private workflow details in `README.md`.
- MUST keep environment variable examples in `.env.example` and `.dev.vars.example`.
- MUST regenerate `worker-configuration.d.ts` with Wrangler after changing Worker bindings or compatibility settings.
- SHOULD keep tool configuration in root-level config files unless the tool requires a different location.

## Path Alias

The only configured path alias points to the app source root. Wrangler bundles the Worker with esbuild, and TypeScript uses bundler-style resolution, so local relative imports should stay extensionless.

| Alias | Resolves to |
| ----- | ----------- |
| `@/*` | `src/*` |

**Guidelines:**

- SHOULD use short extensionless relative imports inside `src/**` when they are clearer and compatible with Wrangler bundling.
- MUST NOT invent aliases such as `@components`, `@utils`, or `@api`; they are not configured in `tsconfig.json`.
- MUST keep Wrangler's bundled Worker runtime in mind when changing TypeScript module settings or import specifiers.

## Placement Rules

Placement should follow ownership: Cloudflare Worker entry and bindings in `src/worker.tsx`, route registration in `src/routes`, shared bridge logic in `src/helpers`, server-rendered markup in `src/views`, global stylesheet/static files in `public`, unit tests next to their target files, Playwright route tests under `e2e/tests/routes`, and configuration docs next to user-facing setup instructions.

For naming and export conventions inside these directories, consult [maintainable-code-guidelines](../maintainable-code-guidelines/SKILL.md).

**Guidelines:**

- MUST place shared parsing, validation, URL, and detection logic in `src/helpers/`.
- MUST place Hono route registration in `src/routes/`.
- MUST place shared route views and document metadata helpers in `src/views/`.
- MUST keep Worker entry and binding-specific setup in `src/worker.tsx`.
- MUST keep shared structured logging helpers in `src/logger.ts`.
- MUST keep Sentry event scrubbing under `src/helpers/` with colocated Vitest coverage.
- MUST place unit tests next to the target file and mirror the target filename, such as `src/helpers/bridge-url.test.ts` for `src/helpers/bridge-url.ts`.
- MUST place Playwright route tests under `e2e/tests/routes/<route>/` and shared Playwright fixtures under `e2e/helpers/`.
- MUST place static files in `public/`.
- MUST document environment variable details in `.env.example` and `.dev.vars.example`; README may only point developers to the example file.
