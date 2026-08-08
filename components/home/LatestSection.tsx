import { AnimateIn } from "@/components/ui/AnimateIn";
import {
  NEWS_KIND_LABELS,
  formatNewsDate,
  getAllNews,
} from "@/lib/data/news";

/**
 * "Recently shipped" — evidence for the Why Now argument that precedes it, and
 * a second chance at the news for anyone who scrolled past the hero ticker.
 *
 * Deliberately draws from both tiers (unlike the ticker, which is banner-only):
 * here the point is cadence, so a steady mix of headline and incremental work
 * reads more honestly than three consecutive first-of-kind claims.
 */
export function LatestSection() {
  const items = getAllNews().slice(0, 3);
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1200px] px-6 md:px-12 py-24">
      <div className="section-divider mb-24" />
      <AnimateIn>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-accent">
              Recently Shipped
            </h2>
            <h3 className="font-display text-3xl tracking-tight text-text-primary md:text-4xl">
              What&rsquo;s new
            </h3>
          </div>
          <a
            href="/news"
            className="group inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            All updates
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </div>
      </AnimateIn>

      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, i) => {
          const isExternal = item.href.startsWith("http");
          return (
            <AnimateIn key={item.id} delay={i * 80}>
              <a
                href={item.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="card-interactive flex h-full flex-col rounded-lg border border-border bg-surface p-6"
              >
                <div className="mb-3 flex items-center gap-2.5 text-xs">
                  <span className="font-medium uppercase tracking-wide text-accent">
                    {NEWS_KIND_LABELS[item.kind]}
                  </span>
                  <span className="h-3 w-px bg-border" aria-hidden />
                  <time dateTime={item.date} className="text-text-secondary">
                    {formatNewsDate(item.date)}
                  </time>
                </div>
                <h4 className="mb-2 font-semibold leading-snug text-text-primary">
                  {item.headline}
                </h4>
                {item.blurb && (
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {item.blurb}
                  </p>
                )}
              </a>
            </AnimateIn>
          );
        })}
      </div>
    </section>
  );
}
