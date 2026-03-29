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
        description:
          "Stripped to ~150 files, native compositors for every major API",
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
      {
        title: "Universal app model",
        description:
          "Any OpenXR handle app works standalone and in the shell with zero code changes",
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
        title: "Spatial desktop platform — Phase 1",
        description:
          "Platform-native multi-compositor, cross-app spatial compositing, shell scene graph, basic shell chrome",
      },
      {
        title: "2D app support",
        description:
          "Non-OpenXR apps captured as spatial panels via OS window capture",
      },
      {
        title: "3D screenshot",
        description:
          "Capture spatial content before display-specific processing",
      },
      {
        title: "Spatial desktop platform — Phase 2",
        description:
          "Layout presets, persistence, app launcher, task switching, recording, input routing",
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
        title: "3D capture pipeline",
        description: "Session capture, dataset mode, spatial replay",
      },
      {
        title: "Multi-display compositing",
        description:
          "Single machine first, then networked multi-display unified workspaces",
      },
      {
        title: "Broader ecosystem and standardization",
      },
    ],
  },
];
