// Authored content for /browser, the DisplayXR Browser's product page.
// Sources: the browser feature catalog (verified against browser v1.3.1 and
// SDK 1.29.0) and the /browser design spec, both 2026-10-04. Every claim here
// follows the catalog's guardrails; keep the platform qualifiers.
import { GALLERY_URL, INLINE3D_VERSION, WEB_SAMPLES_URL } from "@/lib/constants";

export type Flagship = {
  id: "gallery" | "shop" | "ride";
  name: string;
  url: string;
  story: string;
  uses: string[];
  image: string;
  /**
   * Pre-launch status (see the design spec §7). "cleared": final. "pending":
   * the card's media is a concept illustration and its copy is draft until
   * the open check is resolved; the site link stays (sites only, never repos).
   */
  status: "cleared" | "pending";
  pendingNote?: string;
};

export const FLAGSHIPS: Flagship[] = [
  {
    id: "gallery",
    name: "DisplayXR Gallery",
    url: GALLERY_URL,
    story: "A social feed of 3D photos and short 3D videos, shared by link.",
    uses: ["addImage", "addVideo", "lazy walls", "share by URL"],
    image: "/art/browser/uc-photos.webp",
    status: "pending",
    pendingNote: "Media: use only cleared feed content in captures.",
  },
  {
    id: "shop",
    name: "DisplayXR Shop",
    url: "https://displayxr-shop.vercel.app",
    story: "A full storefront where you look around a product before you buy it, plus a demo studio that makes a 3D item from one photo.",
    uses: ["addModel", "addSplat", "2D page over 3D"],
    image: "/art/browser/flagship-shop.webp",
    // Cleared by David 2026-10-04 as-is (third-party hero captures included).
    // The photo→3D studio runs on research-licensed models: always "demo".
    status: "cleared",
  },
  {
    id: "ride",
    name: "DisplayXR Ride",
    url: "https://displayxr-ride.vercel.app",
    story: "An in-car screen: an immersive scene, photoreal 3D maps and fly-to-destination.",
    uses: ["addSplat", "3D maps (gmp-map-3d)", "2D / 3D toggle"],
    image: "/art/browser/flagship-ride.webp",
    status: "cleared",
  },
];

export type Pillar = {
  id: string;
  title: string;
  body: string;
  icon: string;
  platforms: string;
  footnote?: string;
  link?: { label: string; href: string };
};

export const PILLARS: Pillar[] = [
  {
    id: "author",
    title: "Author 3D inline, with a few lines of JavaScript",
    body: "Turn any <canvas> into a 3D window. Products, scenes, photos and video sit in the page. In other browsers the same page shows them in 2D, so it is safe to ship anywhere.",
    icon: "/art/browser/icon-author.webp",
    platforms: "Windows · Android · Linux",
    link: { label: "Build for it", href: "#build" },
  },
  {
    id: "auto",
    title: "Existing 3D sites, in depth, automatically",
    body: "Pages built with three.js, PlayCanvas or Spark render in 3D with no change to the page. On for popular 3D sites, offered on the rest, and you stay in control per site.",
    icon: "/art/browser/icon-auto.webp",
    platforms: "Windows · Linux",
  },
  {
    id: "convert",
    title: "Turn photos and videos into 3D, on the fly",
    body: "Right-click an image or a video and choose Convert to 3D. It is converted right in the page.",
    icon: "/art/browser/icon-convert.webp",
    platforms: "Windows",
    footnote: "Live video conversion needs a display with a 2D-to-3D conversion module.",
  },
  {
    id: "embed",
    title: "Embed 3D in any site",
    body: "Drop-in viewers for products and captured places, a 3D movie player, 3D video calls anyone can join from any browser, and photoreal 3D maps.",
    icon: "/art/browser/icon-embed.webp",
    platforms: "Windows · Android · Linux",
    footnote: "Call depth comes from callers with a stereo camera; other callers appear in 2D.",
    link: { label: "3D maps in DisplayXR Ride", href: "https://displayxr-ride.vercel.app" },
  },
  {
    id: "share",
    title: "Share it with a link",
    body: "A 3D page is just a URL. Post it anywhere: people on a spatial display see depth, everyone else sees the page.",
    icon: "/art/browser/icon-share.webp",
    platforms: "Any browser can open it",
    link: { label: "See the Gallery", href: GALLERY_URL },
  },
];

const sample = (p: string) => `${WEB_SAMPLES_URL}samples/${p}/`;

// Tier 3 of "Examples": the SDK samples, grouped by what they teach.
// `anchor` = the section on the samples index (displayxr-web#123), which is
// also the DisplayXR Browser's startup page: the two tell the same story.
export const BUILDING_BLOCKS: { group: string; anchor: string; items: { name: string; href: string }[] }[] = [
  { group: "Start here", anchor: "start", items: [{ name: "hello-cube", href: sample("hello-cube") }, { name: "windows", href: sample("windows") }] },
  { group: "Media", anchor: "media", items: [{ name: "player", href: sample("player") }, { name: "wall-3d", href: sample("wall-3d") }, { name: "demo-gallery", href: sample("demo-gallery") }] },
  { group: "3D content", anchor: "content", items: [{ name: "model", href: sample("model") }, { name: "glTF from a store CDN", href: sample("shopify") }, { name: "splat", href: sample("splat") }] },
  { group: "Scenes and cameras", anchor: "scenes", items: [{ name: "camera-rig", href: sample("camera-rig") }, { name: "display-modes", href: sample("display-modes") }] },
  { group: "Communication", anchor: "calls", items: [{ name: "call", href: sample("call") }, { name: "call-embed", href: sample("call-embed") }] },
  { group: "Page composition", anchor: "composition", items: [{ name: "composition", href: sample("composition") }] },
];

