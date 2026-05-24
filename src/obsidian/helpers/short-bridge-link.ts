import z from "zod";

import type { Result } from "./types";
import { type BridgePayload, validateBridgePayloadSafe } from "./validation";

const bridgePayloadTtlDays = 30;
const secondsPerDay = 86_400;
const shortBridgeKeyPattern = /^[0-9a-f]{12}5[0-9a-f]{3}[89ab][0-9a-f]{15}$/;
const storageKeyPrefix = "ob:";
const uuidByteLength = 16;
const uuidVersionFive = 0x50;
const uuidVariantRfc4122 = 0x80;
const uuidVersionRemainder = 0x10;
const uuidVariantRemainder = 0x40;
const byteHexRadix = 16;
const byteHexWidth = 2;
const obsidianBridgeNamespaceHex = "2411260ec47e4e388afcf2c764310c57";

// This namespace is part of the public short-key contract; changing it changes every generated key.
const obsidianBridgeNamespaceBytes = hexToBytes(obsidianBridgeNamespaceHex);

export const bridgePayloadTtlSeconds = bridgePayloadTtlDays * secondsPerDay;

const ShortenBridgeRequest = z.strictObject({
	payload: z.unknown(),
});

export interface BridgePayloadStore {
	get(key: string): Promise<string | null>;
	put(
		key: string,
		value: string,
		options: { expirationTtl: number },
	): Promise<void>;
}

type CreateShortBridgeKey = (
	payload: Pick<BridgePayload, "path" | "vault">,
) => Promise<string> | string;

export class ShortBridgeLinkError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ShortBridgeLinkError";
	}
}

export function parseShortenBridgeRequest(
	body: unknown,
): Result<BridgePayload> {
	const request = ShortenBridgeRequest.safeParse(body);

	if (!request.success) {
		return {
			ok: false,
			reason: request.error.issues[0]?.message ?? "request is invalid",
		};
	}

	if (request.data.payload === undefined) {
		return {
			ok: false,
			reason: "payload is required",
		};
	}

	return validateBridgePayloadSafe(request.data.payload);
}

export async function storeShortBridgePayload(
	store: BridgePayloadStore,
	payload: BridgePayload,
	createKey: CreateShortBridgeKey = createShortBridgeKey,
): Promise<string> {
	const parsed = validateBridgePayloadSafe(payload);

	if (!parsed.ok) {
		throw new ShortBridgeLinkError("Bridge payload is invalid");
	}

	const key = await createKey(parsed.value);

	if (!isShortBridgeKey(key)) {
		throw new ShortBridgeLinkError("Generated bridge key is invalid");
	}

	await store.put(toShortBridgeStorageKey(key), JSON.stringify(parsed.value), {
		expirationTtl: bridgePayloadTtlSeconds,
	});

	return key;
}

export async function readShortBridgePayload(
	store: BridgePayloadStore,
	key: string,
): Promise<Result<BridgePayload>> {
	if (!isShortBridgeKey(key)) {
		return {
			ok: false,
			reason: "short key is invalid",
		};
	}

	const storedPayload = await store.get(toShortBridgeStorageKey(key));

	if (storedPayload === null) {
		return {
			ok: false,
			reason: "short key was not found",
		};
	}

	return parseStoredBridgePayload(storedPayload);
}

export async function createShortBridgeKey(
	payload: Pick<BridgePayload, "path" | "vault">,
): Promise<string> {
	const name = new TextEncoder().encode(
		JSON.stringify([payload.vault, payload.path]),
	);
	const source = new Uint8Array(
		obsidianBridgeNamespaceBytes.length + name.length,
	);

	source.set(obsidianBridgeNamespaceBytes);
	source.set(name, obsidianBridgeNamespaceBytes.length);

	const hash = await crypto.subtle.digest("SHA-1", source);
	const bytes = new Uint8Array(hash).slice(0, uuidByteLength);

	bytes[6] = (bytes[6] % uuidVersionRemainder) + uuidVersionFive;
	bytes[8] = (bytes[8] % uuidVariantRemainder) + uuidVariantRfc4122;

	return Array.from(bytes, (byte) =>
		byte.toString(byteHexRadix).padStart(byteHexWidth, "0"),
	).join("");
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

function parseStoredBridgePayload(
	storedPayload: string,
): Result<BridgePayload> {
	try {
		const parsed: unknown = JSON.parse(storedPayload);
		const payload = validateBridgePayloadSafe(parsed);

		if (!payload.ok) {
			return {
				ok: false,
				reason: "stored bridge payload is invalid",
			};
		}

		return payload;
	} catch {
		return {
			ok: false,
			reason: "stored bridge payload is invalid",
		};
	}
}

function hexToBytes(value: string): Uint8Array {
	const bytes: number[] = [];

	for (let index = 0; index < value.length; index += byteHexWidth) {
		bytes.push(
			Number.parseInt(value.slice(index, index + byteHexWidth), byteHexRadix),
		);
	}

	return Uint8Array.from(bytes);
}
