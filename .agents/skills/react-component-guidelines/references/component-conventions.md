# Component Conventions

Apply these rules when creating or reshaping React component files, props, return types, or exports.

## File and Module Ownership

Component placement follows the route tree. A component used only by `/obsidian/[query]` belongs under that route; a component shared by both `/obsidian` routes can live at the route segment's `_components/` level.

**Example:**

```text
app/obsidian/
├── _components/
│   └── page-frame.tsx
├── [query]/
│   ├── _components/
│   │   └── open-actions.tsx
│   └── page.tsx
└── page.tsx
```

**Guidelines:**

- MUST place route-local components under the owning route's `_components/` directory.
- SHOULD promote a component to a parent `_components/` directory only after it has more than one route-level caller.
- MUST use kebab-case for component filenames that are not Next.js convention files, such as `open-actions.tsx`.
- MUST NOT add broad `components/`, `src/components/`, or feature-folder component roots unless [Project Structure](../../project-structure/SKILL.md) is updated for that convention.

## Props and Root Elements

Reusable wrapper components should accept the native props of the element they render. This keeps `className`, `data-*`, `aria-*`, and event props typed without rebuilding the DOM API by hand.

**Example:**

```tsx
import type { ComponentProps, JSX } from "react";

import { cn } from "@/helpers/class-names";

export function ObsidianPage({
  className,
  ...props
}: ComponentProps<"main">): JSX.Element {
  return <main className={cn("min-h-full", className)} {...props} />;
}
```

**Guidelines:**

- SHOULD use `ComponentProps<"element">` for components whose root element is a built-in DOM element.
- MUST type custom props explicitly instead of using `any`.
- MUST use `interface` for object-only prop shapes.
- MUST spread remaining root props when accepting DOM props so `aria-*`, `data-*`, and `className` passthroughs work.
- SHOULD include a `className` prop only when callers need to control parent-level layout, spacing, or placement.
- SHOULD use `import type` for React types used only at compile time.

## Return Types and Exports

Exports should follow the role of the file. Next.js route files use framework-required default exports; other components use named exports, matching `btnopen.com`.

**Good Examples:**

> `export default function ObsidianOverviewPage()` in `page.tsx`.

> `export function ObsidianPage(...)` in a shared route component file.

**Bad Example:**

> `export default function OpenActions(...)` in `_components/open-actions.tsx`.

**Guidelines:**

- MUST use default exports for Next.js route convention files when Next.js requires them, such as `page.tsx` and `layout.tsx`.
- MUST use named exports for non-page React components.
- MUST declare explicit return types for exported React components.
- MUST return `JSX.Element` or `JSX.Element | null` from Client Components.
- MUST return `Promise<JSX.Element>` or `Promise<JSX.Element | null>` from async Server Components.
- MUST NOT export a component whose name surprises readers relative to the filename and primary concept.
