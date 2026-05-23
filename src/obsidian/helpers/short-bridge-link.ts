import z from "zod";

import { encodeBase64Url } from "../../common/helpers/base64url";
import { decodeBridgeQuerySafe } from "./decode-link";
import type { Result } from "./types";
import { maxBridgeUrlLength } from "./validation";

const bridgeQueryTtlDays = 30;
const secondsPerDay = 86_400;
const shortBridgeKeyByteLength = 12;
const shortBridgeKeyAttempts = 5;
const shortBridgeKeyPattern = /^[A-Za-z0-9_-]{16}$/;
const storageKeyPrefix = "ob:";

export const bridgeQueryTtlSeconds = bridgeQueryTtlDays * secondsPerDay;

const ShortenBridgeRequest = z.strictObject({
	query: z
		.string()
		.min(1, "query is required")
		.max(maxBridgeUrlLength, "query is too long"),
});

export interface BridgeQueryStore {
	get(key: string): Promise<string | null>;
	put(
		key: string,
		value: string,
		options: { expirationTtl: number },
	): Promise<void>;
}

export class ShortBridgeLinkError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ShortBridgeLinkError";
	}
}

export function parseShortenBridgeRequest(body: unknown): Result<string> {
	const request = ShortenBridgeRequest.safeParse(body);

	if (!request.success) {
		return {
			ok: false,
			reason: request.error.issues[0]?.message ?? "request is invalid",
		};
	}

	const decoded = decodeBridgeQuerySafe(request.data.query);

	if (!decoded.ok) {
		return decoded;
	}

	return {
		ok: true,
		value: encodeBase64Url(JSON.stringify(decoded.value)),
	};
}

export async function storeShortBridgeQuery(
	store: BridgeQueryStore,
	query: string,
	createKey = generateShortBridgeKey,
): Promise<string> {
	const parsed = parseShortenBridgeRequest({ query });

	if (!parsed.ok) {
		throw new ShortBridgeLinkError("Bridge query is invalid");
	}

	const candidates = Array.from({ length: shortBridgeKeyAttempts }, () =>
		createKey(),
	);

	for (const key of candidates) {
		if (!isShortBridgeKey(key)) {
			throw new ShortBridgeLinkError("Generated bridge key is invalid");
		}
	}

	const existingEntries = await Promise.all(
		candidates.map(async (key) => ({
			existing: await store.get(toShortBridgeStorageKey(key)),
			key,
		})),
	);
	const availableEntry = existingEntries.find(
		({ existing }) => existing === null,
	);

	if (availableEntry === undefined) {
		throw new ShortBridgeLinkError("Could not allocate bridge key");
	}

	await store.put(toShortBridgeStorageKey(availableEntry.key), parsed.value, {
		expirationTtl: bridgeQueryTtlSeconds,
	});

	return availableEntry.key;
}

export async function readShortBridgeQuery(
	store: BridgeQueryStore,
	key: string,
): Promise<Result<string>> {
	if (!isShortBridgeKey(key)) {
		return {
			ok: false,
			reason: "short key is invalid",
		};
	}

	const query = await store.get(toShortBridgeStorageKey(key));

	if (query === null) {
		return {
			ok: false,
			reason: "short key was not found",
		};
	}

	return {
		ok: true,
		value: query,
	};
}

export function generateShortBridgeKey(): string {
	const bytes = new Uint8Array(shortBridgeKeyByteLength);
	crypto.getRandomValues(bytes);

	return Buffer.from(bytes).toString("base64url");
}

export function isShortBridgeKey(value: string): boolean {
	return shortBridgeKeyPattern.test(value);
}

export function toShortBridgeStorageKey(key: string): string {
	if (!isShortBridgeKey(key)) {
		throw new ShortBridgeLinkError("Short bridge key is invalid");
	}

	return `${storageKeyPrefix}${key}`;
}
