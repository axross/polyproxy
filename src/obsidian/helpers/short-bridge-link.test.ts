import { describe, expect, it } from "vitest";

import {
	bridgePayloadTtlSeconds,
	type BridgePayloadStore,
	createShortBridgeKey,
	isShortBridgeKey,
	parseShortenBridgeRequest,
	readShortBridgePayload,
	storeShortBridgePayload,
	toShortBridgeStorageKey,
} from "./short-bridge-link";
import type { BridgePayload } from "./validation";

const payload: BridgePayload = {
	vault: "Personal",
	path: "Articles/Google wants to make the web agent-ready",
	title: "Google wants to make the web agent-ready",
	summary:
		"An article about Google's effort to make the web easier for agents to navigate.",
};
const payloadKey = "d80025792a1b57e5a235462ea488de44";

describe("parseShortenBridgeRequest", () => {
	it("accepts a valid bridge payload and returns a canonical payload", () => {
		const result = parseShortenBridgeRequest({
			payload: {
				...payload,
				title: "  Google\nwants   the web  ",
				summary: "  Summary\twith\nspace  ",
			},
		});

		expect(result).toEqual({
			ok: true,
			value: {
				...payload,
				title: "Google wants the web",
				summary: "Summary with space",
			},
		});
	});

	it("rejects malformed request bodies", () => {
		expect(parseShortenBridgeRequest({}).ok).toBe(false);
		expect(parseShortenBridgeRequest({ payload: undefined }).ok).toBe(false);
		expect(parseShortenBridgeRequest({ key: "" }).ok).toBe(false);
	});

	it("rejects invalid bridge payloads", () => {
		const result = parseShortenBridgeRequest({
			payload: {
				...payload,
				sourceUrl: "javascript:alert(1)",
			},
		});

		expect(result.ok).toBe(false);
	});
});

describe("storeShortBridgePayload", () => {
	it("stores the payload as JSON with a 30-day TTL and returns the short key", async () => {
		const store = new MemoryBridgePayloadStore();
		const sourcePayload = {
			...payload,
			title: "  Google\nwants   the web  ",
			summary: "  Summary\twith\nspace  ",
		};
		const storedPayload = {
			...payload,
			title: "Google wants the web",
			summary: "Summary with space",
		};

		await expect(
			storeShortBridgePayload(store, sourcePayload, () => payloadKey),
		).resolves.toBe(payloadKey);

		expect(store.puts).toEqual([
			{
				key: toShortBridgeStorageKey(payloadKey),
				value: JSON.stringify(storedPayload),
				options: { expirationTtl: bridgePayloadTtlSeconds },
			},
		]);
	});

	it("uses a deterministic UUIDv5 hex key derived from vault and path", async () => {
		const store = new MemoryBridgePayloadStore();
		const key = await storeShortBridgePayload(store, payload);

		expect(key).toBe(payloadKey);
		expect(store.values.get(toShortBridgeStorageKey(payloadKey))).toBe(
			JSON.stringify(payload),
		);
	});
});

describe("readShortBridgePayload", () => {
	it("reads stored bridge payloads by short key", async () => {
		const store = new MemoryBridgePayloadStore();

		store.values.set(
			toShortBridgeStorageKey(payloadKey),
			JSON.stringify(payload),
		);

		await expect(readShortBridgePayload(store, payloadKey)).resolves.toEqual({
			ok: true,
			value: payload,
		});
	});

	it("rejects invalid and missing short keys", async () => {
		const store = new MemoryBridgePayloadStore();

		await expect(readShortBridgePayload(store, "not-valid")).resolves.toEqual({
			ok: false,
			reason: "short key is invalid",
		});
		await expect(readShortBridgePayload(store, payloadKey)).resolves.toEqual({
			ok: false,
			reason: "short key was not found",
		});
	});

	it("rejects malformed stored JSON", async () => {
		const store = new MemoryBridgePayloadStore();

		store.values.set(toShortBridgeStorageKey(payloadKey), "not json");

		await expect(readShortBridgePayload(store, payloadKey)).resolves.toEqual({
			ok: false,
			reason: "stored bridge payload is invalid",
		});
	});

	it("rejects invalid stored payloads", async () => {
		const store = new MemoryBridgePayloadStore();

		store.values.set(
			toShortBridgeStorageKey(payloadKey),
			JSON.stringify({
				...payload,
				sourceUrl: "javascript:alert(1)",
			}),
		);

		await expect(readShortBridgePayload(store, payloadKey)).resolves.toEqual({
			ok: false,
			reason: "stored bridge payload is invalid",
		});
	});
});

describe("createShortBridgeKey", () => {
	it("returns a UUIDv5 hex key from the payload vault and path", async () => {
		const differentMetadataPayload: BridgePayload = {
			...payload,
			title: "Different title",
			summary: "Different summary",
		};

		await expect(createShortBridgeKey(payload)).resolves.toBe(payloadKey);
		await expect(createShortBridgeKey(differentMetadataPayload)).resolves.toBe(
			payloadKey,
		);
		await expect(
			createShortBridgeKey({
				...payload,
				path: "Articles/Another note",
			}),
		).resolves.not.toBe(payloadKey);
	});
});

describe("isShortBridgeKey", () => {
	it("accepts canonical UUIDv5 hex keys only", () => {
		expect(isShortBridgeKey(payloadKey)).toBe(true);
		expect(isShortBridgeKey(payloadKey.toUpperCase())).toBe(false);
		expect(isShortBridgeKey("0123456789abcdef0123456789abcdef")).toBe(false);
		expect(isShortBridgeKey("0123456789ab4def8123456789abcdef")).toBe(false);
		expect(isShortBridgeKey("0123456789ab5def7123456789abcdef")).toBe(false);
	});
});

class MemoryBridgePayloadStore implements BridgePayloadStore {
	readonly puts: Array<{
		key: string;
		options: { expirationTtl: number };
		value: string;
	}> = [];

	readonly values = new Map<string, string>();

	async get(key: string): Promise<string | null> {
		return this.values.get(key) ?? null;
	}

	async put(
		key: string,
		value: string,
		options: { expirationTtl: number },
	): Promise<void> {
		this.puts.push({ key, options, value });
		this.values.set(key, value);
	}
}
