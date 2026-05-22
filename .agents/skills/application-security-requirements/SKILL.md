---
name: application-security-requirements
description: |
  OWASP-framed security and privacy rules for this small Next.js Obsidian bridge. Use when writing or reviewing code that handles bridge payloads, base64url decoding, Obsidian URI construction, source URLs, Open Graph metadata, environment variables, robots/indexing behavior, or npm dependency changes.
---

# Application Security Requirements

Apply these rules when reviewing the security implications of any code change in this project. The app is public and stateless; most risk comes from treating encoded URL data as trusted, leaking note metadata, or adding unnecessary dependencies.

## Secret and Environment-Variable Handling

Configuration is intentionally small. Public base URL configuration is safe to expose, but credentials and decoded note data do not belong in source, logs, or client-visible environment variables.

**Guidelines:**

- SHOULD read [secret-handling.md](./references/secret-handling.md) when a change touches environment variables, logging, diagnostics, or configuration docs.
- MUST keep literal secrets, private environment files, decoded note metadata, and generated Obsidian URIs out of the repository and logs.
- MUST keep `.env.example` and README configuration notes in sync when configuration changes.

## Input Validation

Every bridge URL is attacker-controlled input until it passes base64url, JSON, and schema validation. Validated payloads are the only values that may reach metadata, UI, or custom-protocol URI construction.

**Guidelines:**

- SHOULD read [input-validation.md](./references/input-validation.md) when changing query decoding, payload schemas, field limits, source URL handling, or Obsidian URI construction.
- MUST validate decoded JSON through the canonical validation helpers before use.
- MUST preserve fail-closed behavior for malformed query strings and invalid payload fields.

## Privacy and Exposure Control

Base64url is obfuscation, not access control. Anyone with a bridge URL can decode its vault, path, title, summary, and optional source URL.

**Guidelines:**

- SHOULD read [access-control.md](./references/access-control.md) when changing public route behavior, crawler behavior, indexing metadata, UI exposure, storage, or auth assumptions.
- MUST NOT claim bridge URLs are private, encrypted, authenticated, or secure.
- MUST keep the app stateless unless the user explicitly accepts a product-scope change.

## Supply Chain

This app should stay small. New packages add review, audit, bundle, and runtime-boundary risk, so built-in Web, Node, React, Next.js, and zod APIs are the default.

**Guidelines:**

- SHOULD read [supply-chain.md](./references/supply-chain.md) when adding, removing, or upgrading npm dependencies.
- MUST keep `package.json` and `package-lock.json` synchronized.
- SHOULD reject dependencies that duplicate built-in or existing local functionality.
