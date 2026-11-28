// Publisher content on /developers/components#publish: how listing works, the
// open shelves and how a vendor sells a component. Moved here when the Catalog
// page was erased (2026-11-28); its old URLs 308-redirect (next.config.ts).
import { GITHUB_ORG_URL } from "@/lib/constants";

export const PUBLISH_URL = `${GITHUB_ORG_URL}/displayxr-runtime/issues/new?title=Component+integration+inquiry&labels=vendor`;

export const HOW_IT_WORKS: { n: string; title: string; text: string }[] = [
  {
    n: "01",
    title: "Pick what you want",
    text: "A display plug-in, a tracker, a converter, a workspace, an app. Each one says what it does and where it runs.",
  },
  {
    n: "02",
    title: "It installs alongside DisplayXR",
    text: "Each one plugs into the DisplayXR you already have. No account, no sign-in.",
  },
  {
    n: "03",
    title: "Every app uses it straight away",
    text: "Install a converter, a tracker or an input device once, and the DisplayXR Browser, your apps and your Unity and Unreal projects all get it.",
  },
];

// The model only: no licence states, no activation steps (a vendor's own UI).
export const PAID_POINTS: { title: string; text: string }[] = [
  { title: "Install is free", text: "Anyone can install your component. No account, no sign-in." },
  { title: "You sell it", text: "On your own site, at your own price, to your own customers." },
  { title: "DisplayXR takes no cut", text: "No fee, no revenue share, no payment passing through DisplayXR." },
];

export const PUBLISHER_SLOTS: { kind: string; title: string; text: string; href: string }[] = [
  { kind: "Companions", title: "Be the first companion app", text: "Pair a phone or tablet with every spatial display.", href: PUBLISH_URL },
  {
    kind: "Input",
    title: "Be the first stylus",
    text: "The runtime serves the standard stylus profile: your pen works in every app.",
    href: "/developers/components#input-providers",
  },
  {
    kind: "Viewer tracking",
    title: "Be the first hardware tracker",
    text: "Bring look-around to every display that has no tracker of its own.",
    href: "/developers/components#viewer-tracking",
  },
  { kind: "Workspaces", title: "Be the first vertical workspace", text: "A workspace built for one job: review, design, retail.", href: PUBLISH_URL },
];
