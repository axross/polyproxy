import { describe, expect, it } from "vitest";

import {
	type BridgePayload,
	validateBridgePayload,
	validateBridgePayloadSafe,
} from "./validation";

const payload: BridgePayload = {
	vault: "Personal",
	path: "Articles/Google wants to make the web agent-ready",
	title: "Google wants to make the web agent-ready",
	summary:
		"An article about Google's effort to make the web easier for agents to navigate.",
};

describe("validateBridgePayload", () => {
	it("normalizes accepted bridge payload fields", () => {
		expect(
			validateBridgePayload({
				...payload,
				vault: "  Personal  ",
				path: "  Articles/Note  ",
				title: "  Google\nwants   the web  ",
				summary: "  Summary\twith\nspace  ",
				sourceUrl: "  https://example.com/article  ",
			}),
		).toEqual({
			...payload,
			vault: "Personal",
			path: "Articles/Note",
			title: "Google wants the web",
			summary: "Summary with space",
			sourceUrl: "https://example.com/article",
		});
	});

	it("omits blank source URLs", () => {
		expect(
			validateBridgePayload({
				...payload,
				sourceUrl: "  ",
			}),
		).toEqual(payload);
	});

	it("accepts HTTP and HTTPS source URLs", () => {
		expect(
			validateBridgePayload({
				...payload,
				sourceUrl: "http://localhost/article",
			}).sourceUrl,
		).toBe("http://localhost/article");
	});

	it("rejects unsafe source URL values", () => {
		for (const sourceUrl of [
			"javascript:alert(1)",
			"data:text/plain,test",
			"//example.com/article",
			"/article",
		]) {
			expect(
				validateBridgePayloadSafe({
					...payload,
					sourceUrl,
				}),
			).toEqual({
				ok: false,
				reason: "sourceUrl must be http or https",
			});
		}
	});

	it("rejects null bytes in user-carried strings", () => {
		expect(
			validateBridgePayloadSafe({
				...payload,
				sourceUrl: "https://example.com/\0article",
			}),
		).toEqual({
			ok: false,
			reason: "sourceUrl contains a null byte",
		});
	});
});
