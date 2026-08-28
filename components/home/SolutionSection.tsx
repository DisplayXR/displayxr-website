import { Card } from "@/components/ui/Card";
import { AnimateIn } from "@/components/ui/AnimateIn";
import {
  Cpu,
  FileCode2,
  Layers,
  Gamepad2,
  MonitorSpeaker,
  AppWindow,
} from "lucide-react";

const features = [
  {
    title: "Runtime",
    description:
      "A full OpenXR runtime with native compositors for every major graphics API — no interop layers required.",
    icon: <Cpu size={20} />,
  },
  {
    title: "Extension Specs",
    description:
      "Custom OpenXR extensions for display info, window bindings, and spatial display capabilities not covered by standard OpenXR.",
    icon: <FileCode2 size={20} />,
  },
  {
    title: "Native Compositors",
    description:
      "Per-graphics-API compositors (D3D11, D3D12, Vulkan, Metal, OpenGL) that avoid cross-API translation overhead.",
    icon: <Layers size={20} />,
  },
  {
    title: "Engine Integrations",
    description:
      "Unity plugin shipping with UPM support. Unreal plugin in beta (UE 5.7). Standard engine workflows, no custom forks.",
    icon: <Gamepad2 size={20} />,
  },
  {
    title: "Vendor Plug-ins",
    description:
      "Two independent plug-in types, discovered at startup, neither touching app code: a display processor for vendor-specific weaving, interlacing and calibration, and an input provider that surfaces tracked motion controllers, hands, or trackers into the standard OpenXR action system.",
    icon: <MonitorSpeaker size={20} />,
  },
  {
    title: "Workspace Extensions",
    description:
      "XR_DXR_spatial_workspace + *.displayxr.json launcher manifests — a documented surface for swappable workspace controllers that compose multi-app 3D layouts, drive window placement, and surface launcher tiles. The DisplayXR Shell is the reference; OEMs, vertical integrators, kiosks, and AI-agent drivers can ship their own.",
    icon: <AppWindow size={20} />,
  },
];

// Claims a sceptical reader can check, as opposed to adjectives. Each one is
// asserted somewhere mechanical — a CI job, a link line, a driver that ships.
const receipts = [
  {
    stat: "Zero",
    label: "vendor identifiers in the shipped runtime",
    body: "Neutrality is enforced in the binary, not promised in a policy document. The compositor never weaves; the display processor always does, behind a plug-in ABI — and CI fails any change that puts a vendor symbol in the runtime's link line.",
  },
  {
    stat: "Every release",
    label: "runs the official Khronos OpenXR CTS",
    body: "The conformance suite runs on pull requests as a smoke subset, and the full non-interactive suite nightly and on every release tag — hardware-free, against the simulated display.",
  },
  {
    stat: "No hardware",
    label: "required to build for a spatial display",
    body: "The runtime ships a simulated tracked panel in an ordinary 2D window, with the viewer's eye position on the mouse and keyboard. It is the same driver the conformance suite runs against.",
  },
];

export function SolutionSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 md:px-12 py-24">
      <div className="section-divider mb-24" />
      <AnimateIn>
        <h2 className="text-sm font-medium text-accent uppercase tracking-wider mb-4">
          What DisplayXR Provides
        </h2>
        <h3 className="text-3xl md:text-4xl font-display tracking-tight text-text-primary mb-12 max-w-2xl">
          A practical stack for tracked spatial displays
        </h3>
      </AnimateIn>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, i) => (
          <AnimateIn key={feature.title} delay={i * 80}>
            <Card title={feature.title} icon={feature.icon}>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </Card>
          </AnimateIn>
        ))}
      </div>

      {/* The receipts. Deliberately below the capability grid: the cards say
          what the stack is, these say why any of it is checkable. */}
      <AnimateIn delay={240}>
        <div className="mt-16 border-t border-border pt-10">
          <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-8">
            Things you can check
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {receipts.map((r) => (
              <div key={r.label}>
                <p className="text-2xl font-display tracking-tight text-text-primary leading-tight">
                  {r.stat}
                </p>
                <p className="text-sm font-medium text-accent mt-1 mb-3">
                  {r.label}
                </p>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {r.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </AnimateIn>
    </section>
  );
}
