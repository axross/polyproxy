import type { Metadata } from "next";
import type { JSX } from "react";

import { cn } from "@/helpers/class-names";

import {
  ObsidianEyebrow,
  ObsidianPage,
  ObsidianSectionPanel,
} from "./_components/page-frame";

const siteName = "Obsidian Link Bridge";
const overviewDescription =
  "HTTPS bridge pages for opening local Obsidian notes from Discord previews.";

const styles = {
  intro: cn("flex flex-col items-start gap-6"),
  introEyebrow: cn("mb-0"),
  title: cn(
    "max-w-[620px] text-balance text-[clamp(2.2rem,8vw,3.6rem)]",
    "font-bold leading-[1.06] text-[var(--foreground)]",
  ),
  description: cn("max-w-[600px] text-lg leading-[1.7] text-[var(--muted)]"),
  routeBox: cn(
    "mt-8 rounded-lg border border-[var(--border)]",
    "bg-[var(--subtle)] p-4",
  ),
  routeLabel: cn(
    "mb-2 text-xs font-bold uppercase tracking-[0.06em]",
    "text-[var(--muted)]",
  ),
  routeCode: cn("font-mono text-[var(--foreground)] [overflow-wrap:anywhere]"),
  notice: cn("mt-4 text-sm leading-[1.6] text-[var(--muted)]"),
};

export const metadata: Metadata = {
  title: siteName,
  description: overviewDescription,
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: siteName,
    description: overviewDescription,
    type: "website",
    siteName,
  },
  twitter: {
    card: "summary",
    title: siteName,
    description: overviewDescription,
  },
};

export default function ObsidianOverviewPage(): JSX.Element {
  return (
    <ObsidianPage>
      <ObsidianSectionPanel
        aria-labelledby="overview-title"
        data-testid="overview"
      >
        <div className={styles.intro}>
          <ObsidianEyebrow className={styles.introEyebrow}>
            {siteName}
          </ObsidianEyebrow>
          <h1
            className={styles.title}
            data-testid="title"
            id="overview-title"
          >
            Open Obsidian notes from Discord links.
          </h1>
          <p className={styles.description} data-testid="description">
            This service turns a Base64url-encoded JSON payload into a normal
            HTTPS page with Open Graph preview data and an Obsidian open action.
          </p>
        </div>

        <div className={styles.routeBox} data-testid="route">
          <p className={styles.routeLabel}>Route</p>
          <code className={styles.routeCode}>/obsidian/BASE64URL_JSON</code>
        </div>

        <p className={styles.notice} data-testid="privacy-notice">
          Base64url is only obfuscation. Do not put sensitive note content in
          bridge URLs.
        </p>
      </ObsidianSectionPanel>
    </ObsidianPage>
  );
}
