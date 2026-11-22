// The DisplayXR Catalog (/catalog): one list of everything that plugs into
// DisplayXR. This file is the single source for its categories and items.
//
// The Catalog is a marketing surface: it says what each thing is and what you
// get, in the present tense. It stays truthful by OMISSION, never by
// disclaimer (David, 2026-11-20):
//   - Only real items, and every fact comes from data the site already
//     carries: versions from the org sync (lib/data/generated), platforms from
//     the generated data, lib/data/demos.ts and apps.ts, names and
//     descriptions from components.ts, apps.ts and ecosystem.ts. A fact the
//     site does not have is left out; it is never typed in here, and the page
//     never says that something is missing, untested or not shipped yet.
//   - No trust label ("Verified") anywhere until an item can carry one.
//     Chips say true, positive things: "By DisplayXR", "By <publisher>",
//     "Open source", "For developers".
//   - Nothing is rated, ranked, counted or priced. No performance figures.
//   - Games are not items. The Games shelf (/catalog/games) renders the same
//     records /play uses, from lib/data/play.ts.
//   - "Get it" goes to the item's own release or to /download.
import { components as releases, demos, engines } from "@/lib/data/generated";
import releaseCandidates from "@/lib/data/generated/news-candidates.json";
import { componentClasses, type ComponentImpl } from "@/lib/data/components";
import { ecosystemRepos } from "@/lib/data/ecosystem";
import { demoEditorial } from "@/lib/data/demos";
import { APPS, MEDIA_PLAYER_PRO_VERSION, MPP_PLATFORMS } from "@/lib/data/apps";
import {
  DISCUSSIONS_URL,
  DOWNLOAD_HREF,
  GITHUB_ORG_URL,
  INLINE3D_VERSION,
  REPO_URLS,
} from "@/lib/constants";

export type CategoryId =
  | "displays"
  | "input"
  | "2d-to-3d"
  | "viewer-tracking"
  | "companions"
  | "workspaces"
  | "apps"
  | "sdks";

export type CategoryIcon =
  | "monitor"
  | "pen"
  | "convert"
  | "eye"
  | "phone"
  | "windows"
  | "grid"
  | "code"
  | "gamepad"
  | "plug";

export interface CatalogCategory {
  id: CategoryId;
  /** Short label for the Browse row, breadcrumbs and chips. */
  label: string;
  /** Category page H1. */
  title: string;
  /** Category page lead. */
  lead: string;
  icon: CategoryIcon;
  /** The "list yours" slot at the foot of the category page. */
  invite: { title: string; text: string; cta: string; href: string };
}

export interface CatalogLink {
  label: string;
  href: string;
}

export interface CatalogChip {
  label: string;
  title?: string;
}

export interface CatalogSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface CatalogItem {
  /** URL slug under its category. A route name, not an install id. */
  id: string;
  category: CategoryId;
  name: string;
  /** Who publishes it; rendered as the "By <publisher>" chip. */
  publisher?: string;
  /** One or two lines for cards and rows. */
  blurb: string;
  /** Item page lead; falls back to `blurb`. */
  lead?: string;
  /** "Windows · macOS · Linux", as the site's data states it. */
  platforms?: string;
  version?: string;
  /** For items that ship inside another release, e.g. the runtime. */
  comesWith?: string;
  /** Short mono line on a row, e.g. the engine version a plug-in targets. */
  detail?: string;
  forDevelopers?: true;
  openSource?: true;
  chips?: CatalogChip[];
  /** The primary action: the item's release, or the Download page. */
  get: CatalogLink & { note?: string };
  /** A second action, e.g. the product page on this site. */
  more?: CatalogLink;
  hostedBy?: CatalogLink;
  needs?: string;
  runs?: string;
  sections?: CatalogSection[];
}

const COMPONENT_INQUIRY = `${GITHUB_ORG_URL}/displayxr-runtime/issues/new?title=Component+integration+inquiry&labels=vendor`;

export const CATALOG_PUBLISH_URL = COMPONENT_INQUIRY;

