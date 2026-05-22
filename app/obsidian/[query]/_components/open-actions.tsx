"use client";

import type { JSX } from "react";
import { useEffect, useRef } from "react";

import { cn } from "@/helpers/class-names";

interface OpenActionsProps {
  className?: string;
  obsidianUri: string;
}

const styles = {
  actions: cn(
    "flex flex-wrap items-center gap-3",
    "max-sm:flex-col max-sm:items-stretch",
  ),
  primaryAction: cn(
    "inline-flex min-h-11 items-center justify-center rounded-md border",
    "border-[var(--foreground)] bg-[var(--foreground)] px-4.5",
    "font-bold text-[var(--surface)]",
  ),
  status: cn("min-h-[1.5em] w-full text-sm text-[var(--muted)]"),
};

export function OpenActions({
  className,
  obsidianUri,
}: OpenActionsProps): JSX.Element {
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) {
      return;
    }

    hasRedirected.current = true;
    window.location.assign(obsidianUri);
  }, [obsidianUri]);

  return (
    <div className={cn(styles.actions, className)} data-testid="open-actions">
      <a
        className={styles.primaryAction}
        data-testid="open-button"
        href={obsidianUri}
      >
        Open in Obsidian
      </a>
      <p className={styles.status} aria-live="polite" data-testid="status">
        Opening Obsidian. If nothing happens, use the button above.
      </p>
    </div>
  );
}
