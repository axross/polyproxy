import type { Child } from "hono/jsx";

import {
	bridgeRouteDisplayPath,
	bridgeRoutePath,
} from "../helpers/bridge-route";
import type { BridgePayload } from "../helpers/validation";
import { invalidDescription, invalidTitle, siteName } from "./metadata";

interface ChildrenProps {
	children?: Child;
}

interface PageShellProps extends ChildrenProps {
	testId?: string;
}

function PageShell({ children, testId = "page" }: PageShellProps) {
	return (
		<main
			class="flex min-h-screen items-stretch justify-center px-3.5 py-6 [background:linear-gradient(180deg,rgba(255,255,255,0.88),rgba(246,247,251,0.96)),#f5f7fb] sm:items-center sm:px-5 sm:py-12 dark:[background:#10131a]"
			data-testid={testId}
		>
			{children}
		</main>
	);
}

interface PanelProps extends ChildrenProps {
	labelledBy: string;
	testId: string;
	variant?: "article" | "section";
}

function Panel({
	children,
	labelledBy,
	testId,
	variant = "section",
}: PanelProps) {
	const Tag = variant === "article" ? "article" : "section";

	return (
		<Tag
			class="w-full max-w-[760px] rounded-lg border border-[#dce3ec] bg-white px-5 py-7 shadow-[0_24px_80px_rgba(20,25,36,0.08)] sm:p-10 dark:border-[#2f3744] dark:bg-[#171b24]"
			aria-labelledby={labelledBy}
			data-testid={testId}
		>
			{children}
		</Tag>
	);
}

interface EyebrowProps extends ChildrenProps {
	flush?: boolean;
}

function Eyebrow({ children, flush = false }: EyebrowProps) {
	if (flush) {
		return (
			<p class="m-0 font-bold text-[#526070] text-xs uppercase tracking-normal dark:text-[#acb6c5]">
				{children}
			</p>
		);
	}

	return (
		<p class="m-0 mb-3.5 font-bold text-[#526070] text-xs uppercase tracking-normal dark:text-[#acb6c5]">
			{children}
		</p>
	);
}

export function OverviewPage() {
	return (
		<PageShell>
			<Panel labelledBy="overview-title" testId="overview">
				<div class="flex flex-col items-start gap-6">
					<Eyebrow flush>{siteName}</Eyebrow>
					<h1
						class="m-0 max-w-[620px] text-balance font-bold text-4xl text-[#171923] leading-[1.06] tracking-normal sm:text-5xl md:text-6xl dark:text-[#f3f5f8]"
						data-testid="title"
						id="overview-title"
					>
						Proxy Obsidian deeplinks through HTTPS.
					</h1>
					<p
						class="m-0 max-w-[600px] text-[#526070] text-lg leading-7 dark:text-[#acb6c5]"
						data-testid="description"
					>
						open.axross.app is a multi-purpose URL proxy server. This route
						turns a short Obsidian bridge key into Open Graph preview data and
						an Obsidian open action.
					</p>
				</div>

				<div
					class="mt-8 rounded-lg border border-[#dce3ec] bg-[#f0f3f8] p-4 dark:border-[#2f3744] dark:bg-[#202633]"
					data-testid="route"
				>
					<p class="m-0 mb-2 font-bold text-[#526070] text-xs uppercase tracking-normal dark:text-[#acb6c5]">
						Route
					</p>
					<code class="min-w-0 font-mono text-[#171923] [overflow-wrap:anywhere] dark:text-[#f3f5f8]">
						{bridgeRouteDisplayPath}
					</code>
				</div>

				<p
					class="m-0 mt-4 text-[#526070] text-sm leading-6 dark:text-[#acb6c5]"
					data-testid="privacy-notice"
				>
					Short bridge keys expire after 30 days. Do not put sensitive note
					content in proxy URLs.
				</p>
			</Panel>
		</PageShell>
	);
}

export function InvalidBridgePage() {
	return (
		<PageShell>
			<Panel labelledBy="invalid-title" testId="invalid-bridge">
				<Eyebrow>{siteName}</Eyebrow>
				<h1
					class="m-0 font-bold text-3xl text-[#171923] leading-tight tracking-normal sm:text-4xl dark:text-[#f3f5f8]"
					data-testid="title"
					id="invalid-title"
				>
					{invalidTitle}
				</h1>
				<p
					class="m-0 mt-4 text-[#526070] text-base leading-7 dark:text-[#acb6c5]"
					data-testid="description"
				>
					{invalidDescription}
				</p>
				<a
					class="mt-7 inline-flex font-bold text-[#2453c4] underline underline-offset-3 focus-visible:outline-[#2453c4]/55 focus-visible:outline-[3px] focus-visible:outline-offset-[3px] dark:text-[#8db1ff] dark:focus-visible:outline-[#8db1ff]/55"
					data-testid="overview-link"
					href={bridgeRoutePath}
				>
					Back to bridge overview
				</a>
			</Panel>
		</PageShell>
	);
}

