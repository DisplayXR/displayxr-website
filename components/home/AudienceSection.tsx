import { Card } from "@/components/ui/Card";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Code2, MonitorSpeaker, GitPullRequest, Layers } from "lucide-react";
import type { ReactNode } from "react";

type Audience = {
  title: string;
  lead: string;
  description: string;
  icon: ReactNode;
  href: string;
  cta: string;
};

// The three audiences the project is built for. Each routes to that persona's
// entry point — mirrors the persona-led navigation.
const audiences: Audience[] = [
  {
    title: "App Developers",
    lead: "Writing an OpenXR app for spatial displays?",
    description:
      "Standard OpenXR — your existing app code works unchanged. Native compositors mean no Vulkan-interop layer; D3D11, D3D12, Metal, Vulkan, and OpenGL each get their own. Opt into XR_DXR_display_info for 3D-display geometry, eye-tracking modes, and asymmetric (Kooima) projection.",
    icon: <Code2 size={20} />,
    href: "/getting-started",
    cta: "Get started →",
  },
  {
    title: "Contributors",
    lead: "Want to expand the runtime or platform support?",
    description:
      "DisplayXR is open source and vendor-neutral. Add an OpenXR extension, a driver, or a new platform — the native-compositor architecture and the ADRs are documented, and external contributors PR directly against the repo. The roadmap shows where help lands.",
    icon: <GitPullRequest size={20} />,
    href: "/contribute",
    cta: "How to contribute →",
  },
  {
    title: "Display Vendors",
    lead: "Making a glasses-free 3D display panel?",
    description:
      "Implement the display-processor plug-in for your weaving / depth-mapping / eye-tracking integration — five API variants (D3D11, D3D12, Metal, Vulkan, OpenGL) so your weaver runs natively in whatever graphics API the app uses. Vendor-neutral by design: the runtime ships with no built-in display backend, so every panel integrates through the same plug-in interface.",
    icon: <MonitorSpeaker size={20} />,
    href: "/vendors",
    cta: "Plug-in guide →",
  },
];

export function AudienceSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 md:px-12 py-24">
      <div className="section-divider mb-24" />
      <AnimateIn>
        <h2 className="text-sm font-medium text-accent uppercase tracking-wider mb-4">
          Who is this for?
        </h2>
        <h3 className="text-3xl md:text-4xl font-display tracking-tight text-text-primary mb-4 max-w-2xl">
          Three audiences, one stack
        </h3>
        <p className="text-text-secondary leading-relaxed mb-12 max-w-2xl">
          DisplayXR is layered so app developers, contributors, and display
          vendors can each pick up exactly the part they need without forking
          the rest.
        </p>
      </AnimateIn>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {audiences.map((a, i) => (
          <AnimateIn key={a.title} delay={i * 80}>
            <Card title={a.title} icon={a.icon} href={a.href}>
              <p className="text-sm font-medium text-text-primary mb-3">
                {a.lead}
              </p>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                {a.description}
              </p>
              <span className="text-sm text-accent hover:text-accent-hover">
                {a.cta}
              </span>
            </Card>
          </AnimateIn>
        ))}
      </div>

      {/* Secondary: shipping a finished product (OEMs + vertical integrators) */}
      <AnimateIn delay={240}>
        <a
          href="/architecture"
          className="mt-4 block rounded-lg border border-border bg-surface/50 p-6 transition-colors hover:border-accent/50"
        >
          <div className="flex items-start gap-4">
            <div className="text-accent mt-0.5">
              <Layers size={20} />
            </div>
            <div>
              <h4 className="text-base font-semibold text-text-primary mb-1">
                Shipping a finished 3D-display product?
              </h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                OEMs and vertical integrators (laptops, monitors, kiosks, CAD /
                medical / automotive HMIs) can ship the bare runtime, the
                reference DisplayXR Shell, or their own workspace controller
                built on XR_DXR_spatial_workspace + XR_DXR_app_launcher — and
                embed displayxr-mcp to expose the same surface to an AI agent.
              </p>
              <span className="mt-3 inline-block text-sm text-accent hover:text-accent-hover">
                Architecture &amp; workspace controllers →
              </span>
            </div>
          </div>
        </a>
      </AnimateIn>
    </section>
  );
}
