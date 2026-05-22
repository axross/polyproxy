# Code Quality

Apply these rules to keep the codebase consistent, correctly typed, and aligned with the Hono runtime.

## Hono and Sentry Docs Gate

Hono and Sentry integration details can change, so use current primary documentation before changing framework or observability behavior.

Useful docs for common changes:

- Hono Cloudflare Workers docs
- Hono JSX docs
- Hono middleware docs
- Sentry Hono/Cloudflare setup docs

**Guidelines:**

- MUST read current Hono docs before changing route registration, middleware order, JSX rendering, static asset serving, or Cloudflare Worker adapter behavior.
- MUST read current Sentry Hono/Cloudflare docs before changing `src/worker.tsx`, Sentry middleware wiring, or Sentry dependencies.
- SHOULD cite the external docs used in your final summary when a framework or Sentry API choice depends on them.

## Check Sequence

Verification should scale with the changed surface. This sequence is the normal local order; [quality-assurance-guidelines](../../quality-assurance-guidelines/SKILL.md) owns the canonical command gate rules and evidence requirements.

1. `npm run lint` for Biome lint.
2. `npm test` when pure logic, validation, URL building, bot detection, or helpers changed.
3. `npm run build` when Hono routes, metadata, middleware, config, or TypeScript signatures changed.

**Guidelines:**

- MUST consult [quality-assurance-guidelines](../../quality-assurance-guidelines/SKILL.md) when deciding which commands are required.
- SHOULD run the full sequence before handing off a broad change.
- MUST report the reason and residual risk when a relevant command cannot run.

## TypeScript

The shared helper layer depends on narrow, explicit types so proxy payloads, validation results, and URL builders remain predictable across route code and tests.

**Guidelines:**

- MUST NOT introduce `any`, `as any`, or `as unknown as <T>` unless the boundary is genuinely unknowable and the rationale is documented.
- SHOULD declare return types on exported helpers in `src/helpers/**`.
- SHOULD use `import type { ... }` for symbols used only as types.
- MUST NOT use `// @ts-ignore`. Use `// @ts-expect-error <reason>` only when the upstream type issue is real and temporary.
- MUST keep `BridgePayload` and `Result<T>` centralized in `src/helpers/types.ts`; do not redeclare those shapes in route files or tests.

## Hono Route Boundaries

Hono route modules should orchestrate request handling while helpers own reusable bridge logic and views own rendered HTML. Browser-only custom-protocol launch behavior should stay in inert HTML attributes plus narrow client script snippets.

**Guidelines:**

- MUST keep decoding, validation, URL construction, and bot decisions in `src/routes/**` orchestration or pure `src/helpers/**` helpers.
- MUST keep browser APIs (`window`, `document`, custom-protocol redirects) inside static client script snippets rendered by Hono JSX, not inside shared helpers.
- MUST NOT import Node-only helpers into browser script snippets.
- SHOULD pass already-built strings and validated payloads into Hono JSX views.

## Imports and Comments

Imports should make ownership obvious without inventing new aliases. Comments should explain non-obvious protocol, crawler, or browser behavior rather than narrating ordinary code.

**Guidelines:**

- SHOULD keep short relative imports inside `src/**` when they are clearer.
- MUST include explicit `.js` extensions for relative TypeScript imports that emit to Node ESM.
- MUST NOT invent unconfigured aliases; see [project-structure](../../project-structure/SKILL.md).
- MUST NOT leave commented-out code in the diff.
- SHOULD write comments for non-obvious browser, crawler, or custom-protocol behavior, not for code that is self-explanatory.
