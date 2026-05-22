# polyproxy

`polyproxy` is a small, stateless URL proxy server for `open.axross.dev`.

It supports private URL proxy workflows behind normal HTTPS pages. Operational details are intentionally not documented here.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4 through PostCSS
- zod
- Vitest
- Playwright
- ESLint

## Development

Install dependencies, then create a local environment file when needed:

```bash
npm install
cp .env.example .env.local
```

Run the local server:

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

Playwright starts the local development server automatically for E2E tests. To test an already running preview or production-like server, set `PLAYWRIGHT_BASE_URL`:

```bash
PLAYWRIGHT_BASE_URL=<server-url> npm run test:e2e
```