export const CATEGORIES: CatalogCategory[] = [
  {
    id: "displays",
    label: "Displays",
    title: "Display plug-ins",
    lead: "A display plug-in is the one component that knows a panel: it turns rendered views into what the optics need and carries the calibration. Install the one for your display and every DisplayXR app runs on it.",
    icon: "monitor",
    invite: {
      title: "Building a spatial display?",
      text: "One plug-in puts every DisplayXR app on your panel. Start from the vendor template: it builds with no vendor SDK, and you replace one function, the weave.",
      cta: "Start from the vendor template",
      href: REPO_URLS.vendorTemplate,
    },
  },
  {
    id: "input",
    label: "Input",
    title: "Input",
    lead: "Input providers bring hands, controllers, styluses and navigation devices into the standard OpenXR action system. Install one and every app can use it, with no idea where the poses came from.",
    icon: "pen",
    invite: {
      title: "Shipping a controller, stylus or tracker?",
      text: "One provider brings your device to every DisplayXR app. The input-provider template gives you a stylus provider, a headless smoke test and an installer that registers it.",
      cta: "Start from the input-provider template",
      href: REPO_URLS.inputTemplate,
    },
  },
  {
    id: "2d-to-3d",
    label: "2D-to-3D",
    title: "2D-to-3D converters",
    lead: "A converter turns ordinary photos and video into 3D. Install one and every DisplayXR app can use it. Apps never ship a model themselves.",
    icon: "convert",
    invite: {
      title: "Have a depth or view-synthesis model?",
      text: "List it here and it reaches every spatial display, with no display partner needed.",
      cta: "Start from the conversion template",
      href: REPO_URLS.conversionTemplate,
    },
  },
  {
    id: "viewer-tracking",
    label: "Viewer tracking",
    title: "Viewer tracking",
    lead: "Look-around from a webcam or any tracker, for displays without their own eye tracker. The scene follows your head, on any display.",
    icon: "eye",
    invite: {
      title: "Make a depth camera or a tracker?",
      text: "One component brings your tracker to every display that has none of its own.",
      cta: "Talk to us about listing it",
      href: COMPONENT_INQUIRY,
    },
  },
  {
    id: "companions",
    label: "Companions",
    title: "Companions",
    lead: "Phone and tablet apps that pair with a spatial display.",
    icon: "phone",
    invite: {
      title: "Be the first companion app",
      text: "A phone or tablet app that pairs with a spatial display.",
      cta: "Talk to us about listing it",
      href: COMPONENT_INQUIRY,
    },
  },
  {
    id: "workspaces",
    label: "Workspaces",
    title: "Workspaces",
    lead: "A workspace arranges several apps on one spatial display: placement, focus and layouts, 2D and 3D side by side.",
    icon: "windows",
    invite: {
      title: "Be the first vertical workspace",
      text: "A workspace built for one job: review, design, retail. Register your binary and the runtime starts it on demand.",
      cta: "Talk to us about listing it",
      href: COMPONENT_INQUIRY,
    },
  },
  {
    id: "apps",
    label: "Apps",
    title: "Apps",
    lead: "Apps for your spatial display: a browser that shows the web in depth, viewers and players, and web apps that open in 3D.",
    icon: "grid",
    invite: {
      title: "Built an app on DisplayXR?",
      text: "Tell us where it lives and put it in front of everyone with a spatial display. You host it and keep your users.",
      cta: "Tell us in Discussions",
      href: DISCUSSIONS_URL,
    },
  },
  {
    id: "sdks",
    label: "SDKs",
    title: "SDKs and starter kits",
    lead: "What you build with: the web SDK, the engine plug-ins, and a starter kit for each kind of component. Build once and it runs on every spatial display.",
    icon: "code",
    invite: {
      title: "Maintain an engine or a framework?",
      text: "DisplayXR is OpenXR plus a small set of extensions, so an integration is mostly the window binding and the view rig.",
      cta: "Read the extensions",
      href: "/extensions",
    },
  },
];

// --- lookups into the site's existing data -----------------------------------
// Each throws at build time when its source record goes away, so the Catalog
// can never quietly keep a fact the rest of the site has dropped.

function release(id: string) {
  const r = releases.find((c) => c.id === id);
  if (!r) throw new Error(`catalog.ts: no generated component "${id}"`);
  return r;
}

function impl(classId: string, name: string): ComponentImpl {
  const i = componentClasses.find((c) => c.id === classId)?.impls.find((x) => x.name === name);
  if (!i) throw new Error(`catalog.ts: no "${name}" in component class "${classId}"`);
  return i;
}

