import { expect, test } from "@playwright/test";

import {
  buildBridgePath,
  buildObsidianUri,
  exampleBridgePayload,
} from "../../../../helpers/bridge-payload";

const validBridgePath = buildBridgePath(exampleBridgePayload);
const expectedObsidianUri = buildObsidianUri(exampleBridgePayload);

test.use({ javaScriptEnabled: false });

test("Bridge page content", async ({ page }) => {
  await test.step("Navigate to a valid bridge route", async () => {
    await page.goto(validBridgePath);
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

    await expect(openActions.getByTestId("open-button")).toHaveAttribute(
      "href",
      expectedObsidianUri,
    );
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

test("Bridge metadata", async ({ page }) => {
  await test.step("Navigate to a valid bridge route", async () => {
    await page.goto(validBridgePath);
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

test("Invalid bridge link", async ({ page }) => {
  await test.step("Navigate to an invalid bridge route", async () => {
    await page.goto("/obsidian/not-valid");
  });

  const invalidBridge = page.getByTestId("page").getByTestId("invalid-bridge");

  await test.step("Verify the invalid-link state", async () => {
    await expect(invalidBridge.getByTestId("title")).toHaveText(
      "Invalid Obsidian Link",
    );
    await expect(invalidBridge.getByTestId("description")).toHaveText(
      "This Obsidian bridge link could not be opened.",
    );
  });

  await test.step("Verify the overview link", async () => {
    await expect(invalidBridge.getByTestId("overview-link")).toHaveAttribute(
      "href",
      "/obsidian",
    );
  });
});

test.describe("crawler rendering", () => {
  test.use({ userAgent: "Discordbot/2.0" });

  test("Discord receives simple note HTML", async ({ page }) => {
    await test.step("Navigate to a valid bridge route as Discord", async () => {
      await page.goto(validBridgePath);
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
