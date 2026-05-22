# Change Management

Apply these rules to keep changes focused, reviewable, and aligned with the app's small surface area.

## Scope Discipline

Focused diffs make bridge behavior, URL validation, crawler rendering, styling, and docs changes easier to review independently.

**Guidelines:**

- MUST keep each change focused on a single concern. Split unrelated app behavior, styling, dependency, and agent-skill changes.
- MUST NOT refactor unrelated files while fixing bridge behavior.
- SHOULD note pre-existing issues discovered during the change and defer them to follow-up work unless they block the requested fix.

## Refactors Preserve Behavior

A refactor is behavior-preserving by definition.

**Guidelines:**

- MUST preserve existing route behavior, metadata output, validation errors, and generated URLs unless the change explicitly intends to modify them.
- MUST NOT combine a structural refactor with a bug fix that changes observable behavior unless the user asked for both.
- SHOULD keep regression tests unchanged before the refactor and update them only when behavior intentionally changes.

## Follow Existing Patterns

Before introducing a new pattern, MUST verify that no existing pattern already covers the use case.

- Check `app/_/helpers/` before creating a new shared helper.
- Check nearby `*.test.ts` files before choosing assertion style or fixture shape.
- Check the owning route under `app/obsidian/` before adding route-local UI or CSS.
- Check `README.md` and `.env.example` before adding configuration.

**Guidelines:**

- MUST verify that no existing pattern already covers the use case before introducing a new pattern.
- SHOULD document why the existing structure is inadequate when no pattern fits.
- MUST NOT copy structure from another project unless it solves a real local problem.

## npm Dependencies

Dependency changes affect bundle size, supply-chain risk, runtime boundaries, and lockfile reproducibility. Prefer built-in Web, Node, React, Next.js, zod, and local helpers when they already cover the need.

**Guidelines:**

- MUST consider built-in Web APIs, Node APIs, React, Next.js, zod, and existing packages before adding a dependency.
- MUST verify a new dependency is maintained, typed, licensed appropriately, and compatible with the import environment.
- MUST NOT add a dependency for base64url, URL parsing, simple user-agent substring checks, or small validation transforms already covered locally.
- MUST commit `package.json` and `package-lock.json` together for dependency changes.
- MUST read the relevant changelog or release notes before upgrading a dependency.
- MUST run `npm run lint`, `npm test`, and `npm run build` after upgrading or removing runtime or build dependencies.
- SHOULD re-check local Next.js docs when upgrading `next`.
- MUST search all usages before removing a dependency.
- MUST NOT leave unused dependencies in `package.json`.

## Public Behavior Changes

Public behavior includes proxy URL shape, payload fields, accepted protocols, metadata output, route paths, and client launch behavior. These changes can invalidate existing links and require docs and tests to move together.

**Guidelines:**

- MUST NOT add README examples for proxy URL shape, payload fields, route paths, or private workflow usage.
- MUST update tests and internal guidance when proxy URL shape, payload fields, environment variables, or route paths change.
- MUST update tests when validation limits, accepted URL protocols, or Obsidian URI construction changes.
- SHOULD preserve backwards compatibility for generated proxy links unless the user accepts invalidating old URLs.
