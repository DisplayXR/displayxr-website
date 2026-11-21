// The DisplayXR Catalog (/catalog): one list of everything that plugs into
// DisplayXR. This file is the single source for its categories and items.
//
// Rules for this file (they are the page's honesty, not style):
//   - Only real items, and every fact comes from data the site already
//     carries: versions and platforms from lib/data/generated (the org sync),
//     names and notes from lib/data/components.ts, apps.ts and ecosystem.ts.
//     A fact the site does not have is left out, never typed in here.
//   - `verified` means signed AND conformance-tested for the item's component
//     class. The site asserts that for nothing yet, so no item sets it.
//   - Nothing is labelled "Community", ranked, rated, counted or priced.
//   - Games are not items. The Games shelf (/catalog/games) renders the same
//     records /play uses, from lib/data/play.ts.
//   - Install goes through /download or the publisher's own release. The
//     `displayxr-cli install <id>` verb is not shipped; the page marks it so.
import { components as releases, demos, engines } from "@/lib/data/generated";
import { componentClasses, type ComponentImpl } from "@/lib/data/components";
import { ecosystemRepos } from "@/lib/data/ecosystem";
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
  /** The caveat, shown as a tooltip and read out to screen readers. */
  title?: string;
}

export interface CatalogSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

/** A licence the vendor sells and activates itself. DisplayXR is not a party. */
export interface CatalogLicence {
  vendor: string;
  /** The item that takes over when this one is not licensed. */
  fallbackName: string;
}

export interface CatalogItem {
  /** URL slug under its category. A route name, not an install id. */
  id: string;
  category: CategoryId;
  name: string;
  publisher?: string;
  /** One or two lines for cards and rows. */
  blurb: string;
  /** Item page lead; falls back to `blurb`. */
  lead?: string;
  /** "Windows · macOS · Linux", as the site's data states it. */
  platforms?: string;
  version?: string;
  /** Short mono line on a row, e.g. the tasks a converter serves. */
  detail?: string;
  /** Signed and conformance-tested. Unset everywhere today (see header). */
  verified?: true;
  forDevelopers?: true;
  openSource?: true;
  chips?: CatalogChip[];
  /** Caveats the site already states about this item, shown under Trust. */
  trustNotes?: string[];
  /** The primary action in the facts panel. */
  get: CatalogLink & { note?: string };
  /** A second action, e.g. the product page on this site. */
  more?: CatalogLink;
  hostedBy?: CatalogLink;
  needs?: string;
  runs?: string;
  sections?: CatalogSection[];
  licence?: CatalogLicence;
}

