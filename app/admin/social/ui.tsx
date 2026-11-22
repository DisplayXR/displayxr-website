import Link from "next/link";
import type { Check, PostStatus } from "@/lib/social/types";
import { STATUS_LABEL } from "@/lib/social/types";

export function SocialNav({ active }: { active: "queue" | "how" }) {
  const tab = (href: string, label: string, on: boolean) => (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-md text-sm ${on ? "bg-surface-hover text-text-primary" : "text-text-secondary hover:text-text-primary"}`}
    >
      {label}
    </Link>
  );
  return (
    <nav className="flex items-center gap-1 border-b border-border pb-3 mb-8" aria-label="Social board">
      <Link href="/admin" className="text-sm text-text-secondary hover:text-text-primary mr-3">
        ← Admin
      </Link>
      {tab("/admin/social", "Social queue", active === "queue")}
      {tab("/admin/social/how", "How it works", active === "how")}
      <span className="px-3 py-1.5 text-sm text-text-secondary/60" title="Later">Listening</span>
      <span className="px-3 py-1.5 text-sm text-text-secondary/60" title="Later">Results</span>
    </nav>
  );
}

const PILL: Record<PostStatus, string> = {
  drafted: "border-border text-text-secondary",
  needs_review: "border-warning/40 text-warning",
  changes_requested: "border-orange-400/40 text-orange-300",
  approved: "border-accent/40 text-accent",
  scheduled: "border-accent/40 text-accent-hover",
  posted: "border-success/40 text-success",
  dropped: "border-border text-text-secondary line-through",
};

export function StatusPill({ status }: { status: PostStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${PILL[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function CheckBadge({ c }: { c: Check }) {
  const tone =
    c.result === "pass" ? "text-success" : c.result === "note" ? "text-warning" : "text-red-400";
  const mark = c.result === "pass" ? "✓" : c.result === "note" ? "!" : "✕";
  return (
    <li className="flex items-baseline gap-2 text-sm">
      <span className={`${tone} font-mono w-4`} aria-hidden="true">{mark}</span>
      <span className="text-text-primary">{c.name}</span>
      <span className="sr-only">{c.result}</span>
      {c.detail && <span className="text-text-secondary">· {c.detail}</span>}
    </li>
  );
}

export function Banner({ tone, children }: { tone: "warn" | "info" | "err" | "ok"; children: React.ReactNode }) {
  const cls = {
    warn: "border-warning/40 bg-warning/10 text-warning",
    info: "border-accent/40 bg-accent/10 text-accent-hover",
    err: "border-red-500/40 bg-red-500/10 text-red-300",
    ok: "border-success/40 bg-success/10 text-success",
  }[tone];
  return <div role="status" className={`mb-6 rounded-lg border px-4 py-3 text-sm ${cls}`}>{children}</div>;
}
