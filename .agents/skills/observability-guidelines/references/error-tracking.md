# Error Tracking

Apply these rules when changing Sentry setup, Hono error handling, event scrubbing, or dependencies that affect error reporting.

## Sentry Entry Points

Error tracking is initialized through `src/common/worker.tsx`, which wires `@sentry/hono/cloudflare` middleware around the shared Hono app. Hono request context is connected through the Sentry middleware before normal route middleware runs.

**Guidelines:**

- MUST keep Cloudflare Sentry middleware setup in `src/common/worker.tsx`, not route modules, view modules, or helper modules.
- MUST keep Hono Sentry middleware wired immediately after Worker app creation.
- MUST keep `nodejs_compat` enabled in `wrangler.jsonc` while using `@sentry/hono/cloudflare`.
- SHOULD use `SENTRY_DSN` as the enablement switch for Sentry initialization.

## Event Privacy

Sentry events leave the process, so they must satisfy the same privacy standard as logs. The current privacy boundary is `scrubSentryEvent()` in `src/obsidian/helpers/sentry-privacy.ts`, covered by `src/obsidian/helpers/sentry-privacy.test.ts`.

**Guidelines:**

- MUST keep `sendDefaultPii: false` unless the user explicitly accepts a broader privacy model.
- MUST run Sentry events through `scrubSentryEvent()` before sending them.
- MUST scrub raw `/ob/[key]` and legacy `/ob/[query]` path values, generated proxy URLs, `obsidian://` URIs, bridge payload fields, request query strings, request headers, request cookies, and request bodies.
- MUST update `sentry-privacy.test.ts` when adding a new Sentry field, breadcrumb, tag, context, or integration that can carry URL or bridge data.
- SHOULD prefer route names, module names, runtime type, and coarse failure categories over raw request details.

## Expected vs Unexpected Failures

Malformed bridge links are normal public input. Sentry is for unexpected application failures, integration failures, and uncaught render/request errors that the app cannot safely recover from.

**Guidelines:**

- MUST NOT report `decodeBridgeQuerySafe()` invalid results to Sentry.
- MUST NOT report normal custom-protocol launch blocking to Sentry.
- SHOULD allow unexpected thrown errors to flow through Hono's error path and Sentry middleware.
- SHOULD add explicit `captureException()` calls only when a recoverable unexpected failure would otherwise be invisible and the captured scope contains no bridge metadata.

## Verification

Error tracking touches Hono middleware, Worker bundling, dependencies, and helper privacy logic. Verification needs to cover compilation, Wrangler dry-run bundling, and event scrubbing.

**Guidelines:**

- MUST run `npm run lint` after changing Sentry, logging, or Worker entry TypeScript.
- MUST run `npm test -- src/obsidian/helpers/sentry-privacy.test.ts` after changing event scrubbing.
- MUST run `npm test` after changing shared observability helpers.
- MUST run `npm run build` after changing `src/common/worker.tsx`, `src/common/app.tsx`, Wrangler config, runtime scripts, or observability dependencies.
