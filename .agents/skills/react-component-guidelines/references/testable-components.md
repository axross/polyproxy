# Testable Components

Apply these rules when component markup needs stable test targets.

## Data Test IDs

Test IDs should identify meaningful UI targets without turning every element into a globally unique selector. Prefer short IDs scoped by the component hierarchy.

**Example:**

```tsx
<main data-testid="page">
  <section data-testid="bridge-panel">
    <h1 data-testid="title">{payload.title}</h1>
  </section>
</main>
```

**Guidelines:**

- SHOULD add `data-testid` only when automated tests need a stable UI target.
- MUST use kebab-case for `data-testid` values.
- SHOULD keep IDs short and scope-relative, such as `title`, `path`, or `open-actions`.
- SHOULD avoid globally encoded IDs such as `obsidian-bridge-page-note-details-path` when scoped locators can express the hierarchy.

## Propagation Through Components

Reusable components should allow callers to provide test and accessibility attributes without bespoke props for every attribute.

**Example:**

```tsx
export function ObsidianSectionPanel({
  className,
  ...props
}: ComponentPropsWithoutRef<"section">) {
  return <section className={cn(panelClassName, className)} {...props} />;
}
```

**Guidelines:**

- SHOULD accept DOM props on reusable wrapper components so `data-testid`, `aria-*`, and related attributes can pass through.
- MUST spread remaining props onto the root element when using the DOM-props pattern.
- SHOULD accept an explicit `"data-testid"` prop only when the component needs to derive child IDs from the caller's scope.
- MUST NOT drop `data-*` attributes at a Server/Client Component boundary when tests rely on them.

## Loading State IDs

Loading and loaded states should be easy to distinguish without changing the parent test shape.

**Example:**

```tsx
<Suspense
  fallback={<NotePreviewLoading data-testid="preview-loading" />}
>
  <NotePreview data-testid="preview" />
</Suspense>
```

**Guidelines:**

- MUST suffix a loading fallback test ID with `-loading` when the loaded component has a corresponding ID.
- SHOULD keep loading and loaded wrapper elements compatible enough that tests can target the same parent region.
- SHOULD add loading test IDs only when the loading state is observable long enough to test intentionally.
- SHOULD consult [E2E Test Guidelines](../../e2e-test-guidelines/SKILL.md) when a `data-testid` is added for Playwright route coverage.
