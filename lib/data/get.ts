// Authored content for /download ("Get DisplayXR"). Versions, file names,
// sizes and links come from lib/data/generated/downloads.json (sync-org); this
// file holds only what is not derivable: what each OS's bundle installs, the
// steps after installing, and the add-on cards' prose.
//
// INCLUDED was checked on 2026-11-28 against the released installer v2.9.45
// files (not only the build scripts): the macOS .pkg's Distribution, the Linux
// tarball's debs/ and the runtime .deb's payload, the Android zip's apks/, and
// the Windows NSIS sections. Re-check it when displayxr-installer changes what a
// bundle chains (scripts/build-bundle.sh, build-bundle-linux.sh,
// build-bundle.bat, the Android bundle workflow).
//
// Rules for this page: no performance numbers; never the word for Leia's
// conversion runtime ("Leia conversion" is the name); SHARP never gets a
// download button and always carries its research badge; nothing about a
// vendor's runtime entitlement; "spatial display", never "glasses-free" as scope.
import type { Platform } from "./generated";

export const OSES: { id: Platform; label: string }[] = [
  { id: "Windows", label: "Windows" },
  { id: "macOS", label: "macOS" },
  { id: "Linux", label: "Linux (Ubuntu)" },
  { id: "Android", label: "Android tablet" },
];

/**
 * Upcoming add-ons and per-OS gaps. David's 2026-11-20 rule for the catalog
 * is "truthful by omission, never by disclaimer"; this page's plan (approved
 * 2026-11-28) shows "Not available on X yet" and coming-soon cards instead.
 * true = the plan as specced; false = omission: a card with nothing for any OS
 * is left out, and a card with nothing for the selected OS is hidden.
 */
export const SHOW_UPCOMING = true;

export type Included = { name: string; gloss: string; on: Platform[] };

/** What the bundle installs, plain-language gloss first. */
export const INCLUDED: Included[] = [
  { name: "DisplayXR", gloss: "the core that shows 3D apps on your spatial display", on: ["Windows", "macOS", "Linux", "Android"] },
  { name: "Your display's own services", gloss: "the tablet's display and head-tracking services", on: ["Android"] },
  { name: "Dashboard", gloss: "see your display, change settings, add and update parts", on: ["Windows", "Linux"] },
  { name: "2D-to-3D conversion", gloss: "turns ordinary photos, video and windows into 3D", on: ["Windows"] },
  { name: "Leia SR plug-in and Leia conversion", gloss: "for Leia SR displays: 3D output and Leia's own 2D-to-3D conversion", on: ["Linux"] },
  { name: "Five demo apps", gloss: "splats, 3D models, 3D photos and video, an avatar, Earth", on: ["Windows", "macOS", "Linux", "Android"] },
  { name: "AI assistant tools", gloss: "optional; lets AI assistants drive 3D apps", on: ["Windows"] },
  { name: "DisplayXR Browser", gloss: "a web browser that shows 3D web pages in 3D", on: ["Android"] },
];

/** Under "What it installs". The Windows and macOS installers let you untick
 * everything but DisplayXR itself (NSIS sections; the .pkg's Customize step,
 * six visible choices, the runtime's disabled); Linux's install.sh takes no
 * selection; the Android script installs the whole set. */
export const RERUN_NOTE: Record<Platform, string> = {
  Windows: "You can untick anything but DisplayXR itself during install. Running the installer again later updates what you have and keeps your settings.",
  macOS: "Choose Customize during install to leave out any demo. Running the installer again later updates what you have and keeps your settings.",
  Linux: "Running ./install.sh again later updates what you have and keeps your settings.",
  Android: "Running the install again later updates what you have and keeps your settings.",
};

export type Step = { title: string; body: string };

export const STEPS: Record<Platform, Step[]> = {
  Windows: [
    { title: "Run the installer", body: "Keep the default choices. It finds your spatial display and sets it up." },
    { title: "Open a demo", body: "Start Media Player or Model Viewer from the Start menu." },
    { title: "Open the Dashboard", body: "Check your display is found and in 3D, and add the extras below if you want them." },
  ],
  macOS: [
    { title: "Run the installer", body: "Open the package and keep the default choices." },
    { title: "Open a demo", body: "Start Media Player or Model Viewer from Applications." },
    { title: "Add extras", body: "The DisplayXR Browser and camera head tracking are on this page." },
  ],
  Linux: [
    { title: "Unpack and install", body: "Unpack the archive and run ./install.sh. It installs the packages and checks itself." },
    { title: "Open a demo", body: "Start Media Player or Model Viewer from your apps." },
    { title: "Open the Dashboard", body: "Check your display is found and in 3D, and add the extras below if you want them." },
  ],
  Android: [
    { title: "Unzip on your computer", body: "Connect the tablet over USB with USB debugging on, then run the install script in the folder." },
    { title: "Open a demo", body: "Start any DisplayXR demo from the tablet's app list." },
    { title: "Open the Browser", body: "The DisplayXR Browser is installed too: open a 3D web page." },
  ],
};

