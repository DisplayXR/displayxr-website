import { Metadata } from "next";
import Image from "next/image";
import { PageLayout } from "@/components/layout/PageLayout";
import { FlatVsSpatial } from "@/components/about/FlatVsSpatial";
import { EcosystemMap } from "@/components/home/EcosystemMap";
import { OPENXR_GAPS } from "@/lib/data/openxr-gaps";
import { CONTACT_EMAIL, DISCUSSIONS_URL } from "@/lib/constants";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "About DisplayXR",
  description:
    "What a spatial display is, how it differs from a headset, and why DisplayXR extends OpenXR as an open, modular standard for any spatial display, with or without glasses.",
};

const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="mb-4 text-2xl md:text-3xl font-display tracking-tight text-text-primary">{children}</h2>
);
const P = ({ children }: { children: ReactNode }) => (
  <p className="mb-4 text-text-secondary leading-relaxed">{children}</p>
);

// Positioning (KBXR reference/displayxr/04-messaging.md §Canonical positioning):
// "spatial displays", with or without glasses; DisplayXR extends OpenXR and
// never competes with it; the one-framework convergence is direction, not a
// shipped claim. Written for a tech-savvy reader: no figures, no pitch.
export default function AboutPage() {
  return (
    <>
      <PageLayout
        title="About DisplayXR"
        description="An open-source OpenXR runtime and the extensions OpenXR needs for spatial displays: one way to build spatial content for every display, from every vendor."
      >
        <div className="max-w-3xl space-y-20">
          <section>
            <H2>What is a spatial display?</H2>
            <P>
              A spatial display gives you a volumetric experience of what it
              shows. Content is perceived, and felt, in 3D space, in front of
              and behind the screen, instead of lying on a flat 2D plane.
            </P>
            <div className="my-8 rounded-lg border border-border bg-surface p-6">
              <FlatVsSpatial />
            </div>
            <P>The family is broad:</P>
            <ul className="mb-4 list-disc space-y-2 pl-5 text-text-secondary leading-relaxed">
              <li>
                <span className="text-text-primary">Glasses-free displays</span>:
                tracked stereo, which follows your eyes, and light-field or
                multiview panels.
              </li>
              <li>
                <span className="text-text-primary">Stereo displays you wear glasses for.</span>
              </li>
              <li>
                <span className="text-text-primary">And, by extension, headsets.</span>
              </li>
            </ul>
            <P>DisplayXR is for all of them, with or without glasses.</P>
          </section>

          <section>
            <H2>Headsets and spatial displays</H2>
            <div className="mb-6 overflow-hidden rounded-lg border border-border">
              <Image
                src="/art/headset-vs-display.webp"
                alt="The same person at the same desk: on the left in a headset, on the right in front of a display with 3D windows and no headset."
                width={1400}
                height={788}
                className="h-auto w-full"
              />
            </div>
            <P>
              Both show spatial content to two eyes in real time, and both track
              the viewer. The difference is the device. A headset is worn and
              runs one exclusive session that owns everything you see. A spatial
              display sits on a desk, is a screen with a physical size and
              location, and shares that screen with ordinary 2D windows.
            </P>
            <P>
              What they have in common is the content, and the contract an app
              uses to show it:{" "}
              <span className="text-text-primary">OpenXR</span>, the Khronos
              standard for XR applications.
            </P>
          </section>

          <section>
            <H2>Where OpenXR needs extending</H2>
            <P>
              OpenXR was written for headsets, so a few things a display needs
              have no words in it yet. DisplayXR adds them as{" "}
              <code className="font-mono text-sm">XR_DXR_*</code> extensions,
              under an author ID registered with Khronos, on top of an
              open-source OpenXR runtime
              that runs the official Khronos conformance suite. It builds on
              OpenXR; it is not a separate standard. Four examples:
            </P>
            <div className="mt-8 space-y-10">
              {OPENXR_GAPS.map((g) => (
                <div key={g.id} className="grid gap-6 md:grid-cols-[1fr_1.1fr] md:items-center">
                  <div className="overflow-hidden rounded-lg border border-border bg-surface">
                    <Image src={g.image.src} alt={g.image.alt} width={1200} height={675} unoptimized={g.image.src.endsWith(".svg")} className="h-auto w-full" />
                  </div>
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-text-primary">{g.title}</h3>
                    <p className="mb-2 text-sm leading-relaxed text-text-secondary">
                      <span className="text-text-primary">OpenXR assumes a headset:</span> {g.headset}
                    </p>
                    <p className="mb-2 text-sm leading-relaxed text-text-secondary">
                      <span className="text-text-primary">On a display:</span> {g.display}
                    </p>
                    <p className="mb-3 text-sm leading-relaxed text-text-secondary">
                      <span className="text-accent">DisplayXR adds:</span> {g.adds}
                    </p>
                    <p className="font-mono text-xs text-text-secondary">{g.extensions.join(" · ")}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <H2>Why it is modular</H2>
            <P>
              Displays differ, and they should: the optics, the eye tracking
              and the calibration are what each display maker does best. So
              DisplayXR draws one line. Apps talk only to OpenXR and the
              extensions. Each display maker ships a{" "}
              <span className="text-text-primary">display plug-in</span> that
              does the display-specific work, and tracking hardware plugs in
              the same way through a separate{" "}
              <span className="text-text-primary">input-provider plug-in</span>.
            </P>
            <P>
              Apps never touch a vendor, and vendors never touch an app. The
              runtime itself carries no vendor code, and its build checks that.
              An app written once runs on every display that has a plug-in, and
              a new display runs every app that already exists.
            </P>
            <div className="mt-6 overflow-hidden rounded-lg border border-border">
              <Image
                src="/diagrams/dxr-boundary-ip.svg"
                unoptimized
                alt="The open DisplayXR runtime on one side of a plug-in boundary; each vendor's plug-in, and the simulated display, on the other."
                width={960}
                height={490}
                className="h-auto w-full"
              />
            </div>
          </section>

          <section>
            <H2>Why the web matters</H2>
            <P>
              Most spatial content will not be an installed app. It will be a
              product on a shopping page, a movie, a photo, a call. The
              DisplayXR Browser and its SDK let anyone make and share that
              content with a few lines of JavaScript and a URL, and the same
              page stays an ordinary page on every other screen.
            </P>
          </section>

          <section>
            <H2>The direction: one framework</H2>
            <P>
              Today a headset and a spatial display are different device
              classes with a common contract. Where this is heading is one
              framework for spatial content on both: the same content and the
              same API, whether you wear the display or put it on your desk.
              That is why DisplayXR extends OpenXR rather than standing apart
              from it.
            </P>
          </section>

          <section>
            <H2>Open, neutral, and how to reach us</H2>
            <P>
              The runtime, the extensions, the engine plug-ins and the demos are
              open source. DisplayXR is vendor-neutral: any display maker can
              write a plug-in, free of charge and without permission. How
              decisions are made is on the{" "}
              <a href="/governance" className="text-accent hover:text-accent-hover underline underline-offset-2">
                governance
              </a>{" "}
              page.
            </P>
            <P>
              Questions and ideas:{" "}
              <a href={DISCUSSIONS_URL} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover underline underline-offset-2">
                GitHub Discussions
              </a>
              . Partners and press:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:text-accent-hover underline underline-offset-2">
                {CONTACT_EMAIL}
              </a>
              .
            </P>
          </section>
        </div>
      </PageLayout>
      <EcosystemMap />
    </>
  );
}
