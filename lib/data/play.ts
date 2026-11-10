// DisplayXR Play: the games program page (/play). Hand-authored, like
// lib/data/browser.ts. Game titles appear only once a public release carries
// them (site rule); the PC titles are described until the December release.

export type SystemStatus = "available" | "preview";

export interface PlaySystem {
  id: "steam" | "windows" | "android";
  name: string;
  tagline: string;
  status: SystemStatus;
  how: string;
  steps: string[];
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  note: string;
}

export const PLAY_ANDROID_REPO = "https://github.com/DisplayXR/displayxr-play-android";
export const PLAY_ANDROID_RELEASES = `${PLAY_ANDROID_REPO}/releases`;
export const PLAY_PORTING_GUIDE = `${PLAY_ANDROID_REPO}/blob/main/docs/android-game-porting.md`;

export const SYSTEMS: PlaySystem[] = [
  {
    id: "steam",
    name: "Play for Steam",
    tagline: "Linux and SteamOS",
    status: "preview",
    how: "A Steam compatibility tool named “DisplayXR 3D”. Pick it in a game’s properties and the game starts in 3D; a detector chooses the route per title.",
    steps: [
      "Install DisplayXR for Linux.",
      "Install the compatibility tool.",
      "Game › Properties › Compatibility › DisplayXR 3D.",
    ],
    primary: { label: "Join the preview", href: "https://github.com/DisplayXR/displayxr-runtime/discussions" },
    note: "Desktop mode today. Gaming Mode depends on the compositor presenting pixel-exact.",
  },
  {
    id: "windows",
    name: "Play for Windows",
    tagline: "Steam, Epic, GOG",
    status: "preview",
    how: "An installer places the stereo D3D11 or D3D12 layer next to each game and writes its profile. Unreal titles can also go through their VR mod, which speaks OpenXR to DisplayXR directly.",
    steps: [
      "Install DisplayXR for Windows.",
      "Run the Play installer, pick your games.",
      "Launch from your store as usual.",
    ],
    primary: { label: "Join the preview", href: "https://github.com/DisplayXR/displayxr-runtime/discussions" },
    note: "Already using a ReShade side-by-side setup? Its DisplayXR backend is in review upstream.",
  },
  {
    id: "android",
    name: "Play for Android",
    tagline: "Tablets and phones",
    status: "available",
    how: "Native games get an in-process mod loaded by a community launcher; PC games run in a Wine container with the stereo layer inside. A small companion app holds the camera grant and brokers the weave.",
    steps: [
      "Install DisplayXR for Android and the companion app.",
      "Install the launcher and drop in the mod folder.",
      "Companion app: Turn 3D On. Launcher: Launch.",
    ],
    // The page swaps this for the companion app's direct link and the lane
    // version from lib/data/generated/play.json (synced from the repo's releases).
    primary: { label: "Get the companion app", href: PLAY_ANDROID_RELEASES },
    secondary: { label: "Install guide", href: PLAY_ANDROID_REPO },
    note: "First game: Minecraft Bedrock. 45 fps on a tablet, 22 fps on a phone with head tracking.",
  },
];

export const VENDOR_GUIDE =
  "https://github.com/DisplayXR/displayxr-runtime/blob/main/docs/guides/vendor-plugin-onboarding.md";

// For display and PC makers: who does what. Play never weaves or tracks; the
// vendor's plug-in does, once, for every game. No company or device is named
// on this page (site rule); partners are named in conversation, not here.
export interface MakerRole {
  who: string;
  title: string;
  text: string;
  highlight?: boolean;
}

export const DISPLAY_MAKERS: MakerRole[] = [
  {
    who: "You ship",
    title: "The display plug-in",
    text: "One plug-in for your display processor: weave, tracking, geometry. The same plug-in that serves every DisplayXR app. No per-title work, no game SDK, nothing to re-test when a game updates.",
    highlight: true,
  },
  {
    who: "DisplayXR runtime",
    title: "Tracked views and the weave call",
    text: "Takes the two eyes from the game, applies the tracked eye positions and off-axis projection, calls your plug-in at display rate, and drops to 2D on flat menus.",
  },
  {
    who: "Play",
    title: "The games",
    text: "Stereo layers, detector, per-game profiles and installers, maintained in the open. A title verified on one display plays on every display with a plug-in.",
  },
];

export interface Milestone {
  when: string;
  what: string;
  status: "live" | "next" | "later";
}

export const TIMELINE: Milestone[] = [
  {
    when: "Now",
    what: "Android lane available: the native mod core, the first game's mod, the companion app.",
    status: "live",
  },
  {
    when: "December 12, 2026",
    what: "Public PC release: the Steam compatibility tool for Linux, the Windows installer, the stereo D3D11 and D3D12 layers, and profiles for the titles of the December run.",
    status: "next",
  },
  {
    when: "2027",
    what: "More engines, more routes, more games. Each milestone gets a date here once it is scheduled.",
    status: "later",
  },
];

export interface PipelineStage {
  n: string;
  title: string;
  text: string;
  highlight?: boolean;
}

