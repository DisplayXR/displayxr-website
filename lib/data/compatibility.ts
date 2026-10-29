export type Status = "shipping" | "active" | "beta" | "early" | "experimental" | "planned";

export interface RuntimeCompositor {
  platform: string;
  graphicsApi: string;
  status: Status;
  notes: string;
}

export interface EnginePlugin {
  engine: string;
  status: Status;
  notes: string;
}

export interface HardwareBackend {
  backend: string;
  status: Status;
  notes: string;
}

export interface AppClass {
  className: string;
  description: string;
  status: Status;
}

export const runtimeCompositors: RuntimeCompositor[] = [
  { platform: "Windows", graphicsApi: "D3D11", status: "shipping", notes: "LeiaSR weaver, window binding" },
  { platform: "Windows", graphicsApi: "D3D12", status: "shipping", notes: "Window binding" },
  { platform: "Windows", graphicsApi: "OpenGL", status: "shipping", notes: "" },
  { platform: "Windows", graphicsApi: "Vulkan", status: "shipping", notes: "" },
  { platform: "macOS", graphicsApi: "Metal", status: "shipping", notes: "sim_display weaver, window binding" },
  { platform: "macOS", graphicsApi: "OpenGL", status: "shipping", notes: "" },
  { platform: "macOS", graphicsApi: "Vulkan", status: "shipping", notes: "MoltenVK; runtime error at launch (MoltenVK limitation)" },
  { platform: "Android", graphicsApi: "Vulkan", status: "shipping", notes: "Out-of-process service compositor; orientation-aware rendering, mixed 2D/3D zones" },
  { platform: "Linux", graphicsApi: "Vulkan", status: "shipping", notes: "Native Wayland on Ubuntu 24.04/26.04 with GNOME is the primary, hardware-validated target — client-side title bar, phase-locked window drag at any scale, transparent overlays over the live desktop. X11/XWayland supported as legacy (weaves when the panel is 1:1 at an integer scale). Ubuntu 22.04 supported with X11, not yet hardware-validated. Ships as .deb packages plus a one-command bundle tarball" },
];

export const enginePlugins: EnginePlugin[] = [
  { engine: "Unity", status: "active", notes: "UPM package, sample scene, CI" },
  { engine: "Unreal", status: "beta", notes: "UE 5.7, Win/macOS/Android, Blueprint components, Kooima eye-tracked stereo" },
];

export const hardwareBackends: HardwareBackend[] = [
  { backend: "Leia SR display processor (LeiaSR displays)", status: "shipping", notes: "Ships as a separate plug-in (Windows installer + Android CNSDK); D3D11/D3D12/Vulkan weavers, eye tracking. On Android the vendor display processor runs out-of-process" },
  { backend: "sim_display (reference, no hardware)", status: "shipping", notes: "Reference implementation: renders to an ordinary window for development" },
];

export const appClasses: AppClass[] = [
  { className: "Handle", description: "App provides window (HWND/NSView)", status: "shipping" },
  { className: "Texture", description: "App provides offscreen textures", status: "shipping" },
  { className: "Hosted", description: "Runtime hosts everything (standard OpenXR / WebXR)", status: "shipping" },
];

// Desktop-app integrations on the ADR-060 texture target (runtime v2.55.0).
// None is released yet, so these chips never say "Supported": they record
// what has been verified, and each row links the public proposal it came
// from. Checked against the posts on 2026-10-29, seated passes on released
// runtimes v2.55.0 to v2.57.1 (index: discussion #2442).
// Names follow each owner's trademark wording; text only, no logos.
export type AppVerification = "seated-verified" | "sim-verified" | "proposed";

export type AppIntegration = "own-viewport" | "dedicated-window" | "browser-page";

export interface DesktopApp {
  app: string;
  /** Version the verification was done on; omitted when the post gives none. */
  version?: string;
  integration: AppIntegration;
  verification: AppVerification;
  /** GitHub Discussions number of the public proposal. */
  proposal: number;
}

export const APP_DISCUSSIONS_URL = "https://github.com/orgs/DisplayXR/discussions";
export const APP_INTEGRATIONS_INDEX = 2442;

export const desktopApps: DesktopApp[] = [
  { app: "Blender", version: "5.2", integration: "own-viewport", verification: "seated-verified", proposal: 2397 },
  { app: "NVIDIA Omniverse™ USD Composer", version: "Kit 110", integration: "own-viewport", verification: "seated-verified", proposal: 2331 },
  { app: "Autodesk® Maya®", version: "2027", integration: "own-viewport", verification: "seated-verified", proposal: 2390 },
  { app: "Autodesk® MotionBuilder®", integration: "own-viewport", verification: "seated-verified", proposal: 2423 },
  { app: "Foundry Nuke", version: "17.1", integration: "own-viewport", verification: "seated-verified", proposal: 2433 },
  { app: "3D Slicer", version: "5.12", integration: "own-viewport", verification: "seated-verified", proposal: 2352 },
  { app: "ParaView", version: "6.2", integration: "own-viewport", verification: "seated-verified", proposal: 2360 },
  { app: "Adobe® Substance 3D Designer", version: "16.0", integration: "own-viewport", verification: "seated-verified", proposal: 2439 },
  { app: "NVIDIA Instant-NGP", integration: "own-viewport", verification: "seated-verified", proposal: 2464 },
  { app: "NVIDIA Isaac Sim™", version: "6.2", integration: "dedicated-window", verification: "seated-verified", proposal: 2463 },
  { app: "Adobe® Substance 3D Painter", version: "12.2", integration: "dedicated-window", verification: "seated-verified", proposal: 2437 },
  { app: "Adobe® Substance 3D Sampler", version: "6.0", integration: "dedicated-window", verification: "seated-verified", proposal: 2438 },
  { app: "CLO", version: "2026.1", integration: "browser-page", verification: "seated-verified", proposal: 2434 },
  { app: "Adobe® Substance 3D Modeler", integration: "dedicated-window", verification: "proposed", proposal: 2394 },
  { app: "SideFX® Houdini®", integration: "dedicated-window", verification: "proposed", proposal: 2432 },
  { app: "Autodesk® VRED™", integration: "dedicated-window", verification: "proposed", proposal: 2383 },
  { app: "Twinmotion", integration: "dedicated-window", verification: "proposed", proposal: 2389 },
];
