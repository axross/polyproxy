import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const isCi = Boolean(process.env.CI);
const sentryOrg = process.env.SENTRY_ORG;
const sentryProject = process.env.SENTRY_PROJECT;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ["*.ngrok-free.app"],
  serverExternalPackages: ["pino", "pino-pretty"],
};

export default withSentryConfig(nextConfig, {
  org: sentryOrg,
  project: sentryProject,
  silent: !isCi,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
