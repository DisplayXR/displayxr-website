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
          "Extensions for querying spatial display geometry, rendering modes, eye tracking, and binding compositor output to application windows across Windows, macOS, and Android",
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
          "XR_DXR_spatial_workspace and XR_DXR_app_launcher headers shipped, controller registration via Windows registry contract, and the reference shell now ships separately as its own installer. Any third-party (OEM, vertical, kiosk, AI-agent driver) can ship a workspace controller with the same first-class authority",
      },
      {
        title: "Multi-compositor performance pass",
        description:
          "Cross-process D3D11 fence to move sync off the render thread, capture-thread as the sole workspace-render driver (3.2× per-cube fps), and vendor 3D-state poll caching (37→59 fps per cube to hit 60Hz P0)",
      },
      {
        title: "Standalone demo apps",
        description:
          "A growing family of demos ships from their own repositories — a real-time Gaussian-splat viewer, a glTF 2.0 PBR model viewer, a spatial media player for photos, video, and Leia Image Format pictures, a transparent click-through 3D avatar that floats over the desktop, and a streaming 3D city viewer on Google Photorealistic 3D Tiles",
      },
      {
        title: "Truthful per-mode eye tracking",
        description:
          "Rendering modes now declare whether they consume live eye tracking, isTracking reports the real tracker state end-to-end (including out-of-process apps), and apps get an edge-triggered event on tracking loss/recovery — shipped as a coordinated runtime + Leia plug-in release",
      },
      {
        title: "Android runtime",
        description:
          "The same OpenXR runtime now ships on Android, driving integrated 3D tablets and handhelds (ZTE Nubia Pad 2, Red Magic Explorer 3D) through the native Vulkan compositor. The vendor display processor runs out-of-process with a zero-copy buffer handoff, rendering is orientation-aware across portrait and landscape, and mixed 2D/3D display zones, per-mode eye tracking, and see-through transparency all carry over from the desktop. Model-viewer and media-player demos ship Android builds",
      },
      {
        title: "Extensions under the DXR vendor author tag",
        description:
          "All fourteen DisplayXR extensions renamed from the provisional XR_EXT_* naming to XR_DXR_*, under the project's vendor author tag (officially registered with Khronos, July 2026), and shipped as a coordinated v2.0.0 release train — runtime, shell, vendor plug-in, engine plugins, demos, and meta-installer moving together. Apps built against the old names keep working on runtimes before v2.0.0 or rebuild against the v2.0.0 headers; migration is one command (scripts/dxr_rename.py in the runtime repo)",
      },
    ],
  },
  {
    phase: "now",
    label: "Now",
    items: [
      {
        title: "Linux runtime (Preview)",
        description:
          "A fourth platform: the same OpenXR runtime now brings up a native Vulkan compositor over an X11/XCB surface, with apps binding their own window through XR_DXR_xlib_window_binding. Hardware-validated on real spatial-display hardware — the stereo cube and all five demos render, and a real vendor Vulkan weave lights the panel's lens. It ships today as a user-level tarball across Ubuntu 22.04/24.04/26.04; not yet GA (no installer), with the deployment target and windowed-3D phasing still in flight",
      },
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
        title: "DisplayXR Browser (developer preview)",
        description:
          "A Chromium-based browser that renders the web normally and weaves glasses-free inline 3D on DisplayXR hardware, built on the runtime's window-bound weave service. The weave is GPU-resident — no per-frame CPU readback — and inline-3D web samples plus a JS helper library ship alongside it. Developer-preview packaging is in flight",
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
