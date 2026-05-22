---
name: observability-guidelines
description: |
  Rules for error handling and minimal diagnostics in this stateless Next.js URL proxy. Use when code decodes external payloads, handles expected invalid links, throws route/helper errors, logs runtime diagnostics, or considers adding analytics or telemetry.
---

# Observability Guidelines

Apply these rules when writing, reviewing, or modifying code that handles errors or emits diagnostics. This project currently has no central logger or telemetry pipeline; keep observability simple and privacy-preserving.

## Error Handling

Error handling distinguishes expected invalid proxy links from unexpected internal failures. Expected external input should render stable fallback UI and metadata; unexpected failures should remain visible without leaking decoded target data. The detailed rules live in [error-handling.md](./references/error-handling.md).

**Guidelines:**

- MUST treat malformed proxy URLs as expected external input in route rendering and metadata generation.
- MUST keep vault names, note paths, summaries, source URLs, raw queries, and generated Obsidian URIs out of errors.
- SHOULD use [error-handling.md](./references/error-handling.md) when changing decoders, validators, routes, metadata, or custom-protocol launch behavior.

## Logging

Logging is minimal because this public route may receive invalid links and crawler traffic during normal operation. Diagnostics should be coarse, server-side when possible, and privacy-preserving. The detailed rules live in [logging.md](./references/logging.md).

**Guidelines:**

- SHOULD keep the app quiet during normal invalid-link and custom-protocol behavior.
- MUST NOT log decoded proxy payloads, generated proxy URLs, or `obsidian://` URIs.
- SHOULD use [logging.md](./references/logging.md) before adding console diagnostics, analytics, telemetry, or deployment-error logging.