export const PIPELINE: PipelineStage[] = [
  { n: "01", title: "Your game", text: "D3D11 and D3D12 titles from any store. Native Android games. Unreal and Unity titles with VR mods." },
  { n: "02", title: "Stereo producer", text: "Every geometry pass rendered from two eye positions; screen-space effects carried per eye. Not a depth reprojection." },
  { n: "03", title: "Hand-off", text: "An OpenXR session on the game’s own device, a side-by-side bridge, or the companion app on Android." },
  { n: "04", title: "DisplayXR runtime", text: "Tracked eyes, off-axis views, late weave at display rate, automatic 2D on flat menus.", highlight: true },
  { n: "05", title: "Your display", text: "The display’s own plug-in weaves the pair, pixel-exact. Any vendor that ships a plug-in." },
];

export type GameStatus = "plays" | "partial" | "refused";

export interface GameRow {
  game: string;
  /** Matches the `<slug>-mod-<version>.zip` asset in the Android lane's release. */
  slug?: string;
  unnamed?: boolean;
  systems: string;
  route: string;
  status: GameStatus;
  statusLabel: string;
  cost: string;
  notes: string;
}

export const GAMES: GameRow[] = [
  {
    game: "Minecraft Bedrock 1.26",
    slug: "minecraft-bedrock",
    systems: "Android",
    route: "Native mod via launcher",
    status: "plays",
    statusLabel: "Plays",
    cost: "45 fps tablet · 22 fps phone",
    notes: "Shadows, fog, sky, hand and HUD correct in both eyes. Head tracking costs frame rate on phones.",
  },
  {
    game: "Unreal 4 action title",
    unnamed: true,
    systems: "Steam on Linux · Windows",
    route: "D3D11 stereo layer, in-process XR",
    status: "plays",
    statusLabel: "Plays (preview)",
    cost: "0.43× · 1.0× at 50 % render scale",
    notes: "D3D12 also works. Engine render scale recovers the frame rate.",
  },
  {
    game: "Unity 2019 exploration title",
    unnamed: true,
    systems: "Steam on Linux",
    route: "D3D11 stereo layer",
    status: "partial",
    statusLabel: "Partial",
    cost: "0.46×",
    notes: "Clean on D3D11. The D3D12 route breaks geometry on this engine version; the detector routes around it.",
  },
  {
    game: "VR-only edition of the Unreal title",
    unnamed: true,
    systems: "Steam on Linux",
    route: "none",
    status: "refused",
    statusLabel: "Refused",
    cost: "n/a",
    notes: "Needs a headset; the detector reads the store flag and turns 3D off.",
  },
];

export const CONTROLS = [
  {
    key: "F1",
    title: "Depth",
    text: "How far apart the two eyes are, as a percentage of your real eye distance. 100 % is life-size; most people settle between 60 and 120.",
  },
  {
    key: "F2",
    title: "Screen distance",
    text: "What sits at the glass. Auto follows the scene: the camera is converged, never the picture shifted, so edges stay put and the HUD stays on screen. Switch to manual to pin it.",
  },
  {
    key: "F3",
    title: "3D on or off",
    text: "Flat menus and cutscenes drop to 2D on their own. One key forces 2D when you want it, or brings 3D back.",
  },
];

export const PROFILE_SNIPPET = `# store app id, never a trademark
[game]
route        = "d3d11"        # d3d11 | d3d12 | ue-mod | native
render_scale = 0.5            # engine scale that keeps 2D frame rate

[stereo]
depth        = 100            # % of eye distance, F1 in game
convergence  = "auto"         # auto | <meters>, F2 in game
auto_2d      = true           # flat menus and cutscenes

[passes]
ssr          = "layer-select" # fixes the reflection pass per eye`;

export const RULES = [
  { title: "No depth tricks", text: "Two rendered views or nothing. No reprojection from a depth buffer, no SteamVR in the chain." },
  { title: "No anti-cheat games", text: "Single-player titles only. The detector refuses the rest so you never risk an account." },
  { title: "No game assets or code", text: "You own the game and install it from its store. Play only hooks the graphics API inside the process." },
  { title: "No vendor lock", text: "Play talks to the DisplayXR runtime only. Any display with a plug-in gets the same games." },
];

export interface PlayRepo {
  name: string;
  text: string;
  href?: string;
  status: "live" | "december";
  label: string;
}

export const REPOS: PlayRepo[] = [
  { name: "displayxr-play-android", text: "Native mod core, the first game’s mod, the companion app", href: PLAY_ANDROID_REPO, status: "live", label: "v0.6.4" },
  { name: "displayxr-play", text: "Compatibility tool, detector, bridge, profiles, Windows installer", status: "december", label: "December" },
  { name: "displayxr-dxvk · displayxr-vkd3d-proton", text: "The stereo D3D11 and D3D12 layers", status: "december", label: "December" },
];

export const FAQ = [
  {
    q: "Is this like the depth-based 3D shaders?",
    a: "No. Those guess a second view from one picture and a depth buffer. Play renders the second view. Objects have real sides, reflections and shadows match per eye, and nothing smears at edges.",
  },
  {
    q: "What does it cost in frame rate?",
    a: "About half, since every geometry pass runs twice. Dropping the engine’s render scale to 50 % gets the 2D frame rate back on the titles measured, and most 3D displays weave at less than full resolution anyway.",
  },
  {
    q: "Does it work with my ReShade setup?",
    a: "Yes on Windows once the DisplayXR backend of the side-by-side add-on is merged upstream: your existing side-by-side source then weaves through DisplayXR. For real stereo, use the Play installer.",
  },
  {
    q: "Which displays?",
    a: "Any display with a DisplayXR plug-in, with or without glasses. The runtime and the display plug-in come from the Download page; Play adds the games on top.",
  },
];
