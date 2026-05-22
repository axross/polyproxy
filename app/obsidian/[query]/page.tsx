import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import type { JSX } from "react";

import { isBotUserAgent } from "@/helpers/bot-detection";
import { buildBridgeUrl, getConfiguredBaseUrl } from "@/helpers/bridge-url";
import { decodeBridgeQuerySafe } from "@/helpers/decode-link";
import { buildObsidianUri } from "@/helpers/obsidian-uri";
import type { BridgePayload } from "@/helpers/types";

import {
  ObsidianArticlePanel,
  ObsidianEyebrow,
  ObsidianPage,
  ObsidianSectionPanel,
} from "../_components/page-frame";
import { OpenActions } from "./_components/open-actions";
import type { PageProps } from "./page-props";

const siteName = "open.axross.dev";
const invalidTitle = "Invalid Obsidian Proxy Link";
const invalidDescription = "This Obsidian proxy link could not be opened.";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { query } = await params;
  const result = decodeBridgeQuerySafe(query);

  if (!result.ok) {
    return buildMetadata({
      title: invalidTitle,
      description: invalidDescription,
      type: "website",
    });
  }

  const payload = result.value;
  const url = getCanonicalUrl(payload);

  return buildMetadata({
    title: payload.title,
    description: payload.summary,
    type: "article",
    url,
  });
}

export default async function ObsidianBridgePage({
  params,
}: PageProps): Promise<JSX.Element> {
  const { query } = await params;
  const userAgent = (await headers()).get("user-agent") ?? "";
  const isBot = isBotUserAgent(userAgent);
  const result = decodeBridgeQuerySafe(query);

  if (!result.ok) {
    if (isBot) {
      return (
        <CrawlerBridgeHtml
          title={invalidTitle}
          description={invalidDescription}
        />
      );
    }

    return (
      <ObsidianPage>
        <ObsidianSectionPanel
          aria-labelledby="invalid-title"
          data-testid="invalid-bridge"
        >
          <ObsidianEyebrow>{siteName}</ObsidianEyebrow>
          <h1
            className="text-[clamp(1.9rem,7vw,2.6rem)] leading-[1.12] text-[color:var(--foreground)]"
            data-testid="title"
            id="invalid-title"
          >
            {invalidTitle}
          </h1>
          <p
            className="mt-4 text-base leading-[1.7] text-[color:var(--muted)]"
            data-testid="description"
          >
            {invalidDescription}
          </p>
          <Link
            className="mt-7 inline-flex font-bold text-[color:var(--link)] underline underline-offset-3"
            data-testid="overview-link"
            href="/obsidian"
          >
            Back to bridge overview
          </Link>
        </ObsidianSectionPanel>
      </ObsidianPage>
    );
  }

  const payload = result.value;
  const obsidianUri = buildObsidianUri(payload);

  if (isBot) {
    return (
      <CrawlerBridgeHtml title={payload.title} description={payload.summary} />
    );
  }

  return (
    <ObsidianPage>
      <ObsidianArticlePanel aria-labelledby="note-title" data-testid="bridge">
        <ObsidianEyebrow>{siteName}</ObsidianEyebrow>
        <h1
          className="text-balance text-[clamp(2rem,8vw,3rem)] font-bold leading-[1.08] text-[color:var(--foreground)]"
          data-testid="title"
          id="note-title"
        >
          {payload.title}
        </h1>
        <p
          className="mt-4 text-lg leading-[1.7] text-[color:var(--muted)]"
          data-testid="summary"
        >
          {payload.summary}
        </p>

        <OpenActions className="mt-8" obsidianUri={obsidianUri} />

        <p className="mt-4 text-sm leading-[1.6] text-[color:var(--muted)]">
          If Obsidian does not open automatically, use the button above.
        </p>

        <details
          className="mt-6 border-t border-[var(--border)] pt-4"
          data-testid="note-details"
        >
          <summary className="cursor-pointer font-bold text-[color:var(--foreground)]">
            Note details
          </summary>
          <dl className="mt-4 grid gap-3">
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.06em] text-[color:var(--muted)]">
                Vault
              </dt>
              <dd
                className="min-w-0 font-mono text-sm text-[color:var(--foreground)] [overflow-wrap:anywhere]"
                data-testid="vault"
              >
                {payload.vault}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.06em] text-[color:var(--muted)]">
                Path
              </dt>
              <dd
                className="min-w-0 font-mono text-sm text-[color:var(--foreground)] [overflow-wrap:anywhere]"
                data-testid="path"
              >
                {payload.path}
              </dd>
            </div>
            {payload.sourceUrl !== undefined ? (
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.06em] text-[color:var(--muted)]">
                  Source
                </dt>
                <dd className="min-w-0 font-mono text-sm text-[color:var(--foreground)] [overflow-wrap:anywhere]">
                  <a
                    className="text-[color:var(--link)] underline underline-offset-3"
                    data-testid="source-url"
                    href={payload.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {payload.sourceUrl}
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        </details>
      </ObsidianArticlePanel>
    </ObsidianPage>
  );
}

function CrawlerBridgeHtml({
  title,
  description,
}: CrawlerBridgeHtmlProps): JSX.Element {
  return (
    <main data-testid="crawler-bridge">
      <h1 data-testid="title">{title}</h1>
      <p data-testid="description">{description}</p>
    </main>
  );
}

interface CrawlerBridgeHtmlProps {
  title: string;
  description: string;
}

function buildMetadata({
  title,
  description,
  type,
  url,
}: BuildMetadataInput): Metadata {
  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    openGraph: {
      title,
      description,
      type,
      siteName,
      url,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

interface BuildMetadataInput {
  title: string;
  description: string;
  type: "article" | "website";
  url?: string;
}

function getCanonicalUrl(payload: BridgePayload): string | undefined {
  try {
    return buildBridgeUrl(getConfiguredBaseUrl(), payload);
  } catch {
    return undefined;
  }
}
