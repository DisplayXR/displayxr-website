import { Metadata } from "next";
import Image from "next/image";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { REPO_URLS } from "@/lib/constants";
import type { Status } from "@/lib/data/compatibility";

export const metadata: Metadata = {
  title: "Extensions",
  description:
    "Custom OpenXR extensions for tracked spatial display capabilities — display info, window bindings, and more.",
};

interface Extension {
  name: string;
  title: string;
  description: string;
  status: Status;
  group: "display" | "rendering" | "windowing" | "workspace" | "capture" | "agent";
  /** Override the default per-header link (for extensions without a published header yet). */
  href?: string;
}

const extensions: Extension[] = [
  // Display capability
  {
    name: "XR_DXR_display_info",
    title: "Display Info",
    description:
      "Provides applications with spatial display geometry, resolution, eye-tracking modes, and the data needed for correct off-axis (Kooima) projection and view configuration. Each rendering mode declares whether it consumes live eye tracking, and apps receive an edge-triggered event on tracking loss and recovery. Spec v16 adds a desktop-position query so a window-owning app can learn where the 3D panel sits in the virtual desktop and open its window there.",
    status: "shipping",
    group: "display",
  },
  // Rendering & projection
  {
    name: "XR_DXR_view_rig",
    title: "View Rig",
    description:
      "Lets an app drive the runtime's view-rig math instead of re-implementing the off-axis (Kooima) projection from raw eye positions. The app chains a small rig descriptor — virtual display height and ipd/parallax/perspective factors for a display rig, or convergence and vertical FOV for a camera rig — onto xrLocateViews and consumes standard, render-ready XrView{pose, fov}, exactly as on any other OpenXR runtime. A raw-result channel still exposes the untransformed eye and display-plane inputs for aware consumers that keep doing their own math.",
    status: "early",
    group: "rendering",
  },
  {
    name: "XR_DXR_local_3d_zone",
    title: "Local 3D Zones",
    description:
      "Lets an app declare which regions of its window are 3D versus flat 2D via a per-pixel 3D-ness mask, authored as the whole window, a list of rects, or a freeform render target. The runtime composites a flat 2D layer over the weaved 3D output gated by the mask, and a hardware display processor can drive a switchable-lens panel so only the 3D regions weave. Spec v3 adds the 2D side as a first-class post-weave composition layer submitted through the normal frame loop.",
    status: "beta",
    group: "rendering",
  },
  {
    name: "XR_DXR_display_zones",
    title: "Display Zones",
    description:
      "Declares a layout of independent 3D zones and flat 2D zones across a single display, each 3D zone carrying its own view rig, plus a wish mask the vendor display processor honors when driving a switchable-lens panel. Powers mixed 2D/3D compositions — a weaved 3D object beside a flat 2D HUD, for example — and underpins the out-of-process display compositing used on Android.",
    status: "beta",
    group: "rendering",
  },
  // App-side window binding
  {
    name: "XR_DXR_win32_window_binding",
    title: "Win32 Window Binding",
    description:
      "Allows applications to bind an existing Win32 HWND to the DisplayXR session. The runtime composites into the application's own window rather than creating a separate one.",
    status: "shipping",
    group: "windowing",
  },
  {
    name: "XR_DXR_cocoa_window_binding",
    title: "Cocoa Window Binding",
    description:
      "macOS equivalent of the Win32 window binding. Binds an NSView to the session for compositor output into the application's window.",
    status: "shipping",
    group: "windowing",
  },
  {
    name: "XR_DXR_xlib_window_binding",
    title: "Xlib Window Binding",
    description:
      "Desktop-Linux equivalent of the Win32 and Cocoa window bindings. An app hands the runtime its own X11 window (Display* + Window) so the native Vulkan/XCB compositor renders into the app's window instead of creating its own — enabling windowed (non-fullscreen) rendering and app-owned keyboard and mouse input.",
    status: "beta",
    group: "windowing",
  },
  {
    name: "XR_DXR_macos_gl_binding",
    title: "macOS GL Binding",
    description:
      "macOS-specific OpenGL context binding for the Cocoa window-binding path. Lets GL apps share a CAOpenGLLayer-backed surface with the runtime compositor.",
    status: "shipping",
    group: "windowing",
  },
  {
    name: "XR_DXR_android_surface_binding",
    title: "Android Surface Binding",
    description:
      "Android equivalent of the Win32 and Cocoa window bindings. Binds an Android Surface (SurfaceView) to the session so the runtime composites into the app's surface, and carries the surface lifecycle the out-of-process Android compositor follows across rotation, background, and resume.",
    status: "shipping",
    group: "windowing",
    href: REPO_URLS.extensions,
  },
  // Workspace controller surface (the swappable shell story)
  {
    name: "XR_DXR_spatial_workspace",
    title: "Spatial Workspace",
    description:
      "Defines how a privileged workspace controller process drives multi-app composition, window pose, hit-test, and capture on the runtime. The contract that lets the DisplayXR Shell — or any OEM, vertical, kiosk, or AI-agent controller — replace the spatial-desktop layer without runtime modifications.",
    status: "shipping",
    group: "workspace",
  },
  {
    name: "XR_DXR_app_launcher",
    title: "App Launcher",
    description:
      "Companion to spatial_workspace: lets a workspace controller register launcher tiles, query installed apps, and drive launch/lifecycle events. Decouples the launcher UX from the runtime.",
    status: "shipping",
    group: "workspace",
    href: REPO_URLS.extensions,
  },
  {
    name: "XR_DXR_workspace_file_dialog",
    title: "Workspace File Dialog",
    description:
      "An async, spatial-native file picker. An app calls for a picker and receives the result through the event queue; the picker is a peer workspace window spawned by the active controller, not a layer inside the app's own window. Workspace-scoped, with graceful fallback to the platform file dialog when no controller advertises support.",
    status: "beta",
    group: "workspace",
  },
  // Agent control
  {
    name: "XR_DXR_mcp_tools",
    title: "App MCP Tools",
    description:
      "Lets an application register its own Model Context Protocol tools with the runtime's agent surface. AI agents and voice drivers can then invoke app-defined actions — tool calls arrive through the OpenXR event queue, the app answers inline, and tools are namespaced by the app's manifest id.",
    status: "early",
    group: "agent",
  },
  // Capture
  {
    name: "XR_DXR_atlas_capture",
    title: "Atlas Capture",
    description:
      "A vendor-neutral, non-privileged way to snapshot the multi-view atlas the runtime composes for a session to a PNG, at a caller-selected compositor stage. The runtime does the readback from its own atlas image, so apps drop the per-graphics-API staging-texture readbacks they each reimplement today. Any app — handle, texture, hosted, or IPC — can call it.",
    status: "early",
    group: "capture",
  },
  // Present-owner weave service
  {
    name: "XR_DXR_weave",
    title: "Window Weave Service",
    description:
      "A window-bound, synchronous weave service for present-owners — callers that own their OS window and present it themselves, but want the runtime's vendor display processor to weave a sub-rect of that window for them. The caller hands the runtime a pre-weave stereo (side-by-side) texture and a window-relative rect and gets back a weaved shared texture plus a fence to composite and present. The caller never weaves; it is the runtime half of the inline-3D-in-a-browser path.",
    status: "experimental",
    group: "rendering",
  },
];

