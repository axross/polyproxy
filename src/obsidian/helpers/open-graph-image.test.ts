import { describe, expect, it } from "vitest";

import {
	extractOpenGraphImageUrl,
	type ImageOptimizer,
	resolveOpenGraphImage,
} from "./open-graph-image";
import {
	bridgeImageContentType,
	bridgeImageHeight,
	bridgeImageWidth,
} from "./short-bridge-link";

describe("extractOpenGraphImageUrl", () => {
	it("resolves the first supported image metadata URL by priority", () => {
		const html = `
      <meta name="twitter:image" content="https://cdn.example.com/twitter.jpg">
      <meta property="og:image" content="/images/preview.jpg?size=large&amp;v=1">
    `;

		expect(
			extractOpenGraphImageUrl(html, "https://example.com/articles/story"),
		).toEqual(new URL("https://example.com/images/preview.jpg?size=large&v=1"));
	});

	it("omits unsafe image URLs", () => {
		const html = `
      <meta property="og:image" content="http://127.0.0.1/internal.png">
      <meta name="twitter:image" content="javascript:alert(1)">
    `;

		expect(
			extractOpenGraphImageUrl(html, "https://example.com/articles/story"),
		).toBeUndefined();
	});
});

describe("resolveOpenGraphImage", () => {
	it("fetches, optimizes, and returns the Open Graph image stream", async () => {
		const imageBytes = Uint8Array.from([1, 2, 3]);
		const optimizedBytes = Uint8Array.from([4, 5, 6]);
		const images = createFakeImageOptimizer(optimizedBytes);
		const fetcher = createFetchStub({
			"https://example.com/articles/story": new Response(
				'<meta property="og:image" content="/images/preview.png">',
				{
					headers: { "content-type": "text/html; charset=utf-8" },
				},
			),
			"https://example.com/images/preview.png": new Response(
				arrayBufferFromBytes(imageBytes),
				{
					headers: {
						"content-length": imageBytes.byteLength.toString(),
						"content-type": "image/png",
					},
				},
			),
		});

		const result = await resolveOpenGraphImage({
			fetcher,
			images,
			sourceUrl: "https://example.com/articles/story",
		});

		expect(result).toEqual({
			ok: true,
			value: {
				body: expect.any(ReadableStream),
				metadata: {
					contentType: bridgeImageContentType,
					height: bridgeImageHeight,
					width: bridgeImageWidth,
				},
			},
		});

		if (!result.ok) {
			throw new Error("Expected image resolution to succeed");
		}

		await expect(new Response(result.value.body).arrayBuffer()).resolves.toEqual(
			arrayBufferFromBytes(optimizedBytes),
		);
		expect(images.transformOptions).toEqual({
			fit: "cover",
			gravity: "auto",
			height: bridgeImageHeight,
			width: bridgeImageWidth,
		});
		expect(images.outputOptions).toEqual({
			anim: false,
			format: bridgeImageContentType,
			quality: 85,
		});
	});

	it("returns a recoverable failure when image metadata is absent", async () => {
		const fetcher = createFetchStub({
			"https://example.com/articles/story": new Response("<html></html>", {
				headers: { "content-type": "text/html" },
			}),
		});

		await expect(
			resolveOpenGraphImage({
				fetcher,
				images: createFakeImageOptimizer(),
				sourceUrl: "https://example.com/articles/story",
			}),
		).resolves.toEqual({
			ok: false,
			reason: "source page has no image metadata",
		});
	});

	it("does not fetch unsafe source URLs", async () => {
		const fetcher: typeof fetch = async () => {
			throw new Error("fetch should not be called");
		};

		await expect(
			resolveOpenGraphImage({
				fetcher,
				images: createFakeImageOptimizer(),
				sourceUrl: "http://localhost/articles/story",
			}),
		).resolves.toEqual({
			ok: false,
			reason: "source URL is not fetchable",
		});
	});
});

interface FakeImageOptimizer extends ImageOptimizer {
	outputOptions: unknown;
	transformOptions: unknown;
}

function createFakeImageOptimizer(
	outputBytes = Uint8Array.from([255]),
): FakeImageOptimizer {
	const images: FakeImageOptimizer = {
		outputOptions: undefined,
		transformOptions: undefined,
		input() {
			return createFakeImageTransformer(images, outputBytes);
		},
	};

	return images;
}

function createFakeImageTransformer(
	images: FakeImageOptimizer,
	outputBytes: Uint8Array,
) {
	return {
		transform(options: unknown) {
			images.transformOptions = options;
			return this;
		},
		async output(options: unknown) {
			images.outputOptions = options;

			return {
				contentType: () => bridgeImageContentType,
				image: () => {
					const body = new Response(arrayBufferFromBytes(outputBytes)).body;

					if (body === null) {
						throw new Error("Test image stream could not be created");
					}

					return body;
				},
			};
		},
	};
}

function createFetchStub(responses: Record<string, Response>): typeof fetch {
	return async (input) => {
		const url = toRequestUrl(input);
		const response = responses[url];

		if (response === undefined) {
			return new Response(null, { status: 404 });
		}

		return response.clone();
	};
}

function toRequestUrl(input: RequestInfo | URL): string {
	return input instanceof Request ? input.url : input.toString();
}

function arrayBufferFromBytes(bytes: Uint8Array): ArrayBuffer {
	const body = new ArrayBuffer(bytes.byteLength);
	new Uint8Array(body).set(bytes);

	return body;
}
