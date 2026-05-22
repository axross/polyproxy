---
name: maintainable-code-guidelines
description: |
  Rules for keeping this small Next.js bridge readable and easy to evolve. Use when writing or reviewing code for boundaries, server/client separation, pure helper placement, validation centralization, JSX and Tailwind class complexity, dead code, type reuse, btnopen-style kebab-case file naming, page-props.ts route contracts, camelCase constants, interface-vs-type choices, and scope discipline.
---

# Maintainable Code Guidelines

Apply these rules when writing or reviewing code to keep the app small, explicit, and easy to verify.

## Abstraction Boundaries

Maintainability depends on keeping route rendering, validation, URL construction, bot detection, and client launch behavior in the right layer. The detailed boundary rules live in [abstraction-boundaries.md](./references/abstraction-boundaries.md).

**Guidelines:**

- MUST keep reusable parsing, validation, URL building, and user-agent detection in `app/_/helpers/**`.
- MUST keep browser-only custom-protocol behavior in client components.
- SHOULD use [abstraction-boundaries.md](./references/abstraction-boundaries.md) when a change crosses route files, `app/_/**`, route-local `_components`, or import-boundary concerns.

## Complexity and Readability

Readable code makes the bridge's three main rendering paths easy to audit: invalid link, crawler preview, and human redirect UI. The detailed complexity rules live in [complexity-and-readability.md](./references/complexity-and-readability.md). For React component mechanics and Tailwind class composition, consult [React Component Guidelines](../react-component-guidelines/SKILL.md).

**Guidelines:**

- MUST keep conditionals clear enough that invalid-link, bot, and human paths remain distinguishable.
- MUST remove dead code, unused exports, and stale helper callers during refactors.
- SHOULD use [complexity-and-readability.md](./references/complexity-and-readability.md) when JSX, Tailwind classes, helper control flow, or type reuse are involved.
- SHOULD consult [React Component Guidelines](../react-component-guidelines/SKILL.md) when maintainability concerns depend on React props, Server/Client boundaries, or component-level Tailwind class merging.

## Comment Style

Comments should explain non-obvious protocol, crawler, privacy, or validation behavior; ordinary assignments and markup should stand on their own. The detailed comment rules live in [comment-style.md](./references/comment-style.md).

**Guidelines:**

- SHOULD comment surprising bridge, crawler, browser, validation, or privacy behavior.
- MUST NOT leave commented-out code in the diff.
- SHOULD use [comment-style.md](./references/comment-style.md) when adding or reviewing explanatory comments.

## Naming and Organization

Names should make ownership clear without adding framework folders this app does not need. The detailed naming rules live in [naming-and-organization.md](./references/naming-and-organization.md).

**Guidelines:**

- MUST follow Next.js App Router file naming for route files.
- SHOULD keep pure helpers flat under `app/_/helpers/**` until a real subdomain justifies more structure.
- SHOULD use [naming-and-organization.md](./references/naming-and-organization.md) when creating, moving, or renaming files and symbols.

## Scope Discipline

The app is intentionally small and stateless, so speculative options, unused abstractions, and copied project structure add more cost than value. The detailed scope rules live in [scope-discipline.md](./references/scope-discipline.md).

**Guidelines:**

- MUST NOT add speculative payload fields, storage, authentication, analytics, or background jobs.
- SHOULD reuse existing helpers and patterns before adding new ones.
- SHOULD use [scope-discipline.md](./references/scope-discipline.md) when deciding whether a new abstraction, option, folder, or dependency is warranted.
