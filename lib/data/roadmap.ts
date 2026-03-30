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
        title: "Monado fork focused on spatial displays",
        description:
          "Forked from the Monado OpenXR runtime, removed VR and headset-specific code, and refocused the codebase entirely on tracked glasses-free 3D displays",
      },
      {
        title: "Native compositors for every major graphics API",
        description:
          "Dedicated compositor implementations for D3D11, D3D12, Metal, OpenGL, and Vulkan — no cross-API translation layer required",
      },
      {
        title: "Custom OpenXR extensions",
        description:
          "Extensions for querying spatial display geometry and binding compositor output to application windows on both Windows and macOS",
      },
      {
        title: "Unity plugin with sample scene",
        description:
          "UPM package for Unity with a working sample scene to get started quickly",
      },
      {
        title: "Standard OpenXR app compatibility",
        description:
          "Apps built against the standard OpenXR API work with DisplayXR without modification",
      },
    ],
  },
  {
    phase: "now",
    label: "Now",
    items: [
      {
        title: "Runtime test coverage",
        description:
          "Expanding automated tests across compositors and session lifecycle",
      },
      {
        title: "Extension API stabilization",
        description:
          "Finalizing extension interfaces so developers can build against stable APIs",
      },
      {
        title: "Display processor interface",
        description:
          "Standardizing how vendor-specific display processing plugs into the runtime",
      },
      {
        title: "Docs and developer onboarding",
      },
    ],
  },
  {
    phase: "next",
    label: "Next",
    items: [
      {
        title: "Multi-app compositing in the runtime",
        description:
          "Open-source runtime support for compositing multiple applications into a single spatial scene on one display",
      },
      {
        title: "Spatial desktop shell",
        description:
          "A closed-source 3D window manager built on top of the open runtime — manages window layout, focus, and app lifecycle",
      },
      {
        title: "2D app support",
        description:
          "Run standard desktop applications as flat panels in 3D space via OS window capture",
      },
      {
        title: "3D screenshot",
        description:
          "Capture spatial content before display-specific processing",
      },
      {
        title: "Expand demos and engine integrations",
      },
      {
        title: "Unreal Engine plugin",
      },
    ],
  },
  {
    phase: "later",
    label: "Later",
    items: [
      {
        title: "3D capture pipeline",
        description:
          "Session recording, spatial replay, and dataset generation from live spatial content",
      },
      {
        title: "Multi-display workspaces",
        description:
          "Extend the spatial desktop across multiple tracked displays, starting with a single machine",
      },
      {
        title: "Broader ecosystem and standardization",
      },
    ],
  },
];
