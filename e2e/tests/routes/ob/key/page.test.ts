import { type APIRequestContext, expect, test } from "@playwright/test";

import {
	buildObsidianUri,
	exampleBridgePayload,
} from "../../../../helpers/bridge-payload";

const expectedObsidianUri = buildObsidianUri(exampleBridgePayload);
const expectedShortBridgeKey = "d80025792a1b57e5a235462ea488de44";
const expectedShortBridgePath = `/ob/${expectedShortBridgeKey}`;

test.use({ colorScheme: "light", javaScriptEnabled: false });

test("Bridge page content", async ({ page }) => {
	let shortBridgePath = "";

	await test.step("Create a short bridge link", async () => {
		shortBridgePath = await createShortBridgePath(page.request);
	});

	await test.step("Navigate to a valid bridge route", async () => {
		await page.goto(shortBridgePath);
	});

	const bridge = page.getByTestId("page").getByTestId("bridge");

	await test.step("Verify the note title and summary", async () => {
		await expect(bridge.getByTestId("title")).toHaveText(
			exampleBridgePayload.title,
		);
		await expect(bridge.getByTestId("summary")).toHaveText(
			exampleBridgePayload.summary,
		);
	});

	await test.step("Verify the Obsidian open action", async () => {
		const openActions = bridge.getByTestId("open-actions");
		const openButton = openActions.getByTestId("open-button");

		await expect(openButton).toHaveAttribute("href", expectedObsidianUri);
		await expect(openButton).toHaveCSS("background-color", "rgb(36, 83, 196)");
		await expect(openButton).toHaveCSS("color", "rgb(255, 255, 255)");
		await expect(openActions.getByTestId("status")).toContainText(
			"Opening Obsidian",
		);
	});

	await test.step("Verify the note details", async () => {
		const details = bridge.getByTestId("note-details");

		await details.locator("summary").click();
		await expect(details.getByTestId("vault")).toHaveText(
			exampleBridgePayload.vault,
		);
		await expect(details.getByTestId("path")).toHaveText(
			exampleBridgePayload.path,
		);
		await expect(details.getByTestId("source-url")).toHaveAttribute(
			"href",
			exampleBridgePayload.sourceUrl,
		);
	});
});

test.describe("dark color scheme", () => {
	test.use({ colorScheme: "dark" });

	test("Bridge open action keeps readable contrast", async ({ page }) => {
		let shortBridgePath = "";

		await test.step("Create a short bridge link", async () => {
			shortBridgePath = await createShortBridgePath(page.request);
		});

		await test.step("Navigate to the short bridge route", async () => {
			await page.goto(shortBridgePath);
		});

		const openButton = page.getByTestId("bridge").getByTestId("open-button");

		await expect(openButton).toHaveCSS(
			"background-color",
			"rgb(141, 177, 255)",
		);
		await expect(openButton).toHaveCSS("color", "rgb(16, 19, 26)");
	});
});

test("Bridge metadata", async ({ page }) => {
	let shortBridgePath = "";

	await test.step("Create a short bridge link", async () => {
		shortBridgePath = await createShortBridgePath(page.request);
	});

	await test.step("Navigate to a valid bridge route", async () => {
		await page.goto(shortBridgePath);
	});

	await test.step("Verify the document title", async () => {
		await expect(page).toHaveTitle(exampleBridgePayload.title);
	});

	await test.step("Verify the description metadata", async () => {
		await expect(page.locator('meta[name="description"]')).toHaveAttribute(
			"content",
			exampleBridgePayload.summary,
		);
	});

	await test.step("Verify the Open Graph metadata", async () => {
		await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
			"content",
			exampleBridgePayload.title,
		);
		await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
			"content",
			"article",
		);
	});
});

test("Short bridge link creation and rendering", async ({ page }) => {
	let shortBridgePath = "";

	await test.step("Create a short bridge link", async () => {
		shortBridgePath = await createShortBridgePath(page.request);
	});

	await test.step("Navigate to the short bridge route", async () => {
		await page.goto(shortBridgePath);
	});

	const bridge = page.getByTestId("page").getByTestId("bridge");

	await test.step("Verify the short route renders the stored note", async () => {
		await expect(bridge.getByTestId("title")).toHaveText(
			exampleBridgePayload.title,
		);
		await expect(bridge.getByTestId("summary")).toHaveText(
			exampleBridgePayload.summary,
		);
		await expect(bridge.getByTestId("open-button")).toHaveAttribute(
			"href",
			expectedObsidianUri,
		);
	});

	await test.step("Verify the canonical Open Graph URL uses the short key", async () => {
		await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
			"content",
			`https://open.axross.dev${shortBridgePath}`,
		);
	});
});

test("Short bridge link creation rejects invalid input", async ({
	request,
}) => {
	const response = await request.post("/ob", {
		data: {
			payload: {
				...exampleBridgePayload,
				sourceUrl: "javascript:alert(1)",
			},
		},
	});

	expect(response.status()).toBe(400);
	expect(response.headers()["content-type"]).toContain("application/json");
	await expect(response.json()).resolves.toMatchObject({
		error: "sourceUrl must be http or https",
	});
});

test("Invalid bridge link", async ({ page }) => {
	await test.step("Navigate to an invalid bridge route", async () => {
		await page.goto("/ob/not-valid");
	});

	const invalidBridge = page.getByTestId("page").getByTestId("invalid-bridge");

	await test.step("Verify the invalid-link state", async () => {
		await expect(invalidBridge.getByTestId("title")).toHaveText(
			"Invalid Obsidian Proxy Link",
		);
		await expect(invalidBridge.getByTestId("description")).toHaveText(
			"This Obsidian proxy link could not be opened.",
		);
	});

	await test.step("Verify the overview link", async () => {
		await expect(invalidBridge.getByTestId("overview-link")).toHaveAttribute(
			"href",
			"/ob",
		);
	});
});

test.describe("crawler rendering", () => {
	test.use({ userAgent: "Discordbot/2.0" });

	test("Discord receives simple note HTML", async ({ page }) => {
		let shortBridgePath = "";

		await test.step("Create a short bridge link", async () => {
			shortBridgePath = await createShortBridgePath(page.request);
		});

		await test.step("Navigate to a valid bridge route as Discord", async () => {
			await page.goto(shortBridgePath);
		});

		const crawlerBridge = page.getByTestId("crawler-bridge");

		await test.step("Verify the crawler title and description", async () => {
			await expect(crawlerBridge.getByTestId("title")).toHaveText(
				exampleBridgePayload.title,
			);
			await expect(crawlerBridge.getByTestId("description")).toHaveText(
				exampleBridgePayload.summary,
			);
		});

		await test.step("Verify custom-protocol actions are not rendered", async () => {
			await expect(page.getByTestId("open-actions")).toHaveCount(0);
		});
	});
});

async function createShortBridgePath(
	request: APIRequestContext,
): Promise<string> {
	const response = await request.post("/ob", {
		data: {
			payload: exampleBridgePayload,
		},
	});

	expect(response.status()).toBe(201);

	const body = (await response.json()) as {
		expiresIn: number;
		key: string;
		url: string;
	};

	expect(body.expiresIn).toBe(2_592_000);
	expect(body.key).toBe(expectedShortBridgeKey);
	expect(body.url).toBe(`https://open.axross.dev${expectedShortBridgePath}`);

	return new URL(body.url).pathname;
}
