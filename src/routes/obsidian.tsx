import { Hono } from "hono";
import { isBotUserAgent } from "../helpers/bot-detection";
import { buildBridgeUrl, getConfiguredBaseUrl } from "../helpers/bridge-url";
import { decodeBridgeQuerySafe } from "../helpers/decode-link";
import { buildObsidianUri } from "../helpers/obsidian-uri";
import type { HonoEnv } from "../hono-env";
import {
	Document,
	invalidBridgeMetadata,
	invalidDescription,
	invalidTitle,
	overviewMetadata,
} from "../views/metadata";
import {
	BridgePage,
	CrawlerBridgeHtml,
	InvalidBridgePage,
	OverviewPage,
} from "../views/obsidian";

export const routes = new Hono<HonoEnv>();

routes.get("/", (c) => c.html(<Document metadata={overviewMetadata}><OverviewPage /></Document>));

routes.get("/:query", (c) => {
	const query = c.req.param("query");
	const userAgent = c.req.header("user-agent") ?? "";
	const isBot = isBotUserAgent(userAgent);
	const result = decodeBridgeQuerySafe(query);

	if (!result.ok) {
		const body = isBot ? (
			<CrawlerBridgeHtml
				title={invalidTitle}
				description={invalidDescription}
			/>
		) : (
			<InvalidBridgePage />
		);

    return c.html(<Document metadata={invalidBridgeMetadata}>{body}</Document>);
	}

	const payload = result.value;
	const metadata = {
		title: payload.title,
		description: payload.summary,
		type: "article" as const,
		url: buildBridgeUrl(getConfiguredBaseUrl(c.env.PUBLIC_BASE_URL), payload),
	};
  let body = <BridgePage payload={payload} obsidianUri={buildObsidianUri(payload)} />;

	if (isBot) {
		body = <CrawlerBridgeHtml title={payload.title} description={payload.summary} />;
	}

	return c.html(<Document metadata={metadata}>{body}</Document>);
});
