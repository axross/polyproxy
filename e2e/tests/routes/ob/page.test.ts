import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await test.step("Navigate to the bridge overview route", async () => {
		await page.goto("/ob");
	});
});

test("Overview content", async ({ page }) => {
	const overview = page.getByTestId("page").getByTestId("overview");

	await test.step("Verify the page title", async () => {
		await expect(overview.getByTestId("title")).toHaveText(
			"Proxy Obsidian deeplinks through HTTPS.",
		);
	});

	await test.step("Verify the route template", async () => {
		await expect(overview.getByTestId("route")).toContainText("/ob/SHORT_KEY");
	});

	await test.step("Verify the privacy notice", async () => {
		await expect(overview.getByTestId("privacy-notice")).toContainText(
			"Do not put sensitive note content",
		);
	});
});

test("Overview metadata", async ({ page }) => {
	await test.step("Verify the document title", async () => {
		await expect(page).toHaveTitle("open.axross.app");
	});

	await test.step("Verify the description metadata", async () => {
		await expect(page.locator('meta[name="description"]')).toHaveAttribute(
			"content",
			"Multi-purpose URL proxy server with an Obsidian deeplink bridge.",
		);
	});

	await test.step("Verify the Open Graph metadata", async () => {
		await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
			"content",
			"website",
		);
	});
});
