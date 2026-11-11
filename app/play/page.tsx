import { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { WovenEyePair } from "@/components/play/WovenEyePair";
import {
  CONTROLS,
  DISPLAY_MAKERS,
  FAQ_GROUPS,
  GAMES,
  PIPELINE,
  PLAY_PORTING_GUIDE,
  PROFILE_SNIPPET,
  REPOS,
  RULES,
  SYSTEMS,
  TIMELINE,
  VENDOR_GUIDE,
} from "@/lib/data/play";
import { DISCUSSIONS_URL, DOWNLOAD_HREF } from "@/lib/constants";
import { play } from "@/lib/data/generated";
import type { ReactNode } from "react";

// Versions and download links come from the synced release record; status,
// notes per game are authored in lib/data/play.ts (the site's
// generated-vs-authored split).
const android = play.android;
const gameAsset = (slug?: string) => (slug ? android.games.find((g) => g.slug === slug) : undefined);

export const metadata: Metadata = {
  title: "DisplayXR Play",
  description:
    "Existing games rendered from two eyes on 3D displays. Steam on Linux, Windows and Android, through the DisplayXR runtime. Real stereo, single-player titles, you keep your game.",
};

// A product page in the Browser page's mold: full-bleed bands, big type, one
// idea per screen. Copy approved in the Nov 5, 2026 design pass. The hero is a
// real eye pair captured Nov 8, 2026 from the UE4 title through the D3D11 stereo
// layer on Steam for Linux (hub repo, docs/evidence/hero, moment 2); the title
// is not named until a public release carries it (site rule).
const Band = ({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) => (
  <section id={id} className={`scroll-mt-20 px-6 md:px-12 py-24 md:py-28 ${className}`}>
    <div className="mx-auto max-w-[1200px]">{children}</div>
  </section>
);

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className="mb-4 text-sm font-medium uppercase tracking-wider text-accent">{children}</p>
);

const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="mb-5 max-w-3xl text-4xl md:text-5xl font-display tracking-tight text-text-primary leading-[1.08]">
    {children}
  </h2>
);

const Dot = ({ color }: { color: "green" | "yellow" | "gray" }) => {
  const c = { green: "bg-success", yellow: "bg-warning", gray: "bg-text-secondary" }[color];
  return <span aria-hidden className={`inline-block h-2 w-2 rounded-full ${c}`} />;
};

const statusDot = { plays: "green", partial: "yellow", refused: "gray" } as const;

