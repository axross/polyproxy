# Manual Verification Evidence

Apply these rules to verify the author exercised the change in the browser or with HTTP requests when automated tests cannot cover the behavior.

## Required Manual Checks

Manual evidence should target the user-visible surface touched by the diff. Use this matrix to decide whether browser, crawler, responsive, or environment checks are required.

| Diff touches | Required manual check |
| ------------ | --------------------- |
| `app/obsidian/[query]/page.tsx` | Run Playwright route tests, then manually open a valid proxy URL when custom-protocol launch behavior changed |
| `app/obsidian/[query]/_components/open-actions.tsx` | Confirm the Open in Obsidian button remains visible when automatic launch is blocked |
| Metadata or bot detection | Run Playwright metadata/crawler tests or request the route with a Discord-like user agent |
| Tailwind classes, global CSS, or route UI | Run desktop and Pixel Playwright projects, then manually inspect only when the visual change is hard to assert |
| Environment/base URL behavior | Verify generated canonical proxy URLs use `NEXT_PUBLIC_BASE_URL` as expected |

**Guidelines:**

- MUST require equivalent manual or automated evidence when the diff touches a row above.
- SHOULD prefer Playwright evidence for repeatable route, metadata, crawler, and responsive checks.
- MUST report missing evidence as a review finding and consult [code-review severity](../../code-review-guidelines/references/severity.md) for classification.

## Suggested Local Checks

Local checks should be specific enough to reproduce the behavior without relying on vague claims that the page was opened.

| Check | Purpose |
| ----- | ------- |
| `npm run test:e2e` | Exercise route, metadata, crawler, and responsive behavior through Playwright. |
| `npm run dev` then open the affected route in a browser | Exercise local route behavior interactively. |
| Use a generated proxy URL from `buildBridgeUrl()` or an existing test fixture | Avoid hand-written payload drift. |
| `curl -A "Discordbot"` or an equivalent request | Exercise crawler handling when bot detection changes. |

**Guidelines:**

- SHOULD choose the local check that exercises the changed behavior directly.
- SHOULD record the checked URL shape, user agent, and viewport when behavior depends on them.

## What Manual Verification Cannot Replace

Manual verification complements automated checks. It cannot replace helper tests for pure logic or project commands that catch lint, test, and build failures.

**Guidelines:**

- MUST NOT accept manual testing as a substitute for unit tests when pure helper logic changes.
- MUST NOT accept manual testing as a substitute for Playwright E2E tests when route behavior is repeatably automatable.
- MUST NOT accept "it did not crash" as a substitute for `npm run lint`, `npm test`, `npm run test:e2e`, or `npm run build` when those commands are relevant.
- SHOULD record exactly which URL shape, user agent, and viewport were checked when behavior depends on them.
