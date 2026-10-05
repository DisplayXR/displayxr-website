import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { UseCaseGrid } from "@/components/web/UseCaseGrid";
import { BrowserPlatforms } from "@/components/web/BrowserPlatforms";
import { HELLO_WORLD, HELLO_WORLD_INSTALL, SDK_MODULES } from "@/lib/data/web";
import { GALLERY_URL, REPO_URLS, WEB_SAMPLES_URL } from "@/lib/constants";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "3D on the web — DisplayXR Browser",
  description:
    "The DisplayXR Browser shows 3D products, movies, photos and calls in depth on a spatial display, and the @displayxr/inline3d SDK adds them to a page in a few lines of JavaScript. The same page is ordinary 2D everywhere else.",
};

const link = "text-accent hover:text-accent-hover underline underline-offset-2";

const Ext = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={link}>
    {children}
  </a>
);

const H2 = ({ id, children }: { id?: string; children: ReactNode }) => (
  <h2 id={id} className="scroll-mt-24 text-2xl font-semibold text-text-primary mb-4">
    {children}
  </h2>
);

// User-facing features: no page changes needed. Platform scope per the
// browser feature catalog's guardrails; keep the qualifiers.
const automatic = [
  {
    title: "Existing 3D pages, in 3D",
    body: "Pages built with three.js, PlayCanvas or Gaussian-splat viewers can show in 3D with no change to the page. On for a short list of sites; offered everywhere else, with a per-site choice.",
    where: "Windows · Linux",
  },
  {
    title: "Convert to 3D",
    body: "Right-click a photo or a video and pick Convert to 3D. Live video conversion needs a display vendor's conversion module.",
    where: "Windows",
  },
  {
    title: "The display follows the tab",
    body: "Your display goes 3D while a 3D page is in front and back to 2D for everything else.",
    where: "Windows · Linux",
  },
  {
    title: "Chrome-stable security updates",
    body: "It is Chromium: every website works as usual, and the browser is rebuilt for every Chrome stable release.",
    where: "Windows · Android · Linux",
  },
];

const worksWith = [
  "three.js",
  "PlayCanvas",
  "glTF / GLB (Draco, meshopt, KTX2)",
  "Gaussian splats",
  "Side-by-side and top-bottom 3D video",
  "MP4 and WebM",
  "WebRTC",
];

export default function WebPage() {
  return (
    <PageLayout
      title="The web, in depth"
      description="The same web page is 3D on a spatial display, in the DisplayXR Browser, and the page you already know everywhere else."
    >
      <div className="max-w-4xl space-y-20">
        <section>
          <div className="mb-6 flex flex-wrap gap-3">
            <Button href="/download">Download the DisplayXR Browser</Button>
            <Button variant="secondary" href="#build">
              Build with the SDK
            </Button>
          </div>
          <BrowserPlatforms />
        </section>

        <section>
          <H2>What people do with it</H2>
          <p className="mb-8 max-w-2xl text-text-secondary leading-relaxed">
            Pages show their 3D content in depth automatically, and developers
            embed 3D viewers, players and video-chat widgets in a few lines.
            Every sample below is safe to open in any browser.
          </p>
          <UseCaseGrid />
        </section>

        <section>
          <H2>It just works</H2>
          <p className="mb-8 max-w-2xl text-text-secondary leading-relaxed">
            Install the browser and these need nothing from the page.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {automatic.map((f) => (
              <div key={f.title} className="rounded-lg border border-border bg-surface p-5">
                <h3 className="mb-2 font-semibold text-text-primary">{f.title}</h3>
                <p className="mb-3 text-sm leading-relaxed text-text-secondary">{f.body}</p>
                <p className="text-xs font-medium text-accent">{f.where}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <H2 id="build">For developers: a few lines of JavaScript</H2>
          <p className="mb-6 max-w-2xl text-text-secondary leading-relaxed">
            <code className="font-mono text-sm">@displayxr/inline3d</code> turns
            a <code className="font-mono text-sm">&lt;canvas&gt;</code> into a 3D
            window inside an ordinary page. It is progressive enhancement: on
            any other browser the same code shows a normal 2D view, so a page
            ships safely everywhere with nothing to branch on.
          </p>
          <div className="space-y-4">
            <CodeSnippet code={HELLO_WORLD_INSTALL} label="terminal" />
            <CodeSnippet code={HELLO_WORLD} label="index.html" />
          </div>
          <p className="mt-4 text-sm text-text-secondary">
            No spatial display at hand? Develop in any browser: the page runs
            as its ordinary 2D view. Read the{" "}
            <Ext href={`${REPO_URLS.web}/blob/main/docs/authoring-inline-3d.md`}>authoring guide</Ext>, or
            open the <Ext href={WEB_SAMPLES_URL}>live samples</Ext>.
          </p>

          <h3 className="mt-12 mb-4 text-lg font-semibold text-text-primary">What&apos;s in the SDK</h3>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <tbody>
                {SDK_MODULES.map((m) => (
                  <tr key={m.path} className="border-b border-border last:border-0">
                    <td className="sm:whitespace-nowrap px-4 py-3 align-top font-mono text-text-primary">{m.path}</td>
                    <td className="px-4 py-3 text-text-secondary">
                      {m.what}
                      {m.preview && (
                        <span className="ml-2 rounded-full border border-border px-2 py-0.5 text-xs">preview</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-text-secondary">
            Preview modules can change their options in a minor release; the
            core and <code className="font-mono">/three</code> are stable.
          </p>

          <h3 className="mt-12 mb-4 text-lg font-semibold text-text-primary">Works with what you already use</h3>
          <ul className="flex flex-wrap gap-2">
            {worksWith.map((w) => (
              <li key={w} className="rounded-full border border-border px-3 py-1 text-sm text-text-secondary">
                {w}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <H2>See it running</H2>
          <div className="grid gap-4 sm:grid-cols-2">
            <a href={GALLERY_URL} target="_blank" rel="noopener noreferrer" className="card-interactive rounded-lg border border-border bg-surface p-6">
              <h3 className="mb-2 font-semibold text-text-primary">DisplayXR Gallery ↗</h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                A feed of 3D photos and short 3D videos. In depth in the
                DisplayXR Browser, a normal photo feed everywhere else: one
                page serves both.
              </p>
            </a>
            <a href={WEB_SAMPLES_URL} target="_blank" rel="noopener noreferrer" className="card-interactive rounded-lg border border-border bg-surface p-6">
              <h3 className="mb-2 font-semibold text-text-primary">SDK samples ↗</h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                Every SDK feature as a small page, from a spinning cube to a
                video call, with the source in{" "}
                <span className="font-mono text-xs">displayxr-web</span>.
              </p>
            </a>
          </div>
        </section>

        <section>
          <H2>Standard WebXR works too</H2>
          <p className="mb-4 text-text-secondary leading-relaxed">
            An ordinary <code className="font-mono text-sm">immersive-vr</code>{" "}
            WebXR page runs on a spatial display through the DisplayXR runtime
            with nothing extra installed: Chrome speaks OpenXR, and the runtime
            presents it. What you get is generic stereo, with fixed rather than
            tracked eyes, because the page has no idea a display is there.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Pages written for a spatial display get the full picture through
            inline 3D in the DisplayXR Browser: tracked eyes, the right view
            for where the page sits on the screen, and the rest of the web
            still flat around it. The older WebXR Bridge extension was retired
            in runtime v2.11 in favour of this path; the reasoning is in{" "}
            <Ext href={`${REPO_URLS.runtime}/issues/1180`}>runtime issue #1180</Ext>.
          </p>
        </section>
      </div>
    </PageLayout>
  );
}
