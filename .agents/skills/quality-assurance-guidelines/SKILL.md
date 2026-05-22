---
name: quality-assurance-guidelines
description: |
  Use when writing, verifying, or reviewing tests and QA evidence for this Next.js URL proxy: covers lint/test/build gates, Vitest helper tests, Playwright E2E route tests, async and matcher hygiene, proxy payload edge cases, snapshot caution, flakiness investigation, and manual checks for browser, crawler, metadata, and Obsidian launch behavior.
---

# Quality Assurance Guidelines

Apply these rules when reviewing whether a change has been adequately verified. Unit tests use Vitest in a Node environment; App Router route behavior is covered through Playwright E2E tests, `npm run build`, focused helper tests, and manual checks for real custom-protocol launch behavior.

## Lint and Build Gate

The standard gate is `npm run lint`, `npm test`, and `npm run build`, selected according to the changed surface. The detailed command and severity rules live in [lint-and-format-gate.md](./references/lint-and-format-gate.md).

**Guidelines:**

- MUST require `npm run lint` for TypeScript, React, route, config, or style-adjacent changes.
- MUST require `npm test` when `app/_/helpers/**` logic or tests change.
- MUST require `npm run test:e2e` when route rendering, metadata, crawler branches, fallback UI, responsive layout, or Playwright config changes.
- MUST require `npm run build` when App Router, metadata, route handler, config, dependency, or TypeScript-signature risk is present.
- SHOULD use [lint-and-format-gate.md](./references/lint-and-format-gate.md) when deciding whether missing or failed checks block a change.

## Playwright E2E Coverage

Playwright verifies the browser-visible proxy route behavior that helper tests cannot see: rendered pages, metadata tags, crawler-specific HTML, and responsive fallback UI. The authoring rules live in [E2E Test Guidelines](../e2e-test-guidelines/SKILL.md).

**Guidelines:**

- MUST require Playwright coverage for new or changed public route behavior.
- MUST require crawler and metadata E2E coverage when `/obsidian/[query]` rendering branches change.
- SHOULD require both desktop and Pixel project evidence for meaningful layout changes.
- SHOULD use [E2E Test Guidelines](../e2e-test-guidelines/SKILL.md) when writing, reviewing, or debugging Playwright tests.

## Snapshot Handling

Snapshots are not part of the current helper-focused test suite. If they are introduced later, they need explicit review because snapshot churn can hide real behavior changes. The detailed rules live in [snapshot-handling.md](./references/snapshot-handling.md).

**Guidelines:**

- SHOULD prefer targeted helper assertions over snapshots for validation, URL, and Obsidian URI behavior.
- MUST require an explanation for any added, regenerated, or deleted snapshot.
- SHOULD use [snapshot-handling.md](./references/snapshot-handling.md) whenever a diff introduces or modifies snapshots.

## Flakiness Tolerance

Flaky tests require root-cause fixes, not sleeps, retries, or hidden skips. The detailed rules live in [flakiness-tolerance.md](./references/flakiness-tolerance.md).

**Guidelines:**

- MUST block `.only` and unjustified `.skip` usage.
- MUST reject sleep, retry, and try/catch assertion workarounds for intermittent failures.
- MUST treat Playwright flakiness as a blocker when `failOnFlakyTests` reports nondeterminism.
- SHOULD use [flakiness-tolerance.md](./references/flakiness-tolerance.md) when reviewing async tests, shared state, mocks, timers, globals, or environment mutation.

## Test Authoring Hygiene

Tests should verify the claimed behavior using Vitest, existing helper-test style, targeted assertions, and deterministic setup. The detailed rules live in [test-authoring.md](./references/test-authoring.md).

**Guidelines:**

- MUST use Vitest APIs and existing colocated `*.test.ts` helper-test conventions.
- SHOULD cover bridge helper edge cases for base64url, validation, URL building, decoding, Obsidian URI construction, and bot detection.
- MUST keep async, matcher, global-stubbing, and mocking patterns deterministic.
- SHOULD use [test-authoring.md](./references/test-authoring.md) when writing or reviewing tests.

## Manual Verification Evidence

Manual verification covers browser, crawler, custom-protocol, and responsive behavior that automated helper tests do not fully exercise. The detailed rules live in [manual-verification.md](./references/manual-verification.md).

**Guidelines:**

- MUST require manual or equivalent automated evidence when a diff touches route behavior listed in the manual verification matrix.
- MUST NOT accept manual testing as a substitute for relevant helper tests, lint, test, or build commands.
- SHOULD use [manual-verification.md](./references/manual-verification.md) when browser, crawler, metadata, custom-protocol, or responsive behavior changes.
