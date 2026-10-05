export const GITHUB_ORG_URL = "https://github.com/DisplayXR";

// Partner / vendor contact. TODO(david): confirm this inbox is provisioned on
// the displayxr.org domain before launch; swap if a different address is used.
export const CONTACT_EMAIL = "partners@displayxr.org";

// Hub navigation. One click per audience: each entry is a single hub page
// that opens on that audience's recommended next step (no dropdowns), plus a
// persistent Download action button (see DOWNLOAD_HREF) and a small Docs ↗
// link for returning developers (DOCS_URL). `match` lists the other routes
// that belong to a hub, so exactly one entry lights up as current. Menus are
// still supported by the model (and the Navbar renders them), but the header
// deliberately uses none; see the IA note in CLAUDE.md.
export type NavLeaf = {
  label: string;
  href: string;
  external?: boolean;
  /** Other path prefixes that make this entry the current one. */
  match?: string[];
};
export type NavMenu = { label: string; items: NavLeaf[] };
export type NavEntry = NavLeaf | NavMenu;

export const isMenu = (e: NavEntry): e is NavMenu =>
  (e as NavMenu).items !== undefined;

export const NAV: NavEntry[] = [
  { label: "About", href: "/about" },
  {
    label: "Developers",
    href: "/developers",
    match: ["/web", "/getting-started", "/extensions", "/demos", "/platform-support"],
  },
  {
    label: "Contribute",
    href: "/contribute",
    match: ["/architecture", "/roadmap", "/governance"],
  },
  { label: "Display Vendors", href: "/vendors" },
];

// Deep docs live in the runtime repo; the site summarizes and routes.
export const DOCS_URL = "https://github.com/DisplayXR/displayxr-runtime/tree/main/docs";

// Community channel: GitHub Discussions on the runtime repo.
export const DISCUSSIONS_URL = "https://github.com/DisplayXR/displayxr-runtime/discussions";

// Live inline-3D samples, served from displayxr-web via GitHub Pages.
export const WEB_SAMPLES_URL = "https://displayxr.github.io/displayxr-web/";

// Pinned SDK version shown in snippets. Bump with the browser's SDK pin policy.
export const INLINE3D_VERSION = "1.29.0";

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
