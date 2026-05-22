# Lint and Build Gate

Apply these rules to verify the author respected the project's mandatory checks.

## Required Commands

Required commands map to the changed surface. Helper changes need Vitest, route/browser changes need Playwright, source changes need lint, and App Router or dependency changes need the Next.js build gate.

**Guidelines:**

- MUST run `npm run lint` for TypeScript, React, route, config, or style-adjacent changes.
- MUST run `npm test` when `app/_/helpers/**` logic or tests change.
- MUST run `npm run test:e2e` when `e2e/**`, `playwright.config.ts`, route rendering, metadata, crawler behavior, responsive layout, or browser fallback UI changes.
- MUST run `npm run build` when App Router pages, metadata, route handlers, config, dependencies, or TypeScript signatures change.
- SHOULD run lint, Vitest, Playwright, and build before handing off a broad change that touches both helper logic and route behavior.

## ESLint and TypeScript

Lint and build failures indicate different levels of risk. TypeScript and Next.js build errors can prevent deployment; changed-file lint warnings may still matter even when the build passes. For severity labels, consult [code-review severity](../../code-review-guidelines/references/severity.md).

**Guidelines:**

- MUST reject introduced ESLint errors unless the user explicitly accepts the risk.
- MUST reject introduced TypeScript or Next.js build errors.
- SHOULD report new lint warnings in changed files when they affect correctness, maintainability, or future review signal.

## Suppressions

Suppressions weaken automated evidence and should carry a clear reason. Type assertions and ignores require the same scrutiny as lint disables.

**Guidelines:**

- MUST flag a new `eslint-disable` directive without an inline reason.
- MUST flag `// @ts-ignore`.
- MUST flag `// @ts-expect-error` without a concrete reason and follow-up condition.
- MUST flag introduced `any`, `as any`, or `as unknown as <T>` unless the boundary is genuinely unknowable and documented.

## Missing Scripts

QA should use the scripts this repository actually defines. For this app, `npm run build` is the practical type and App Router build gate, and `npm run test:e2e` is the browser route gate.

**Guidelines:**

- MUST NOT require commands that do not exist in `package.json`.
- MAY suggest `npm run build` as the practical type/build gate for this Next.js app.
