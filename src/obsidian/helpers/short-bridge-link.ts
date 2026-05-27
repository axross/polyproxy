import z from "zod";

import type { Result } from "./types";
import { type BridgePayload, validateBridgePayloadSafe } from "./validation";

const bridgePayloadTtlDays = 30;
const secondsPerDay = 86_400;
const shortBridgeKeyPattern = /^[0-9a-f]{12}5[0-9a-f]{3}[89ab][0-9a-f]{15}$/;
const articleStorageKeyPrefix = "articles/";
const imageStorageKeySuffix = "/image";
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
export const bridgeImageContentType = "image/jpeg";
export const bridgeImageHeight = 630;
export const bridgeImageWidth = 1200;

const ShortenBridgeRequest = z.strictObject({
	payload: z.unknown(),
});

const StoredBridgeImageMetadataSchema = z.strictObject({
	contentType: z.literal(bridgeImageContentType),
	height: z.literal(bridgeImageHeight),
	width: z.literal(bridgeImageWidth),
});

export interface BridgePayloadStore {
	get(key: string): Promise<string | null>;
	put(
		key: string,
		value: string,
		options: { expirationTtl: number },
	): Promise<void>;
}

export interface BridgeImageStore {
	get(key: string, type: "arrayBuffer"): Promise<ArrayBuffer | null>;
	put(
		key: string,
		value: ArrayBuffer | ReadableStream<Uint8Array>,
		options: { expirationTtl: number },
	): Promise<void>;
}

export interface StoredBridgeImageMetadata {
	contentType: typeof bridgeImageContentType;
	height: typeof bridgeImageHeight;
	width: typeof bridgeImageWidth;
}

export type StoredBridgePayload = BridgePayload & {
	image?: StoredBridgeImageMetadata;
};

export interface StoredBridgeImage {
	body: ArrayBuffer;
	metadata: StoredBridgeImageMetadata;
}

interface StoreShortBridgePayloadOptions {
	createKey?: CreateShortBridgeKey;
	image?: StoredBridgeImageMetadata;
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
	optionsOrCreateKey: StoreShortBridgePayloadOptions | CreateShortBridgeKey = {},
): Promise<string> {
	const options =
		typeof optionsOrCreateKey === "function"
			? { createKey: optionsOrCreateKey }
			: optionsOrCreateKey;
	const createKey = options.createKey ?? createShortBridgeKey;
	const parsed = validateBridgePayloadSafe(payload);

	if (!parsed.ok) {
		throw new ShortBridgeLinkError("Bridge payload is invalid");
	}

	const key = await createKey(parsed.value);

	if (!isShortBridgeKey(key)) {
		throw new ShortBridgeLinkError("Generated bridge key is invalid");
	}

	const storedPayload: StoredBridgePayload =
		options.image === undefined
			? parsed.value
			: {
					...parsed.value,
					image: options.image,
				};

	await store.put(toShortBridgeStorageKey(key), JSON.stringify(storedPayload), {
		expirationTtl: bridgePayloadTtlSeconds,
	});

	return key;
}

export async function readShortBridgePayload(
	store: BridgePayloadStore,
	key: string,
): Promise<Result<StoredBridgePayload>> {
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

export async function storeShortBridgeImage(
	store: BridgeImageStore,
	key: string,
	body: ReadableStream<Uint8Array>,
): Promise<StoredBridgeImageMetadata> {
	if (!isShortBridgeKey(key)) {
		throw new ShortBridgeLinkError("Short bridge key is invalid");
	}

	const metadata: StoredBridgeImageMetadata = {
		contentType: bridgeImageContentType,
		height: bridgeImageHeight,
		width: bridgeImageWidth,
	};

	await store.put(toShortBridgeImageStorageKey(key), body, {
		expirationTtl: bridgePayloadTtlSeconds,
	});

	return metadata;
}

export async function readShortBridgeImage(
	store: BridgePayloadStore & BridgeImageStore,
	key: string,
): Promise<Result<StoredBridgeImage>> {
	const payload = await readShortBridgePayload(store, key);

	if (!payload.ok) {
		return payload;
	}

	if (payload.value.image === undefined) {
		return {
			ok: false,
			reason: "image was not found",
		};
	}

	const body = await store.get(toShortBridgeImageStorageKey(key), "arrayBuffer");

	if (body === null) {
		return {
			ok: false,
			reason: "image was not found",
		};
	}

	return {
		ok: true,
		value: {
			body,
			metadata: payload.value.image,
		},
	};
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

	return `${articleStorageKeyPrefix}${key}`;
}

export function toShortBridgeImageStorageKey(key: string): string {
	if (!isShortBridgeKey(key)) {
		throw new ShortBridgeLinkError("Short bridge key is invalid");
	}

	return `${articleStorageKeyPrefix}${key}${imageStorageKeySuffix}`;
}

function parseStoredBridgePayload(
	storedPayload: string,
): Result<StoredBridgePayload> {
	try {
		const parsed: unknown = JSON.parse(storedPayload);
		const payload = validateBridgePayloadSafe(parsed);

		if (!payload.ok) {
			return {
				ok: false,
				reason: "stored bridge payload is invalid",
			};
		}

		const image = parseStoredBridgeImageMetadata(parsed);

		if (!image.ok) {
			return {
				ok: false,
				reason: "stored bridge payload is invalid",
			};
		}

		return image.value === undefined
			? payload
			: {
					ok: true,
					value: {
						...payload.value,
						image: image.value,
					},
				};
	} catch {
		return {
			ok: false,
			reason: "stored bridge payload is invalid",
		};
	}
}

function parseStoredBridgeImageMetadata(
	value: unknown,
): Result<StoredBridgeImageMetadata | undefined> {
	if (typeof value !== "object" || value === null || !("image" in value)) {
		return {
			ok: true,
			value: undefined,
		};
	}

	const result = StoredBridgeImageMetadataSchema.safeParse(
		(value as { image?: unknown }).image,
	);

	if (!result.success) {
		return {
			ok: false,
			reason: "stored bridge image metadata is invalid",
		};
	}

	return {
		ok: true,
		value: result.data,
	};
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
