import { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Band, Eyebrow, FeatureGrid, H2, Lead, socialMeta } from "@/components/apps/Product";
import {
  DOLPHIN_GUIDE,
  DOLPHIN_MIN_RUNTIME,
  DOLPHIN_ASKS_CAMERA,
  DOLPHIN_RELEASES,
  DOLPHIN_REPO,
  DOLPHIN_UPSTREAM,
  DOLPHIN_VERSION,
} from "@/lib/data/play";
import { DOWNLOAD_HREF } from "@/lib/constants";

// Dolphin 3D (DisplayXR), the first per-item page under /play. Facts come from
// the fork's user guide (docs/DisplayXR-Android.md, branch displayxr).
// Guardrails (lib/data/play.ts): "based on Dolphin", no endorsement by the
// Dolphin team implied, no console-maker marks, nothing shipped or linked but
// the app, no performance numbers, no "verified" or "conformant".

const DESCRIPTION =
  "Dolphin 3D for Android, based on the Dolphin emulator: it renders every frame twice, once for each eye, and the DisplayXR runtime prepares the pair for a spatial display. Bring your own software.";

export const metadata: Metadata = {
  title: "Dolphin 3D · Play",
  description: DESCRIPTION,
  ...socialMeta("Dolphin 3D (DisplayXR)", DESCRIPTION, "/play/dolphin"),
};

const STEPS: { title: string; text: string }[] = [
  {
    title: "Install DisplayXR for Android",
    text: `The DisplayXR runtime for Android, with your display's plug-in${
      DOLPHIN_MIN_RUNTIME !== "TODO" ? `, ${DOLPHIN_MIN_RUNTIME} or later` : ""
    }. It is a separate app; Dolphin 3D connects to it.`,
  },
  {
    title: "Install Dolphin 3D",
    text: "The signed APK from the release page. It installs next to a regular Dolphin as its own app, with its own settings and user folder.",
  },
  {
    title: "Turn on 3D",
    text: "Settings › Graphics Settings › Video Backend: OpenGL. Then Enhancements › Stereoscopy › Stereoscopy Mode: 3D Display (DisplayXR, OpenGL).",
  },
  {
    title: "Load your own software",
    text: DOLPHIN_ASKS_CAMERA
      ? "Start a game. The first time, Android asks for camera access: the display uses the front camera to follow your eyes."
      : "Start a game.",
  },
];

const LIMITS = [
  { title: "OpenGL ES only", text: "The Vulkan backend has no 3D Display mode yet; with Vulkan selected the mode falls back to off." },
  { title: "Depth is set by hand", text: "Per game, with Separation and Convergence. There is no automatic depth." },
  { title: "Head-following is experimental", text: "The display follows your eyes to keep each eye's picture in place. Scene parallax with head position is an experimental setting, off by default." },
  { title: "Dialogs stay in 3D", text: "Pause, the in-game menu and the background switch to 2D. Pop-up dialogs still appear over the 3D picture." },
  { title: "Two renders per frame", text: "Each frame is drawn twice, so a game that runs at full speed in 2D may not in 3D." },
  { title: "Touch controls are flat", text: "The on-screen controls are drawn flat over the 3D picture." },
];

const code = "rounded bg-white/10 px-1.5 py-0.5 font-mono text-[13px] text-text-primary";

