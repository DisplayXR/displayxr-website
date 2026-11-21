import { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Lead, socialMeta } from "@/components/apps/Product";
import { Button } from "@/components/ui/Button";
import { Block, CatalogHero, Crumbs, ItemChips, Ticks } from "@/components/catalog/parts";
import { categoryById, FOR_DEVELOPERS_NOTE, itemById, ITEMS, type CatalogItem } from "@/lib/data/catalog";

// One page per item in lib/data/catalog.ts: what it is, what you get, and a
// sticky facts panel with a direct "Get it" action. The panel shows only the
// facts the data has.
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
        {item.comesWith && <Fact label="Comes with">{item.comesWith}</Fact>}
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

          <div className="mt-12">
            {(item.sections ?? []).map((s) => (
              <Block key={s.title} title={s.title}>
                {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
                {s.bullets && <Ticks items={s.bullets} />}
              </Block>
            ))}
            {item.forDevelopers && (
              <Block title="For developers">
                <p>{FOR_DEVELOPERS_NOTE}</p>
              </Block>
            )}
          </div>
        </div>
        <Facts item={item} />
      </div>
    </CatalogHero>
  );
}
