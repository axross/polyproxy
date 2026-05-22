const filtered = "[Filtered]";
const filteredBridgeRoute = "/obsidian/[query]";
const bridgeRoutePattern = /\/obsidian\/[A-Za-z0-9_-]+/g;
const obsidianUriPattern = /obsidian:\/\/[^\s"'<>]+/g;

const sensitiveKeys = new Set([
  "bridgePayload",
  "data",
  "from",
  "href",
  "obsidianUri",
  "path",
  "payload",
  "query",
  "query_string",
  "sourceUrl",
  "summary",
  "title",
  "to",
  "url",
  "vault",
]);

interface SentryBreadcrumbLike {
  data?: Record<string, unknown>;
  message?: string;
}

interface SentryEventLike {
  breadcrumbs?: SentryBreadcrumbLike[];
  exception?: {
    values?: Array<{
      value?: string;
    }>;
  };
  extra?: Record<string, unknown>;
  request?: {
    cookies?: unknown;
    data?: unknown;
    headers?: unknown;
    query_string?: unknown;
    url?: string;
  };
  tags?: Record<string, unknown>;
  transaction?: string;
}

export function scrubSentryEvent<TEvent extends SentryEventLike>(
  event: TEvent,
): TEvent {
  if (event.request) {
    event.request.url = scrubUrl(event.request.url);
    event.request.query_string = undefined;
    event.request.headers = undefined;
    event.request.cookies = undefined;
    event.request.data = undefined;
  }

  if (event.transaction) {
    event.transaction = scrubText(event.transaction);
  }

  for (const values of event.exception?.values ?? []) {
    if (values.value) {
      values.value = scrubText(values.value);
    }
  }

  scrubRecord(event.extra);
  scrubRecord(event.tags);

  for (const breadcrumb of event.breadcrumbs ?? []) {
    if (breadcrumb.message) {
      breadcrumb.message = scrubText(breadcrumb.message);
    }

    scrubRecord(breadcrumb.data);
  }

  return event;
}

function scrubRecord(record: Record<string, unknown> | undefined): void {
  if (!record) {
    return;
  }

  for (const [key, value] of Object.entries(record)) {
    if (isSensitiveKey(key)) {
      record[key] = filtered;
      continue;
    }

    if (typeof value === "string") {
      record[key] = scrubText(value);
    }
  }
}

function isSensitiveKey(key: string): boolean {
  return sensitiveKeys.has(key) || sensitiveKeys.has(key.toLowerCase());
}

function scrubText(value: string): string {
  return value
    .replace(bridgeRoutePattern, filteredBridgeRoute)
    .replace(obsidianUriPattern, filtered);
}

function scrubUrl(value: string | undefined): string | undefined {
  if (!value) {
    return value;
  }

  try {
    const url = new URL(value, "https://open.axross.dev");
    const pathname = scrubText(url.pathname);

    return `${url.origin}${pathname}`;
  } catch {
    return scrubText(value);
  }
}
