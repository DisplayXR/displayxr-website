export type Status = "shipping" | "active" | "early" | "experimental" | "planned";

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
];

export const enginePlugins: EnginePlugin[] = [
  { engine: "Unity", status: "active", notes: "UPM package, sample scene, CI" },
  { engine: "Unreal", status: "early", notes: "Placeholder — not production-ready" },
];

export const hardwareBackends: HardwareBackend[] = [
  { backend: "Leia SR SDK (LeiaSR displays)", status: "shipping", notes: "D3D11 weaver, eye tracking" },
  { backend: "sim_display (no hardware)", status: "shipping", notes: "Simulation mode for development" },
];

export const appClasses: AppClass[] = [
  { className: "Handle", description: "App provides window (HWND/NSView)", status: "shipping" },
  { className: "Texture", description: "App provides offscreen textures", status: "shipping" },
  { className: "Hosted", description: "Runtime hosts everything", status: "shipping" },
  { className: "IPC", description: "Out-of-process via service", status: "shipping" },
];
