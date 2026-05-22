# Secret and Environment-Variable Handling

Apply these rules to verify no secret is committed and environment configuration stays inside its intended boundary.

## Committed Secrets

Private credentials should never be needed to render proxy links. If one appears in the diff, treat it as a security incident.

For review severity labels, consult [code-review severity](../../code-review-guidelines/references/severity.md).

**Guidelines:**

- MUST treat literal credentials, API keys, bearer tokens, JWTs, private keys, webhook secrets, or provider tokens as committed-secret findings.
- MUST reject `.env`, `.env.local`, `*.pem`, or `*.key` files in the diff unless the user explicitly confirms a safe fixture or example file.
- SHOULD question hardcoded local-testing values when the value previously came from configuration.

## Public vs Server Environment

`NEXT_PUBLIC_*` values are bundled for browser use. They are configuration, not a secret store. `NEXT_PUBLIC_SENTRY_DSN` is intentionally public when Sentry is enabled; `SENTRY_ORG` and `SENTRY_PROJECT` are build configuration, not credentials.

**Guidelines:**

- MUST treat every `NEXT_PUBLIC_*` value as browser-visible.
- MUST NOT put secrets in `NEXT_PUBLIC_BASE_URL` or future `NEXT_PUBLIC_*` variables.
- MUST NOT treat `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, or `SENTRY_PROJECT` as secret material.
- MUST NOT commit Sentry auth tokens, API keys, or upload credentials; keep them outside `.env.example`.
- MUST update `.env.example` when an environment variable changes.
- SHOULD keep README limited to the local environment-file setup command unless the user explicitly approves public configuration detail.
- SHOULD keep configuration reads near their use until repetition justifies a helper.
- MUST NOT require a private server-side secret for ordinary proxy-link rendering.

## Bridge Payload Privacy

Decoded payloads contain personal note metadata. Diagnostics may report categories, but not the payload itself. Sentry error tracking is allowed only through the scrubbed observability path defined by [Observability Guidelines](../../observability-guidelines/SKILL.md).

**Guidelines:**

- MUST NOT log decoded `BridgePayload`, vault name, note path, title, summary, source URL, or generated `obsidian://` URI.
- MUST NOT send decoded bridge metadata, raw `/obsidian/[query]` values, generated proxy URLs, request headers, cookies, request bodies, or `obsidian://` URIs to Sentry.
- MUST keep Sentry scrubbing tests aligned with any new captured field that can carry bridge metadata.
- SHOULD log only coarse diagnostics such as query length, validation failure category, or route name.
- MUST NOT add analytics or third-party telemetry that receives decoded note metadata without explicit approval.
- MUST keep public README content free of proxy usage details, route payload formats, generated URLs, and private workflow specifics.
- MUST keep UI copy clear that base64url obfuscates but does not secure payload data when encoded data is mentioned.