function repoBlurb(name: string): string {
  const r = ecosystemRepos.find((x) => x.name === name);
  if (!r) throw new Error(`catalog.ts: no ecosystem repo "${name}"`);
  return r.description;
}

function engine(id: string) {
  const e = engines.find((x) => x.id === id);
  if (!e) throw new Error(`catalog.ts: no generated engine "${id}"`);
  return e;
}

function app(id: string) {
  const a = APPS.find((x) => x.id === id);
  if (!a) throw new Error(`catalog.ts: no app "${id}" in lib/data/apps.ts`);
  return a;
}

/**
 * The newest full release of an org repo, from the org sync's release scan
 * (generated/news-candidates.json, newest first, a few releases per repo).
 * Gives a version and a direct release link to items the component dashboard
 * does not track. Returns nothing when the scan has no `vX.Y.Z` release, and
 * the item then simply shows no version.
 */
function latestRelease(repo: string): { version: string; url: string } | undefined {
  const r = (releaseCandidates as { repo: string; tag: string; url: string; prerelease: boolean }[]).find(
    (c) => c.repo === repo && !c.prerelease && /^v\d+\.\d+\.\d+$/.test(c.tag),
  );
  return r ? { version: r.tag, url: r.url } : undefined;
}

const PLATFORM_NAMES = ["Windows", "macOS", "Linux", "Android"];
const demoPlatforms = (id: string): string | undefined => {
  const p = (demoEditorial[id]?.tags ?? []).filter((t) => PLATFORM_NAMES.includes(t));
  return p.length ? p.join(" · ") : undefined;
};

export const FOR_DEVELOPERS_NOTE = "A reference implementation for building and testing your own app or component.";

const runtime = release("runtime");

/** Reference components ship inside the runtime: getting DisplayXR gets them. */
const WITH_RUNTIME: Pick<CatalogItem, "get" | "comesWith" | "needs" | "runs"> = {
  get: {
    label: "Get DisplayXR",
    href: DOWNLOAD_HREF,
    note: "It comes with DisplayXR, ready to use as soon as the runtime is installed.",
  },
  comesWith: runtime.version ? `${runtime.name} ${runtime.version}` : runtime.name,
  runs: "On your machine",
};

// --- the items ---------------------------------------------------------------

const leiaDp = impl("display-processors", "Leia SR display processor");
const simDisplay = impl("display-processors", "sim_display");
const simInput = impl("input-providers", "sim_input");
const netInput = impl("input-providers", "net_input");
const leiaConv = impl("conversion-providers", "Leia conversion provider");
const simConv = impl("conversion-providers", "DisplayXR-SimConversion");
const vendorTemplate = impl("display-processors", "Vendor template");
const inputTemplate = impl("input-providers", "Input-provider template");
const convTemplate = impl("conversion-providers", "Conversion template");
// Named on /components; the Catalog calls it by what it does.
impl("conversion-providers", "Open-model provider");

const shell = release("shell");
const browser = release("browser");
const leiaRelease = release("leia_plugin");
const unity = engine("unity");
const unreal = engine("unreal");
const mediaPlayerPro = app("media-player-pro");

const TRACKING_OPEN_REPO = `${GITHUB_ORG_URL}/displayxr-tracking-open`;
const conversionOpen = latestRelease("displayxr-conversion-open");
const trackingOpen = latestRelease("displayxr-tracking-open");

/** Web apps from /apps: live sites that open in 3D in the DisplayXR Browser. */
const webApps: CatalogItem[] = (["chat", "gallery", "ride"] as const).map((id) => {
  const a = app(id);
  return {
    id,
    category: "apps",
    name: a.name,
    publisher: "DisplayXR",
    blurb: a.tagline,
    detail: a.builtOn,
    chips: [{ label: "Web app", title: "A live site: open it and you are in." }],
    get: {
      label: "Open it",
      href: a.url,
      note: "Opens the live site. In the DisplayXR Browser on a spatial display it is in 3D, and it works in 2D in any other browser.",
    },
    ...(a.page ? { more: { label: "About this app", href: a.page } } : {}),
    needs: "DisplayXR Browser, for 3D",
    runs: "In the browser",
  };
});

