"use client";

import type { JSX } from "react";
import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

interface OpenActionsProps {
  className?: string;
  obsidianUri: string;
}

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
    <div
      className={twMerge(
        "flex flex-wrap items-center gap-3",
        "max-sm:flex-col max-sm:items-stretch",
        className,
      )}
      data-testid="open-actions"
    >
      <a
        className={twMerge(
          "inline-flex min-h-11 items-center justify-center rounded-md border px-5",
          "border-[var(--action-border)] bg-[var(--action-background)]",
          "text-center font-bold text-[color:var(--action-foreground)]",
          "transition-colors hover:border-[var(--action-background-hover)]",
          "hover:bg-[var(--action-background-hover)] max-sm:w-full",
        )}
        data-testid="open-button"
        href={obsidianUri}
      >
        Open in Obsidian
      </a>
      <p
        className="min-h-[1.5em] w-full text-sm text-[color:var(--muted)]"
        aria-live="polite"
        data-testid="status"
      >
        Opening Obsidian. If nothing happens, use the button above.
      </p>
    </div>
  );
}
