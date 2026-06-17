"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { REPO_URLS } from "@/lib/constants";
import {
  Monitor,
  Package,
  LayoutGrid,
  Bot,
  CheckCircle2,
  PlayCircle,
  HelpCircle,
  Apple,
  Terminal,
  Hammer,
  Eye,
  Layers,
  Smartphone,
} from "lucide-react";
import type { ReactNode } from "react";

type Step = {
  num: number;
  title: string;
  required: boolean;
  icon: ReactNode;
  body: ReactNode;
};

type FAQ = { q: string; a: ReactNode };

const Mono = ({ children }: { children: ReactNode }) => (
  <code className="bg-background text-accent px-1.5 py-0.5 rounded text-xs font-mono">
    {children}
  </code>
);

const InstallerLink = ({
  href,
  filename,
}: {
  href: string;
  filename: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-accent hover:text-accent-hover underline underline-offset-2"
  >
    {filename}
  </a>
);

const CodeBlock = ({ children }: { children: string }) => (
  <pre className="bg-background border border-border rounded-md p-4 my-3 text-xs font-mono text-text-primary overflow-x-auto">
    <code>{children}</code>
  </pre>
);

const windowsSteps: Step[] = [
  {
    num: 1,
    title: "Check the prerequisites",
    required: true,
    icon: <Monitor size={20} />,
    body: (
      <>
        <ul className="space-y-2 text-text-secondary leading-relaxed list-disc list-inside">
          <li>Windows 10 version 2004 or later (Windows 11 recommended)</li>
          <li>
            A tracked 3D display supported by DisplayXR — currently Leia SR
            displays (Lume Pad, Leia 3D laptops). See the{" "}
            <a
              href="/platform-support"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              platform support matrix
            </a>{" "}
            for the full list.
          </li>
          <li>
            Admin rights to run the installers (each registers under{" "}
            <Mono>HKLM\Software\DisplayXR</Mono>)
          </li>
        </ul>
        <p className="text-sm text-text-secondary leading-relaxed mt-4">
          No 3D display? You can still install everything — the runtime ships
          a simulated display driver (<Mono>sim_display</Mono>) for
          development on a regular monitor with WASD + mouse eye-position
          control.
        </p>
      </>
    ),
  },
  {
    num: 2,
    title: "Install the DisplayXR Runtime",
    required: true,
    icon: <Package size={20} />,
    body: (
      <>
        <p className="text-text-secondary leading-relaxed mb-4">
          The runtime is the OpenXR layer every DisplayXR app talks to. It
          includes the native compositors (D3D11, D3D12, Vulkan, OpenGL) and
          the Windows service.
        </p>
        <ol className="space-y-2 text-text-secondary leading-relaxed list-decimal list-inside mb-4">
          <li>
            Download{" "}
            <InstallerLink
              href={`${REPO_URLS.runtime}/releases/latest`}
              filename="DisplayXRSetup-*.exe"
            />{" "}
            from the runtime releases page.
          </li>
          <li>Run the installer and accept the defaults.</li>
          <li>
            On first install, the <strong>DisplayXR Service</strong> is
            registered and started, and{" "}
            <Mono>HKLM\Software\Khronos\OpenXR\1\ActiveRuntime</Mono> is set
            to the DisplayXR runtime JSON.
          </li>
        </ol>
        <p className="text-sm text-text-secondary leading-relaxed">
          After this step, any OpenXR app on the system will route through
          DisplayXR. If you only want OpenXR for your own 3D-display app, you
          can stop here.
        </p>
      </>
    ),
  },
  {
    num: 3,
    title: "Install the DisplayXR Shell",
    required: false,
    icon: <LayoutGrid size={20} />,
    body: (
      <>
        <p className="text-text-secondary leading-relaxed mb-4">
          The shell is the reference spatial workspace UX — a 3D window
          manager that runs multiple OpenXR apps and captured 2D apps in a
          single head-tracked workspace. <strong>Optional</strong>; install
          it if you want a spatial-desktop experience.
        </p>
        <ol className="space-y-2 text-text-secondary leading-relaxed list-decimal list-inside mb-4">
          <li>
            Download{" "}
            <InstallerLink
              href={`${REPO_URLS.shell}/releases/latest`}
              filename="DisplayXRShellSetup-*.exe"
            />{" "}
            from the shell releases page.
          </li>
          <li>
            Run the installer. It reads{" "}
            <Mono>HKLM\Software\DisplayXR\Runtime\InstallPath</Mono> and will
            refuse to install if the runtime is missing — finish step 2
            first.
          </li>
          <li>
            The shell installs into the runtime&apos;s tree and registers
            itself at{" "}
            <Mono>HKLM\Software\DisplayXR\WorkspaceControllers\shell</Mono> so
            the runtime&apos;s service orchestrator can discover it.
          </li>
        </ol>
        <p className="text-sm text-text-secondary leading-relaxed">
          OEMs and vertical integrators can ship their own workspace
          controllers using the same{" "}
          <a
            href="/extensions"
            className="text-accent hover:text-accent-hover underline underline-offset-2"
          >
            <Mono>XR_EXT_spatial_workspace</Mono>
          </a>{" "}
          contract; the shell is just the reference implementation.
        </p>
      </>
    ),
  },
  {
    num: 4,
    title: "Install DisplayXR MCP Tools",
    required: false,
    icon: <Bot size={20} />,
    body: (
      <>
        <p className="text-text-secondary leading-relaxed mb-4">
          Enables AI-agent and voice control of your spatial workspace.{" "}
          <strong>Optional</strong>; install it if you want Claude, ChatGPT,
          or other MCP clients to introspect and drive your spatial
          workspace.
        </p>
        <ol className="space-y-2 text-text-secondary leading-relaxed list-decimal list-inside mb-4">
          <li>
            Download{" "}
            <InstallerLink
              href={`${REPO_URLS.mcp}/releases/latest`}
              filename="DisplayXRMCPSetup-*.exe"
            />{" "}
            from the MCP releases page.
          </li>
          <li>
            Run the installer. It writes{" "}
            <Mono>HKLM\Software\DisplayXR\Capabilities\MCP\Enabled = 1</Mono>.
          </li>
          <li>
            On next launch, the runtime and shell each spawn an MCP server
            thread. Phase A (per-app introspection) is exposed by the
            runtime; Phase B (workspace control) by the shell.
          </li>
        </ol>
        <p className="text-sm text-text-secondary leading-relaxed">
          Per-process opt-out: <Mono>set DISPLAYXR_MCP=0</Mono> before
          launching an app.
        </p>
      </>
    ),
  },
  {
    num: 5,
    title: "Verify the install",
    required: true,
    icon: <CheckCircle2 size={20} />,
    body: (
      <>
        <ul className="space-y-2 text-text-secondary leading-relaxed list-disc list-inside">
          <li>
            <strong>Service running:</strong> open <Mono>services.msc</Mono>{" "}
            and confirm <strong>DisplayXR Service</strong> shows as Running.
          </li>
          <li>
            <strong>Active OpenXR runtime:</strong> from a command prompt,{" "}
            <Mono>
              reg query HKLM\Software\Khronos\OpenXR\1 /v ActiveRuntime
            </Mono>{" "}
            should return the DisplayXR JSON path.
          </li>
          <li>
            <strong>Shell installed (if step 3):</strong>{" "}
            <Mono>
              reg query HKLM\Software\DisplayXR\WorkspaceControllers\shell
            </Mono>{" "}
            returns its install path. <strong>DisplayXR Shell</strong>{" "}
            appears in the Start menu.
          </li>
          <li>
            <strong>MCP installed (if step 4):</strong>{" "}
            <Mono>
              reg query HKLM\Software\DisplayXR\Capabilities\MCP /v Enabled
            </Mono>{" "}
            returns <Mono>0x1</Mono>.
          </li>
        </ul>
      </>
    ),
  },
  {
    num: 6,
    title: "First launch",
    required: true,
    icon: <PlayCircle size={20} />,
    body: (
      <>
        <p className="text-text-secondary leading-relaxed mb-4">
          Launch <strong>DisplayXR Shell</strong> from the Start menu (or
          Ctrl+Space from the tray icon). The shell auto-starts the service
          if it isn&apos;t running, then activates the spatial workspace on
          your tracked 3D display.
        </p>
        <p className="text-text-secondary leading-relaxed mb-4">
          Try the basics:
        </p>
        <ul className="space-y-2 text-text-secondary leading-relaxed list-disc list-inside mb-4">
          <li>Open a few apps — they auto-adopt as 3D-positioned windows</li>
          <li>
            <Mono>Ctrl+1</Mono>…<Mono>Ctrl+8</Mono> — cycle layout presets
            (side-by-side, theater, carousel, helix, …)
          </li>
          <li>
            <Mono>TAB</Mono> — cycle focus; <Mono>V</Mono> — toggle 2D/3D
            display mode
          </li>
          <li>
            <Mono>Ctrl+Shift+C</Mono> — capture a stereo screenshot
          </li>
          <li>
            <Mono>ESC</Mono> — dismiss the shell and restore your normal
            desktop
          </li>
        </ul>
        <p className="text-sm text-text-secondary leading-relaxed">
          Full keyboard reference and feature catalog:{" "}
          <a
            href={`${REPO_URLS.shell}#features`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-hover underline underline-offset-2"
          >
            shell README
          </a>
          .
        </p>
      </>
    ),
  },
  {
    num: 7,
    title: "Build from source (developers)",
    required: false,
    icon: <Hammer size={20} />,
    body: (
      <>
        <p className="text-text-secondary leading-relaxed mb-3">
          Want to modify or debug the runtime instead of installing it? Build
          from source. Run the one-liner from an <strong>elevated</strong>{" "}
          command prompt — it writes the registry:
        </p>
        <CodeBlock>{`git clone https://github.com/DisplayXR/displayxr-runtime.git
cd displayxr-runtime
scripts\\dev-setup.bat              REM build + register sim-display + set active runtime + VS solution
scripts\\dev-setup.bat --leia       REM ...also build + register the Leia SR plug-in from source`}</CodeBlock>
        <p className="text-text-secondary leading-relaxed mb-3">
          Then build and run a test app (from a{" "}
          <strong>non-elevated</strong> prompt):
        </p>
        <CodeBlock>{`scripts\\build_windows.bat test-apps
_package\\run_cube_handle_d3d11_win.bat`}</CodeBlock>
        <p className="text-sm text-text-secondary leading-relaxed mb-3">
          <strong>The step that&apos;s easy to miss:</strong> a from-source build
          produces the <Mono>sim-display</Mono> plug-in but doesn&apos;t register
          it, and Windows plug-in discovery is registry-only — without
          registration the runtime fails with{" "}
          <Mono>DEVICE_CREATION_FAILED</Mono>. <Mono>dev-setup.bat</Mono> does
          build + registration + active-runtime in one step (or run{" "}
          <Mono>scripts\\register_dev_plugin.bat</Mono> for just the
          registration).
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          Full reference:{" "}
          <a
            href="https://github.com/DisplayXR/displayxr-runtime/blob/main/docs/getting-started/building.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-hover underline underline-offset-2"
          >
            Building DisplayXR
          </a>
          . Debug in Visual Studio:{" "}
          <a
            href="https://github.com/DisplayXR/displayxr-runtime/blob/main/docs/getting-started/debugging-in-visual-studio.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-hover underline underline-offset-2"
          >
            Debugging in Visual Studio
          </a>
          .
        </p>
      </>
    ),
  },
];

const macosSteps: Step[] = [
  {
    num: 1,
    title: "Check the prerequisites",
    required: true,
    icon: <Apple size={20} />,
    body: (
      <>
        <ul className="space-y-2 text-text-secondary leading-relaxed list-disc list-inside">
          <li>macOS 13 (Ventura) or later, Apple Silicon or Intel</li>
          <li>Xcode Command Line Tools (<Mono>xcode-select --install</Mono>)</li>
          <li>
            <a
              href="https://brew.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              Homebrew
            </a>{" "}
            for build dependencies
          </li>
        </ul>
        <div className="mt-4 p-4 rounded-md bg-warning/10 border border-warning/30 text-sm text-text-secondary leading-relaxed">
          <strong className="text-text-primary">Heads up:</strong> a runtime{" "}
          <Mono>.pkg</Mono> installer is available on macOS (see the{" "}
          <a
            href="/download"
            className="text-accent hover:text-accent-hover underline underline-offset-2"
          >
            Download
          </a>{" "}
          page) — but the DisplayXR Shell, MCP Tools, and Leia SR vendor
          support are <strong>Windows-only</strong> today. The steps below are
          the <strong>developer source build</strong>: the runtime + native
          compositors (Metal, OpenGL, Vulkan via MoltenVK) and the simulated
          display driver. The shell port and real 3D-display vendors on macOS
          are on the roadmap.
        </div>
      </>
    ),
  },
  {
    num: 2,
    title: "Install build dependencies",
    required: true,
    icon: <Terminal size={20} />,
    body: (
      <>
        <p className="text-text-secondary leading-relaxed mb-2">
          One Homebrew line covers everything:
        </p>
        <CodeBlock>brew install cmake ninja eigen vulkan-sdk</CodeBlock>
        <p className="text-sm text-text-secondary leading-relaxed">
          Vulkan on macOS routes through MoltenVK (bundled with the
          <code className="mx-1 bg-background text-accent px-1 py-0.5 rounded text-xs font-mono">
            vulkan-sdk
          </code>
          formula). The build script copies the loader + ICD into the
          packaged output so test apps run without a system-wide Vulkan
          install.
        </p>
      </>
    ),
  },
  {
    num: 3,
    title: "Clone and build the runtime",
    required: true,
    icon: <Hammer size={20} />,
    body: (
      <>
        <CodeBlock>{`git clone https://github.com/DisplayXR/displayxr-runtime.git
cd displayxr-runtime
./scripts/build_macos.sh`}</CodeBlock>
        <p className="text-text-secondary leading-relaxed mb-3">
          The script configures with CMake + Ninja, builds the runtime, the
          OpenXR loader, and the Metal / OpenGL / Vulkan test apps, then
          assembles a redistributable tree under{" "}
          <Mono>_package/DisplayXR-macOS/</Mono> with bundled MoltenVK and
          launcher scripts.
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          Optional flags: <Mono>--service</Mono> (build IPC service mode),{" "}
          <Mono>--hybrid</Mono> (auto-switching), <Mono>--installer</Mono>{" "}
          (also produce a <Mono>.pkg</Mono>; experimental, no signed release
          yet).
        </p>
      </>
    ),
  },
  {
    num: 4,
    title: "Run a test app on the simulated display",
    required: true,
    icon: <Eye size={20} />,
    body: (
      <>
        <p className="text-text-secondary leading-relaxed mb-3">
          The packaged tree includes per-API launcher scripts. They set{" "}
          <Mono>XR_RUNTIME_JSON</Mono> to the dev runtime so your system
          OpenXR loader isn&apos;t affected.
        </p>
        <CodeBlock>{`# Metal — the recommended path on macOS
_package/DisplayXR-macOS/run_cube_handle_metal.sh

# Other backends
_package/DisplayXR-macOS/run_cube_handle_gl.sh
_package/DisplayXR-macOS/run_cube_handle_vk.sh`}</CodeBlock>
        <p className="text-text-secondary leading-relaxed mb-3">
          The <Mono>sim_display</Mono> driver presents a tracked stereo
          display. Use <Mono>WASD</Mono> + the mouse to move the simulated
          eye position — the cube should show correct off-axis (Kooima)
          parallax as you move.
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          If the Metal app launches and the cube renders with parallax, your
          runtime is working end-to-end (state tracker → native compositor →
          display processor).
        </p>
      </>
    ),
  },
  {
    num: 5,
    title: "Point your own OpenXR app at the dev runtime",
    required: false,
    icon: <PlayCircle size={20} />,
    body: (
      <>
        <p className="text-text-secondary leading-relaxed mb-3">
          To route an external OpenXR app through the dev build instead of
          installing system-wide:
        </p>
        <CodeBlock>{`export XR_RUNTIME_JSON=$PWD/build/openxr_displayxr-dev.json
./your_openxr_app`}</CodeBlock>
        <p className="text-sm text-text-secondary leading-relaxed">
          You can also <Mono>cmake --install build</Mono> from the build
          directory if you want a more permanent install location. For a
          system-wide install without building, use the runtime{" "}
          <Mono>.pkg</Mono> from the{" "}
          <a
            href="/download"
            className="text-accent hover:text-accent-hover underline underline-offset-2"
          >
            Download
          </a>{" "}
          page — it&apos;s unsigned today (notarization pending), so install it
          from Terminal with <Mono>sudo installer</Mono>.
        </p>
      </>
    ),
  },
];

const windowsFAQs: FAQ[] = [
  {
    q: "Shell installer says the runtime isn't installed",
    a: (
      <>
        The shell installer reads{" "}
        <Mono>HKLM\Software\DisplayXR\Runtime\InstallPath</Mono>. If this
        key is missing, the runtime install didn&apos;t complete. Re-run{" "}
        <Mono>DisplayXRSetup-*.exe</Mono> as admin and confirm{" "}
        <strong>DisplayXR Service</strong> appears in{" "}
        <Mono>services.msc</Mono> before retrying the shell installer.
      </>
    ),
  },
  {
    q: "OpenXR apps still route to my old runtime",
    a: (
      <>
        The OpenXR loader picks the runtime registered at{" "}
        <Mono>HKLM\Software\Khronos\OpenXR\1\ActiveRuntime</Mono>. Confirm
        it points to the DisplayXR JSON; some VR runtimes (SteamVR, Oculus,
        WMR) reset this on launch. You can force DisplayXR per-process by
        setting <Mono>XR_RUNTIME_JSON</Mono> to its JSON path.
      </>
    ),
  },
  {
    q: "Shell launches but the display stays in 2D",
    a: (
      <>
        Press <Mono>V</Mono> to toggle 3D mode. The shell is focus-adaptive:
        focusing a 2D-only app intentionally drops back to 2D. If 3D mode
        never engages, check that the Leia SR service is running and that
        the display is recognized in your vendor control panel.
      </>
    ),
  },
  {
    q: "MCP server isn't reachable from my agent",
    a: (
      <>
        Confirm{" "}
        <Mono>HKLM\Software\DisplayXR\Capabilities\MCP\Enabled</Mono> is{" "}
        <Mono>1</Mono> and that the runtime / shell were restarted after
        installing MCP Tools. Each app process hosts its own named-pipe MCP
        endpoint; the shell hosts workspace-control tools. See the{" "}
        <a
          href={`${REPO_URLS.mcp}/blob/main/docs/mcp-spec.md`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-accent-hover underline underline-offset-2"
        >
          MCP spec
        </a>{" "}
        for the connection topology.
      </>
    ),
  },
];

const macosFAQs: FAQ[] = [
  {
    q: "build_macos.sh fails with 'eigen not found' or similar",
    a: (
      <>
        Make sure all four Homebrew formulas are installed in the same
        Homebrew prefix (Apple Silicon: <Mono>/opt/homebrew</Mono>; Intel:{" "}
        <Mono>/usr/local</Mono>). A common mode of failure is having two
        Homebrews on PATH. <Mono>brew --prefix eigen</Mono> should print a
        path that exists.
      </>
    ),
  },
  {
    q: "Vulkan test app crashes with VK_ERROR_EXTENSION_NOT_PRESENT",
    a: (
      <>
        Known MoltenVK limitation — not a build issue. The Metal compositor
        is the recommended path on macOS; OpenGL also works. Vulkan support
        is best-effort while MoltenVK gaps close.
      </>
    ),
  },
  {
    q: "Where's the shell on macOS?",
    a: (
      <>
        The DisplayXR Shell is Windows-only today. The macOS port (Metal
        multi-compositor + a macOS shell app) is on the roadmap; for now the
        macOS build is for runtime / extension / app development against{" "}
        <Mono>sim_display</Mono>.
      </>
    ),
  },
  {
    q: "Can I run real OpenXR apps without a 3D display on macOS?",
    a: (
      <>
        Yes — the <Mono>sim_display</Mono> driver presents a virtual tracked
        display on any Mac monitor. WASD + mouse move the simulated eye
        position. This is the same path the test apps use, so any OpenXR
        app pointing at <Mono>XR_RUNTIME_JSON</Mono> will see a tracked
        stereo display.
      </>
    ),
  },
];

const androidSteps: Step[] = [
  {
    num: 1,
    title: "Check the prerequisites",
    required: true,
    icon: <Smartphone size={20} />,
    body: (
      <>
        <p className="text-sm text-text-secondary leading-relaxed mb-3">
          On the host machine (Windows or macOS):
        </p>
        <ul className="space-y-2 text-text-secondary leading-relaxed list-disc list-inside">
          <li>Android SDK (API 35) + platform-tools (ADB)</li>
          <li>
            Android NDK <Mono>26.3.11579264</Mono> and CMake{" "}
            <Mono>3.22.1</Mono> (both ship through the Android SDK manager)
          </li>
          <li>Java JDK 17 and Python 3.6+</li>
          <li>
            Android Studio is optional but handy for first-time SDK/NDK setup
          </li>
        </ul>
        <p className="text-sm text-text-secondary leading-relaxed mt-4 mb-2">
          On the device:
        </p>
        <ul className="space-y-2 text-text-secondary leading-relaxed list-disc list-inside">
          <li>
            A Leia 3D Android device — <strong>ZTE Nubia Pad 2</strong> or{" "}
            <strong>Red Magic Explorer 3D</strong> (Lume Pad-class hardware with
            a lightfield display and face tracking)
          </li>
          <li>
            Developer options + USB debugging enabled (Settings → About → tap
            Build Number 7 times)
          </li>
          <li>
            The factory <strong>Leia Display Service</strong> +{" "}
            <strong>Leia Face Tracking Service</strong> present
          </li>
        </ul>
        <div className="mt-4 p-4 rounded-md bg-warning/10 border border-warning/30 text-sm text-text-secondary leading-relaxed">
          <strong className="text-text-primary">Heads up:</strong> Android is a{" "}
          <strong>developer source build</strong> today — you build the runtime
          APK and deploy with <Mono>adb</Mono>; there&apos;s no one-click
          installer. The DisplayXR Shell and MCP Tools are desktop-only; on
          Android the runtime drives the Leia display directly through the
          out-of-process vendor display processor.
        </div>
      </>
    ),
  },
  {
    num: 2,
    title: "Clone and point at the Android SDK",
    required: true,
    icon: <Terminal size={20} />,
    body: (
      <>
        <CodeBlock>{`git clone https://github.com/DisplayXR/displayxr-runtime.git
cd displayxr-runtime`}</CodeBlock>
        <p className="text-text-secondary leading-relaxed mb-2">
          Create <Mono>local.properties</Mono> in the repo root pointing at
          your SDK:
        </p>
        <CodeBlock>{`# Windows
sdk.dir=C:/Users/<you>/AppData/Local/Android/Sdk
# macOS
# sdk.dir=/Users/<you>/Library/Android/sdk`}</CodeBlock>
        <p className="text-sm text-text-secondary leading-relaxed">
          The Gradle build auto-downloads Eigen and the OpenXR loader, so the
          runtime APK builds without the vendor SDK in scope — the Leia CNSDK
          display-processor plug-in builds separately from{" "}
          <a
            href={REPO_URLS.leiaPlugin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-hover underline underline-offset-2"
          >
            displayxr-leia-plugin
          </a>
          .
        </p>
      </>
    ),
  },
  {
    num: 3,
    title: "Build the runtime APK",
    required: true,
    icon: <Hammer size={20} />,
    body: (
      <>
        <CodeBlock>{`./gradlew :src:xrt:targets:openxr_android:assembleInProcessDebug

# APK output:
# src/xrt/targets/openxr_android/build/outputs/apk/inProcess/debug/openxr_android-inProcess-debug.apk`}</CodeBlock>
        <p className="text-text-secondary leading-relaxed">
          The <Mono>inProcess</Mono> variant is the simplest single-app path
          and the one to start with; an <Mono>outOfProcess</Mono> variant adds
          the IPC service compositor for multi-app sessions. The APK registers
          as an OpenXR runtime via the{" "}
          <Mono>org.khronos.openxr.OpenXRRuntimeService</Mono> intent, which the
          Khronos loader discovers at <Mono>xrCreateInstance</Mono>.
        </p>
      </>
    ),
  },
  {
    num: 4,
    title: "Install on the device",
    required: true,
    icon: <Package size={20} />,
    body: (
      <>
        <p className="text-text-secondary leading-relaxed mb-2">
          Confirm the device is attached, then install:
        </p>
        <CodeBlock>{`adb devices   # should list your device as "device"

adb install -r \\
  src/xrt/targets/openxr_android/build/outputs/apk/inProcess/debug/openxr_android-inProcess-debug.apk`}</CodeBlock>
        <p className="text-sm text-text-secondary leading-relaxed">
          Verify the runtime registered:{" "}
          <Mono>adb shell pm list packages | grep monado</Mono> should list{" "}
          <Mono>org.freedesktop.monado.openxr_runtime.in_process</Mono>.
        </p>
      </>
    ),
  },
  {
    num: 5,
    title: "Smoke test with a sample app",
    required: false,
    icon: <Eye size={20} />,
    body: (
      <>
        <p className="text-text-secondary leading-relaxed mb-2">
          Build and install an OpenXR app — the{" "}
          <Mono>cube_handle_vk_android</Mono> test app, or the{" "}
          <a
            href={REPO_URLS.demoModelviewer}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-hover underline underline-offset-2"
          >
            model-viewer
          </a>{" "}
          /{" "}
          <a
            href={REPO_URLS.demoMediaplayer}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-hover underline underline-offset-2"
          >
            media-player
          </a>{" "}
          demos, which ship Android builds — then launch and watch the log:
        </p>
        <CodeBlock>{`adb shell am start -n com.displayxr.cube_handle_vk_android/android.app.NativeActivity
adb logcat -s cube_handle_vk_android:V DisplayXR:V leia:V`}</CodeBlock>
        <p className="text-sm text-text-secondary leading-relaxed">
          A healthy run logs the bring-up chain (
          <Mono>xrCreateInstance → xrCreateSession → Bring-up chain complete</Mono>
          ) and a steady frame counter, and the cube renders with eye-tracked
          off-axis (Kooima) parallax on the lightfield display.
        </p>
      </>
    ),
  },
];

const androidFAQs: FAQ[] = [
  {
    q: "APK installs but the runtime isn't discovered",
    a: (
      <>
        The Khronos loader finds the runtime through the{" "}
        <Mono>org.khronos.openxr.OpenXRRuntimeService</Mono> intent. Run{" "}
        <Mono>
          adb shell dumpsys package
          org.freedesktop.monado.openxr_runtime.in_process
        </Mono>{" "}
        and confirm the service filter is present and{" "}
        <Mono>SoFilename = libopenxr_displayxr.so</Mono>.
      </>
    ),
  },
  {
    q: "Black screen / no 3D interlacing",
    a: (
      <>
        Confirm the <strong>Leia Display Service</strong> is running (
        <Mono>adb shell dumpsys activity services | grep -i leia</Mono>) and
        that the vendor display processor came up —{" "}
        <Mono>adb logcat | grep &quot;Leia CNSDK DP created&quot;</Mono> should
        appear. The CNSDK plug-in (
        <Mono>libdxrp050_leia_cnsdk.so</Mono>) must be present in the runtime
        APK&apos;s <Mono>jniLibs</Mono>; it builds from the Leia plug-in repo.
      </>
    ),
  },
  {
    q: "Is there an Android installer for end users?",
    a: (
      <>
        Not yet — Android is a developer build today (Gradle + <Mono>adb</Mono>
        ). The runtime, the native Vulkan compositor, out-of-process vendor
        display processor, orientation-aware rendering, and mixed 2D/3D display
        zones are all shipping; packaged distribution is on the roadmap.
      </>
    ),
  },
  {
    q: "vkCreateAndroidSurfaceKHR fails",
    a: (
      <>
        The Vulkan native compositor needs <Mono>VK_KHR_android_surface</Mono>.
        The runtime enables it; if surface creation still fails, confirm the
        device&apos;s Vulkan driver advertises it via{" "}
        <Mono>adb shell dumpsys SurfaceFlinger | grep -i vulkan</Mono>.
      </>
    ),
  },
];

function WindowsFastPath() {
  return (
    <div className="bg-accent/10 border border-accent/30 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-accent">
          <Layers size={22} />
        </div>
        <h3 className="text-lg font-semibold text-text-primary">
          Fastest path: one installer
        </h3>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed mb-4">
        The{" "}
        <a
          href={`${REPO_URLS.installer}/releases/latest`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-accent-hover underline underline-offset-2"
        >
          DisplayXR meta-installer
        </a>{" "}
        (<Mono>DisplayXRBundle-*.exe</Mono>) installs the runtime, shell, and
        plug-ins in one step with pinned, compatible versions — recommended for
        most users. See the{" "}
        <a
          href="/download"
          className="text-accent hover:text-accent-hover underline underline-offset-2"
        >
          Download
        </a>{" "}
        page. (v1 ships unsigned; SmartScreen shows a one-time prompt — click{" "}
        <strong>More info → Run anyway</strong>.)
      </p>
      <p className="text-sm text-text-secondary leading-relaxed">
        Prefer to manage components yourself? The steps below install each one
        individually — useful for pinning a specific version, partial installs,
        or troubleshooting.
      </p>
    </div>
  );
}

function StepList({ steps }: { steps: Step[] }) {
  return (
    <section className="space-y-6">
      {steps.map((step) => (
        <Card key={step.num} className="!p-0">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/15 text-accent text-sm font-semibold border border-accent/30">
                {step.num}
              </div>
              <div className="text-accent">{step.icon}</div>
              <h3 className="text-lg font-semibold text-text-primary flex-1">
                {step.title}
              </h3>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                  step.required
                    ? "bg-success/15 text-success border-success/30"
                    : "bg-text-secondary/15 text-text-secondary border-text-secondary/30"
                }`}
              >
                {step.required ? "Required" : "Optional"}
              </span>
            </div>
            <div className="ml-11">{step.body}</div>
          </div>
        </Card>
      ))}
    </section>
  );
}

function Troubleshooting({ faqs }: { faqs: FAQ[] }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-accent">
          <HelpCircle size={20} />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
          Troubleshooting
        </h2>
      </div>
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <details
            key={i}
            className="bg-surface border border-border rounded-lg"
          >
            <summary className="cursor-pointer px-6 py-4 text-text-primary font-medium select-none">
              {f.q}
            </summary>
            <div className="px-6 pb-6 pt-2 text-sm text-text-secondary leading-relaxed">
              {f.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

type Platform = "windows" | "macos" | "android";

export function PlatformTabs() {
  const [platform, setPlatform] = useState<Platform>("windows");
  const tabs: { id: Platform; label: string; icon: ReactNode }[] = [
    { id: "windows", label: "Windows", icon: <Monitor size={16} /> },
    { id: "macos", label: "macOS", icon: <Apple size={16} /> },
    { id: "android", label: "Android", icon: <Smartphone size={16} /> },
  ];

  const steps =
    platform === "windows"
      ? windowsSteps
      : platform === "macos"
        ? macosSteps
        : androidSteps;
  const faqs =
    platform === "windows"
      ? windowsFAQs
      : platform === "macos"
        ? macosFAQs
        : androidFAQs;

  return (
    <div className="space-y-12">
      {/* Tab strip */}
      <div
        role="tablist"
        aria-label="Platform"
        className="inline-flex rounded-lg border border-border bg-surface p-1"
      >
        {tabs.map((t) => {
          const active = t.id === platform;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => setPlatform(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                active
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          );
        })}
      </div>

      {platform === "windows" && <WindowsFastPath />}
      {platform === "windows" && (
        <h2 className="text-xl font-semibold text-text-primary -mb-4">
          Or install components individually
        </h2>
      )}
      <StepList steps={steps} />
      <Troubleshooting faqs={faqs} />
    </div>
  );
}
