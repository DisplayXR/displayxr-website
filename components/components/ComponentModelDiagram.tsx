import {
  componentClasses,
  statusOf,
  type ComponentStatus,
} from "@/lib/data/components";
import { StatusChip } from "@/components/components/StatusChip";

// The trunk-and-classes picture, built from the same data as the cards so the
// two can never disagree. HTML rather than SVG so it reflows to one column on
// a phone instead of shrinking the text.
const slotBorder: Record<ComponentStatus, string> = {
  shipped: "border-solid border-accent/60",
  "core-merged": "border-dashed border-accent/60",
  designed: "border-dashed border-warning/50 opacity-80",
  planned: "border-dotted border-border opacity-70",
};

const trunkParts = [
  ["OpenXR state tracker", "XR_DXR_* extensions"],
  ["Native compositors", "D3D11 · D3D12 · Vulkan · Metal · OpenGL"],
  ["Service + IPC", "arbitration · scheduling · policy"],
  ["Loaders", "ABI gate · selection · readiness"],
  ["CLI + Dashboard", "list every component by role"],
];

export function ComponentModelDiagram() {
  return (
    <figure
      aria-label="Apps talk only to OpenXR and the XR_DXR extensions. Underneath, the DisplayXR runtime is one trunk, and four component classes plug into it: display processors, input providers, conversion providers and viewer-tracking providers."
      className="rounded-lg border border-border bg-surface/40 p-4 md:p-6"
    >
      {/* Apps */}
      <div className="rounded-md border border-border bg-surface px-4 py-3 text-center">
        <div className="text-sm font-semibold text-text-primary">Apps</div>
        <div className="mt-0.5 font-mono text-[11px] text-text-secondary">
          native OpenXR · Unity · Unreal · DisplayXR Browser
        </div>
        <div className="mt-1 text-xs text-text-secondary">
          see only OpenXR and the <span className="font-mono">XR_DXR_*</span> extensions
        </div>
      </div>
      <div aria-hidden className="mx-auto h-5 w-px bg-border" />

      {/* Trunk */}
      <div className="rounded-md border-[1.5px] border-text-primary/70 bg-surface p-4">
        <div className="mb-3 text-center font-display text-lg text-text-primary">
          DisplayXR runtime: the trunk nobody forks
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {trunkParts.map(([label, mono]) => (
            <div key={label} className="rounded bg-accent/10 px-3 py-2">
              <div className="text-[13px] font-medium text-text-primary">{label}</div>
              <div className="font-mono text-[11px] leading-snug text-text-secondary">{mono}</div>
            </div>
          ))}
        </div>
      </div>
      <div aria-hidden className="mx-auto h-5 w-px bg-border" />

      {/* Component classes */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {componentClasses.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className={`block rounded-md border-[1.5px] bg-surface p-3 transition-colors hover:bg-surface-hover ${slotBorder[statusOf(c)]}`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-semibold text-text-primary">{c.name}</span>
              <StatusChip cls={c} />
            </div>
            <div className="mt-1 text-xs text-text-secondary">{c.owns}</div>
            <div className="mt-2 font-mono text-[11px] text-text-secondary">
              {c.symbol ? `${c.symbol} · ABI ${c.abi}` : "contract in design"}
            </div>
          </a>
        ))}
      </div>

      <figcaption className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-text-secondary">
        <span className="flex items-center gap-2">
          <span aria-hidden className="inline-block w-5 border-t-[1.5px] border-solid border-accent/70" />
          shipped
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="inline-block w-5 border-t-[1.5px] border-dashed border-warning/70" />
          designed, no code yet
        </span>
        <span>Each class has its own entry point, ABI version and discovery root.</span>
      </figcaption>
    </figure>
  );
}
