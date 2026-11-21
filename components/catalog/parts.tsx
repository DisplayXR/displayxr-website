import Link from "next/link";
import type { ReactNode } from "react";
import {
  AppWindow,
  Check,
  Code,
  Eye,
  Gamepad2,
  Images,
  LayoutGrid,
  Monitor,
  PenTool,
  Plug,
  Smartphone,
} from "lucide-react";
import {
  categoryById,
  FOR_DEVELOPERS_NOTE,
  itemHref,
  LICENCE_ACTIVATION,
  LICENCE_STATES,
  type CatalogItem,
  type CategoryIcon,
} from "@/lib/data/catalog";

// Shared pieces for the Catalog routes (/catalog, its category and item pages
// and the Games shelf). Layout follows the /play and /apps mold; the bands and
// headings themselves come from components/apps/Product.

const ICONS: Record<CategoryIcon, typeof Monitor> = {
  monitor: Monitor,
  pen: PenTool,
  convert: Images,
  eye: Eye,
  phone: Smartphone,
  windows: AppWindow,
  grid: LayoutGrid,
  code: Code,
  gamepad: Gamepad2,
  plug: Plug,
};

export function CategoryGlyph({ icon, size = 20 }: { icon: CategoryIcon; size?: number }) {
  const Icon = ICONS[icon];
  return <Icon size={size} strokeWidth={1.5} aria-hidden />;
}

/** The tinted square that carries an item's category icon. */
export function Glyph({ icon }: { icon: CategoryIcon }) {
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-accent/[0.12] text-accent">
      <CategoryGlyph icon={icon} />
    </span>
  );
}

type ChipTone = "plain" | "verified" | "paid" | "games" | "games-inside";

const chipTones: Record<ChipTone, string> = {
  plain: "border-border text-text-secondary",
  verified: "border-success/30 bg-success/[0.13] text-success",
  paid: "border-accent/30 bg-accent/[0.13] text-accent",
  games: "border-games/40 bg-games/15 text-games",
  "games-inside": "border-games text-text-primary",
};

