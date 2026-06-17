import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import { REPO_URLS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Architecture",
  description:
    "How the DisplayXR stack works — from OpenXR API layer through native compositors to vendor display processors.",
};

function ArchDiagram() {
  return (
    <div className="my-12 bg-surface border border-border rounded-lg p-8 md:p-12 overflow-x-auto glow-accent-sm">
      <div className="flex flex-col items-center gap-0 font-mono text-sm min-w-[400px]">
        {/* App layer */}
        <div className="bg-accent/10 border border-accent/30 rounded-lg px-8 py-3.5 text-accent font-semibold shadow-[0_0_16px_rgba(59,130,246,0.1)]">
          App (any graphics API)
        </div>
        <div className="w-px h-8 bg-gradient-to-b from-accent/30 to-border" />

        {/* OpenXR API */}
        <div className="bg-surface border border-border rounded-lg px-8 py-3.5 text-text-primary font-semibold">
          OpenXR API Layer
        </div>
        <div className="w-px h-8 bg-gradient-to-b from-border to-accent/30" />

        {/* DisplayXR Runtime */}
        <div className="bg-accent/15 border border-accent/40 rounded-lg px-10 py-3.5 text-accent font-semibold shadow-[0_0_24px_rgba(59,130,246,0.15)]">
          DisplayXR Runtime
        </div>
        <div className="w-px h-8 bg-gradient-to-b from-accent/30 to-border" />

        {/* Native Compositors */}
        <div className="flex gap-2.5 flex-wrap justify-center">
          {["D3D11", "D3D12", "Vulkan", "Metal", "OpenGL"].map((api) => (
            <div
              key={api}
              className="bg-surface border border-border rounded-md px-4 py-2.5 text-text-secondary text-xs font-medium hover:border-accent/30 hover:text-accent transition-colors"
            >
              {api}
            </div>
          ))}
        </div>
        <div className="w-px h-8 bg-gradient-to-b from-border to-warning/30" />

        {/* Display Processor */}
        <div className="bg-warning/10 border border-warning/30 rounded-lg px-8 py-3.5 text-warning font-semibold text-xs shadow-[0_0_16px_rgba(234,179,8,0.08)]">
          Display Processor (vendor-specific)
        </div>
        <div className="w-px h-8 bg-gradient-to-b from-warning/30 to-success/30" />

        {/* 3D Display */}
        <div className="bg-success/10 border border-success/30 rounded-lg px-8 py-3.5 text-success font-semibold shadow-[0_0_16px_rgba(34,197,94,0.1)]">
          3D Display
        </div>
      </div>
    </div>
  );
}

