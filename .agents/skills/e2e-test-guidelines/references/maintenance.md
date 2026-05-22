# E2E Maintenance

Use this reference when deciding whether E2E coverage is needed, updating snapshots, or debugging failed Playwright runs.

## Coverage Triggers

E2E tests are valuable when the behavior crosses server rendering, browser rendering, metadata, user agent branches, or responsive layout.

| Changed surface | Expected E2E evidence |
| --------------- | --------------------- |
| `app/obsidian/page.tsx` | Overview content and metadata route tests |
| `app/obsidian/[query]/page.tsx` | Valid, invalid, metadata, and crawler rendering route tests |
| `open-actions.tsx` | Fallback button `href` and visible status tests |
| Tailwind layout changes | Desktop and Pixel project run evidence |
| `playwright.config.ts` | Full `npm run test:e2e` run or documented blocker |

**Guidelines:**

- MUST add or update E2E coverage when a route, metadata, crawler branch, or browser-visible workflow changes.
- SHOULD use unit tests for pure helpers and E2E tests for integrated route behavior.
- MUST NOT replace helper edge-case tests with E2E tests when pure logic is the changed surface.
- SHOULD mention missing E2E coverage as a QA risk when a browser-visible route change cannot be tested.

## Snapshots

The Playwright config supports colocated snapshots, but this project should prefer text, metadata, and attribute assertions until visual regression coverage is intentionally needed.

**Example:**

```bash
npm run test:e2e -- --update-snapshots
```

**Guidelines:**

- SHOULD prefer targeted assertions over snapshots for bridge text, metadata, and URL behavior.
- MUST explain the intended visual change when adding or updating a snapshot.
- MUST review removed snapshots together with the removed or restructured test that made them obsolete.
- SHOULD avoid snapshots for custom-protocol behavior that cannot be represented in browser pixels.

## Flakiness

The config uses no retries, keeps traces on first failure, and repeats tests twice on CI to expose nondeterminism.

**Guidelines:**

- MUST investigate timing, selector, server startup, or responsive-state causes before changing a flaky test.
- MUST NOT add fixed sleeps, broad retries, `.only()`, or unjustified `.skip()`.
- SHOULD inspect `.playwright-results` traces before weakening an assertion.
- SHOULD keep `failOnFlakyTests: true` enabled unless the user explicitly accepts weaker flakiness detection.

## Configuration Drift

Playwright setup affects package scripts, ignored artifacts, project structure, QA rules, and README instructions.

**Guidelines:**

- MUST update `package.json`, `README.md`, `.gitignore`, [Project Structure](../../project-structure/SKILL.md), and [Quality Assurance Guidelines](../../quality-assurance-guidelines/SKILL.md) when changing durable E2E setup.
- MUST keep `playwright.config.ts` aligned with the commands documented in [commands.md](./commands.md).
- SHOULD compare against the upstream `btnopen.com` Playwright setup before changing worker, trace, snapshot, or base URL behavior.
