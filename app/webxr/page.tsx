import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import { REPO_URLS } from "@/lib/constants";
import { Globe, Layers, BookOpen, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "WebXR",
  description:
    "How the web reaches a glasses-free 3D display: standard WebXR runs unmodified through the DisplayXR runtime, and inline 3D in the DisplayXR Browser is the supported authoring path.",
};

const BROWSER_URL = REPO_URLS.browser;
const WEB_SAMPLES_URL = "https://github.com/DisplayXR/displayxr-web";

const Mono = ({ children }: { children: ReactNode }) => (
  <code className="bg-background text-accent px-1.5 py-0.5 rounded text-xs font-mono">
    {children}
  </code>
);

const Ext = ({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
    {children}
  </a>
);

const link = "text-accent hover:text-accent-hover underline underline-offset-2";

export default function WebXRPage() {
  return (
    <PageLayout
      title="WebXR"
      description="Standard WebXR runs on a DisplayXR display with nothing extra installed. For web content authored for a 3D display, inline 3D in the DisplayXR Browser is the path we support."
    >
      <div className="max-w-3xl space-y-16">
        {/* Standard WebXR */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Standard WebXR works, unmodified
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Chrome speaks stock OpenXR through the loader into{" "}
            <Mono>displayxr-service</Mono>, so an ordinary{" "}
            <Mono>immersive-vr</Mono> page renders on the service compositor and
            out to the 3D display like any other OpenXR app. Install the runtime
            and existing WebXR content runs — no extension, no companion
            process, no page changes.
          </p>
          <p className="text-text-secondary leading-relaxed">
            What you get is generic stereo: the browser has no concept of the
            physical display, so framebuffers are compromise-scaled and the eyes
            are fixed rather than tracked. There is no head-tracked off-axis
            (Kooima) projection on this path, and no rendering-mode switching.
            That is the ceiling of an unaugmented browser, and it is the honest
            floor we support.
          </p>
        </section>

        {/* Inline 3D */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            For 3D-display-aware pages: inline 3D
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Immersive is the headset&apos;s model — one exclusive session that
            owns the whole display. A glasses-free desk display is not used that
            way. Its natural model is{" "}
            <strong className="text-text-primary">inline 3D</strong>: a weaved
            element sitting inside an ordinary page, surrounded by HTML, with the
            rest of the web still on screen around it.
          </p>
          <p className="text-text-secondary leading-relaxed mb-6">
            That is what the{" "}
            <Ext href={BROWSER_URL} className={link}>
              DisplayXR Browser
            </Ext>{" "}
            does. It renders the web normally and asks the runtime to weave the
            3D regions of the page through <Mono>XR_DXR_weave</Mono> —
            GPU-resident, no per-frame CPU readback, and no exclusive session to
            enter or leave.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Ext href={BROWSER_URL}>
              <Card title="DisplayXR Browser" icon={<Globe size={20} />}>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Developer-preview Chromium that weaves inline 3D on DisplayXR
                  hardware. <ArrowUpRight size={13} className="inline" />
                </p>
              </Card>
            </Ext>
            <Ext href={WEB_SAMPLES_URL}>
              <Card title="Samples & JS helper" icon={<Layers size={20} />}>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Inline-3D web samples and the helper library that drives them.{" "}
                  <ArrowUpRight size={13} className="inline" />
                </p>
              </Card>
            </Ext>
          </div>
        </section>

        {/* Retired sideband */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            The WebXR Bridge was retired
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Through runtime v2.10 we shipped a metadata sideband: an MV3 Chrome
            extension that added a <Mono>session.displayXR</Mono> surface, fed by
            a companion <Mono>displayxr-webxr-bridge.exe</Mono> on a loopback
            socket. It carried display geometry, rendering modes, tracked eye
            poses, HUD state, and forwarded input alongside Chrome&apos;s own
            frames. It was removed in{" "}
            <strong className="text-text-primary">v2.11</strong>.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            The reason is who it served. A page only benefited if it had been
            explicitly written against <Mono>session.displayXR</Mono>, so the
            bridge never upgraded the existing headset-authored WebXR corpus —
            its entire audience was developers already building for DisplayXR.
            Those developers are better served by inline 3D, and asking them to
            install a runtime, an extension, and a loopback daemon was a harder
            ask than installing our browser.
          </p>
          <div className="rounded-lg border border-accent/30 bg-accent/10 p-5">
            <p className="text-sm text-text-secondary leading-relaxed">
              <strong className="text-text-primary">Stated plainly:</strong>{" "}
              immersive WebXR is no longer a first-class authoring target for
              DisplayXR. Bare WebXR keeps working exactly as described above —
              nothing regressed for pages that never used the bridge — but the
              display-aware quality tier now lives in the browser&apos;s
              inline-3D path instead of an immersive session.
            </p>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed mt-6">
            The full rationale, and what was deliberately kept, is in{" "}
            <Ext href={`${REPO_URLS.runtime}/issues/1180`} className={link}>
              runtime issue #1180
            </Ext>
            .
          </p>
        </section>

        {/* Where to go next */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/extensions" className="flex-1">
              <Card title="Extensions" icon={<BookOpen size={20} />}>
                <p className="text-sm text-text-secondary leading-relaxed">
                  The OpenXR extensions behind all of this, including{" "}
                  <Mono>XR_DXR_weave</Mono>.
                </p>
              </Card>
            </a>
            <a href="/download" className="flex-1">
              <Card title="Download" icon={<ArrowUpRight size={20} />}>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Runtime installers for Windows, macOS, and Linux.
                </p>
              </Card>
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
