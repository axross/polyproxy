# Error Handling

Apply these rules when writing, reviewing, or modifying code that might throw or receive an error.

## Expected Invalid Links

Malformed query strings and invalid payloads are normal public input. They should flow through safe result APIs so routes can render deterministic fallback output.

**Guidelines:**

- MUST treat malformed proxy URLs as expected external input, not as exceptional server crashes.
- MUST use `decodeBridgeQuerySafe()` in route rendering and metadata generation so invalid links render a stable invalid-link response.
- SHOULD use the throwing `decodeBridgeQuery()` only in contexts where an exception is the desired API.
- MUST NOT expose raw malformed query strings or decoded partial payloads in invalid-link UI.

## Helper Boundaries

Helpers may expose throwing APIs for strict callers and safe wrappers for route code that can recover. The boundary should make the caller's error-handling contract explicit.

**Guidelines:**

- MUST throw domain-specific errors from low-level helpers when the caller selected the throwing API, such as `BridgeDecodeError`, `BridgeValidationError`, or `BridgeUrlError`.
- SHOULD keep safe wrapper helpers returning `Result<T>` when route code can recover and render a fallback.
- MUST NOT catch and silently ignore unexpected helper errors if the caller cannot render a correct fallback.

## Route Behavior

Route behavior is the user-visible fallback layer. Invalid input should produce invalid-link metadata and UI, while bot rendering must remain server-side and redirect-free.

**Guidelines:**

- MUST return invalid metadata for invalid payloads rather than letting metadata generation throw.
- MUST preserve crawler-safe rendering for bot user agents; bot handling should not run client-side redirect code.
- SHOULD keep route error handling close to the route so the user-facing behavior is visible during review.

## Client-Side Custom Protocol Launch

Browser launch attempts can fail silently or be blocked by the browser. The manual button must remain usable, and failures must not leak the full Obsidian URI.

**Guidelines:**

- SHOULD keep custom-protocol launch attempts idempotent in client components.
- SHOULD avoid unhandled promise rejections in future async client-side side effects; terminate intentional fire-and-forget promises with a `.catch(...)`.
- MUST NOT log the full `obsidian://` URI if a launch attempt fails.

## Error Messages

Internal error messages should identify the failure category without embedding the user's decoded target metadata or raw proxy URL.

**Guidelines:**

- SHOULD make internal error messages specific enough for tests and debugging.
- MUST NOT include vault names, note paths, summaries, source URLs, or raw query strings in thrown error messages.
- SHOULD prefer failure categories such as `Invalid Base64url value`, `path must be vault-relative`, or `sourceUrl must be http or https`.
