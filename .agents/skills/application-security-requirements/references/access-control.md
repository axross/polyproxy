# Privacy and Exposure Control

Apply these rules to verify the public bridge does not claim security properties it does not provide or leak more note metadata than intended.

## No Authentication Boundary

The bridge URL itself is the access token. The app has no account, session, cookie, or server-side authorization boundary.

**Guidelines:**

- MUST NOT describe the bridge URL as private, authenticated, encrypted, or access-controlled.
- MUST treat possession of a bridge URL as possession of the decoded payload.
- MUST NOT add user accounts, sessions, cookies, or server-side storage as an incidental part of another change.
- SHOULD surface any need for real access control as a product decision.

## No Stored Note Metadata

The bridge is a decoder and redirect helper, not a note-hosting service. Persistence changes the privacy model.

**Guidelines:**

- MUST NOT persist decoded payloads in a database, cache, log stream, analytics event, or third-party service.
- MUST NOT fetch or host Obsidian note content.
- SHOULD keep invalid-link handling generic.
- MUST NOT echo malformed input back to the user.

## Crawler and Indexing Behavior

Crawler support exists for previews, not search indexing. Valid bridge pages should preview cleanly without making note metadata discoverable by search engines.

**Guidelines:**

- MUST keep bridge pages `noindex` and `nofollow` unless the product explicitly changes its privacy model.
- MUST preserve bot handling that gives crawlers simple title and summary HTML without triggering client-side custom-protocol redirects.
- SHOULD verify Open Graph and Twitter metadata use decoded title and summary only after validation succeeds.

## Intentional UI Exposure

Human-facing pages may show the decoded fields that the URL already carries, but they should not expose raw encoded internals as troubleshooting output.

**Guidelines:**

- MUST show only the decoded fields intentionally carried by the URL.
- SHOULD keep vault and path details behind secondary disclosure UI.
- MUST NOT display raw base64url query strings on public pages.