export default function DolphinPage() {
  const released = DOLPHIN_VERSION !== "TODO";
  return (
    <div className="bg-[#050507]">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 md:px-12 pt-28 pb-20 md:pt-32 md:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(1100px_560px_at_78%_40%,rgba(59,130,246,0.18),rgba(5,5,7,0)_60%)]"
        />
        <div className="relative mx-auto max-w-[1200px]">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <Eyebrow>Play · Android</Eyebrow>
              <span className="mb-4 whitespace-nowrap rounded-full bg-warning/15 px-2.5 py-1 text-xs font-medium text-warning">
                Preview{released ? ` · ${DOLPHIN_VERSION}` : ""}
              </span>
            </div>
            <h1 className="mb-6 text-5xl md:text-6xl font-display tracking-tight text-white leading-[1.04]">
              Dolphin 3D
            </h1>
            <p className="mb-6 text-lg md:text-xl leading-relaxed text-white/85">
              Dolphin 3D renders every frame twice, once for each eye, and hands the pair to the
              DisplayXR runtime, which prepares it for the spatial display. Real stereo from the game&apos;s
              own cameras.
            </p>
            <div className="mb-6 flex flex-wrap gap-4">
              <Button href={DOLPHIN_RELEASES}>{released ? `Download ${DOLPHIN_VERSION}` : "Releases"}</Button>
              <Button variant="secondary" href="#install" className="bg-black/45">
                How to install
              </Button>
            </div>
            <p className="text-sm text-white/70">
              Based on{" "}
              <a href={DOLPHIN_UPSTREAM} className="text-white underline underline-offset-2 hover:text-accent-hover">
                Dolphin
              </a>
              : a GPL-2.0-or-later fork with one added stereo mode. Not made or endorsed by the Dolphin team.
            </p>
          </div>
        </div>
      </section>

      {/* Install */}
      <Band id="install" className="bg-[#0b0c10]">
        <AnimateIn>
          <Eyebrow>Install</Eyebrow>
          <H2>Four steps.</H2>
          <Lead className="mb-10">
            You need an Android device with a spatial display, the DisplayXR runtime with your display&apos;s
            plug-in, and a GPU with OpenGL ES 3.2.{" "}
            <a href={DOWNLOAD_HREF} className="text-accent underline underline-offset-2 hover:text-accent-hover">
              Get DisplayXR
            </a>
            .
          </Lead>
          <ol className="grid gap-5 sm:grid-cols-2">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-border bg-surface p-6">
                <p className="mb-2 font-mono text-xs text-accent">0{i + 1}</p>
                <h3 className="mb-2 text-base font-semibold text-text-primary">{s.title}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{s.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm text-text-secondary">
            While a game runs it shows in 3D. Pause, the in-game menu and the background switch the display to
            2D; on-screen messages sit flat at the screen surface.
          </p>
        </AnimateIn>
      </Band>

      {/* Depth */}
      <Band id="depth">
        <AnimateIn>
          <Eyebrow>Depth</Eyebrow>
          <H2>Set it per game.</H2>
          <Lead className="mb-8">
            Two settings under Stereoscopy: <strong className="text-text-primary">Separation</strong>, how much
            depth, and <strong className="text-text-primary">Convergence</strong>, what sits at the screen surface.
            Nearer comes out of the screen, farther goes behind it. Keep most of the picture near the surface.
          </Lead>
          <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-text-secondary">
            <p>
              While a game runs, Settings in the in-game menu changes depth at once; with a per-game file the
              change lasts until you close the game.
            </p>
            <p>
              To keep a value for one game, put it in that game&apos;s settings file,{" "}
              <code className={code}>GameSettings/&lt;GAME ID&gt;.ini</code> in the app&apos;s user folder:
            </p>
            <pre className="overflow-x-auto rounded-xl border border-border bg-[#0f0f12] p-4 font-mono text-[13px] text-text-primary">
{`[Video_Stereoscopy]
StereoDepth = 24
StereoConvergence = 10`}
            </pre>
            <p>
              <code className={code}>StereoDepth</code> is Separation. A game&apos;s own file wins over the global
              settings.
            </p>
          </div>
        </AnimateIn>
      </Band>

      {/* Limits */}
      <Band id="limits" className="bg-[#0b0c10]">
        <AnimateIn>
          <Eyebrow>Known limits</Eyebrow>
          <H2>What it does not do yet.</H2>
          <FeatureGrid items={LIMITS} cols={3} />
        </AnimateIn>
      </Band>

      {/* BYO + source */}
      <Band id="source">
        <AnimateIn>
          <div className="flex flex-wrap gap-14">
            <div className="min-w-0 flex-[1_1_440px]">
              <Eyebrow>Bring your own</Eyebrow>
              <H2>Your software, your files.</H2>
              <Lead>No games, BIOS or firmware are shipped or linked.</Lead>
            </div>
            <div className="min-w-0 flex-[1_1_440px]">
              <Eyebrow>Source</Eyebrow>
              <H2>Open, GPL-2.0-or-later.</H2>
              <Lead className="mb-7">
                Like Dolphin. The source for every release is at its tag; the user guide lives with the code.
              </Lead>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" href={DOLPHIN_REPO}>Source on GitHub</Button>
                <Button variant="secondary" href={DOLPHIN_GUIDE}>User guide</Button>
                <Button variant="secondary" href="/play">All of Play</Button>
              </div>
            </div>
          </div>
        </AnimateIn>
      </Band>
    </div>
  );
}
