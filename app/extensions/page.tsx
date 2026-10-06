import { Metadata } from "next";
import Image from "next/image";
import { PageLayout } from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/Badge";
import { Table, TableCell, TableRow } from "@/components/ui/Table";
import { REPO_URLS } from "@/lib/constants";
import type { Status } from "@/lib/data/compatibility";
import { extensionsGenerated } from "@/lib/data/generated";
import { OPENXR_GAPS, type OpenXRGap } from "@/lib/data/openxr-gaps";

export const metadata: Metadata = {
  title: "Extensions",
  description:
    "Where vanilla OpenXR stops on a spatial display, and the XR_DXR_* extension that covers each gap: display geometry, window binding, 2D and 3D in one window, 3D over the desktop.",
};

/**
 * Editorial overlay for the extensions, keyed by extension name.
 *
 * The LIST itself is NOT maintained here: it comes from
 * lib/data/generated/extensions.json, which the runtime generates from its
 * XR_DXR_*.h headers plus its hand-written docs/specs/extensions/index.json and
 * publishes to displayxr-extensions. An extension with no entry below still
 * renders, using the one-line summary from that manifest. That is deliberate:
 * this page used to hand-list the extensions and quietly shipped 15 of 16
 * (XR_DXR_depth_budget was missing for weeks — displayxr-extensions#2).
 * Adding an entry here is an editorial upgrade, never a prerequisite for
 * appearing on the page. The build warns about drift both ways (see
 * `checkOverlay` below).
 *
 * Each card reads "Vanilla OpenXR assumes {vanillaGap} / This adds {adds} /
 * You need it if {needIf}". Every line was checked against the extension's
 * header and, where one exists, docs/specs/extensions/<name>.md in
 * displayxr-runtime (2026-10-05). Write from the spec, not the name; when the
 * spec is ambiguous, write less.
 *
 * Grouping follows the gap: an extension sits under the OPENXR_GAPS entry
 * whose `extensions` lists it (lib/data/openxr-gaps.ts, shared with the
 * homepage and /about), otherwise under "Advanced / other". `tier` orders the
 * cards inside a group: `essential` is what an ordinary app on that platform
 * reaches for; `advanced` is for shells, present-owners and special cases.
 */
interface Editorial {
  title?: string;
  status: Status;
  tier: "essential" | "advanced";
  /** Completes "Vanilla OpenXR assumes …". */
  vanillaGap: string;
  /** Completes "This adds …". */
  adds: string;
  /** Completes "You need it if …". */
  needIf: string;
  /** Override the default link (the spec, else the header). */
  href?: string;
}