export type AddonWay = {
  /** Dashboard path, Windows only today. */
  dash?: string;
  /** Offer the generated release file for this OS. */
  download?: boolean;
  cli?: string;
};

export type Addon = {
  id: string; // anchor: #addon-<id>
  /** downloads.json addon id that supplies version and files, if any. */
  gen?: "shell" | "tracking_open" | "ultraleap";
  name: string;
  badge: { label: string; tone: "who" | "research" | "soon" };
  desc: string;
  /** Replaces `desc` on one OS, where a clause is only true there. */
  descOn?: Partial<Record<Platform, string>>;
  facts: { k: string; v: string; placeholder?: boolean }[];
  ways: Partial<Record<Platform, AddonWay>>;
  /** Shown under "Not available on <OS> yet." */
  later?: string;
  /** Replaces the whole "Not available on <OS> yet. <later>" line. */
  unavailable?: string;
  /** GitHub repo to follow when there is nothing for this OS. */
  follow?: string;
  /** Upcoming card: nothing on any OS yet. */
  upcoming?: boolean;
};

export const ADDONS: Addon[] = [
  {
    id: "shell",
    gen: "shell",
    name: "Spatial desktop (Shell)",
    badge: { label: "Showcase · for developers", tone: "who" },
    desc: "Several 3D apps side by side in one 3D workspace, opened with Ctrl+Shift+Space. A demonstration of what apps can do together on a spatial display.",
    facts: [{ k: "Needs", v: "DisplayXR, from the installer above." }],
    ways: {
      Windows: { dash: "Add-ons › Spatial desktop", download: true },
      macOS: { download: true },
      Linux: { download: true },
    },
  },
  {
    id: "head-tracking",
    gen: "tracking_open",
    name: "Camera head tracking",
    badge: { label: "For displays without their own tracker", tone: "who" },
    desc: "Uses your webcam to follow your head, so 3D scenes shift as you move. A display that tracks you itself, such as Leia SR, does this already and takes over.",
    facts: [
      { k: "Needs", v: "A webcam." },
      { k: "Privacy", v: "Camera images never leave your computer." },
    ],
    ways: { macOS: { download: true } },
    later: "Coming to Windows and Linux.",
    follow: "displayxr-tracking-open",
  },
  {
    id: "sharp",
    name: "SHARP photo-to-3D",
    badge: { label: "Research preview · non-commercial", tone: "research" },
    desc: "A research model that turns a single photo into a 3D scene. Your computer downloads the original model from its publisher and prepares it locally. We don't host it.",
    descOn: {
      Windows:
        "A research model that turns a single photo into a 3D scene, for the 2D-to-3D conversion you already have. Your computer downloads the original model from its publisher and prepares it locally. We don't host it.",
    },
    facts: [
      { k: "Licence", v: "The publisher's research-only licence: no commercial use. You read and accept it before anything downloads." },
      { k: "Needs", v: "[GPU, disk and download size: to come from the builder]", placeholder: true },
    ],
    ways: {
      Windows: {
        dash: "Research preview › SHARP",
        cli: "[command line: to come from the builder]",
      },
    },
    unavailable: "Available on Windows.",
  },
  {
    id: "ultraleap",
    gen: "ultraleap",
    name: "Ultraleap hand tracking",
    badge: { label: "Coming soon", tone: "soon" },
    desc: "Use your hands in 3D apps with an Ultraleap hand-tracking camera.",
    facts: [{ k: "Needs", v: "An Ultraleap camera and Ultraleap's hand-tracking software (free, from ultraleap.com)." }],
    ways: {},
    later: "Not released yet.",
    follow: "displayxr-ultraleap",
    upcoming: true,
  },
  {
    id: "webcam-hands",
    name: "Webcam hand tracking",
    badge: { label: "Coming soon", tone: "soon" },
    desc: "Hands and pinch from an ordinary webcam, with open models. No extra hardware.",
    facts: [{ k: "Needs", v: "A webcam." }],
    ways: {},
    later: "Not released yet.",
    follow: "displayxr-tracking-open",
    upcoming: true,
  },
];

/** "Individual installers" rows, in bundle order, keyed to downloads.json parts. */
export const PART_NAMES: Record<string, string> = {
  runtime: "DisplayXR (core only)",
  leia_plugin: "Leia SR plug-in",
  conversion_open: "2D-to-3D conversion (open)",
  leia_conversion: "Leia conversion",
  mcp_tools: "AI assistant tools (MCP)",
  gauss_demo: "Gaussian Splat viewer",
  modelviewer_demo: "Model viewer",
  mediaplayer_demo: "Media player",
  avatar_demo: "Avatar",
  earthview_demo: "Earth view",
};

export const TROUBLESHOOTING_URL =
  "https://github.com/DisplayXR/displayxr-runtime/blob/main/docs/getting-started/troubleshooting.md";

/** Release-asset size for display: whole MB, "<1 MB" below one. */
export function formatSize(bytes: number): string {
  if (bytes < 1_000_000) return "<1 MB";
  return `${Math.round(bytes / 1_000_000)} MB`;
}
