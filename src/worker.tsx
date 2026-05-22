import { sentry } from "@sentry/hono/cloudflare";

import { createApp } from "./app";
import { scrubSentryEvent } from "./helpers/sentry-privacy";
import { workerLogger } from "./logger";

const app = createApp({
  configureMiddleware(honoApp) {
    honoApp.use(
      sentry(honoApp, (env) => ({
        dsn: env.SENTRY_DSN || undefined,
        enabled: Boolean(env.SENTRY_DSN),
        enableLogs: true,
        sendDefaultPii: false,
        tracesSampleRate: 0,
        beforeSend: scrubSentryEvent,
      })),
    );
  },
  logger: workerLogger,
});

export default app;
