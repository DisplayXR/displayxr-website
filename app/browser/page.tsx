import { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { UseCaseGrid } from "@/components/web/UseCaseGrid";
import { BrowserPlatforms } from "@/components/web/BrowserPlatforms";
import { BrowserDownload } from "@/components/browser/BrowserDownload";
import { CodeTabs } from "@/components/browser/CodeTabs";
import { HeroSplat } from "@/components/browser/HeroSplat";
import { HELLO_WORLD_INSTALL, SDK_MODULES, browser } from "@/lib/data/web";
import {
  BUILDING_BLOCKS,
  CODE_TABS,
  FAQ,
  FLAGSHIPS,
  MATRIX,
  MATRIX_OS,
  PILLARS,
} from "@/lib/data/browser";
import { REPO_URLS, WEB_SAMPLES_URL } from "@/lib/constants";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "DisplayXR Browser",
  description:
    "A Chromium-based browser for spatial displays. 3D products, movies, photos, maps and video calls appear right inside the page, and every other site works exactly as it does today.",
};

// A product page, not a docs page (design spec §1): full-bleed bands, big
// type, one idea per screen, with the developer layer underneath. DRAFT copy
// from the spec; David may still adjust it.

const Band = ({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) => (
  <section id={id} className={`scroll-mt-20 px-6 md:px-12 py-24 md:py-32 ${className}`}>
    <div className="mx-auto max-w-[1200px]">{children}</div>
  </section>
);

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className="mb-4 text-sm font-medium uppercase tracking-wider text-accent">{children}</p>
);

const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="mb-6 max-w-3xl text-4xl md:text-5xl font-display tracking-tight text-text-primary leading-[1.08]">
    {children}
  </h2>
);

