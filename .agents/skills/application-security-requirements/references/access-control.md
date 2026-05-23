# Privacy and Exposure Control

Apply these rules to verify the public proxy routes do not claim security properties they do not provide, persist bridge data longer than intended, or leak more target metadata than intended.

## No Authentication Boundary

The proxy URL itself is the access token. The app has no account, session, cookie, or server-side authorization boundary.

**Guidelines:**

- MUST NOT describe the proxy URL as private, authenticated, encrypted, or access-controlled.
- MUST treat possession of a proxy URL as possession of the decoded payload while the encoded query is present or the short KV entry is live.
- MUST NOT add user accounts, sessions, cookies, or new server-side storage as an incidental part of another change.
- SHOULD surface any need for real access control as a product decision.

## Limited KV Bridge Storage

Short Obsidian links store validated base64url bridge queries in Workers KV for 30 days. The stored value is encoded rather than decoded, but it still carries note metadata and must be treated as sensitive proxy payload data.

**Guidelines:**

- MUST write short-link entries only to the `OBSIDIAN_QUERIES` KV binding.
- MUST validate and canonicalize the bridge query through the short-link helper before writing to KV.
- MUST set the configured 30-day `expirationTtl` on every short-link KV write.
- MUST NOT persist decoded payloads in a database, log stream, analytics event, or third-party service.
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
- MUST NOT display raw base64url query strings on public pages.
