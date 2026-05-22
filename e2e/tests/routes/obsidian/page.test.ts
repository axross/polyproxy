import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await test.step("Navigate to the bridge overview route", async () => {
    await page.goto("/obsidian");
  });
});

test("Overview content", async ({ page }) => {
  const overview = page.getByTestId("page").getByTestId("overview");

  await test.step("Verify the page title", async () => {
    await expect(overview.getByTestId("title")).toHaveText(
      "Open Obsidian notes from Discord links.",
    );
  });

  await test.step("Verify the route template", async () => {
    await expect(overview.getByTestId("route")).toContainText(
      "/obsidian/BASE64URL_JSON",
    );
  });

  await test.step("Verify the privacy notice", async () => {
    await expect(overview.getByTestId("privacy-notice")).toContainText(
      "Do not put sensitive note content",
    );
  });
});

test("Overview metadata", async ({ page }) => {
  await test.step("Verify the document title", async () => {
    await expect(page).toHaveTitle("Obsidian Link Bridge");
  });

  await test.step("Verify the description metadata", async () => {
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      "HTTPS bridge pages for opening local Obsidian notes from Discord previews.",
    );
  });

  await test.step("Verify the Open Graph metadata", async () => {
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "website",
    );
  });
});
