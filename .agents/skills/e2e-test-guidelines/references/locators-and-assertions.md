# Locators and Assertions

Use these conventions when choosing selectors and assertions for Playwright tests.

## App-Owned UI Locators

App-owned UI should expose stable `data-testid` hooks and tests should scope selectors through parent regions.

**Good Examples:**

> `page.getByTestId("page").getByTestId("bridge").getByTestId("title")`

> `bridge.getByTestId("open-actions").getByTestId("open-button")`

**Bad Example:**

> `page.getByText("Open in Obsidian")`

**Guidelines:**

- MUST use chained `getByTestId()` locators for app-owned UI.
- MUST use kebab-case for `data-testid` values.
- MUST scope locators through the nearest stable parent region.
- MUST NOT use `getByText()` for app-owned UI selectors.
- SHOULD add test IDs only to meaningful regions, controls, and assertions.

## Metadata and Document Locators

Metadata, icons, and JSON script tags are document structure rather than app-owned UI, so CSS locators are acceptable.

**Example:**

```ts
await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
  "content",
  "article",
);
```

**Guidelines:**

- MAY use `page.locator()` for `meta`, `link`, `script`, and other document-level assertions.
- SHOULD keep metadata selectors literal and narrow.
- MUST NOT replace a simple metadata locator with a UI test ID.

## Assertion Style

Playwright assertions auto-wait and produce useful failure messages. Manual DOM reads are reserved for state that locator assertions cannot express.

**Example:**

```ts
await expect(openButton).toHaveAttribute("href", expectedObsidianUri);
```

**Guidelines:**

- MUST prefer locator-native assertions such as `toBeVisible()`, `toHaveText()`, `toHaveAttribute()`, `toHaveCount()`, and `toHaveURL()`.
- MUST use `expect.poll()` or `page.waitForFunction()` for computed state that changes asynchronously and lacks a locator-native assertion.
- MUST NOT use `page.waitForTimeout()` or fixed sleeps to wait for UI state.
- SHOULD assert visible behavior rather than implementation details when both are equally stable.

## Accessibility-Aware Queries

Next.js documentation notes that role and label queries filter hidden Activity content more safely than raw selectors. This project still defaults to `data-testid` for app-owned E2E selectors, but accessibility-aware locators remain useful for browser-native controls.

**Example:**

```ts
await page.getByRole("button", { name: "Submit" }).click();
```

**Guidelines:**

- MAY use `getByRole()` or `getByLabel()` for native controls when the accessible name is the behavior under test.
- MUST still prefer `data-testid` for route regions and app-owned content whose text may change independently of behavior.
- SHOULD include visibility assertions when using raw `locator()` selectors that may match hidden content.
