import { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Band, Eyebrow, FeatureGrid, H2, Lead, StatusChip, socialMeta } from "@/components/apps/Product";
import Image from "next/image";
import {
  MEDIA_PLAYER_PRO_ALL_RELEASES,
  MEDIA_PLAYER_PRO_RELEASE,
  MEDIA_PLAYER_PRO_VERSION,
  MEDIA_PLAYER_REPO,
  MPP_CAPABILITIES,
  MPP_PLATFORMS,
} from "@/lib/data/apps";
import { DOWNLOAD_HREF } from "@/lib/constants";

const DESCRIPTION =
  "A 3D monitoring and QC station for stereo film and live production, built on DisplayXR. Live stereo capture, rig checks, grading and QC tools on a spatial display.";

export const metadata: Metadata = {
  title: "Media Player Pro",
  description: DESCRIPTION,
  ...socialMeta("Media Player Pro", DESCRIPTION, "/apps/media-player-pro"),
};

// Media Player Pro's product page. Guardrails (lib/data/apps.ts): no customer
// names, no genlock or frame-accurate sync claims (sync is software-only), no
// performance numbers, capture claimed on Windows only.

export default function MediaPlayerProPage() {
  return (
    <div className="bg-[#050507]">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 md:px-12 pt-28 pb-20 md:pt-32 md:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(1100px_560px_at_78%_40%,rgba(59,130,246,0.2),rgba(5,5,7,0)_60%),radial-gradient(700px_400px_at_10%_90%,rgba(16,185,129,0.12),rgba(5,5,7,0)_60%)]"
        />
        <div className="relative mx-auto flex max-w-[1200px] flex-wrap items-center gap-12">
          <div className="min-w-0 max-w-xl flex-[1_1_480px]">
            <div className="mb-4 flex items-center gap-3">
              <Eyebrow>Media Player Pro</Eyebrow>
              <span className="mb-4">
                <StatusChip status={{ kind: "release", version: MEDIA_PLAYER_PRO_VERSION }} />
              </span>
            </div>
            <h1 className="mb-6 text-5xl md:text-6xl font-display tracking-tight text-white leading-[1.04]">
              Check stereo on set, in 3D.
            </h1>
            <p className="mb-9 text-lg md:text-xl leading-relaxed text-white/85">
              A 3D monitoring and QC station for stereo film and live production, built on DisplayXR.
              Built for on-set stereo 3D monitoring: see both eyes in depth on a spatial display, and
              catch rig problems while you can still fix them.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href={MEDIA_PLAYER_PRO_RELEASE}>Download {MEDIA_PLAYER_PRO_VERSION}</Button>
              <Button variant="secondary" href="#capabilities" className="bg-black/45">
                What it does
              </Button>
            </div>
            <p className="mt-6 text-sm text-white/70">
              Install{" "}
              <a href={DOWNLOAD_HREF} className="text-white underline underline-offset-2 hover:text-accent-hover">
                DisplayXR
              </a>{" "}
              first: the DisplayXR runtime and your display&apos;s plug-in show the picture in 3D.
            </p>
          </div>
          <div className="min-w-0 flex-[1_1_420px]">
            <figure>
              <Image
                src="/media/mppro-station.webp"
                alt="Media Player Pro showing its built-in stereo test signal, with the Station panel on the left, the Inspector on the right and the depth and vertical-offset timeline below the picture."
                width={1512}
                height={765}
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="w-full rounded-2xl border border-border"
              />
              <figcaption className="mt-2 text-xs text-white/60">
                The station on its built-in test signal. One eye shown.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <Band id="capabilities" className="bg-[#0b0c10]">
        <AnimateIn>
          <Eyebrow>What it does</Eyebrow>
          <H2>From the camera to the QC report.</H2>
          <Lead className="mb-10">
            Everything below ships today, in one app.
          </Lead>
          <FeatureGrid items={MPP_CAPABILITIES} cols={3} />
          <p className="mt-8 text-sm text-text-secondary">
            Blackmagic DeckLink capture supported (Windows). Left/right pairing and every check run in
            software.
          </p>
        </AnimateIn>
      </Band>

      {/* Platforms + download */}
      <Band id="download">
        <AnimateIn>
          <div className="flex flex-wrap gap-14">
            <div className="min-w-0 flex-[1_1_440px]">
              <Eyebrow>Get it</Eyebrow>
              <H2>Windows, macOS and Linux.</H2>
              <Lead className="mb-7">
                A signed installer for Windows, a .pkg for macOS and a .deb for Linux, with every
                release on GitHub. Live SDI capture is Windows only.
              </Lead>
              <div className="flex flex-wrap gap-3">
                <Button href={MEDIA_PLAYER_PRO_RELEASE}>Download {MEDIA_PLAYER_PRO_VERSION}</Button>
                <Button variant="secondary" href={MEDIA_PLAYER_PRO_ALL_RELEASES}>All Pro releases</Button>
              </div>
            </div>
            <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-3">
              {MPP_PLATFORMS.map((p) => (
                <a
                  key={p.os}
                  href={MEDIA_PLAYER_PRO_RELEASE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-[#0f0f12] px-5 py-4 hover:border-accent"
                >
                  <span className="text-text-primary">{p.os}</span>
                  <span className="font-mono text-sm text-text-secondary">{p.artifact}</span>
                </a>
              ))}
            </div>
          </div>
        </AnimateIn>
      </Band>

      {/* Lineage */}
      <Band className="bg-[#0b0c10]">
        <AnimateIn>
          <Eyebrow>Where it comes from</Eyebrow>
          <H2>A pro build of the DisplayXR Media Player.</H2>
          <Lead className="mb-8">
            Media Player Pro is a pro build of the open-source DisplayXR Media Player demo, a two-view
            video and image player for spatial displays.
          </Lead>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" href={MEDIA_PLAYER_REPO}>Media Player on GitHub</Button>
            <Button variant="secondary" href="/demos">All demos</Button>
            <Button variant="secondary" href="/apps">All apps</Button>
          </div>
        </AnimateIn>
      </Band>
    </div>
  );
}
