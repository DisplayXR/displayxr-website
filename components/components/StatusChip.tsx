import {
  STATUS_LABELS,
  statusDetail,
  statusOf,
  type ComponentClass,
  type ComponentStatus,
} from "@/lib/data/components";

const chipColors: Record<ComponentStatus, string> = {
  shipped: "bg-success/15 text-success border-success/30",
  "core-merged": "bg-accent/15 text-accent border-accent/30",
  designed: "bg-warning/15 text-warning border-warning/30",
  planned: "bg-text-secondary/15 text-text-secondary border-text-secondary/30",
};

export function StatusChip({ cls }: { cls: ComponentClass }) {
  const s = statusOf(cls);
  return (
    <span
      title={statusDetail(cls)}
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${chipColors[s]}`}
    >
      {STATUS_LABELS[s]}
    </span>
  );
}

/** A small qualifier chip, e.g. "build-verified", with its caveat as a tooltip. */
export function NoteChip({ label, title }: { label: string; title: string }) {
  return (
    <span
      title={title}
      className="inline-flex shrink-0 items-center rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-text-secondary"
    >
      {label}
      <span className="sr-only">: {title}</span>
    </span>
  );
}
