# Privacy and Exposure Control

Apply these rules to verify the public proxy routes do not claim security properties they do not provide, persist bridge data longer than intended, or leak more target metadata than intended.

## No Authentication Boundary

The proxy URL itself is the access token. The app has no account, session, cookie, or server-side authorization boundary.

**Guidelines:**

- MUST NOT describe the proxy URL as private, authenticated, encrypted, or access-controlled.
- MUST treat possession of a proxy URL as possession of the decoded payload while the short KV entry is live.
- MUST NOT add user accounts, sessions, cookies, or new server-side storage as an incidental part of another change.
- SHOULD surface any need for real access control as a product decision.

## Limited KV Bridge Storage

Short Obsidian links store validated JSON bridge payloads in Workers KV for 30 days under deterministic UUIDv5 hex keys generated from the payload vault and path. Payload metadata lives at `articles/<key>`, derived preview image bytes live at `articles/<key>/image`, and both must be treated as sensitive proxy payload data.

**Guidelines:**

- MUST write short-link entries only to the `CF_KV` KV binding.
- MUST validate and canonicalize the bridge payload through the short-link helper before writing to KV.
- MUST derive short-link keys through the short-link helper's UUIDv5 vault/path key generation.
- MUST set the configured 30-day `expirationTtl` on every short-link KV write.
- MUST NOT persist bridge payloads outside the intended KV short-link entry.
- MUST NOT fetch or host Obsidian note content.
- SHOULD keep invalid-link handling generic.
- MUST NOT echo malformed input back to the user.

## Crawler and Indexing Behavior

Crawler support exists for previews, not search indexing. Valid proxy pages should preview cleanly without making target metadata discoverable by search engines.

**Guidelines:**

- MUST keep proxy pages `noindex` and `nofollow` unless the product explicitly changes its privacy model.
- MUST preserve bot handling that gives crawlers simple title and summary HTML without triggering client-side custom-protocol redirects.
- SHOULD verify Open Graph and Twitter metadata use decoded title and summary only after validation succeeds.

## Intentional UI Exposure

Human-facing pages may show the decoded fields that the URL already carries, but they should not expose raw encoded internals as troubleshooting output.

**Guidelines:**

- MUST show only the decoded fields intentionally carried by the URL.
- SHOULD keep vault and path details behind secondary disclosure UI.
- MUST NOT display raw short keys on public pages.
