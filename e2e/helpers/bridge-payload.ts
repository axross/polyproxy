export interface TestBridgePayload {
  vault: string;
  path: string;
  title: string;
  summary: string;
  sourceUrl?: string;
}

export const exampleBridgePayload = {
  vault: "Personal",
  path: "Articles/Google wants to make the web agent-ready",
  title: "Google wants to make the web agent-ready",
  summary:
    "An article about Google's effort to make the web easier for agents to navigate.",
  sourceUrl: "https://example.com/articles/agent-ready-web",
} satisfies TestBridgePayload;

export function buildBridgePath(payload: TestBridgePayload): string {
  const query = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url",
  );

  return `/ob/${query}`;
}

export function buildObsidianUri(
  payload: Pick<TestBridgePayload, "vault" | "path">,
): string {
  const vault = encodeURIComponent(payload.vault);
  const file = encodeURIComponent(payload.path);

  return `obsidian://open?vault=${vault}&file=${file}`;
}
