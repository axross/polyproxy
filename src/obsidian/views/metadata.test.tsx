import { renderToString } from "hono/jsx/dom/server";
import { describe, expect, it } from "vitest";

import { Document, type PageMetadata } from "./metadata";

describe("Document", () => {
	it("emits large-card image metadata when an image is present", () => {
		const metadata: PageMetadata = {
			description: "Summary",
			image: {
				alt: "Preview alt",
				height: 630,
				type: "image/jpeg",
				url: "https://open.axross.app/ob/d80025792a1b57e5a235462ea488de44/image",
				width: 1200,
			},
			title: "Title",
			type: "article",
			url: "https://open.axross.app/ob/d80025792a1b57e5a235462ea488de44",
		};

		const html = renderToString(
			<Document metadata={metadata}>
				<p>Body</p>
			</Document>,
		);

		expect(html).toContain(
			'<meta property="og:image" content="https://open.axross.app/ob/d80025792a1b57e5a235462ea488de44/image"/>',
		);
		expect(html).toContain('<meta property="og:image:type" content="image/jpeg"/>');
		expect(html).toContain('<meta property="og:image:width" content="1200"/>');
		expect(html).toContain('<meta property="og:image:height" content="630"/>');
		expect(html).toContain('<meta name="twitter:card" content="summary_large_image"/>');
		expect(html).toContain(
			'<meta name="twitter:image" content="https://open.axross.app/ob/d80025792a1b57e5a235462ea488de44/image"/>',
		);
	});

	it("keeps summary Twitter metadata when no image is present", () => {
		const html = renderToString(
			<Document
				metadata={{
					description: "Summary",
					title: "Title",
					type: "article",
				}}
			>
				<p>Body</p>
			</Document>,
		);

		expect(html).toContain('<meta name="twitter:card" content="summary"/>');
		expect(html).not.toContain('property="og:image"');
		expect(html).not.toContain('name="twitter:image"');
	});
});
