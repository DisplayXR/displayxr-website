import type { AppVerification } from "@/lib/data/compatibility";

// Quieter than Badge on purpose: nothing here is released, so no pulse, and
// the border style (solid, dashed, dotted) carries the status as well as the
// color, matching the component-model diagram.
const chipStyles: Record<AppVerification, string> = {
  "seated-verified": "border-solid bg-success/10 text-success border-success/30",
  "sim-verified": "border-dashed bg-accent/10 text-accent border-accent/40",
  proposed: "border-dotted text-text-secondary border-text-secondary/50",
};

export const VERIFICATION_LABELS: Record<AppVerification, string> = {
  "seated-verified": "Seated-verified",
  "sim-verified": "Sim-verified",
  proposed: "Proposed",
};

export const VERIFICATION_DEFINITIONS: Record<AppVerification, string> = {
  "seated-verified": "A person checked the 3D, seated at a spatial display.",
  "sim-verified": "Runs against the simulated display, sim_display; the seated check is still to come.",
  proposed: "Described in a public proposal; not yet verified on the released runtime.",
};

export function VerificationChip({ status }: { status: AppVerification }) {
  return (
    <span
      title={VERIFICATION_DEFINITIONS[status]}
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${chipStyles[status]}`}
    >
      {VERIFICATION_LABELS[status]}
    </span>
  );
}
