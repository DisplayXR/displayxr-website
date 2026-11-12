// Authored content for /apps, the hub of apps built on DisplayXR, and its two
// product pages (/apps/chat, /apps/media-player-pro). One hub showing that the
// platform works, instead of a nav tab per product (David, 2026-11-10).
//
// Status chips follow PUBLIC releases only: "Live" for a public site, the
// latest public tag for a downloadable app, "Community" for apps made by
// others with the SDK. Shop and Show stay off this page until their licensing
// is decided.
import { FLAGSHIPS } from "@/lib/data/browser";

const flagship = (id: "gallery" | "ride") => {
  const f = FLAGSHIPS.find((x) => x.id === id);
  if (!f) throw new Error(`apps.ts: no FLAGSHIPS entry "${id}" in lib/data/browser.ts`);
  return f;
};

// --- Media Player Pro release pin -------------------------------------------
// Hand constant: pro-v* releases are not tracked by scripts/sync-org.mjs (the
// generated demo record follows the base Media Player's v* tags), so bump
// this when a new pro-v* release ships. Latest checked 2026-11-10 with
// `gh release list -R DisplayXR/displayxr-demo-mediaplayer`.
export const MEDIA_PLAYER_PRO_VERSION = "0.9.2";
export const MEDIA_PLAYER_REPO = "https://github.com/DisplayXR/displayxr-demo-mediaplayer";
export const MEDIA_PLAYER_PRO_RELEASE = `${MEDIA_PLAYER_REPO}/releases/tag/pro-v${MEDIA_PLAYER_PRO_VERSION}`;
export const MEDIA_PLAYER_PRO_ALL_RELEASES = `${MEDIA_PLAYER_REPO}/releases?q=pro-v&expanded=true`;

export const GALLERY_LIVE_URL = flagship("gallery").url;
export const CHAT_URL = "https://displayxr-chat.vercel.app";
export const APP_SHARE_ADR =
  "https://github.com/DisplayXR/displayxr-runtime/blob/main/docs/adr/ADR-061-3d-screen-share.md";
export const APP_SHARE_SPEC =
  "https://github.com/DisplayXR/displayxr-runtime/blob/main/docs/specs/extensions/XR_DXR_app_share.md";

export type AppStatus =
  | { kind: "live" }
  | { kind: "release"; version: string }
  | { kind: "community" };

export type AppCard = {
  id: string;
  name: string;
  tagline: string;
  /** What it is built on, one short line. */
  builtOn: string;
  status: AppStatus;
  /** Internal product page, when the app has one. */
  page?: string;
  /** Live site or download. */
  url: string;
  urlLabel: string;
  /** Existing art only; cards without art get a gradient treatment. */
  image?: string;
  imageNote?: string;
  /** Gradient for cards without art (Tailwind arbitrary background). */
  gradient?: string;
  byline?: string;
};

