import { Metadata } from "next";
import Link from "next/link";
import { Band, Lead, socialMeta } from "@/components/apps/Product";
import { CatalogHero, Chip, Crumbs } from "@/components/catalog/parts";
import { GAMES, SYSTEMS, type GameStatus } from "@/lib/data/play";
import { play } from "@/lib/data/generated";

const DESCRIPTION =
  "Games you already own, in 3D on a spatial display, through DisplayXR Play. You bring the game from your own store library. Single-player titles only.";

export const metadata: Metadata = {
  title: "Games · Catalog",
  description: DESCRIPTION,
  ...socialMeta("Games · DisplayXR Catalog", DESCRIPTION, "/catalog/games"),
};

// The Games shelf of the Catalog. Games are not DisplayXR components, so this
// shelf has its own hue, its own header rail and its own card shape.
//
// It is a shelf, not a second /play: the package cards and the "what plays"
// rows render the SAME records /play uses (SYSTEMS and GAMES in
// lib/data/play.ts, the lane version from the org sync). Do not add a list
// here. /play's rules apply: no title is named before a public release carries
// it, no company or device names, no performance figures, no game art.

const android = play.android;

const dot: Record<GameStatus, string> = {
  plays: "bg-success",
  partial: "bg-warning",
  refused: "bg-text-secondary",
};

const gamesButton =
  "inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-medium text-text-primary transition-colors hover:border-games hover:text-games";

export default function CatalogGamesPage() {
  return (
    <>
      <div className="catalog-rail border-b border-games/35 px-6 text-[13px] md:px-12">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-3.5 gap-y-2 py-2.5">
          <Chip tone="games-inside">Runs inside the game</Chip>
          <span className="text-text-secondary">
            Play works inside the game itself, so it supports single-player games only and stays off for anti-cheat.
          </span>
        </div>
      </div>

      <CatalogHero games>
        <Crumbs trail={[{ label: "Catalog", href: "/catalog" }, { label: "Games" }]} />
        <p className="mb-4 text-sm font-medium uppercase tracking-wider text-games">DisplayXR Play</p>
        <h1 className="max-w-[820px] font-display text-[clamp(40px,7.2vw,76px)] leading-[1.03] tracking-tight text-text-primary [text-wrap:balance]">
          Games you already own, in 3D.
        </h1>
        <Lead className="mt-7">
          DisplayXR Play renders a game from two eyes on a spatial display. You bring the game from your own store
          library. Single-player titles only.
        </Lead>
      </CatalogHero>

      {/* The three Play packages: the same records as /play#systems. */}
      <Band className="!py-12 md:!py-16">
        <h2 className="mb-7 max-w-3xl font-display text-4xl leading-[1.08] tracking-tight text-text-primary md:text-[46px]">
          Pick the Play package for your system.
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {SYSTEMS.map((s) => {
            const live = s.status === "available";
            return (
              <Link
                key={s.id}
                href="/play#systems"
                className="flex flex-col gap-3.5 rounded-[4px_20px_4px_20px] border border-l-[3px] border-border border-l-games bg-surface p-[26px] transition-colors hover:border-games/60 hover:border-l-games"
              >
                <div className="flex items-center justify-between gap-2.5">
                  <h3 className="text-xl font-semibold tracking-tight text-text-primary">{s.name}</h3>
                  <Chip tone={live ? "games" : "plain"}>
                    {live ? (android.version ? `Available · ${android.version}` : "Available") : "Preview"}
                  </Chip>
                </div>
                <p className="text-sm leading-relaxed text-text-secondary">
                  <span className="text-text-primary">{s.tagline}.</span> {s.how}
                </p>
                <ol className="grid list-decimal gap-1.5 pl-5 text-sm text-text-primary/90">
                  {s.steps.map((st) => (
                    <li key={st}>{st}</li>
                  ))}
                </ol>
                <span className="mt-auto pt-1.5 text-sm font-medium text-games">Open on Play →</span>
              </Link>
            );
          })}
        </div>
      </Band>

      {/* What plays today: the same rows as /play#games, without the notes. */}
      <Band className="bg-[#0b0c10]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="mb-3 font-display text-4xl leading-[1.08] tracking-tight text-text-primary md:text-[46px]">
              What plays today
            </h2>
            <Lead>
              Every game marked Plays or Partial was played in stereo by a person on a spatial display. A Refused
              row is a game Play turns off on purpose. A title is named only once a public release carries it.
              Until then a row describes the game.
            </Lead>
          </div>
          <Link href="/play#games" className={gamesButton}>
            See the full table on Play
          </Link>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-text-secondary">
                {["Game", "System", "Route", "Status"].map((h) => (
                  <th key={h} className="border-b border-border px-4 py-3.5 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GAMES.map((g) => (
                <tr key={g.game} className="border-b border-border transition-colors last:border-b-0 hover:bg-games/5">
                  <td className="px-4 py-3.5 font-medium text-text-primary">
                    {g.game}
                    {g.unnamed && <span className="font-normal text-text-secondary"> (named at release)</span>}
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary">{g.systems}</td>
                  <td className="px-4 py-3.5 text-text-secondary">{g.route === "none" ? "None" : g.route}</td>
                  <td className="px-4 py-3.5 text-text-secondary">
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                      <span aria-hidden className={`h-2 w-2 rounded-full ${dot[g.status]}`} />
                      {g.statusLabel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Band>

      {/* The trust line */}
      <Band className="!py-12 md:!py-16">
        <div className="grid gap-5 rounded-2xl border border-games/40 bg-games/[0.07] p-7 md:grid-cols-[auto_1fr] md:items-center md:gap-8 md:p-9">
          <div aria-hidden className="relative h-24 w-[150px] shrink-0 font-mono text-[11px]">
            <span className="absolute inset-0 rounded-md border border-text-secondary px-1.5 py-[3px] text-text-secondary">
              the game
            </span>
            <span className="absolute bottom-3 left-[38px] right-3 top-[26px] rounded-md border border-games bg-games/15 px-1.5 py-[3px] text-games">
              Play
            </span>
          </div>
          <div>
            <h2 className="mb-2 text-xl font-semibold tracking-tight text-text-primary">
              Play runs inside the game, not inside DisplayXR.
            </h2>
            <p className="max-w-[68ch] leading-[1.7] text-text-secondary">
              Everything else in the Catalog plugs into the DisplayXR runtime. Play is different: it loads into the
              game&rsquo;s own process to draw a second eye, so it changes how that game runs. That is why every game
              listed as playing here was played by a person on a spatial display, why Play only supports
              single-player games, and why it turns itself off for games with anti-cheat.
            </p>
          </div>
        </div>
      </Band>
    </>
  );
}
