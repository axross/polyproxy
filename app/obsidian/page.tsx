import type { Metadata } from "next";
import type { JSX } from "react";

import {
  ObsidianEyebrow,
  ObsidianPage,
  ObsidianSectionPanel,
} from "./_components/page-frame";

const siteName = "open.axross.dev";
const overviewDescription =
  "Multi-purpose URL proxy server with an Obsidian deeplink bridge.";

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
        <div className="flex flex-col items-start gap-6">
          <ObsidianEyebrow className="mb-0">
            {siteName}
          </ObsidianEyebrow>
          <h1
            className="max-w-[620px] text-balance text-[clamp(2.2rem,8vw,3.6rem)] font-bold leading-[1.06] text-[color:var(--foreground)]"
            data-testid="title"
            id="overview-title"
          >
            Proxy Obsidian deeplinks through HTTPS.
          </h1>
          <p
            className="max-w-[600px] text-lg leading-[1.7] text-[color:var(--muted)]"
            data-testid="description"
          >
            open.axross.dev is a multi-purpose URL proxy server. This route
            turns a Base64url-encoded Obsidian payload into Open Graph preview
            data and an Obsidian open action.
          </p>
        </div>

        <div
          className="mt-8 rounded-lg border border-[var(--border)] bg-[var(--subtle)] p-4"
          data-testid="route"
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.06em] text-[color:var(--muted)]">
            Route
          </p>
          <code className="font-mono text-[color:var(--foreground)] [overflow-wrap:anywhere]">
            /obsidian/BASE64URL_JSON
          </code>
        </div>

        <p
          className="mt-4 text-sm leading-[1.6] text-[color:var(--muted)]"
          data-testid="privacy-notice"
        >
          Base64url is only obfuscation. Do not put sensitive note content in
          proxy URLs.
        </p>
      </ObsidianSectionPanel>
    </ObsidianPage>
  );
}
