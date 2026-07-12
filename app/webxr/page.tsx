import { Metadata } from "next";
import Image from "next/image";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import {
  WEBXR_BRIDGE_URL,
  CHROME_STORE_URL,
  REPO_URLS,
} from "@/lib/constants";
import {
  Puzzle,
  Plug,
  RefreshCw,
  Eye,
  FileCode2,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "WebXR Bridge",
  description:
    "Run WebXR apps on glasses-free 3D displays. The DisplayXR WebXR Bridge gives browser apps display geometry, rendering modes, and tracked eye poses — behaving like a native handle app, with graceful fallback to standard WebXR.",
};

const W = WEBXR_BRIDGE_URL;
const links = {
  sample: `${W}/sample`,
  minimal: `${W}/examples/minimal.html`,
  developer: `${W}/DEVELOPER.md`,
  protocol: `${W}/PROTOCOL.md`,
  readme: `${W}/README.md`,
  extension: `${W}/extension`,
};

const Mono = ({ children }: { children: ReactNode }) => (
  <code className="bg-background text-accent px-1.5 py-0.5 rounded text-xs font-mono">
    {children}
  </code>
);

const CodeBlock = ({ children }: { children: string }) => (
  <pre className="bg-background border border-border rounded-md p-4 my-3 text-xs font-mono text-text-primary overflow-x-auto leading-relaxed">
    <code>{children}</code>
  </pre>
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

const apiSnippet = `// A bridge-aware WebXR app: full DisplayXR features when the extension
// is installed, standard WebXR everywhere else.
const session = await navigator.xr.requestSession("immersive-vr", {
  optionalFeatures: ["local"],
});

let displayXR = session.displayXR;          // undefined without the extension
if (displayXR?.ready) {
  try {
    await displayXR.ready;                   // bridge handshake (~10ms warm)
    displayXR = session.displayXR;           // re-read: now populated
    const { displaySizeMeters } = displayXR.displayInfo;
    displayXR.configureEyePoses("raw");      // stream tracked eye poses
    // → off-axis (Kooima) projection, rendering-mode switching, HUD …
  } catch {
    // bridge unavailable → fall through to standard WebXR
  }
}
// else: standard WebXR — Chrome's compromise-scaled stereo.`;

const howItWorks: { icon: ReactNode; title: string; body: ReactNode }[] = [
  {
    icon: <Puzzle size={18} />,
    title: "A Chrome extension",
    body: (
      <>
        An MV3 extension wraps <Mono>navigator.xr</Mono> and adds a{" "}
        <Mono>session.displayXR</Mono> surface to every WebXR session — present
        only when the extension is installed.
      </>
    ),
  },
  {
    icon: <Plug size={18} />,
    title: "A local bridge",
    body: (
      <>
        <Mono>displayxr-webxr-bridge.exe</Mono> runs a <em>headless</em> OpenXR
        session against the DisplayXR service, reads{" "}
        <Mono>XR_DXR_display_info</Mono>, rendering-mode events, and eye poses,
        and relays them over a <Mono>127.0.0.1:9014</Mono> WebSocket.
      </>
    ),
  },
  {
    icon: <RefreshCw size={18} />,
    title: "Frames stay untouched",
    body: (
      <>
        Chrome&apos;s WebXR still renders your frames through OpenXR. The bridge
        only carries <strong>metadata and control</strong> on a side channel —
        no extra copy in the render path.
      </>
    ),
  },
];

export default function WebXRPage() {
  return (
    <PageLayout
      title="WebXR Bridge"
      description="Bring WebXR apps to glasses-free 3D displays. A browser page gets the same display geometry, rendering modes, and tracked eye poses a native app does — and falls back to standard WebXR when the extension isn't there."
    >
      <div className="max-w-3xl space-y-16">
        {/* What it is */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            WebXR, but display-aware
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Chrome&apos;s built-in WebXR is display-agnostic — generic stereo,
            compromise-scaled framebuffers, no concept of a physical 3D display.
            The DisplayXR WebXR Bridge fills that gap: a browser page acquires{" "}
            <Mono>session.displayXR</Mono> and gets display geometry in meters,
            vendor rendering modes, tracked eye poses, window metadata, and a
            compositor HUD — reaching{" "}
            <strong className="text-text-primary">
              parity with a native{" "}
              <a
                href="/platform-support"
                className="text-accent hover:text-accent-hover underline underline-offset-2"
              >
                handle app
              </a>
            </strong>
            , but from JavaScript.
          </p>
          <div className="rounded-lg border border-accent/30 bg-accent/10 p-5">
            <p className="text-sm text-text-secondary leading-relaxed">
              <strong className="text-text-primary">
                It&apos;s a stopgap, by design.
              </strong>{" "}
              The bridge gives web apps the DisplayXR surface today, until
              browsers support these extensions natively. Apps written against it
              stay <strong className="text-text-primary">standard WebXR</strong>:
              when the extension isn&apos;t installed, <Mono>session.displayXR</Mono>{" "}
              is <Mono>undefined</Mono> and the page runs as ordinary WebXR. One
              codebase, everywhere.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-6">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {howItWorks.map((c) => (
              <div
                key={c.title}
                className="rounded-lg border border-border bg-surface p-5"
              >
                <div className="text-accent mb-2">{c.icon}</div>
                <h3 className="text-sm font-semibold text-text-primary mb-1.5">
                  {c.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 border border-border rounded-lg overflow-hidden">
            <Image
              src="/diagrams/dxr-webxr-bridge.svg"
              unoptimized
              alt="A WebXR app runs through Chrome's native WebXR-to-OpenXR pipeline straight into the DisplayXR runtime and out to the 3D display — frames never leave the native path — while the bridge carries metadata and control over a separate sideband."
              width={960}
              height={420}
              className="w-full h-auto"
            />
          </div>
        </section>

        {/* The API */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            The <Mono>session.displayXR</Mono> API
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-2">
            Feature-detect, await the bridge handshake, then read display info,
            rendering modes, and eye poses. Always keep the standard-WebXR
            fallback path.
          </p>
          <CodeBlock>{apiSnippet}</CodeBlock>
          <p className="text-sm text-text-secondary leading-relaxed">
            Full surface, events, and the per-frame loop are in the{" "}
            <Ext
              href={links.developer}
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              developer guide
            </Ext>
            ; the wire protocol is in{" "}
            <Ext
              href={links.protocol}
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              PROTOCOL.md
            </Ext>
            .
          </p>
        </section>

        {/* Try it */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Try it
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-6">
            The bridge needs the DisplayXR runtime running locally, so there&apos;s
            no zero-install web demo — but the extension and a full three.js
            reference sample ship in the runtime repo. Windows today.
          </p>
          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="font-mono text-xs text-accent mt-0.5 shrink-0">
                1
              </span>
              <p className="text-sm text-text-secondary leading-relaxed">
                <strong className="text-text-primary">Install DisplayXR</strong>{" "}
                (runtime + WebXR bridge) — see{" "}
                <a
                  href="/download"
                  className="text-accent hover:text-accent-hover underline underline-offset-2"
                >
                  Download
                </a>
                {" / "}
                <a
                  href="/getting-started"
                  className="text-accent hover:text-accent-hover underline underline-offset-2"
                >
                  Get Started
                </a>
                . Start the service and <Mono>displayxr-webxr-bridge.exe</Mono>.
              </p>
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-xs text-accent mt-0.5 shrink-0">
                2
              </span>
              <p className="text-sm text-text-secondary leading-relaxed">
                {CHROME_STORE_URL ? (
                  <>
                    <strong className="text-text-primary">
                      Install the extension
                    </strong>{" "}
                    from the{" "}
                    <Ext
                      href={CHROME_STORE_URL}
                      className="text-accent hover:text-accent-hover underline underline-offset-2"
                    >
                      Chrome Web Store
                    </Ext>
                    .
                  </>
                ) : (
                  <>
                    <strong className="text-text-primary">
                      Load the extension
                    </strong>{" "}
                    (not on the Chrome Web Store yet): open{" "}
                    <Mono>chrome://extensions</Mono>, enable Developer mode, click{" "}
                    <strong className="text-text-primary">Load unpacked</strong>,
                    and select{" "}
                    <Ext
                      href={links.extension}
                      className="text-accent hover:text-accent-hover underline underline-offset-2"
                    >
                      <Mono>webxr-bridge/extension/</Mono>
                    </Ext>
                    .
                  </>
                )}
              </p>
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-xs text-accent mt-0.5 shrink-0">
                3
              </span>
              <p className="text-sm text-text-secondary leading-relaxed">
                <strong className="text-text-primary">Open a sample</strong> —
                serve{" "}
                <Ext
                  href={links.sample}
                  className="text-accent hover:text-accent-hover underline underline-offset-2"
                >
                  <Mono>webxr-bridge/sample/</Mono>
                </Ext>{" "}
                over localhost (<Mono>python -m http.server 8080</Mono>) and open
                it in Chrome. Full setup is in the{" "}
                <Ext
                  href={links.readme}
                  className="text-accent hover:text-accent-hover underline underline-offset-2"
                >
                  README
                </Ext>
                .
              </p>
            </li>
          </ol>

          {/* Resource cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <Ext href={links.sample}>
              <Card title="three.js sample" icon={<Eye size={20} />}>
                <p className="text-sm text-text-secondary leading-relaxed">
                  The full-featured reference: mode UI, HUD, window-relative
                  Kooima, fallback. <ArrowUpRight size={13} className="inline" />
                </p>
              </Card>
            </Ext>
            <Ext href={links.minimal}>
              <Card title="Minimal starter" icon={<FileCode2 size={20} />}>
                <p className="text-sm text-text-secondary leading-relaxed">
                  One runnable HTML file, no framework — copy-paste to begin.{" "}
                  <ArrowUpRight size={13} className="inline" />
                </p>
              </Card>
            </Ext>
            <Ext href={links.developer}>
              <Card title="Developer guide" icon={<BookOpen size={20} />}>
                <p className="text-sm text-text-secondary leading-relaxed">
                  APIs, events, the frame loop, and a Kooima primer.{" "}
                  <ArrowUpRight size={13} className="inline" />
                </p>
              </Card>
            </Ext>
          </div>
        </section>

        {/* Source */}
        <div className="pt-8 border-t border-border">
          <p className="text-text-secondary">
            The WebXR Bridge ships in the{" "}
            <Ext
              href={W}
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              <Mono>webxr-bridge/</Mono>
            </Ext>{" "}
            folder of the{" "}
            <Ext
              href={REPO_URLS.runtime}
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              runtime repo
            </Ext>{" "}
            — extension, samples, and docs.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
