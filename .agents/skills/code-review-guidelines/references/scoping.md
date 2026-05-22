# Scoping

Apply these rules to bound the review so findings are focused, relevant, and complete.

## What Is In Scope

The review starts with the diff and includes context needed to determine whether each changed line is correct.

**Guidelines:**

- MUST read every file in the diff in full.
- MUST read callers and callees of changed exported helpers far enough to verify integration.
- SHOULD read existing tests for changed helpers or route behavior.
- SHOULD read README, `.env.example`, and `AGENTS.md` when public behavior, configuration, or skill routing changes.
- MUST review `package.json` and `package-lock.json` together when dependencies or scripts change.

## What Is Out of Scope

Review should not drift into unrelated cleanup. Out-of-scope issues may be noted, but they should not block the reviewed change.

**Guidelines:**

- MUST NOT gate the review on pre-existing issues in unchanged files unless the diff activates them.
- MUST exclude `.next/**`, `node_modules/**`, coverage output, build artifacts, and generated framework files.
- SHOULD verify lockfile intent without line-reviewing transitive package metadata.
- MUST defer large product decisions unless the diff explicitly proposes them.

## Depth of Reading

Depth should match risk. Validation and route changes need deeper context than copy edits.

**Guidelines:**

- MUST identify central callers for changed exported functions or components.
- MUST identify central imported helpers used by the change.
- SHOULD read matching tests when they exist.
- SHOULD check public docs or configuration examples when behavior changes.

## When to Read More

Certain change types have predictable context needs. Use these as triggers for targeted expansion.

**Guidelines:**

- MUST read `app/_/helpers/validation.ts`, `app/_/helpers/decode-link.ts`, and relevant tests for validation changes.
- MUST read `app/obsidian/[query]/page.tsx` and related helpers for route changes.
- SHOULD read proxy URL construction and base URL behavior for metadata changes.
- SHOULD inspect package purpose, import environment, lockfile size, and scripts for dependency changes.

## Out-of-Scope Findings

Out-of-scope observations can be useful if clearly labeled and separated from merge blockers.

**Guidelines:**

- MUST label pre-existing or unrelated observations as out of scope.
- MUST NOT gate the review on out-of-scope findings.
- MAY recommend a follow-up when the risk is real.
