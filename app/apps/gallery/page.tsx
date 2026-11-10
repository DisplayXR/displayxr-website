import { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Band, Eyebrow, FeatureGrid, H2, Lead, StatusChip, socialMeta } from "@/components/apps/Product";
import { GallerySpatialView } from "@/components/apps/GallerySpatialView";
import {
  GALLERY_ACCEPTS,
  GALLERY_DECLINED,
  GALLERY_FEATURES,
  GALLERY_LIVE_URL,
  GALLERY_SPATIAL_VIEW,
  GALLERY_UPLOAD_STEPS,
} from "@/lib/data/apps";

const DESCRIPTION =
  "A social wall of real stereo 3D photos, shared by link: in depth in the DisplayXR Browser, an ordinary photo site everywhere else. Step into a photo with Spatial View.";

export const metadata: Metadata = {
  title: "DisplayXR Gallery",
  description: DESCRIPTION,
  ...socialMeta("DisplayXR Gallery", DESCRIPTION, "/apps/gallery"),
};

// DisplayXR Gallery's product page. Describe the experience only: never the
// algorithms, models, thresholds, hosting or vendors behind Spatial View or
// the upload checks (lib/data/apps.ts has the full guardrail list).

export default function GalleryPage() {
  return (
    <div className="bg-[#050507]">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 md:px-12 pt-28 pb-20 md:pt-32 md:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(1100px_560px_at_78%_40%,rgba(59,130,246,0.2),rgba(5,5,7,0)_60%)]"
        />
        <div className="relative mx-auto flex max-w-[1200px] flex-wrap items-center gap-12">
          <div className="min-w-0 max-w-xl flex-[1_1_480px]">
            <div className="mb-4 flex items-center gap-3">
              <Eyebrow>DisplayXR Gallery</Eyebrow>
              <span className="mb-4">
                <StatusChip status={{ kind: "live" }} />
              </span>
            </div>
            <h1 className="mb-6 text-5xl md:text-6xl font-display tracking-tight text-white leading-[1.04]">
              Real stereo photos, shared by link.
            </h1>
            <p className="mb-9 text-lg md:text-xl leading-relaxed text-white/85">
              A social wall of 3D photos taken with two cameras. In the DisplayXR Browser on a spatial
              display the whole wall is in depth; in any other browser it is an ordinary photo site.
              And with Spatial View, you can step into a photo.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href={GALLERY_LIVE_URL}>Open the Gallery</Button>
              <Button variant="secondary" href="#spatial-view" className="bg-black/45">
                Spatial View
              </Button>
              <Button variant="secondary" href="#upload" className="bg-black/45">
                Post your own
              </Button>
            </div>
          </div>
          <div className="min-w-0 flex-[1_1_420px] max-w-[560px]">
            <GallerySpatialView />
          </div>
        </div>
      </section>

      {/* What it is */}
      <Band className="bg-[#0b0c10]">
        <AnimateIn>
          <Eyebrow>What it is</Eyebrow>
          <H2>A photo feed where every picture has depth.</H2>
          <Lead className="mb-10">
            Built on the DisplayXR web SDK. Nothing to install to look around; the DisplayXR Browser
            adds the depth.
          </Lead>
          <FeatureGrid items={GALLERY_FEATURES} />
        </AnimateIn>
      </Band>

      {/* Spatial View */}
      <Band id="spatial-view">
        <AnimateIn>
          <Eyebrow>Spatial View</Eyebrow>
          <H2>Step into the photo.</H2>
          <Lead className="mb-8">
            A stereo photo shows depth from where it was taken. Spatial View lets you move a little:
            turn the scene and see it from a new angle, the way you would lean around something real.
            The flower at the top of this page is a live Spatial View.
          </Lead>
          <ul className="max-w-3xl space-y-3">
            {GALLERY_SPATIAL_VIEW.map((s) => (
              <li key={s} className="flex gap-3 text-text-secondary">
                <span aria-hidden className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </AnimateIn>
      </Band>

      {/* Stereo policy */}
      <Band id="what-we-accept" className="bg-[#0b0c10]">
        <AnimateIn>
          <Eyebrow>What we accept</Eyebrow>
          <H2>Only real stereo. Here is why.</H2>
          <Lead className="mb-4">
            The Gallery takes genuine stereo captures only: a real two-camera pair, with each eye on
            its own side. That is a quality bar, and it exists for two reasons.
          </Lead>
          <Lead className="mb-10">
            Comfort: a broken or swapped pair strains the eyes on a spatial display. And real depth:
            what you see on the wall was captured by two cameras, not a 2D picture made to look 3D.
          </Lead>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 text-2xl font-display tracking-tight text-text-primary">What you can upload</h3>
              <div className="flex flex-col gap-4">
                {GALLERY_ACCEPTS.map((a) => (
                  <div key={a.title} className="rounded-2xl border border-border bg-surface p-6">
                    <h4 className="mb-2 text-base font-semibold text-text-primary">{a.title}</h4>
                    <p className="text-sm leading-relaxed text-text-secondary">{a.text}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-text-secondary">
                Photos only for now. A post can hold several pictures.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-2xl font-display tracking-tight text-text-primary">
                Why an upload might be declined
              </h3>
              <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
                {GALLERY_DECLINED.map((d) => (
                  <li key={d.reason} className="p-5">
                    <p className="mb-1 font-medium text-text-primary">{d.reason}</p>
                    <p className="text-sm text-text-secondary">{d.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AnimateIn>
      </Band>

      {/* View + upload */}
      <Band id="upload">
        <AnimateIn>
          <div className="flex flex-wrap gap-14">
            <div className="min-w-0 flex-[1_1_380px]">
              <Eyebrow>View and post</Eyebrow>
              <H2>Open it anywhere. See it in 3D in the DisplayXR Browser.</H2>
              <Lead className="mb-7">
                Any browser shows the Gallery as photos, with the 2D viewing modes. To see the wall in
                depth, open it in the DisplayXR Browser on a spatial display.
              </Lead>
              <div className="flex flex-wrap gap-3">
                <Button href={GALLERY_LIVE_URL}>Open the Gallery</Button>
                <Button variant="secondary" href="/download">Get the DisplayXR Browser</Button>
              </div>
            </div>
            <div className="min-w-0 flex-[1_1_480px]">
              <h3 className="mb-5 text-2xl font-display tracking-tight text-text-primary">Posting a photo</h3>
              <ol className="flex flex-col gap-3">
                {GALLERY_UPLOAD_STEPS.map((s, i) => (
                  <li key={s} className="flex gap-4 rounded-xl border border-border bg-[#0f0f12] p-4.5">
                    <span className="pt-0.5 font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-sm text-text-secondary">{s}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </AnimateIn>
      </Band>
    </div>
  );
}
