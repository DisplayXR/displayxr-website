import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import { PlatformTabs } from "./PlatformTabs";

export const metadata: Metadata = {
  title: "Get Started with DisplayXR",
  description:
    "Install DisplayXR on Windows or build from source on macOS. End-to-end walkthroughs from a fresh machine to a running spatial workspace.",
};

const Mono = ({ children }: { children: React.ReactNode }) => (
  <code className="bg-background text-accent px-1.5 py-0.5 rounded text-xs font-mono">
    {children}
  </code>
);

export default function GettingStartedPage() {
  return (
    <PageLayout
      title="Get Started"
      description="Pick your platform. Windows installs from a one-click bundle (or per-component installers); macOS is a developer source build today."
    >
      <PlatformTabs />

      {/* Where next — platform-agnostic */}
      <section className="pt-12 mt-12 border-t border-border">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Where to next
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card href="/architecture" title="How it works">
            <p className="text-sm text-text-secondary leading-relaxed">
              Native compositors per graphics API, the workspace controller
              model, and how 2D + 3D apps share one display.
            </p>
          </Card>
          <Card href="/extensions" title="Build for 3D displays">
            <p className="text-sm text-text-secondary leading-relaxed">
              The OpenXR extensions DisplayXR adds —{" "}
              <Mono>XR_EXT_display_info</Mono>, window bindings, and the
              workspace surface.
            </p>
          </Card>
          <Card href="/demos" title="See it in action">
            <p className="text-sm text-text-secondary leading-relaxed">
              Reference apps and demos you can install alongside the
              runtime to verify your setup.
            </p>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
}
