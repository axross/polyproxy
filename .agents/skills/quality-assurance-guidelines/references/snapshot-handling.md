# Snapshot Handling

Apply these rules if Vitest or Playwright snapshots are introduced or modified. The current E2E suite should prefer targeted route, metadata, and attribute assertions unless visual regression coverage is intentional.

## When Snapshots Are Added or Regenerated

Snapshot updates should explain the output contract change they encode. Without that explanation, snapshot churn can hide accidental behavior drift.

**Guidelines:**

- MUST require an explanation of what visible or serialized output changed and why.
- MUST flag snapshot updates paired with non-visual helper changes unless the serialized contract is intentionally affected.
- MUST flag Playwright snapshot updates that lack a visual-change explanation.
- MUST flag snapshot deletion that is not paired with removing or replacing the test.

## Snapshot Scope

This repo's tests are currently targeted helper and Playwright route tests. Snapshots should stay secondary to direct assertions for validation, URL contracts, metadata, and text.

**Guidelines:**

- SHOULD prefer targeted assertions over snapshots for UUIDv5 key generation, validation, URL construction, and Obsidian URI behavior.
- SHOULD prefer targeted Playwright assertions over full-page screenshots for proxy route behavior.
- MUST NOT use snapshots as the only coverage for security-sensitive validation behavior.

## Snapshot Update Commands

Vitest and Playwright both support snapshot updates. Use the command that matches the test runner that owns the snapshot.

| Command | Purpose |
| ------- | ------- |
| `npm test -- --update` | Vitest snapshot update command if snapshots exist. |
| `npm run test:e2e -- --update-snapshots` | Playwright snapshot update command if E2E snapshots exist. |

**Guidelines:**

- MUST verify the exact command against the active Vitest version before using it in CI or documentation.
- MUST review Playwright snapshot output under the configured `snapshotPathTemplate` before committing.
