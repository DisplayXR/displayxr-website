// Authored content for the web story: the browser, the @displayxr/inline3d
// SDK, and the use-case grid. Shared by /web, /developers and the homepage's
// "3D on the web" section so the three never drift apart.
import { INLINE3D_VERSION } from "@/lib/constants";
import { components, type ComponentDownload } from "@/lib/data/generated";

export const HELLO_WORLD_INSTALL = `npm install @displayxr/inline3d@${INLINE3D_VERSION} playcanvas`;

// The smallest complete page: a 3D product viewer. Same code everywhere; it
// is 3D in the DisplayXR Browser on a spatial display and an ordinary,
// orbitable 2D view in every other browser.
export const HELLO_WORLD = `<canvas id="chair" width="960" height="640"></canvas>

<script type="module">
  import { createInline3D } from '@displayxr/inline3d';
  import { addModel } from '@displayxr/inline3d/model';

  // 3D in the DisplayXR Browser on a spatial display, 2D everywhere else
  const wall = await createInline3D();
  const canvas = document.getElementById('chair');
  addModel(wall, canvas, 'chair.glb', { environment: 'studio' });
</script>`;

export type SdkModule = {
  path: string;
  what: string;
  /** Preview tier: options can change in a minor release (SDK docs/sdk-stability.md). */
  preview?: boolean;
};

// Subpath exports of @displayxr/inline3d. Only the core and /three are
// semver-frozen; everything else is preview tier and is labelled so.
export const SDK_MODULES: SdkModule[] = [
  { path: "@displayxr/inline3d", what: "The core: 3D photos (addImage), 3D video (addVideo) and live WebGL scenes (addScene). Dependency-free." },
  { path: "/three", what: "three.js glue: an off-axis eye camera, edge feathering, display and camera rigs." },
  { path: "/model", what: "A glTF / GLB viewer: auto-framed, idle turntable, drag to orbit. Draco, meshopt and KTX2 load too.", preview: true },
  { path: "/player", what: "A 3D movie player with transport controls: side-by-side, top-bottom or mono.", preview: true },
  { path: "/call", what: "A drop-in video-call element for up to four people, with no accounts.", preview: true },
  { path: "/splat", what: "Gaussian splats: captured places and objects as a 3D tile.", preview: true },
  { path: "/viewer", what: "Framing, orbit and idle turntable for scene viewers.", preview: true },
];

export type UseCase = {
  id: "shop" | "watch" | "call" | "photos";
  title: string;
  body: string;
  /** SDK entry point that delivers it. */
  module: string;
  sample: string;
};

// From the browser feature catalog (2026-10-04). Guardrails that shape this
// copy: model / player / call are preview tier; call depth comes only from a
// stereo-camera sender (plain webcams stay 2D); 3D movies means self-hosted
// SBS / top-bottom video (no DRM, so no commercial streaming services); the
// storefront demo is not linked until it has our own assets.
export const USE_CASES: UseCase[] = [
  {
    id: "shop",
    title: "Shop",
    body: "See the product, not a photo of it. A 3D viewer for the glTF models your store already serves, right in the product page.",
    module: "/model",
    sample: "samples/model/",
  },
  {
    id: "watch",
    title: "Watch",
    body: "3D movies, right in the page. Side-by-side and top-bottom 3D video plays in 3D, with ordinary player controls.",
    module: "/player",
    sample: "samples/player/",
  },
  {
    id: "call",
    title: "Call",
    body: "A video call with real depth. A caller with a stereo camera appears in 3D; everyone else joins in 2D from any browser.",
    module: "/call",
    sample: "samples/call-embed/",
  },
  {
    id: "photos",
    title: "Photos",
    body: "3D photos, the way they were taken. Stereo photos show in 3D in a feed, and as ordinary photos everywhere else.",
    module: "@displayxr/inline3d",
    sample: "samples/wall-3d/",
  },
];

export const browser = components.find((c) => c.id === "browser");
export const bundle = components.find((c) => c.id === "installer");

/** Where the DisplayXR Browser stands on each OS, for chips and download states. */
export type BrowserAvailability = {
  os: "Windows" | "macOS" | "Linux" | "Android" | "iOS";
  state: "available" | "coming-soon" | "unavailable";
  download?: ComponentDownload;
};

export function browserAvailability(): BrowserAvailability[] {
  const dl = (p: ComponentDownload["platform"]) =>
    browser?.downloads.find((d) => d.platform === p);
  const shipped = (p: ComponentDownload["platform"]): BrowserAvailability =>
    dl(p)
      ? { os: p, state: "available", download: dl(p) }
      : // macOS: code exists, no released asset yet (David, 2026-10-04).
        { os: p, state: p === "macOS" ? "coming-soon" : "unavailable" };
  return [
    shipped("Windows"),
    shipped("Android"),
    shipped("Linux"),
    shipped("macOS"),
    { os: "iOS", state: "unavailable" },
  ];
}
