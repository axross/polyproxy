---
name: observability-guidelines
description: |
  Rules for error handling, structured logging, and Sentry error tracking in this stateless Hono URL proxy. Use when code decodes external payloads, handles expected invalid links, throws route/helper errors, logs runtime diagnostics, changes instrumentation files, or considers adding analytics or telemetry.
---

# Observability Guidelines

Apply these rules when writing, reviewing, or modifying code that handles errors, emits diagnostics, or reports exceptions. This project uses structured Cloudflare Worker console logs and Sentry for error tracking; keep both channels sparse and privacy-preserving.

## Error Handling

Error handling distinguishes expected invalid proxy links from unexpected internal failures. Expected external input should render stable fallback UI and metadata; unexpected failures should remain visible without leaking decoded target data. The detailed rules live in [error-handling.md](./references/error-handling.md).

**Guidelines:**

- MUST treat malformed proxy URLs as expected external input in route rendering and metadata generation.
- MUST keep vault names, note paths, summaries, source URLs, raw queries, and generated Obsidian URIs out of errors.
- SHOULD use [error-handling.md](./references/error-handling.md) when changing decoders, validators, routes, metadata, or custom-protocol launch behavior.

## Logging

Logging is minimal because this public route may receive invalid links and crawler traffic during normal operation. Diagnostics should be coarse, structured as JSON-compatible Worker console objects, server-side when possible, and privacy-preserving. The detailed rules live in [logging.md](./references/logging.md).

**Guidelines:**

- SHOULD keep the app quiet during normal invalid-link and custom-protocol behavior.
- MUST NOT log decoded proxy payloads, generated proxy URLs, or `obsidian://` URIs.
- SHOULD use [logging.md](./references/logging.md) before adding console diagnostics, analytics, telemetry, or deployment-error logging.

## Error Tracking

Sentry reports unexpected runtime failures through Hono/Cloudflare middleware. Expected malformed bridge URLs should still render deterministic fallback UI rather than become captured exceptions. The detailed rules live in [error-tracking.md](./references/error-tracking.md).

**Guidelines:**

- MUST keep Sentry event scrubbing aligned with the bridge privacy contract before enabling or expanding captured data.
- MUST NOT manually report expected invalid-link results to Sentry.
- SHOULD use [error-tracking.md](./references/error-tracking.md) when changing `src/worker.tsx`, Sentry middleware wiring, `src/app.tsx` error handling, or Sentry dependencies.
