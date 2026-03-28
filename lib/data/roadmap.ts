export interface RoadmapItem {
  title: string;
  description?: string;
}

export type RoadmapPhase = "done" | "now" | "next" | "later";

export interface RoadmapSection {
  phase: RoadmapPhase;
  label: string;
  items: RoadmapItem[];
}

export const roadmapSections: RoadmapSection[] = [
  {
    phase: "done",
    label: "Done",
    items: [
      {
        title: "Foundation",
        description: "Stripped to ~150 files, native compositors for every major API",
      },
      {
        title: "Native compositors shipping",
        description: "D3D11, D3D12, Metal, OpenGL, Vulkan",
      },
      {
        title: "Custom OpenXR extensions",
        description: "display_info, window bindings (Win32, Cocoa)",
      },
      {
        title: "Unity plugin with CI and sample scene",
      },
    ],
  },
  {
    phase: "now",
    label: "Now",
    items: [
      {
        title: "Test coverage and conformance",
        description: "M3",
      },
      {
        title: "Extension API stabilization",
        description: "M4",
      },
      {
        title: "Interface standardization",
        description: "Display processor, display spatial model (M5)",
      },
      {
        title: "Improve docs and developer onboarding",
      },
    ],
  },
  {
    phase: "next",
    label: "Next",
    items: [
      {
        title: "Spatial shell",
        description: "Multi-app 3D window management (M6)",
      },
      {
        title: "Multi-display compositing",
        description: "Single machine",
      },
      {
        title: "Expand demos and engine integrations",
      },
      {
        title: "Unreal plugin maturity",
      },
    ],
  },
  {
    phase: "later",
    label: "Later",
    items: [
      {
        title: "Multi-display across networked machines",
      },
      {
        title: "3D capture pipeline",
      },
      {
        title: "Broader ecosystem and standardization",
      },
      {
        title: "Cross-runtime spatial interoperability",
      },
    ],
  },
];
