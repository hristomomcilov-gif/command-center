import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/icons";

export function BackLink({ href = "/", label = "Home" }: { href?: string; label?: string }) {
  return (
    <Link href={href} className="back">
      <Icon name="chevron" />
      {label}
    </Link>
  );
}

export function QuietPage({
  kicker,
  title,
  lede,
  backHref,
  backLabel,
  children,
}: {
  kicker?: string;
  title: string;
  lede?: string;
  backHref?: string;
  backLabel?: string;
  children?: ReactNode;
}) {
  return (
    <article className="quiet">
      {backHref ? <BackLink href={backHref} label={backLabel} /> : null}
      {kicker ? <p className="quiet-kicker">{kicker}</p> : null}
      <h1>{title}</h1>
      {lede ? <p className="lede">{lede}</p> : null}
      {children}
    </article>
  );
}
