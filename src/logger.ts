const filtered = "[Filtered]";

const sensitiveKeys = new Set([
  "bridgePayload",
  "href",
  "obsidianUri",
  "path",
  "payload",
  "query",
  "sourceUrl",
  "summary",
  "title",
  "url",
  "vault",
]);

export interface StructuredLogger {
  error(fields: Record<string, unknown>, message: string): void;
}

export const workerLogger: StructuredLogger = {
  error(fields, message) {
    console.error({
      level: "error",
      message,
      ...redact(fields),
    });
  },
};

function redact(fields: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [
      key,
      isSensitiveKey(key) ? filtered : value,
    ]),
  );
}

function isSensitiveKey(key: string): boolean {
  return sensitiveKeys.has(key) || sensitiveKeys.has(key.toLowerCase());
}
