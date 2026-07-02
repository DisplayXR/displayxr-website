import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { REPO_URLS, GITHUB_ORG_URL } from "@/lib/constants";
import { Puzzle, Search, ShieldCheck, Rocket, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Vendors & Plug-ins",
  description:
    "How 3D-display vendors integrate with DisplayXR — a vendor-neutral runtime that loads display-processor plug-ins discovered at startup. No runtime fork required.",
};

const DOCS_BASE = `${REPO_URLS.runtime}/blob/main/docs`;

export default function VendorsPage() {
  return (
    <PageLayout
      title="Vendors & Plug-ins"
      description="DisplayXR is vendor-neutral. Any 3D-display maker can ship a display-processor plug-in from their own repo — the runtime discovers and loads it at startup. You never fork the runtime."
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

        {/* Get started */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-accent">
              <Rocket size={22} />
            </span>
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
              Start from the reference
            </h2>
          </div>
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
            is a complete, shipping integration — the recommended starting
            point. Fork it, swap the driver for your hardware, and point the
            installer at your plug-in id.
          </p>
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
