import { Hono } from "hono";
import { isBotUserAgent } from "../../common/helpers/bot-detection";
import type { HonoEnv } from "../../common/hono-env";
import {
	buildShortBridgeImageUrl,
	buildShortBridgeUrl,
	getConfiguredBaseUrl,
} from "../helpers/bridge-url";
import {
	type ImageOptimizer,
	resolveOpenGraphImage,
} from "../helpers/open-graph-image";
import { buildObsidianUri } from "../helpers/obsidian-uri";
import {
	bridgePayloadTtlSeconds,
	createShortBridgeKey,
	readShortBridgeImage,
	parseShortenBridgeRequest,
	readShortBridgePayload,
	storeShortBridgeImage,
	storeShortBridgePayload,
	type StoredBridgeImageMetadata,
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
const notFoundStatus = 404;

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

	const key = await createShortBridgeKey(payload.value);
	const image = await resolveAndStoreBridgeImage(
		c.env.CF_KV,
		c.env.CF_IMAGES,
		key,
		payload.value.sourceUrl,
	);
	await storeShortBridgePayload(c.env.CF_KV, payload.value, {
		createKey: () => key,
		image,
	});
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

routes.get("/:key/image", async (c) => {
	const routeKey = c.req.param("key");
	const result = await readShortBridgeImage(c.env.CF_KV, routeKey);

	if (!result.ok) {
		return new Response(null, { status: notFoundStatus });
	}

	return new Response(result.value.body, {
		headers: {
			"cache-control": "no-store",
			"content-type": result.value.metadata.contentType,
		},
		status: 200,
	});
});

routes.get("/:key", async (c) => {
	const routeKey = c.req.param("key");
	const userAgent = c.req.header("user-agent") ?? "";
	const isBot = isBotUserAgent(userAgent);
	const result = await readShortBridgePayload(c.env.CF_KV, routeKey);

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
	const bridgeUrl = buildShortBridgeUrl(
		getConfiguredBaseUrl(c.env.PUBLIC_BASE_URL),
		routeKey,
	);
	const metadata = {
		title: payload.title,
		description: payload.summary,
		type: "article" as const,
		url: bridgeUrl,
		image:
			payload.image === undefined
				? undefined
				: {
						alt: payload.title,
						height: payload.image.height,
						type: payload.image.contentType,
						url: buildShortBridgeImageUrl(
							getConfiguredBaseUrl(c.env.PUBLIC_BASE_URL),
							routeKey,
						),
						width: payload.image.width,
					},
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

async function resolveAndStoreBridgeImage(
	store: Parameters<typeof storeShortBridgeImage>[0],
	images: ImageOptimizer,
	key: string,
	sourceUrl?: string,
): Promise<StoredBridgeImageMetadata | undefined> {
	if (sourceUrl === undefined) {
		return;
	}

	const image = await resolveOpenGraphImage({ images, sourceUrl });

	if (!image.ok) {
		return;
	}

	try {
		await storeShortBridgeImage(store, key, image.value.body);
		return image.value.metadata;
	} catch {
		return;
	}
}
