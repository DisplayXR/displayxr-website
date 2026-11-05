import { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { AnimateIn } from "@/components/ui/AnimateIn";
import {
  CONTROLS,
  FAQ,
  GAMES,
  PIPELINE,
  PLAY_PORTING_GUIDE,
  PROFILE_SNIPPET,
  REPOS,
  RULES,
  SYSTEMS,
} from "@/lib/data/play";
import { DISCUSSIONS_URL, DOWNLOAD_HREF } from "@/lib/constants";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "DisplayXR Play",
  description:
    "Existing games rendered from two eyes on 3D displays. Steam on Linux, Windows and Android, through the DisplayXR runtime. Real stereo, single-player titles, you keep your game.",
};

// A product page in the Browser page's mold: full-bleed bands, big type, one
// idea per screen. Copy approved in the Nov 5, 2026 design pass; the hero
// visual is a schematic two-eye pair until camera footage of a panel exists.
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
  // Two schematic viewpoints of the same scene: the house sits 5 % further
  // left in the right eye. Replace with camera footage of a real panel.
  const Eye = ({ label, shift }: { label: string; shift: number }) => (
    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-[linear-gradient(160deg,#1b2a4a_0%,#0c1222_55%,#06080f_100%)]">
      <div
        className="absolute top-[38%] h-[44%] w-[30%] rounded-t-md bg-[#2f3b57] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
        style={{ left: `${34 - shift}%` }}
      />
      <div
        className="absolute top-[26%] h-0 w-0 border-x-[60px] border-b-[56px] border-x-transparent border-b-[#3a4a6b]"
        style={{ left: `${44 - shift}%` }}
      />
      <div className="absolute bottom-2.5 left-3 text-[11px] uppercase tracking-wider text-white/60">{label}</div>
    </div>
  );
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2.5">
        <Eye label="Left eye" shift={0} />
        <Eye label="Right eye" shift={5} />
      </div>
      <p className="text-sm text-text-secondary">
        Two rendered viewpoints of the same frame, woven by the runtime for your display.
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
            <EyePair />
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
                    <Chip tone={live ? "green" : "yellow"}>{live ? "Available" : "Preview"}</Chip>
                  </div>
                  <p className="text-sm text-text-secondary">{s.how}</p>
                  <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-sm text-text-primary/90">
                    {s.steps.map((st) => (
                      <li key={st}>{st}</li>
                    ))}
                  </ol>
                  <div className="mt-auto flex flex-wrap gap-2.5 pt-2">
                    <Button href={s.primary.href} variant={live ? "primary" : "secondary"}>
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

      {/* S4 — Compatibility */}
      <Band id="games" className="bg-[#0b0c10]">
        <AnimateIn>
          <Eyebrow>What plays today</Eyebrow>
          <H2>The list, with the cost next to each game.</H2>
          <p className="mb-9 max-w-2xl text-lg leading-relaxed text-text-secondary">
            Every row is a game a person played in stereo on a 3D display, with the frame-rate
            ratio measured. A title is named only once a release carries it. Games with anti-cheat
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
                  {["Game", "System", "Route", "Status", "Stereo vs 2D", "Notes"].map((h) => (
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
                    </td>
                    <td className="px-4 py-4 text-text-primary/90">{g.systems}</td>
                    <td className="px-4 py-4 text-text-primary/90">{g.route}</td>
                    <td className="px-4 py-4 text-text-primary">
                      <span className="inline-flex items-center gap-1.5">
                        <Dot color={statusDot[g.status]} />
                        {g.statusLabel}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-text-primary/90">{g.cost}</td>
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
      <Band id="profiles">
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
      <Band className="bg-[#0b0c10]">
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
      <Band>
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
                    <Chip tone={r.status === "live" ? "green" : "yellow"}>{r.label}</Chip>
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

      {/* S8 — FAQ */}
      <Band className="bg-[#0b0c10]">
        <Eyebrow>Questions</Eyebrow>
        <div className="mt-6 divide-y divide-border">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="cursor-pointer list-none text-lg font-medium text-text-primary">
                {f.q}
              </summary>
              <p className="mt-3 max-w-3xl text-text-secondary">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-10 text-sm text-text-secondary">
          Game names appear here only to say which game a release supports.
        </p>
      </Band>
    </div>
  );
}
