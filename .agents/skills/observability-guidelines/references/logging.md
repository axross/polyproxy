# Logging

Apply these rules when writing, reviewing, or modifying code that emits diagnostic output.

## Current Logging Posture

The default posture is quiet. Invalid public links, crawler traffic, and blocked custom-protocol launches are expected operating conditions, not automatic log events. Server diagnostics flow through `rootLogger` from `app/_/logger.ts`; npm development, build, and start scripts pipe JSON logs through `pino-pretty` for local readability.

**Guidelines:**

- SHOULD keep the app quiet during normal operation. A public proxy route may receive bot traffic and invalid links; those are not automatically worth logging.
- SHOULD use `rootLogger.child({ module: "<module-name>" })` for server-side operational logs instead of raw `console.*`.
- MAY use `console.error` or `console.warn` only for a narrow fallback where importing the logger would create an invalid runtime boundary.
- SHOULD NOT add client-side console logs for normal custom-protocol launch behavior.

## Sensitive Data

Bridge URLs may encode note metadata. Logs must treat decoded payloads and generated URLs as sensitive even when the data also appears in user-facing page output. Pino redaction in `rootLogger` is a backstop, not permission to pass sensitive values into log objects.

**Safe Diagnostic Examples:**

> `decodeBridgeQuerySafe failed: invalid_json`

> `buildBridgeUrl failed: url_length_exceeded`

**Unsafe Diagnostic Examples:**

> `failed to open obsidian://open?vault=Personal&file=Private%2FNote`

> `invalid payload {"vault":"Personal","path":"Private/Note"}`

**Guidelines:**

- MUST NOT log decoded `BridgePayload` objects.
- MUST NOT log vault names, note paths, titles, summaries, source URLs, raw base64url query strings, generated proxy URLs, or `obsidian://` URIs.
- SHOULD log only coarse context such as route name, query length, field name, or validation failure category.
- MUST extend `rootLogger` redaction paths when introducing a new diagnostic field that may contain bridge metadata or generated URLs.

## Diagnostic Shape

When diagnostics are necessary, stable operation names and coarse categories make them searchable without capturing sensitive payload content.

**Guidelines:**

- SHOULD make diagnostic messages stable and searchable.
- SHOULD include the operation name, such as `decodeBridgeQuerySafe` or `buildBridgeUrl`, when reporting an unexpected internal failure.
- SHOULD include module names through Pino child loggers rather than repeating module prefixes in every message.
- MUST NOT rely on logs as the primary behavior for expected invalid links; route UI and metadata fallbacks are the behavior.

## Adding Telemetry

Analytics or telemetry beyond current Sentry error tracking would change the privacy model of this app. Treat it as a product decision with an explicit field allowlist, not as incidental observability.

**Guidelines:**

- MUST treat analytics or telemetry as a product and privacy decision, not a refactor detail.
- MUST define an allowlist of fields before sending any event off-process.
- MUST NOT send decoded note metadata to Sentry or any other third party without explicit approval.
