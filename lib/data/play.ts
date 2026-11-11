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
    note: "First game: Minecraft Bedrock.",
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
    notes: "Shadows, fog, sky, hand and HUD correct in both eyes.",
  },
  {
    game: "Unreal 4 action title",
    unnamed: true,
    systems: "Steam on Linux · Windows",
    route: "D3D11 stereo layer, in-process XR",
    status: "plays",
    statusLabel: "Plays (preview)",
    notes: "D3D12 also works.",
  },
  {
    game: "Unity 2019 exploration title",
    unnamed: true,
    systems: "Steam on Linux",
    route: "D3D11 stereo layer",
    status: "partial",
    statusLabel: "Partial",
    notes: "Clean on D3D11. The D3D12 route breaks geometry on this engine version; the detector routes around it.",
  },
  {
    game: "VR-only edition of the Unreal title",
    unnamed: true,
    systems: "Steam on Linux",
    route: "none",
    status: "refused",
    statusLabel: "Refused",
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
render_scale = 0.5            # engine render scale for this title

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

// FAQ, grouped by who asks. Built Nov 11, 2026 from four persona question
// lists run against the live page (KBXR displayxr/play/website-faq-draft.md
// is the answer bank). Site rules: no titles, no company or device names, no
// performance numbers, no pricing beyond "free and open source".
export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqGroup {
  group: string;
  items: FaqItem[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    group: "Players",
    items: [
      {
        q: "Is my DirectX game now running on Vulkan?",
        a: "Yes. The stereo layer is a fork of DXVK and vkd3d-proton, the open-source layers that implement Direct3D 11 and 12 on top of Vulkan and that Proton uses on Linux. On Windows the installer puts the layer's DLLs next to the game's executable; the game keeps calling Direct3D and the layer runs it through your GPU's Vulkan driver. That is where the second eye is rendered, and it is why the same layer works on Windows, on Linux and inside the Android container.",
      },
      {
        q: "Why a Direct3D-on-Vulkan layer instead of hooking Direct3D like the old 3D injectors?",
        a: "Because the layer sees everything the game submits: every draw, render target, constant buffer and depth buffer. It renders each geometry pass once per eye, gives each eye its own camera so anti-aliasing, motion vectors, reflections and lighting match, reads the depth buffer to set the screen distance, and opens the OpenXR session to the DisplayXR runtime on the same GPU device. What is left per game is a small text profile, not hand-written shader fixes.",
      },
      {
        q: "Is this like the depth-based 3D shaders?",
        a: "No. Those guess a second view from one picture and a depth buffer. Play renders the second view. Objects have real sides, reflections and shadows match per eye, and nothing smears at edges.",
      },
      {
        q: "What does the installer put in my game folder, and how do I remove it?",
        a: "A few DLLs with Direct3D's file names, a configuration file and the game's profile. Nothing in the game's own files changes. Remove the game from the Play installer, or delete those files, and the game is back to stock; a store's file verification leaves them alone because they are extra files, not modified ones.",
      },
      {
        q: "Will it get me banned?",
        a: "Play is for single-player titles. Before a game starts, the detector looks for anti-cheat components and turns 3D off if it finds any, so the layer is never loaded into a protected process. A game with an online mode but no anti-cheat starts normally; Play changes nothing in the game's data or memory, only how its frames are rendered.",
      },
      {
        q: "Saves, achievements, cloud sync and the store overlay?",
        a: "Saves, achievements and cloud sync are untouched; they never go through the graphics API. Turn the store's in-game overlay off for now: it draws into the frame before the weave and shows doubled. Overlays across the weave are an open item.",
      },
      {
        q: "Does a game that is not in the table work?",
        a: "Usually the detector can route it: Direct3D 11 and 12 titles get the stereo layer with default settings, Unreal titles can take the VR-mod route, and anything on another graphics API or with anti-cheat is turned off. Whether the result looks right is what the table records, so try it and report; a report with a captured eye pair becomes a community-verified row.",
      },
      {
        q: "Does 3D break when the game updates?",
        a: "Rarely. The layer carries no per-game shader fixes that a patch could break; what it recognizes is the engine's camera data, which changes with engine versions, not game patches. Your profile keeps its depth and screen-distance settings across updates. A new engine version can need a new recognition rule, which lands in the layer once for every game on that engine.",
      },
      {
        q: "Can I turn it off or down while playing?",
        a: "Yes. One key switches between 3D and 2D without leaving the game; another sets depth as a percentage of your eye distance. Depth is capped by a comfort zone by default, so the scene never asks your eyes for more than a desk-distance display is comfortable with, and flat menus and cutscenes drop to 2D on their own. The controls are keyboard keys in the preview; a controller binding is not built yet.",
      },
      {
        q: "Do DLSS, FSR, frame generation, ray tracing and HDR work?",
        a: "Each eye gets its own camera, which is what temporal upscalers need, but none of them has been verified in stereo yet. Ray tracing is off by default on the Direct3D 12 route, and HDR output is not part of the preview. Report what you see and it goes in the table for that title.",
      },
      {
        q: "Which stores?",
        a: "Any store that installs the game as plain files: Steam, Epic, GOG and the like. Games installed by the Xbox app into its protected folders cannot take a file next to the executable, so they are not supported today.",
      },
      {
        q: "Does it work with my ReShade setup?",
        a: "Yes on Windows once the DisplayXR backend of the side-by-side add-on is merged upstream: your existing side-by-side source then weaves through DisplayXR. For real stereo, use the Play installer.",
      },
      {
        q: "Which displays?",
        a: "Any display with a DisplayXR plug-in, with or without glasses. The DisplayXR runtime and the display plug-in come from the Download page; Play adds the games on top.",
      },
      {
        q: "What is the preview today, and is it free?",
        a: "Nothing to download on PC yet: the public PC release is December 12, 2026. Until then, the preview is the Discussions thread where people running it on panels report results. Everything is free and open source; the Android lane is downloadable now.",
      },
    ],
  },
  {
    group: "Linux and Steam Deck",
    items: [
      {
        q: "What does the DisplayXR 3D compatibility tool do that plain Proton does not?",
        a: "It is a thin wrapper over Proton. It launches the game through Steam's own Proton Experimental inside the Steam Linux Runtime container, with Play's stereo DXVK and vkd3d-proton in place of Proton's own, runs the detector first to pick the route for that title, and opens the DisplayXR session from inside the container. It replaces the Proton version you had selected for that game.",
      },
      {
        q: "Why desktop mode only on the Deck?",
        a: "The woven image has to reach the panel pixel for pixel. Gaming Mode's compositor scales and filters what it presents, which destroys the weave. Desktop mode presents exactly, so Play works there today; Gaming Mode is an open item.",
      },
      {
        q: "AMD, Intel or NVIDIA?",
        a: "The layer is standard Vulkan and runs wherever DXVK and vkd3d-proton run. The preview was measured on an Intel integrated GPU; a handheld-class AMD box is the December target; NVIDIA on Linux is untested.",
      },
      {
        q: "Do the forks track upstream?",
        a: "Yes. The stereo work sits on top of the upstream layers, and upstream changes are pulled in as they land. Upstream DXVK declined a stereo mode, so the stereo code stays a maintained fork rather than a patch set waiting to be merged.",
      },
      {
        q: "The detector refuses VR games. What about games that are flat and VR in one app?",
        a: "Those are fine. The detector reads the store's VR-only flag, not VR-supported. A game that ships flat and VR in one app starts flat and takes the normal route.",
      },
      {
        q: "How do I make and share a profile?",
        a: "Change the three controls in the game; they are saved into the game's profile, a plain-text file keyed by the store app id. Post it in Discussions today; once the profiles repository is public, open a pull request. A profile needs a captured eye pair or a person's report to be marked community-verified.",
      },
    ],
  },
  {
    group: "Display makers",
    items: [
      {
        q: "Which licenses, and may we bundle it?",
        a: "The DisplayXR runtime and the Android lane are under the Boost Software License 1.0. The stereo layers keep their upstream licenses: zlib for the Direct3D 11 layer and LGPL-2.1 for the Direct3D 12 layer. All of them permit bundling and preinstallation; the LGPL layer ships with its source offer.",
      },
      {
        q: "Who maintains the stereo layers, and what if the project stops?",
        a: "The DisplayXR project maintains them in the open, as it does the runtime. Everything is open source under permissive licenses, so a display maker can carry them on without asking anyone.",
      },
      {
        q: "How is a title verified, and can we curate our own list?",
        a: "A title is verified when a person has played it in stereo on a 3D display and the result is recorded with a captured eye pair; community reports are marked as such. A display maker can ship its own default profiles and its own list with a device; the project's table stays the shared one, and a title verified on one display plays on every display with a plug-in.",
      },
      {
        q: "What does it cost?",
        a: "Nothing. The software is free and open source, and the project has no membership or fee.",
      },
    ],
  },
  {
    group: "Game developers",
    items: [
      {
        q: "What does the layer do to my renderer?",
        a: "It implements Direct3D 11 or 12 on Vulkan, so it sees every call your game makes. It recognizes the engine's per-view constant buffer by its contents and binds a copy per eye with that eye's camera, so anti-aliasing, motion vectors, screen-space reflections, deferred lighting and shadow lookups see the right view. Geometry passes replay once per eye; passes that do not depend on the camera run once.",
      },
      {
        q: "Which effects break, and who fixes them?",
        a: "The known case is a screen-space pass that samples a stereo texture inside a geometry pass, such as some reflection and refraction setups; the profile can select the right layer for that pass. An engine family without a camera-recognition rule gets correct geometry but may get camera-dependent shading wrong; adding the rule is layer work, done once per engine, by the project or a contributor.",
      },
      {
        q: "Can I opt in natively, or opt out?",
        a: "Both. A game that opens its own OpenXR session with the DisplayXR extensions, through the Unity or Unreal plug-in or directly, renders its own stereo and does not need the layer; tell the project and the title's profile routes around it. A developer who does not want the layer in their game asks in Discussions and the title's profile is set to off.",
      },
      {
        q: "Will you name my game?",
        a: "Only once a public release carries it, and only to say that the release supports it. Profiles are keyed by store app id, never by the game's name. A developer who prefers not to be listed by name asks, and the row goes by app id.",
      },
      {
        q: "How do I tell a Play problem from my own bug?",
        a: "The layer writes its own logs next to the game's executable, named after it with a d3d11, dxgi or d3d12 suffix. If those files exist, the game ran under Play, and a crash report with them belongs in Play's tracker, not yours.",
      },
    ],
  },
  {
    group: "The project",
    items: [
      {
        q: "Is this one display company's project?",
        a: "No. DisplayXR is a vendor-neutral open-source project; display makers take part by shipping a plug-in, and no vendor has a privileged code path. The first shipping plug-in targets one vendor's displays, which is why that vendor is the only one on the platform-support page today.",
      },
      {
        q: "Why no titles and no performance numbers on the page?",
        a: "Titles are named only once a public release carries them, so the page never claims a compatibility a release does not deliver. Performance depends on the game, the GPU and the render scale, so it is recorded per title in the compatibility table rather than quoted as a headline.",
      },
      {
        q: "Why do some repositories say December?",
        a: "The PC side runs on the maintainers' machines and goes public with the December 12, 2026 release, when its profiles and layers can be used without hand-holding. The Android lane is public today.",
      },
    ],
  },
];

