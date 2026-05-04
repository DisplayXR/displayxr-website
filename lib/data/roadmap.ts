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
        title: "Unreal Engine plugin (beta)",
        description:
          "Initial release of the Unreal plugin for UE 5.3+ on Windows, macOS, and Android — eye-tracked Kooima stereo, camera- and display-centric rigs, Blueprint components, material expressions, and zero-copy atlas handoff",
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
      {
        title: "App launcher, graceful exit, and lifecycle",
        description:
          "Spatial app launcher with 3D icon tiles, system tray integration, registered apps config. Graceful exit restores captured windows to original desktop positions",
      },
      {
        title: "3D screenshot and capture",
        description:
          "Capture stereo atlas frames via hotkey (Ctrl+Shift+C) or IPC — full-resolution SBS output before display-specific processing, with JSON sidecar metadata",
      },
      {
        title: "AI-native runtime control (MCP)",
        description:
          "Live spatial state and control exposed to AI agents over the Model Context Protocol — introspect stereo projection, capture frames, arrange windows in 6-DOF, save/load workspaces, all via natural language. Framework extracted to displayxr-mcp (May 2026) so the runtime, the reference shell, and any third-party workspace controller can embed the same agent surface",
      },
      {
        title: "WebXR Bridge",
        description:
          "Chrome extension plus local bridge giving browser WebXR apps the full DisplayXR surface — display info, rendering mode switching, tracked eye poses, HUD overlay, and input forwarding. Ships with a three.js reference sample and a standalone minimal starter; falls back gracefully to standard WebXR when the extension isn't installed",
      },
      {
        title: "Workspace controller surface",
        description:
          "XR_EXT_spatial_workspace and XR_EXT_app_launcher headers shipped, controller registration via Windows registry contract, shell extracted to its own repo as the reference implementation. Any third-party (OEM, vertical, kiosk, AI-agent driver) can ship a workspace controller with the same first-class authority",
      },
      {
        title: "Multi-compositor performance pass",
        description:
          "Cross-process D3D11 fence to move sync off the render thread, capture-thread as the sole workspace-render driver (3.2× per-cube fps), and vendor 3D-state poll caching (37→59 fps per cube to hit 60Hz P0)",
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
        title: "macOS spatial shell",
        description:
          "Port the multi-compositor and shell to macOS via Metal",
      },
      {
        title: "Expand demos and engine integrations",
      },
    ],
  },
  {
    phase: "next",
    label: "Next",
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
    ],
  },
  {
    phase: "later",
    label: "Later",
    items: [
      {
        title: "Broader ecosystem and standardization",
      },
    ],
  },
];
