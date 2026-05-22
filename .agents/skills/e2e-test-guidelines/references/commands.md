# E2E Commands

Use these commands when Playwright is the right verification layer for route rendering, metadata, crawler behavior, responsive layout, or browser interactions.

## Default Test Run

The default command starts the local Next.js development server on `http://127.0.0.1:3100` through `playwright.config.ts` when `PLAYWRIGHT_BASE_URL` is not set. Its readiness check targets `/obsidian` because `/` intentionally returns not found.

**Example:**

```bash
npm run test:e2e
```

**Guidelines:**

- MUST run `npm run test:e2e` for the full E2E suite.
- SHOULD run a targeted path such as `npm run test:e2e -- e2e/tests/routes/obsidian/page.test.ts` while iterating.
- MUST let Playwright own server startup through `webServer` on port `3100` unless a separate production or preview server is intentionally targeted.

## Browser Installation

Playwright needs browser binaries outside the npm package. A missing browser error usually means the dependency is installed but Chromium is not.

**Example:**

```bash
npx playwright install chromium
```

**Guidelines:**

- MUST install the required Playwright browser when `npm run test:e2e` reports a missing executable.
- SHOULD install Chromium only unless a new project in `playwright.config.ts` requires another browser engine.
- MUST NOT commit downloaded browser binaries or local Playwright cache output.

## External Base URL

`PLAYWRIGHT_BASE_URL` disables local server startup and points tests at an already running server or deployed preview.

**Example:**

```bash
PLAYWRIGHT_BASE_URL=https://obsidian-link.example.com npm run test:e2e
```

**Guidelines:**

- MUST set `PLAYWRIGHT_BASE_URL` when testing a deployed preview or a separately managed local production server.
- SHOULD run `npm run build` before testing a local production server with `npm start`.
- MUST verify that `NEXT_PUBLIC_BASE_URL` matches the tested canonical host when assertions depend on generated absolute metadata URLs.

## Artifacts

Failed runs keep traces and first-retry videos in `.playwright-results`, matching the upstream pattern from `btnopen.com`.

**Guidelines:**

- SHOULD inspect traces before changing a failing E2E test.
- MUST keep `.playwright-results` ignored by git.
- MAY attach trace or screenshot paths in review notes when they explain a browser-only failure.
