import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import {
  NEWS_KIND_LABELS,
  formatNewsDate,
  getAllNews,
  groupNewsByQuarter,
  type NewsKind,
} from "@/lib/data/news";

export const metadata: Metadata = {
  title: "What's New",
  description:
    "New platforms, graphics APIs, engines, vendors and capabilities across the DisplayXR ecosystem.",
};

/**
 * Kinds share the site's three semantic accents rather than getting nine
 * bespoke colours — the label carries the meaning, the colour only groups.
 */
const kindStyles: Record<NewsKind, string> = {
  platform: "bg-accent/15 text-accent border-accent/30",
  "graphics-api": "bg-accent/15 text-accent border-accent/30",
  engine: "bg-accent/15 text-accent border-accent/30",
  product: "bg-success/15 text-success border-success/30",
  standards: "bg-success/15 text-success border-success/30",
  vendor: "bg-success/15 text-success border-success/30",
  capability: "bg-warning/15 text-warning border-warning/30",
  demo: "bg-warning/15 text-warning border-warning/30",
  community: "bg-text-secondary/15 text-text-secondary border-text-secondary/30",
};

export default function NewsPage() {
  const quarters = groupNewsByQuarter(getAllNews());

  return (
    <PageLayout
      title="What's New"
      description="New platforms, graphics APIs, engines, vendors and capabilities across the DisplayXR ecosystem. Version bumps and internal changes don't make this list — for exact component versions, see Platform Support."
      art="/art/dxr-platform-panels.webp"
    >
      <div className="space-y-14">
        {quarters.map(([quarter, items]) => (
          <section key={quarter}>
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-text-secondary">
              {quarter}
            </h2>
            <ul className="space-y-4">
              {items.map((item) => {
                const isExternal = item.href.startsWith("http");
                return (
                  <li
                    key={item.id}
                    id={item.id}
                    className="scroll-mt-24 rounded-lg border border-border bg-surface p-6 transition-colors hover:border-accent/40"
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${kindStyles[item.kind]}`}
                      >
                        {NEWS_KIND_LABELS[item.kind]}
                      </span>
                      <time
                        dateTime={item.date}
                        className="text-sm text-text-secondary"
                      >
                        {formatNewsDate(item.date)}
                      </time>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-text-primary">
                      <a
                        href={item.href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="transition-colors hover:text-accent"
                      >
                        {item.headline}
                      </a>
                    </h3>
                    {item.blurb && (
                      <p className="max-w-3xl leading-relaxed text-text-secondary">
                        {item.blurb}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </PageLayout>
  );
}