/** Installed demo apps, straight from the org sync (one card per demo repo). */
const DEMO_BLURBS: Record<string, string> = {
  // The generated one-liner says "3D displays"; the Catalog says what it plays.
  mediaplayer: "Plays stereo photos and video on a spatial display.",
};

const demoApps: CatalogItem[] = demos.map((d) => {
  const platforms = demoPlatforms(d.id);
  return {
    id: d.id,
    category: "apps" as const,
    name: d.name,
    publisher: "DisplayXR",
    blurb: DEMO_BLURBS[d.id] ?? d.description,
    ...(platforms ? { platforms } : {}),
    ...(d.tag ? { version: d.tag } : {}),
    openSource: true as const,
    get: {
      label: "Get it",
      href: d.releaseUrl ?? d.repoUrl,
      note: "Download the installer from its release and it runs on your display.",
    },
    more: { label: "All demos", href: "/demos" },
    hostedBy: { label: "Its GitHub releases", href: `${d.repoUrl}/releases` },
    needs: "DisplayXR",
    runs: "On your machine",
  };
});

const browserItem: CatalogItem = {
  id: "browser",
  category: "apps",
  name: browser.name,
  publisher: "DisplayXR",
  blurb: "Browses the web as usual and shows 3D web content in depth on a spatial display.",
  lead: "A Chromium-based browser that renders the web normally and shows 3D web content in depth on a spatial display.",
  platforms: browser.platforms,
  ...(browser.version ? { version: browser.version } : {}),
  get: {
    label: "Get it",
    href: DOWNLOAD_HREF,
    note: "Install DisplayXR, then the browser, and the web opens up in 3D.",
  },
  more: { label: "About the browser", href: "/browser" },
  hostedBy: { label: "Its GitHub releases", href: browser.releaseUrl },
  needs: "DisplayXR",
  runs: "On your machine",
  sections: [
    {
      title: "What it does",
      paragraphs: [
        "Everyday browsing, plus depth: products, scenes, photos and video that sit in the page in 3D. Pages built for it show in 2D in every other browser, so they are safe to share anywhere.",
      ],
    },
  ],
};

const mediaPlayerProItem: CatalogItem = {
  id: "media-player-pro",
  category: "apps",
  name: mediaPlayerPro.name,
  publisher: "DisplayXR",
  blurb: mediaPlayerPro.tagline,
  platforms: MPP_PLATFORMS.map((p) => p.os).join(" · "),
  version: MEDIA_PLAYER_PRO_VERSION,
  get: {
    label: "Get it",
    href: mediaPlayerPro.url,
    note: "Download the installer from its release and it runs on your display.",
  },
  ...(mediaPlayerPro.page ? { more: { label: "About this app", href: mediaPlayerPro.page } } : {}),
  needs: "DisplayXR",
  runs: "On your machine",
};

/** The Apps shelf leads with these, in this order; the rest follow. */
const APPS_LEAD = ["browser", "gaussiansplat", "mediaplayer", "modelviewer", "chat", "gallery"];

const appsShelf: CatalogItem[] = (() => {
  const all = [browserItem, ...demoApps, mediaPlayerProItem, ...webApps];
  const lead = APPS_LEAD.map((id) => all.find((i) => i.id === id)).filter((i): i is CatalogItem => !!i);
  return [...lead, ...all.filter((i) => !APPS_LEAD.includes(i.id))];
})();

