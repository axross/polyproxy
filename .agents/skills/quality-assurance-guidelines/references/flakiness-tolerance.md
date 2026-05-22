# Flakiness Tolerance

Apply these rules to verify changes do not introduce or paper over flaky tests.

## Workarounds to Reject

Flakiness workarounds hide failures and make the suite less trustworthy. For severity labels, consult [code-review severity](../../code-review-guidelines/references/severity.md).

**Guidelines:**

- MUST reject committed `.only`.
- MUST require a tracked reason for `.skip`, `describe.skip`, or `it.skip`.
- MUST reject sleep, `setTimeout`, `page.waitForTimeout()`, retry loops, or try/catch around assertions when they are used to make an intermittent failure pass.
- MUST reject weakening Playwright `failOnFlakyTests` or adding broad retries without a documented project decision.

## Root-Cause Investigation

Intermittent failures usually come from races, shared state, mock leaks, or environment assumptions. The fix should make the behavior deterministic.

**Guidelines:**

- MUST require the author to identify the race, shared state, mock leak, or environment assumption behind a flaky failure.
- SHOULD ask for deterministic setup instead of broad timing delays.
- SHOULD inspect Playwright traces under `.playwright-results` before changing a flaky E2E assertion.
- SHOULD isolate process/env mutations with `beforeEach` / `afterEach`.

## Async Assertions

Async tests should wait for the behavior they assert. Passing because a promise happened to settle before the assertion is not deterministic evidence.

**Guidelines:**

- MUST await async helpers whose effects are observed by later assertions.
- SHOULD use Vitest's async assertion patterns rather than relying on microtask timing.
- SHOULD use Playwright locator-native assertions, `expect.poll()`, or `page.waitForFunction()` for browser state that needs auto-waiting.
- MUST restore or unstub globals and environment variables that a test mutates.

## Test Isolation

Each test should be able to run alone or in any order. Shared mutable fixtures and leaked globals make failures order-dependent.

**Guidelines:**

- SHOULD flag tests that share mutable fixtures across `it(...)` blocks.
- SHOULD flag tests that leave `process.env`, `globalThis`, timers, or mocks modified after completion.
