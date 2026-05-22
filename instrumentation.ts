import { captureRequestError } from "@sentry/nextjs";

import { rootLogger } from "@/logger";
import { runtimeType, sentryDsn } from "@/runtime";

const logger = rootLogger.child({ module: "instrumentation" });

export async function register(): Promise<void> {
  logger.info("Started initializing server error tracking.");

  if (!sentryDsn) {
    logger.info(
      "Skipped initializing Sentry because NEXT_PUBLIC_SENTRY_DSN is not configured.",
    );
    logger.info("Finished initializing server error tracking.");
    return;
  }

  logger.info({ runtime: runtimeType }, "Started initializing Sentry.");

  if (runtimeType === "node") {
    await import("./sentry.server.config");
  } else if (runtimeType === "edge") {
    await import("./sentry.edge.config");
  } else {
    logger.warn({ runtime: runtimeType }, "Skipped Sentry for unknown runtime.");
  }

  logger.info("Finished initializing Sentry.");
  logger.info("Finished initializing server error tracking.");
}

export const onRequestError = captureRequestError;