export const APPS: AppCard[] = [
  {
    id: "chat",
    name: "DisplayXR Chat",
    tagline: "Glasses-free 3D video chat for up to four people, peer to peer, with Share 3D for a running app.",
    builtOn: "Web SDK call element · DisplayXR Browser",
    status: { kind: "live" },
    page: "/apps/chat",
    url: CHAT_URL,
    urlLabel: "Open live",
    image: "/art/browser/uc-call.webp",
    imageNote: "Illustration",
  },
  {
    id: "media-player-pro",
    name: "Media Player Pro",
    tagline: "A 3D monitoring and QC station, built for on-set stereo 3D monitoring.",
    builtOn: "Native app on the DisplayXR runtime",
    status: { kind: "release", version: MEDIA_PLAYER_PRO_VERSION },
    page: "/apps/media-player-pro",
    url: MEDIA_PLAYER_PRO_RELEASE,
    urlLabel: "Download",
    image: "/media/mppro-station.webp",
    imageNote: "Test signal",
  },
  {
    id: "gallery",
    name: flagship("gallery").name,
    tagline: "A social wall of real stereo 3D photos, shared by link. Step into a photo with Spatial View.",
    builtOn: "Web SDK · any browser, 3D in the DisplayXR Browser",
    status: { kind: "live" },
    page: "/apps/gallery",
    url: flagship("gallery").url,
    urlLabel: "Open live",
    image: flagship("gallery").image,
    imageNote: "Illustration",
  },
  {
    id: "ride",
    name: flagship("ride").name,
    tagline: flagship("ride").story,
    builtOn: "Web SDK · any browser, 3D in the DisplayXR Browser",
    status: { kind: "live" },
    url: flagship("ride").url,
    urlLabel: "Open live",
    image: flagship("ride").image,
  },
  {
    id: "physics",
    name: "Physics in 3D",
    tagline: "Interactive physics, from high school to college, in depth on a spatial display.",
    builtOn: "Web SDK",
    status: { kind: "community" },
    url: "https://3dlaern.vercel.app",
    urlLabel: "Open live",
    byline: "Community · made with the SDK",
    gradient:
      "bg-[radial-gradient(600px_300px_at_75%_25%,rgba(245,158,11,0.28),rgba(5,5,7,0)_70%),radial-gradient(500px_260px_at_15%_85%,rgba(59,130,246,0.25),rgba(5,5,7,0)_70%)]",
  },
];

// --- /apps/chat ---------------------------------------------------------------
// Guardrails: no camera vendor or model, no customers, no display vendor, no
// private repos, never "open source", Windows/Android endpoints only (never
// macOS/Linux), no Teams/Zoom, no recording.

export const CHAT_FEATURES: { title: string; text: string }[] = [
  {
    title: "Up to four people",
    text: "A room holds up to four. Share its link; whoever opens it joins.",
  },
  {
    title: "Peer to peer",
    text: "Video goes straight between the people in the call. There is no recording.",
  },
  {
    title: "Built on the call element",
    text: "The whole call is the web SDK's call element, @displayxr/inline3d/call, in an ordinary web page.",
  },
  {
    title: "Depth where it exists",
    text: "A participant with a stereo camera sends depth. Everyone else sends a flat picture, and the call still works.",
  },
];

export const CHAT_REQUIREMENTS: string[] = [
  "To see 3D, each participant needs the DisplayXR Browser on a spatial display: DisplayXR Browser 1.9.2 or later and the DisplayXR runtime 2.62.0 or later.",
  "Other browsers can join and see everyone in 2D.",
  "Sending depth needs a stereo camera. Without one, a participant sends a flat picture.",
  "Four people per call at most. Calls are not recorded.",
  "Share 3D is Windows only. Apps that render with OpenGL inside their own process cannot be shared yet.",
];

// --- /apps/media-player-pro ---------------------------------------------------
// Guardrails: no customer names; never claim genlock or frame-accurate sync
// (sync is software-only); no performance numbers; DeckLink never in a product
// name, capture claimed on Windows only.

export const MPP_CAPABILITIES: { title: string; text: string }[] = [
  {
    title: "Live stereo capture",
    text: "Live stereo SDI capture, with left and right paired by timecode. A built-in test signal checks the chain without a camera.",
  },
  {
    title: "Rig checks with alerts",
    text: "Eye sync, vertical misalignment, skew and edge violations are checked on the live picture, with an alert when one drifts.",
  },
  {
    title: "Grading and color",
    text: "ACES and OCIO looks, LUTs, and a 10-bit path from input to display.",
  },
  {
    title: "QC tooling",
    text: "Scopes, a pixel probe, timecode burn-ins, A/B compare and wipes, snapshots with notes, QC reports, and a DaVinci Resolve timeline link.",
  },
  {
    title: "Streaming input",
    text: "HLS, DASH and adaptive bitrate streams, plus SRT.",
  },
  {
    title: "A live frame queue",
    text: "When source and display clocks drift, the queue gives up a single frame, never a burst. Soak-tested.",
  },
];

