import type { Status } from "./compatibility";

export interface EcosystemRepo {
  name: string;
  repo: string;
  description: string;
  url: string;
  category: "core" | "engines" | "tools" | "demos" | "apps";
  status?: Status;
}

export const ecosystemRepos: EcosystemRepo[] = [
  {
    name: "displayxr-runtime",
    repo: "DisplayXR/displayxr-runtime",
    description:
      "Core OpenXR runtime with native compositors for D3D11, D3D12, Vulkan, Metal, and OpenGL — on Windows, macOS, and Android, plus a Vulkan-only compositor on desktop Linux (Preview, shipping as .deb packages).",
    url: "https://github.com/DisplayXR/displayxr-runtime",
    category: "core",
  },
  {
    name: "displayxr-extensions",
    repo: "DisplayXR/displayxr-extensions",
    description:
      "OpenXR extension specs and headers for tracked spatial display capabilities.",
    url: "https://github.com/DisplayXR/displayxr-extensions",
    category: "core",
  },
  {
    name: "displayxr-unity",
    repo: "DisplayXR/displayxr-unity",
    description:
      "Unity engine plugin (UPM package) with eye-tracked stereo rendering, sample scenes, and standalone editor preview.",
    url: "https://github.com/DisplayXR/displayxr-unity",
    category: "engines",
    status: "active",
  },
  {
    name: "displayxr-unity-samples",
    repo: "DisplayXR/displayxr-unity-samples",
    description:
      "Ready-to-open Unity sample projects — Built-in/URP/HDRP pipeline tests plus a transparent Desktop Avatar showcase — wired to the DisplayXR Unity plugin, with one shared installer. Consolidates the earlier per-feature test repos into a single monorepo.",
    url: "https://github.com/DisplayXR/displayxr-unity-samples",
    category: "engines",
    status: "active",
  },
  {
    name: "displayxr-unreal",
    repo: "DisplayXR/displayxr-unreal",
    description:
      "Unreal Engine plugin (UE 5.7) with eye-tracked Kooima stereo, camera- and display-centric rigs, Blueprint components, material expression nodes, and zero-copy atlas handoff. Windows, macOS, Android.",
    url: "https://github.com/DisplayXR/displayxr-unreal",
    category: "engines",
    status: "beta",
  },
  {
    name: "displayxr-demo-gaussiansplat",
    repo: "DisplayXR/displayxr-demo-gaussiansplat",
    description:
      "Real-time 3D Gaussian Splatting viewer (.spz / .ply) for spatial displays. Windows, macOS, Linux, Android.",
    url: "https://github.com/DisplayXR/displayxr-demo-gaussiansplat",
    category: "demos",
    status: "active",
  },
  {
    name: "displayxr-demo-modelviewer",
    repo: "DisplayXR/displayxr-demo-modelviewer",
    description:
      "Glasses-free 3D glTF 2.0 PBR model viewer (OpenXR + Vulkan). Drag-and-drop a .glb / .gltf model. Windows, macOS, Linux, Android.",
    url: "https://github.com/DisplayXR/displayxr-demo-modelviewer",
    category: "demos",
    status: "active",
  },
  {
    name: "displayxr-demo-mediaplayer",
    repo: "DisplayXR/displayxr-demo-mediaplayer",
    description:
      "Spatial media player — stereo photos, GPU-decoded video with synchronized audio, and folder slideshows, with playback controllable by AI agents. Windows, macOS, Linux, Android.",
    url: "https://github.com/DisplayXR/displayxr-demo-mediaplayer",
    category: "demos",
    status: "active",
  },
  {
    name: "displayxr-demo-avatar",
    repo: "DisplayXR/displayxr-demo-avatar",
    description:
      "A transparent, click-through 3D avatar that floats over your desktop (OpenXR + native Vulkan) — weaved in 3D with a flat 2D speech bubble beside it, and clicks passing through to whatever is behind. Showcases the see-through transparency and mixed 2D/3D display-zone path, now with live desktop content composited under the weave on all four platforms.",
    url: "https://github.com/DisplayXR/displayxr-demo-avatar",
    category: "demos",
    status: "active",
  },
  {
    name: "displayxr-demo-earthview",
    repo: "DisplayXR/displayxr-demo-earthview",
    description:
      "Streaming glasses-free 3D city viewer on Google Photorealistic 3D Tiles (OpenXR + Vulkan). Fly the full-scale world camera-style, or double-click to frame a neighborhood as a tabletop diorama. Requires a Google Map Tiles API key.",
    url: "https://github.com/DisplayXR/displayxr-demo-earthview",
    category: "demos",
    status: "beta",
  },
  {
    name: "displayxr-common",
    repo: "DisplayXR/displayxr-common",
    description:
      "Shared math and common library — off-axis (Kooima) projection, atlas tiling, and window/canvas helpers consumed by the runtime, engine plugins, and demos from a single source of truth.",
    url: "https://github.com/DisplayXR/displayxr-common",
    category: "tools",
  },
  {
    name: "displayxr-mcp",
    repo: "DisplayXR/displayxr-mcp",
    description:
      "Tiny embeddable Model Context Protocol server framework, plus the DisplayXR MCP Tools installer that end users download to opt in to AI-agent / voice control. The framework lets the runtime, the reference shell, and any third-party workspace controller expose live spatial state and control to AI agents (Claude Code, voice CLIs, custom drivers); the installer writes a registry capability flag the runtime and shell read at startup.",
    url: "https://github.com/DisplayXR/displayxr-mcp",
    category: "tools",
    status: "active",
  },
  {
    name: "displayxr-shell-releases",
    repo: "DisplayXR/displayxr-shell-releases",
    description:
      "Reference spatial workspace controller — a 3D window manager with multi-app compositing, 2D window capture, dynamic layouts, and focus-adaptive rendering. Windows, with a macOS build in beta. Ships as a standalone installer; build your own controller for verticals, kiosks, or OEM-branded workspaces using the same extension surface.",
    url: "https://github.com/DisplayXR/displayxr-shell-releases",
    category: "apps",
    status: "active",
  },
  {
    name: "displayxr-vendor-template",
    repo: "DisplayXR/displayxr-vendor-template",
    description:
      "Vendor-neutral starter kit for building a DisplayXR display-processor plug-in — the ABI, discovery, and build scaffolding a new 3D-display maker needs, with no vendor SDK required. Fork it to bring up a plug-in against the sim_display path, then swap in your own weaver.",
    url: "https://github.com/DisplayXR/displayxr-vendor-template",
    category: "tools",
    status: "early",
  },
  {
    name: "displayxr-cef-host",
    repo: "DisplayXR/displayxr-cef-host",
    description:
      "The original proof that XR_DXR_weave works — not a browser to use, which is DisplayXR Browser. A small CEF (Chromium Embedded Framework) offscreen-render app that hands the runtime a stereo texture and a window rect and composites the weaved result; it never weaves itself. Kept as the smallest worked example of driving the weave from your own present-owner without forking Chromium, and because it builds in minutes where the browser fork takes hours. Note that it is pinned to weave spec v1 while the runtime is on v6, so it does not exercise batched submit, the 2D overlay atlas, or N-view input — treat it as a starting point to read, not a current conformance harness.",
    url: "https://github.com/DisplayXR/displayxr-cef-host",
    category: "tools",
    status: "experimental",
  },
  {
    name: "displayxr-browser",
    repo: "DisplayXR/displayxr-browser",
    description:
      "DisplayXR Browser — a developer-preview Chromium that renders the web normally and weaves glasses-free inline 3D on DisplayXR hardware. The productization of the inline-3D browser work validated by the CEF host, with a GPU-resident weave (no per-frame CPU readback).",
    url: "https://github.com/DisplayXR/displayxr-browser",
    category: "apps",
    status: "experimental",
  },
  {
    name: "displayxr-web",
    repo: "DisplayXR/displayxr-web",
    description:
      "Inline-3D web samples and the JS helper library for the DisplayXR Browser — the DisplayXR analog of the webxr-samples gallery, served via GitHub Pages.",
    url: "https://github.com/DisplayXR/displayxr-web",
    category: "demos",
    status: "experimental",
  },
  {
    name: "displayxr-gallery",
    repo: "DisplayXR/displayxr-gallery",
    description:
      "A social gallery of side-by-side 3D photography — woven natively in the DisplayXR Browser, with a cursor-driven parallax preview everywhere else. The working reference for how an inline-3D page should behave. Public mirror for feedback and issues; the site is live.",
    url: "https://github.com/DisplayXR/displayxr-gallery",
    category: "demos",
    status: "active",
  },
];
