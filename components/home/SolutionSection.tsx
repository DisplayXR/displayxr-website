import { Card } from "@/components/ui/Card";
import {
  Cpu,
  FileCode2,
  Layers,
  Gamepad2,
  MonitorSpeaker,
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
      "Unity plugin shipping with UPM support. Unreal integration in progress. Standard engine workflows, no custom forks.",
    icon: <Gamepad2 size={20} />,
  },
  {
    title: "Vendor Display Processor",
    description:
      "A clean boundary where vendor-specific processing (weaving, interlacing, calibration) plugs in without touching app code.",
    icon: <MonitorSpeaker size={20} />,
  },
];

export function SolutionSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 md:px-12 py-24">
      <h2 className="text-sm font-medium text-accent uppercase tracking-wider mb-4">
        What DisplayXR Provides
      </h2>
      <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary mb-12 max-w-2xl">
        A practical stack for tracked spatial displays
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <Card key={feature.title} title={feature.title} icon={feature.icon}>
            <p className="text-sm text-text-secondary leading-relaxed">
              {feature.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
