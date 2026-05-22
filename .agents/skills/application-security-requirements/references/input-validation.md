# Input Validation

Apply these rules to verify proxy payloads and URL-derived values are validated before they affect metadata, links, redirects, or UI.

## Bridge Query Decoding

The `/obsidian/[query]` segment is opaque user input. It must be syntactically base64url, decode to JSON, and round-trip canonically before any payload field is trusted.

**Guidelines:**

- MUST treat `params.query` from `/obsidian/[query]` as untrusted external input.
- MUST validate base64url syntax before decoding.
- MUST keep canonical round-trip validation in `decodeBase64Url()`.
- MUST catch decode and JSON parse failures through `decodeBridgeQuerySafe()` on user-facing routes.

## Payload Schema

The schema is the single source of truth for accepted proxy payload fields and limits. Route code should not reimplement it.

**Guidelines:**

- MUST pass decoded JSON through `validateBridgePayload()` or `validateBridgePayloadSafe()` before use.
- MUST preserve field limits for `vault`, `path`, `title`, `summary`, and `sourceUrl` unless URL-length constraints are re-evaluated.
- MUST normalize title and summary whitespace before using them in copy or metadata.
- MUST reject null bytes in every user-carried string.

## Obsidian Path Safety

Obsidian paths should remain vault-relative human-readable paths until the URI builder encodes them for `obsidian://open`.

**Guidelines:**

- MUST require `path` to be vault-relative.
- MUST reject leading `/` and `\`.
- MUST reject `..` path segments before building the Obsidian URI.
- MUST build Obsidian URI query params with `encodeURIComponent`.
- MUST NOT double-encode paths before passing them to `buildObsidianUri()`.

## Source URL Safety

`sourceUrl` can become a clickable external link. Non-web schemes are unsafe in this context.

**Guidelines:**

- MUST allow only `http:` and `https:` for `sourceUrl`.
- MUST render external source links with `rel="noreferrer"` when opening a new tab.
- MUST reject `javascript:`, `data:`, custom protocols, protocol-relative URLs, and relative paths.
- SHOULD omit `sourceUrl` when the source is absent or blank.

## Metadata Safety

Decoded title and summary may be rendered into HTML metadata and visible page text. Framework escaping is the safety boundary.

**Guidelines:**

- MUST use React, Next metadata APIs, or JSX text nodes so decoded values are escaped by the framework.
- MUST NOT inject decoded title or summary through raw HTML.
- SHOULD keep bot-facing HTML simple and equivalent to the Open Graph title and description.
