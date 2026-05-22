import { encodeBase64Url } from "./base64url";
import type { BridgePayload } from "./types";
import {
  maxBridgeUrlLength,
  validateBridgePayload,
} from "./validation";

export class BridgeUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BridgeUrlError";
  }
}

export function buildBridgeUrl(baseUrl: string, payload: BridgePayload): string {
  const validPayload = validateBridgePayload(payload);
  const query = encodeBase64Url(JSON.stringify(validPayload));
  const url = new URL(`/obsidian/${query}`, normalizeBaseUrl(baseUrl));

  const href = url.toString();

  if (href.length > maxBridgeUrlLength) {
    throw new BridgeUrlError("Bridge URL exceeds the practical length limit");
  }

  return href;
}

export function getConfiguredBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL ?? "https://open.axross.dev";
}

function normalizeBaseUrl(baseUrl: string): string {
  let url: URL;

  try {
    url = new URL(baseUrl);
  } catch {
    throw new BridgeUrlError("Base URL is invalid");
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new BridgeUrlError("Base URL must be http or https");
  }

  return url.toString();
}
