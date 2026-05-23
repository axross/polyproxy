import type { BridgePayload } from "./validation";

export function buildObsidianUri(
	payload: Pick<BridgePayload, "vault" | "path">,
): string {
	const vault = encodeURIComponent(payload.vault);
	const file = encodeURIComponent(payload.path);

	return `obsidian://open?vault=${vault}&file=${file}`;
}
