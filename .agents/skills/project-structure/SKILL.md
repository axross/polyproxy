---
name: project-structure
description: |
  Navigation reference for this Hono URL proxy repo. Use when writing, reviewing, or navigating code: covers the Cloudflare Worker entry under src/common/worker.tsx, common/core source under src/common/, Obsidian route modules under src/obsidian/, colocated unit tests, agent skills under .agents/, the @/* path alias, and where Wrangler configuration, docs, and static assets belong.
---

# Project Structure

Apply this skill when writing, creating, or navigating files in this project. This app is small; prefer the existing flat structure over introducing feature folders.

## Source Tree

Use this tree to decide where code belongs before adding files. Common Worker/runtime code and generic helpers live under `src/common/`; Obsidian-specific bridge helpers, public route registration, and server-rendered Hono JSX live under `src/obsidian/`; unit tests live next to the files they verify.

```
src/
├── common/
│   ├── app.tsx              # shared Hono app, route wiring, 404/500 handlers
│   ├── helpers/
│   │   ├── base64url.ts
│   │   ├── base64url.test.ts
│   │   ├── bot-detection.ts
│   │   └── bot-detection.test.ts
│   ├── hono-env.ts          # shared Hono Env interface over generated Worker bindings
│   ├── logger.ts            # structured Worker console logger
│   ├── styles.css           # Tailwind input compiled to public/styles.css
│   └── worker.tsx           # Cloudflare Worker entry, bindings, Sentry middleware
└── obsidian/
    ├── helpers/
    │   ├── bridge-route.ts
    │   ├── bridge-url.ts
    │   ├── decode-link.ts
    │   ├── obsidian-uri.ts
    │   ├── sentry-privacy.ts
    │   ├── short-bridge-link.ts
    │   ├── types.ts
    │   └── validation.ts
    ├── routes/
    │   └── obsidian.tsx     # /ob and /ob/:query route registration
    └── views/
        ├── metadata.tsx     # document metadata helpers
        └── obsidian.tsx     # Hono JSX route views
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

- MUST prefer the existing `common` and `obsidian` ownership roots before adding more source-root folders.
- SHOULD update this tree when a durable new top-level file or directory becomes part of the project structure.
- MUST keep the tree descriptive rather than exhaustive when generated, dependency, build, or cache directories are involved.

## Routing Conventions

Routing follows Hono's grouping pattern. Route modules should expose top-level grouped Hono sub-app instances mounted from `src/common/app.tsx` with `app.route(basePath, routes)` while leaving reusable parsing, validation, URL construction, and rendered view structure in their owning helper/view modules.

**Guidelines:**

- MUST define grouped public route modules under `src/obsidian/routes/**` and mount them from `src/common/app.tsx`.
- MUST define grouped route handlers at module scope with `routes.get()`, `routes.post()`, or the equivalent Hono route methods instead of route factory functions.
- MUST keep the root route as a 404 unless the user explicitly changes the public route contract.
- MUST keep `GET /ob` as the overview route, `POST /ob` as the short-link creation route, and `GET /ob/:query` as the Obsidian bridge resolver for short keys with legacy encoded-query fallback.
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
| `public/**` | Static assets served by Cloudflare Workers Assets, including generated Tailwind CSS |
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

Placement should follow ownership: Cloudflare Worker entry and bindings in `src/common/worker.tsx`, shared app wiring in `src/common/app.tsx`, generic helpers in `src/common/helpers`, Obsidian bridge logic in `src/obsidian/helpers`, Obsidian route registration in `src/obsidian/routes`, Obsidian route markup in `src/obsidian/views`, Tailwind source CSS in `src/common/styles.css`, compiled stylesheet/static files in `public`, unit tests next to their target files, Playwright route tests under `e2e/tests/routes`, and configuration docs next to user-facing setup instructions.

For naming and export conventions inside these directories, consult [maintainable-code-guidelines](../maintainable-code-guidelines/SKILL.md).

**Guidelines:**

- MUST place generic shared helpers in `src/common/helpers/`.
- MUST place Obsidian bridge parsing, validation, URL, storage, URI, and privacy logic in `src/obsidian/helpers/`.
- MUST place Obsidian Hono route registration in `src/obsidian/routes/`.
- MUST place Obsidian route views and document metadata helpers in `src/obsidian/views/`.
- MUST keep Worker entry and binding-specific setup in `src/common/worker.tsx`.
- MUST keep shared structured logging helpers in `src/common/logger.ts`.
- MUST keep Tailwind source CSS in `src/common/styles.css` and the compiled `/styles.css` asset in `public/styles.css`.
- MUST place unit tests next to the target file and mirror the target filename, such as `src/obsidian/helpers/bridge-url.test.ts` for `src/obsidian/helpers/bridge-url.ts`.
- MUST place Playwright route tests under `e2e/tests/routes/<route>/` and shared Playwright fixtures under `e2e/helpers/`.
- MUST place static files in `public/`.
- MUST document environment variable details in `.env.example` and `.dev.vars.example`; README may only point developers to the example file.
