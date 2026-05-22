import { encodeBase64Url } from "./base64url";
import { bridgeRoutePath } from "./bridge-route";
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

const defaultBaseUrl = "https://open.axross.dev";

export function buildBridgeUrl(baseUrl: string, payload: BridgePayload): string {
  const validPayload = validateBridgePayload(payload);
  const query = encodeBase64Url(JSON.stringify(validPayload));
  const url = new URL(`${bridgeRoutePath}/${query}`, normalizeBaseUrl(baseUrl));

  const href = url.toString();

  if (href.length > maxBridgeUrlLength) {
    throw new BridgeUrlError("Bridge URL exceeds the practical length limit");
  }

  return href;
}

export function getConfiguredBaseUrl(configuredBaseUrl?: string): string {
  return configuredBaseUrl ?? defaultBaseUrl;
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
