---
name: development-guidelines
description: |
  Rules for implementing, refactoring, and shipping code in this Next.js Obsidian bridge. Use for any code change: covers reading local Next.js 16 docs, npm command sequence, App Router/server-client boundaries, import hygiene, dependency rules, verification, and commit message conventions.
---

# Development Guidelines

Apply these rules when writing, refactoring, or shipping code in this project.

## Code Quality

Code quality starts with the local Next.js version, then narrows to the repository's TypeScript, App Router, import, and comment conventions. The detailed rules live in [code-quality.md](./references/code-quality.md).

**Guidelines:**

- MUST read the relevant local Next.js docs before changing App Router behavior or configuration.
- MUST keep TypeScript, import, and server/client boundary choices aligned with existing `app/**`, `app/_/**`, and route-local `_components` patterns.
- SHOULD use [code-quality.md](./references/code-quality.md) as the first reference for implementation hygiene.

## Change Management

Change management keeps this small app reviewable by separating behavior, structure, styling, dependencies, and skill maintenance. The detailed rules live in [change-management.md](./references/change-management.md).

**Guidelines:**

- MUST keep each diff focused on one concern unless the user explicitly asks for a broader change.
- MUST preserve public bridge behavior during refactors unless the requested change intentionally alters it.
- SHOULD check existing `app/`, `app/_/helpers/`, colocated test, README, and `.env.example` patterns before adding structure.
- SHOULD use [change-management.md](./references/change-management.md) when dependencies, public behavior, or refactoring scope are involved.

## Verification

Verification maps the changed surface to the checks that can catch regressions. [verification.md](./references/verification.md) explains output surfaces; [Quality Assurance Guidelines](../quality-assurance-guidelines/SKILL.md) owns mandatory command gates and evidence rules.

**Guidelines:**

- MUST identify the output surface at risk before choosing verification.
- MUST consult [Quality Assurance Guidelines](../quality-assurance-guidelines/SKILL.md) for required commands, manual evidence, and missing-check severity.
- SHOULD use [verification.md](./references/verification.md) to choose checks based on the changed files and output surfaces.

## Dev Commands

Development commands are intentionally few and should match `package.json`; this project has no copied mobile, GraphQL, or database workflow commands. The command reference lives in [dev-commands.md](./references/dev-commands.md).

**Guidelines:**

- MUST use only commands that exist in this repository or are explicitly documented by local tooling.
- MUST keep `.env.example` and README configuration instructions synchronized when environment variables change.
- SHOULD use [dev-commands.md](./references/dev-commands.md) for setup, local server, lint, test, build, and targeted test examples.

## Commit Messages

Commit messages follow Conventional Commits so app, test, dependency, and agent-skill work can be scanned quickly. The detailed rules live in [commit-messages.md](./references/commit-messages.md).

**Guidelines:**

- MUST use Conventional Commits format when asked to write or prepare a commit.
- SHOULD choose coarse repo-level scopes such as `app`, `skills`, `docs`, `config`, `deps`, `tests`, or `ci`.
- SHOULD use [commit-messages.md](./references/commit-messages.md) when deciding subject wording, body content, or commit splitting.
