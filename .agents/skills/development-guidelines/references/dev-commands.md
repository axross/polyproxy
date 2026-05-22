# Development Commands

Apply these commands when running, validating, or debugging the application locally.

## Setup

Setup uses npm and the committed lockfile. Local environment values should start from the example file rather than undocumented ad hoc variables.

| Command | Purpose |
| ------- | ------- |
| `cp .env.example .env.local` | Create local environment configuration. |
| `npm install` | Install dependencies from `package-lock.json`. |

**Guidelines:**

- MUST install dependencies from `package-lock.json`.
- SHOULD create local environment configuration from `.env.example`.

## Running the App

The app can run in development mode or as a built production preview. A production preview requires a successful build first. Runtime scripts pipe Next.js output through `pino-pretty`, so pipeline exit status must stay protected by the `bash -o pipefail` wrapper in `package.json`.

| Command | Purpose |
| ------- | ------- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create a production build and run Next.js type/build checks. |
| `npm start` | Serve the production build after `npm run build`. |

**Guidelines:**

- MUST run `npm run build` before `npm start` when validating production behavior locally.
- MUST preserve `pipefail` behavior if editing npm scripts that pipe through `pino-pretty`.
- SHOULD use `npm run dev` for interactive route and UI checks.

## Code Quality

The available quality commands are lint, Vitest, Playwright, and build. There is no separate `typecheck` script in this repository.

| Command | Purpose |
| ------- | ------- |
| `npm run lint` | Run ESLint with Next.js core web vitals and TypeScript rules. |
| `npm test` | Run the Vitest suite once. |
| `npm test -- 'app/_/helpers/bridge-url.test.ts'` | Run one test file. |
| `npm test -- --watch` | Run Vitest in watch mode when iterating locally. |
| `npm run test:e2e` | Run the Playwright E2E suite. |
| `npm run test:e2e -- e2e/tests/routes/obsidian/page.test.ts` | Run one Playwright test file. |

**Guidelines:**

- MUST use the scripts that exist in `package.json`.
- SHOULD use targeted Vitest commands while iterating on one helper or test file.
- SHOULD use targeted Playwright commands while iterating on one route-level browser test.

## Environment Variables

Runtime configuration is intentionally small. Public base URL configuration affects generated links and metadata; Sentry configuration enables scrubbed error tracking; reserved workflow settings must remain documented if they stay present.

| Variable | Purpose |
| -------- | ------- |
| `NEXT_PUBLIC_BASE_URL` | Canonical public origin used by proxy URL helpers and metadata. Production uses `https://open.axross.dev`. |
| `NEXT_PUBLIC_SENTRY_DSN` | Browser-visible Sentry DSN used to enable client and server error tracking. |
| `SENTRY_ORG` | Sentry organization slug used by `withSentryConfig()` at build time. |
| `SENTRY_PROJECT` | Sentry project slug used by `withSentryConfig()` at build time. |
| `DEFAULT_VAULT` | Reserved for notification workflow integration. |

**Guidelines:**

- MUST update `.env.example` when adding, renaming, or removing configuration.
- SHOULD keep README limited to the local environment-file setup command unless the user explicitly approves public configuration detail.
- MUST NOT place secrets or decoded note content in public environment variables.
- MUST NOT add Sentry auth tokens or upload credentials to `.env.example`.

## E2E Testing

Playwright uses `playwright.config.ts`. By default it starts `npm run dev` on `http://127.0.0.1:3100`; `PLAYWRIGHT_BASE_URL` points the suite at an already running local production server or deployed preview.

| Command | Purpose |
| ------- | ------- |
| `npx playwright install chromium` | Install the required browser binary if Playwright reports one is missing. |
| `PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run test:e2e` | Run E2E tests against an existing server instead of starting `npm run dev`. |

**Guidelines:**

- MUST consult [E2E Test Guidelines](../../e2e-test-guidelines/SKILL.md) before adding, changing, or debugging Playwright tests.
- MUST install Playwright browsers when the local machine lacks the required Chromium executable.
- SHOULD set `PLAYWRIGHT_BASE_URL` when validating `npm start` output after a production build.

## No Generated-Code Commands

This repository currently has no GraphQL codegen, database migrations, or mobile platform builds. Command guidance should describe the tooling this repo actually has.

**Guidelines:**

- MUST NOT copy command guidance from other projects unless the corresponding script exists in `package.json`.
- SHOULD update this reference when a real new workflow command is added.