export default function ArchitecturePage() {
  return (
    <PageLayout
      title="Architecture"
      description="How the DisplayXR stack works, from OpenXR API layer through native compositors to vendor display processors."
    >
      <div className="max-w-3xl space-y-12">
        {/* Stack Overview */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
            Stack Overview
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            DisplayXR sits between the OpenXR API and vendor-specific display
            hardware. Applications write to the standard OpenXR interface.
            DisplayXR handles session management, compositor orchestration, and
            extension dispatch. Vendor-specific processing — weaving,
            interlacing, calibration — happens below, in the display processor
            layer. The same runtime ships on{" "}
            <strong className="text-text-primary">Windows, macOS, and Android</strong>.
          </p>
          <ArchDiagram />
          <p className="text-sm text-text-secondary italic">
            Each graphics API gets its own native compositor. No cross-API
            interop or Vulkan intermediary is required.
          </p>
        </section>

        {/* Native Compositor Model */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
            Native Compositor Model
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Most XR runtimes use a single graphics API internally and translate
            submitted textures as needed. DisplayXR takes a different approach:
            each supported graphics API has its own dedicated compositor
            implementation.
          </p>
          <div className="bg-surface border border-border rounded-lg p-6 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-accent font-mono text-sm shrink-0">D3D11</span>
              <span className="text-text-secondary text-sm">
                Full compositor with window binding. On Leia hardware the
                weaver runs in the Leia SR plug-in, not the compositor.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent font-mono text-sm shrink-0">D3D12</span>
              <span className="text-text-secondary text-sm">
                Native compositor with window binding. Command queue managed per
                session.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent font-mono text-sm shrink-0">Vulkan</span>
              <span className="text-text-secondary text-sm">
                Native compositor with swapchain management. MoltenVK path
                available on macOS; the Android compositor is Vulkan-native.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent font-mono text-sm shrink-0">Metal</span>
              <span className="text-text-secondary text-sm">
                Native compositor with sim_display weaver and window binding.
                macOS primary path.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent font-mono text-sm shrink-0">OpenGL</span>
              <span className="text-text-secondary text-sm">
                Native compositor supporting both Windows and macOS contexts.
              </span>
            </div>
          </div>
        </section>

        {/* Platforms */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
            Platforms
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            DisplayXR runs on three platforms from one codebase. On{" "}
            <strong className="text-text-primary">Windows</strong> it drives
            LeiaSR displays through the D3D11/D3D12/Vulkan/OpenGL compositors;
            on <strong className="text-text-primary">macOS</strong> it ships the
            Metal, OpenGL, and MoltenVK paths against the simulation backend.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            On <strong className="text-text-primary">Android</strong>, the same
            OpenXR runtime drives integrated 3D tablets and handhelds — such as
            ZTE&apos;s Nubia Pad 2 and Red Magic Explorer 3D — through the
            native Vulkan compositor. The vendor display processor runs{" "}
            <em>out-of-process</em> as a service, so the runtime stays
            vendor-neutral and apps connect over IPC with a zero-copy buffer
            handoff. Rendering is orientation-aware — portrait and landscape
            share one worst-case atlas, with no stall on live rotation — and the
            same display-zone and see-through transparency model used on the
            desktop lets a weaved 3D object sit beside a flat 2D HUD or float
            over the live screen.
          </p>
        </section>

        {/* Shipping Components */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
            Shipping Components
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            A DisplayXR install delivers four cooperating pieces. Most
            applications only interact with the first; the others come into play
            when apps are sandboxed, when the shell is running, or when the web
            is the target surface.
          </p>
          <div className="bg-surface border border-border rounded-lg p-6 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-accent font-mono text-sm shrink-0 w-28">Runtime</span>
              <span className="text-text-secondary text-sm">
                OpenXR API implementation. Loaded in-process by every OpenXR
                application.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent font-mono text-sm shrink-0 w-28">Service</span>
              <span className="text-text-secondary text-sm">
                IPC server and multi-compositor. Hosts the display for sandboxed
                apps and multi-app shell sessions. Starts at login and sits in
                the system tray.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent font-mono text-sm shrink-0 w-28">Shell</span>
              <span className="text-text-secondary text-sm">
                Reference workspace controller. Arranges 3D and 2D apps in a
                shared 3D scene with window chrome, layout presets, and an app
                launcher. Distributed separately from the runtime; entirely
                optional. See <em>Workspace Controllers</em> below.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent font-mono text-sm shrink-0 w-28">WebXR&nbsp;Bridge</span>
              <span className="text-text-secondary text-sm">
                Chrome extension plus a local bridge that gives WebXR pages the
                full DisplayXR surface — display geometry, rendering mode
                switching, tracked eye poses, HUD overlay, and input forwarding
                — on top of Chrome&apos;s native WebXR session. Ships with a
                three.js reference sample and a standalone minimal starter, and
                falls back gracefully to standard WebXR when the extension
                isn&apos;t installed.
              </span>
            </div>
          </div>
        </section>

        {/* Component Distribution */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
            How the Pieces Ship
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            DisplayXR is deliberately split across repositories so each piece
            evolves on its own cadence and the runtime stays vendor-neutral —
            the runtime binary carries no vendor SDK and no shell code. You can
            install everything at once with the{" "}
            <a
              href={REPO_URLS.installer}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              meta-installer
            </a>
            , or add components individually.
          </p>
          <div className="bg-surface border border-border rounded-lg p-6 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-accent font-mono text-sm shrink-0 w-32">Runtime</span>
              <span className="text-text-secondary text-sm">
                The OpenXR runtime, service, and native compositors.{" "}
                <a
                  href={REPO_URLS.runtime}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-hover underline underline-offset-2"
                >
                  displayxr-runtime
                </a>
                . Windows installer + macOS{" "}
                <code className="bg-background text-accent px-1 py-0.5 rounded text-xs font-mono">.pkg</code>.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-warning font-mono text-sm shrink-0 w-32">Vendor plug-ins</span>
              <span className="text-text-secondary text-sm">
                Display-processor DLLs the runtime discovers at startup — the
                weaving / interlacing for a specific panel. The{" "}
                <a
                  href={REPO_URLS.leiaPlugin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-hover underline underline-offset-2"
                >
                  Leia SR plug-in
                </a>{" "}
                is the reference. See the{" "}
                <a
                  href="/vendors"
                  className="text-accent hover:text-accent-hover underline underline-offset-2"
                >
                  Vendors
                </a>{" "}
                page.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent font-mono text-sm shrink-0 w-32">Workspace controllers</span>
              <span className="text-text-secondary text-sm">
                Optional spatial-desktop processes (windowing, launcher). The
                reference{" "}
                <a
                  href={REPO_URLS.shell}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-hover underline underline-offset-2"
                >
                  DisplayXR Shell
                </a>{" "}
                ships from its own repo — see below.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent font-mono text-sm shrink-0 w-32">Meta-installer</span>
              <span className="text-text-secondary text-sm">
                Bundles the above with pinned, compatible versions into one
                download.{" "}
                <a
                  href={REPO_URLS.installer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-hover underline underline-offset-2"
                >
                  displayxr-installer
                </a>
                .
              </span>
            </div>
          </div>
        </section>

        {/* Workspace Controllers */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
            Workspace Controllers
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            The runtime is useful on its own. A bare install gives you a
            standards-compliant OpenXR + WebXR surface for a 3D display — full-screen
            apps, simulation backend, native compositors, the WebXR bridge.
            No spatial desktop, no windowing, no launcher.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            A <strong className="text-text-primary">workspace controller</strong>{" "}
            is an optional process that adds spatial-desktop features on top:
            multi-app composition, window chrome, layout presets, an app
            launcher. The runtime exposes two extensions for this:{" "}
            <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-sm font-mono">
              XR_EXT_spatial_workspace
            </code>{" "}
            for window pose / hit-test / capture, and{" "}
            <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-sm font-mono">
              XR_EXT_app_launcher
            </code>{" "}
            for tile registration and lifecycle. Anything that speaks them is a
            first-class controller.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-sm font-semibold text-accent mb-2">
                Reference: DisplayXR Shell
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Distributed separately as a polished, opinionated spatial desktop —
                3D window manager, 2D capture, focus-adaptive 2D/3D mode, layout
                presets, launcher, MCP control. Optional.
              </p>
            </div>
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-sm font-semibold text-warning mb-2">
                Build your own
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                OEM-branded workspace, vertical cockpit (CAD, medical, automotive
                HMI), kiosk, or AI-agent driver. Implement the two extensions,
                register your binary, and the runtime treats it the same as the
                reference shell.
              </p>
            </div>
          </div>
          <p className="text-text-secondary leading-relaxed mb-4">
            Activation is gated by orchestrator-PID match: the runtime trusts
            the binary it was configured to spawn, not a brand string. OEMs
            point a single <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-sm font-mono">service.json</code>{" "}
            field at whichever controller the SKU should run.
          </p>
          <p className="text-sm text-text-secondary">
            Spec details:{" "}
            <a
              href={`${REPO_URLS.runtime}/blob/main/docs/specs/runtime/workspace-controller-registration.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              workspace-controller-registration.md
            </a>
            .
          </p>
        </section>

        {/* AI Control Surface */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
            AI Control Surface
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            DisplayXR exposes live spatial state and control to AI agents
            over the{" "}
            <a
              href="https://modelcontextprotocol.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              Model Context Protocol
            </a>
            . The framework is a separate, embeddable library at{" "}
            <a
              href={REPO_URLS.mcp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              displayxr-mcp
            </a>{" "}
            — JSON-RPC 2.0 over a unix-socket / Windows-named-pipe transport,
            with a stdio bridge for any MCP client (Claude Code, voice CLI,
            custom agent).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-sm font-semibold text-accent mb-2">
                Runtime tools (Phase A)
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Per-PID server inside each app&apos;s runtime DLL.
                Introspection:{" "}
                <code className="bg-background text-accent px-1 py-0.5 rounded text-xs font-mono">list_sessions</code>,{" "}
                <code className="bg-background text-accent px-1 py-0.5 rounded text-xs font-mono">get_display_info</code>,{" "}
                <code className="bg-background text-accent px-1 py-0.5 rounded text-xs font-mono">get_kooima_params</code>,{" "}
                <code className="bg-background text-accent px-1 py-0.5 rounded text-xs font-mono">capture_frame</code>,{" "}
                <code className="bg-background text-accent px-1 py-0.5 rounded text-xs font-mono">tail_log</code>.
              </p>
            </div>
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-sm font-semibold text-warning mb-2">
                Workspace tools (Phase B)
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Per-workspace-controller server. Window control:{" "}
                <code className="bg-background text-accent px-1 py-0.5 rounded text-xs font-mono">list_windows</code>,{" "}
                <code className="bg-background text-accent px-1 py-0.5 rounded text-xs font-mono">get/set_window_pose</code>,{" "}
                <code className="bg-background text-accent px-1 py-0.5 rounded text-xs font-mono">set_focus</code>,{" "}
                <code className="bg-background text-accent px-1 py-0.5 rounded text-xs font-mono">save/load_workspace</code>.
                Lives in the controller, not the runtime — third-party
                controllers ship their own.
              </p>
            </div>
          </div>
          <p className="text-text-secondary leading-relaxed mb-4">
            The library has no runtime or shell coupling — any C project can
            consume it via CMake <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-sm font-mono">FetchContent</code>{" "}
            and register its own tools. Every tool call is audit-logged and
            gated by a per-client allowlist.
          </p>
          <p className="text-text-secondary leading-relaxed">
            End users opt in by installing{" "}
            <strong className="text-text-primary">DisplayXR MCP Tools</strong>
            {" "}({" "}
            <a
              href={`${REPO_URLS.mcp}/releases`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              releases
            </a>
            ) — an optional third installer alongside the runtime and the
            shell. It writes{" "}
            <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-sm font-mono">
              HKLM\Software\DisplayXR\Capabilities\MCP\Enabled
            </code>
            , a registry capability flag that the runtime and the shell read
            at startup to spawn their MCP server thread. The{" "}
            <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-sm font-mono">
              DISPLAYXR_MCP=1
            </code>{" "}
            environment variable still works as a process-local override
            (CI / dev / quick-disable).
          </p>
        </section>

        {/* Two Compositor Paths */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
            Two Compositor Paths
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            The runtime chooses at session creation whether to composite inside
            the application process or delegate to the service. This decision is
            transparent to the application — it just uses OpenXR as normal.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-sm font-semibold text-accent mb-2">
                In-process (native)
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                The app, compositor, and display processor all live in one
                process, on the app&apos;s own GPU device. Zero IPC overhead.
                Used by most native applications running outside a sandbox.
              </p>
            </div>
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-sm font-semibold text-warning mb-2">
                IPC (service)
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                The app connects to the service over a named pipe. Swapchain
                textures are shared cross-process via OS primitives. The service
                composites all connected clients into a single output. Used by
                sandboxed browsers (Chrome WebXR) and apps launched by the
                shell.
              </p>
            </div>
          </div>
          <p className="text-text-secondary leading-relaxed mt-4">
            The runtime picks IPC automatically when it detects a sandboxed
            process (Chrome AppContainer, UWP) or a shell-managed session;
            otherwise it composites in-process.
          </p>
        </section>

        {/* Per-Graphics-API Design */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
            Per-Graphics-API Design
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            This per-API design means no texture copies between APIs, no
            translation overhead, and no dependency on a single &quot;blessed&quot;
            graphics backend. The compositor that runs is the one that matches
            the application&apos;s chosen API.
          </p>
          <p className="text-text-secondary leading-relaxed">
            The runtime selects the correct compositor at session creation time
            based on the graphics binding the application provides. This is
            transparent to the application — it simply uses OpenXR as normal.
          </p>
        </section>

        {/* Separation of Concerns */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
            Separation of Concerns
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            DisplayXR draws a clean boundary between two responsibilities:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-sm font-semibold text-accent mb-2">
                App-Facing Portability
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Standard OpenXR API, session management, swapchain handling,
                extension dispatch. Applications write once against this
                interface.
              </p>
            </div>
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-sm font-semibold text-warning mb-2">
                Vendor-Specific Processing
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Weaving, interlacing, calibration, eye tracking integration. This
                lives in the display processor layer and is owned by the hardware
                vendor.
              </p>
            </div>
          </div>
        </section>

        {/* Simulation Driver */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
            Simulation Driver
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            DisplayXR includes a simulation display processor (
            <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-sm font-mono">
              sim_display
            </code>
            ) that allows development and testing without physical 3D display
            hardware. It provides the same interface as a hardware-backed display
            processor but renders to a standard window.
          </p>
          <p className="text-text-secondary leading-relaxed">
            This means developers can build, test, and iterate on spatial display
            applications using any standard monitor. The simulation path supports
            all graphics APIs and all application classes.
          </p>
        </section>

        {/* Source link */}
        <div className="pt-8 border-t border-border space-y-2">
          <p className="text-sm text-text-secondary">
            For a deeper look at the in-process vs service compositor split, see{" "}
            <a
              href={`${REPO_URLS.runtime}/blob/main/docs/architecture/in-process-vs-service.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              in-process-vs-service.md
            </a>
            {" "}in the runtime repo.
          </p>
          <p className="text-sm text-text-secondary">
            Explore the full runtime source code on{" "}
            <a
              href={REPO_URLS.runtime}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              GitHub
            </a>
            .
          </p>
        </div>

        {/* Where to next */}
        <section className="pt-12 border-t border-border">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Where to next
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card href="/contribute" title="Contribute">
              <p className="text-sm text-text-secondary leading-relaxed">
                Add an extension, a driver, or a platform. The ADRs are
                documented and external contributors PR directly.
              </p>
            </Card>
            <Card href="/vendors" title="Integrate a display">
              <p className="text-sm text-text-secondary leading-relaxed">
                Plug your panel into the runtime through the vendor
                display-processor interface — no app changes required.
              </p>
            </Card>
            <Card href="/getting-started" title="Build an app">
              <p className="text-sm text-text-secondary leading-relaxed">
                Install the runtime and build a spatial-display app against
                standard OpenXR — runs in simulation on any monitor.
              </p>
            </Card>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
