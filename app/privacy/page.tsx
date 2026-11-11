import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What DisplayXR's own software does with your data: the DisplayXR runtime, eye tracking, the DisplayXR Browser and DisplayXR Chat.",
};

const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="mb-3 mt-12 text-xl font-semibold text-text-primary first:mt-0">{children}</h2>
);
const P = ({ children }: { children: ReactNode }) => (
  <p className="mb-4 text-text-secondary leading-relaxed">{children}</p>
);

// DRAFT for David's review (Nov 11, 2026). Every statement was checked in code
// (runtime 740fdf965, tracking-open 88a2747, chat-pvt 731f051, web e6723c9,
// browser-pvt 1b19b8b); see the PR for the evidence table and open items.
export default function PrivacyPage() {
  return (
    <PageLayout title="Privacy" description="What DisplayXR's own software does with your data.">
      <div className="max-w-3xl">
        <H2>The DisplayXR runtime</H2>
        <P>
          The DisplayXR runtime, its background service and its tracking process run on your device.
          They have no accounts, no analytics and no crash reporting. Diagnostic logs stay on your
          device (on Windows, in %LOCALAPPDATA%\DisplayXR). The DisplayXR runtime goes online only to
          download model files for optional 2D-to-3D features. An optional feature can send a photo
          to a conversion server you choose; it is off by default and asks for your consent first.
        </P>

        <H2>Eye tracking</H2>
        <P>
          Eye tracking runs on your device, in the display&apos;s plug-in or in DisplayXR&apos;s open
          camera tracker. The open tracker processes camera images in memory and never saves or sends
          them; only eye positions come out of it, and the DisplayXR runtime keeps them on your device.
          Apps receive the views they need to draw in 3D, which are based on where your eyes are, and
          an app can also ask for the eye positions themselves. An app can use a display&apos;s 3D
          camera only after you allow it; browsers ask per website.
        </P>

        <H2>Plug-ins and devices</H2>
        <P>
          The display&apos;s plug-in and your device&apos;s tracking software come from the display
          maker, and the display maker&apos;s privacy policy applies to them.
        </P>

        <H2>DisplayXR Browser</H2>
        <P>
          The DisplayXR Browser is built on Chromium. It has no Google account sign-in or sync. Its
          start page checks updates.displayxr.org for a newer version with a plain request that
          carries no identifier, and nothing installs by itself.
        </P>

        <H2>DisplayXR Chat</H2>
        <P>
          Calls go directly between browsers, encrypted. The signaling server only passes
          connection-setup messages between them: it sees your IP address, your browser type and a
          scrambled form of the room code, never your audio, video or shared 3D content. When a direct
          connection is impossible, a relay forwards the encrypted media without being able to read
          it. Rooms exist only in memory and disappear after the call. There are no accounts,
          recordings or analytics, and your display name goes only to the other people in the call.
          Share 3D sends an app&apos;s 3D view the same way as your camera, after you approve it.
        </P>
        <P>DisplayXR Gallery is a separate website with its own sign-in and policy.</P>

        <H2>Questions</H2>
        <P>Open an issue on the DisplayXR runtime repository on GitHub.</P>
      </div>
    </PageLayout>
  );
}