const Chip = ({ children, tone }: { children: ReactNode; tone: "green" | "yellow" }) => (
  <span
    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
      tone === "green" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
    }`}
  >
    {children}
  </span>
);

function EyePair() {
  // The two views the stereo layer rendered for one frame: the runtime's
  // captured eye atlas split in two, 1440x900 per eye, nothing retouched.
  const Eye = ({ label, src }: { label: string; src: string }) => (
    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-[#0c1222]">
      <Image
        src={src}
        alt={`${label} view of the same game frame, rendered by the stereo layer`}
        fill
        sizes="(min-width: 1024px) 30vw, 50vw"
        priority
        className="object-cover"
      />
      <div className="absolute bottom-2.5 left-3 rounded bg-black/55 px-1.5 py-0.5 text-[11px] uppercase tracking-wider text-white/80">
        {label}
      </div>
    </div>
  );
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2.5">
        <Eye label="Left eye" src="/art/play/hero-left.webp" />
        <Eye label="Right eye" src="/art/play/hero-right.webp" />
      </div>
      <p className="text-sm text-text-secondary">
        One frame of a UE4 title, rendered twice by the stereo layer on Steam for Linux and woven by the
        runtime for your display.
      </p>
    </div>
  );
}

export default function PlayPage() {
  return (
    <div className="bg-[#050507]">
      {/* S1 — Hero */}
      <section className="relative overflow-hidden px-6 md:px-12 pt-28 pb-20 md:pt-32 md:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_78%_40%,rgba(59,130,246,0.22),rgba(5,5,7,0)_60%)]"
        />
        <div className="relative mx-auto flex max-w-[1200px] flex-wrap items-center gap-12">
          <div className="min-w-0 max-w-xl flex-[1_1_520px]">
            <Eyebrow>DisplayXR Play</Eyebrow>
            <h1 className="mb-6 text-5xl md:text-7xl font-display tracking-tight text-white leading-[1.02]">
              Your games, in real 3D.
            </h1>
            <p className="mb-9 text-lg md:text-xl leading-relaxed text-white/85">
              Existing games rendered from two eyes on glasses-free 3D displays. Steam on Linux,
              Windows and Android, through one runtime. Real stereo, never a depth trick.
              Single-player titles. You keep your game.
            </p>
            <div className="mb-6 flex flex-wrap gap-4">
              <Button href="#systems">Get it for your system</Button>
              <Button variant="secondary" href="#games" className="bg-black/45">
                What plays today
              </Button>
              <Button variant="secondary" href="#display-makers" className="bg-black/45">
                For display makers
              </Button>
            </div>
            <p className="mb-6 text-sm text-white/75">
              Install{" "}
              <a href={DOWNLOAD_HREF} className="text-white underline underline-offset-2 hover:text-accent-hover">
                DisplayXR
              </a>{" "}
              first: Play needs your display&apos;s plug-in to weave the two eyes.
            </p>
            <div className="flex flex-wrap gap-2.5 text-[13px]">
              {SYSTEMS.map((s) => (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-[#0f0f12] px-3 py-1.5 text-text-primary"
                >
                  <Dot color={s.status === "available" ? "green" : "yellow"} />
                  {s.tagline} · {s.status}
                </span>
              ))}
            </div>
          </div>
          <div className="min-w-0 flex-[1_1_420px]">
            {/* Woven in the DisplayXR Browser; the flat pair everywhere else. */}
            <WovenEyePair left="/art/play/hero-left.webp" right="/art/play/hero-right.webp">
              <EyePair />
            </WovenEyePair>
          </div>
        </div>
      </section>

      {/* S2 — Pick your system */}
      <Band id="systems" className="bg-[#0b0c10]">
        <AnimateIn>
          <Eyebrow>Pick your system</Eyebrow>
          <H2>One program, three ways in.</H2>
          <p className="mb-12 max-w-2xl text-lg leading-relaxed text-text-secondary">
            The same stereo engine renders your game from two eye positions on every system. What
            differs is how it reaches you.
          </p>
          <div className="grid gap-5 md:grid-cols-3">
            {SYSTEMS.map((s) => {
              const live = s.status === "available";
              return (
                <article
                  key={s.id}
                  className={`flex flex-col gap-4 rounded-2xl border p-7 ${
                    live ? "border-accent bg-[#121826]" : "border-border bg-surface"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold text-text-primary">{s.name}</h3>
                    <Chip tone={live ? "green" : "yellow"}>
                      {live ? (android.version ? `Available · ${android.version}` : "Available") : "Preview"}
                    </Chip>
                  </div>
                  <p className="text-sm text-text-secondary">{s.how}</p>
                  <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-sm text-text-primary/90">
                    {s.steps.map((st) => (
                      <li key={st}>{st}</li>
                    ))}
                  </ol>
                  <div className="mt-auto flex flex-wrap gap-2.5 pt-2">
                    <Button
                      href={s.id === "android" && android.companion ? android.companion.url : s.primary.href}
                      variant={live ? "primary" : "secondary"}
                    >
                      {s.primary.label}
                    </Button>
                    {s.secondary && (
                      <Button href={s.secondary.href} variant="secondary">
                        {s.secondary.label}
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary">{s.note}</p>
                </article>
              );
            })}
          </div>
        </AnimateIn>
      </Band>

      {/* S3 — How it works */}
      <Band>
        <AnimateIn>
          <Eyebrow>How it works</Eyebrow>
          <H2>Two eyes from one game, then one hand-off.</H2>
          <p className="mb-12 max-w-2xl text-lg leading-relaxed text-text-secondary">
            Nothing in the middle depends on the operating system except the last step. The stereo
            producer is a fork of the open Direct3D-to-Vulkan layers; games that never touch
            Direct3D get an in-process mod; VR mods already speak OpenXR.
          </p>
          <ol className="flex flex-wrap items-stretch gap-3">
            {PIPELINE.map((p, i) => (
              <li key={p.n} className="contents">
                <div
                  className={`flex-[1_1_200px] rounded-2xl border p-6 ${
                    p.highlight ? "border-accent bg-[#0f1524]" : "border-border bg-[#0f0f12]"
                  }`}
                >
                  <p className="mb-2 font-mono text-xs text-accent">{p.n}</p>
                  <h3 className="mb-2 text-base font-semibold text-text-primary">{p.title}</h3>
                  <p className="text-sm text-text-secondary">{p.text}</p>
                </div>
                {i < PIPELINE.length - 1 && (
                  <span aria-hidden className="hidden items-center text-xl text-[#3f3f46] lg:flex">
                    &rarr;
                  </span>
                )}
              </li>
            ))}
          </ol>
        </AnimateIn>
      </Band>

      {/* S3b — For display makers */}
      <Band id="display-makers" className="bg-[#0b0c10]">
        <AnimateIn>
          <Eyebrow>For display makers</Eyebrow>
          <H2>Ship one plug-in. Get every game.</H2>
          <p className="mb-12 max-w-2xl text-lg leading-relaxed text-text-secondary">
            Play never weaves or tracks. Your display&apos;s plug-in does, once, through the
            DisplayXR runtime, and the same plug-in serves the Browser, the demos and every
            OpenXR app. There is no per-title work on your side and nothing to re-test when a
            game updates.
          </p>
          <div className="grid gap-5 md:grid-cols-3">
            {DISPLAY_MAKERS.map((m) => (
              <div
                key={m.who}
                className={`rounded-2xl border p-7 ${
                  m.highlight ? "border-accent bg-[#121826]" : "border-border bg-surface"
                }`}
              >
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-accent">{m.who}</p>
                <h3 className="mb-2 text-xl font-semibold text-text-primary">{m.title}</h3>
                <p className="text-sm text-text-secondary">{m.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 flex flex-wrap gap-14">
            <div className="min-w-0 flex-[1_1_440px]">
              <h3 className="mb-5 text-2xl font-display tracking-tight text-text-primary">Where it stands</h3>
              <ol className="flex flex-col gap-3">
                {TIMELINE.map((t) => (
                  <li key={t.when} className="flex gap-4 rounded-xl border border-border bg-[#0f0f12] p-4.5">
                    <span className="flex items-center gap-2 whitespace-nowrap pt-0.5 font-mono text-xs text-text-primary">
                      <Dot color={t.status === "live" ? "green" : t.status === "next" ? "yellow" : "gray"} />
                      {t.when}
                    </span>
                    <p className="text-sm text-text-secondary">{t.what}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="min-w-0 flex-[1_1_440px]">
              <h3 className="mb-5 text-2xl font-display tracking-tight text-text-primary">Bringing a display</h3>
              <p className="mb-6 text-text-secondary">
                The vendor onboarding guide walks through the plug-in interface and the test
                scenes; the Components page lists what already ships with DisplayXR. Display and
                PC makers who want to run Play on a panel before the December release: start a
                thread in Discussions and we take it from there.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button href={DISCUSSIONS_URL}>Display makers: talk to us</Button>
                <Button variant="secondary" href={VENDOR_GUIDE}>Vendor onboarding guide</Button>
                <Button variant="secondary" href="/components">Components</Button>
              </div>
            </div>
          </div>
        </AnimateIn>
      </Band>

      {/* S4 — Compatibility */}
      <Band id="games">
        <AnimateIn>
          <Eyebrow>What plays today</Eyebrow>
          <H2>What plays, and how.</H2>
          <p className="mb-9 max-w-2xl text-lg leading-relaxed text-text-secondary">
            Every row is a game a person played in stereo on a 3D display. A title is named only once a release carries it. Games with anti-cheat
            or that need a headset are refused by the detector and listed as such.
          </p>
          <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-text-primary/90">
            <span className="text-text-secondary">Legend:</span>
            <span className="inline-flex items-center gap-1.5"><Dot color="green" />Plays</span>
            <span className="inline-flex items-center gap-1.5"><Dot color="yellow" />Partial</span>
            <span className="inline-flex items-center gap-1.5"><Dot color="gray" />Refused</span>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-text-secondary">
                  {["Game", "System", "Route", "Status", "Notes"].map((h) => (
                    <th key={h} className="border-b border-border px-4 py-3.5 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f22]">
                {GAMES.map((g) => (
                  <tr key={g.game}>
                    <td className="px-4 py-4 font-medium text-text-primary">
                      {g.game}
                      {g.unnamed && <span className="font-normal text-text-secondary"> (named at release)</span>}
                      {(() => {
                        const a = gameAsset(g.slug);
                        return a ? (
                          <a
                            href={a.url}
                            className="mt-1 block text-xs font-normal text-accent hover:text-accent-hover"
                            data-umami-event="play-mod-download"
                            data-umami-event-game={a.slug}
                          >
                            Download mod {a.version}
                          </a>
                        ) : null;
                      })()}
                    </td>
                    <td className="px-4 py-4 text-text-primary/90">{g.systems}</td>
                    <td className="px-4 py-4 text-text-primary/90">{g.route}</td>
                    <td className="px-4 py-4 text-text-primary">
                      <span className="inline-flex items-center gap-1.5">
                        <Dot color={statusDot[g.status]} />
                        {g.statusLabel}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-text-secondary">{g.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button variant="secondary" href={DISCUSSIONS_URL}>Report a game</Button>
            <Button variant="secondary" href="#profiles">Share a profile</Button>
            <p className="text-sm text-text-secondary">
              Ten more titles are in the December run. Player reports go into the same table, marked
              as community-verified.
            </p>
          </div>
        </AnimateIn>
      </Band>

      {/* S5 — Settings */}
      <Band id="profiles" className="bg-[#0b0c10]">
        <AnimateIn>
          <div className="flex flex-wrap items-start gap-14">
            <div className="min-w-0 flex-[1_1_440px]">
              <Eyebrow>You stay in control</Eyebrow>
              <H2>Three dials. Auto by default, yours on demand.</H2>
              <p className="mb-7 text-lg leading-relaxed text-text-secondary">
                Every game gets the same three controls, in the same overlay, on every system. The
                defaults come from the per-game profile; anything you change is saved back into it
                and can be shared.
              </p>
              <div className="flex flex-col gap-3.5">
                {CONTROLS.map((c) => (
                  <div key={c.key} className="flex gap-4 rounded-xl border border-border bg-[#0f0f12] p-4.5">
                    <span className="pt-0.5 font-mono text-xs text-accent">{c.key}</span>
                    <div>
                      <h3 className="mb-1 text-base font-semibold text-text-primary">{c.title}</h3>
                      <p className="text-sm text-text-secondary">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-3.5">
              <div className="overflow-hidden rounded-2xl border border-border bg-[#0f0f12]">
                <div className="flex items-center justify-between border-b border-border px-4 py-3 text-xs text-text-secondary">
                  <span>profiles/414340.toml</span>
                  <span>per-game profile, shared on GitHub</span>
                </div>
                <pre className="overflow-x-auto p-4.5 font-mono text-[13px] leading-relaxed text-text-primary/90">
                  {PROFILE_SNIPPET}
                </pre>
              </div>
              <p className="text-sm text-text-secondary">
                Power users edit the pass section; everyone else never sees it. A submitted profile
                is reviewed and lands in the table above as community-verified.
              </p>
            </div>
          </div>
        </AnimateIn>
      </Band>

      {/* S6 — Rules */}
      <Band>
        <AnimateIn>
          <Eyebrow>The rules</Eyebrow>
          <H2>Four things we will not do.</H2>
          <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {RULES.map((r) => (
              <div key={r.title} className="rounded-2xl border border-border bg-surface p-6">
                <h3 className="mb-2 text-base font-semibold text-text-primary">{r.title}</h3>
                <p className="text-sm text-text-secondary">{r.text}</p>
              </div>
            ))}
          </div>
        </AnimateIn>
      </Band>

      {/* S7 — Build with us */}
      <Band className="bg-[#0b0c10]">
        <AnimateIn>
          <div className="flex flex-wrap gap-14">
            <div className="min-w-0 flex-[1_1_440px]">
              <Eyebrow>Build with us</Eyebrow>
              <H2>Port a game, submit a profile, fix a pass.</H2>
              <p className="mb-6 text-lg leading-relaxed text-text-secondary">
                The porting guide explains the method behind every rule, with the measurements.
                Profiles are plain text keyed by store app id. The stereo layers are maintained
                forks of open projects.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button href={PLAY_PORTING_GUIDE}>Read the porting guide</Button>
                <Button variant="secondary" href={DISCUSSIONS_URL}>Discussions</Button>
              </div>
            </div>
            <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-3">
              {REPOS.map((r) => {
                const inner = (
                  <>
                    <span>
                      <span className="block font-mono text-sm text-text-primary">{r.name}</span>
                      <span className="block text-[13px] text-text-secondary">{r.text}</span>
                    </span>
                    <Chip tone={r.status === "live" ? "green" : "yellow"}>
                      {r.status === "live" && android.version ? android.version : r.label}
                    </Chip>
                  </>
                );
                const cls =
                  "flex items-center justify-between gap-3 rounded-xl border border-border bg-[#0f0f12] px-5 py-4";
                return r.href ? (
                  <a key={r.name} href={r.href} className={`${cls} hover:border-accent`}>
                    {inner}
                  </a>
                ) : (
                  <div key={r.name} className={cls}>
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        </AnimateIn>
      </Band>

      {/* S8 — FAQ, grouped by who asks */}
      <Band id="faq">
        <Eyebrow>Questions</Eyebrow>
        <H2>What people ask before they install.</H2>
        <div className="mt-10 flex flex-col gap-12">
          {FAQ_GROUPS.map((g) => (
            <div key={g.group}>
              <h3 className="mb-2 text-sm font-medium uppercase tracking-wider text-text-secondary">{g.group}</h3>
              <div className="divide-y divide-border">
                {g.items.map((f) => (
                  <details key={f.q} className="group py-5">
                    <summary className="cursor-pointer list-none text-lg font-medium text-text-primary">
                      {f.q}
                    </summary>
                    <p className="mt-3 max-w-3xl text-text-secondary">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-sm text-text-secondary">
          Game names appear here only to say which game a release supports. A question that is not
          here goes to Discussions.
        </p>
      </Band>
    </div>
  );
}