export const MPP_PLATFORMS: { os: string; artifact: string }[] = [
  { os: "Windows", artifact: "Signed installer" },
  { os: "macOS", artifact: ".pkg" },
  { os: "Linux", artifact: ".deb" },
];

// --- /apps/gallery --------------------------------------------------------------
// Source of truth: the Gallery's own upload flow and post view (checked
// 2026-11-10). Describe the EXPERIENCE only: never the algorithms, models,
// thresholds, hosting or vendors behind it. No individual users, no imported
// corpora, no third-party featured assets. Uploads take photos only today
// (video posts are switched off in the upload flow), so don't promise video
// uploads here.

export const GALLERY_FEATURES: { title: string; text: string }[] = [
  {
    title: "A wall of real stereo",
    text: "Every picture on the wall is a stereo pair taken by two cameras. In the DisplayXR Browser on a spatial display the wall is in 3D; anywhere else it is an ordinary photo site.",
  },
  {
    title: "Shared by link",
    text: "A post is a URL. Send it anywhere: people on a spatial display see depth, everyone else sees the photo.",
  },
  {
    title: "Social, the usual way",
    text: "Discover and Following feeds, likes, comments, saves, tags and profiles. A post can hold several pictures.",
  },
  {
    title: "Ways to view in 2D",
    text: "Without a spatial display, switch a post between flat, parallel or cross-eyed free-viewing, and red/cyan anaglyph.",
  },
];

export const GALLERY_SPATIAL_VIEW: string[] = [
  "Open a photo and turn on Spatial View. At rest it is the photo you took. Drag, and the scene turns around its subject so you can look at it from a new angle.",
  "On a phone, tilting the device moves your viewpoint, like moving your head.",
  "On a spatial display in the DisplayXR Browser, depth and head movement come for free, and dragging still turns the scene.",
  "Spatial View is offered on photos once their view is ready, after a post goes live. A shared link can open straight into it.",
];

export const GALLERY_ACCEPTS: { title: string; text: string }[] = [
  {
    title: "Side-by-side stereo photos",
    text: "JPG, PNG or WebP, full side-by-side, left eye in the left half. Half side-by-side (each eye squeezed to half width) is unsqueezed for you.",
  },
  {
    title: "Apple spatial photos",
    text: "HEIC spatial photos from an iPhone 15 Pro, 16 Pro or 17 Pro, taken with Camera › Spatial and converted in your browser. Pick a whole batch: ordinary photos are dropped for you.",
  },
];

export const GALLERY_DECLINED: { reason: string; text: string }[] = [
  {
    reason: "It is a 2D image",
    text: "There is no left/right parallax, so there is nothing to show in depth.",
  },
  {
    reason: "It is a conversion, not a capture",
    text: "A spatial photo that Apple Photos made from a 2D picture is declined. Take one with Camera › Spatial instead.",
  },
  {
    reason: "It is not side-by-side",
    text: "The file is not shaped like a stereo pair. Upload full side-by-side, left eye on the left.",
  },
  {
    reason: "The iPhone flattened it",
    text: "Some iOS versions turn a spatial photo into a plain JPEG during upload, which drops the second eye. In Photos, use Share › Save to Files, then upload it from Files.",
  },
];

export const GALLERY_UPLOAD_STEPS: string[] = [
  "Sign in. The Gallery uses your Google account.",
  "Drop in your stereo photos. Check the left-eye preview and swap the eyes if they are reversed. If the Gallery can't confirm parallax, it flags the photo; check the preview before you go on.",
  "Pick the camera. The Gallery reads it from the file when it can. Otherwise choose it from the list, or enter a custom rig: baseline in millimeters, focal length, projection (rectilinear or fisheye) and alignment (parallel, or pre-converged if a shift is already baked in).",
  "Set the screen plane. A comfort meter shows whether the depth is comfortable, punchy or heavy. The setting is applied when the photo is shown and never baked into your file.",
  "Publish. A post goes live as a whole once every picture in it is checked.",
];
