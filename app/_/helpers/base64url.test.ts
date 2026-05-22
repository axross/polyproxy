import { describe, expect, it } from "vitest";

import { decodeBase64Url, encodeBase64Url } from "./base64url";

describe("base64url utilities", () => {
  it("encodes and decodes ASCII without padding", () => {
    const encoded = encodeBase64Url("Personal");

    expect(encoded).toBe("UGVyc29uYWw");
    expect(encoded).not.toMatch(/[+/=]/);
    expect(decodeBase64Url(encoded)).toBe("Personal");
  });

  it("round-trips Unicode text", () => {
    const value = "Articles/寿司とAIの記事";

    expect(decodeBase64Url(encodeBase64Url(value))).toBe(value);
  });

  it("rejects malformed Base64url input", () => {
    expect(() => decodeBase64Url("abc=")).toThrow("Invalid Base64url value");
    expect(() => decodeBase64Url("not valid")).toThrow(
      "Invalid Base64url value",
    );
    expect(() => decodeBase64Url("a")).toThrow("Invalid Base64url value");
  });
});
