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
      "Unity engine plugin (UPM package) with sample scene.",
    url: "https://github.com/DisplayXR/displayxr-unity",
    category: "engines",
    status: "early",
  },
  {
    name: "displayxr-unreal",
    repo: "DisplayXR/displayxr-unreal",
    description: "Unreal Engine plugin for DisplayXR integration.",
    url: "https://github.com/DisplayXR/displayxr-unreal",
    category: "engines",
    status: "planned",
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
      "Spatial shell / 3D window manager — binaries, documentation, and issue tracking.",
    url: "https://github.com/DisplayXR/displayxr-shell-releases",
    category: "apps",
    status: "early",
  },
];
