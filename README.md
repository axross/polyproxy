# Obsidian Link Bridge

A small Next.js app that turns encoded Obsidian note targets into HTTPS pages Discord can click and preview.

The bridge route is:

```text
/obsidian/BASE64URL_JSON
```

The JSON payload contains `vault`, `path`, `title`, `summary`, and optional `sourceUrl`. The page decodes that payload server-side, emits Open Graph metadata for Discord, and redirects human visitors to an `obsidian://open` URL with a visible open button as fallback. Known crawlers such as Discord, Twitter/X, Facebook, and Google receive simple server-rendered HTML with an `<h1>` title and `<p>` description instead of the redirect UI. It does not store decoded note metadata.

## Configuration

Create an environment file from the example when running locally:

```bash
cp .env.example .env.local
```

Environment variables:

- `NEXT_PUBLIC_BASE_URL`: canonical public base URL used by bridge URL helpers and metadata.
- `DEFAULT_VAULT`: reserved for notification workflow integration.

Base64url is only obfuscation, not security. Do not include sensitive note content or private personal data in bridge URLs.

## Development

```bash
npm run dev
npm test
npm run test:e2e
npm run lint
npm run build
```

Playwright starts the local development server automatically for E2E tests. To
test an already running preview or production-like server, set
`PLAYWRIGHT_BASE_URL`:

```bash
PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run test:e2e
```

Do not deploy from this repository until the production domain and Vercel project are intentionally configured.

## Example

```ts
import { buildBridgeUrl } from "@/helpers/bridge-url";

const url = buildBridgeUrl("https://obsidian-link.example.com", {
  vault: "Personal",
  path: "Articles/Google wants to make the web agent-ready",
  title: "Google wants to make the web agent-ready",
  summary:
    "An article about Google's effort to make the web easier for agents to navigate.",
});
```

The bridge page builds:

```text
obsidian://open?vault=Personal&file=Articles%2FGoogle%20wants%20to%20make%20the%20web%20agent-ready
```
