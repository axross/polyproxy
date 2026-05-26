import type { Result } from "./types";
import {
	bridgeImageContentType,
	bridgeImageHeight,
	bridgeImageWidth,
	type StoredBridgeImageMetadata,
} from "./short-bridge-link";

const movedPermanentlyStatus = 301;
const foundStatus = 302;
const seeOtherStatus = 303;
const temporaryRedirectStatus = 307;
const permanentRedirectStatus = 308;
const fetchTimeoutMs = 2500;
const maxRedirects = 3;
const maxHtmlBytes = 131_072;
const maxSourceImageBytes = 10_000_000;
const imageQuality = 85;
const cgnatFirstOctet = 100;
const cgnatSecondOctetMax = 127;
const cgnatSecondOctetMin = 64;
const documentationBenchmarkSecondOctetA = 18;
const documentationBenchmarkSecondOctetB = 19;
const documentationBenchmarkFirstOctet = 198;
const ipv4DecimalRadix = 10;
const ipv4OctetCount = 4;
const linkLocalFirstOctet = 169;
const linkLocalSecondOctet = 254;
const loopbackFirstOctet = 127;
const maxIpv4Octet = 255;
const multicastFirstOctetMin = 224;
const privateClassBFirstOctet = 172;
const privateClassBSecondOctetMax = 31;
const privateClassBSecondOctetMin = 16;
const privateClassCFirstOctet = 192;
const privateClassCSecondOctet = 168;
const trailingDotPattern = /\.$/;
const unsignedIntegerPattern = /^\d+$/;
const redirectStatuses = new Set([
	movedPermanentlyStatus,
	foundStatus,
	seeOtherStatus,
	temporaryRedirectStatus,
	permanentRedirectStatus,
]);
const htmlContentTypes = ["text/html", "application/xhtml+xml"];
const sourceImageContentTypes = [
	"image/avif",
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/svg+xml",
	"image/webp",
];
const imageMetaNames = [
	"og:image:secure_url",
	"og:image",
	"og:image:url",
	"twitter:image",
	"twitter:image:src",
];
const sourcePageHeaders = {
	accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1",
	"user-agent": "polyproxy-og-image-resolver/1.0",
} as const;
const sourceImageHeaders = {
	accept:
		"image/avif,image/webp,image/png,image/jpeg,image/gif,image/svg+xml;q=0.8,*/*;q=0.1",
	"user-agent": "polyproxy-og-image-resolver/1.0",
} as const;
const namedHtmlEntities: Record<string, string> = {
	amp: "&",
	apos: "'",
	gt: ">",
	lt: "<",
	quot: '"',
};

interface ImageTransformerLike {
	transform(options: {
		fit: "cover";
		gravity: "auto";
		height: typeof bridgeImageHeight;
		width: typeof bridgeImageWidth;
	}): ImageTransformerLike;
	output(options: {
		anim: false;
		format: typeof bridgeImageContentType;
		quality: typeof imageQuality;
	}): Promise<ImageTransformationResultLike>;
}

interface ImageTransformationResultLike {
	contentType(): string;
	image(): ReadableStream<Uint8Array>;
}

export interface ImageOptimizer {
	input(stream: ReadableStream<Uint8Array>): ImageTransformerLike;
}

interface FetchResult {
	response: Response;
	url: URL;
}

export interface ResolvedOpenGraphImage {
	body: ReadableStream<Uint8Array>;
	metadata: StoredBridgeImageMetadata;
}

export interface ResolveOpenGraphImageOptions {
	fetcher?: typeof fetch;
	images: ImageOptimizer;
	sourceUrl: string;
}

