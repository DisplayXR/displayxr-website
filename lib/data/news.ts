/**
 * Latest-updates feed ("What's new").
 *
 * AUTHORED DATA — this file is hand/agent-written and is NOT touched by
 * `scripts/sync-org.mjs`. Do not move it under `lib/data/generated/`; that
 * directory is machine-written and direct-committed to `main` by CI, and any
 * edit there is silently overwritten on the next sync.
 *
 * The mechanical half of the pipeline (detecting that *something happened*)
 * lives in the sync generator, which writes candidate events to
 * `lib/data/generated/news-candidates.json`. The editorial half — deciding
 * whether an event is news, and writing the sentence — is the `/sync-website`
 * skill in the `displayxr-runtime` hub, which promotes candidates into the
 * array below via a PR.
 *
 * ── What belongs here ────────────────────────────────────────────────────────
 * The test: can you state it as a capability that did not exist last month, in
 * ten words or fewer, without a version number? If the sentence collapses to
 * "we shipped a build", it is not news.
 *
 *   tier "banner"  First-of-kind. A new OS, graphics API, engine, vendor,
 *                  product surface, input class, standards milestone, or a
 *                  headline capability. Appears in the homepage ticker.
 *   tier "list"    Real but incremental — a named feature inside an existing
 *                  surface, a new demo, a distribution milestone. `/news` only.
 *   (excluded)     Version bumps with no named feature, bundle releases, ABI
 *                  bumps, ADRs with no user-visible effect, CI, refactors,
 *                  doc reorganisation, bug fixes. These never get an entry.
 *
 * Vendor names are allowed when the vendor *is* the news (a new vendor
 * onboarding, a new input source). Vendor version bumps are not news. The
 * homepage stays vendor-neutral in its own prose — see CLAUDE.md.
 *
 * `date` is the day the thing became true for a user (the release date, the
 * merge date upstream), not the day the entry was written. Ordering and
 * expiry both key off it.
 */

export type NewsKind =
  | "platform"
  | "graphics-api"
  | "engine"
  | "product"
  | "standards"
  | "vendor"
  | "capability"
  | "demo"
  | "community";

export type NewsTier = "banner" | "list";

export interface NewsItem {
  /** Stable slug — also the anchor on /news. Never recycle one. */
  id: string;
  /** ISO date the news became true for a user. */
  date: string;
  kind: NewsKind;
  tier: NewsTier;
  /** Benefit-first, <= 60 chars, no bare version number. */
  headline: string;
  /** One sentence of detail — shown on /news, not in the ticker. */
  blurb?: string;
  /** Where the headline points: a release, spec, doc, or demo page. */
  href: string;
  /**
   * Rare manual override — keeps an item in the ticker past the normal
   * window (e.g. a launch you want to run through an event). ISO date.
   */
  pinnedUntil?: string;
  /**
   * Ticker ordering weight. Default 0; higher sorts first, ties fall back to
   * date. Use `1` and only for a genuine landmark — something whose importance
   * outlives the news cycle it shipped in.
   *
   * This exists because recency alone cannot express "this one matters more".
   * The Khronos author-ID registration lost a ticker slot to a browser version
   * bump that shipped six days later, which is the wrong outcome.
   *
   * Deliberately scoped: it reorders the ticker ONLY. It does not extend the
   * freshness window (that is `pinnedUntil`), and it does not reorder /news,
   * which stays strictly chronological so the archive reads as a timeline.
   * Every item being a landmark means none of them are — keep this rare.
   */
  priority?: number;
}

/** How long a banner item stays in the homepage ticker. */
export const BANNER_MAX_AGE_DAYS = 90;

/** Never show more than this many at once, however much has shipped. */
export const BANNER_MAX_ITEMS = 4;

export const NEWS_KIND_LABELS: Record<NewsKind, string> = {
  platform: "Platform",
  "graphics-api": "Graphics API",
  engine: "Engine",
  product: "Product",
  standards: "Standards",
  vendor: "Vendor",
  capability: "Capability",
  demo: "Demo",
  community: "Community",
};

/**
 * Reverse-chronological. Newest first — keep it that way when adding.
 */
