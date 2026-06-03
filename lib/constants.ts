export const GITHUB_ORG_URL = "https://github.com/DisplayXR";

export const NAV_ITEMS = [
  { label: "Get Started", href: "/getting-started" },
  { label: "Docs", href: "/docs" },
  { label: "Architecture", href: "/architecture" },
  { label: "Extensions", href: "/extensions" },
  { label: "Vendors", href: "/vendors" },
  { label: "Demos", href: "/demos" },
  { label: "Download", href: "/download" },
  { label: "Status", href: "/status" },
  { label: "Compatibility", href: "/compatibility" },
  { label: "Roadmap", href: "/roadmap" },
] as const;

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
