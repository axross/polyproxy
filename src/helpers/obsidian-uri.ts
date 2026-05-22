import type { BridgePayload } from "./types";

export function buildObsidianUri(
  payload: Pick<BridgePayload, "vault" | "path">,
): string {
  const vault = encodeURIComponent(payload.vault);
  const file = encodeURIComponent(payload.path);

  return `obsidian://open?vault=${vault}&file=${file}`;
}
