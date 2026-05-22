# Error Tracking

Apply these rules when changing Sentry setup, global error boundaries, event scrubbing, or dependencies that affect error reporting.

## Sentry Entry Points

Error tracking is initialized through the root-level Next.js instrumentation files. The server path uses `instrumentation.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts`; the browser path uses `instrumentation-client.ts`; uncaught App Router render failures use `app/global-error.tsx`.

**Guidelines:**

- MUST keep Sentry initialization in root-level instrumentation files, not route components or helper modules.
- MUST keep `onRequestError` wired to `captureRequestError` so server request failures reach Sentry.
- MUST keep `app/global-error.tsx` as a Client Component when it captures client-visible render errors.
- SHOULD use `NEXT_PUBLIC_SENTRY_DSN` as the enablement switch for Sentry initialization.
- SHOULD keep `SENTRY_ORG` and `SENTRY_PROJECT` limited to build-time Sentry configuration in `next.config.ts`.

## Event Privacy

Sentry events leave the process, so they must satisfy the same privacy standard as logs. The current privacy boundary is `scrubSentryEvent()` in `app/_/helpers/sentry-privacy.ts`, covered by `app/_/helpers/sentry-privacy.test.ts`.

**Guidelines:**

- MUST keep `sendDefaultPii: false` unless the user explicitly accepts a broader privacy model.
- MUST run Sentry events through `scrubSentryEvent()` before sending them.
- MUST scrub raw `/obsidian/[query]` path values, generated proxy URLs, `obsidian://` URIs, bridge payload fields, request query strings, request headers, request cookies, and request bodies.
- MUST update `sentry-privacy.test.ts` when adding a new Sentry field, breadcrumb, tag, context, or integration that can carry URL or bridge data.
- SHOULD prefer route names, module names, runtime type, and coarse failure categories over raw request details.

## Expected vs Unexpected Failures

Malformed bridge links are normal public input. Sentry is for unexpected application failures, integration failures, and uncaught render/request errors that the app cannot safely recover from.

**Guidelines:**

- MUST NOT report `decodeBridgeQuerySafe()` invalid results to Sentry.
- MUST NOT report normal custom-protocol launch blocking to Sentry.
- SHOULD allow unexpected thrown errors to flow through Next.js request-error capture or `app/global-error.tsx`.
- SHOULD add explicit `captureException()` calls only when a recoverable unexpected failure would otherwise be invisible and the captured scope contains no bridge metadata.

## Verification

Error tracking touches build-time Next.js integration, client/server runtime boundaries, dependencies, and helper privacy logic. Verification needs to cover both compilation and event scrubbing.

**Guidelines:**

- MUST run `npm run lint` after changing Sentry, Pino, or instrumentation TypeScript.
- MUST run `npm test -- app/_/helpers/sentry-privacy.test.ts` after changing event scrubbing.
- MUST run `npm test` after changing shared observability helpers.
- MUST run `npm run build` after changing `next.config.ts`, root instrumentation files, Sentry config files, `app/global-error.tsx`, or observability dependencies.
- SHOULD report sandbox-only Turbopack process or port failures separately from app build failures.
