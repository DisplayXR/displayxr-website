export const GITHUB_ORG_URL = "https://github.com/DisplayXR";

export const NAV_ITEMS = [
  { label: "Docs", href: "/docs" },
  { label: "Architecture", href: "/architecture" },
  { label: "Extensions", href: "/extensions" },
  { label: "Demos", href: "/demos" },
  { label: "Compatibility", href: "/compatibility" },
  { label: "Roadmap", href: "/roadmap" },
] as const;

export const REPO_URLS = {
  runtime: "https://github.com/DisplayXR/displayxr-runtime",
  extensions: "https://github.com/DisplayXR/displayxr-extensions",
  unity: "https://github.com/DisplayXR/displayxr-unity",
  unreal: "https://github.com/DisplayXR/displayxr-unreal",
  demos: "https://github.com/DisplayXR/displayxr-demos",
  projection: "https://github.com/DisplayXR/kooima-projection",
  shell: "https://github.com/DisplayXR/displayxr-shell-releases",
} as const;
