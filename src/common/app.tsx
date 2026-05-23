import type { Hono as HonoType } from "hono";
import { Hono } from "hono";
import { requestId } from "hono/request-id";

import type { HonoEnv } from "./hono-env";
import { bridgeRoutePath } from "../obsidian/helpers/bridge-route";
import { routes as obsidianRoutes } from "../obsidian/routes/obsidian";
import {
	Document,
	notFoundMetadata,
	serverErrorMetadata,
} from "../obsidian/views/metadata";
import { NotFoundPage, ServerErrorPage } from "../obsidian/views/obsidian";

const notFoundStatus = 404;
const serverErrorStatus = 500;

export interface AppLogger {
	error(bindings: Record<string, unknown>, message: string): void;
}

export interface CreateAppOptions {
	configureMiddleware?: (app: HonoType<HonoEnv>) => void;
	logger?: AppLogger;
}

export function createApp({
	configureMiddleware,
	logger,
}: CreateAppOptions = {}): HonoType<HonoEnv> {
	const app = new Hono<HonoEnv>();

	configureMiddleware?.(app);

	app.use("*", requestId());

	app.get("/", (c) => c.notFound());

	app.route(bridgeRoutePath, obsidianRoutes);

	app.notFound((c) =>
		c.html(
			<Document metadata={notFoundMetadata}>
				<NotFoundPage />
			</Document>,
			notFoundStatus,
		),
	);

	app.onError((error, c) => {
		logger?.error(
			{
				errorName: error instanceof Error ? error.name : "UnknownError",
			},
			"Unhandled request error.",
		);

		return c.html(
			<Document metadata={serverErrorMetadata}>
				<ServerErrorPage />
			</Document>,
			serverErrorStatus,
		);
	});

	return app;
}

export default createApp();
