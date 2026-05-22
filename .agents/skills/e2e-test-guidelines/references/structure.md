# E2E Test Structure

Use this structure when adding or moving Playwright tests.

## Directory Layout

Route tests mirror the URL shape under `e2e/tests/routes`; helpers shared across tests live in `e2e/helpers`.

**Example:**

```text
e2e/
├── helpers/
│   └── bridge-payload.ts
└── tests/
    └── routes/
        └── obsidian/
            ├── page.test.ts
            └── query/
                └── page.test.ts
```

**Guidelines:**

- MUST place shared E2E helpers under `e2e/helpers`.
- MUST place route-specific tests under `e2e/tests/routes/<route>/`.
- SHOULD represent dynamic URL segments with readable directory names such as `query` instead of bracket syntax that is harder to reference from shell commands.
- MUST keep generated artifacts under `.playwright-results` or Playwright snapshot folders, not beside app source files.

## Test File Shape

Playwright tests should read as a browser workflow with compact setup and named steps.

**Example:**

```ts
import { expect, test } from "@playwright/test";

test("Overview content", async ({ page }) => {
  await test.step("Navigate to the bridge overview route", async () => {
    await page.goto("/obsidian");
  });

  const overview = page.getByTestId("page").getByTestId("overview");

  await test.step("Verify the page title", async () => {
    await expect(overview.getByTestId("title")).toHaveText(
      "Open Obsidian notes from Discord links.",
    );
  });
});
```

**Guidelines:**

- MUST use `.test.ts` for Playwright test files.
- MUST use concise `test()` names that describe the behavior under test.
- MUST wrap meaningful navigation, action, setup, and assertion groups in `test.step()`.
- SHOULD keep each test focused on one route behavior or metadata surface.
- SHOULD move repeated payload construction into `e2e/helpers`.

## Custom-Protocol Routes

The bridge page automatically attempts `obsidian://` navigation for human visitors, which browser automation cannot complete reliably.

**Example:**

```ts
test.use({ javaScriptEnabled: false });
```

**Guidelines:**

- MUST disable JavaScript for tests that need to inspect the human bridge page without triggering the custom-protocol redirect.
- SHOULD test the `href` of the fallback button instead of trying to launch Obsidian from Playwright.
- SHOULD use a crawler user agent when verifying Discord-style simple HTML rendering.
