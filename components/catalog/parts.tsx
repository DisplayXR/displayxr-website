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

type ChipTone = "plain" | "first" | "paid" | "games" | "games-inside";

const chipTones: Record<ChipTone, string> = {
  plain: "border-border text-text-secondary",
  first: "border-accent/30 bg-accent/[0.13] text-accent",
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

/**
 * The chips an item carries, from data: who publishes it, then what is true
 * of it (open source, for developers, its own chips).
 */
export function ItemChips({ item, withCategory = false }: { item: CatalogItem; withCategory?: boolean }) {
  const chips: ReactNode[] = [];
  if (item.publisher) {
    chips.push(
      <Chip key="by" tone={item.publisher === "DisplayXR" ? "first" : "plain"}>
        By {item.publisher}
      </Chip>,
    );
  }
  if (withCategory) chips.push(<Chip key="cat">{categoryById(item.category)?.label}</Chip>);
  if (item.openSource) chips.push(<Chip key="oss">Open source</Chip>);
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
  if (chips.length === 0) return null;
  return <div className="flex flex-wrap items-center gap-2">{chips}</div>;
}


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
        <span className="pt-1 font-mono text-xs text-text-secondary">{cat?.label}</span>
      </div>
      <h3 className="text-xl font-semibold leading-snug tracking-tight text-text-primary">{item.name}</h3>
      <ItemChips item={item} />
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
  return (
    <Link
      href={itemHref(item)}
      className="grid grid-cols-[40px_minmax(0,1fr)] gap-x-4 border-b border-border p-5 transition-colors last:border-b-0 hover:bg-surface-hover"
    >
      <Glyph icon={cat?.icon ?? "plug"} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-[17px] font-semibold text-text-primary">{item.name}</span>
          <ItemChips item={item} />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.blurb}</p>
        {(item.platforms || item.version || item.detail) && (
          <p className="mt-3 font-mono text-xs text-text-secondary">
            {[item.platforms, item.detail, item.version].filter(Boolean).join("  ·  ")}
          </p>
        )}
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
