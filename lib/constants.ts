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
      // Intentionally duplicated into Display Vendors — a shared page may
      // appear in two menus (see the IA note in CLAUDE.md). Kept out of the
      // top level so the nav keeps telling the three-persona story.
      { label: "What's New", href: "/news" },
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
    // Ordered by the job, not by cadence: a vendor arriving cold wants to know
    // what a plug-in costs. "What's New" stays in this menu (a shared page in
    // two menus is sanctioned by the IA) but sits last — the hero ticker's
    // "All updates" link already carries the route to the feed. The App
    // Developers menu keeps it first, where a returning reader expects it.
    items: [
      { label: "Plug-in guide", href: "/vendors" },
      // Tracking hardware is a second, independent plug-in type (ADR-034) and
      // had no entry point of its own in the nav. Same page, different socket.
      { label: "Input providers", href: "/vendors#input-providers" },
      { label: "Extension: display_info", href: "/extensions" },
      { label: "Platform Support", href: "/platform-support" },
      { label: "What's New", href: "/news" },
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
  unitySamples: "https://github.com/DisplayXR/displayxr-unity-samples",
  unityTest: "https://github.com/DisplayXR/displayxr-unity-samples",
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

// The DisplayXR Gallery is a hosted site published directly from a private
// repo — there is no public source or feedback repo for it.
export const GALLERY_URL = "https://displayxr-gallery.vercel.app";
