import { describe, expect, it } from "vitest";

import { buildObsidianUri } from "./obsidian-uri";

describe("buildObsidianUri", () => {
  it("builds an Obsidian open URI", () => {
    expect(
      buildObsidianUri({
        vault: "Personal",
        path: "Articles/Google wants to make the web agent-ready",
      }),
    ).toBe(
      "obsidian://open?vault=Personal&file=Articles%2FGoogle%20wants%20to%20make%20the%20web%20agent-ready",
    );
  });

  it("encodes percent signs exactly once", () => {
    expect(
      buildObsidianUri({
        vault: "Personal Notes",
        path: "Articles/100% ready",
      }),
    ).toBe(
      "obsidian://open?vault=Personal%20Notes&file=Articles%2F100%25%20ready",
    );
  });
});