export const ITEMS: CatalogItem[] = [
  // Displays
  {
    id: "leia-sr",
    category: "displays",
    name: leiaDp.name,
    publisher: "Leia",
    blurb: "The display plug-in for Leia SR hardware. Install it and every DisplayXR app shows 3D on your display.",
    lead: "The display plug-in for Leia SR hardware. The DisplayXR runtime finds it at startup, and every DisplayXR app then shows 3D on that display.",
    platforms: leiaRelease.platforms,
    ...(leiaRelease.version ? { version: leiaRelease.version } : {}),
    get: {
      label: "Get it",
      href: DOWNLOAD_HREF,
      note: "The DisplayXR installer on the Download page sets it up together with the runtime.",
    },
    hostedBy: { label: "Its GitHub releases", href: leiaRelease.releaseUrl },
    needs: "DisplayXR",
    runs: "On your machine",
    sections: [
      {
        title: "What it does",
        paragraphs: [
          "A display processor turns the rendered views into whatever the panel's optics need, carries the calibration and, where the panel tracks the viewer, owns that tracker.",
        ],
      },
      {
        title: "Works with",
        bullets: [
          "Every DisplayXR app, on any graphics API, with no change to the app",
          "The DisplayXR Browser, the Shell, and Unity and Unreal projects",
        ],
      },
    ],
  },
  {
    id: "sim-display",
    category: "displays",
    name: simDisplay.name,
    publisher: "DisplayXR",
    blurb: "A simulated display in an ordinary window, on Windows, macOS, Linux and Android. Build and test with no hardware.",
    lead: "The simulated display. It behaves like a real one in an ordinary window, so you can build and test on the laptop you already have.",
    platforms: "Windows · macOS · Linux · Android",
    forDevelopers: true,
    openSource: true,
    ...WITH_RUNTIME,
    more: { label: "Developers", href: "/developers" },
    sections: [
      {
        title: "What it does",
        paragraphs: [
          "It stands in for a panel, with the viewer's eyes on the mouse and keyboard. When real display hardware is present, the runtime uses that instead.",
        ],
      },
    ],
  },

  // Input
  {
    id: "sim-input",
    category: "input",
    name: simInput.name,
    publisher: "DisplayXR",
    blurb: "The reference input provider: deterministic input for testing your app, with no hardware.",
    forDevelopers: true,
    openSource: true,
    ...WITH_RUNTIME,
  },
  {
    id: "net-input",
    category: "input",
    name: netInput.name,
    publisher: "DisplayXR",
    blurb: netInput.note,
    forDevelopers: true,
    openSource: true,
    ...WITH_RUNTIME,
    ...(netInput.href ? { hostedBy: { label: "Source in the runtime", href: netInput.href } } : {}),
  },

  // 2D-to-3D
  {
    id: "conversion-open",
    category: "2d-to-3d",
    name: "Open-model converter",
    publisher: "DisplayXR",
    blurb: "Turns photos and video into 3D with open models, so every machine has a converter.",
    lead: "Turns photos and video into 3D using open models. Install it once and every DisplayXR app on the machine can convert.",
    ...(conversionOpen ? { version: conversionOpen.version } : {}),
    openSource: true,
    get: {
      label: "Get it",
      href: conversionOpen?.url ?? `${REPO_URLS.conversionOpen}/releases`,
      note: "Download the installer from its release. Every DisplayXR app can convert from then on.",
    },
    hostedBy: { label: "Its GitHub releases", href: `${REPO_URLS.conversionOpen}/releases` },
    needs: "DisplayXR",
    runs: "On your machine",
    sections: [
      {
        title: "What it does",
        paragraphs: [
          "Give it an ordinary picture or a video and it works out depth, which is what a spatial display needs to show it in 3D.",
          "Its models are open and permissively licensed. The runtime's model store fetches each model pack and verifies it by checksum.",
        ],
      },
      {
        title: "Works with",
        bullets: [
          "Any spatial display that has a DisplayXR display plug-in",
          "Any app that asks DisplayXR to convert. Apps never ship a model themselves",
          "Other converters: it stays installed beside them as the one that is always there",
        ],
      },
      {
        title: "Where it runs",
        paragraphs: [
          "On your machine, in a separate host process that DisplayXR starts and supervises. Your apps keep running whatever a model does.",
        ],
      },
    ],
  },
  {
    id: "leia-conversion",
    category: "2d-to-3d",
    name: leiaConv.name,
    publisher: "Leia",
    blurb: "On Leia displays: the display maker's own 2D-to-3D converter, shared with every DisplayXR app.",
    platforms: "Windows",
    get: {
      label: "Get it",
      href: leiaConv.href ?? REPO_URLS.leiaPlugin,
    },
    needs: "DisplayXR",
    runs: "On your machine",
  },
  {
    id: "sim-conversion",
    category: "2d-to-3d",
    name: simConv.name,
    publisher: "DisplayXR",
    blurb: "The reference converter: CPU-only and deterministic, it exercises every task and readiness state.",
    lead: "The reference converter. It tests your app's conversion path on any machine: CPU-only, deterministic, every task and readiness state.",
    forDevelopers: true,
    openSource: true,
    ...WITH_RUNTIME,
    ...(simConv.href ? { hostedBy: { label: "Source in the runtime", href: simConv.href } } : {}),
  },

  // Viewer tracking
  {
    id: "tracking-open",
    category: "viewer-tracking",
    name: "Camera viewer tracking",
    publisher: "DisplayXR",
    blurb: "Look-around from an ordinary camera, for displays that have no eye tracker of their own.",
    lead: "Head and eye tracking from an ordinary camera, with open models. Any display gets look-around.",
    platforms: "macOS (Apple silicon)",
    ...(trackingOpen ? { version: trackingOpen.version } : {}),
    openSource: true,
    get: {
      label: "Get it",
      href: trackingOpen?.url ?? `${TRACKING_OPEN_REPO}/releases`,
      note: "Download the installer from its release and the scene follows your head.",
    },
    hostedBy: { label: "Its GitHub releases", href: `${TRACKING_OPEN_REPO}/releases` },
    needs: "DisplayXR runtime 2.58.0 or later",
    runs: "On your machine",
    sections: [
      {
        title: "What it does",
        paragraphs: [
          "Open face models turn a built-in camera into head and eye tracking, so a display with no tracker of its own shows the scene from where you are.",
        ],
      },
      {
        title: "Works with",
        bullets: [
          "Any display that does not track the viewer itself",
          "Displays with their own tracker: theirs takes precedence, automatically",
        ],
      },
      {
        title: "Where it runs",
        paragraphs: [
          "On your device. Only eye positions come out of it, and the DisplayXR runtime keeps those on your device.",
        ],
      },
    ],
  },

  // Workspaces
  {
    id: "shell",
    category: "workspaces",
    name: shell.name,
    publisher: "DisplayXR",
    blurb: "A reference workspace: several apps in 3D windows, 2D and 3D together.",
    lead: "Several apps in 3D windows on one spatial display, 2D and 3D together. The reference implementation of the workspace layer, in preview.",
    platforms: shell.platforms,
    ...(shell.version ? { version: shell.version } : {}),
    chips: [{ label: "Preview" }],
    get: {
      label: "Get it",
      href: DOWNLOAD_HREF,
      note: "A standalone installer, with the individual components on the Download page.",
    },
    hostedBy: { label: "Its GitHub releases", href: shell.releaseUrl },
    needs: "DisplayXR",
    runs: "On your machine",
  },

  // Apps
  ...appsShelf,

  // SDKs and starter kits
  {
    id: "web-sdk",
    category: "sdks",
    name: "Web SDK (@displayxr/inline3d)",
    publisher: "DisplayXR",
    blurb: "Turn any canvas into a 3D window with a few lines of JavaScript. In other browsers the same page shows in 2D, so it is safe to ship anywhere.",
    version: INLINE3D_VERSION,
    openSource: true,
    get: { label: "Get started", href: "/browser#build" },
    hostedBy: { label: "Samples and source", href: REPO_URLS.web },
    needs: "DisplayXR Browser, for 3D",
  },
  {
    id: "unity",
    category: "sdks",
    name: `${unity.name} plug-in`,
    publisher: "DisplayXR",
    blurb: "DisplayXR for Unity: add the package and your project renders on spatial displays.",
    ...(unity.version ? { version: unity.version } : {}),
    ...(unity.engineVersion ? { detail: unity.engineVersion } : {}),
    openSource: true,
    get: { label: "Get it", href: unity.releaseUrl ?? unity.repoUrl },
    more: { label: "Engines on Developers", href: "/developers" },
    hostedBy: { label: "Its GitHub repository", href: unity.repoUrl },
  },
  {
    id: "unreal",
    category: "sdks",
    name: `${unreal.name} plug-in`,
    publisher: "DisplayXR",
    blurb: "DisplayXR for Unreal Engine: add the plug-in and your project renders on spatial displays.",
    ...(unreal.version ? { version: unreal.version } : {}),
    ...(unreal.engineVersion ? { detail: unreal.engineVersion } : {}),
    openSource: true,
    get: { label: "Get it", href: unreal.releaseUrl ?? unreal.repoUrl },
    more: { label: "Engines on Developers", href: "/developers" },
    hostedBy: { label: "Its GitHub repository", href: unreal.repoUrl },
  },
  {
    id: "vendor-template",
    category: "sdks",
    name: "Display plug-in template",
    publisher: "DisplayXR",
    blurb: `For display makers. ${vendorTemplate.note}`,
    openSource: true,
    get: { label: "Get it", href: vendorTemplate.href ?? REPO_URLS.vendorTemplate },
    more: { label: "The component model", href: "/components#display-processors" },
  },
  {
    id: "input-template",
    category: "sdks",
    name: inputTemplate.name,
    publisher: "DisplayXR",
    blurb: inputTemplate.note,
    openSource: true,
    get: { label: "Get it", href: inputTemplate.href ?? "/components#input-providers" },
    more: { label: "The component model", href: "/components#input-providers" },
  },
  {
    id: "conversion-template",
    category: "sdks",
    name: convTemplate.name,
    publisher: "DisplayXR",
    blurb: repoBlurb("displayxr-conversion-template"),
    openSource: true,
    get: { label: "Get it", href: convTemplate.href ?? REPO_URLS.conversionTemplate },
    more: { label: "The component model", href: "/components#conversion-providers" },
  },
];

