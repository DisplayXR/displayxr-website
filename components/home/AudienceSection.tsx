import { Card } from "@/components/ui/Card";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Code2, MonitorSpeaker, Layers, Sparkles } from "lucide-react";
import { REPO_URLS } from "@/lib/constants";
import type { ReactNode } from "react";

type Audience = {
  title: string;
  lead: string;
  description: string;
  icon: ReactNode;
  href: string;
  cta: string;
};

const audiences: Audience[] = [
  {
    title: "Application developers",
    lead: "Writing an OpenXR app for spatial displays?",
    description:
      "Standard OpenXR — your existing app code works unchanged. Native compositors mean no Vulkan-interop layer; D3D11, D3D12, Metal, Vulkan, and OpenGL each get their own. Opt into XR_EXT_display_info for 3D-display geometry, eye-tracking modes, and the data needed for asymmetric (Kooima) projection.",
    icon: <Code2 size={20} />,
    href: "/extensions",
    cta: "Browse extensions →",
  },
  {
    title: "3D display vendors",
    lead: "Making a glasses-free 3D display panel?",
    description:
      "Implement the display-processor vtable for your weaving / depth-mapping / eye-tracking integration. Five API variants (D3D11, D3D12, Metal, Vulkan, OpenGL) so your weaver runs natively in whatever graphics API the application is using. Vendor-agnostic by design — Leia SR is the first integration, not a privileged path.",
    icon: <MonitorSpeaker size={20} />,
    href: `${REPO_URLS.runtime}/blob/main/docs/guides/vendor-integration.md`,
    cta: "Vendor integration guide →",
  },
  {
    title: "OEMs",
    lead: "Shipping a finished 3D-display product (laptop, monitor, tablet, phone, TV)?",
    description:
      "Three reasonable bundles: bare runtime + DP for the lightest install, runtime + reference DisplayXR Shell with a sidecar manifest that brands the tray for your product, or runtime + your own workspace controller for a SKU-tailored experience. Activation is gated by orchestrator-PID match — the runtime trusts whatever binary it was configured to spawn, not a brand string.",
    icon: <Layers size={20} />,
    href: "/architecture",
    cta: "Architecture & workspace controllers →",
  },
  {
    title: "Vertical integrators",
    lead: "Building a focused single-purpose 3D experience (CAD, medical, automotive HMI, kiosk, AI agent)?",
    description:
      "Run the bare runtime + your application for a kiosk-class deployment — the runtime gives you OpenXR session management, native compositing, and display calibration. Or write a vertical-specific workspace controller against XR_EXT_spatial_workspace + XR_EXT_app_launcher to compose multiple apps for your domain (medical imaging suite, CAD viewer + reference panels, automotive cockpit). Embed displayxr-mcp to expose the same surface to an AI agent.",
    icon: <Sparkles size={20} />,
    href: "/extensions",
    cta: "Workspace extension surface →",
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
          Four kinds of builder, one stack
        </h3>
        <p className="text-text-secondary leading-relaxed mb-12 max-w-2xl">
          DisplayXR is designed so application developers, display vendors,
          OEMs, and vertical integrators can each pick up exactly the layer
          they need without forking the rest.
        </p>
      </AnimateIn>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </section>
  );
}
