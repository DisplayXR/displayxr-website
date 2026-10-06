// Native OpenXR quickstart, authored. Every path and command here was checked
// against displayxr-runtime (test_apps/, scripts/, docs/getting-started/) on
// 2026-10-05; when the runtime moves a reference app or renames a script,
// update it here. Depth stays in the runtime docs: this page routes.

import { REPO_URLS } from "@/lib/constants";

const RUNTIME_DOCS = `${REPO_URLS.runtime}/blob/main/docs`;

export const NATIVE_DOCS = {
  appClasses: `${RUNTIME_DOCS}/getting-started/app-classes.md`,
  building: `${RUNTIME_DOCS}/getting-started/building.md`,
  firstApp: `${RUNTIME_DOCS}/getting-started/first-handle-app.md`,
  faq: `${RUNTIME_DOCS}/getting-started/faq.md`,
  troubleshooting: `${RUNTIME_DOCS}/getting-started/troubleshooting.md`,
  shipManifest: `${RUNTIME_DOCS}/getting-started/ship-a-manifest.md`,
  appRules: `${RUNTIME_DOCS}/guides/displayxr-app-rules.md`,
  androidBuild: `${RUNTIME_DOCS}/getting-started/android-build-guide.md`,
  scaffolder: `${REPO_URLS.runtime}/blob/main/.claude/skills/new-displayxr-app/SKILL.md`,
  linter: `${REPO_URLS.runtime}/blob/main/scripts/check_displayxr_app.py`,
} as const;

export type NativePlatform = {
  id: "windows" | "macos" | "linux" | "android";
  os: string;
  /** The graphics API to reach for first (David, 2026-10-04). */
  api: string;
  apiNote?: string;
  /** The other APIs with a native compositor on this platform. */
  alsoSupported: string[];
  /** Reference app, as a path inside displayxr-runtime. */
  referenceApp: string;
  /**
   * Build and run the reference app from a runtime checkout, verbatim from
   * docs/getting-started/building.md (it builds a dev runtime + sim-display
   * alongside, which the run scripts point at).
   */
  build: string;
  /** How the app lands on sim-display on this platform. */
  sim: string;
  /** The /new-displayxr-app scaffolder covers Windows and macOS only. */
  scaffolder: boolean;
};

export const NATIVE_PLATFORMS: NativePlatform[] = [
  {
    id: "windows",
    os: "Windows",
    api: "D3D11",
    apiNote: "D3D12 for engines",
    alsoSupported: ["D3D12", "Vulkan", "OpenGL"],
    referenceApp: "test_apps/handle/cube_handle_d3d11_win",
    build: `git clone ${REPO_URLS.runtime}
cd displayxr-runtime
scripts\\dev-setup.bat                REM once, from an elevated prompt
scripts\\build_windows.bat test-apps  REM then from a normal prompt
_package\\run_cube_handle_d3d11_win.bat`,
    sim: "dev-setup registers sim-display, and with no vendor plug-in DisplayXR uses it.",
    scaffolder: true,
  },
  {
    id: "macos",
    os: "macOS",
    api: "Metal",
    alsoSupported: ["Vulkan (MoltenVK)", "OpenGL"],
    referenceApp: "test_apps/handle/cube_handle_metal_macos",
    build: `git clone ${REPO_URLS.runtime}
cd displayxr-runtime
./scripts/build_macos.sh
_package/DisplayXR-macOS/run_cube_handle_metal.sh`,
    sim: "The run script finds sim-display on its own.",
    scaffolder: true,
  },
  {
    id: "linux",
    os: "Linux",
    api: "Vulkan",
    alsoSupported: [],
    referenceApp: "test_apps/cube_handle_vk_linux",
    build: `git clone ${REPO_URLS.runtime}
cd displayxr-runtime
./scripts/build_linux.sh
./build/run_cube_handle_vk_linux.sh`,
    sim: "The run script points the app at the sim-display plug-in.",
    scaffolder: false,
  },
  {
    id: "android",
    os: "Android",
    api: "Vulkan",
    alsoSupported: [],
    referenceApp: "test_apps/handle/cube_handle_vk_android",
    build: `git clone ${REPO_URLS.runtime}
cd displayxr-runtime
./gradlew :test_apps:cube_handle_vk_android:installDebug`,
    sim: "On a device without a vendor plug-in, the runtime APK runs apps on sim-display: they run, nothing weaves.",
    scaffolder: false,
  },
];

/** The four content-handoff classes, one line each (docs/getting-started/app-classes.md). */
export const APP_CLASSES = [
  {
    name: "Handle",
    line: "Your app owns its window and hands the runtime its handle (HWND, NSView, X11 or Wayland surface, Android Surface). The default, and the one to start from.",
  },
  {
    name: "Texture",
    line: "Something else must own the final surface (a browser composite, a capture target): you pass a shared texture, the runtime weaves into it, you present it.",
  },
  {
    name: "Hosted",
    line: "The runtime creates the window and targets, as on any OpenXR runtime. The simplest path; on Android it is fullscreen-only.",
  },
  {
    name: "IPC",
    line: "Out-of-process, through the service. Used internally by the Shell and WebXR; you still write a Handle app and IPC is transparent.",
  },
];
