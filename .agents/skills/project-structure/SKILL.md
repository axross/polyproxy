---
name: project-structure
description: |
  Navigation reference for this Next.js URL proxy repo. Use when writing, reviewing, or navigating code: covers the App Router files under app/, private helper modules under app/_/, route-local _components, co-located page-props.ts route contracts, colocated unit tests, agent skills under .agents/, the @/* path alias, and where configuration, docs, and static assets belong.
---

# Project Structure

Apply this skill when writing, creating, or navigating files in this project. This app is small; prefer the existing flat structure over introducing feature folders.

## Source Tree

Use this tree to decide where code belongs before adding files. Public routes live directly under `app/`, shared app modules live under `app/_/`, route-local modules live under `_components` or another `_`-prefixed private directory, and unit tests live next to the files they verify.

```
app/
├── _/
│   └── helpers/
│       ├── base64url.ts
│       ├── base64url.test.ts
│       ├── bot-detection.ts
│       ├── bot-detection.test.ts
│       ├── bridge-url.ts
│       ├── bridge-url.test.ts
│       ├── class-names.ts
│       ├── decode-link.ts
│       ├── decode-link.test.ts
│       ├── obsidian-uri.ts
│       ├── obsidian-uri.test.ts
│       ├── types.ts
│       └── validation.ts
├── globals.css                # global CSS for the app
├── layout.tsx                 # root layout
├── obsidian/
│   ├── _components/
│   │   └── page-frame.tsx
│   ├── [query]/
│   │   ├── _components/
│   │   │   └── open-actions.tsx
│   │   ├── page-props.ts      # dynamic route params contract
│   │   └── page.tsx           # dynamic Obsidian proxy route and metadata generation
│   └── page.tsx               # Obsidian proxy overview / help page
├── page.tsx                   # root route that currently returns notFound()
└── favicon.ico
e2e/
├── helpers/
│   └── bridge-payload.ts      # shared Playwright payload fixtures
└── tests/
    └── routes/
        └── obsidian/
            ├── page.test.ts       # overview route E2E tests
            └── query/
                └── page.test.ts   # dynamic Obsidian proxy route E2E tests
```

**Guidelines:**

- MUST prefer the existing flat structure before adding feature, component, or source-root folders.
- SHOULD update this tree when a durable new top-level file or directory becomes part of the project structure.
- MUST keep the tree descriptive rather than exhaustive when generated, dependency, or cache directories are involved.

## Routing Conventions

Routing follows the Next.js App Router. Page, layout, route-handler, and dynamic segment files must use the local Next.js 16 conventions rather than older assumptions.

**Guidelines:**

- MUST use App Router files directly under `app/`; do not add a `pages/` tree or reintroduce an `(app)` route group.
- MUST keep future `route.ts` handlers under a route segment that does not also contain `page.tsx`.
- MUST type dynamic page props using the current Next.js 16 shape where `params` is a `Promise`.
- SHOULD keep browser-only behavior isolated in client components with `"use client"`; `open-actions.tsx` is the current example.
- SHOULD keep metadata generation server-side in the route that owns the URL.

## Repository Support Files

Support files carry workflow, documentation, configuration, and agent guidance around the app source. They should stay at the repository root or in the established skill tree instead of being mixed into route folders.

| Path | Purpose |
| ---- | ------- |
| `AGENTS.md` | Repository-level agent routing, response approach, and skill index |
| `.agents/skills/**` | Agent skills and reference files |
| `README.md` | Public overview, tech stack, and development/test instructions only |
| `.env.example` | Documented environment variables |
| `next.config.ts` | Next.js configuration |
| `playwright.config.ts` | Playwright E2E configuration |
| `postcss.config.mjs` | Tailwind CSS PostCSS plugin configuration |
| `vitest.config.mts` | Vitest configuration |
| `package.json` / `package-lock.json` | npm scripts and dependency graph |

**Guidelines:**

- MUST update `AGENTS.md` when skill discoverability or the skill index changes.
- MUST place agent guidance under `.agents/skills/**` unless it is repository-wide routing that belongs in `AGENTS.md`.
- MUST keep public overview, tech stack, and development/test documentation in `README.md`.
- MUST NOT document proxy usage, route payload formats, URL examples, or private workflow details in `README.md`.
- MUST keep environment variable examples in `.env.example`.
- SHOULD keep tool configuration in root-level config files unless the tool requires a different location.

## Path Alias

The only configured path alias points to the app-private module root. Keep alias use predictable so imports do not imply folder systems that are not configured.

| Alias | Resolves to |
| ----- | ----------- |
| `@/*` | `app/_/*` |

**Guidelines:**

- SHOULD use `@/helpers/...` from route files when importing shared app helpers.
- SHOULD use relative imports inside `app/_/helpers/**` and between route-local files when the relative path is short and clearer.
- MUST NOT invent aliases such as `@components`, `@utils`, or `@api`; they are not configured in `tsconfig.json`.

## Placement Rules

Placement should follow ownership: route behavior in App Router files, shared bridge logic in `app/_/helpers`, route-local components in `_components`, Tailwind class composition in the component that owns the markup, unit tests next to the files they verify, Playwright route tests under `e2e/tests/routes`, static assets in `public/`, and configuration docs next to user-facing setup instructions.

For naming and export conventions inside these directories, consult [maintainable-code-guidelines](../maintainable-code-guidelines/SKILL.md).

**Guidelines:**

- MUST place shared parsing, validation, URL, and detection logic in `app/_/helpers/`.
- MUST place route rendering and metadata generation directly under `app/`.
- MUST place dynamic route prop contracts in a co-located `page-props.ts` file that exports `PageProps`.
- MUST place route-local UI modules under the owning route's `_components/` directory.
- MUST keep Tailwind class composition local to the component level that owns the markup, using `cn()` from `@/helpers/class-names` when classes cross component boundaries.
- MUST place unit tests next to the target file and mirror the target filename, such as `app/_/helpers/bridge-url.test.ts` for `app/_/helpers/bridge-url.ts`.
- MUST place Playwright route tests under `e2e/tests/routes/<route>/` and shared Playwright fixtures under `e2e/helpers/`.
- MUST place static files in `public/`.
- MUST document environment variable details in `.env.example`; README may only point developers to the example file.
