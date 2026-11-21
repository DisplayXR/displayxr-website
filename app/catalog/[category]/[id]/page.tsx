import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode } from "react";
import { Lead, socialMeta } from "@/components/apps/Product";
import { Button } from "@/components/ui/Button";
import {
  Block,
  CatalogHero,
  Chip,
  Crumbs,
  ItemChips,
  LicenceBlocks,
  LicenceNote,
  Ticks,
  VERIFIED_DEFINITION,
} from "@/components/catalog/parts";
import { categoryById, FOR_DEVELOPERS_NOTE, itemById, ITEMS, type CatalogItem } from "@/lib/data/catalog";

// One page per item in lib/data/catalog.ts. The same layout serves a free item
// and a vendor-licensed one: the licence note, the licence blocks and the
// second action appear when the record carries `licence`. No listed item does
// yet (the labelled example on /catalog exercises those blocks).
export const dynamicParams = false;

export function generateStaticParams() {
  return ITEMS.map((i) => ({ category: i.category, id: i.id }));
}

type Props = { params: Promise<{ category: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, id } = await params;
  const item = itemById(category, id);
  if (!item) return {};
  const description = item.lead ?? item.blurb;
  return {
    title: `${item.name} · Catalog`,
    description,
    ...socialMeta(`${item.name} · DisplayXR Catalog`, description, `/catalog/${item.category}/${item.id}`),
  };
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-[11px] text-sm last:border-b-0">
      <dt className="shrink-0 text-text-secondary">{label}</dt>
      <dd className="text-right text-text-primary">{children}</dd>
    </div>
  );
}

function Out({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="text-accent underline underline-offset-[3px] hover:text-accent-hover"
    >
      {children}
      {external && " ↗"}
    </a>
  );
}

/** The sticky panel: how to get the item, then only the facts the data has. */
function Facts({ item }: { item: CatalogItem }) {
  const cat = categoryById(item.category);
  return (
    <aside className="overflow-hidden rounded-2xl border border-border bg-surface lg:sticky lg:top-24">
      <div className="flex flex-col gap-3 border-b border-border p-6">
        <Button href={item.get.href} className="w-full">
          {item.get.label}
        </Button>
        {item.more && (
          <Button href={item.more.href} variant="secondary" className="w-full">
            {item.more.label}
          </Button>
        )}
        {item.get.note && <p className="text-sm leading-relaxed text-text-secondary">{item.get.note}</p>}
      </div>
      <dl className="px-6 pb-4 pt-2">
        {item.publisher && <Fact label="Publisher">{item.publisher}</Fact>}
        {item.version && (
          <Fact label="Version">
            <span className="font-mono">{item.version}</span>
          </Fact>
        )}
        {item.platforms && <Fact label="Platforms">{item.platforms}</Fact>}
        {cat && (
          <Fact label="Category">
            <Out href={`/catalog/${cat.id}`}>{cat.label}</Out>
          </Fact>
        )}
        {item.licence && <Fact label="Licence">From {item.licence.vendor}</Fact>}
        {item.runs && <Fact label="Runs">{item.runs}</Fact>}
        {item.needs && <Fact label="Needs">{item.needs}</Fact>}
        {item.hostedBy && (
          <Fact label="Hosted by">
            <Out href={item.hostedBy.href}>{item.hostedBy.label}</Out>
          </Fact>
        )}
      </dl>
    </aside>
  );
}

function Trust({ item }: { item: CatalogItem }) {
  return (
    <Block title="Trust">
      {item.verified ? (
        <p>
          <Chip tone="verified">Verified</Chip>
          <span className="ml-2">{VERIFIED_DEFINITION}</span>
        </p>
      ) : (
        <p>
          Listed, not yet tested. This item has not been through the signed-and-conformance-tested check, so it
          carries no label. <Out href="/catalog#listing">How listing works</Out>
        </p>
      )}
      {item.trustNotes?.map((n) => <p key={n}>{n}</p>)}
      {(item.chips ?? [])
        .filter((c) => c.title)
        .map((c) => (
          <p key={c.label}>
            <Chip>{c.label}</Chip>
            <span className="ml-2">{c.title}</span>
          </p>
        ))}
      {item.forDevelopers && (
        <p>
          <Chip>For developers</Chip>
          <span className="ml-2">{FOR_DEVELOPERS_NOTE}</span>
        </p>
      )}
    </Block>
  );
}

export default async function ItemPage({ params }: Props) {
  const { category, id } = await params;
  const item = itemById(category, id);
  const cat = categoryById(category);
  if (!item || !cat) notFound();

  return (
    <CatalogHero>
      <Crumbs
        trail={[
          { label: "Catalog", href: "/catalog" },
          { label: cat.label, href: `/catalog/${cat.id}` },
          { label: item.name },
        ]}
      />
      <div className="grid grid-cols-1 gap-8 pb-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-14">
        <div className="min-w-0">
          <div className="mb-5">
            <ItemChips item={item} withCategory />
          </div>
          <h1 className="font-display text-[clamp(36px,5.4vw,56px)] leading-[1.06] tracking-tight text-text-primary [overflow-wrap:anywhere]">
            {item.name}
          </h1>
          <Lead className="mt-7">{item.lead ?? item.blurb}</Lead>

          {item.licence && (
            <div className="mt-7">
              <LicenceNote item={item} />
            </div>
          )}

          <div className="mt-12">
            {(item.sections ?? []).map((s, i) => (
              <Fragment key={s.title}>
                <Block title={s.title}>
                  {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
                  {s.bullets && <Ticks items={s.bullets} />}
                </Block>
                {/* The licence blocks follow "What it does", as in the mockup. */}
                {i === 0 && <LicenceBlocks item={item} />}
              </Fragment>
            ))}
            {!item.sections?.length && <LicenceBlocks item={item} />}
            <Trust item={item} />
          </div>
        </div>
        <Facts item={item} />
      </div>
    </CatalogHero>
  );
}
