import { describe, expect, it } from "vitest";

import { encodeBase64Url } from "../../common/helpers/base64url";
import { decodeBridgeQuery, decodeBridgeQuerySafe } from "./decode-link";
import type { BridgePayload } from "./types";

const payload: BridgePayload = {
	vault: "Personal",
	path: "Articles/Google wants to make the web agent-ready",
	title: "Google wants to make the web agent-ready",
	summary:
		"An article about Google's effort to make the web easier for agents to navigate.",
};

describe("decodeBridgeQuery", () => {
	it("decodes a valid Base64url JSON path segment", () => {
		expect(decodeBridgeQuery(toQuery(payload))).toEqual(payload);
	});

	it("trims and collapses metadata whitespace", () => {
		const query = toQuery({
			...payload,
			title: "  Google\nwants   the web  ",
			summary: "  Summary\twith\nspace  ",
		});

		expect(decodeBridgeQuery(query)).toMatchObject({
			title: "Google wants the web",
			summary: "Summary with space",
		});
	});

	it("rejects missing required JSON fields", () => {
		const query = encodeBase64Url(
			JSON.stringify({
				vault: payload.vault,
				path: payload.path,
				title: payload.title,
			}),
		);

		expect(decodeBridgeQuerySafe(query).ok).toBe(false);
	});

	it("rejects empty decoded values", () => {
		expect(
			decodeBridgeQuerySafe(
				toQuery({
					...payload,
					title: "",
				}),
			).ok,
		).toBe(false);
	});

	it("rejects malformed Base64url values", () => {
		expect(decodeBridgeQuerySafe("not valid").ok).toBe(false);
	});

	it("rejects malformed JSON", () => {
		expect(decodeBridgeQuerySafe(encodeBase64Url("not json")).ok).toBe(false);
	});

	it("rejects non-object JSON values", () => {
		expect(decodeBridgeQuerySafe(encodeBase64Url("[]")).ok).toBe(false);
	});

	it("rejects wrong field types", () => {
		const query = encodeBase64Url(
			JSON.stringify({
				...payload,
				summary: ["not", "a", "string"],
			}),
		);

		expect(decodeBridgeQuerySafe(query).ok).toBe(false);
	});

	it("rejects unsafe paths", () => {
		expect(
			decodeBridgeQuerySafe(toQuery({ ...payload, path: "/root" })).ok,
		).toBe(false);
		expect(
			decodeBridgeQuerySafe(
				toQuery({ ...payload, path: "Articles/../Secrets" }),
			).ok,
		).toBe(false);
		expect(
			decodeBridgeQuerySafe(toQuery({ ...payload, path: "Articles/\0Secret" }))
				.ok,
		).toBe(false);
	});

	it("accepts an http source URL when present", () => {
		const sourceUrl = "https://example.com/articles/agent-ready";

		expect(decodeBridgeQuery(toQuery({ ...payload, sourceUrl }))).toEqual({
			...payload,
			sourceUrl,
		});
	});

	it("rejects unsafe source URL protocols", () => {
		expect(
			decodeBridgeQuerySafe(
				toQuery({ ...payload, sourceUrl: "javascript:alert(1)" }),
			).ok,
		).toBe(false);
	});
});

function toQuery(source: BridgePayload) {
	return encodeBase64Url(JSON.stringify(source));
}