export async function resolveOpenGraphImage({
	fetcher = fetch,
	images,
	sourceUrl,
}: ResolveOpenGraphImageOptions): Promise<Result<ResolvedOpenGraphImage>> {
	try {
		const source = toFetchableHttpUrl(sourceUrl);

		if (source === undefined) {
			return failed("source URL is not fetchable");
		}

		const sourcePage = await fetchWithRedirects(source, fetcher, {
			headers: sourcePageHeaders,
		});

		if (
			sourcePage === undefined ||
			!sourcePage.response.ok ||
			!hasExpectedContentType(sourcePage.response, htmlContentTypes)
		) {
			return failed("source page is not fetchable");
		}

		const html = await readLimitedText(sourcePage.response, maxHtmlBytes);
		const imageUrl = extractOpenGraphImageUrl(html, sourcePage.url);

		if (imageUrl === undefined) {
			return failed("source page has no image metadata");
		}

		const sourceImage = await fetchWithRedirects(imageUrl, fetcher, {
			headers: sourceImageHeaders,
		});

		if (
			sourceImage === undefined ||
			!sourceImage.response.ok ||
			!hasExpectedContentType(sourceImage.response, sourceImageContentTypes) ||
			exceedsContentLength(sourceImage.response, maxSourceImageBytes) ||
			sourceImage.response.body === null
		) {
			return failed("source image is not fetchable");
		}

		const output = await images
			.input(sourceImage.response.body)
			.transform({
				fit: "cover",
				gravity: "auto",
				height: bridgeImageHeight,
				width: bridgeImageWidth,
			})
			.output({
				anim: false,
				format: bridgeImageContentType,
				quality: imageQuality,
			});

		if (output.contentType() !== bridgeImageContentType) {
			return failed("image optimization failed");
		}

		return {
			ok: true,
			value: {
				body: output.image(),
				metadata: {
					contentType: bridgeImageContentType,
					height: bridgeImageHeight,
					width: bridgeImageWidth,
				},
			},
		};
	} catch {
		return failed("image metadata is unavailable");
	}
}

export function extractOpenGraphImageUrl(
	html: string,
	sourceUrl: URL | string,
): URL | undefined {
	const baseUrl = typeof sourceUrl === "string" ? new URL(sourceUrl) : sourceUrl;
	const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
	const attributes = metaTags.map(parseAttributes);

	for (const metaName of imageMetaNames) {
		for (const tagAttributes of attributes) {
			const property =
				tagAttributes.get("property") ?? tagAttributes.get("name") ?? "";

			if (property.toLowerCase() !== metaName) {
				continue;
			}

			const content = tagAttributes.get("content")?.trim();

			if (!content) {
				continue;
			}

			const resolved = toFetchableHttpUrl(
				decodeHtmlAttribute(content),
				baseUrl,
			);

			if (resolved !== undefined) {
				return resolved;
			}
		}
	}

	return;
}

function failed(reason: string): Result<ResolvedOpenGraphImage> {
	return {
		ok: false,
		reason,
	};
}

async function fetchWithRedirects(
	url: URL,
	fetcher: typeof fetch,
	init: RequestInit,
): Promise<FetchResult | undefined> {
	let currentUrl = url;

	for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount += 1) {
		if (!isFetchableHttpUrl(currentUrl)) {
			return;
		}

		// biome-ignore lint/performance/noAwaitInLoops: Redirects must be followed sequentially because each response supplies the next URL.
		const response = await fetchWithTimeout(currentUrl, fetcher, init);

		if (!redirectStatuses.has(response.status)) {
			return {
				response,
				url: currentUrl,
			};
		}

		const location = response.headers.get("location");
		await response.body?.cancel();

		if (location === null) {
			return;
		}

		const nextUrl = toFetchableHttpUrl(location, currentUrl);

		if (nextUrl === undefined) {
			return;
		}

		currentUrl = nextUrl;
	}

	return;
}

async function fetchWithTimeout(
	url: URL,
	fetcher: typeof fetch,
	init: RequestInit,
): Promise<Response> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), fetchTimeoutMs);

	try {
		return await fetcher(url, {
			...init,
			redirect: "manual",
			signal: controller.signal,
		});
	} finally {
		clearTimeout(timeout);
	}
}

async function readLimitedText(
	response: Response,
	maxBytes: number,
): Promise<string> {
	if (response.body === null) {
		return "";
	}

	const reader = response.body.getReader();
	const chunks: Uint8Array[] = [];
	let byteCount = 0;

	try {
		for (;;) {
			// biome-ignore lint/performance/noAwaitInLoops: The stream reader exposes chunks sequentially and cannot be parallelized.
			const { done, value } = await reader.read();

			if (done) {
				break;
			}

			const remainingBytes = maxBytes - byteCount;

			if (value.byteLength > remainingBytes) {
				chunks.push(value.slice(0, remainingBytes));
				break;
			}

			chunks.push(value);
			byteCount += value.byteLength;
		}
	} finally {
		await reader.cancel();
	}

	return new TextDecoder().decode(concatBytes(chunks));
}

