# Test Authoring Hygiene

Apply these rules to verify new or modified tests exercise the behavior they claim to cover.

## Vitest Basics

Tests in this repository use Vitest in Node and live next to the helper files they verify. New patterns should justify their extra setup cost.

**Guidelines:**

- MUST use Vitest APIs (`describe`, `it`, `expect`, `vi`) rather than Jest globals.
- MUST keep pure helper tests next to the target helper under `src/common/helpers/**` or `src/obsidian/helpers/**`.
- SHOULD mirror the existing assertion style in nearby tests before adding a new pattern.
- MUST NOT add DOM test harness dependencies without first justifying the dependency and environment change.

## Bridge Helper Coverage

Bridge helper tests should cover both successful behavior and malformed external input. The exact cases depend on which helper changed.

**Guidelines:**

- SHOULD cover UTF-8 round trips, URL-safe output, malformed characters, impossible padding length, and non-canonical encodings in `base64url` tests.
- SHOULD cover required fields, field limits, whitespace normalization, null-byte rejection, vault-relative path rules, parent segment rejection, and `sourceUrl` protocol filtering in `validation` tests.
- SHOULD cover base URL normalization, payload validation, `/ob/[query]` legacy path shape, `/ob/[key]` short-link path shape, and max URL length errors in `bridge-url` tests.
- SHOULD cover empty query, invalid base64url, invalid JSON, schema failure, and valid payload success in `decode-link` tests.
- SHOULD cover `encodeURIComponent` behavior for vault and path without double-encoding in `obsidian-uri` tests.
- SHOULD cover known crawler user agents and ordinary browser user agents in `bot-detection` tests.

## Route and Component Testing

Route behavior should be pushed into pure helpers when practical. Integrated Hono route rendering and metadata are better validated here with Playwright E2E tests and build checks than direct Node unit tests.

**Guidelines:**

- SHOULD factor route behavior into pure helpers when possible; test the helper instead of trying to unit test an integrated Hono route directly.
- SHOULD use `npm run test:e2e` plus `npm run build` for route metadata and Hono JSX behavior in this setup.
- MUST keep browser APIs in client script snippets and avoid testing them with Node-only helper tests unless a browser test harness is added.
- SHOULD consult [E2E Test Guidelines](../../e2e-test-guidelines/SKILL.md) before adding route-level browser tests.

## Labels and Assertions

Test names should match the behavior being asserted, and assertions should target the contract rather than broad "throws" or object-identity checks.

**Guidelines:**

- MUST ensure each `describe`/`it` label matches the behavior asserted.
- SHOULD write callable identifiers with parentheses in labels, such as `buildBridgeUrl()` or `decodeBridgeQuerySafe()`.
- MUST compose asymmetric matchers with `.toEqual`, `.toContain`, or `.toHaveBeenCalledWith`, not `.toBe`.
- MUST use targeted assertions for validation errors rather than only asserting "throws".

## Async and Globals

Async behavior and global mutation must be explicit so tests remain order-independent and deterministic.

**Guidelines:**

- MUST await async calls when their effects are observed by later assertions.
- MUST use `globalThis` when stubbing globals.
- MUST restore `process.env`, `globalThis`, fake timers, and mocks after tests that mutate them.
- SHOULD prefer `vi.stubEnv()` / `vi.unstubAllEnvs()` or an explicit save/restore pattern for environment-variable tests.

## Mocking

Mocks should stay at external boundaries. Pure helper tests should usually pass inputs directly instead of replacing the code under test.

**Guidelines:**

- MUST NOT mock the unit under test.
- SHOULD avoid mocks for pure helpers; pass explicit inputs instead.
- MUST keep mocks at external boundaries, such as environment variables or global browser APIs, and restore them after each test.
- SHOULD use `vi.spyOn()` or `vi.fn()` only when call observation is part of the behavior contract.
