let resolvedRuntimeType: "client" | "edge" | "node" | "unknown" = "unknown";

if (typeof globalThis.window !== "undefined") {
  resolvedRuntimeType = "client";
} else if (process.env.NEXT_RUNTIME === "nodejs") {
  resolvedRuntimeType = "node";
} else if (process.env.NEXT_RUNTIME === "edge") {
  resolvedRuntimeType = "edge";
}

export const runtimeType = resolvedRuntimeType;
export const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN || undefined;
export const isSentryEnabled = sentryDsn !== undefined;
