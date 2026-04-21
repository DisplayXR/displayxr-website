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
    name: "displayxr-demos",
    repo: "DisplayXR/displayxr-demos",
    description:
      "Demo applications showcasing DisplayXR capabilities and use cases.",
    url: "https://github.com/DisplayXR/displayxr-demos",
    category: "apps",
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
      "Spatial desktop shell — 3D window manager with multi-app compositing, 2D window capture, dynamic layouts, and focus-adaptive rendering.",
    url: "https://github.com/DisplayXR/displayxr-shell-releases",
    category: "apps",
    status: "active",
  },
];
