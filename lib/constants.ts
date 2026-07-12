export const GITHUB_ORG_URL = "https://github.com/DisplayXR";

// Partner / vendor contact. TODO(david): confirm this inbox is provisioned on
// the displayxr.org domain before launch; swap if a different address is used.
export const CONTACT_EMAIL = "partners@displayxr.org";

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
      { label: "Build apps", href: "/docs" },
      { label: "Demos", href: "/demos" },
      { label: "Extensions", href: "/extensions" },
      { label: "WebXR", href: "/webxr" },
      { label: "Platform Support", href: "/platform-support" },
    ],
  },
  {
    label: "Contributors",
    items: [
      { label: "Contribute", href: "/contribute" },
      { label: "Architecture", href: "/architecture" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Governance", href: "/governance" },
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

// WebXR Bridge lives in the runtime repo (webxr-bridge/). The Chrome extension
// is NOT on the Web Store yet — set CHROME_STORE_URL when it's published and the
// /webxr install CTA flips from "load unpacked" to a one-click store link.
export const WEBXR_BRIDGE_URL =
  "https://github.com/DisplayXR/displayxr-runtime/tree/main/webxr-bridge";
export const CHROME_STORE_URL: string | null = null;

export const REPO_URLS = {
  runtime: "https://github.com/DisplayXR/displayxr-runtime",
  installer: "https://github.com/DisplayXR/displayxr-installer",
  leiaPlugin: "https://github.com/DisplayXR/displayxr-leia-plugin",
  extensions: "https://github.com/DisplayXR/displayxr-extensions",
  unity: "https://github.com/DisplayXR/displayxr-unity",
  unitySamples: "https://github.com/DisplayXR/displayxr-unity-samples",
  unityTest: "https://github.com/DisplayXR/displayxr-unity-test",
  unreal: "https://github.com/DisplayXR/displayxr-unreal",
  unrealTest: "https://github.com/DisplayXR/displayxr-unreal-test",
  demoGaussiansplat: "https://github.com/DisplayXR/displayxr-demo-gaussiansplat",
  demoModelviewer: "https://github.com/DisplayXR/displayxr-demo-modelviewer",
  demoMediaplayer: "https://github.com/DisplayXR/displayxr-demo-mediaplayer",
  demoAvatar: "https://github.com/DisplayXR/displayxr-demo-avatar",
  demoEarthview: "https://github.com/DisplayXR/displayxr-demo-earthview",
  common: "https://github.com/DisplayXR/displayxr-common",
  mcp: "https://github.com/DisplayXR/displayxr-mcp",
  shell: "https://github.com/DisplayXR/displayxr-shell-releases",
  vendorTemplate: "https://github.com/DisplayXR/displayxr-vendor-template",
  cefHost: "https://github.com/DisplayXR/displayxr-cef-host",
  browser: "https://github.com/DisplayXR/displayxr-browser",
  web: "https://github.com/DisplayXR/displayxr-web",
} as const;