// The developer layer: real snippets only (catalog §2, APIs per the 1.29.0
// .d.ts files). Each renders as a normal 2D page outside the DisplayXR Browser.
export const CODE_TABS: { id: string; label: string; code: string; sample: string }[] = [
  {
    id: "model",
    label: "Model",
    sample: sample("model"),
    code: `import { createInline3D } from '@displayxr/inline3d';
import { addModel } from '@displayxr/inline3d/model';

const wall = await createInline3D();     // 3D on a spatial display, 2D elsewhere
const hero = addModel(wall, document.querySelector('#product-hero'),
  'https://cdn.example.com/products/chair.glb',
  { environment: 'studio', idleSpin: 8 });
await hero.ready;`,
  },
  {
    id: "player",
    label: "Player",
    sample: sample("player"),
    code: `import { createInline3D } from '@displayxr/inline3d';
import { addPlayer } from '@displayxr/inline3d/player';

const wall = await createInline3D();
const player = addPlayer(wall, document.querySelector('#screen'),
  ['trailer-sbs.webm', 'trailer-sbs.mp4'],   // side-by-side 3D; 'tb' for top-bottom
  { format: 'sbs', poster: 'poster.jpg', controls: 'sdk' });
player.play();`,
  },
  {
    id: "call",
    label: "Call",
    sample: sample("call-embed"),
    code: `<script type="module"
  src="https://cdn.jsdelivr.net/npm/@displayxr/inline3d@${INLINE3D_VERSION}/dist/call.js"></script>

<dxr-call layout="speaker" max-peers="4"></dxr-call>`,
  },
  {
    id: "scene",
    label: "Scene",
    sample: sample("camera-rig"),
    code: `import { createInline3D } from '@displayxr/inline3d';
import { cameraRigFromCamera } from '@displayxr/inline3d/three';

const wall = await createInline3D();
const rig = cameraRigFromCamera(THREE, camera, { convergence: 1.2 });
const tile = wall.addScene(canvas, renderEachEye, { viewRig: rig });
// per frame: tile.setViewRig(cameraRigFromCamera(THREE, camera, { convergence: 1.2, out: rig }));`,
  },
  {
    id: "splat",
    label: "Splat",
    sample: sample("splat"),
    code: `import { createInline3D } from '@displayxr/inline3d';
import { addSplat } from '@displayxr/inline3d/splat';

const wall = await createInline3D();
const scene = addSplat(wall, document.querySelector('#scene'),
  'scenes/garden.sog', { engine: 'playcanvas', reveal: 'sweep' });
await scene.ready;`,
  },
];

// The single honest platform table (catalog §1a). A dash means "not offered
// or not verified": never claim a cell the release notes don't support.
export type Cell = "yes" | "no" | "soon";
export const MATRIX: { feature: string; cells: [Cell, Cell, Cell, Cell]; note?: string }[] = [
  { feature: "3D content in pages built with the SDK", cells: ["yes", "yes", "yes", "soon"] },
  { feature: "2D page chrome correctly over 3D", cells: ["yes", "yes", "yes", "soon"] },
  { feature: "Display follows the tab (3D page in front → 3D)", cells: ["yes", "no", "yes", "soon"] },
  { feature: "Existing three.js / PlayCanvas / Spark pages in 3D", cells: ["yes", "no", "yes", "soon"] },
  { feature: "Right-click Convert to 3D", cells: ["yes", "no", "no", "soon"], note: "Live video conversion needs a display with a 2D-to-3D conversion module." },
  { feature: "3D video calls (stereo-camera callers)", cells: ["yes", "no", "yes", "soon"] },
  { feature: "MP4 3D movies", cells: ["yes", "yes", "no", "soon"] },
  { feature: "Chrome-stable security updates", cells: ["yes", "yes", "yes", "soon"] },
];
export const MATRIX_OS = ["Windows", "Android", "Linux", "macOS"] as const;

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Can it be my everyday browser?",
    a: "Yes. It is Chromium, so every website works as usual, and it is rebuilt for every Chrome stable security release. On a computer without a spatial display it is simply a browser.",
  },
  {
    q: "Do websites need to change?",
    a: "Not for pages already built with three.js, PlayCanvas or Spark: on Windows and Linux those can show in 3D as they are. To put 3D into a page on purpose, a few lines of JavaScript with the SDK are enough.",
  },
  {
    q: "Can I watch Netflix in 3D?",
    a: "No. The browser does not include DRM, so commercial streaming services won't play. Self-hosted 3D video plays in 3D, and on Windows you can convert ordinary video with a right-click.",
  },
  {
    q: "What hardware do I need?",
    a: "A spatial display with a DisplayXR plug-in, with or without glasses. Install DisplayXR first, then the browser.",
  },
  {
    q: "Is it free? Is it open source?",
    a: "The browser is free. The SDK, the samples and the DisplayXR runtime underneath are open source; the browser itself is distributed as free installers. It is not affiliated with Google and has no Google sign-in or sync.",
  },
];
