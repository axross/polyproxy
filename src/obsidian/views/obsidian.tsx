import type { Child } from "hono/jsx";

import {
	bridgeRouteDisplayPath,
	bridgeRoutePath,
} from "../helpers/bridge-route";
import type { BridgePayload } from "../helpers/validation";
import { invalidDescription, invalidTitle, siteName } from "./metadata";

const focusRingClass =
	"focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#2453c4]/55 dark:focus-visible:outline-[#8db1ff]/55";
const foregroundClass = "text-[#171923] dark:text-[#f3f5f8]";
const mutedTextClass = "text-[#526070] dark:text-[#acb6c5]";
const borderClass = "border-[#dce3ec] dark:border-[#2f3744]";
const pageClass =
	"flex min-h-screen items-stretch justify-center px-3.5 py-6 [background:linear-gradient(180deg,rgba(255,255,255,0.88),rgba(246,247,251,0.96)),#f5f7fb] dark:[background:#10131a] sm:items-center sm:px-5 sm:py-12";
const panelClass = `w-full max-w-[760px] rounded-lg border ${borderClass} bg-white px-5 py-7 shadow-[0_24px_80px_rgba(20,25,36,0.08)] dark:bg-[#171b24] sm:p-10`;
const eyebrowBaseClass = `m-0 text-xs font-bold tracking-normal uppercase ${mutedTextClass}`;
const eyebrowClass = `${eyebrowBaseClass} mb-3.5`;
const overviewHeadingClass = "flex flex-col items-start gap-6";
const headingBaseClass = `m-0 font-bold tracking-normal ${foregroundClass}`;
const overviewTitleClass = `${headingBaseClass} max-w-[620px] text-4xl leading-[1.06] text-balance sm:text-5xl md:text-6xl`;
const noteTitleClass = `${headingBaseClass} text-4xl leading-[1.08] text-balance sm:text-5xl`;
const invalidTitleClass = `${headingBaseClass} text-3xl leading-tight sm:text-4xl`;
const descriptionClass = `m-0 max-w-[600px] text-lg leading-7 ${mutedTextClass}`;
const invalidDescriptionClass = `m-0 mt-4 text-base leading-7 ${mutedTextClass}`;
const routePanelClass = `mt-8 rounded-lg border ${borderClass} bg-[#f0f3f8] p-4 dark:bg-[#202633]`;
const labelClass = `m-0 text-xs font-bold tracking-normal uppercase ${mutedTextClass}`;
const routeLabelClass = `${labelClass} mb-2`;
const codeClass = `min-w-0 [overflow-wrap:anywhere] font-mono ${foregroundClass}`;
const smallMutedTextClass = `text-sm leading-6 ${mutedTextClass}`;
const privacyNoticeClass = `m-0 mt-4 ${smallMutedTextClass}`;
const linkClass = `text-[#2453c4] underline underline-offset-3 dark:text-[#8db1ff] ${focusRingClass}`;
const overviewLinkClass = `mt-7 inline-flex font-bold ${linkClass}`;
const openActionsClass =
	"mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center";
const openButtonClass = `inline-flex min-h-11 w-full items-center justify-center rounded-md border border-[#2453c4] bg-[#2453c4] px-5 text-center font-bold text-white transition-colors duration-[160ms] hover:border-[#1f46a6] hover:bg-[#1f46a6] dark:border-[#8db1ff] dark:bg-[#8db1ff] dark:text-[#10131a] dark:hover:border-[#a4c4ff] dark:hover:bg-[#a4c4ff] sm:w-auto ${focusRingClass}`;
const statusClass = `m-0 min-h-[1.5em] w-full ${smallMutedTextClass}`;
const openHelpClass = `m-0 mt-4 ${smallMutedTextClass}`;
const noteDetailsClass = `mt-6 border-t ${borderClass} pt-4`;
const summaryClass = `cursor-pointer font-bold ${foregroundClass} ${focusRingClass}`;
const detailsListClass = "mt-4 grid gap-3";
const detailDescriptionClass = `m-0 text-sm ${codeClass}`;
const crawlerPageClass = "p-4 font-sans";
const crawlerTitleClass = `m-0 text-2xl font-bold ${foregroundClass}`;
const crawlerDescriptionClass = `m-0 mt-2 ${mutedTextClass}`;

