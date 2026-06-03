export const GITHUB_ORG_URL = "https://github.com/DisplayXR";

// Persona-led navigation. The header has one universal front door
// (Get Started), three audience menus (each a curated journey, not a dump —
// shared pages may appear in two menus on purpose), and a persistent Download
// action button (see DOWNLOAD_HREF). A nav entry is either a leaf link or a
// menu of leaves.
export type NavLeaf = { label: string; href: string; external?: boolean };
export type NavMenu = { label: string; items: NavLeaf[] };
export type NavEntry = NavLeaf | NavMenu;

export const isMenu = (e: NavEntry): e is NavMenu =>
  (e as NavMenu).items !== undefined;

export const NAV: NavEntry[] = [
  { label: "Get Started", href: "/getting-started" },
  {
    label: "App Developers",
    items: [
      { label: "Quickstart", href: "/getting-started" },
      { label: "Demos", href: "/demos" },
      { label: "Extensions", href: "/extensions" },
      { label: "Platform Support", href: "/platform-support" },
    ],
  },
  {
    label: "Contributors",
    items: [
      { label: "Contribute", href: "/contribute" },
      { label: "Architecture", href: "/architecture" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Source & repos", href: GITHUB_ORG_URL, external: true },
    ],
  },
  {
    label: "Display Vendors",
    items: [
      { label: "Plug-in guide", href: "/vendors" },
      { label: "Extension: display_info", href: "/extensions" },
      { label: "Platform Support", href: "/platform-support" },
    ],
  },
];

export const DOWNLOAD_HREF = "/download";

export const REPO_URLS = {
  runtime: "https://github.com/DisplayXR/displayxr-runtime",
  installer: "https://github.com/DisplayXR/displayxr-installer",
  leiaPlugin: "https://github.com/DisplayXR/displayxr-leia-plugin",
  extensions: "https://github.com/DisplayXR/displayxr-extensions",
  unity: "https://github.com/DisplayXR/displayxr-unity",
  unityTest: "https://github.com/DisplayXR/displayxr-unity-test",
  unreal: "https://github.com/DisplayXR/displayxr-unreal",
  unrealTest: "https://github.com/DisplayXR/displayxr-unreal-test",
  demoGaussiansplat: "https://github.com/DisplayXR/displayxr-demo-gaussiansplat",
  demoModelviewer: "https://github.com/DisplayXR/displayxr-demo-modelviewer",
  projection: "https://github.com/DisplayXR/kooima-projection",
  mcp: "https://github.com/DisplayXR/displayxr-mcp",
  shell: "https://github.com/DisplayXR/displayxr-shell-releases",
} as const;