export function Chip({ tone = "plain", title, children }: { tone?: ChipTone; title?: string; children: ReactNode }) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium leading-normal ${chipTones[tone]}`}
    >
      {tone === "verified" && <Check size={12} aria-hidden />}
      {tone === "games-inside" && (
        <span
          aria-hidden
          className="h-2 w-2 rounded-[2px] border-[1.5px] border-games shadow-[inset_0_0_0_1.5px_#050507,inset_0_0_0_4px_var(--color-games)]"
        />
      )}
      {children}
      {title && <span className="sr-only">: {title}</span>}
    </span>
  );
}

export const VERIFIED_DEFINITION =
  "Signed by its publisher, and passed the conformance run for its component class on the current runtime.";

/**
 * The chips an item carries, from data. "Verified" appears only where the
 * record sets it; an item without it simply shows no trust chip.
 */
export function ItemChips({ item, withCategory = false }: { item: CatalogItem; withCategory?: boolean }) {
  const chips: ReactNode[] = [];
  if (item.verified) {
    chips.push(
      <Chip key="verified" tone="verified" title={VERIFIED_DEFINITION}>
        Verified
      </Chip>,
    );
  }
  if (withCategory) chips.push(<Chip key="cat">{categoryById(item.category)?.label}</Chip>);
  if (item.licence) {
    chips.push(
      <Chip key="licence" tone="paid">
        Licence from vendor
      </Chip>,
    );
  }
  if (item.forDevelopers) {
    chips.push(
      <Chip key="dev" title={FOR_DEVELOPERS_NOTE}>
        For developers
      </Chip>,
    );
  }
  for (const c of item.chips ?? []) {
    chips.push(
      <Chip key={c.label} title={c.title}>
        {c.label}
      </Chip>,
    );
  }
  if (withCategory && item.openSource) chips.push(<Chip key="oss">Open source</Chip>);
  if (chips.length === 0) return null;
  return <div className="flex flex-wrap items-center gap-2">{chips}</div>;
}

const byline = (item: CatalogItem) => [item.publisher, item.platforms].filter(Boolean).join(" · ");

/** A starter-set card on the landing page. */
export function ItemCard({ item }: { item: CatalogItem }) {
  const cat = categoryById(item.category);
  return (
    <Link
      href={itemHref(item)}
      className="card-interactive flex flex-col gap-2.5 rounded-xl border border-border bg-surface p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <Glyph icon={cat?.icon ?? "plug"} />
        <ItemChips item={item} />
      </div>
      <span className="font-mono text-xs text-text-secondary">{cat?.label}</span>
      <h3 className="text-xl font-semibold leading-snug tracking-tight text-text-primary">{item.name}</h3>
      {item.publisher && <span className="text-[13px] text-text-secondary">{item.publisher}</span>}
      <p className="text-sm leading-relaxed text-text-secondary">{item.blurb}</p>
      {(item.platforms || item.version) && (
        <div className="mt-auto flex items-center justify-between gap-2 pt-3 font-mono text-xs text-text-secondary">
          <span>{item.platforms}</span>
          <span>{item.version}</span>
        </div>
      )}
    </Link>
  );
}

/** One row of a category list. */
export function ItemRow({ item }: { item: CatalogItem }) {
  const cat = categoryById(item.category);
  const by = byline(item);
  return (
    <Link
      href={itemHref(item)}
      className="grid grid-cols-[40px_minmax(0,1fr)] gap-x-4 gap-y-2.5 border-b border-border p-5 transition-colors last:border-b-0 hover:bg-surface-hover md:grid-cols-[40px_minmax(0,1fr)_auto]"
    >
      <Glyph icon={cat?.icon ?? "plug"} />
      <div className="min-w-0">
        <div className="text-[17px] font-semibold text-text-primary">{item.name}</div>
        {by && <div className="text-[13px] text-text-secondary">{by}</div>}
        <p className="mt-1 text-sm leading-relaxed text-text-secondary">{item.blurb}</p>
        {(item.detail || item.version) && (
          <p className="mt-3 font-mono text-xs text-text-secondary">
            {[item.detail, item.version].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
      <div className="col-start-2 md:col-start-3 md:row-start-1 md:flex md:flex-col md:items-end md:justify-center md:[&>div]:flex-col md:[&>div]:items-end">
        <ItemChips item={item} />
      </div>
    </Link>
  );
}

/** A dashed, hatched slot: a shelf a publisher could fill. */
export function Slot({
  slot,
  title,
  text,
  cta,
  href,
  compact = false,
}: {
  slot: string;
  title: string;
  text: string;
  cta: string;
  href: string;
  compact?: boolean;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`catalog-slot flex flex-col gap-2 rounded-xl border border-dashed border-accent/40 p-6 transition-colors hover:border-accent ${
        compact ? "" : "min-h-[170px]"
      }`}
    >
      <span className="font-mono text-xs text-text-secondary">{slot}</span>
      <span className="font-display text-2xl leading-[1.15] text-text-primary">{title}</span>
      <span className="text-sm leading-relaxed text-text-secondary">{text}</span>
      <span className="mt-auto pt-1 text-sm font-medium text-accent">
        {cta} {external ? "↗" : "→"}
      </span>
    </a>
  );
}

export function Crumbs({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap gap-2 text-sm text-text-secondary">
      {trail.map((t, i) => (
        <span key={t.label} className="flex gap-2">
          {i > 0 && (
            <span aria-hidden className="opacity-50">
              /
            </span>
          )}
          {t.href ? (
            <Link href={t.href} className="transition-colors hover:text-text-primary">
              {t.label}
            </Link>
          ) : (
            <span>{t.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/** The page-top band with the accent wash, as in the mockup's hero. */
export function CatalogHero({ children, games = false }: { children: ReactNode; games?: boolean }) {
  const wash = games ? "rgba(167,139,250,0.2)" : "rgba(59,130,246,0.2)";
  return (
    <section className="relative overflow-hidden px-6 pb-10 pt-16 md:px-12 md:pb-14 md:pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(1100px 520px at 78% 18%, ${wash}, transparent 62%)` }}
      />
      <div className="relative mx-auto max-w-[1200px]">{children}</div>
    </section>
  );
}

/** A titled block of an item page; blocks are separated by a rule. */
export function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border py-8 first:border-t-0 first:pt-0">
      <h2 className="mb-3 text-[22px] font-semibold tracking-tight text-text-primary">{title}</h2>
      <div className="space-y-3 leading-[1.7] text-text-secondary">{children}</div>
    </section>
  );
}

