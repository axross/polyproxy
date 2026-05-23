import { describe, expect, it } from "vitest";

import { decodeBase64Url } from "../../common/helpers/base64url";
import {
	buildBridgeUrl,
	buildShortBridgeUrl,
	getConfiguredBaseUrl,
} from "./bridge-url";
import type { BridgePayload } from "./validation";

const payload: BridgePayload = {
	vault: "Personal",
	path: "Articles/Google wants to make the web agent-ready",
	title: "Google wants to make the web agent-ready",
	summary:
		"An article about Google's effort to make the web easier for agents to navigate.",
};

describe("buildBridgeUrl", () => {
	it("builds a deterministic /ob/[query] URL", () => {
		const url = new URL(buildBridgeUrl("https://notes.example.com", payload));
		const encodedQuery = getEncodedQuery(url);

		expect(url.origin).toBe("https://notes.example.com");
		expect(url.pathname).toMatch(/^\/ob\/[A-Za-z0-9_-]+$/);
		expect(url.search).toBe("");
		expect(encodedQuery).not.toMatch(/[+/=]/);
		expect(JSON.parse(decodeBase64Url(encodedQuery))).toEqual(payload);
	});

	it("preserves optional source URLs", () => {
		const sourceUrl = "https://example.com/article";
		const url = new URL(
			buildBridgeUrl("https://notes.example.com/path", {
				...payload,
				sourceUrl,
			}),
		);

		expect(JSON.parse(decodeBase64Url(getEncodedQuery(url)))).toEqual({
			...payload,
			sourceUrl,
		});
	});

	it("rejects invalid base URLs", () => {
		expect(() => buildBridgeUrl("obsidian://local", payload)).toThrow(
			"Base URL must be http or https",
		);
	});

	it("rejects payloads over field limits", () => {
		expect(() =>
			buildBridgeUrl("https://notes.example.com", {
				...payload,
				summary: "x".repeat(301),
			}),
		).toThrow("summary is too long");
	});

	it("rejects URLs above the practical length limit", () => {
		expect(() =>
			buildBridgeUrl("https://notes.example.com", {
				vault: "v".repeat(100),
				path: "p".repeat(500),
				title: "t".repeat(160),
				summary: "s".repeat(300),
				sourceUrl: `https://example.com/${"x".repeat(980)}`,
			}),
		).toThrow("Bridge URL exceeds the practical length limit");
	});
});

describe("getConfiguredBaseUrl", () => {
	it("defaults to the production origin", () => {
		expect(getConfiguredBaseUrl()).toBe("https://open.axross.dev");
	});

	it("uses the configured public base URL when provided", () => {
		expect(getConfiguredBaseUrl("https://preview.example.com")).toBe(
			"https://preview.example.com",
		);
	});
});

describe("buildShortBridgeUrl", () => {
	it("builds a deterministic /ob/[key] URL", () => {
		expect(
			buildShortBridgeUrl("https://notes.example.com/path", "Abc123_-Abc123_-"),
		).toBe("https://notes.example.com/ob/Abc123_-Abc123_-");
	});

	it("rejects invalid short keys", () => {
		expect(() =>
			buildShortBridgeUrl("https://notes.example.com", "not-valid"),
		).toThrow("Short bridge key is invalid");
	});
});

function getEncodedQuery(url: URL): string {
	const encodedQuery = url.pathname.split("/").pop();

	if (encodedQuery === undefined || encodedQuery.length === 0) {
		throw new Error("Missing encoded query segment");
	}

	return encodedQuery;
}
