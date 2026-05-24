import type { Child } from "hono/jsx";

export const siteName = "open.axross.app";

export interface PageMetadata {
	description: string;
	title: string;
	type: "article" | "website";
	url?: string;
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
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:title" content={metadata.title} />
				<meta name="twitter:description" content={metadata.description} />
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