const editorial: Record<string, Editorial> = {
  "XR_DXR_display_info": {
    title: "Display Info",
    status: "shipping",
    tier: "essential",
    vanillaGap:
      "a headset, whose optics fix the views. There is no call for a screen's physical size or the viewer's tracked eyes.",
    adds:
      "the panel's size in metres and a recommended render scale, its rendering modes (2D, stereo, multiview), eye-tracking modes with an event when tracking is lost, and where the panel sits on the desktop.",
    needIf:
      "you render for a spatial display on purpose. Unmodified OpenXR apps still run without it, with a runtime-chosen compromise.",
  },
  "XR_DXR_view_rig": {
    title: "View Rig",
    status: "early",
    tier: "essential",
    vanillaGap:
      "views come from fixed optics: the app renders the pose and field of view it is handed, with nothing to tune.",
    adds:
      "a rig descriptor chained on xrLocateViews (virtual display height and ipd, parallax and perspective factors, or a camera's convergence and vertical FOV). You get back standard XrView pose and FOV; the runtime does the off-axis math.",
    needIf:
      "you want to frame the scene's scale and depth without writing the off-axis projection yourself.",
  },
  "XR_DXR_win32_window_binding": {
    title: "Win32 Window Binding",
    status: "shipping",
    tier: "essential",
    vanillaGap:
      "the runtime owns the output. There is no app window to render into.",
    adds:
      "your HWND, so the runtime renders into your window: windowed mode, your own keyboard and mouse, several apps on one display. Also offscreen readback and a shared D3D11/D3D12 texture.",
    needIf: "your Windows app owns its window.",
  },
  "XR_DXR_cocoa_window_binding": {
    title: "Cocoa Window Binding",
    status: "shipping",
    tier: "essential",
    vanillaGap:
      "the runtime owns the output. There is no app window to render into.",
    adds:
      "your CAMetalLayer-backed NSView, so the runtime renders into your view: windowed mode, your own input, several apps on one display. Also offscreen readback.",
    needIf: "your macOS app owns its window.",
  },
  "XR_DXR_xlib_window_binding": {
    title: "Xlib Window Binding",
    status: "beta",
    tier: "essential",
    vanillaGap:
      "the runtime owns the output. There is no app window to render into.",
    adds:
      "your X11 Display* and Window, so the runtime's Vulkan compositor renders into your window: windowed mode, your own keyboard and mouse.",
    needIf: "your Linux app owns an X11 window.",
  },
  "XR_DXR_wayland_surface_binding": {
    title: "Wayland Surface Binding",
    status: "early",
    tier: "essential",
    vanillaGap:
      "the runtime owns the output. There is no app surface to render into.",
    adds:
      "your wl_display and wl_surface, and the surface size, which a Wayland surface does not carry. You keep the surface lifecycle; transparency over the desktop is native.",
    needIf: "your Linux app owns a Wayland surface.",
  },
  "XR_DXR_android_surface_binding": {
    title: "Android Surface Binding",
    status: "shipping",
    tier: "essential",
    vanillaGap:
      "the runtime owns the output. There is no app surface to render into.",
    adds:
      "your Surface, so the runtime composites into it instead of spawning its own, republished across background and resume, with the window's on-panel position each frame.",
    needIf:
      "your Android app runs in a window (freeform or split-screen). Without it, the runtime's own surface is fullscreen-only.",
  },
  "XR_DXR_local_3d_zone": {
    title: "Local 3D Zones",
    status: "beta",
    tier: "essential",
    vanillaGap:
      "the projection layer is the whole picture. Layers describe a world, not which pixels of a window are 3D.",
    adds:
      "a per-pixel 3D mask over your window (whole window, rectangles, or freeform) and a flat 2D layer composited after the weave. The same mask drives panels that can switch regions between 2D and 3D.",
    needIf: "your window mixes 3D with flat UI: toolbars, panels, text.",
  },
  "XR_DXR_display_zones": {
    title: "Display Zones",
    status: "beta",
    tier: "advanced",
    vanillaGap:
      "one set of views per session, framed for the whole display.",
    adds:
      "several 3D zones in one window, each framed by its own view rig, plus 2D zones and a mask telling the panel where to switch to 3D. Builds on Local 3D Zones and View Rig.",
    needIf:
      "you need more than one 3D region, or a 3D region framed apart from the rest of the window.",
  },
  "XR_DXR_weave": {
    title: "Window Weave Service",
    status: "experimental",
    tier: "advanced",
    vanillaGap:
      "the runtime presents the final image, so nothing else needs its weaver.",
    adds:
      "a weave service for callers that own and present their own window: hand it side-by-side stereo and window rects, get back a woven texture and a fence. The weave runs in out-of-process sessions only.",
    needIf:
      "you present your own window, as a browser does, and want 3D regions in it woven.",
  },
  "XR_DXR_depth_budget": {
    title: "Rear Depth Budget",
    status: "early",
    tier: "advanced",
    vanillaGap:
      "nothing shows through around the content, so how far back it renders is the app's call alone.",
    adds:
      "an advisory budget: the runtime looks at the desktop behind a transparent app and says how far behind the screen it can render and still read correctly. Ignore it and nothing changes.",
    needIf:
      "your app is transparent over the desktop and wants content behind the screen plane.",
  },
  "XR_DXR_spatial_workspace": {
    title: "Spatial Workspace",
    status: "shipping",
    tier: "advanced",
    vanillaGap:
      "each session stands alone. No process arranges the others.",
    adds:
      "the contract for a privileged workspace controller: claim the role, then place client windows, route input, hit-test and capture. The DisplayXR Shell is one such controller.",
    needIf:
      "you build a shell, launcher, kiosk or OEM workspace. Ordinary apps never do.",
  },
  "XR_DXR_workspace_file_dialog": {
    title: "Workspace File Dialog",
    status: "beta",
    tier: "advanced",
    vanillaGap: "no workspace: an app's dialogs are the OS's business.",
    adds:
      "an asynchronous file picker the workspace controller shows as its own window, with the result arriving as an event. When no controller supports it, the call says so and you use the OS dialog.",
    needIf:
      "your app runs inside a workspace such as the Shell and opens or saves files.",
  },
  "XR_DXR_mcp_tools": {
    title: "App MCP Tools",
    status: "early",
    tier: "advanced",
    vanillaGap:
      "input comes from the user's devices. There is no path for an agent to call into the app.",
    adds:
      "your own MCP tools on the runtime's per-app MCP server. Calls arrive on the OpenXR event queue and you answer from your frame loop; through the workspace, tools are namespaced by your app id.",
    needIf:
      "you want AI agents or voice drivers to operate your app. Inert unless MCP is enabled on the machine.",
  },
  "XR_DXR_atlas_capture": {
    title: "Atlas Capture",
    status: "early",
    tier: "advanced",
    vanillaGap:
      "the composed frame stays inside the runtime. To capture, you read back your own swapchains, once per graphics API.",
    adds:
      "one call that saves the multi-view atlas the runtime composed for your session as a PNG, at a compositor stage you pick. Any app class can call it.",
    needIf: "you want screenshots, recordings or datasets of your 3D output.",
  },
  "XR_DXR_lift": {
    title: "2D-to-3D Conversion",
    status: "experimental",
    tier: "advanced",
    vanillaGap: "the app renders its own 3D content.",
    adds:
      "asynchronous access to a display vendor's 2D-to-3D module (depth, stereo, N-view, or photo to Gaussian splats). It returns pre-weave results and never weaves. Today: out-of-process sessions on the Windows D3D11 service.",
    needIf:
      "you show 2D photos or video and want the panel's own conversion rather than shipping a model.",
  },
  "XR_DXR_macos_gl_binding": {
    title: "macOS OpenGL Binding",
    status: "shipping",
    tier: "advanced",
    vanillaGap:
      "OpenGL bindings for Windows and Linux (Xlib, XCB, Wayland), and none for macOS.",
    adds:
      "an OpenGL binding for macOS: pass your CGL context, and the runtime shares IOSurface-backed textures with its Metal compositor.",
    needIf: "your macOS app renders with OpenGL.",
  },
};

