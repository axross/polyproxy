import { describe, expect, it } from "vitest";

import { scrubSentryEvent } from "./sentry-privacy";

describe("scrubSentryEvent", () => {
  it("redacts bridge route details from request fields", () => {
    const event = scrubSentryEvent({
      request: {
        url: "https://open.axross.dev/ob/eyJ2YXVsdCI6IlBlcnNvbmFsIn0",
        query_string: "secret=true",
        headers: { cookie: "session=secret" },
        cookies: "session=secret",
        data: { vault: "Personal" },
      },
    });

    expect(event.request?.url).toBe("https://open.axross.dev/ob/[query]");
    expect(event.request?.query_string).toBeUndefined();
    expect(event.request?.headers).toBeUndefined();
    expect(event.request?.cookies).toBeUndefined();
    expect(event.request?.data).toBeUndefined();
  });

  it("redacts Obsidian URIs and sensitive breadcrumb data", () => {
    const event = scrubSentryEvent({
      breadcrumbs: [
        {
          message:
            "Opening obsidian://open?vault=Personal&file=Private%2FNote",
          data: {
            href: "https://open.axross.dev/ob/abc123",
            navigationType: "push",
          },
        },
      ],
      exception: {
        values: [
          {
            value:
              "Failed at /ob/abc123 for obsidian://open?vault=Personal",
          },
        ],
      },
      extra: {
        path: "Private/Note.md",
        operation: "open",
      },
      tags: {
        route: "/ob/abc123",
      },
      transaction: "GET /ob/abc123",
    });

    expect(event.breadcrumbs?.[0]?.message).toBe("Opening [Filtered]");
    expect(event.breadcrumbs?.[0]?.data?.href).toBe("[Filtered]");
    expect(event.breadcrumbs?.[0]?.data?.navigationType).toBe("push");
    expect(event.exception?.values?.[0]?.value).toBe(
      "Failed at /ob/[query] for [Filtered]",
    );
    expect(event.extra?.path).toBe("[Filtered]");
    expect(event.extra?.operation).toBe("open");
    expect(event.tags?.route).toBe("/ob/[query]");
    expect(event.transaction).toBe("GET /ob/[query]");
  });
});
