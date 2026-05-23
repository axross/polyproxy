import { Hono } from "hono";
import { isBotUserAgent } from "../helpers/bot-detection";
import {
	buildBridgeUrl,
	buildShortBridgeUrl,
	getConfiguredBaseUrl,
} from "../helpers/bridge-url";
import { decodeBridgeQuerySafe } from "../helpers/decode-link";
import { buildObsidianUri } from "../helpers/obsidian-uri";
import {
	type BridgeQueryStore,
	bridgeQueryTtlSeconds,
	isShortBridgeKey,
	parseShortenBridgeRequest,
	readShortBridgeQuery,
	storeShortBridgeQuery,
} from "../helpers/short-bridge-link";
import type { Result } from "../helpers/types";
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

	const query = parseShortenBridgeRequest(body);

	if (!query.ok) {
		return c.json({ error: query.reason }, badRequestStatus);
	}

	const key = await storeShortBridgeQuery(c.env.OBSIDIAN_QUERIES, query.value);
	const url = buildShortBridgeUrl(
		getConfiguredBaseUrl(c.env.PUBLIC_BASE_URL),
		key,
	);

	return c.json(
		{
			expiresIn: bridgeQueryTtlSeconds,
			key,
			url,
		},
		createdStatus,
	);
});

routes.get("/:query", async (c) => {
	const routeSegment = c.req.param("query");
	const userAgent = c.req.header("user-agent") ?? "";
	const isBot = isBotUserAgent(userAgent);
	const query = await resolveBridgeQuery(c.env.OBSIDIAN_QUERIES, routeSegment);
	const result = query.ok ? decodeBridgeQuerySafe(query.value.query) : query;

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
		url:
			query.ok && query.value.key
				? buildShortBridgeUrl(
						getConfiguredBaseUrl(c.env.PUBLIC_BASE_URL),
						query.value.key,
					)
				: buildBridgeUrl(getConfiguredBaseUrl(c.env.PUBLIC_BASE_URL), payload),
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

async function resolveBridgeQuery(
	store: BridgeQueryStore,
	routeSegment: string,
): Promise<Result<{ key?: string; query: string }>> {
	if (!isShortBridgeKey(routeSegment)) {
		return {
			ok: true,
			value: { query: routeSegment },
		};
	}

	const storedQuery = await readShortBridgeQuery(store, routeSegment);

	if (!storedQuery.ok) {
		return storedQuery;
	}

	return {
		ok: true,
		value: {
			key: routeSegment,
			query: storedQuery.value,
		},
	};
}