/**
 * Build-time drift check, both ways. Runs when the page module is evaluated,
 * i.e. during `next build` (the page is static) and in dev; the warning lands
 * in the build log, the page still renders.
 */
function checkOverlay() {
  const generated = new Set(extensionsGenerated.map((e) => e.name));
  const stale = Object.keys(editorial).filter((k) => !generated.has(k));
  const missing = [...generated].filter((n) => !(n in editorial));
  if (stale.length)
    console.warn(
      `[extensions] editorial overlay has entries not in generated/extensions.json (renamed or removed?): ${stale.join(", ")}`,
    );
  if (missing.length)
    console.warn(
      `[extensions] generated extensions with no editorial overlay (rendering the manifest summary): ${missing.join(", ")}`,
    );
}
checkOverlay();

interface Extension {
  name: string;
  title: string;
  status: Status;
  tier: Editorial["tier"];
  ed?: Editorial;
  summary: string;
  specVersion: number;
  href: string;
  gap: OpenXRGap["id"] | "other";
}

const extensions: Extension[] = extensionsGenerated.map((e) => {
  const ed = editorial[e.name];
  return {
    name: e.name,
    title: ed?.title ?? e.title,
    status: ed?.status ?? "early",
    tier: ed?.tier ?? "advanced",
    ed,
    summary: e.summary,
    specVersion: e.specVersion,
    href: ed?.href ?? e.specUrl ?? `${REPO_URLS.extensions}/blob/main/${e.header}`,
    gap: OPENXR_GAPS.find((g) => g.extensions.includes(e.name))?.id ?? "other",
  };
});

