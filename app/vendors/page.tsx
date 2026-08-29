import { Metadata } from "next";
import Image from "next/image";
import { PageLayout } from "@/components/layout/PageLayout";
import { REPO_URLS, GITHUB_ORG_URL } from "@/lib/constants";
import { Puzzle, Search, ShieldCheck, Rocket, Mail, Gamepad2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Vendors & Plug-ins",
  description:
    "How hardware vendors integrate with DisplayXR — a vendor-neutral runtime that discovers display-processor and input-provider plug-ins at startup. No runtime fork required.",
};

const DOCS_BASE = `${REPO_URLS.runtime}/blob/main/docs`;

export default function VendorsPage() {
  return (
    <PageLayout
      title="Vendors & Plug-ins"
      description="DisplayXR is vendor-neutral. Any 3D-display maker can ship a display-processor plug-in from their own repo — and any tracking-hardware maker can ship an input provider. The runtime discovers and loads both at startup. You never fork the runtime."
    >
      <div className="max-w-3xl space-y-12">
        {/* The model */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-accent">
              <Puzzle size={22} />
            </span>
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
              The plug-in model
            </h2>
          </div>
          <p className="text-text-secondary leading-relaxed mb-4">
            A vendor integration is a{" "}
            <strong className="text-text-primary">display-processor plug-in</strong>{" "}
            — a dynamically-loaded library that turns the rendered stereo pair
            into whatever a specific panel needs (lenticular weaving,
            interlacing, calibration) and feeds the runtime its display
            geometry and tracked eye positions. It ships from{" "}
            <em>your</em> repo with <em>your</em> installer, on <em>your</em>{" "}
            release cadence.
          </p>
          <p className="text-text-secondary leading-relaxed">
            This is the model as of{" "}
            <a
              href={`${REPO_URLS.runtime}/blob/main/docs/adr/ADR-019-vendor-plugin-aux-boundary.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              ADR-019
            </a>{" "}
            (issues #256 / #263). Earlier builds linked vendor drivers into the
            runtime tree; that approach is retired. The shipped runtime carries
            zero vendor SDK identifiers in its link line.
          </p>
          <p className="text-text-secondary leading-relaxed mt-4">
            The same line is drawn inside windowed weaving. Whoever owns the
            placement of the drawn region — the app, the runtime, or a Wayland
            compositor — tells your plug-in where that region landed, as a plain
            panel-space position anyone could observe. Turning position into an
            interlacing phase is yours alone: snapping, quantization, and
            everything else that needs lens pitch, slant, or subpixel layout
            stays inside your binary and never crosses the ABI (
            <a
              href={`${DOCS_BASE}/adr/ADR-033-placement-reports-geometry-weaver-owns-phase.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              ADR-033
            </a>
            ).
          </p>
          <div className="mt-6 border border-border rounded-lg overflow-hidden">
            <Image
              src="/diagrams/dxr-boundary-ip.svg"
              unoptimized
              alt="The IP boundary: the open neutral core (DisplayXR runtime with its native compositors, shipping zero vendor identifiers) on one side of the xrt_plugin ABI; vendor plug-ins with their proprietary weaving, calibration, and tracking — plus the zero-hardware sim_display reference — on the other."
              width={960}
              height={490}
              className="w-full h-auto"
            />
          </div>
        </section>

        {/* Discovery */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-accent">
              <Search size={22} />
            </span>
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
              How discovery works
            </h2>
          </div>
          <p className="text-text-secondary leading-relaxed mb-6">
            At{" "}
            <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-sm font-mono">
              xrCreateInstance
            </code>{" "}
            the runtime enumerates registered plug-ins, loads each in probe
            order, and the first one whose hardware is present wins. The
            built-in{" "}
            <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-sm font-mono">
              sim_display
            </code>{" "}
            plug-in sits last and always loses to real hardware.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-sm font-semibold text-accent mb-2">Windows</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Your installer registers the plug-in under{" "}
                <code className="bg-background text-accent px-1 py-0.5 rounded text-xs font-mono">
                  HKLM\Software\DisplayXR\DisplayProcessors\&lt;id&gt;
                </code>{" "}
                with a probe order and an uninstall string.
              </p>
            </div>
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-sm font-semibold text-accent mb-2">
                macOS / Linux
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                A JSON manifest in the DisplayProcessors search path points at
                your{" "}
                <code className="bg-background text-accent px-1 py-0.5 rounded text-xs font-mono">
                  .dylib
                </code>{" "}
                /{" "}
                <code className="bg-background text-accent px-1 py-0.5 rounded text-xs font-mono">
                  .so
                </code>
                , with the same probe-order semantics.
              </p>
            </div>
          </div>
        </section>

        {/* What you implement */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-accent">
              <ShieldCheck size={22} />
            </span>
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
              What you implement
            </h2>
          </div>
          <p className="text-text-secondary leading-relaxed mb-4">
            One exported symbol —{" "}
            <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-sm font-mono">
              xrtPluginNegotiate
            </code>{" "}
            — returning an{" "}
            <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-sm font-mono">
              xrt_plugin_iface
            </code>{" "}
            that the runtime calls for:
          </p>
          <ul className="space-y-2 text-sm text-text-secondary leading-relaxed list-disc pl-5">
            <li>
              <strong className="text-text-primary">probe</strong> — is your
              hardware present?
            </li>
            <li>
              <strong className="text-text-primary">display info</strong> —
              panel dimensions, eye-tracking mode (MANAGED or MANUAL).
            </li>
            <li>
              <strong className="text-text-primary">display-processor factories</strong>{" "}
              — one per graphics API you support (D3D11, D3D12, Vulkan, Metal,
              OpenGL). The compositor calls your{" "}
              <code className="bg-background text-accent px-1 py-0.5 rounded text-xs font-mono">
                process_atlas
              </code>{" "}
              each frame; it never weaves itself.
            </li>
          </ul>
          <p className="text-text-secondary leading-relaxed mt-4">
            Your vendor SDK is static-linked into the plug-in only. Zero
            compositor changes are required.
          </p>
        </section>

        {/* Input providers — the second plug-in type. The id is linked from the
            nav and footer so tracking-hardware makers have a direct entry point. */}
        <section id="input-providers" className="scroll-mt-32">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-accent">
              <Gamepad2 size={22} />
            </span>
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
              Input providers
            </h2>
          </div>
          <p className="text-text-secondary leading-relaxed mb-4">
            Displays are not the only hardware that plugs in. An{" "}
            <strong className="text-text-primary">input provider</strong> is a
            second, independent plug-in type that surfaces tracked motion
            controllers — or hands, or generic trackers — from an external
            tracking source into the standard OpenXR action system. Unmodified
            OpenXR apps consume them through{" "}
            <code className="bg-surface text-accent px-1 py-0.5 rounded text-xs font-mono">
              xrSyncActions
            </code>{" "}
            with no idea where the poses came from.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            It is deliberately <em>not</em> an extension of the display-processor
            vtable. Input providers have their own entry point (
            <code className="bg-surface text-accent px-1 py-0.5 rounded text-xs font-mono">
              xrtInputPluginNegotiate
            </code>
            ), their own ABI version, and their own discovery root, so a
            tracking-hardware maker ships one without touching the display side —
            and a display vendor is never obliged to implement input. Discovery,
            probe order, and ABI gating mirror the display-processor loader, so
            everything you learn from one applies to the other.
          </p>
          <p className="text-text-secondary leading-relaxed mb-6">
            A provider exposes N devices, each self-describing its type and
            claimed interaction profile, with pose, buttons, and haptics. If a
            provider supplies a left/right pair it claims those roles; otherwise
            the keyboard-emulated fallback fills them. The runtime ships a
            reference provider plus a loopback-TCP one with a documented wire
            protocol, so you can drive the action system from any language
            before committing to a native plug-in.
          </p>
          <a
            href={`${DOCS_BASE}/adr/ADR-034-input-provider-plugins.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface border border-border rounded-lg p-6 card-interactive cursor-pointer block"
          >
            <h3 className="text-sm font-semibold text-accent mb-2">
              ADR-034: Input Provider Plug-ins →
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Why input is a second plug-in type rather than a vtable extension,
              the negotiation contract, role arbitration, and the wire protocol.
            </p>
          </a>
        </section>

        {/* Get started */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-accent">
              <Rocket size={22} />
            </span>
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
              Start from the template
            </h2>
          </div>
          <p className="text-text-secondary leading-relaxed mb-4">
            The{" "}
            <a
              href={REPO_URLS.vendorTemplate}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              vendor plug-in template
            </a>{" "}
            is a buildable, ABI-correct starter kit that requires{" "}
            <strong className="text-text-primary">no vendor SDK at all</strong>.
            Clone it, rename the example driver to your own, and replace one
            function — the weave. It builds green before you touch it, so the
            first thing you see is a working pixel path rather than a build
            error.
          </p>
          <p className="text-text-secondary leading-relaxed mb-6">
            The{" "}
            <a
              href={REPO_URLS.leiaPlugin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              Leia SR plug-in
            </a>{" "}
            is a complete, shipping integration and the worked example to{" "}
            <em>read</em> — a real weaver, eye-tracking listener and installer in
            one place. It builds against a proprietary vendor SDK, so it is a
            reference rather than a starting point.
          </p>
          <div className="mb-6 rounded-lg border border-border bg-surface p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              What the first plug-in actually costs
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary leading-relaxed list-disc pl-5">
              <li>
                <strong className="text-text-primary">
                  Two mandatory vtable slots out of ~19
                </strong>{" "}
                — <code className="bg-background text-accent px-1 py-0.5 rounded text-xs font-mono">process_atlas</code>{" "}
                and{" "}
                <code className="bg-background text-accent px-1 py-0.5 rounded text-xs font-mono">destroy</code>{" "}
                — every other slot is optional and NULL-safe, so you implement
                only what your product needs.
              </li>
              <li>
                <strong className="text-text-primary">
                  About a week of DisplayXR plumbing
                </strong>{" "}
                for a competent engineer: negotiate, probe, create the device,
                report display info, installer and registration.
              </li>
              <li>
                <strong className="text-text-primary">
                  Your weaver and calibration stay yours.
                </strong>{" "}
                They are your own work, static-linked inside your binary, and
                they never cross the ABI.
              </li>
              <li>
                You ship a library and an installer from your own repo on your
                own cadence, and{" "}
                <strong className="text-text-primary">never fork the runtime</strong>.
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href={`${DOCS_BASE}/guides/vendor-plugin-onboarding.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface border border-border rounded-lg p-6 card-interactive cursor-pointer block"
            >
              <h3 className="text-sm font-semibold text-accent mb-2">
                Vendor Plug-in Onboarding →
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Zero-to-shipping walkthrough: the iface contract, build setup,
                installer, and registration.
              </p>
            </a>
            <a
              href={`${DOCS_BASE}/specs/runtime/plugin-discovery.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface border border-border rounded-lg p-6 card-interactive cursor-pointer block"
            >
              <h3 className="text-sm font-semibold text-accent mb-2">
                Plug-in Discovery Spec →
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                The registry / JSON-manifest format, probe order, and
                environment overrides in full detail.
              </p>
            </a>
          </div>
        </section>

        {/* Partner contact CTA */}
        <section>
          <div className="rounded-lg border border-accent/30 bg-accent/10 p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-accent">
                <Mail size={22} />
              </span>
              <h2 className="text-xl font-semibold tracking-tight text-text-primary">
                Bring your display to DisplayXR
              </h2>
            </div>
            <p className="text-text-secondary leading-relaxed mb-5">
              Building a spatial display and want it to run the existing library
              of DisplayXR content? We&apos;ll help you scope a plug-in and get
              your hardware onto the platform. A second independent vendor is
              also the milestone that moves the project toward shared, multi-vendor
              governance — get in touch early.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`${GITHUB_ORG_URL}/displayxr-runtime/issues/new?title=Vendor+integration+inquiry&labels=vendor`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-background hover:bg-accent-hover"
              >
                <Mail size={15} /> Start a conversation on GitHub
              </a>
              <a
                href={REPO_URLS.runtime}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-text-primary hover:border-accent/50"
              >
                Explore the runtime
              </a>
            </div>
            {/*
              Once a partner inbox is provisioned on displayxr.org, add an email
              button here:
                <a href={`mailto:${CONTACT_EMAIL}?subject=DisplayXR vendor integration`}>…</a>
              CONTACT_EMAIL is defined in lib/constants.ts.
            */}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