export default function ExtensionsPage() {
  return (
    <PageLayout
      title="Extensions"
      description="Custom OpenXR extensions that enable tracked spatial display capabilities not covered by the base OpenXR specification."
    >
      <div className="max-w-3xl space-y-12">
        {/* Why extensions */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Why custom extensions?
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Standard OpenXR was designed for headsets and controllers. Tracked
            spatial displays have different requirements: they need to
            communicate display geometry, support window-hosted compositing, and
            provide spatial display models that don&apos;t map to existing OpenXR
            concepts.
          </p>
          <p className="text-text-secondary leading-relaxed">
            DisplayXR defines focused extensions to fill these gaps while
            remaining compatible with the OpenXR architecture and extension
            model. The goal is practical interoperability, not a competing
            specification.
          </p>
          <p className="text-text-secondary leading-relaxed mt-4">
            As of runtime <strong className="text-text-primary">v2.0.0</strong>,
            every DisplayXR extension lives under the project&apos;s own{" "}
            <code className="bg-surface text-accent px-1 py-0.5 rounded text-xs font-mono">
              XR_DXR_*
            </code>{" "}
            vendor author tag rather than the earlier provisional{" "}
            <code className="bg-surface text-accent px-1 py-0.5 rounded text-xs font-mono">
              XR_EXT_*
            </code>{" "}
            naming (registration of the DXR author tag is in final review with
            Khronos). The rename is a breaking change: apps built against the old
            names need a runtime older than v2.0.0, or a rebuild against the
            v2.0.0 headers — the runtime repository ships a one-command
            migration script (
            <code className="bg-surface text-accent px-1 py-0.5 rounded text-xs font-mono">
              scripts/dxr_rename.py
            </code>
            ) that rewrites a codebase in place.
          </p>
          <div className="mt-6 border border-border rounded-lg overflow-hidden">
            <Image
              src="/diagrams/dxr-kooima-frustum.svg"
              unoptimized
              alt="Tracked off-axis projection: an asymmetric frustum from the tracked eye position to the corners of the fixed display plane, recomputed every frame as the eye moves, so rendered content reads as depth behind the glass."
              width={960}
              height={540}
              className="w-full h-auto"
            />
          </div>
        </section>

        {/* Extension list, grouped */}
        {(
          [
            {
              key: "display",
              label: "Display capability",
              blurb:
                "What the runtime tells apps about the 3D display they're rendering on.",
            },
            {
              key: "rendering",
              label: "Rendering & projection",
              blurb:
                "How an app drives the runtime's view math and tells it which parts of the window are 3D versus flat 2D — instead of re-implementing the projection or 2D/3D compositing itself.",
            },
            {
              key: "windowing",
              label: "App window binding",
              blurb:
                "How an app hands its native window to the runtime so the compositor can output into it.",
            },
            {
              key: "workspace",
              label: "Workspace controller surface",
              blurb:
                "How a swappable workspace controller (the DisplayXR Shell, or any third-party / OEM / vertical equivalent) drives multi-app composition and the launcher on top of the runtime.",
            },
            {
              key: "agent",
              label: "Agent control",
              blurb:
                "How applications plug into the AI-agent surface — exposing their own actions to agents and voice drivers through the same MCP framework the runtime and workspace controllers use.",
            },
            {
              key: "capture",
              label: "Capture",
              blurb:
                "Getting the composed 3D frame back out of the runtime — for screenshots, recording, and dataset generation.",
            },
          ] as const
        ).map((group) => {
          const items = extensions.filter((e) => e.group === group.key);
          if (items.length === 0) return null;
          return (
            <section key={group.key}>
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                {group.label}
              </h2>
              <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                {group.blurb}
              </p>
              <div className="space-y-4">
                {items.map((ext) => (
                  <Card
                    key={ext.name}
                    href={
                      ext.href ??
                      `${REPO_URLS.extensions}/blob/main/include/openxr/${ext.name}.h`
                    }
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <code className="text-accent font-mono text-sm font-semibold">
                        {ext.name}
                      </code>
                      <Badge status={ext.status} />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      {ext.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {ext.description}
                    </p>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}

        {/* Philosophy */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Extension philosophy
          </h2>
          <ul className="space-y-3 text-text-secondary leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1.5 text-xs">&#9679;</span>
              <span>
                <strong className="text-text-primary">Minimal scope</strong> —
                each extension does one thing well. No monolithic specs.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1.5 text-xs">&#9679;</span>
              <span>
                <strong className="text-text-primary">OpenXR-compatible</strong>{" "}
                — follows the standard extension registration and dispatch
                model.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1.5 text-xs">&#9679;</span>
              <span>
                <strong className="text-text-primary">
                  Vendor-independent
                </strong>{" "}
                — designed for any tracked spatial display, not tied to a
                specific hardware vendor.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1.5 text-xs">&#9679;</span>
              <span>
                <strong className="text-text-primary">
                  Explicitly versioned
                </strong>{" "}
                — specs evolve through clear versioning so apps and runtimes can
                negotiate capabilities.
              </span>
            </li>
          </ul>
        </section>

        {/* Source */}
        <div className="pt-8 border-t border-border">
          <p className="text-text-secondary">
            All extension specifications and headers are in the{" "}
            <a
              href={REPO_URLS.extensions}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              displayxr-extensions
            </a>{" "}
            repository.
          </p>
        </div>

        {/* Where to next */}
        <section className="pt-12 border-t border-border">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Where to next
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card href="/getting-started" title="Build an app">
              <p className="text-sm text-text-secondary leading-relaxed">
                Install the runtime and opt into these extensions from your own
                OpenXR app — no special hardware required.
              </p>
            </Card>
            <Card
              href={`${REPO_URLS.runtime}/blob/main/docs/guides/implementing-extension.md`}
              title="Implement an extension"
            >
              <p className="text-sm text-text-secondary leading-relaxed">
                Add or extend an OpenXR extension in the runtime — the
                contributor guide walks through the wiring end to end.
              </p>
            </Card>
            <Card href="/vendors" title="Integrate a display">
              <p className="text-sm text-text-secondary leading-relaxed">
                Vendors: ship a display-processor plug-in that consumes{" "}
                <code className="bg-surface text-accent px-1 py-0.5 rounded text-xs font-mono">
                  XR_DXR_display_info
                </code>{" "}
                and the window bindings.
              </p>
            </Card>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
