import { describe, expect, it } from "vitest";

import { encodeBase64Url } from "../../common/helpers/base64url";
import {
	bridgeQueryTtlSeconds,
	type BridgeQueryStore,
	isShortBridgeKey,
	parseShortenBridgeRequest,
	readShortBridgeQuery,
	storeShortBridgeQuery,
	toShortBridgeStorageKey,
} from "./short-bridge-link";
import type { BridgePayload } from "./types";

const payload: BridgePayload = {
	vault: "Personal",
	path: "Articles/Google wants to make the web agent-ready",
	title: "Google wants to make the web agent-ready",
	summary:
		"An article about Google's effort to make the web easier for agents to navigate.",
};

describe("parseShortenBridgeRequest", () => {
	it("accepts a valid bridge query and returns a canonical query", () => {
		const result = parseShortenBridgeRequest({
			query: toQuery({
				...payload,
				title: "  Google\nwants   the web  ",
				summary: "  Summary\twith\nspace  ",
			}),
		});

		expect(result).toEqual({
			ok: true,
			value: toQuery({
				...payload,
				title: "Google wants the web",
				summary: "Summary with space",
			}),
		});
	});

	it("rejects malformed request bodies", () => {
		expect(parseShortenBridgeRequest({}).ok).toBe(false);
		expect(parseShortenBridgeRequest({ query: "" }).ok).toBe(false);
		expect(parseShortenBridgeRequest({ query: "not valid" }).ok).toBe(false);
	});

	it("rejects invalid bridge payloads", () => {
		const result = parseShortenBridgeRequest({
			query: toQuery({
				...payload,
				sourceUrl: "javascript:alert(1)",
			}),
		});

		expect(result.ok).toBe(false);
	});
});

describe("storeShortBridgeQuery", () => {
	it("stores the query with a 30-day TTL and returns the short key", async () => {
		const store = new MemoryBridgeQueryStore();
		const key = "Abc123_-Abc123_-";

		await expect(
			storeShortBridgeQuery(store, toQuery(payload), () => key),
		).resolves.toBe(key);

		expect(store.puts).toEqual([
			{
				key: toShortBridgeStorageKey(key),
				value: toQuery(payload),
				options: { expirationTtl: bridgeQueryTtlSeconds },
			},
		]);
	});

	it("retries key generation when a generated key already exists", async () => {
		const store = new MemoryBridgeQueryStore();
		const firstKey = "FirstKeyFirstK__";
		const secondKey = "SecondKeySecond_";

		store.values.set(toShortBridgeStorageKey(firstKey), "existing-query");

		const keys = [
			firstKey,
			secondKey,
			"ThirdKeyThirdK__",
			"FourthKeyFourth_",
			"FifthKeyFifthK__",
		];
		const key = await storeShortBridgeQuery(store, toQuery(payload), () => {
			const value = keys.shift();

			if (value === undefined) {
				throw new Error("missing test key");
			}

			return value;
		});

		expect(key).toBe(secondKey);
		expect(store.values.get(toShortBridgeStorageKey(secondKey))).toBe(
			toQuery(payload),
		);
	});
});

describe("readShortBridgeQuery", () => {
	it("reads stored bridge queries by short key", async () => {
		const store = new MemoryBridgeQueryStore();
		const key = "Abc123_-Abc123_-";

		store.values.set(toShortBridgeStorageKey(key), toQuery(payload));

		await expect(readShortBridgeQuery(store, key)).resolves.toEqual({
			ok: true,
			value: toQuery(payload),
		});
	});

	it("rejects invalid and missing short keys", async () => {
		const store = new MemoryBridgeQueryStore();

		await expect(readShortBridgeQuery(store, "not-valid")).resolves.toEqual({
			ok: false,
			reason: "short key is invalid",
		});
		await expect(
			readShortBridgeQuery(store, "Abc123_-Abc123_-"),
		).resolves.toEqual({
			ok: false,
			reason: "short key was not found",
		});
	});
});

describe("isShortBridgeKey", () => {
	it("accepts 16-character Base64url keys only", () => {
		expect(isShortBridgeKey("Abc123_-Abc123_-")).toBe(true);
		expect(isShortBridgeKey("abc123")).toBe(false);
		expect(isShortBridgeKey("Abc123+/Abc123+/")).toBe(false);
	});
});

class MemoryBridgeQueryStore implements BridgeQueryStore {
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

function toQuery(source: BridgePayload) {
	return encodeBase64Url(JSON.stringify(source));
}
