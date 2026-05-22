# Logging

Apply these rules when writing, reviewing, or modifying code that emits diagnostic output.

## Current Logging Posture

The default posture is quiet. Invalid public links, crawler traffic, and blocked custom-protocol launches are expected operating conditions, not automatic log events.

**Guidelines:**

- SHOULD keep the app quiet during normal operation. A public bridge route may receive bot traffic and invalid links; those are not automatically worth logging.
- MAY use `console.error` or `console.warn` on the server for unexpected deployment or integration failures when the message excludes decoded bridge data.
- SHOULD NOT add client-side console logs for normal custom-protocol launch behavior.

## Sensitive Data

Bridge URLs may encode note metadata. Logs must treat decoded payloads and generated URLs as sensitive even when the data also appears in user-facing page output.

**Safe Diagnostic Examples:**

> `decodeBridgeQuerySafe failed: invalid_json`

> `buildBridgeUrl failed: url_length_exceeded`

**Unsafe Diagnostic Examples:**

> `failed to open obsidian://open?vault=Personal&file=Private%2FNote`

> `invalid payload {"vault":"Personal","path":"Private/Note"}`

**Guidelines:**

- MUST NOT log decoded `BridgePayload` objects.
- MUST NOT log vault names, note paths, titles, summaries, source URLs, raw base64url query strings, generated bridge URLs, or `obsidian://` URIs.
- SHOULD log only coarse context such as route name, query length, field name, or validation failure category.

## Diagnostic Shape

When diagnostics are necessary, stable operation names and coarse categories make them searchable without capturing sensitive payload content.

**Guidelines:**

- SHOULD make diagnostic messages stable and searchable.
- SHOULD include the operation name, such as `decodeBridgeQuerySafe` or `buildBridgeUrl`, when reporting an unexpected internal failure.
- MUST NOT rely on logs as the primary behavior for expected invalid links; route UI and metadata fallbacks are the behavior.

## Adding Telemetry

Analytics or telemetry would change the privacy model of this app. Treat it as a product decision with an explicit field allowlist, not as incidental observability.

**Guidelines:**

- MUST treat analytics or telemetry as a product and privacy decision, not a refactor detail.
- MUST define an allowlist of fields before sending any event off-process.
- MUST NOT send decoded note metadata to a third party without explicit approval.