// Same URL lib/data/ecosystem.ts lists for the repo; REPO_URLS has no key for it.
const TRACKING_OPEN_REPO = `${GITHUB_ORG_URL}/displayxr-tracking-open`;

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
      text: "Start from the vendor template: it builds with no vendor SDK, and you replace one function, the weave.",
      cta: "Start from the vendor template",
      href: REPO_URLS.vendorTemplate,
    },
  },
  {
    id: "input",
    label: "Input",
    title: "Input",
    lead: "Input providers bring hands, controllers, styluses and navigation devices into the standard OpenXR action system. Apps read them without knowing where the poses came from.",
    icon: "pen",
    invite: {
      title: "Shipping a controller, stylus or tracker?",
      text: "The input-provider template is a starter kit with no vendor SDK: a stylus provider, a headless smoke test and an installer that registers it.",
      cta: "Start from the input-provider template",
      href: REPO_URLS.inputTemplate,
    },
  },
  {
    id: "2d-to-3d",
    label: "2D-to-3D",
    title: "2D-to-3D converters",
    lead: "A converter turns ordinary photos and video into 3D. Install one and every DisplayXR app can ask for it. Apps never ship a model themselves.",
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
    lead: "Look-around from a webcam or any tracker, for displays without their own eye tracker. When a display tracks the viewer itself, its own tracker wins.",
    icon: "eye",
    invite: {
      title: "Make a depth camera or a tracker?",
      text: "A tracker for displays that have none of their own reaches every one of them through a single component.",
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
    lead: "A workspace arranges several apps on one spatial display: placement, focus and layouts, 2D and 3D side by side. A workspace is a separate program that registers with the DisplayXR runtime.",
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
    lead: "Apps that run on a spatial display through DisplayXR: installed apps, and web apps that show their 3D in the DisplayXR Browser.",
    icon: "grid",
    invite: {
      title: "Built an app on DisplayXR?",
      text: "Tell us where it lives and it can be listed here. You host it and keep your users.",
      cta: "Tell us in Discussions",
      href: DISCUSSIONS_URL,
    },
  },
  {
    id: "sdks",
    label: "SDKs",
    title: "SDKs and starter kits",
    lead: "What you build with: the web SDK, the engine plug-ins, and a starter kit for each kind of component. Each one links out to where it lives.",
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

// /components qualifies some implementations with a chip such as
// "build-verified". The Catalog carries the caveat as a sentence in the
// item's Trust block instead: a chip with "verified" in it would read as the
// Verified label, which no item has.
const caveatOf = (i: ComponentImpl): string[] => (i.chip ? [`${i.chip.title}.`] : []);

export const FOR_DEVELOPERS_NOTE =
  "A reference implementation for building and testing, not something to install for everyday use.";
const WITH_RUNTIME: CatalogItem["get"] = {
  label: "Included with DisplayXR",
  href: DOWNLOAD_HREF,
  note: "Ships inside the DisplayXR runtime. There is nothing separate to install.",
};

// --- the items ---------------------------------------------------------------

const leiaDp = impl("display-processors", "Leia SR display processor");
const simDisplay = impl("display-processors", "sim_display");
const simInput = impl("input-providers", "sim_input");
const netInput = impl("input-providers", "net_input");
const ultraleap = impl("input-providers", "Ultraleap hand tracking");
const openConv = impl("conversion-providers", "Open-model provider");
const leiaConv = impl("conversion-providers", "Leia conversion provider");
const simConv = impl("conversion-providers", "DisplayXR-SimConversion");
const vendorTemplate = impl("display-processors", "Vendor template");
const inputTemplate = impl("input-providers", "Input-provider template");
const convTemplate = impl("conversion-providers", "Conversion template");

const shell = release("shell");
const browser = release("browser");
const leiaRelease = release("leia_plugin");
const unity = engine("unity");
const unreal = engine("unreal");
const mediaPlayerPro = app("media-player-pro");

/** Web apps from /apps: live sites, opened in the DisplayXR Browser for 3D. */
const webApps: CatalogItem[] = (["chat", "gallery", "ride"] as const).map((id) => {
  const a = app(id);
  return {
    id,
    category: "apps",
    name: a.name,
    publisher: "DisplayXR",
    blurb: a.tagline,
    detail: a.builtOn,
    chips: [{ label: "Web app", title: "A live site. Nothing to install beyond the DisplayXR Browser." }],
    get: {
      label: a.urlLabel,
      href: a.url,
      note: "Opens the live site. In the DisplayXR Browser on a spatial display it is in 3D; in other browsers it is in 2D.",
    },
    ...(a.page ? { more: { label: "About this app", href: a.page } } : {}),
    needs: "DisplayXR Browser, to see it in 3D",
    runs: "In the browser",
  };
});

/** Installed demo apps, straight from the org sync (one card per demo repo). */
const DEMO_BLURBS: Record<string, string> = {
  // The generated one-liner says "3D displays"; the Catalog says what it plays.
  mediaplayer: "Plays stereo photos and video on a spatial display.",
};

const demoApps: CatalogItem[] = demos.map((d) => ({
  id: d.id,
  category: "apps" as const,
  name: d.name,
  publisher: "DisplayXR",
  blurb: DEMO_BLURBS[d.id] ?? d.description,
  ...(d.tag ? { version: d.tag } : {}),
  openSource: true as const,
  get: {
    label: "Get it from its release",
    href: d.releaseUrl ?? d.repoUrl,
    note: "The installer is on the app's own release page. Install DisplayXR first.",
  },
  more: { label: "All demos", href: "/demos" },
  hostedBy: { label: "Its GitHub releases", href: `${d.repoUrl}/releases` },
  needs: "DisplayXR runtime",
  runs: "On your machine",
}));

export const ITEMS: CatalogItem[] = [
  // Displays
  {
    id: "leia-sr",
    category: "displays",
    name: leiaDp.name,
    blurb: leiaDp.note,
    lead: "The display plug-in for Leia SR hardware. The DisplayXR runtime finds it at startup, and every DisplayXR app then shows 3D on that display.",
    platforms: leiaRelease.platforms,
    ...(leiaRelease.version ? { version: leiaRelease.version } : {}),
    get: {
      label: "Install with DisplayXR",
      href: DOWNLOAD_HREF,
      note: "The DisplayXR installer on the Download page sets it up with the runtime.",
    },
    hostedBy: { label: "Its GitHub releases", href: leiaRelease.releaseUrl },
    needs: "DisplayXR runtime",
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
          "The DisplayXR Browser, the Shell and the engine plug-ins",
        ],
      },
    ],
  },
  {
    id: "sim-display",
    category: "displays",
    name: simDisplay.name,
    publisher: "DisplayXR",
    blurb: simDisplay.note,
    lead: "The simulated display, for developers. It behaves like a real one in an ordinary window, so you can build and test with no spatial display on the desk.",
    platforms: "Windows · macOS · Linux · Android",
    forDevelopers: true,
    openSource: true,
    get: WITH_RUNTIME,
    more: { label: "Developers", href: "/developers" },
    needs: "DisplayXR runtime",
    runs: "On your machine",
    sections: [
      {
        title: "What it does",
        paragraphs: [
          "It stands in for a panel. When no real display hardware is present, the runtime uses it, and it always gives way to real hardware.",
        ],
      },
    ],
  },

  // Input
  {
    id: "ultraleap",
    category: "input",
    name: ultraleap.name,
    blurb: ultraleap.note,
    lead: "Tracked hands from an Ultraleap device, delivered to apps through the standard OpenXR action system.",
    trustNotes: caveatOf(ultraleap),
    openSource: true,
    get: {
      label: "See the source",
      href: ultraleap.href ?? REPO_URLS.runtime,
      note: "Built from the runtime source where the Ultraleap SDK is installed. There is no separate installer.",
    },
    needs: "DisplayXR runtime and the Ultraleap SDK",
    runs: "On your machine",
  },
  {
    id: "sim-input",
    category: "input",
    name: simInput.name,
    publisher: "DisplayXR",
    blurb: `The reference input provider. ${simInput.note}`,
    forDevelopers: true,
    openSource: true,
    get: WITH_RUNTIME,
    needs: "DisplayXR runtime",
    runs: "On your machine",
  },
  {
    id: "net-input",
    category: "input",
    name: netInput.name,
    publisher: "DisplayXR",
    blurb: netInput.note,
    forDevelopers: true,
    openSource: true,
    get: WITH_RUNTIME,
    ...(netInput.href ? { hostedBy: { label: "Source in the runtime", href: netInput.href } } : {}),
    needs: "DisplayXR runtime",
    runs: "On your machine",
  },

  // 2D-to-3D
  {
    id: "conversion-open",
    category: "2d-to-3d",
    name: "Open-model converter",
    publisher: "DisplayXR",
    blurb: "Depth from photos and video with open models, so every machine can have a converter without a vendor module.",
    lead: "Turns photos and video into 3D using open models. Install it once and every DisplayXR app on the machine can convert.",
    detail: "depth",
    trustNotes: caveatOf(openConv),
    openSource: true,
    get: {
      label: "Get it from its releases",
      href: `${REPO_URLS.conversionOpen}/releases`,
      note: "The installer is on the project's own release page. Install DisplayXR first.",
    },
    hostedBy: { label: "Its GitHub releases", href: `${REPO_URLS.conversionOpen}/releases` },
    needs: "DisplayXR runtime",
    runs: "On your machine",
    sections: [
      {
        title: "What it does",
        paragraphs: [
          "Give it an ordinary picture or a video and it works out depth, which is what a spatial display needs to show it in 3D.",
          "Its models are open and permissively licensed. The runtime's model store fetches each model pack and verifies it by checksum before use.",
        ],
      },
      {
        title: "Works with",
        bullets: [
          "Any spatial display that has a DisplayXR display plug-in",
          "Any app that asks DisplayXR to convert. Apps never ship a model themselves",
          "Other converters: the runtime picks one per kind of job, and this one stays installed beside them",
        ],
      },
      {
        title: "Where it runs",
        paragraphs: [
          "On your machine, in a separate host process that DisplayXR starts and supervises, so a model that crashes cannot take the runtime with it.",
        ],
      },
    ],
  },
  {
    id: "leia-conversion",
    category: "2d-to-3d",
    name: leiaConv.name,
    blurb: "The display vendor's own 2D-to-3D module, hosted by the DisplayXR runtime in a separate process.",
    platforms: "Windows",
    get: {
      label: "See its repository",
      href: leiaConv.href ?? REPO_URLS.leiaPlugin,
    },
    needs: "DisplayXR runtime",
    runs: "On your machine",
  },
  {
    id: "sim-conversion",
    category: "2d-to-3d",
    name: simConv.name,
    publisher: "DisplayXR",
    blurb: `The reference converter, for developers. ${simConv.note}`,
    lead: "The reference converter, for developers. It runs no model: it exists to test an app's conversion path.",
    forDevelopers: true,
    openSource: true,
    get: WITH_RUNTIME,
    ...(simConv.href ? { hostedBy: { label: "Source in the runtime", href: simConv.href } } : {}),
    needs: "DisplayXR runtime",
    runs: "On your machine",
  },

  // Viewer tracking
  {
    id: "tracking-open",
    category: "viewer-tracking",
    name: "Camera viewer tracking",
    publisher: "DisplayXR",
    blurb: "Look-around from an ordinary camera, for displays that have no eye tracker of their own.",
    lead: "Head and eye positions from an ordinary camera with open models, for displays that do not track the viewer themselves.",
    platforms: "macOS (Apple silicon)",
    openSource: true,
    get: {
      label: "Get it from its releases",
      href: `${TRACKING_OPEN_REPO}/releases`,
      note: "The installer is on the project's own release page. Install DisplayXR first.",
    },
    hostedBy: {
      label: "Its GitHub releases",
      href: `${TRACKING_OPEN_REPO}/releases`,
    },
    needs: "DisplayXR runtime 2.58.0 or later",
    runs: "On your machine",
    sections: [
      {
        title: "What it does",
        paragraphs: [
          "Open face models turn a built-in camera into head and eye tracking, so a display with no tracker of its own still shows the scene from where you are.",
          "It ships first for macOS on Apple silicon, as an installer.",
        ],
      },
      {
        title: "Works with",
        bullets: [
          "Displays that do not track the viewer themselves",
          "A display that tracks the viewer itself always takes precedence",
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
    lead: "A reference implementation of the workspace layer: several apps in 3D windows, 2D and 3D together. A preview to try the workspace contract, not a product.",
    platforms: shell.platforms,
    ...(shell.version ? { version: shell.version } : {}),
    chips: [{ label: "Preview", title: "A preview to try the workspace contract, not a product." }],
    get: {
      label: "Install from Download",
      href: DOWNLOAD_HREF,
      note: "It ships as a standalone installer, listed with the individual components on the Download page.",
    },
    hostedBy: { label: "Its GitHub releases", href: shell.releaseUrl },
    needs: "DisplayXR runtime",
    runs: "On your machine",
  },

  // Apps
  {
    id: "browser",
    category: "apps",
    name: browser.name,
    publisher: "DisplayXR",
    blurb: "Browses the web as usual and shows 3D web content in depth on a spatial display.",
    lead: "A Chromium-based browser that renders the web normally and shows 3D web content in depth on a spatial display.",
    platforms: browser.platforms,
    ...(browser.version ? { version: browser.version } : {}),
    get: {
      label: "Install from Download",
      href: DOWNLOAD_HREF,
      note: "Install DisplayXR first, then the browser: on its own the browser shows 2D only.",
    },
    more: { label: "About the browser", href: "/browser" },
    hostedBy: { label: "Its GitHub releases", href: browser.releaseUrl },
    needs: "DisplayXR and a display plug-in, to see 3D",
    runs: "On your machine",
  },
  ...demoApps,
  {
    id: "media-player-pro",
    category: "apps",
    name: mediaPlayerPro.name,
    publisher: "DisplayXR",
    blurb: mediaPlayerPro.tagline,
    platforms: MPP_PLATFORMS.map((p) => p.os).join(" · "),
    version: MEDIA_PLAYER_PRO_VERSION,
    get: {
      label: mediaPlayerPro.urlLabel,
      href: mediaPlayerPro.url,
      note: "The installers are on the app's own release page. Install DisplayXR first.",
    },
    ...(mediaPlayerPro.page ? { more: { label: "About this app", href: mediaPlayerPro.page } } : {}),
    needs: "DisplayXR runtime",
    runs: "On your machine",
  },
  ...webApps,

  // SDKs and starter kits: link-outs
  {
    id: "web-sdk",
    category: "sdks",
    name: "Web SDK (@displayxr/inline3d)",
    publisher: "DisplayXR",
    blurb: "Turn any canvas into a 3D window with a few lines of JavaScript. In other browsers the same page shows in 2D.",
    version: INLINE3D_VERSION,
    openSource: true,
    get: { label: "Read the guide", href: "/browser#build" },
    hostedBy: { label: "Samples and source", href: REPO_URLS.web },
    needs: "DisplayXR Browser, to see it in 3D",
  },
  {
    id: "unity",
    category: "sdks",
    name: `${unity.name} plug-in`,
    publisher: "DisplayXR",
    blurb: "The DisplayXR plug-in for Unity, as a package you add to your project.",
    ...(unity.version ? { version: unity.version } : {}),
    ...(unity.engineVersion ? { detail: unity.engineVersion } : {}),
    openSource: true,
    get: { label: "Get it from its repository", href: unity.releaseUrl ?? unity.repoUrl },
    more: { label: "Engines on Developers", href: "/developers" },
    hostedBy: { label: "Its GitHub repository", href: unity.repoUrl },
  },
  {
    id: "unreal",
    category: "sdks",
    name: `${unreal.name} plug-in`,
    publisher: "DisplayXR",
    blurb: "The DisplayXR plug-in for Unreal Engine.",
    ...(unreal.version ? { version: unreal.version } : {}),
    ...(unreal.engineVersion ? { detail: unreal.engineVersion } : {}),
    openSource: true,
    get: { label: "Get it from its repository", href: unreal.releaseUrl ?? unreal.repoUrl },
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
    get: { label: "Open the template", href: vendorTemplate.href ?? REPO_URLS.vendorTemplate },
    more: { label: "The component model", href: "/components#display-processors" },
  },
  {
    id: "input-template",
    category: "sdks",
    name: inputTemplate.name,
    publisher: "DisplayXR",
    blurb: inputTemplate.note,
    openSource: true,
    get: { label: "Open the template", href: inputTemplate.href ?? "/components#input-providers" },
    more: { label: "The component model", href: "/components#input-providers" },
  },
  {
    id: "conversion-template",
    category: "sdks",
    name: convTemplate.name,
    publisher: "DisplayXR",
    blurb: repoBlurb("displayxr-conversion-template"),
    openSource: true,
    get: { label: "Open the template", href: convTemplate.href ?? REPO_URLS.conversionTemplate },
    more: { label: "The component model", href: "/components#conversion-providers" },
  },
];

/** The landing page's "A good place to start" row, in order. */
export const STARTER_IDS = [
  "conversion-open",
  "shell",
  "tracking-open",
  "browser",
  "mediaplayer",
  "gaussiansplat",
] as const;

// --- the vendor-licence layout ----------------------------------------------
// No paid item is listed yet, so this record is NOT in ITEMS and gets no
// route. It is rendered once, clearly labelled as an example, under "How
// listing works" on /catalog, through the same components an item page uses
// when an item carries `licence`. Listing the first real licensed item is
// then a data change, with no new layout to build.
export const LICENCE_EXAMPLE: CatalogItem = {
  id: "example-licensed-converter",
  category: "2d-to-3d",
  name: "A vendor's converter",
  blurb: "A vendor's converter for video. Installs free; runs with a licence from the vendor.",
  get: { label: "Install (free)", href: "/catalog" },
  licence: { vendor: "the vendor", fallbackName: "Open-model converter" },
};

export interface LicenceState {
  state: string;
  tone: "blue" | "green" | "yellow" | "gray";
  what: string;
  action: (vendor: string) => string;
}

export const LICENCE_STATES: LicenceState[] = [
  { state: "Trial", tone: "blue", what: "Working. The trial's end date is shown here.", action: (v) => `Buy from ${v}` },
  { state: "Licensed", tone: "green", what: "Working. This is the converter your apps use.", action: (v) => `Manage at ${v}` },
  { state: "Expired", tone: "yellow", what: "Stepped aside. Your next converter has taken over.", action: (v) => `Renew at ${v}` },
  { state: "Unlicensed", tone: "gray", what: "Installed, not active. Your next converter is in use.", action: () => "Paste a key" },
];

export const LICENCE_ACTIVATION: { title: string; text: (vendor: string) => string }[] = [
  {
    title: "Come back from checkout.",
    text: (v) => `Finish at ${v} and its page hands you back to DisplayXR, already activated.`,
  },
  { title: "Or paste a key.", text: () => "Open the item in DisplayXR and paste the key the vendor gave you." },
];

// --- "Which converter runs" (the 2D-to-3D category's side panel) -------------
export const CONVERTER_LADDER: { lead: string; rest: string }[] = [
  { lead: "The one you chose", rest: ", if you chose one." },
  { lead: "Your display maker's", rest: ", when its display is connected." },
  { lead: "Any other installed converter", rest: " that is ready." },
  { lead: "The open-model converter", rest: ", as the one that is always there." },
];

// --- "Open for publishers": shelves with nothing on them yet -----------------
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
    text: "A phone or tablet app that pairs with a spatial display.",
    href: COMPONENT_INQUIRY,
  },
  {
    category: "input",
    title: "Be the first stylus",
    text: "The runtime serves the standard stylus interaction profile for any vendor's pen.",
    href: "/components#input-providers",
  },
  {
    category: "viewer-tracking",
    title: "Be the first hardware tracker",
    text: "A depth camera or tracker for displays without their own.",
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