export function Ticks({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-1.5 grid gap-2.5">
      {items.map((t, i) => (
        <li key={i} className="flex gap-3 text-[15px] text-text-secondary">
          <Check size={15} className="mt-1 shrink-0 text-accent" aria-hidden />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

// --- the vendor-licence layout ----------------------------------------------
// Rendered for any item that carries `licence`. Today that is only the
// labelled example on /catalog; no licensed item has a page.

const dotTone = { blue: "bg-accent", green: "bg-success", yellow: "bg-warning", gray: "bg-text-secondary" } as const;

/** Installing is free; the vendor sells and activates the licence. */
export function LicenceNote({ item }: { item: CatalogItem }) {
  if (!item.licence) return null;
  return (
    <div className="rounded-xl border border-accent/30 bg-accent/[0.09] px-5 py-4 text-sm leading-relaxed text-text-secondary">
      <strong className="font-semibold text-text-primary">Installing is free and anonymous.</strong> DisplayXR does not
      ask who you are and takes no payment. The licence is sold by {item.licence.vendor} on its own site and activated
      on your machine.
    </div>
  );
}

/** The four states a licensed item can be in, as a small panel. */
export function LicenceStates({ item }: { item: CatalogItem }) {
  if (!item.licence) return null;
  const { vendor } = item.licence;
  return (
    <div className="overflow-hidden rounded-[14px] border border-border bg-[#050507]">
      <div className="flex items-center gap-2 border-b border-border bg-surface px-3.5 py-2.5 text-xs text-text-secondary">
        <span aria-hidden className="h-[9px] w-[9px] rounded-full bg-border" />
        <span aria-hidden className="h-[9px] w-[9px] rounded-full bg-border" />
        <span aria-hidden className="h-[9px] w-[9px] rounded-full bg-border" />
        <span className="ml-1.5">DisplayXR · {item.name}</span>
      </div>
      <ul>
        {LICENCE_STATES.map((s) => (
          <li
            key={s.state}
            className="grid grid-cols-1 gap-x-4 gap-y-1.5 border-b border-border px-[18px] py-4 last:border-b-0 sm:grid-cols-[130px_minmax(0,1fr)_auto] sm:items-center"
          >
            <span className="flex items-center gap-2.5 text-[15px] font-semibold text-text-primary">
              <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${dotTone[s.tone]}`} />
              {s.state}
            </span>
            <span className="text-sm text-text-secondary">{s.what}</span>
            <span className={`text-[13px] font-medium ${s.tone === "gray" ? "text-text-secondary" : "text-accent"}`}>
              {s.action(vendor)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** An unlicensed item steps aside and the next one takes over. */
export function StepsAside({ item }: { item: CatalogItem }) {
  if (!item.licence) return null;
  return (
    <div className="grid gap-2.5 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
      <div className="rounded-xl border border-dashed border-border bg-surface p-4 text-sm opacity-75">
        <b className="mb-0.5 block font-semibold text-text-primary">{item.name}</b>
        <span className="text-text-secondary">Expired or unlicensed: steps aside</span>
      </div>
      <div className="grid place-items-center px-1 text-center text-[13px] text-text-secondary">then →</div>
      <div className="rounded-xl border border-success/45 bg-surface p-4 text-sm">
        <b className="mb-0.5 block font-semibold text-text-primary">{item.licence.fallbackName}</b>
        <span className="text-text-secondary">Takes over. Apps keep converting.</span>
      </div>
    </div>
  );
}

export function LicenceActivation({ item }: { item: CatalogItem }) {
  if (!item.licence) return null;
  const { vendor } = item.licence;
  return (
    <Ticks
      items={LICENCE_ACTIVATION.map((a) => (
        <>
          <b className="font-medium text-text-primary">{a.title}</b> {a.text(vendor)}
        </>
      ))}
    />
  );
}

/** The licence blocks of an item page, in order. */
export function LicenceBlocks({ item }: { item: CatalogItem }) {
  if (!item.licence) return null;
  return (
    <>
      <Block title="Licence states">
        <p>One of four states is shown next to the item, so you always know whether it is the one doing the work.</p>
        <LicenceStates item={item} />
      </Block>
      <Block title="If it is not licensed">
        <p>If it is not licensed it steps aside and the next one on your machine takes over. Nothing breaks.</p>
        <StepsAside item={item} />
      </Block>
      <Block title="Activating a licence">
        <LicenceActivation item={item} />
      </Block>
    </>
  );
}
