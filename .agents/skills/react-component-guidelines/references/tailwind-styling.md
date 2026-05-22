# Tailwind Styling

Apply these rules when styling React components with Tailwind utilities and `tailwind-merge`.

## Tailwind Setup and Global CSS

Tailwind is the component styling default. Global CSS exists for Tailwind import, root design tokens, reset rules, and truly global browser behavior such as focus-visible defaults.

**Example:**

```css
@import "tailwindcss";

:root {
  --foreground: #171923;
  --surface: #ffffff;
}
```

**Guidelines:**

- MUST use Tailwind utilities for component-level styling.
- SHOULD NOT add CSS modules for ordinary component layout, color, spacing, typography, or responsive behavior.
- MUST keep `app/globals.css` limited to Tailwind import, root tokens, reset rules, and global browser behavior.
- SHOULD use existing root CSS variables through Tailwind arbitrary values, such as `text-[var(--foreground)]`, when styling with project tokens.
- MUST NOT add hard-coded color literals inside component class strings when an existing token covers the role.

## Class Ownership and Merging

Each component level owns its own styling concerns. Parents own placement and outside spacing; children own internal layout, color, interaction states, and accessible hit targets.

**Example:**

```tsx
const styles = {
  actions: cn("mt-8"),
};

<OpenActions className={styles.actions} obsidianUri={obsidianUri} />;
```

```tsx
const actionStyles = cn("flex flex-wrap items-center gap-3");

return <div className={cn(actionStyles, className)} />;
```

**Guidelines:**

- MUST use `cn()` from `@/helpers/class-names` when a component accepts `className`.
- MUST use `cn()` when combining multiple class groups that can override each other.
- MUST keep parent-level spacing, placement, and sizing in the parent that composes the child.
- MUST keep a child component's internal shape, color, typography, and interaction classes inside the child component.
- SHOULD avoid manual string concatenation for class names.

## Local Class Organization

Tailwind class strings can become dense. Small local class maps keep JSX readable without recreating CSS module indirection.

**Example:**

```tsx
const styles = {
  title: cn(
    "text-balance text-[clamp(2rem,8vw,3rem)] font-bold leading-[1.08]",
    "text-[var(--foreground)]",
  ),
};
```

**Guidelines:**

- SHOULD use a local `styles` object when named class groups make JSX easier to scan.
- SHOULD keep one-off short class strings inline when a local name would add indirection without clarity.
- MUST NOT create global utility classes for a single route or component.
- SHOULD extract a route-local component when the same Tailwind class group appears across sibling route files.

## Responsive and Accessible Styling

Responsive behavior should be explicit at the component that owns the layout. Accessibility states should stay visible and should not depend on hidden CSS side effects.

**Example:**

```tsx
const buttonClassName = cn(
  "inline-flex min-h-11 items-center justify-center rounded-md",
  "max-sm:w-full",
);
```

**Guidelines:**

- SHOULD use Tailwind responsive variants such as `max-sm:` for route UI that adapts to viewport width.
- MUST preserve visible focus states on interactive elements.
- MUST use semantic elements first, such as `<a>` for Obsidian launch links and `<button>` for local actions.
- SHOULD keep text wrapping explicit for long note titles, paths, and URLs.
- SHOULD verify narrow mobile and desktop widths when Tailwind classes affect layout or text fit.