/** The landing page's "A good place to start" row, in order. */
export const STARTER_IDS = [
  "conversion-open",
  "shell",
  "gallery",
  "browser",
  "mediaplayer",
  "gaussiansplat",
] as const;

// --- "How it works" -----------------------------------------------------------
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

// --- "Selling a component" ----------------------------------------------------
// Three lines for vendors, under "Open for publishers". It states the model
// only: no license states, no activation steps (those are a vendor's own UI).
export const PAID_POINTS: { title: string; text: string }[] = [
  { title: "Install is free", text: "Anyone can install your component. No account, no sign-in." },
  { title: "You sell it", text: "On your own site, at your own price, to your own customers." },
  { title: "DisplayXR takes no cut", text: "No fee, no revenue share, no payment passing through DisplayXR." },
];

// --- "Which converter runs" (the 2D-to-3D category's side panel) -------------
export const CONVERTER_LADDER: { lead: string; rest: string }[] = [
  { lead: "Your choice", rest: " comes first." },
  { lead: "Otherwise the best converter", rest: " that is installed and ready." },
  { lead: "The open-model converter", rest: " is always there as the base." },
];

// --- "Open for publishers": shelves waiting for their first item -------------
export interface PublisherSlot {
  category: CategoryId;
  title: string;
  text: string;
  href: string;
}

