import { Hono } from "hono";
import { isBotUserAgent } from "../../common/helpers/bot-detection";
import type { HonoEnv } from "../../common/hono-env";
import {
	buildShortBridgeUrl,
	getConfiguredBaseUrl,
} from "../helpers/bridge-url";
import { buildObsidianUri } from "../helpers/obsidian-uri";
import {
	bridgePayloadTtlSeconds,
	parseShortenBridgeRequest,
	readShortBridgePayload,
	storeShortBridgePayload,
} from "../helpers/short-bridge-link";
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

const badRequestStatus = 400;
const createdStatus = 201;

routes.get("/", (c) =>
	c.html(
		<Document metadata={overviewMetadata}>
			<OverviewPage />
		</Document>,
	),
);

routes.post("/", async (c) => {
	let body: unknown;

	try {
		body = await c.req.json();
	} catch {
		return c.json({ error: "Request body must be JSON" }, badRequestStatus);
	}

	const payload = parseShortenBridgeRequest(body);

	if (!payload.ok) {
		return c.json({ error: payload.reason }, badRequestStatus);
	}

	const key = await storeShortBridgePayload(
		c.env.OBSIDIAN_QUERIES,
		payload.value,
	);
	const url = buildShortBridgeUrl(
		getConfiguredBaseUrl(c.env.PUBLIC_BASE_URL),
		key,
	);

	return c.json(
		{
			expiresIn: bridgePayloadTtlSeconds,
			key,
			url,
		},
		createdStatus,
	);
});

routes.get("/:key", async (c) => {
	const routeKey = c.req.param("key");
	const userAgent = c.req.header("user-agent") ?? "";
	const isBot = isBotUserAgent(userAgent);
	const result = await readShortBridgePayload(c.env.OBSIDIAN_QUERIES, routeKey);

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
		url: buildShortBridgeUrl(
			getConfiguredBaseUrl(c.env.PUBLIC_BASE_URL),
			routeKey,
		),
	};
	let body = (
		<BridgePage payload={payload} obsidianUri={buildObsidianUri(payload)} />
	);

	if (isBot) {
		body = (
			<CrawlerBridgeHtml title={payload.title} description={payload.summary} />
		);
	}

	return c.html(<Document metadata={metadata}>{body}</Document>);
});
