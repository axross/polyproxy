import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import type { JSX } from "react";

import { cn } from "@/helpers/class-names";
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

const siteName = "Obsidian Link Bridge";
const invalidTitle = "Invalid Obsidian Link";
const invalidDescription = "This Obsidian bridge link could not be opened.";

const styles = {
  title: cn(
    "text-balance text-[clamp(2rem,8vw,3rem)] font-bold leading-[1.08]",
    "text-[var(--foreground)]",
  ),
  summary: cn("mt-4 text-lg leading-[1.7] text-[var(--muted)]"),
  actions: cn("mt-8"),
  note: cn("mt-4 text-sm leading-[1.6] text-[var(--muted)]"),
  details: cn("mt-6 border-t border-[var(--border)] pt-4"),
  detailsSummary: cn("cursor-pointer font-bold text-[var(--foreground)]"),
  metaList: cn("mt-4 grid gap-3"),
  metaTerm: cn(
    "text-xs font-bold uppercase tracking-[0.06em]",
    "text-[var(--muted)]",
  ),
  metaDescription: cn(
    "min-w-0 font-mono text-sm text-[var(--foreground)]",
    "[overflow-wrap:anywhere]",
  ),
  sourceLink: cn("text-[var(--link)] underline underline-offset-3"),
  invalidTitle: cn(
    "text-[clamp(1.9rem,7vw,2.6rem)] leading-[1.12]",
    "text-[var(--foreground)]",
  ),
  invalidCopy: cn("mt-4 text-base leading-[1.7] text-[var(--muted)]"),
  homeLink: cn(
    "mt-7 inline-flex font-bold text-[var(--link)]",
    "underline underline-offset-3",
  ),
};

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
            className={styles.invalidTitle}
            data-testid="title"
            id="invalid-title"
          >
            {invalidTitle}
          </h1>
          <p className={styles.invalidCopy} data-testid="description">
            {invalidDescription}
          </p>
          <Link
            className={styles.homeLink}
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
        <h1 className={styles.title} data-testid="title" id="note-title">
          {payload.title}
        </h1>
        <p className={styles.summary} data-testid="summary">
          {payload.summary}
        </p>

        <OpenActions className={styles.actions} obsidianUri={obsidianUri} />

        <p className={styles.note}>
          If Obsidian does not open automatically, use the button above.
        </p>

        <details className={styles.details} data-testid="note-details">
          <summary className={styles.detailsSummary}>Note details</summary>
          <dl className={styles.metaList}>
            <div>
              <dt className={styles.metaTerm}>Vault</dt>
              <dd className={styles.metaDescription} data-testid="vault">
                {payload.vault}
              </dd>
            </div>
            <div>
              <dt className={styles.metaTerm}>Path</dt>
              <dd className={styles.metaDescription} data-testid="path">
                {payload.path}
              </dd>
            </div>
            {payload.sourceUrl !== undefined ? (
              <div>
                <dt className={styles.metaTerm}>Source</dt>
                <dd className={styles.metaDescription}>
                  <a
                    className={styles.sourceLink}
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
