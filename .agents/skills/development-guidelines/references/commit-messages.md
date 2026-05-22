# Commit Messages

Apply these rules when writing commit messages. The project follows Conventional Commits.

## Format

Commit messages use the Conventional Commits shape so history communicates type, scope, and intent without reading the diff first.

```
<type>(<scope>): <subject>

<body optional>

<footer optional>
```

**Guidelines:**

- MUST use the Conventional Commits format when preparing commits for this repository.
- MAY omit scope only when the change genuinely spans the whole repository.
- SHOULD include a body when the reason, compatibility effect, or dependency risk is not obvious.

## Types

Types describe the nature of the change, not the files touched. A CSS-only presentation update is `style`; dependency maintenance is usually `build` or `chore`; agent-skill upkeep is usually `chore`.

- `feat` - a new feature.
- `fix` - a bug fix.
- `refactor` - a code change that neither fixes a bug nor adds a feature.
- `perf` - a performance improvement.
- `test` - adding or correcting tests.
- `docs` - documentation-only changes.
- `chore` - maintenance, build config, tooling, or agent-skill upkeep.
- `style` - formatting or CSS-only presentation changes.
- `ci` - CI configuration changes.
- `build` - build-system or dependency changes.

**Guidelines:**

- MUST choose the type that reflects the user-visible or maintenance intent of the change.
- SHOULD use `docs` for documentation-only changes outside agent-skill upkeep.
- SHOULD use `chore` for `.agents/skills/**` or `AGENTS.md` maintenance unless the change is purely user-facing documentation.

## Scopes

Scopes should be coarse enough to stay stable as files move. Prefer the broad repository area over helper-level scopes such as `bridge-url`, `validation`, `metadata`, or `bot-detection`.

| Scope | Use for |
| ----- | ------- |
| `app` | User-facing app behavior, Hono routes, route UI, `src/helpers/**`, and CSS |
| `skills` | `.agents/skills/**` and agent workflow guidance in `AGENTS.md` |
| `docs` | README, PRDs, and non-skill documentation |
| `config` | Hono runtime, Vitest, TypeScript, lint, environment examples, and project configuration |
| `deps` | npm manifest and lockfile dependency changes |
| `tests` | Test-only changes in colocated `*.test.ts` or `*.test.tsx` files |
| `ci` | Continuous-integration workflow configuration |

**Guidelines:**

- SHOULD choose the coarse repo-level scope that best describes the changed area.
- SHOULD use `app` for behavior changes even when the touched files are helper-focused.
- SHOULD use `tests` only when the change is test-only; otherwise use the behavior scope.
- MAY omit scope when a change intentionally spans several coarse areas.
- MUST NOT use helper-level scopes such as `bridge-url`, `decode-link`, `base64url`, `validation`, `metadata`, or `bot-detection`.
- MUST NOT invent a one-off scope when an existing coarse scope communicates the change clearly.

## Subject

The subject should be short, imperative, and readable in a one-line history view.

**Guidelines:**

- MUST be under 72 characters.
- MUST use imperative mood, such as "add", "fix", or "update".
- MUST NOT end with a period.
- SHOULD use lowercase after the colon.

## Body

The body explains context that the subject cannot carry, especially why a behavior, dependency, validation, or compatibility choice was made.

**Guidelines:**

- SHOULD explain why the change was needed, especially for behavior, dependency, or validation changes.
- SHOULD mention user-visible compatibility effects, such as invalidating old bridge URLs.
- MAY omit the body for small mechanical or documentation-only changes.

## When to Split Commits

Split commits when combining changes would make review, rollback, or history archaeology harder. Keep mechanical, dependency, docs, and behavior changes separate when practical.

**Guidelines:**

- SHOULD split a change that touches unrelated scopes.
- SHOULD split a broad refactor from a follow-up behavior fix.
- SHOULD separate mechanical changes, dependency updates, and docs-only changes from application behavior when practical.
