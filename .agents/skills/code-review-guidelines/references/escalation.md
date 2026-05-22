# Escalation

Apply these rules to maintain proper boundaries as a reviewer.

## Reviewer Boundary

Review-only work produces a report. It does not edit, commit, or decide product scope.

**Guidelines:**

- MUST NOT mutate files during a review-only task.
- MUST NOT run commands that change tracked files.
- MUST NOT create commits, push branches, or open pull requests.
- MUST leave application decisions to the caller.

## Findings Must Be Easy to Apply

The author should not have to reconstruct the reviewer's path through the codebase.

**Guidelines:**

- MUST satisfy the citation requirements in [evidence.md](./evidence.md).
- MUST include a concrete next step when the fix is not obvious.
- SHOULD avoid findings that require the caller to rediscover context already available to the reviewer.

## Defer These Decisions

Some decisions are product or architecture calls, not review verdicts.

**Guidelines:**

- MUST defer product decisions such as adding authentication, analytics, storage, or a new proxy URL format.
- MUST defer compatibility decisions that invalidate existing proxy URLs.
- SHOULD present trade-offs for dependency choices where two supported options are viable.
- SHOULD ask about visual design choices not covered by an existing requirement.

## Verification Commands

Recommended commands should match `package.json`. QA owns the required command gates; review comments should reference those gates instead of inventing phantom process requirements.

**Guidelines:**

- SHOULD consult [lint-and-format-gate.md](../../quality-assurance-guidelines/references/lint-and-format-gate.md) before naming required verification commands.
- MAY recommend `npm run lint` for ESLint.
- MAY recommend `npm test` for Vitest.
- MAY recommend `npm run build` for the Next.js production build.
- MAY recommend `npm test -- 'app/_/helpers/<file>.test.ts'` for a targeted Vitest file.
- MUST NOT recommend nonexistent scripts such as `npm run typecheck`, `npm run test:native`, or `npm run web` unless they have been added to `package.json`.
