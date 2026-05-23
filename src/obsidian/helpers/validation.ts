import z from "zod";

import type { Result } from "./types";

export const fieldLimits = {
	vault: 100,
	path: 500,
	title: 160,
	summary: 300,
	sourceUrl: 1000,
} as const;

export const maxBridgeUrlLength = 1900;

export class BridgeValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "BridgeValidationError";
	}
}

export interface BridgePayload {
	vault: string;
	path: string;
	title: string;
	summary: string;
	sourceUrl?: string;
}

type RequiredTextField = "path" | "summary" | "title" | "vault";

const SourceUrl = z.preprocess(
	(value) => {
		if (typeof value !== "string") {
			return value;
		}

		const trimmed = value.trim();
		return trimmed.length === 0 ? undefined : trimmed;
	},
	z
		.string()
		.max(fieldLimits.sourceUrl, "sourceUrl is too long")
		.refine(hasNoNullByte, {
			error: "sourceUrl contains a null byte",
		})
		.pipe(
			z.url({
				error: "sourceUrl must be http or https",
				protocol: /^https?$/,
			}),
		)
		.optional(),
);

export const BridgePayload = z
	.object({
		vault: requiredTrimmedText("vault", fieldLimits.vault),
		path: requiredTrimmedText("path", fieldLimits.path)
			.refine((path) => !path.startsWith("/") && !path.startsWith("\\"), {
				error: "path must be vault-relative",
			})
			.refine((path) => !path.split("/").some((segment) => segment === ".."), {
				error: "path contains a parent segment",
			}),
		title: metadataText("title", fieldLimits.title),
		summary: metadataText("summary", fieldLimits.summary),
		sourceUrl: SourceUrl,
	})
	.transform(({ sourceUrl, ...payload }) =>
		sourceUrl === undefined
			? payload
			: {
					...payload,
					sourceUrl,
		},
	);

export function validateBridgePayload(payload: unknown): BridgePayload {
	const result = validateBridgePayloadSafe(payload);

	if (!result.ok) {
		throw new BridgeValidationError(result.reason);
	}

	return result.value;
}

export function validateBridgePayloadSafe(
	payload: unknown,
): Result<BridgePayload> {
	const result = BridgePayload.safeParse(payload);

	if (!result.success) {
		return {
			ok: false,
			reason: result.error.issues[0]?.message ?? "payload is invalid",
		};
	}

	return {
		ok: true,
		value: result.data,
	};
}

export function normalizeMetadataText(value: string): string {
	return value.trim().replace(/\s+/g, " ");
}

function requiredTrimmedText(field: RequiredTextField, maxLength: number) {
	return z
		.string()
		.trim()
		.min(1, `${field} is required`)
		.max(maxLength, `${field} is too long`)
		.refine(hasNoNullByte, {
			error: `${field} contains a null byte`,
		});
}

function metadataText(field: "summary" | "title", maxLength: number) {
	return z
		.string()
		.transform(normalizeMetadataText)
		.pipe(
			z
				.string()
				.min(1, `${field} is required`)
				.max(maxLength, `${field} is too long`)
				.refine(hasNoNullByte, {
					error: `${field} contains a null byte`,
				}),
		);
}

function hasNoNullByte(value: string): boolean {
	return !value.includes("\0");
}
