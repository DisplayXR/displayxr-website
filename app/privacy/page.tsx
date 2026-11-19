import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What DisplayXR's own software does with your data: the DisplayXR runtime, eye tracking, the DisplayXR Browser, DisplayXR Chat and the DisplayXR plugin for Claude Code.",
};

const H2 = ({ children, id }: { children: ReactNode; id?: string }) => (
  <h2 id={id} className="mb-3 mt-12 scroll-mt-24 text-xl font-semibold text-text-primary first:mt-0">
    {children}
  </h2>
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
          an app can also ask for the eye positions themselves.
        </P>
        <P>
          Some displays have a built-in 3D camera. An app can use it only after you allow it, and
          browsers ask per website.
        </P>

        <H2>Plug-ins and devices</H2>
        <P>
          The display&apos;s plug-in and your device&apos;s tracking software come from the display
          maker, and the display maker&apos;s privacy policy applies to them.
        </P>

        <H2>DisplayXR Browser</H2>
        <P>
          The DisplayXR Browser is built on Chromium. It has no account, no sync and no usage or crash
          reporting. Its start page, hosted on GitHub Pages, checks updates.displayxr.org for a newer
          version with a plain request that carries no identifier, and nothing installs by itself.
          Like any Chromium-based browser, it still contacts Google for Safe Browsing,
          certificate-revocation and component updates, and for search suggestions if Google is your
          search engine.
        </P>

        <H2>DisplayXR Chat</H2>
        <P>
          Calls go directly between browsers, encrypted. The signaling server sees your IP address,
          your browser type and the page you connected from. It receives the room code only to admit
          you to the room, keeps it in memory and never logs it, and it relays the connection
          handshake between participants without storing it. It never sees your audio, video or
          shared 3D content. When a direct connection is impossible, a relay forwards the encrypted
          media; it sees IP addresses and the amount of data, but cannot read the media. Rooms exist
          only in memory and disappear when the call ends or after two hours. There are no accounts,
          no recordings and no tracking; the only record kept is a monthly usage total per API key,
          and the Chat app uses no key. Your display name goes only to the other people in the call,
          and Share 3D sends an app&apos;s 3D view the same way as your camera, after you approve it.
          Our hosting and relay providers keep standard connection logs for a limited time.
        </P>
        <P>DisplayXR Gallery is a separate website with its own sign-in and policy.</P>

        <H2 id="claude-code-plugin">DisplayXR plugins for Claude Code and Codex</H2>
        <P>
          The displayxr-inline3d plugins help a coding agent in Claude Code or Codex build and check 3D
          web pages. Both run on your computer and send nothing to DisplayXR: no telemetry, no
          accounts, and nothing runs in the background.
        </P>
        <P>
          Its page checker runs on your computer, in a headless Chrome and a local server on
          127.0.0.1. The page under test loads what it normally loads, such as its scripts from a CDN,
          and nothing else leaves your machine. When the agent optimizes a 3D model, it downloads a
          pinned open-source tool from the npm registry.
        </P>
        <P>
          Generating 3D assets is optional and paid. It sends your prompt or image link, with your own
          API key, directly to the provider you pick (Meshy, Tripo or OpenAI), and only after you
          approve that call and its estimated cost. That provider&apos;s privacy policy and terms
          apply. The plugin reads your keys from your environment and never prints, stores or sends
          them anywhere else.
        </P>

        <H2 id="hosted-checker">Hosted page checker (Claude and ChatGPT connectors)</H2>
        <P>
          The DisplayXR connector for Claude and ChatGPT, at mcp.displayxr.org, checks 3D web pages for
          an AI assistant. It receives only what the assistant sends to its tools: a public page URL, a
          public .glb or .gltf model URL, or the page&apos;s own HTML, JavaScript and CSS files. It does
          not receive your chat history or account data, and nothing that identifies you except the IP
          address the request comes from.
        </P>
        <P>
          Page files are written to a temporary folder on the checker machine, served only to that
          machine&apos;s headless browser, and deleted when the check ends. Downloaded model files are
          deleted after the check. No pages, files, URLs, screenshots or reports are stored. The
          checker loads the page in a headless browser, so the page&apos;s own requests, such as
          scripts from a CDN, come from our servers. It refuses private, loopback and cloud-metadata
          addresses.
        </P>
        <P>
          Your IP address is used only to limit how often the checker can be called. It is stored as
          a salted hash in a counter that expires within a day. Request logs are kept for at most
          seven days, and we keep usage totals to plan the service&apos;s budget. There is no sign-in,
          no analytics and no cookies. A cloud hosting provider runs the connector, a cloud GPU
          provider runs the checker, and a managed database holds the counters. Use of the connector
          is covered by our{" "}
          <a href="/terms" className="text-accent hover:text-accent-hover underline underline-offset-2">
            terms
          </a>
          .
        </P>

        <H2 id="embedded-video">Videos on this website</H2>
        <P>
          The DisplayXR film on this website plays from YouTube, through its privacy-enhanced
          youtube-nocookie.com player. Nothing loads from YouTube until you press play. Once you do,
          YouTube receives your IP address and may store data in your browser, and YouTube&apos;s
          privacy policy applies.
        </P>

        <H2>Questions</H2>
        <P>Open an issue on the DisplayXR runtime repository on GitHub.</P>
      </div>
    </PageLayout>
  );
}
