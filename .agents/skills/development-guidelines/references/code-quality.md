# Code Quality

Apply these rules to keep the codebase consistent, correctly typed, and aligned with the local Next.js version.

## Next.js 16 Docs Gate

This project explicitly treats the installed Next.js documentation as the source of truth because the local version may differ from common training-data assumptions.

Useful local docs for common changes:

- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
- `node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`

**Guidelines:**

- MUST read the relevant guide in `node_modules/next/dist/docs/` before changing App Router pages, layouts, route handlers, metadata, server/client component boundaries, or Next config.
- SHOULD cite the local doc path in your working notes or final summary when a Next.js API choice depends on it.
- MUST NOT rely on older Next.js App Router assumptions when the local docs disagree.

## Check Sequence

Verification should scale with the changed surface. This sequence is the normal local order; [quality-assurance-guidelines](../../quality-assurance-guidelines/SKILL.md) owns the canonical command gate rules and evidence requirements.

1. `npm run lint` for ESLint.
2. `npm test` when pure logic, validation, URL building, bot detection, or helpers changed.
3. `npm run build` when App Router pages, metadata, route handlers, config, or TypeScript signatures changed.

**Guidelines:**

- MUST consult [quality-assurance-guidelines](../../quality-assurance-guidelines/SKILL.md) when deciding which commands are required.
- SHOULD run the full sequence before handing off a broad change.
- MUST report the reason and residual risk when a relevant command cannot run.

## TypeScript

The shared helper layer depends on narrow, explicit types so proxy payloads, validation results, and URL builders remain predictable across route code and tests.

**Guidelines:**

- MUST NOT introduce `any`, `as any`, or `as unknown as <T>` unless the boundary is genuinely unknowable and the rationale is documented.
- SHOULD declare return types on exported helpers in `app/_/helpers/**`.
- SHOULD use `import type { ... }` for symbols used only as types.
- MUST NOT use `// @ts-ignore`. Use `// @ts-expect-error <reason>` only when the upstream type issue is real and temporary.
- MUST keep `BridgePayload` and `Result<T>` centralized in `app/_/helpers/types.ts`; do not redeclare those shapes in route files or tests.

## App Router Boundaries

App Router files should separate server work from browser work. Server-rendered routes decode, validate, and generate metadata; client components own custom-protocol launch behavior.

**Guidelines:**

- MUST keep browser APIs (`window`, `navigator`, custom-protocol redirects) inside `"use client"` components.
- MUST keep decoding, validation, metadata, and bot decisions in server-rendered route code or pure `app/_/helpers/**` helpers.
- MUST NOT import server-only helpers into a client component if they pull in Node-only APIs such as `Buffer`, `process.env`, or `next/headers`.
- SHOULD pass only already-built strings and simple serializable props from server components to client components.

## Imports and Comments

Imports should make ownership obvious without inventing new aliases. Comments should explain non-obvious protocol, crawler, or browser behavior rather than narrating ordinary code.

**Guidelines:**

- SHOULD use `@/helpers/...` imports from route files.
- SHOULD keep short relative imports inside `app/_/helpers/**` and route-local files when they are clearer.
- MUST NOT invent unconfigured aliases; see [project-structure](../../project-structure/SKILL.md).
- MUST NOT leave commented-out code in the diff.
- SHOULD write comments for non-obvious browser, crawler, or custom-protocol behavior, not for code that is self-explanatory.
