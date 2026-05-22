---
name: react-component-guidelines
description: Apply this skill when writing, reviewing, or refactoring React components in this Next.js 16 URL proxy app. Covers route-local _components placement, kebab-case component files, named exports for non-page components, explicit JSX return types, interface props, typed DOM props, Server vs Client Component boundaries, "use client" placement, Suspense/loading splits, Tailwind utility styling, twMerge/tailwind-merge class isolation, and testable data-testid patterns. Use when the user says component, React, RSC, use client, Suspense, Tailwind, className, twMerge, or data-testid.
---

# React Component Guidelines

Apply these rules when writing, reviewing, or refactoring React components in this project. This skill was imported from `axross/btnopen.com` and adapted for this repository's smaller Next.js App Router surface, `app/_` private-module layout, and Tailwind CSS styling convention.

## Component Conventions

Components should be easy to place, type, import, and scan. This project follows the `btnopen.com` convention: route-local `_components/` directories, kebab-case component files, named exports for non-page components, explicit return types, and typed root-element props rather than broad global component folders.

**Guidelines:**

- SHOULD read [component-conventions.md](./references/component-conventions.md) when adding, moving, renaming, typing, or exporting React components.
- MUST keep route-local components under the owning route's `_components/` directory unless they have multiple route callers.
- MUST use named exports for non-page components.
- SHOULD use typed DOM props and prop spreading for reusable wrapper components.
- SHOULD consult [Project Structure](../project-structure/SKILL.md) before adding a component directory or moving a component across route boundaries.

## Server and Client Components

The default component in this app is a Server Component. Client Components are narrow browser-behavior islands, such as the Obsidian launch component that needs `window.location`.

**Guidelines:**

- SHOULD read [server-client-boundaries.md](./references/server-client-boundaries.md) when a component uses hooks, browser APIs, `next/headers`, async route inputs, Suspense, or server-only helpers.
- MUST keep `"use client";` files limited to components that need browser APIs, React state/effects, event handlers, or client-only third-party modules.
- MUST keep `next/headers`, environment access, Node APIs, and async Server Component work out of Client Components.
- SHOULD split mixed server/client behavior at the smallest useful boundary.

## Tailwind Styling

Component styling uses Tailwind utilities. Import `twMerge` from `tailwind-merge` when base component classes and caller-provided layout classes need to be merged without leaking style responsibility across component levels.

**Guidelines:**

- MUST read [tailwind-styling.md](./references/tailwind-styling.md) when adding or changing component styling, className passthroughs, responsive layout, focus states, or global CSS tokens.
- MUST prefer Tailwind utilities over CSS modules for component styling.
- MUST use `twMerge()` when a component accepts `className` or combines base classes with caller-provided classes.
- SHOULD keep global CSS limited to Tailwind import, design tokens, reset rules, and truly global browser behavior.

## Testable Components

Test IDs are useful only when tests need stable UI targets. They should mirror component hierarchy rather than become globally unique naming schemes.

**Guidelines:**

- SHOULD read [testable-components.md](./references/testable-components.md) when adding `data-testid`, loading states, or component APIs intended for tests.
- SHOULD add `data-testid` only to meaningful UI elements that tests need to target.
- MUST keep `data-testid` values kebab-case and scope-relative.
- SHOULD consult [Quality Assurance Guidelines](../quality-assurance-guidelines/SKILL.md) when deciding whether UI component behavior needs automated tests or manual evidence.