export default function BrowserPage() {
  return (
    <div className="bg-[#050507]">
      {/* S1 — Hero. The page demonstrates itself: an interactive splat of our
          own scene behind the copy, through the SDK this page advertises (in
          depth in the DisplayXR Browser, 2D everywhere else). Camera-shot
          footage of a real display can join it later (spec §5). */}
      <section className="relative isolate min-h-[88vh] overflow-hidden">
        <HeroSplat />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050507]/85 via-[#050507]/45 to-transparent"
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#050507]" />
        <div className="pointer-events-none relative z-10 mx-auto flex min-h-[88vh] max-w-[1200px] items-center px-6 md:px-12 py-24">
          <div className="max-w-xl">
            <Eyebrow>DisplayXR Browser</Eyebrow>
            <h1 className="mb-6 text-5xl md:text-7xl font-display tracking-tight text-white leading-[1.02] drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">
              The web, in depth.
            </h1>
            <p className="mb-10 text-lg md:text-xl leading-relaxed text-white/85 drop-shadow">
              A Chromium-based browser for spatial displays. 3D models, movies,
              photos, maps and video calls appear right inside the page, and
              every other site works exactly as it does today.
            </p>
            <div className="pointer-events-auto mb-4 flex flex-wrap gap-4">
              <BrowserDownload browser={browser} />
              <Button variant="secondary" href="#build" className="bg-black/30 backdrop-blur">
                Build for it
              </Button>
            </div>
            <p className="pointer-events-auto mb-8 text-sm text-white/75">
              Install{" "}
              <a href="/download" className="text-white underline underline-offset-2 hover:text-accent-hover">
                DisplayXR
              </a>{" "}
              first: the browser needs your display&apos;s plug-in to show 3D.
            </p>
            <div className="pointer-events-auto">
              <BrowserPlatforms />
            </div>
          </div>
        </div>
      </section>

      {/* S2 — The contrast band: no "Enter VR". */}
      <Band className="bg-[#0b0c10]">
        <AnimateIn>
          <Eyebrow>No &ldquo;Enter VR&rdquo;</Eyebrow>
          <H2>3D becomes part of the page, like images and video did.</H2>
          <p className="mb-12 max-w-2xl text-lg leading-relaxed text-text-secondary">
            On the web today, 3D usually means a button that takes the page away
            and asks for a headset. In the DisplayXR Browser the 3D stays in its
            place, next to the text, the price and the buttons. You scroll,
            click and read around it like any other content.
          </p>
          <div className="overflow-hidden rounded-2xl border border-border">
            <Image
              src="/art/browser/contrast.webp"
              alt="Illustration. Left: a web page replaced by an 'Enter VR' button. Right: the same page with a shoe coming out of its product card in 3D, the page still readable around it."
              width={1200}
              height={800}
              className="h-auto w-full"
            />
          </div>
        </AnimateIn>
      </Band>

      {/* S3b — Flagships, front and centre. */}
      <Band>
        <AnimateIn>
          <Eyebrow>Built with the DisplayXR Browser</Eyebrow>
          <H2>Three sites you can open right now.</H2>
          <p className="mb-12 max-w-2xl text-lg leading-relaxed text-text-secondary">
            Each one is an ordinary website. Open it in any browser to look
            around; open it in the DisplayXR Browser on a spatial display to see
            it in depth.
          </p>
        </AnimateIn>
        <div className="grid gap-6 lg:grid-cols-3">
          {FLAGSHIPS.map((f, i) => (
            <AnimateIn key={f.id} delay={i * 80}>
              <a
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                data-umami-event="flagship-outbound"
                data-umami-event-site={f.id}
                data-status={f.status}
                className="card-interactive group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={f.image} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="mb-2 text-xl font-semibold text-text-primary">{f.name}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-text-secondary">{f.story}</p>
                  <ul className="mb-5 flex flex-wrap gap-1.5">
                    {f.uses.map((u) => (
                      <li key={u} className="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-text-secondary">
                        {u}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto inline-flex items-center gap-1 text-sm text-accent">
                    Open live <ArrowUpRight size={14} />
                  </span>
                </div>
              </a>
            </AnimateIn>
          ))}
        </div>
      </Band>

      {/* S3 — Pillars. */}
      <Band className="bg-[#0b0c10]">
        <AnimateIn>
          <Eyebrow>What it does</Eyebrow>
          <H2>What it does on a spatial display.</H2>
        </AnimateIn>
        <div className="mt-12 space-y-14">
          {PILLARS.map((p, i) => (
            <AnimateIn key={p.id} delay={i * 40}>
              <div className="grid gap-6 md:grid-cols-[120px_1fr] md:items-start">
                <Image src={p.icon} alt="" width={96} height={96} className="h-20 w-20 md:h-24 md:w-24" />
                <div className="max-w-2xl">
                  <h3 className="mb-3 text-2xl md:text-3xl font-semibold tracking-tight text-text-primary">{p.title}</h3>
                  <p className="mb-3 text-lg leading-relaxed text-text-secondary">{p.body}</p>
                  <p className="text-sm font-medium text-accent">{p.platforms}</p>
                  {p.footnote && <p className="mt-2 text-sm text-text-secondary">{p.footnote}</p>}
                  {p.link && (
                    <a
                      href={p.link.href}
                      {...(p.link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="mt-3 inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover"
                    >
                      {p.link.label} →
                    </a>
                  )}
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </Band>

      {/* S4 — Examples, tiers 2 and 3 (flagships are tier 1, above). */}
      <Band id="examples">
        <AnimateIn>
          <Eyebrow>Examples</Eyebrow>
          <H2>What people do with it.</H2>
          <p className="mb-12 max-w-2xl text-lg leading-relaxed text-text-secondary">
            Every example below is safe to open in any browser: you get the
            ordinary 2D page, and depth on a spatial display.
          </p>
        </AnimateIn>
        <UseCaseGrid />
        <div className="mt-20">
          <h3 className="mb-2 text-xl font-semibold text-text-primary">Building blocks</h3>
          <p className="mb-6 text-text-secondary">
            Small samples, one SDK feature each, with their source in{" "}
            <a href={REPO_URLS.web} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover underline underline-offset-2">
              displayxr-web
            </a>
            .
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BUILDING_BLOCKS.map((g) => (
              <div key={g.group}>
                <a
                  href={`${WEB_SAMPLES_URL}#${g.anchor}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-secondary hover:text-accent"
                >
                  {g.group} ↗
                </a>
                <ul className="space-y-1.5">
                  {g.items.map((s) => (
                    <li key={s.name}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-text-primary hover:text-accent">
                        {s.name} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Band>

      {/* S6 — Build for it: the developer layer. */}
      <Band id="build" className="bg-[#0b0c10]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.25fr] [&>*]:min-w-0">
          <div>
            <Eyebrow>Build for it</Eyebrow>
            <H2>The 3D web is already here. Add yours in a few lines.</H2>
            <p className="mb-6 text-lg leading-relaxed text-text-secondary">
              Every API degrades to an ordinary 2D view in other browsers, so a
              page ships safely everywhere with no feature-detection
              boilerplate.
            </p>
            <CodeSnippet code={HELLO_WORLD_INSTALL} label="terminal" />
            <p className="mt-6 text-sm text-text-secondary">
              Works with three.js · PlayCanvas · glTF / GLB (Draco, meshopt,
              KTX2) · Gaussian splats · side-by-side and top-bottom video ·
              WebRTC.
            </p>
            <p className="mt-4 text-sm text-text-secondary">
              <a href={`${REPO_URLS.web}/blob/main/docs/authoring-inline-3d.md`} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover underline underline-offset-2">
                Authoring guide
              </a>{" "}
              ·{" "}
              <a href={WEB_SAMPLES_URL} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover underline underline-offset-2">
                Live samples
              </a>{" "}
              · Building a native app instead?{" "}
              <a href="/developers" className="text-accent hover:text-accent-hover underline underline-offset-2">
                Developers
              </a>
            </p>
          </div>
          <div>
            <CodeTabs tabs={CODE_TABS} />
            <div className="mt-10 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {SDK_MODULES.map((m) => (
                    <tr key={m.path} className="border-b border-border last:border-0">
                      <td className="sm:whitespace-nowrap px-4 py-3 align-top font-mono text-text-primary">{m.path}</td>
                      <td className="px-4 py-3 text-text-secondary">
                        {m.what}
                        {m.preview && <span className="ml-2 rounded-full border border-border px-2 py-0.5 text-xs">preview</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-text-secondary">
              The core and <code className="font-mono">/three</code> are stable;
              preview modules can change their options in a minor release.
            </p>
          </div>
        </div>
      </Band>

      {/* S8 — Platform matrix. */}
      <Band>
        <Eyebrow>Where it runs</Eyebrow>
        <H2>Windows, Android and Linux today. macOS is coming.</H2>
        <div className="mt-10 overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 font-medium text-text-secondary">Feature</th>
                {MATRIX_OS.map((os) => (
                  <th key={os} className="px-4 py-3 text-center font-medium text-text-primary">{os}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((r) => (
                <tr key={r.feature} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-text-secondary">
                    {r.feature}
                    {r.note && <span className="block text-xs opacity-80">{r.note}</span>}
                  </td>
                  {r.cells.map((c, i) => (
                    <td key={i} className="px-4 py-3 text-center">
                      {c === "yes" ? (
                        <Check size={16} className="inline text-accent" aria-label="yes" />
                      ) : c === "soon" ? (
                        <span className="text-xs text-text-secondary">soon</span>
                      ) : (
                        <Minus size={16} className="inline text-text-secondary/60" aria-label="not available" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-text-secondary">
          A dash means not offered, or not yet verified on that platform. Linux:
          Ubuntu 24.04 or 26.04, with the DisplayXR runtime installed.
        </p>
      </Band>

      {/* S9 — FAQ. */}
      <Band className="bg-[#0b0c10]">
        <Eyebrow>Questions</Eyebrow>
        <div className="mt-6 max-w-3xl divide-y divide-border border-y border-border">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="cursor-pointer list-none text-lg font-medium text-text-primary">
                {f.q}
                <span className="float-right text-text-secondary group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 leading-relaxed text-text-secondary">{f.a}</p>
            </details>
          ))}
        </div>
      </Band>

      {/* S10 — Closing download band. */}
      <Band>
        <div className="rounded-2xl border border-border bg-surface p-10 md:p-16 text-center">
          <h2 className="mb-4 text-4xl md:text-5xl font-display tracking-tight text-text-primary">
            See the web in depth.
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-text-secondary">
            Free for Windows, Android and Linux. macOS is coming soon.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <BrowserDownload browser={browser} />
            <Button variant="secondary" href="/download">
              All downloads
            </Button>
          </div>
        </div>
      </Band>
    </div>
  );
}