export const NEWS: NewsItem[] = [
  {
    id: "multi-app-one-pipeline",
    date: "2026-08-18",
    kind: "capability",
    tier: "banner",
    headline: "Several spatial apps at once, switched with Alt-Tab",
    blurb:
      "The service now runs a single always-on compositor pipeline with one display processor per panel, so concurrent apps no longer contend for the lens — and every app on it behaves like an ordinary window: it appears in the taskbar and in Alt-Tab, focusing it hands it the display, and it can take the panel over a running spatial workspace and hand it back without either side being torn down.",
    href: "https://github.com/DisplayXR/displayxr-runtime/releases/tag/v2.7.0",
  },
  {
    id: "unreal-editor-3d-preview",
    date: "2026-08-15",
    kind: "engine",
    tier: "list",
    headline: "See weaved 3D inside the Unreal editor viewport",
    blurb:
      "Play-in-Editor previews the runtime’s woven output in the viewport tab itself and follows it live as panels and splitters move, so an Unreal scene can be checked on the display without packaging a build.",
    href: "https://github.com/DisplayXR/displayxr-unreal/releases/tag/v0.7.0",
  },
  {
    id: "mediaplayer-drop-and-detect",
    date: "2026-08-12",
    kind: "demo",
    tier: "list",
    headline: "Drop a stereo photo on the player and it just opens",
    blurb:
      "The spatial media player loads files and folders by drag-and-drop and works the stereo layout out from the file itself — container metadata first, then a pixel analysis calibrated on 2,380 real photos — rather than trusting the filename.",
    href: "https://github.com/DisplayXR/displayxr-demo-mediaplayer/releases/tag/v1.8.0",
  },
  {
    id: "unity-plugin-linux",
    date: "2026-08-09",
    kind: "platform",
    tier: "list",
    headline: "The Unity plug-in now builds and ships for Linux",
    blurb:
      "First Linux (x86_64) release of the Unity plug-in: the Vulkan backend is platform-parametric and deploys into a Linux player, verified against real weaving hardware. Preview — the primary stereo path only, with the runtime self-hosting its weave window.",
    href: "https://github.com/DisplayXR/displayxr-unity/releases/tag/v2.12.0",
  },
  {
    id: "browser-preview-chromium-151",
    date: "2026-08-06",
    kind: "product",
    tier: "banner",
    headline: "DisplayXR Browser: 3D on the open web",
    blurb:
      "A Chromium browser that weaves 3D content natively — now on Chromium 151, with the display following the foreground tab.",
    href: "https://github.com/DisplayXR/displayxr-browser/releases",
  },
  {
    id: "late-weave-pacing",
    date: "2026-08-03",
    kind: "capability",
    tier: "banner",
    headline: "Eye-position latency down to one display refresh",
    blurb:
      "Late-weave presentation pacing is default-on across every in-process present path — measured 62→17 ms on D3D12 and 96→17 ms on Vulkan — and Vulkan apps get it with no app-side code.",
    href: "https://github.com/DisplayXR/displayxr-runtime/releases/tag/v2.4.0",
  },
  {
    id: "input-provider-plugins",
    date: "2026-08-02",
    kind: "capability",
    tier: "banner",
    headline: "Motion controllers, from any tracking source",
    blurb:
      "A second plug-in type: input providers let an externally-shipped library expose tracked controllers to the runtime, discovered and ABI-gated exactly like display plug-ins. Ships with a reference provider and a documented network wire protocol.",
    href: "https://github.com/DisplayXR/displayxr-runtime/blob/main/docs/adr/ADR-034-input-provider-plugins.md",
  },
  {
    id: "khronos-cts-in-ci",
    date: "2026-08-02",
    kind: "standards",
    tier: "banner",
    headline: "The official OpenXR CTS runs on every release",
    blurb:
      "The Khronos conformance test suite is wired into CI and runs the full suite on release tags — and immediately caught a real conformance bug.",
    href: "https://github.com/DisplayXR/displayxr-runtime/releases/tag/v2.3.0",
  },
  {
    id: "ultraleap-input-provider",
    date: "2026-08-02",
    kind: "vendor",
    tier: "banner",
    headline: "Ultraleap hand tracking as motion controllers",
    blurb:
      "The first third-party input provider: Ultraleap hands surface through the standard OpenXR action system, with no app-side changes.",
    href: "https://github.com/DisplayXR/displayxr-runtime/releases/tag/v2.3.0",
  },
  {
    id: "igpu-optimus-support",
    date: "2026-08-02",
    kind: "platform",
    tier: "list",
    headline: "Every graphics API now works on Intel iGPU laptops",
    blurb:
      "Adapter-force overrides plus an NT-handle composition bridge fix transparent windows and multi-adapter setups on hybrid-GPU machines.",
    href: "https://github.com/DisplayXR/displayxr-runtime/releases/tag/v2.2.4",
  },
  {
    id: "wayland-windowed-weaving",
    date: "2026-08-02",
    kind: "platform",
    tier: "list",
    headline: "Wayland windowed weaving lands (preview)",
    blurb:
      "A vendor-shippable compositor geometry publisher lets the runtime weave into a window on Wayland, with a schema gate and a packaging contract.",
    href: "https://github.com/DisplayXR/displayxr-runtime/releases/tag/v2.3.0",
  },
  {
    id: "khronos-dxr-author-id",
    date: "2026-07-31",
    kind: "standards",
    tier: "banner",
    // The one landmark in the current pool: a standards-body registration
    // outlives the week it landed in, unlike everything above it by date.
    priority: 1,
    headline: "DXR is a registered OpenXR author ID",
    blurb:
      "Khronos accepted the registration, so The DisplayXR Project now holds the DXR tag in the official OpenXR registry and the XR_DXR_* extension namespace is reserved — the first formal step toward upstreaming the spatial-display extensions.",
    href: "https://github.com/KhronosGroup/OpenXR-Docs/pull/201",
  },
  {
    id: "unreal-plugin",
    // "list", not "banner": Unreal support already existed — this release
    // improved it. First-of-kind is the banner bar; a version is not.
    date: "2026-08-01",
    kind: "engine",
    tier: "list",
    headline: "Unreal Engine plug-in: zero-copy, adaptive N-view",
    blurb:
      "A first-class Unreal HMD plug-in that loads the runtime directly, hands the atlas over with no copy, and adapts its view count to the display.",
    href: "https://github.com/DisplayXR/displayxr-unreal/releases/tag/v0.6.0",
  },
  {
    id: "modelviewer-openpbr",
    date: "2026-07-31",
    kind: "capability",
    tier: "list",
    headline: "Model Viewer renders OpenPBR and all nine KHR_materials_*",
    blurb:
      "The reference model viewer now covers the full glTF PBR extension set — transmission, volume, clearcoat, sheen, iridescence and the rest — verified across platforms and view counts.",
    href: "https://github.com/DisplayXR/displayxr-demo-modelviewer/releases",
  },
  {
    id: "display-zones",
    date: "2026-07-26",
    kind: "capability",
    tier: "banner",
    headline: "Display zones: mixed 2D and 3D in one window",
    blurb:
      "Apps can declare several independent 3D regions alongside flat 2D content in a single window, each with its own render pass and swapchain.",
    href: "https://github.com/DisplayXR/displayxr-runtime/blob/main/docs/adr/ADR-027-display-zones.md",
  },
  {
    id: "inline3d-npm",
    date: "2026-07-20",
    kind: "product",
    tier: "list",
    headline: "@displayxr/inline3d 1.0 is on npm",
    blurb:
      "A drop-in web SDK for putting 3D content on any page, published to npm with zero-token trusted publishing.",
    href: "https://www.npmjs.com/package/@displayxr/inline3d",
  },
  {
    id: "linux-preview",
    date: "2026-07-06",
    kind: "platform",
    tier: "banner",
    headline: "DisplayXR runs on Linux — Vulkan and X11",
    blurb:
      "A native Vulkan compositor presenting over an X11 surface, hardware-validated and distributed as a tarball and Debian packages. Preview, ahead of GA.",
    href: "https://github.com/DisplayXR/displayxr-runtime/blob/main/docs/roadmap/linux-support.md",
  },
  {
    id: "array-layered-swapchains",
    date: "2026-07-02",
    kind: "capability",
    tier: "list",
    headline: "Array swapchains are first-class on every backend",
    blurb:
      "Single-pass-instanced apps can submit eyes as array layers instead of a tiled atlas, on all five graphics backends.",
    href: "https://github.com/DisplayXR/displayxr-runtime/blob/main/docs/adr/ADR-032-array-layered-swapchains-first-class.md",
  },
  {
    id: "macos-shell-beta",
    // "list": still true and still notable, but the oldest item in the pool —
    // it would age out of the ticker within weeks anyway.
    date: "2026-06-28",
    kind: "platform",
    tier: "list",
    headline: "The spatial shell comes to macOS (beta)",
    blurb:
      "The multi-app spatial workspace now ships for macOS as an installable package, alongside the native Metal, OpenGL and Vulkan compositors.",
    href: "https://github.com/DisplayXR/displayxr-shell-releases/releases",
  },
];

