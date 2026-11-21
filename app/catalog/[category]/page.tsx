import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Band, Lead, socialMeta } from "@/components/apps/Product";
import { Button } from "@/components/ui/Button";
import { CopyLine } from "@/components/catalog/CopyLine";
import { CatalogHero, Crumbs, ItemRow, Slot } from "@/components/catalog/parts";
import { categoryById, CONVERTER_LADDER, itemsIn, LISTED_CATEGORIES } from "@/lib/data/catalog";
import { DOWNLOAD_HREF } from "@/lib/constants";

// One page per category that has at least one item (lib/data/catalog.ts).
// A category gets its page with its first item; until then the landing sends
// it to the publisher invitation. /catalog/games is its own route, not a category.
export const dynamicParams = false;

export function generateStaticParams() {
  return LISTED_CATEGORIES.map((c) => ({ category: c.id }));
}

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = categoryById(category);
  if (!cat) return {};
  return {
    title: `${cat.title} · Catalog`,
    description: cat.lead,
    ...socialMeta(`${cat.title} · DisplayXR Catalog`, cat.lead, `/catalog/${cat.id}`),
  };
}

const sideBox = "rounded-2xl border border-border bg-surface p-6";

/** The 2D-to-3D category's side panel: which converter does the work. */
function WhichConverterRuns() {
  return (
    <div className={sideBox}>
      <h2 className="mb-3 text-base font-semibold text-text-primary">Which converter runs</h2>
      <p className="mb-2 text-sm leading-relaxed text-text-secondary">
        Install as many as you like. For each kind of job, DisplayXR picks one:
      </p>
      <ol className="ml-[11px]">
        {CONVERTER_LADDER.map((l, i) => (
          <li
            key={l.lead}
            className="relative border-l border-border py-2.5 pl-[34px] text-sm leading-relaxed text-text-secondary"
          >
            <span
              aria-hidden
              className="absolute -left-3 top-[9px] grid h-[23px] w-[23px] place-items-center rounded-full border border-border bg-surface font-mono text-[11px] text-text-primary"
            >
              {i + 1}
            </span>
            <b className="font-medium text-text-primary">{l.lead}</b>
            {l.rest}
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm leading-relaxed text-text-secondary">
        Apps keep converting whichever one runs. This line shows the converters on your machine and which one
        serves each job:
      </p>
      <div className="mt-3">
        <CopyLine command="displayxr-cli conv list" />
      </div>
    </div>
  );
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = categoryById(category);
  if (!cat) notFound();
  const items = itemsIn(cat.id);
  if (items.length === 0) notFound();

  return (
    <>
      <CatalogHero>
        <Crumbs trail={[{ label: "Catalog", href: "/catalog" }, { label: cat.label }]} />
        <h1 className="font-display text-[clamp(36px,5.4vw,56px)] leading-[1.06] tracking-tight text-text-primary">
          {cat.title}
        </h1>
        <Lead className="mt-7">{cat.lead}</Lead>
      </CatalogHero>

      <Band className="!py-12 md:!py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-14">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
              {items.map((i) => (
                <ItemRow key={i.id} item={i} />
              ))}
            </div>
            <div className="mt-4">
              <Slot
                compact
                slot={cat.label}
                title={cat.invite.title}
                text={cat.invite.text}
                cta={cat.invite.cta}
                href={cat.invite.href}
              />
            </div>
          </div>
          <aside className="space-y-4">
            {cat.id === "2d-to-3d" && <WhichConverterRuns />}
            <div className={sideBox}>
              <h2 className="mb-2 text-base font-semibold text-text-primary">Start with DisplayXR</h2>
              <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                One install, and everything here plugs into it. No account, no sign-in.
              </p>
              <Button href={DOWNLOAD_HREF} className="w-full">
                Get DisplayXR
              </Button>
            </div>
          </aside>
        </div>
      </Band>
    </>
  );
}
