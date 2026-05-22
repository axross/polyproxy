import type { Child } from "hono/jsx";

import {
  bridgeRouteDisplayPath,
  bridgeRoutePath,
} from "../helpers/bridge-route";
import type { BridgePayload } from "../helpers/types";
import {
  invalidDescription,
  invalidTitle,
  siteName,
} from "./metadata";

interface ChildrenProps {
  children?: Child;
}

interface PageShellProps extends ChildrenProps {
  testId?: string;
}

function PageShell({
  children,
  testId = "page",
}: PageShellProps) {
  return (
    <main class="page" data-testid={testId}>
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
    <Tag class="panel" aria-labelledby={labelledBy} data-testid={testId}>
      {children}
    </Tag>
  );
}

function Eyebrow({ children }: ChildrenProps) {
  return <p class="eyebrow">{children}</p>;
}

export function OverviewPage() {
  return (
    <PageShell>
      <Panel labelledBy="overview-title" testId="overview">
        <div class="overview-heading">
          <Eyebrow>{siteName}</Eyebrow>
          <h1 class="overview-title" data-testid="title" id="overview-title">
            Proxy Obsidian deeplinks through HTTPS.
          </h1>
          <p class="overview-description" data-testid="description">
            open.axross.dev is a multi-purpose URL proxy server. This route turns
            a Base64url-encoded Obsidian payload into Open Graph preview data and
            an Obsidian open action.
          </p>
        </div>

        <div class="route-panel" data-testid="route">
          <p class="route-label">Route</p>
          <code class="route-code">{bridgeRouteDisplayPath}</code>
        </div>

        <p class="privacy-notice" data-testid="privacy-notice">
          Base64url is only obfuscation. Do not put sensitive note content in
          proxy URLs.
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
        <h1 class="invalid-title" data-testid="title" id="invalid-title">
          {invalidTitle}
        </h1>
        <p class="description" data-testid="description">
          {invalidDescription}
        </p>
        <a
          class="overview-link"
          data-testid="overview-link"
          href={bridgeRoutePath}
        >
          Back to bridge overview
        </a>
      </Panel>
    </PageShell>
  );
}

export function BridgePage({
  obsidianUri,
  payload,
}: BridgePageProps) {
  return (
    <PageShell>
      <Panel labelledBy="note-title" testId="bridge" variant="article">
        <Eyebrow>{siteName}</Eyebrow>
        <h1 class="note-title" data-testid="title" id="note-title">
          {payload.title}
        </h1>
        <p class="summary" data-testid="summary">
          {payload.summary}
        </p>

        <OpenActions obsidianUri={obsidianUri} />

        <p class="open-help">
          If Obsidian does not open automatically, use the button above.
        </p>

        <details class="note-details" data-testid="note-details">
          <summary>Note details</summary>
          <dl>
            <div>
              <dt>Vault</dt>
              <dd data-testid="vault">{payload.vault}</dd>
            </div>
            <div>
              <dt>Path</dt>
              <dd data-testid="path">{payload.path}</dd>
            </div>
            {payload.sourceUrl === undefined ? null : (
              <div>
                <dt>Source</dt>
                <dd>
                  <a
                    class="source-url"
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
      class="open-actions"
      data-testid="open-actions"
      data-obsidian-uri={obsidianUri}
    >
      <a class="open-button" data-testid="open-button" href={obsidianUri}>
        Open in Obsidian
      </a>
      <p class="status" aria-live="polite" data-testid="status">
        Opening Obsidian. If nothing happens, use the button above.
      </p>
      <script dangerouslySetInnerHTML={{ 
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
      }} />
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
    <main data-testid="crawler-bridge">
      <h1 data-testid="title">{title}</h1>
      <p data-testid="description">{description}</p>
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
        <h1 class="invalid-title" id="not-found-title">
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
        <h1 class="invalid-title" id="server-error-title">
          Server Error
        </h1>
      </Panel>
    </PageShell>
  );
}