function concatBytes(chunks: Uint8Array[]): Uint8Array {
	const totalLength = chunks.reduce((length, chunk) => length + chunk.length, 0);
	const bytes = new Uint8Array(totalLength);
	let offset = 0;

	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.length;
	}

	return bytes;
}

function parseAttributes(tag: string): Map<string, string> {
	const attributes = new Map<string, string>();
	const attributePattern =
		/([^\s"'=<>`]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi;

	for (const match of tag.matchAll(attributePattern)) {
		const name = match[1]?.toLowerCase();
		const value = match[2] ?? match[3] ?? match[4];

		if (name !== undefined && value !== undefined) {
			attributes.set(name, decodeHtmlAttribute(value));
		}
	}

	return attributes;
}

function decodeHtmlAttribute(value: string): string {
	return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, body) => {
		const normalized = String(body).toLowerCase();

		if (normalized.startsWith("#x")) {
			return decodeCodePoint(Number.parseInt(normalized.slice(2), 16), entity);
		}

		if (normalized.startsWith("#")) {
			return decodeCodePoint(Number.parseInt(normalized.slice(1), 10), entity);
		}

		return namedHtmlEntities[normalized] ?? entity;
	});
}

function decodeCodePoint(codePoint: number, fallback: string): string {
	if (!Number.isFinite(codePoint)) {
		return fallback;
	}

	try {
		return String.fromCodePoint(codePoint);
	} catch {
		return fallback;
	}
}

function toFetchableHttpUrl(value: string, baseUrl?: URL): URL | undefined {
	try {
		const url = baseUrl === undefined ? new URL(value) : new URL(value, baseUrl);
		return isFetchableHttpUrl(url) ? url : undefined;
	} catch {
		return;
	}
}

function isFetchableHttpUrl(url: URL): boolean {
	return (
		(url.protocol === "http:" || url.protocol === "https:") &&
		!isBlockedHostname(url.hostname)
	);
}

function isBlockedHostname(hostname: string): boolean {
	const normalized = hostname.toLowerCase().replace(trailingDotPattern, "");
	const host = normalized.startsWith("[") && normalized.endsWith("]")
		? normalized.slice(1, -1)
		: normalized;

	if (host === "localhost" || host.endsWith(".localhost")) {
		return true;
	}

	if (host.includes(":")) {
		return true;
	}

	const ipv4 = parseIpv4(host);

	if (ipv4 === undefined) {
		return false;
	}

	const [first, second] = ipv4;

	return (
		first === 0 ||
		first === 10 ||
		first === loopbackFirstOctet ||
		first >= multicastFirstOctetMin ||
		(first === cgnatFirstOctet &&
			second >= cgnatSecondOctetMin &&
			second <= cgnatSecondOctetMax) ||
		(first === linkLocalFirstOctet && second === linkLocalSecondOctet) ||
		(first === privateClassBFirstOctet &&
			second >= privateClassBSecondOctetMin &&
			second <= privateClassBSecondOctetMax) ||
		(first === privateClassCFirstOctet &&
			second === privateClassCSecondOctet) ||
		(first === documentationBenchmarkFirstOctet &&
			(second === documentationBenchmarkSecondOctetA ||
				second === documentationBenchmarkSecondOctetB))
	);
}

function parseIpv4(hostname: string): [number, number, number, number] | undefined {
	const parts = hostname.split(".");

	if (parts.length !== ipv4OctetCount) {
		return;
	}

	const octets = parts.map((part) =>
		unsignedIntegerPattern.test(part)
			? Number.parseInt(part, ipv4DecimalRadix)
			: Number.NaN,
	);

	if (
		octets.some(
			(octet) => !Number.isInteger(octet) || octet < 0 || octet > maxIpv4Octet,
		)
	) {
		return;
	}

	return [octets[0], octets[1], octets[2], octets[3]];
}

function hasExpectedContentType(
	response: Response,
	allowedContentTypes: string[],
): boolean {
	const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";

	return allowedContentTypes.some((allowed) => contentType.includes(allowed));
}

function exceedsContentLength(response: Response, maxBytes: number): boolean {
	const contentLength = response.headers.get("content-length");

	if (contentLength === null) {
		return false;
	}

	const byteLength = Number.parseInt(contentLength, 10);
	return Number.isFinite(byteLength) && byteLength > maxBytes;
}