// Essential first; inside a tier, the gap's own listing order (Windows,
// macOS, Linux, Android for the bindings), then by name.
const gapOrder = (e: Extension) => {
  const i = OPENXR_GAPS.find((g) => g.id === e.gap)?.extensions.indexOf(e.name) ?? -1;
  return i < 0 ? Number.MAX_SAFE_INTEGER : i;
};
const byTier = (a: Extension, b: Extension) =>
  (a.tier === b.tier ? 0 : a.tier === "essential" ? -1 : 1) ||
  gapOrder(a) - gapOrder(b) ||
  a.name.localeCompare(b.name);

const mono = "rounded bg-surface px-1 py-0.5 font-mono text-xs text-accent";

function ExtensionCard({ ext }: { ext: Extension }) {
  return (
    <a
      id={ext.name}
      href={ext.href}
      target="_blank"
      rel="noopener noreferrer"
      className="card-interactive block scroll-mt-24 rounded-lg border border-border bg-surface p-6"
    >
      <div className="mb-1 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <h3 className="text-lg font-semibold text-text-primary">{ext.title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-text-secondary">
            {ext.tier === "essential" ? "Essential" : "Advanced"}
          </span>
          <Badge status={ext.status} />
        </div>
      </div>
      <code className="mb-4 block break-all font-mono text-xs text-accent">{ext.name}</code>
      {ext.ed ? (
        <dl className="space-y-2 text-sm leading-relaxed text-text-secondary">
          <div>
            <dt className="inline text-text-primary">Vanilla OpenXR assumes </dt>
            <dd className="inline">{ext.ed.vanillaGap}</dd>
          </div>
          <div>
            <dt className="inline text-accent">This adds </dt>
            <dd className="inline">{ext.ed.adds}</dd>
          </div>
          <div>
            <dt className="inline text-text-primary">You need it if </dt>
            <dd className="inline">{ext.ed.needIf}</dd>
          </div>
        </dl>
      ) : (
        <p className="text-sm leading-relaxed text-text-secondary">{ext.summary}</p>
      )}
    </a>
  );
}

