import { pino } from "pino";

export const rootLogger = pino({
  redact: {
    censor: "[Filtered]",
    paths: [
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
      "*.bridgePayload",
      "*.href",
      "*.obsidianUri",
      "*.path",
      "*.payload",
      "*.query",
      "*.sourceUrl",
      "*.summary",
      "*.title",
      "*.url",
      "*.vault",
    ],
  },
});
