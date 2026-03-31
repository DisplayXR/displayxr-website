import { Metadata } from "next";
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
  specPath: string;
}

const extensions: Extension[] = [
  {
    name: "XR_DISPLAYXR_display_info",
    title: "Display Info",
    description:
      "Provides applications with spatial display geometry, resolution, and capabilities. Lets apps query display properties needed for correct off-axis projection and view configuration.",
    status: "shipping",
    specPath: "extensions/XR_DISPLAYXR_display_info",
  },
  {
    name: "XR_DISPLAYXR_win32_window_binding",
    title: "Win32 Window Binding",
    description:
      "Allows applications to bind an existing Win32 HWND to the DisplayXR session. The runtime composites into the application's own window rather than creating a separate one.",
    status: "shipping",
    specPath: "extensions/XR_DISPLAYXR_win32_window_binding",
  },
  {
    name: "XR_DISPLAYXR_cocoa_window_binding",
    title: "Cocoa Window Binding",
    description:
      "macOS equivalent of the Win32 window binding. Binds an NSView to the session for compositor output into the application's window.",
    status: "shipping",
    specPath: "extensions/XR_DISPLAYXR_cocoa_window_binding",
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
        </section>

        {/* Extension list */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-6">
            Current Extensions
          </h2>
          <div className="space-y-4">
            {extensions.map((ext) => (
              <Card key={ext.name} href={`${REPO_URLS.extensions}/tree/main/${ext.specPath}`}>
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
      </div>
    </PageLayout>
  );
}
