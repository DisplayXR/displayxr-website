import { Metadata } from "next";
import Link from "next/link";
import { Gamepad2, Monitor, Plug } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { Band, Eyebrow, H2, Lead, socialMeta } from "@/components/apps/Product";
import { Doors, type Door } from "@/components/catalog/Doors";
import { CopyLine } from "@/components/catalog/CopyLine";
import {
  CatalogHero,
  CategoryGlyph,
  Chip,
  ItemCard,
  LicenceActivation,
  LicenceNote,
  LicenceStates,
  Slot,
  StepsAside,
  VERIFIED_DEFINITION,
} from "@/components/catalog/parts";
import {
  CATALOG_PUBLISH_URL,
  CATEGORIES,
  categoryById,
  itemsIn,
  LICENCE_EXAMPLE,
  PUBLISHER_SLOTS,
  starterItems,
} from "@/lib/data/catalog";
import { DOWNLOAD_HREF } from "@/lib/constants";

const DESCRIPTION =
  "Everything that plugs into DisplayXR, in one list: display plug-ins, trackers, 2D-to-3D converters, workspaces, apps, SDKs and games. Publishers host their own software. No account, no payment, no cut.";

export const metadata: Metadata = {
  title: "Catalog",
  description: DESCRIPTION,
  ...socialMeta("DisplayXR Catalog", DESCRIPTION, "/catalog"),
};

// The Catalog landing. Items and categories come from lib/data/catalog.ts;
// this file only arranges them. Visual source: the approved Catalog mockup
// (Nov 2026). The doors are the one loud element on the page.

const ICON = { size: 34, strokeWidth: 1.5 } as const;

const DOORS: Door[] = [
  {
    say: "I have a spatial display",
    text: "See what works with it: workspaces, converters, tracking, apps. Pick what you want and get it from its own release.",
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
          Displays, trackers, converters, workspaces, apps and games, in one list. DisplayXR lists them and points
          you at each release. Publishers host their own software. No account, no payment, no cut.
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
                  // An empty shelf has no page yet: it opens the publisher invitation.
                  href={listed ? `/catalog/${c.id}` : "#publish"}
                  className={`group ${tile}`}
                >
                  <span className="text-text-secondary transition-colors group-hover:text-accent">
                    <CategoryGlyph icon={c.icon} />
                  </span>
                  {c.label}
                  {!listed && <span className="text-xs font-normal text-text-secondary">Open for the first one</span>}
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

      {/* How listing works */}
      <Band id="listing" className="bg-[#0b0c10]">
        <AnimateIn>
          <Eyebrow>How listing works</Eyebrow>
          <H2>One label and one rule about money.</H2>
          <Lead className="mb-10">
            The label says how far an item has been checked. Nothing here is ranked, rated or sold by DisplayXR.
          </Lead>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
            <div className="rounded-2xl border border-success/35 bg-surface p-7">
              <Chip tone="verified">Verified</Chip>
              <h3 className="mb-2 mt-3.5 text-xl font-semibold tracking-tight text-text-primary">
                Signed and conformance-tested
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {VERIFIED_DEFINITION} No item carries the label yet.
              </p>
            </div>
            <div className="rounded-2xl border border-dashed border-border bg-surface p-7">
              <Chip>No label</Chip>
              <h3 className="mb-2 mt-3.5 text-xl font-semibold tracking-tight text-text-primary">
                Listed, not yet tested
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                The item is real and its page says where it comes from. It has not been through that check, so it
                shows no label. The label appears once it has.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-7">
              <Chip tone="paid">Licence from vendor</Chip>
              <h3 className="mb-2 mt-3.5 text-xl font-semibold tracking-tight text-text-primary">
                Paid items: install is free
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                Installing is always free. Where a licence is needed, the vendor sells and activates it on its own
                site. DisplayXR takes no payment and no cut.
              </p>
            </div>
          </div>

          {/* The vendor-licence layout, exercised by a labelled example: no
              paid item is listed yet, so none has a page (lib/data/catalog.ts). */}
          <details className="group mt-6 rounded-2xl border border-border bg-surface">
            <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 p-6 text-base font-semibold text-text-primary">
              How a licensed item will read
              <Chip>Example, not a real item</Chip>
              <span className="text-sm font-normal text-text-secondary group-open:hidden">(show)</span>
            </summary>
            <div className="space-y-8 px-6 pb-7">
              <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
                No licensed item is listed yet. When the first one is, its page will carry these three blocks. The
                example is a converter; the vendor and the item are placeholders.
              </p>
              <LicenceNote item={LICENCE_EXAMPLE} />
              <div>
                <h3 className="mb-3 text-base font-semibold text-text-primary">Licence states</h3>
                <LicenceStates item={LICENCE_EXAMPLE} />
              </div>
              <div>
                <h3 className="mb-3 text-base font-semibold text-text-primary">If it is not licensed</h3>
                <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                  It steps aside and the next converter on the machine takes over. Nothing breaks.
                </p>
                <StepsAside item={LICENCE_EXAMPLE} />
              </div>
              <div>
                <h3 className="mb-3 text-base font-semibold text-text-primary">Activating a licence</h3>
                <LicenceActivation item={LICENCE_EXAMPLE} />
              </div>
            </div>
          </details>
        </AnimateIn>
      </Band>

      {/* Open for publishers */}
      <Band id="publish">
        <AnimateIn>
          <Eyebrow>Open for publishers</Eyebrow>
          <H2>Some shelves are still empty. Yours could be the first item on one.</H2>
          <Lead className="mb-10">
            You host the files and keep your customers. The Catalog points at your release. Listing costs nothing.
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
        </AnimateIn>
      </Band>

      {/* Install strip */}
      <Band className="bg-[#0b0c10] !py-12 md:!py-16">
        <div className="grid items-center gap-5 rounded-2xl border border-border bg-surface p-7 lg:grid-cols-[1.1fr_1fr_auto] lg:gap-7 lg:p-8">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-text-primary">Install from Download</h2>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">
              DisplayXR and the DisplayXR Browser install from the Download page. Everything else links to its own
              release from its item page. No account, no sign-in.
            </p>
          </div>
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <Chip>Coming</Chip>
              <span className="text-xs text-text-secondary">Install by id from the command line. Not in a release yet.</span>
            </div>
            <CopyLine command="displayxr-cli install <id>" copy={false} />
          </div>
          <Button href={DOWNLOAD_HREF}>Download</Button>
        </div>
      </Band>
    </>
  );
}
