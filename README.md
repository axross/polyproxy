# polyproxy

`polyproxy` is a small URL proxy server for `open.axross.dev`.

It supports private URL proxy workflows behind normal HTTPS pages. Operational details are intentionally not documented here.

## Tech Stack

- Hono
- Cloudflare Workers
- Cloudflare Workers KV
- Wrangler
- TypeScript
- zod
- Sentry
- Vitest
- Playwright
- Biome

## Development

Install dependencies, then create a local environment file when needed:

```bash
npm install
cp .dev.vars.example .dev.vars
```

Run the Worker locally with Wrangler:

```bash
npm run dev
```

Use these checks before handing off changes:

```bash
npm test
npm run test:e2e
npm run lint
npm run build
```

Playwright starts `wrangler dev` automatically for E2E tests. To test an already
running preview or production-like server, set `PLAYWRIGHT_BASE_URL`:

```bash
PLAYWRIGHT_BASE_URL=<server-url> npm run test:e2e
```

## Deployment

Deploy the Worker with Wrangler:

```bash
npm run deploy
```

`wrangler.jsonc` is the source of truth for Worker configuration, static assets,
and the production `PUBLIC_BASE_URL`. Configure `SENTRY_DSN` as a Worker secret
before deploying Sentry-enabled production builds:

```bash
npx wrangler secret put SENTRY_DSN
```
