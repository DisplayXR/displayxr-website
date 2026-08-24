import { Metadata } from "next";
import Image from "next/image";
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
    <div className="my-12 border border-border rounded-lg overflow-hidden">
      <Image
        src="/diagrams/dxr-stack-4layer.svg"
        unoptimized
        alt="The DisplayXR stack: an app on any engine or graphics API talks to the DisplayXR runtime (OpenXR state tracker with native D3D11, D3D12, Vulkan, Metal, and OpenGL compositors), which crosses the neutral xrt_plugin ABI into the vendor display processor and out to the 3D display."
        width={960}
        height={780}
        className="w-full h-auto"
      />
    </div>
  );
}

export default function ArchitecturePage() {
  return (
    <PageLayout
      title="Architecture"
      description="How the DisplayXR stack works, from OpenXR API layer through native compositors to vendor display processors."
      art="/art/dxr-depth-stack.webp"
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
            <strong className="text-text-primary">
              Windows, macOS, and Android
            </strong>
            , with desktop <strong className="text-text-primary">Linux</strong>{" "}
            in Preview.
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
            DisplayXR runs on four platforms from one codebase. On{" "}
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
          <p className="text-text-secondary leading-relaxed mb-4">
            Desktop <strong className="text-text-primary">Linux</strong> is
            Vulkan-only and in Preview. One native Vulkan compositor presents
            over either an X11/XCB or a Wayland surface, and apps hand the
            runtime their own window through{" "}
            <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-sm font-mono">
              XR_DXR_xlib_window_binding
            </code>{" "}
            or{" "}
            <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-sm font-mono">
              XR_DXR_wayland_surface_binding
            </code>
            . Transparent overlays work the same way they do elsewhere: a
            per-pixel-transparent 3D object stands on the desktop with live
            screen content composited under the weave, captured through the
            desktop portal. Every component — runtime, vendor plug-in, and all
            five demos — ships as a{" "}
            <code className="bg-background text-accent px-1 py-0.5 rounded text-xs font-mono">
              .deb
            </code>
            , and the bundle installs the whole stack in one command with no
            environment variables to set. It is Preview rather than GA: the
            service-side render path and windowed-3D phase origin are still in
            flight.
          </p>
        </section>

        {/* Regions: 2D and 3D in one window */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
            One Model for 2D and 3D Regions
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            A spatial-display window is rarely all-3D. A weaved 3D object often
            needs to sit beside a flat 2D HUD, a toolbar, or live screen content.
            DisplayXR expresses every such layout through a single mechanism —{" "}
            <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-sm font-mono">
              XR_DXR_display_zones
            </code>
            : an app declares any number of <strong className="text-text-primary">3D zones</strong>{" "}
            (each a rectangle with its own view rig and swapchain) alongside any
            number of <strong className="text-text-primary">2D zones</strong>, plus a
            per-pixel <em>wish mask</em> that tells the panel which areas should be
            physically 3D and which should stay flat. There is now exactly one way
            to say &quot;this region is 3D, that region is 2D.&quot;
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            This replaces an earlier, narrower mechanism. The original{" "}
            <em>2D-surround / output-rect</em> path could only express a single 3D
            rectangle surrounded by one monolithic 2D fill — a strict special case
            of the zone model, where the output rect is just one 3D zone and the
            surround one 2D zone. It was retired in runtime{" "}
            <strong className="text-text-primary">v1.25.0</strong>, folding both 2D
            and 3D region expression onto the same compositing path and removing the
            redundant per-API fill code.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Crucially, <strong className="text-text-primary">how an app owns its
            output surface is orthogonal to how it expresses regions.</strong>{" "}
            Whether the app draws into its own window, shares a texture with the
            runtime, or lets the runtime host a window for it, zones are how all of
            them carve up 2D and 3D. A plain full-window app is simply the degenerate
            one-zone case — it needs no explicit zones at all.
          </p>
        </section>

        {/* Compositing on a Woven Surface */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
            Compositing on a Woven Surface
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            A woven window is not an ordinary element. The runtime reads its
            composited quad every frame and interleaves the two eyes into the
            display&rsquo;s view pattern. That has a consequence authors meet
            immediately:{" "}
            <strong className="text-text-primary">
              what you draw on top of a 3D window is not automatically 2D
            </strong>
            .
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            Put a caption, a badge, or a hover plate over a woven window and
            &mdash; unaided &mdash; it is woven along with the content, arriving
            interleaved instead of crisp. DisplayXR handles the common case with{" "}
            <strong className="text-text-primary">overlay exclusion</strong>:
            mark the element and the compositor punches a per-pixel 2D hole in
            the weave there, compositing it over the woven 3D. The plate stays
            sharp, and a translucent scrim still reveals the depth underneath
            it.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            <strong className="text-text-primary">
              Exclusion is for partial regions, not whole windows.
            </strong>{" "}
            The compositor identifies a window by its rect. An overlay covering
            the entire window shares that rect, the match becomes ambiguous, and
            the window falls back to presenting its raw side-by-side buffer. So
            a full-surface effect &mdash; a depth view, a colour grade, a
            transition &mdash; cannot be layered on top. This is a property of
            matching by rect, not a gap to be patched.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-sm font-semibold text-accent mb-2">
                Partial overlay &mdash; use exclusion
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Caption bands, badges, hover plates, floating toolbars &mdash;
                anything occupying a sub-region of the window. Marked elements
                composite as crisp 2D over the woven 3D.
              </p>
            </div>
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-sm font-semibold text-warning mb-2">
                Full-surface effect &mdash; swap the source
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Depth views, colour grades, transitions &mdash; anything edge to
                edge. Redraw the buffer the window is woven from. Same weave,
                real stereo depth, no extra layer.
              </p>
            </div>
          </div>
          <p className="text-text-secondary leading-relaxed mb-4">
            The pattern that does work is to change{" "}
            <strong className="text-text-primary">what gets woven</strong>{" "}
            instead of drawing over it. A window&rsquo;s source is a buffer the
            runtime repaints from every frame: swap or redraw that buffer and
            the effect travels through the same weave. It keeps real stereo
            depth, costs no additional compositing layer, and there is nothing
            left to collide.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Progressive enhancement is a requirement here, not a slogan: an
            inline-3D page has to be a first-class page on an ordinary monitor.
            Where the runtime is absent, the same content renders from the
            stereo pair and its per-eye depth, synthesizing an in-between
            viewpoint that tracks the cursor &mdash; so the depth stays legible
            as motion parallax instead of being discarded. The 3D display makes
            the depth literal; the fallback keeps it visible. One page, one
            codebase, no separate &ldquo;3D version&rdquo;.
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
            apps, simulation backend, native compositors. No spatial desktop,
            no windowing, no launcher.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            A <strong className="text-text-primary">workspace controller</strong>{" "}
            is an optional process that adds spatial-desktop features on top:
            multi-app composition, window chrome, layout presets, an app
            launcher. The runtime exposes one extension for this:{" "}
            <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-sm font-mono">
              XR_DXR_spatial_workspace
            </code>{" "}
            for window pose / hit-test / capture; launcher tiles come from each
            app&apos;s{" "}
            <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-sm font-mono">
              *.displayxr.json
            </code>{" "}
            manifest. Anything that speaks it is a first-class controller.
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

        {/* Running Several Apps at Once */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
            Running Several Apps at Once
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            A spatial display is one piece of hardware, and only one interlacing
            pattern can be on it at a time. So the service keeps{" "}
            <strong className="text-text-primary">
              one always-on compositor pipeline
            </strong>{" "}
            with exactly{" "}
            <strong className="text-text-primary">
              one display processor per panel
            </strong>
            . Any number of connected apps render into that single pipeline and
            none of them drives the panel itself, so concurrent sessions cannot
            contend for the lens or strand each other in a mode someone else
            set.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            Which app the panel is showing is decided by the operating system
            rather than by a bespoke switcher. A connected app is an ordinary
            window: it has a taskbar and Alt-Tab entry, focusing it hands it the
            display, and launching it brings it to the front. A workspace
            controller composes the apps launched inside it — anything else can
            take the panel over a running workspace and give it back, with
            neither side being torn down.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            Handing the panel over does not restart the display processor. An
            append-only vtable slot lets the runtime re-bind a live processor to
            a different window, so a plug-in that implements it switches apps
            without the panel dropping to flat and back.
          </p>
          <p className="text-sm text-text-secondary">
            Design detail:{" "}
            <a
              href={`${REPO_URLS.runtime}/blob/main/docs/adr/ADR-035-service-owned-arbitration-single-pipeline-isolated-satellites.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              ADR-035
            </a>
            . The rest of that decision — per-client authorization and process
            isolation for in-service plug-ins — is still being phased in.
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