const DAY_MS = 24 * 60 * 60 * 1000;

function ageInDays(iso: string, now: Date): number {
  return (now.getTime() - new Date(`${iso}T00:00:00Z`).getTime()) / DAY_MS;
}

/**
 * The homepage ticker pool: banner-tier items still inside the freshness
 * window (or explicitly pinned), newest first, capped.
 *
 * Returns an empty array when nothing qualifies — the ticker then renders
 * nothing at all. A stale "latest news" strip is worse than none, so the
 * expiry is derived from `date` rather than left to someone remembering to
 * prune the list.
 *
 * Call this on the server and pass the result down, so the client never
 * evaluates a date and there is no hydration mismatch.
 */
export function getBannerNews(now: Date = new Date()): NewsItem[] {
  return NEWS.filter((item) => {
    if (item.tier !== "banner") return false;
    if (item.pinnedUntil && ageInDays(item.pinnedUntil, now) <= 0) return true;
    return ageInDays(item.date, now) <= BANNER_MAX_AGE_DAYS;
  })
    .sort(
      (a, b) =>
        (b.priority ?? 0) - (a.priority ?? 0) || b.date.localeCompare(a.date),
    )
    .slice(0, BANNER_MAX_ITEMS);
}

/** Everything, strictly newest first — `priority` does not apply here. */
export function getAllNews(): NewsItem[] {
  return [...NEWS].sort((a, b) => b.date.localeCompare(a.date));
}

/** Group for the archive page: "Q3 2026" -> items. */
export function groupNewsByQuarter(items: NewsItem[]): [string, NewsItem[]][] {
  const groups = new Map<string, NewsItem[]>();
  for (const item of items) {
    const d = new Date(`${item.date}T00:00:00Z`);
    const key = `Q${Math.floor(d.getUTCMonth() / 3) + 1} ${d.getUTCFullYear()}`;
    const bucket = groups.get(key);
    if (bucket) bucket.push(item);
    else groups.set(key, [item]);
  }
  return [...groups.entries()];
}

export function formatNewsDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
