# Supply Chain

Apply these rules to verify new npm dependencies are justified, trustworthy, and appropriate for this small Hono app.

## Dependency Justification

A dependency should earn its place. Small URL, base64url, validation, and string helpers are usually already covered by platform APIs or local code.

For review severity labels, consult [code-review severity](../../code-review-guidelines/references/severity.md).

**Guidelines:**

- MUST require justification when a diff adds a direct dependency.
- MUST compare the dependency against built-in Web APIs, Node APIs, Hono, zod, and existing local helpers.
- MUST reject dependencies that duplicate existing functionality unless the user accepts the trade-off.
- SHOULD question thin wrappers around one or two standard-library calls.

## Lockfile

The npm lockfile is part of the dependency change. Package manifest and lockfile drift makes installs non-reproducible.

**Guidelines:**

- MUST require a matching `package-lock.json` update when `package.json` dependency entries change.
- MUST require an explainable manifest or npm metadata reason when the lockfile changes.
- SHOULD question a large transitive tree for one new direct dependency unless the author justifies it.

## Dependency Quality Signals

Quality checks reduce the risk of abandoned, vulnerable, or incompatible packages entering the app.

**Guidelines:**

- SHOULD verify recent maintenance activity.
- SHOULD verify no recent unaddressed security advisories for the introduced version.
- SHOULD verify built-in TypeScript types or maintained `@types/*` coverage.
- SHOULD verify a license compatible with this project.
- MUST verify compatibility with the import environment: Cloudflare Worker entry code, Hono route/view code, browser script snippets, or test-only code.

## Install Scripts and Runtime Boundaries

Install scripts and wrong-side imports can execute unexpected code or break the Worker runtime or browser script snippets.

**Guidelines:**

- MUST reject or escalate risky `postinstall`, `preinstall`, `prepare`, or `prepublish` scripts.
- MUST reject production imports from packages that belong only in `devDependencies`.
- MUST reject client-bundled imports of Node-only dependencies.
- MUST reject server-only dependencies pulled across a `"use client"` boundary.