export const PUBLISHER_SLOTS: PublisherSlot[] = [
  {
    category: "companions",
    title: "Be the first companion app",
    text: "Pair a phone or tablet with every spatial display.",
    href: COMPONENT_INQUIRY,
  },
  {
    category: "input",
    title: "Be the first stylus",
    text: "The runtime serves the standard stylus profile: your pen works in every app.",
    href: "/components#input-providers",
  },
  {
    category: "viewer-tracking",
    title: "Be the first hardware tracker",
    text: "Bring look-around to every display that has no tracker of its own.",
    href: "/components#viewer-tracking",
  },
  {
    category: "workspaces",
    title: "Be the first vertical workspace",
    text: "A workspace built for one job: review, design, retail.",
    href: COMPONENT_INQUIRY,
  },
];

// --- accessors ---------------------------------------------------------------

export const categoryById = (id: string) => CATEGORIES.find((c) => c.id === id);
export const itemsIn = (id: CategoryId) => ITEMS.filter((i) => i.category === id);
export const itemById = (category: string, id: string) =>
  ITEMS.find((i) => i.category === category && i.id === id);
export const itemHref = (i: CatalogItem) => `/catalog/${i.category}/${i.id}`;

/** Only categories with at least one item get a page. */
export const LISTED_CATEGORIES = CATEGORIES.filter((c) => itemsIn(c.id).length > 0);

export const starterItems = (): CatalogItem[] =>
  STARTER_IDS.map((id) => {
    const i = ITEMS.find((x) => x.id === id);
    if (!i) throw new Error(`catalog.ts: starter item "${id}" is not in ITEMS`);
    return i;
  });

// Slugs are unique within a category; fail the build on a collision.
{
  const seen = new Set<string>();
  for (const i of ITEMS) {
    const key = `${i.category}/${i.id}`;
    if (seen.has(key)) throw new Error(`catalog.ts: duplicate item "${key}"`);
    seen.add(key);
  }
}
