import type { Status } from "@/lib/data/compatibility";

const statusColors: Record<Status, string> = {
  shipping: "bg-success/15 text-success border-success/30",
  active: "bg-success/15 text-success border-success/30",
  early: "bg-warning/15 text-warning border-warning/30",
  experimental: "bg-warning/15 text-warning border-warning/30",
  planned: "bg-text-secondary/15 text-text-secondary border-text-secondary/30",
};

const statusLabels: Record<Status, string> = {
  shipping: "Shipping",
  active: "Active",
  early: "Early",
  experimental: "Experimental",
  planned: "Planned",
};

const pulseClass: Record<Status, string> = {
  shipping: "badge-pulse badge-pulse-green",
  active: "badge-pulse badge-pulse-green",
  early: "badge-pulse badge-pulse-yellow",
  experimental: "badge-pulse badge-pulse-yellow",
  planned: "",
};

interface BadgeProps {
  status: Status;
}

export function Badge({ status }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[status]} ${pulseClass[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
