---
name: e2e-test-guidelines
description: |
  Use when writing, reviewing, running, or maintaining Playwright end-to-end tests in this Next.js URL proxy app. Covers `playwright.config.ts`, `npm run test:e2e`, `PLAYWRIGHT_BASE_URL`, browser installation, `e2e/tests/routes/**` placement, `.test.ts` naming, `test.step()` structure, chained `getByTestId()` locators, metadata assertions, custom-protocol redirect constraints, snapshots, traces, flakiness, and when E2E evidence is required for route, metadata, crawler, responsive, or UI behavior.
---

# E2E Test Guidelines

Apply this skill when browser-level behavior needs Playwright coverage or when an E2E test, trace, snapshot, or failure is part of the work.

## Commands

Playwright runs through the repository script and can either start the local Next.js development server or target an already deployed URL through `PLAYWRIGHT_BASE_URL`.

**Guidelines:**

- SHOULD read [commands.md](./references/commands.md) before running or documenting E2E commands.
- MUST use `npm run test:e2e` as the default E2E command.
- SHOULD use `PLAYWRIGHT_BASE_URL` when testing an already running local production server or deployed preview.

## Test Structure

E2E tests live under `e2e/tests` and route-specific coverage mirrors the public URL shape so failures point back to the route surface quickly.

**Guidelines:**

- SHOULD read [structure.md](./references/structure.md) before adding or moving E2E test files.
- MUST place route tests under `e2e/tests/routes/**`.
- MUST use `.test.ts` file names and `test.step()` blocks for meaningful browser actions and assertions.

## Locators and Assertions

Tests should use stable, scoped selectors for app-owned UI and Playwright-native assertions that auto-wait before failing.

**Guidelines:**

- SHOULD read [locators-and-assertions.md](./references/locators-and-assertions.md) before adding selectors, `data-testid` attributes, or DOM assertions.
- MUST use chained `getByTestId()` locators for app-owned UI regions and controls.
- MUST use locator-native assertions before pulling DOM state into `evaluate()`.
- SHOULD consult [React Component Guidelines](../react-component-guidelines/SKILL.md) before adding component test IDs.

## Maintenance

E2E maintenance treats flakiness and artifact churn as signal: traces, screenshots, snapshots, and retries must explain what changed rather than hiding instability.

**Guidelines:**

- SHOULD read [maintenance.md](./references/maintenance.md) when updating snapshots, debugging failures, changing Playwright config, or deciding whether E2E coverage is required.
- MUST investigate flaky failures instead of adding fixed sleeps, retries, or broad skips.
- MUST keep Playwright guidance synchronized with [Quality Assurance Guidelines](../quality-assurance-guidelines/SKILL.md).
