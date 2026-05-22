import type { ComponentProps, JSX } from "react";

import { cn } from "@/helpers/class-names";

interface DataTestIdProp {
  "data-testid"?: string;
}

const pageClassName = cn(
  "flex min-h-full items-center justify-center px-5 py-12",
  "[background:var(--page-background)]",
  "max-sm:items-stretch max-sm:px-3.5 max-sm:py-6",
);

const panelClassName = cn(
  "w-[min(100%,760px)] rounded-lg border border-[var(--border)]",
  "bg-[var(--surface)] p-10 shadow-[0_24px_80px_rgba(20,25,36,0.08)]",
  "max-sm:p-7 max-sm:px-5",
);

const eyebrowClassName = cn(
  "mb-3.5 text-xs font-bold uppercase tracking-[0.08em]",
  "text-[var(--muted)]",
);

export function ObsidianPage({
  className,
  "data-testid": dataTestId = "page",
  ...props
}: ComponentProps<"main"> & DataTestIdProp): JSX.Element {
  return (
    <main
      className={cn(pageClassName, className)}
      data-testid={dataTestId}
      {...props}
    />
  );
}

export function ObsidianSectionPanel({
  className,
  ...props
}: ComponentProps<"section"> & DataTestIdProp): JSX.Element {
  return <section className={cn(panelClassName, className)} {...props} />;
}

export function ObsidianArticlePanel({
  className,
  ...props
}: ComponentProps<"article"> & DataTestIdProp): JSX.Element {
  return <article className={cn(panelClassName, className)} {...props} />;
}

export function ObsidianEyebrow({
  className,
  ...props
}: ComponentProps<"p">): JSX.Element {
  return <p className={cn(eyebrowClassName, className)} {...props} />;
}
