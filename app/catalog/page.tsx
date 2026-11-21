import { Metadata } from "next";
import Link from "next/link";
import { Gamepad2, Monitor, Plug } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { Band, Eyebrow, H2, Lead, socialMeta } from "@/components/apps/Product";
import { Doors, type Door } from "@/components/catalog/Doors";
import {
  CatalogHero,
  CategoryGlyph,
  ItemCard,
  LicenceStates,
  Slot,
  StepsAside,
} from "@/components/catalog/parts";
import {
  CATALOG_PUBLISH_URL,
  CATEGORIES,
  categoryById,
  HOW_IT_WORKS,
  itemsIn,
  PAID_POINTS,
  PUBLISHER_SLOTS,
  starterItems,
} from "@/lib/data/catalog";
import { DOWNLOAD_HREF } from "@/lib/constants";

const DESCRIPTION =
  "Everything that plugs into DisplayXR, in one list: display plug-ins, trackers, 2D-to-3D converters, workspaces, apps, SDKs and games. More displays, more ways to interact, more 3D from what you already have.";

export const metadata: Metadata = {
  title: "Catalog",
  description: DESCRIPTION,
  ...socialMeta("DisplayXR Catalog", DESCRIPTION, "/catalog"),
};

// The Catalog landing. Items and categories come from lib/data/catalog.ts;
// this file only arranges them. Visual source: the approved Catalog mockup
// (Nov 2026). The doors are the one loud element on the page. Voice: say what
// things are and what you get; see the header of lib/data/catalog.ts.

const ICON = { size: 34, strokeWidth: 1.5 } as const;

const DOORS: Door[] = [
  {
    say: "I have a spatial display",
    text: "See what works with it: workspaces, converters, tracking, apps. Pick what you want and add it to your display.",
    go: "What works with my display",
    href: "#start",
    icon: <Monitor {...ICON} />,
  },
  {
    say: "I want to play games",
    text: "Games you own, in 3D. DisplayXR Play renders them from two eyes. You bring the game and keep it.",
    go: "Games you own, in 3D",
    href: "/catalog/games",
    icon: <Gamepad2 {...ICON} />,
    games: true,
  },
  {
    say: "I make hardware or models",
    text: "Reach every display. Build one component, list it here, and every DisplayXR app runs on it unchanged.",
    go: "Build and list a component",
    href: "#publish",
    icon: <Plug {...ICON} />,
  },
];

const tile =
  "flex flex-col gap-2.5 rounded-xl border border-border bg-surface p-4 text-sm font-medium text-text-primary transition-colors hover:bg-surface-hover lg:rounded-none lg:border-0 lg:border-r lg:px-3.5 lg:py-5 lg:last:border-r-0";

