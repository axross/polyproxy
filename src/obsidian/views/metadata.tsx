import type { Child } from "hono/jsx";

export const siteName = "open.axross.app";

export interface PageMetadata {
	description: string;
	image?: PageMetadataImage;
	title: string;
	type: "article" | "website";
	url?: string;
}

export interface PageMetadataImage {
	alt?: string;
	height: number;
	type: string;
	url: string;
	width: number;
}

export interface DocumentProps {
	children: Child;
	metadata: PageMetadata;
}

export function Document({ children, metadata }: DocumentProps) {
	return (
		<html lang="en" class="scheme-light dark:scheme-dark h-full">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="robots" content="noindex, nofollow" />
				<meta name="googlebot" content="noindex, nofollow" />
				<title>{metadata.title}</title>
				<meta name="description" content={metadata.description} />
				<meta property="og:title" content={metadata.title} />
				<meta property="og:description" content={metadata.description} />
				<meta property="og:type" content={metadata.type} />
				<meta property="og:site_name" content={siteName} />
				{metadata.url ? (
					<meta property="og:url" content={metadata.url} />
				) : null}
				{metadata.image ? (
					<>
						<meta property="og:image" content={metadata.image.url} />
						<meta property="og:image:secure_url" content={metadata.image.url} />
						<meta property="og:image:type" content={metadata.image.type} />
						<meta
							property="og:image:width"
							content={metadata.image.width.toString()}
						/>
						<meta
							property="og:image:height"
							content={metadata.image.height.toString()}
						/>
						{metadata.image.alt ? (
							<meta property="og:image:alt" content={metadata.image.alt} />
						) : null}
					</>
				) : null}
				<meta
					name="twitter:card"
					content={metadata.image ? "summary_large_image" : "summary"}
				/>
				<meta name="twitter:title" content={metadata.title} />
				<meta name="twitter:description" content={metadata.description} />
				{metadata.image ? (
					<>
						<meta name="twitter:image" content={metadata.image.url} />
						{metadata.image.alt ? (
							<meta name="twitter:image:alt" content={metadata.image.alt} />
						) : null}
					</>
				) : null}
				<link rel="icon" href="/favicon.ico" />
				<link rel="stylesheet" href="/styles.css" />
			</head>
			<body class="flex min-h-full max-w-[100vw] flex-col overflow-x-hidden bg-[#f5f7fb] font-sans text-[#171923] antialiased dark:bg-[#10131a] dark:text-[#f3f5f8]">
				{children}
			</body>
		</html>
	);
}

export const overviewDescription =
	"Multi-purpose URL proxy server with an Obsidian deeplink bridge.";

export const invalidTitle = "Invalid Obsidian Proxy Link";
export const invalidDescription =
	"This Obsidian proxy link could not be opened.";

export const overviewMetadata: PageMetadata = {
	title: siteName,
	description: overviewDescription,
	type: "website",
};

export const invalidBridgeMetadata: PageMetadata = {
	title: invalidTitle,
	description: invalidDescription,
	type: "website",
};

export const notFoundMetadata: PageMetadata = {
	title: "Not Found",
	description: "The requested route was not found.",
	type: "website",
};

export const serverErrorMetadata: PageMetadata = {
	title: "Server Error",
	description: "The request could not be completed.",
	type: "website",
};
