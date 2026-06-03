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
      "Core OpenXR runtime with native compositors for D3D11, D3D12, Vulkan, Metal, and OpenGL.",
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
    name: "displayxr-unreal",
    repo: "DisplayXR/displayxr-unreal",
    description:
      "Unreal Engine plugin (UE 5.3+) with eye-tracked Kooima stereo, camera- and display-centric rigs, Blueprint components, material expression nodes, and zero-copy atlas handoff. Windows, macOS, Android.",
    url: "https://github.com/DisplayXR/displayxr-unreal",
    category: "engines",
    status: "beta",
  },
  {
    name: "displayxr-demo-gaussiansplat",
    repo: "DisplayXR/displayxr-demo-gaussiansplat",
    description:
      "Real-time 3D Gaussian Splatting viewer (.spz / .ply) for spatial displays. macOS + Windows.",
    url: "https://github.com/DisplayXR/displayxr-demo-gaussiansplat",
    category: "demos",
    status: "active",
  },
  {
    name: "displayxr-demo-modelviewer",
    repo: "DisplayXR/displayxr-demo-modelviewer",
    description:
      "Glasses-free 3D glTF 2.0 PBR model viewer (OpenXR + Vulkan). Drag-and-drop a .glb / .gltf model.",
    url: "https://github.com/DisplayXR/displayxr-demo-modelviewer",
    category: "demos",
    status: "active",
  },
  {
    name: "kooima-projection",
    repo: "DisplayXR/kooima-projection",
    description:
      "Off-axis frustum projection math library for spatial display rendering.",
    url: "https://github.com/DisplayXR/kooima-projection",
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
      "Reference spatial workspace controller — a 3D window manager with multi-app compositing, 2D window capture, dynamic layouts, and focus-adaptive rendering. Ships as a standalone installer; build your own controller for verticals, kiosks, or OEM-branded workspaces using the same extension surface.",
    url: "https://github.com/DisplayXR/displayxr-shell-releases",
    category: "apps",
    status: "active",
  },
];
