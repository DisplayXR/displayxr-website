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
          "Forked from the Monado OpenXR runtime, removed VR and headset-specific code, and refocused the codebase entirely on spatial displays",
      },
      {
        title: "Native compositors for every major graphics API",
        description:
          "Dedicated compositor implementations for D3D11, D3D12, Metal, OpenGL, and Vulkan — no cross-API translation layer required",
      },
      {
        title: "Custom OpenXR extensions",
        description:
          "Extensions for querying spatial display geometry, rendering modes, eye tracking, and binding compositor output to application windows on both Windows and macOS",
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
      {
        title: "Multi-app compositing",
        description:
          "Runtime support for compositing multiple applications into a single spatial scene — D3D11, D3D12, Vulkan, and OpenGL apps running simultaneously",
      },
      {
        title: "Spatial desktop shell",
        description:
          "A 3D window manager built on the runtime — spatial windowing, window chrome, layout presets, Z-depth, rotation, persistence, and 8 layout modes including Theater, Carousel, and Expose",
      },
      {
        title: "2D app support",
        description:
          "Standard desktop applications captured as flat panels in 3D space via Windows.Graphics.Capture, with auto-adoption of visible windows and head-tracked parallax",
      },
      {
        title: "Focus-adaptive rendering",
        description:
          "Display automatically switches between 2D and 3D mode based on the focused app type — 2D apps get full-resolution flat rendering, 3D apps get stereo with interlacing",
      },
    ],
  },
  {
    phase: "now",
    label: "Now",
    items: [
      {
        title: "Shell input forwarding",
        description:
          "Keyboard and mouse input forwarding to captured 2D windows, including modern WinUI/XAML apps",
      },
      {
        title: "Graceful exit and app lifecycle",
        description:
          "Restore captured windows to original desktop positions on shell exit, with seamless transition between standalone and shell modes",
      },
      {
        title: "App launcher and system tray",
        description:
          "Launch new apps from within the spatial environment, with registered apps config and system tray integration",
      },
    ],
  },
  {
    phase: "next",
    label: "Next",
    items: [
      {
        title: "3D screenshot and capture",
        description:
          "Capture spatial content before display-specific processing",
      },
      {
        title: "macOS spatial shell",
        description:
          "Port the multi-compositor and shell to macOS via Metal",
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
