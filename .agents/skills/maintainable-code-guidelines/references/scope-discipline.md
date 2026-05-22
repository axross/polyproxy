# Scope Discipline

Apply these rules to keep new code minimal, focused, and free of speculative abstraction.

## YAGNI

The current Obsidian proxy route has a narrow job: transform a public proxy URL into metadata, a browser page, and an Obsidian launch path. Future proxy scaffolding should not enter the code before the product need exists.

**Guidelines:**

- MUST NOT add configuration options, payload fields, UI controls, storage, authentication, analytics, or background jobs for hypothetical future use.
- MUST NOT introduce an abstraction layer with only one concrete implementation unless it isolates a fragile boundary such as validation or custom-protocol URL construction.
- SHOULD flag any new option or prop that has no current caller.

## DRY With Judgment

Duplication is only harmful when it obscures shared behavior. A little explicit repetition can be clearer when invalid-link, bot, and human paths have different safety constraints.

**Guidelines:**

- SHOULD extract repeated logic after the third real repetition, not after two coincidental similarities.
- MUST NOT merge bot, invalid-link, and human-rendering paths into a generic abstraction if doing so hides their different safety requirements.
- SHOULD keep tests explicit even when a small amount of repetition makes edge cases easier to read.

## KISS

Prefer direct code that reveals the proxy flow over clever helpers that require type gymnastics or mental backtracking.

**Guidelines:**

- MUST prefer simple, direct implementations over clever generic helpers.
- MUST NOT introduce advanced generics or higher-order types when concrete types communicate the payload shape clearly.
- SHOULD flag promise chains or array pipelines that are harder to read than a short loop or early return.

## Scope of a Single Diff

For broader diff-scoping rules, consult [change-management.md](../../development-guidelines/references/change-management.md).

**Guidelines:**

- MUST NOT combine route behavior changes with unrelated CSS polish.
- MUST NOT rename symbols in the same diff as behavior changes unless the rename is required to make the behavior understandable.

## Inventory Check

Before adding new code, check whether the repository, platform, or existing dependency already covers the need.

**Guidelines:**

- MUST check whether a helper already exists in `src/helpers/**`.
- MUST check whether a colocated test pattern already exists next to related code.
- SHOULD prefer built-in Web, Node, Hono, or zod APIs when they solve the problem cleanly.
- SHOULD check whether the change requires README, `.env.example`, or skill guidance updates.
