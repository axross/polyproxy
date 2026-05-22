---
name: maintainable-code-guidelines
description: |
  Rules for keeping this small Hono URL proxy readable and easy to evolve. Use when writing or reviewing code for boundaries, pure helper placement, validation centralization, Hono JSX and CSS complexity, dead code, type reuse, kebab-case file naming, camelCase constants, interface-vs-type choices, and scope discipline.
---

# Maintainable Code Guidelines

Apply these rules when writing or reviewing code to keep the app small, explicit, and easy to verify.

## Abstraction Boundaries

Maintainability depends on keeping route registration, validation, URL construction, bot detection, rendering, and client launch behavior in the right layer. The detailed boundary rules live in [abstraction-boundaries.md](./references/abstraction-boundaries.md).

**Guidelines:**

- MUST keep reusable parsing, validation, URL building, and user-agent detection in `src/helpers/**`.
- MUST keep Hono route registration and request branching in `src/routes/**`.
- MUST keep server-rendered markup and document metadata helpers in `src/views/**`.
- MUST keep browser-only custom-protocol behavior in narrow client script snippets rendered by Hono JSX.
- SHOULD use [abstraction-boundaries.md](./references/abstraction-boundaries.md) when a change crosses routes, helpers, views, static assets, or import-boundary concerns.

## Complexity and Readability

Readable code makes the current Obsidian proxy route's three main rendering paths easy to audit: invalid link, crawler preview, and human redirect UI. The detailed complexity rules live in [complexity-and-readability.md](./references/complexity-and-readability.md).

**Guidelines:**

- MUST keep conditionals clear enough that invalid-link, bot, and human paths remain distinguishable.
- MUST remove dead code, unused exports, and stale helper callers during refactors.
- SHOULD use [complexity-and-readability.md](./references/complexity-and-readability.md) when Hono JSX, CSS classes, helper control flow, or type reuse are involved.

## Comment Style

Comments should explain non-obvious protocol, crawler, privacy, or validation behavior; ordinary assignments and markup should stand on their own. The detailed comment rules live in [comment-style.md](./references/comment-style.md).

**Guidelines:**

- SHOULD comment surprising bridge, crawler, browser, validation, or privacy behavior.
- MUST NOT leave commented-out code in the diff.
- SHOULD use [comment-style.md](./references/comment-style.md) when adding or reviewing explanatory comments.

## Naming and Organization

Names should make ownership clear without adding framework folders this app does not need. The detailed naming rules live in [naming-and-organization.md](./references/naming-and-organization.md).

**Guidelines:**

- MUST follow the established `src/helpers`, `src/routes`, and `src/views` layout for app source files.
- SHOULD keep pure helpers flat under `src/helpers/**` until a real subdomain justifies more structure.
- SHOULD use [naming-and-organization.md](./references/naming-and-organization.md) when creating, moving, or renaming files and symbols.

## Scope Discipline

The app is intentionally small and stateless, so speculative options, unused abstractions, and copied project structure add more cost than value. The detailed scope rules live in [scope-discipline.md](./references/scope-discipline.md).

**Guidelines:**

- MUST NOT add speculative payload fields, storage, authentication, analytics, or background jobs.
- SHOULD reuse existing helpers and patterns before adding new ones.
- SHOULD use [scope-discipline.md](./references/scope-discipline.md) when deciding whether a new abstraction, option, folder, or dependency is warranted.
