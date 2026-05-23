import { describe, expect, it } from "vitest";

import { isBotUserAgent } from "./bot-detection";

describe("isBotUserAgent", () => {
	it.each([
		"Discordbot/2.0",
		"Twitterbot/1.0",
		"facebookexternalhit/1.1",
		"Googlebot/2.1",
		"Mozilla/5.0 Applebot/0.1",
		"Slackbot-LinkExpanding 1.0",
	])("detects known crawler user agents: %s", (userAgent) => {
		expect(isBotUserAgent(userAgent)).toBe(true);
	});

	it.each([
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/125.0.0.0 Safari/537.36",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1",
		"",
	])("does not classify normal browser user agents as bots", (userAgent) => {
		expect(isBotUserAgent(userAgent)).toBe(false);
	});
});
