import { describe, expect, it } from "vitest";

import {
	buildShortBridgeImageUrl,
	buildShortBridgeUrl,
	getConfiguredBaseUrl,
} from "./bridge-url";

const payloadKey = "d80025792a1b57e5a235462ea488de44";

describe("getConfiguredBaseUrl", () => {
	it("defaults to the production origin", () => {
		expect(getConfiguredBaseUrl()).toBe("https://open.axross.app");
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
			buildShortBridgeUrl("https://notes.example.com/path", payloadKey),
		).toBe(`https://notes.example.com/ob/${payloadKey}`);
	});

	it("rejects invalid short keys", () => {
		expect(() =>
			buildShortBridgeUrl("https://notes.example.com", "not-valid"),
		).toThrow("Short bridge key is invalid");
	});

	it("rejects invalid base URLs", () => {
		expect(() => buildShortBridgeUrl("obsidian://local", payloadKey)).toThrow(
			"Base URL must be http or https",
		);
	});

	it("rejects URLs above the practical length limit", () => {
		expect(() =>
			buildShortBridgeUrl(
				`https://${"x".repeat(1900)}@notes.example.com`,
				payloadKey,
			),
		).toThrow("Bridge URL exceeds the practical length limit");
	});
});

describe("buildShortBridgeImageUrl", () => {
	it("builds a deterministic /ob/[key]/image URL", () => {
		expect(
			buildShortBridgeImageUrl("https://notes.example.com/path", payloadKey),
		).toBe(`https://notes.example.com/ob/${payloadKey}/image`);
	});

	it("rejects invalid short keys", () => {
		expect(() =>
			buildShortBridgeImageUrl("https://notes.example.com", "not-valid"),
		).toThrow("Short bridge key is invalid");
	});
});