export function BridgePage({ obsidianUri, payload }: BridgePageProps) {
	return (
		<PageShell>
			<Panel labelledBy="note-title" testId="bridge" variant="article">
				<Eyebrow>{siteName}</Eyebrow>
				<h1
					class="m-0 text-balance font-bold text-4xl text-[#171923] leading-[1.08] tracking-normal sm:text-5xl dark:text-[#f3f5f8]"
					data-testid="title"
					id="note-title"
				>
					{payload.title}
				</h1>
				<p
					class="m-0 max-w-[600px] text-[#526070] text-lg leading-7 dark:text-[#acb6c5]"
					data-testid="summary"
				>
					{payload.summary}
				</p>

				<OpenActions obsidianUri={obsidianUri} />

				<p class="m-0 mt-4 text-[#526070] text-sm leading-6 dark:text-[#acb6c5]">
					If Obsidian does not open automatically, use the button above.
				</p>

				<details
					class="mt-6 border-[#dce3ec] border-t pt-4 dark:border-[#2f3744]"
					data-testid="note-details"
				>
					<summary class="cursor-pointer font-bold text-[#171923] focus-visible:outline-[#2453c4]/55 focus-visible:outline-[3px] focus-visible:outline-offset-[3px] dark:text-[#f3f5f8] dark:focus-visible:outline-[#8db1ff]/55">
						Note details
					</summary>
					<dl class="mt-4 grid gap-3">
						<div>
							<dt class="m-0 font-bold text-[#526070] text-xs uppercase tracking-normal dark:text-[#acb6c5]">
								Vault
							</dt>
							<dd
								class="m-0 min-w-0 font-mono text-[#171923] text-sm [overflow-wrap:anywhere] dark:text-[#f3f5f8]"
								data-testid="vault"
							>
								{payload.vault}
							</dd>
						</div>
						<div>
							<dt class="m-0 font-bold text-[#526070] text-xs uppercase tracking-normal dark:text-[#acb6c5]">
								Path
							</dt>
							<dd
								class="m-0 min-w-0 font-mono text-[#171923] text-sm [overflow-wrap:anywhere] dark:text-[#f3f5f8]"
								data-testid="path"
							>
								{payload.path}
							</dd>
						</div>
						{payload.sourceUrl === undefined ? null : (
							<div>
								<dt class="m-0 font-bold text-[#526070] text-xs uppercase tracking-normal dark:text-[#acb6c5]">
									Source
								</dt>
								<dd class="m-0 min-w-0 font-mono text-[#171923] text-sm [overflow-wrap:anywhere] dark:text-[#f3f5f8]">
									<a
										class="text-[#2453c4] underline underline-offset-3 focus-visible:outline-[#2453c4]/55 focus-visible:outline-[3px] focus-visible:outline-offset-[3px] dark:text-[#8db1ff] dark:focus-visible:outline-[#8db1ff]/55"
										data-testid="source-url"
										href={payload.sourceUrl}
										target="_blank"
										rel="noreferrer"
									>
										{payload.sourceUrl}
									</a>
								</dd>
							</div>
						)}
					</dl>
				</details>
			</Panel>
		</PageShell>
	);
}

interface BridgePageProps {
	obsidianUri: string;
	payload: BridgePayload;
}

function OpenActions({ obsidianUri }: OpenActionsProps) {
	return (
		<div
			class="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center"
			data-testid="open-actions"
			data-obsidian-uri={obsidianUri}
		>
			<a
				class="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-[#2453c4] bg-[#2453c4] px-5 text-center font-bold text-white transition-colors duration-[160ms] hover:border-[#1f46a6] hover:bg-[#1f46a6] focus-visible:outline-[#2453c4]/55 focus-visible:outline-[3px] focus-visible:outline-offset-[3px] sm:w-auto dark:border-[#8db1ff] dark:bg-[#8db1ff] dark:text-[#10131a] dark:focus-visible:outline-[#8db1ff]/55 dark:hover:border-[#a4c4ff] dark:hover:bg-[#a4c4ff]"
				data-testid="open-button"
				href={obsidianUri}
			>
				Open in Obsidian
			</a>
			<p
				class="m-0 min-h-[1.5em] w-full text-[#526070] text-sm leading-6 dark:text-[#acb6c5]"
				aria-live="polite"
				data-testid="status"
			>
				Opening Obsidian. If nothing happens, use the button above.
			</p>
			<script
				dangerouslySetInnerHTML={{
					__html: `
          (() => {
            const openActions = document.querySelector("[data-obsidian-uri]");
            if (!(openActions instanceof HTMLElement)) {
              return;
            }

            const obsidianUri = openActions.dataset.obsidianUri;
            if (obsidianUri) {
              window.location.assign(obsidianUri);
            }
          })();
        `,
				}}
			/>
		</div>
	);
}

interface OpenActionsProps {
	obsidianUri: string;
}

export function CrawlerBridgeHtml({
	description,
	title,
}: CrawlerBridgeHtmlProps) {
	return (
		<main class="p-4 font-sans" data-testid="crawler-bridge">
			<h1
				class="m-0 font-bold text-2xl text-[#171923] dark:text-[#f3f5f8]"
				data-testid="title"
			>
				{title}
			</h1>
			<p
				class="m-0 mt-2 text-[#526070] dark:text-[#acb6c5]"
				data-testid="description"
			>
				{description}
			</p>
		</main>
	);
}

interface CrawlerBridgeHtmlProps {
	description: string;
	title: string;
}

export function NotFoundPage() {
	return (
		<PageShell>
			<Panel labelledBy="not-found-title" testId="not-found">
				<Eyebrow>{siteName}</Eyebrow>
				<h1
					class="m-0 font-bold text-3xl text-[#171923] leading-tight tracking-normal sm:text-4xl dark:text-[#f3f5f8]"
					id="not-found-title"
				>
					Not Found
				</h1>
			</Panel>
		</PageShell>
	);
}

export function ServerErrorPage() {
	return (
		<PageShell>
			<Panel labelledBy="server-error-title" testId="server-error">
				<Eyebrow>{siteName}</Eyebrow>
				<h1
					class="m-0 font-bold text-3xl text-[#171923] leading-tight tracking-normal sm:text-4xl dark:text-[#f3f5f8]"
					id="server-error-title"
				>
					Server Error
				</h1>
			</Panel>
		</PageShell>
	);
}