interface ChildrenProps {
	children?: Child;
}

interface PageShellProps extends ChildrenProps {
	testId?: string;
}

function PageShell({ children, testId = "page" }: PageShellProps) {
	return (
		<main class={pageClass} data-testid={testId}>
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
		<Tag class={panelClass} aria-labelledby={labelledBy} data-testid={testId}>
			{children}
		</Tag>
	);
}

interface EyebrowProps extends ChildrenProps {
	flush?: boolean;
}

function Eyebrow({ children, flush = false }: EyebrowProps) {
	return <p class={flush ? eyebrowBaseClass : eyebrowClass}>{children}</p>;
}

export function OverviewPage() {
	return (
		<PageShell>
			<Panel labelledBy="overview-title" testId="overview">
				<div class={overviewHeadingClass}>
					<Eyebrow flush>{siteName}</Eyebrow>
					<h1
						class={overviewTitleClass}
						data-testid="title"
						id="overview-title"
					>
						Proxy Obsidian deeplinks through HTTPS.
					</h1>
					<p class={descriptionClass} data-testid="description">
						open.axross.app is a multi-purpose URL proxy server. This route
						turns a short Obsidian bridge key into Open Graph preview data and
						an Obsidian open action.
					</p>
				</div>

				<div class={routePanelClass} data-testid="route">
					<p class={routeLabelClass}>Route</p>
					<code class={codeClass}>{bridgeRouteDisplayPath}</code>
				</div>

				<p class={privacyNoticeClass} data-testid="privacy-notice">
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
				<h1 class={invalidTitleClass} data-testid="title" id="invalid-title">
					{invalidTitle}
				</h1>
				<p class={invalidDescriptionClass} data-testid="description">
					{invalidDescription}
				</p>
				<a
					class={overviewLinkClass}
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
				<h1 class={noteTitleClass} data-testid="title" id="note-title">
					{payload.title}
				</h1>
				<p class={descriptionClass} data-testid="summary">
					{payload.summary}
				</p>

				<OpenActions obsidianUri={obsidianUri} />

				<p class={openHelpClass}>
					If Obsidian does not open automatically, use the button above.
				</p>

				<details class={noteDetailsClass} data-testid="note-details">
					<summary class={summaryClass}>Note details</summary>
					<dl class={detailsListClass}>
						<div>
							<dt class={labelClass}>Vault</dt>
							<dd class={detailDescriptionClass} data-testid="vault">
								{payload.vault}
							</dd>
						</div>
						<div>
							<dt class={labelClass}>Path</dt>
							<dd class={detailDescriptionClass} data-testid="path">
								{payload.path}
							</dd>
						</div>
						{payload.sourceUrl === undefined ? null : (
							<div>
								<dt class={labelClass}>Source</dt>
								<dd class={detailDescriptionClass}>
									<a
										class={linkClass}
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
			class={openActionsClass}
			data-testid="open-actions"
			data-obsidian-uri={obsidianUri}
		>
			<a class={openButtonClass} data-testid="open-button" href={obsidianUri}>
				Open in Obsidian
			</a>
			<p class={statusClass} aria-live="polite" data-testid="status">
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
		<main class={crawlerPageClass} data-testid="crawler-bridge">
			<h1 class={crawlerTitleClass} data-testid="title">
				{title}
			</h1>
			<p class={crawlerDescriptionClass} data-testid="description">
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
				<h1 class={invalidTitleClass} id="not-found-title">
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
				<h1 class={invalidTitleClass} id="server-error-title">
					Server Error
				</h1>
			</Panel>
		</PageShell>
	);
}
