import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;
const configuredBaseUrl = process.env.PLAYWRIGHT_BASE_URL;
const localBaseUrl = "http://127.0.0.1:3100";
const baseURL = configuredBaseUrl ?? localBaseUrl;

export default defineConfig({
  testDir: "./e2e/tests",
  reporter: isCI ? "github" : "list",
  outputDir: ".playwright-results",
  forbidOnly: isCI,
  failOnFlakyTests: true,
  repeatEach: isCI ? 2 : 1,
  workers: isCI || configuredBaseUrl === undefined ? 1 : undefined,
  snapshotPathTemplate:
    "e2e/tests/{testFileDir}/__snapshots__/{testFileName}{/platform}/{projectName}-{arg}{ext}",
  use: {
    baseURL,
    trace: {
      mode: "retain-on-first-failure",
      screenshots: true,
      snapshots: true,
      sources: true,
      attachments: true,
    },
    video: "on-first-retry",
  },
  projects: [
    {
      name: "desktop-chrome",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "pixel",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer:
    configuredBaseUrl === undefined
      ? {
          command: "npm run dev -- --ip 127.0.0.1 --port 3100",
          url: `${localBaseUrl}/ob`,
          reuseExistingServer: !isCI,
          timeout: 120_000,
        }
      : undefined,
});
