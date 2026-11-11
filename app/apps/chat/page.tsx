import { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Band, Eyebrow, FeatureGrid, H2, Lead, StatusChip, socialMeta } from "@/components/apps/Product";
import { CapturePlaceholder } from "@/components/apps/CapturePlaceholder";
import { APP_SHARE_ADR, APP_SHARE_SPEC, CHAT_FEATURES, CHAT_REQUIREMENTS, CHAT_URL } from "@/lib/data/apps";
import { WEB_SAMPLES_URL } from "@/lib/constants";

const DESCRIPTION =
  "Glasses-free 3D video chat for up to four people, peer to peer, in the DisplayXR Browser. Share a running DisplayXR app into the call in 3D.";

export const metadata: Metadata = {
  title: "DisplayXR Chat",
  description: DESCRIPTION,
  ...socialMeta("DisplayXR Chat", DESCRIPTION, "/apps/chat"),
};

// DisplayXR Chat's product page. Guardrails (lib/data/apps.ts): no camera
// vendor or model, no customers, no display vendor, no private repo links,
// never "open source", endpoints are Windows and Android only.
const IRIS = "#9D8CFF";

export default function ChatPage() {
  return (
    <div className="bg-[#050507]">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 md:px-12 pt-28 pb-20 md:pt-32 md:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(1100px_560px_at_78%_40%,rgba(157,140,255,0.22),rgba(5,5,7,0)_60%)]"
        />
        <div className="relative mx-auto flex max-w-[1200px] flex-wrap items-center gap-12">
          <div className="min-w-0 max-w-xl flex-[1_1_480px]">
            <div className="mb-4 flex items-center gap-3">
              <Eyebrow color={IRIS}>DisplayXR Chat</Eyebrow>
              <span className="mb-4">
                <StatusChip status={{ kind: "live" }} />
              </span>
            </div>
            <h1 className="mb-6 text-5xl md:text-6xl font-display tracking-tight text-white leading-[1.04]">
              Talk face to face, in depth.
            </h1>
            <p className="mb-9 text-lg md:text-xl leading-relaxed text-white/85">
              Glasses-free 3D video chat for up to four people. Calls go peer to peer, right in the
              DisplayXR Browser, and anyone in another browser can still join in 2D.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href={CHAT_URL}>Open DisplayXR Chat</Button>
              <Button variant="secondary" href="/download" className="bg-black/45">
                Get the DisplayXR Browser
              </Button>
            </div>
            <p className="mt-6 text-sm text-white/70">
              An offline build for a local network also exists.
            </p>
          </div>
          <div className="min-w-0 flex-[1_1_420px]">
            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-border">
              <Image
                src="/art/browser/uc-call.webp"
                alt="Illustration of a four-person video call on a desktop display."
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              <span className="absolute bottom-2.5 left-3 rounded bg-black/55 px-1.5 py-0.5 text-[11px] uppercase tracking-wider text-white/80">
                Illustration
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* What it is */}
      <Band className="bg-[#0b0c10]">
        <AnimateIn>
          <Eyebrow color={IRIS}>What it is</Eyebrow>
          <H2>A video call, made of one web page.</H2>
          <Lead className="mb-10">
            DisplayXR Chat is built on the web SDK&apos;s call element,{" "}
            <code className="font-mono text-base text-text-primary">@displayxr/inline3d/call</code>. Open
            the link, allow the camera, and you are in the room.
          </Lead>
          <FeatureGrid items={CHAT_FEATURES} />
        </AnimateIn>
      </Band>

      {/* Share 3D */}
      <Band id="share-3d">
        <AnimateIn>
          <div className="flex flex-wrap items-center gap-12">
            <div className="min-w-0 flex-[1_1_440px]">
              <Eyebrow color={IRIS}>Share 3D</Eyebrow>
              <H2>Show an app, in 3D, to everyone in the call.</H2>
              <Lead className="mb-5">
                A running DisplayXR app can be shared into the call in 3D. It shows up as a camera named
                &ldquo;DisplayXR: &lt;app&gt; (3D)&rdquo;. Pick it like any other camera, and everyone
                on a spatial display sees the app in depth.
              </Lead>
              <Lead className="mb-7">
                Each share asks you first: a consent prompt appears every time a call starts sharing
                an app. Share 3D works on Windows.
              </Lead>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" href={APP_SHARE_ADR}>Read the design (ADR-061)</Button>
                <Button variant="secondary" href={APP_SHARE_SPEC}>XR_DXR_app_share</Button>
              </div>
            </div>
            <div className="min-w-0 flex-[1_1_420px]">
              <CapturePlaceholder label="A 3D capture of a call is on its way." tint="rgba(157,140,255,0.2)" />
            </div>
          </div>
        </AnimateIn>
      </Band>

      {/* Requirements */}
      <Band className="bg-[#0b0c10]">
        <AnimateIn>
          <Eyebrow color={IRIS}>What you need</Eyebrow>
          <H2>Requirements and limits.</H2>
          <ul className="mt-8 max-w-3xl space-y-3">
            {CHAT_REQUIREMENTS.map((r) => (
              <li key={r} className="flex gap-3 text-text-secondary">
                <span aria-hidden className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: IRIS }} />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </AnimateIn>
      </Band>

      {/* Build your own */}
      <Band>
        <AnimateIn>
          <Eyebrow color={IRIS}>Build your own</Eyebrow>
          <H2>Put a 3D call in your own page.</H2>
          <Lead className="mb-8">
            The call element that runs DisplayXR Chat is part of the web SDK. The live samples show
            it on its own and embedded in a page.
          </Lead>
          <div className="flex flex-wrap gap-3">
            <Button href={`${WEB_SAMPLES_URL}samples/call-embed/`}>Call sample</Button>
            <Button variant="secondary" href="/browser#build">Build for the web</Button>
            <Button variant="secondary" href="/apps">All apps</Button>
          </div>
        </AnimateIn>
      </Band>
    </div>
  );
}
