import { z } from "zod";

import type { BridgePayload, Result } from "./types";

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

export const bridgePayloadSchema = z
  .object({
    vault: trimmedField("vault", fieldLimits.vault),
    path: trimmedField("path", fieldLimits.path)
      .refine((path) => !path.startsWith("/") && !path.startsWith("\\"), {
        message: "path must be vault-relative",
      })
      .refine((path) => !path.split("/").some((segment) => segment === ".."), {
        message: "path contains a parent segment",
      }),
    title: metadataField("title", fieldLimits.title),
    summary: metadataField("summary", fieldLimits.summary),
    sourceUrl: sourceUrlField(),
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

export function validateBridgePayloadSafe(payload: unknown): Result<BridgePayload> {
  const result = bridgePayloadSchema.safeParse(payload);

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

function trimmedField(field: "vault" | "path", maxLength: number) {
  return z
    .string()
    .transform((value) => value.trim())
    .pipe(
      z
        .string()
        .min(1, `${field} is required`)
        .max(maxLength, `${field} is too long`)
        .refine((value) => !value.includes("\0"), {
          message: `${field} contains a null byte`,
        }),
    );
}

function metadataField(field: "title" | "summary", maxLength: number) {
  return z
    .string()
    .transform(normalizeMetadataText)
    .pipe(
      z
        .string()
        .min(1, `${field} is required`)
        .max(maxLength, `${field} is too long`)
        .refine((value) => !value.includes("\0"), {
          message: `${field} contains a null byte`,
        }),
    );
}

function sourceUrlField() {
  return z.preprocess(
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
      .refine((value) => !value.includes("\0"), {
        message: "sourceUrl contains a null byte",
      })
      .refine(isHttpUrl, {
        message: "sourceUrl must be http or https",
      })
      .optional(),
  );
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
