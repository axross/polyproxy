import { decodeBase64Url } from "./base64url";
import type { BridgePayload, Result } from "./types";
import { validateBridgePayload } from "./validation";

export class BridgeDecodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BridgeDecodeError";
  }
}

export function decodeBridgeQuery(query: string): BridgePayload {
  const result = decodeBridgeQuerySafe(query);

  if (!result.ok) {
    throw new BridgeDecodeError(result.reason);
  }

  return result.value;
}

export function decodeBridgeQuerySafe(query: string): Result<BridgePayload> {
  try {
    if (query.length === 0) {
      throw new BridgeDecodeError("query is required");
    }

    const decoded = decodeBase64Url(query);
    const parsed: unknown = JSON.parse(decoded);
    const payload = validateBridgePayload(parsed);

    return { ok: true, value: payload };
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : "Invalid bridge link",
    };
  }
}
