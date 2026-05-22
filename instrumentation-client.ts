import {
  captureRouterTransitionStart,
  init as initializeSentry,
} from "@sentry/nextjs";

import { scrubSentryEvent } from "@/helpers/sentry-privacy";
import { sentryDsn } from "@/runtime";

if (sentryDsn) {
  initializeSentry({
    dsn: sentryDsn,
    enableLogs: true,
    sendDefaultPii: false,
    tracesSampleRate: 0,
    beforeSend: scrubSentryEvent,
  });
}

export const onRouterTransitionStart = captureRouterTransitionStart;