export default function CatalogPage() {
  const starters = starterItems();
  return (
    <>
      <CatalogHero>
        <Eyebrow>DisplayXR Catalog</Eyebrow>
        <h1 className="max-w-[900px] font-display text-[clamp(40px,7.2vw,76px)] leading-[1.03] tracking-tight text-text-primary [text-wrap:balance]">
          Everything that plugs into DisplayXR.
        </h1>
        <Lead className="mt-7">
          More displays, more ways to interact, more 3D from what you already have. Display plug-ins, trackers,
          converters, workspaces, apps and games, in one list. No account, no payment, no cut.
        </Lead>
        <Doors doors={DOORS} />
      </CatalogHero>

      {/* Starter set + Browse */}
      <Band id="start" className="!py-14 md:!py-16">
        <AnimateIn>
          <H2>A good place to start.</H2>
          <Lead className="mb-8">Six things to try first. Each one installs on its own.</Lead>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {starters.map((i) => (
              <ItemCard key={i.id} item={i} />
            ))}
          </div>

          <h2 id="browse" className="mb-4 mt-12 scroll-mt-24 text-xl font-semibold tracking-tight text-text-primary">
            Browse
          </h2>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-9 lg:gap-0 lg:overflow-hidden lg:rounded-xl lg:border lg:border-border lg:bg-surface">
            {CATEGORIES.map((c) => {
              const listed = itemsIn(c.id).length > 0;
              return (
                <Link
                  key={c.id}
                  // A shelf waiting for its first item opens the publisher invitation.
                  href={listed ? `/catalog/${c.id}` : "#publish"}
                  className={`group ${tile}`}
                >
                  <span className="text-text-secondary transition-colors group-hover:text-accent">
                    <CategoryGlyph icon={c.icon} />
                  </span>
                  {c.label}
                  {!listed && <span className="text-xs font-normal text-accent">Be the first</span>}
                </Link>
              );
            })}
            <Link href="/catalog/games" className={`group ${tile}`}>
              <span className="text-text-secondary transition-colors group-hover:text-games">
                <CategoryGlyph icon="gamepad" />
              </span>
              Games
            </Link>
          </div>
        </AnimateIn>
      </Band>

      {/* How it works */}
      <Band id="how" className="bg-[#0b0c10]">
        <AnimateIn>
          <Eyebrow>How it works</Eyebrow>
          <H2>Install it once. Every app gets it.</H2>
          <Lead className="mb-10">
            DisplayXR is the one layer your apps talk to. Add a display, a tracker or a converter to it, and
            everything you run picks it up.
          </Lead>
          <ol className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
            {HOW_IT_WORKS.map((s) => (
              <li key={s.n} className="rounded-2xl border border-border bg-surface p-7">
                <span className="font-mono text-xs text-accent">{s.n}</span>
                <h3 className="mb-2 mt-3 text-xl font-semibold tracking-tight text-text-primary">{s.title}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-accent/30 bg-accent/[0.09] p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-text-primary">
                You keep your customers. No fee, no cut.
              </h3>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-text-secondary">
                Publishers host their own software and reach every spatial display with one component. Listing is
                free.
              </p>
            </div>
            <Link href="#publish" className="shrink-0 text-sm font-medium text-accent hover:text-accent-hover">
              List your component →
            </Link>
          </div>
        </AnimateIn>
      </Band>

      {/* Open for publishers */}
      <Band id="publish">
        <AnimateIn>
          <Eyebrow>Open for publishers</Eyebrow>
          <H2>Build one component. Reach every spatial display.</H2>
          <Lead className="mb-10">
            Some shelves are waiting for their first item, and yours could be it. You host the files and keep your
            customers. The Catalog sends people to your release. Listing costs nothing.
          </Lead>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PUBLISHER_SLOTS.map((s) => (
              <Slot
                key={s.title}
                slot={categoryById(s.category)?.label ?? ""}
                title={s.title}
                text={s.text}
                cta="List yours"
                href={s.href}
              />
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href={CATALOG_PUBLISH_URL}>Build and list a component</Button>
            <Button href="/components" variant="secondary">
              Read the component model
            </Button>
          </div>

          {/* How paid components work: an explainer for vendors. */}
          <div id="paid" className="mt-16 scroll-mt-24 rounded-2xl border border-border bg-surface p-7 md:p-9">
            <h3 className="font-display text-3xl leading-[1.12] tracking-tight text-text-primary md:text-4xl">
              How paid components work
            </h3>
            <p className="mt-3 max-w-2xl leading-relaxed text-text-secondary">
              Sell your converter your way. People install it free, you sell the licence on your own site, and
              DisplayXR stays out of the transaction.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-12">
              <ul className="grid content-start gap-5">
                {PAID_POINTS.map((p) => (
                  <li key={p.title}>
                    <h4 className="text-base font-semibold text-text-primary">{p.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary">{p.text}</p>
                  </li>
                ))}
              </ul>
              <div className="min-w-0 space-y-5">
                <LicenceStates />
                <StepsAside />
              </div>
            </div>
          </div>
        </AnimateIn>
      </Band>

      {/* Get DisplayXR */}
      <Band className="bg-[#0b0c10] !py-12 md:!py-16">
        <div className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-7 sm:flex-row sm:items-center sm:justify-between lg:p-8">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-text-primary">Start with DisplayXR</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-text-secondary">
              One install puts DisplayXR on your machine, and everything in the Catalog plugs into it. No account,
              no sign-in.
            </p>
          </div>
          <Button href={DOWNLOAD_HREF} className="shrink-0">
            Get DisplayXR
          </Button>
        </div>
      </Band>
    </>
  );
}