export default function ExtensionsPage() {
  const other = extensions.filter((e) => e.gap === "other").sort(byTier);
  return (
    <PageLayout
      title="Extensions"
      description="OpenXR was written for headsets. A display on a desk differs in four ways; DisplayXR extends OpenXR with an XR_DXR_* extension for each."
    >
      <div className="max-w-3xl space-y-16">
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">Where vanilla OpenXR stops</h2>
          <ol className="grid gap-3 sm:grid-cols-2">
            {OPENXR_GAPS.map((g, i) => (
              <li key={g.id}>
                <a
                  href={`#${g.id}`}
                  className="card-interactive block h-full rounded-lg border border-border bg-surface p-4"
                >
                  <p className="text-xs text-text-secondary">{i + 1}</p>
                  <p className="font-semibold text-text-primary">{g.title}</p>
                </a>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-text-secondary">
            Plus <a href="#other" className="text-accent hover:text-accent-hover underline underline-offset-2">advanced extensions</a>{" "}
            for shells, capture, agents and 2D-to-3D.
          </p>
        </section>

        {OPENXR_GAPS.map((g, i) => {
          const items = extensions.filter((e) => e.gap === g.id).sort(byTier);
          return (
            <section key={g.id} id={g.id} className="scroll-mt-24">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-accent">Gap {i + 1}</p>
              <h2 className="mb-4 text-2xl font-semibold text-text-primary">{g.title}</h2>
              <div className="mb-6 grid gap-6 md:grid-cols-[1fr_14rem] md:items-start">
                <div className="space-y-2 text-sm leading-relaxed text-text-secondary">
                  <p>
                    <span className="text-text-primary">OpenXR assumes a headset:</span> {g.headset}
                  </p>
                  <p>
                    <span className="text-text-primary">On a display:</span> {g.display}
                  </p>
                </div>
                <div className="hidden overflow-hidden rounded-lg border border-border bg-surface md:block">
                  <Image
                    src={g.image.src}
                    alt={g.image.alt}
                    width={448}
                    height={252}
                    sizes="224px"
                    unoptimized={g.image.src.endsWith(".svg")}
                    className="h-auto w-full"
                  />
                </div>
              </div>
              <div className="space-y-4">
                {items.map((ext) => (
                  <ExtensionCard key={ext.name} ext={ext} />
                ))}
              </div>
            </section>
          );
        })}

        {other.length > 0 && (
          <section id="other" className="scroll-mt-24">
            <h2 className="mb-2 text-2xl font-semibold text-text-primary">Advanced / other</h2>
            <p className="mb-6 text-sm leading-relaxed text-text-secondary">
              Capture, agents, 2D-to-3D, workspace dialogs and graphics
              bindings: useful, and none of them a gap every app hits.
            </p>
            <div className="space-y-4">
              {other.map((ext) => (
                <ExtensionCard key={ext.name} ext={ext} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-2 text-2xl font-semibold text-text-primary">Catalog</h2>
          <p className="mb-6 text-sm leading-relaxed text-text-secondary">
            Generated from the headers. Since runtime v2.0.0 every extension
            uses the{" "}
            <code className={mono}>XR_DXR_*</code> author tag, registered with
            Khronos in July 2026 (before that, provisional{" "}
            <code className={mono}>XR_EXT_*</code> names);{" "}
            <code className={mono}>scripts/dxr_rename.py</code> in the runtime
            repo migrates a codebase in one command. Headers and specs live in{" "}
            <a
              href={REPO_URLS.extensions}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              displayxr-extensions
            </a>
            .
          </p>
          <Table headers={["Extension", "Spec", "Summary"]}>
            {[...extensionsGenerated]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((e) => (
                <TableRow key={e.name}>
                  <TableCell className="font-mono text-xs text-accent">
                    <a href={`#${e.name}`} className="break-all hover:underline">{e.name}</a>
                  </TableCell>
                  <TableCell className="text-text-secondary">v{e.specVersion}</TableCell>
                  <TableCell className="text-text-secondary">{e.summary}</TableCell>
                </TableRow>
              ))}
          </Table>
        </section>

        <section className="border-t border-border pt-12">
          <h2 className="mb-4 text-xl font-semibold text-text-primary">Where to next</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <a href="/developers/native" className="card-interactive block rounded-lg border border-border bg-surface p-6">
              <h3 className="mb-2 text-lg font-semibold text-text-primary">Build an app</h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                Start from a reference app and run it on sim-display, no
                special hardware required.
              </p>
            </a>
            <a
              href={`${REPO_URLS.runtime}/blob/main/docs/guides/implementing-extension.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="card-interactive block rounded-lg border border-border bg-surface p-6"
            >
              <h3 className="mb-2 text-lg font-semibold text-text-primary">Implement an extension</h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                The contributor guide walks through the runtime wiring end to end.
              </p>
            </a>
            <a href="/vendors" className="card-interactive block rounded-lg border border-border bg-surface p-6">
              <h3 className="mb-2 text-lg font-semibold text-text-primary">Integrate a display</h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                Vendors ship a display plug-in; apps keep using these extensions unchanged.
              </p>
            </a>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
