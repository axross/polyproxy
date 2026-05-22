# Verification

Apply these rules to map changed files to output surfaces. For required command gates, manual evidence, and missing-check severity, consult [quality-assurance-guidelines](../../quality-assurance-guidelines/SKILL.md).

## Output Surfaces at Risk

Use the changed file as the starting point for verification. Helper changes usually need focused tests; route, metadata, config, dependency, and UI changes usually need build or manual browser checks too.

| Change type | Output surface at risk |
| ----------- | ---------------------- |
| `src/helpers/base64url.ts` | Accepted/rejected query strings, canonical round trips |
| `src/helpers/validation.ts` | Payload limits, path safety, source URL protocols |
| `src/helpers/obsidian-uri.ts` | Custom protocol URI escaping and vault/path behavior |
| `src/helpers/bridge-url.ts` | Public HTTPS URL shape and max URL length |
| `src/helpers/bot-detection.ts` | Discord/crawler vs human rendering path |
| `src/routes/obsidian.tsx` | Metadata, invalid-link rendering, crawler HTML, human UI, E2E route behavior |
| `src/views/obsidian.tsx` | Browser-visible route UI and custom-protocol fallback |
| `src/views/metadata.tsx` | Document title, robots, Open Graph, and Twitter metadata |
| `public/styles.css` | Visual rendering across desktop and mobile browser widths |
| `playwright.config.ts` or `e2e/**` | Browser test coverage, server startup, traces, screenshots |
| `src/app.tsx`, `src/worker.tsx`, `wrangler.jsonc`, or dependencies | Middleware, static assets, Worker bundle output, and runtime behavior |

**Guidelines:**

- MUST identify the affected output surface before choosing verification.
- SHOULD include the table's mapped surface in review notes when the risk is not obvious from the changed file.

## Automated Checks

Automated checks are the default evidence for non-trivial changes. This section points to the relevant QA source of truth instead of redefining command gates.

**Guidelines:**

- MUST consult [lint-and-format-gate.md](../../quality-assurance-guidelines/references/lint-and-format-gate.md) for required lint, test, and build commands.
- MUST choose the command set from the changed output surface instead of running unrelated commands by habit.
- SHOULD consult [E2E Test Guidelines](../../e2e-test-guidelines/SKILL.md) when route, metadata, crawler, custom-protocol fallback, or responsive behavior needs browser-level evidence.
- SHOULD run the full QA gate for changes that touch both route code and helpers.

## Manual Verification

Manual checks cover browser behavior that unit tests, E2E tests, and build output do not exercise, especially real custom-protocol launch attempts into Obsidian. The evidence requirements live in QA.

**Guidelines:**

- MUST consult [manual-verification.md](../../quality-assurance-guidelines/references/manual-verification.md) for required manual evidence.
- SHOULD run `npm run test:e2e` for automated browser coverage after visual, routing, metadata, or crawler-rendering changes.
- SHOULD start `npm run dev` and open a valid generated `/ob/[query]` URL when real custom-protocol launch behavior needs manual confirmation.
- SHOULD verify an invalid query renders the invalid-link path and does not throw.
- SHOULD verify a Discord-like crawler user agent receives simple server-rendered title/summary HTML and no client redirect behavior.
- SHOULD verify the Open in Obsidian button remains visible when automatic custom-protocol launch fails or is blocked.
- SHOULD test layout changes at a narrow mobile width and a desktop width.

## Test Strategy

Tests should concentrate on the layer that owns the behavior: pure helpers and validation boundaries belong in Vitest, while route rendering, metadata, crawler branches, and browser-visible fallback UI belong in Playwright.

For test authoring and QA evidence rules, consult [quality-assurance-guidelines](../../quality-assurance-guidelines/SKILL.md).

**Guidelines:**

- SHOULD cover pure helpers in `src/helpers/**` with unit tests.
- MUST include valid and failing payload cases when validation behavior changes.
- SHOULD include malformed base64url, invalid JSON, unsafe paths, over-limit fields, and unsafe source URL protocols in validation tests when relevant.
- SHOULD cover Hono route behavior with Playwright tests under `e2e/tests/routes/**`.
