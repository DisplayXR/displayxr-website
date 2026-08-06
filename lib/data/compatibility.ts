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
  { platform: "Linux", graphicsApi: "Vulkan", status: "beta", notes: "Preview — native Vulkan compositor over an X11/XCB or Wayland surface, xlib and wayland surface bindings, transparent overlays with live desktop content composited under the weave. Hardware-validated on Ubuntu 22.04/24.04/26.04; ships as .deb packages plus a one-command bundle tarball, not yet GA" },
];

export const enginePlugins: EnginePlugin[] = [
  { engine: "Unity", status: "active", notes: "UPM package, sample scene, CI" },
  { engine: "Unreal", status: "beta", notes: "UE 5.3+, Win/macOS/Android, Blueprint components, Kooima eye-tracked stereo" },
];

export const hardwareBackends: HardwareBackend[] = [
  { backend: "Leia SR SDK (LeiaSR displays)", status: "shipping", notes: "Ships as a separate plug-in (Windows installer + Android CNSDK); D3D11/D3D12/Vulkan weavers, eye tracking. On Android the vendor display processor runs out-of-process" },
  { backend: "sim_display (no hardware)", status: "shipping", notes: "Simulation mode for development" },
];

export const appClasses: AppClass[] = [
  { className: "Handle", description: "App provides window (HWND/NSView)", status: "shipping" },
  { className: "Texture", description: "App provides offscreen textures", status: "shipping" },
  { className: "Hosted", description: "Runtime hosts everything (standard OpenXR / WebXR)", status: "shipping" },
];
