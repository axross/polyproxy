# Complexity and Readability

Apply these rules to surface code that has grown too complex or hard to read.

## JSX and Branching

The Obsidian route has distinct invalid-link, crawler, and human experiences. JSX should make those branches obvious instead of hiding them inside nested conditionals.

**Guidelines:**

- SHOULD flag JSX that nests more than four levels deep inside one component body.
- MUST flag nested conditional rendering that obscures invalid-link, bot, and human rendering paths. Prefer early returns or small named components.
- SHOULD keep crawler-only markup simple enough to audit for accidental redirect behavior.

## Tailwind Class Complexity

Route-local styling should stay with the component that owns the markup. Tailwind utility strings are preferred over CSS modules, and `twMerge()` from `tailwind-merge` should merge parent-supplied layout classes with component-owned defaults.

**Guidelines:**

- SHOULD flag long Tailwind class strings that mix unrelated component levels, such as page shell, panel, and button styling in one component.
- SHOULD flag duplicated Tailwind class groups across sibling route components when a small route-local component would be clearer.
- MUST use `twMerge()` when a component accepts `className` or combines base classes with caller-provided classes.
- MUST keep parent-level spacing and layout at the parent component level; child components should own their internal shape, color, and interaction classes.
- SHOULD verify text still fits at narrow mobile widths when copy or Tailwind classes change.

## Control Flow

Decoder, validator, and URL-builder control flow should expose the order of checks. Early returns and named predicates usually read better than deeply nested branches.

**Guidelines:**

- SHOULD flag deeply nested `if` / `else` chains over three levels.
- SHOULD flag helper functions exceeding about 50 lines of logic.
- MUST flag a `switch` over a union that lacks an exhaustive fallback or explicit default behavior.
- SHOULD prefer small named predicates for validation rules that are reused in code and tests.

## Dead Code

Dead code makes small apps feel larger than they are and can hide stale assumptions from earlier bridge behavior.

**Guidelines:**

- MUST flag commented-out code in the diff.
- MUST flag unused imports, variables, parameters, components, or exported helpers.
- MUST flag helper exports that have no remaining production or test callers after a refactor.
- MUST flag `${"literal"}` or `${'literal'}` inside a template literal; replace with the bare characters.

## Type Reuse

Shared types are part of the contract between helpers, route code, and tests. Reusing them prevents small schema differences from accumulating.

**Guidelines:**

- MUST reuse `BridgePayload` for bridge payload shape and `Result<T>` for safe helper return shapes.
- MUST NOT duplicate payload field limits outside `fieldLimits` unless the new limit has a separate domain purpose.
- SHOULD avoid inline object types when the same shape appears in route code and tests.

## Comments for Deliberate Divergence

When a route deliberately differs from the obvious helper path or sibling path, a short comment can prevent future cleanup from erasing an intentional safety choice.

**Guidelines:**

- SHOULD add a short comment when a route intentionally diverges from an obvious sibling path, such as bot rendering avoiding client redirects.
- MUST NOT comment code that follows the canonical helper path unchanged.
- SHOULD explain browser custom-protocol or crawler behavior when it is not obvious from the code.
