import type { Status } from "./compatibility";

export interface EcosystemRepo {
  name: string;
  repo: string;
  description: string;
  url: string;
  category: "core" | "engines" | "tools" | "apps";
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
    name: "displayxr-unity-test",
    repo: "DisplayXR/displayxr-unity-test",
    description:
      "Ready-to-open Unity 6 test project for the DisplayXR plugin — clone, open, and hit Play.",
    url: "https://github.com/DisplayXR/displayxr-unity-test",
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
      "Real-time 3D Gaussian Splatting viewer (macOS + Windows). One repo per demo — see the org page for others.",
    url: "https://github.com/DisplayXR/displayxr-demo-gaussiansplat",
    category: "apps",
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
    name: "displayxr-shell-releases",
    repo: "DisplayXR/displayxr-shell-releases",
    description:
      "Reference spatial workspace controller — built on XR_EXT_spatial_workspace and XR_EXT_app_launcher. 3D window manager with multi-app compositing, 2D window capture, dynamic layouts, and focus-adaptive rendering. One example of a privileged compositor client; build your own for verticals, kiosks, OEM-branded workspaces, or AI-agent drivers.",
    url: "https://github.com/DisplayXR/displayxr-shell-releases",
    category: "apps",
    status: "active",
  },
];
