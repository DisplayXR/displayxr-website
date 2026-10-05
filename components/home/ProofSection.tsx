import { AnimateIn } from "@/components/ui/AnimateIn";
import { NEWS_KIND_LABELS, formatNewsDate, getBannerNews } from "@/lib/data/news";

// Claims a sceptical reader can check, each asserted somewhere mechanical: a
// CI job, a link line, a driver that ships. Never imply Khronos certification:
// the suite runs; no conformance submission has been made.
const receipts = [
  {
    stat: "Zero",
    label: "vendor identifiers in the shipped runtime",
    body: "Neutrality is enforced in the binary: the runtime never weaves, the vendor's plug-in always does, and CI fails any change that puts a vendor symbol in the runtime's link line.",
  },
  {
    stat: "Every release",
    label: "runs the official Khronos OpenXR conformance suite",
    body: "A smoke subset on pull requests, and the full non-interactive suite nightly and on every release tag, hardware-free, against the simulated display.",
  },
  {
    stat: "No hardware",
    label: "needed to build for a spatial display",
    body: "The runtime ships a simulated display in an ordinary window, with the viewer's eyes on the mouse and keyboard: the same driver the conformance suite runs against.",
  },
];

const PLATFORMS = ["Windows", "macOS", "Linux", "Android", "Unity", "Unreal", "The web"];

export function ProofSection() {
  // Banner-tier only, with the feed's aging, so the strip never shows stale news.
  const news = getBannerNews().slice(0, 3);
  return (
    <section className="mx-auto max-w-[1200px] px-6 md:px-12 py-24">
      <div className="section-divider mb-24" />
      <AnimateIn>
        <h2 className="text-sm font-medium text-accent uppercase tracking-wider mb-6">
          Runs on
        </h2>
        <ul className="mb-16 flex flex-wrap gap-x-8 gap-y-3 text-lg text-text-primary">
          {PLATFORMS.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <h2 className="text-sm font-medium text-accent uppercase tracking-wider mb-8">
          Things you can check
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {receipts.map((r) => (
            <div key={r.label}>
              <p className="text-2xl font-display tracking-tight text-text-primary leading-tight">{r.stat}</p>
              <p className="text-sm font-medium text-accent mt-1 mb-3">{r.label}</p>
              <p className="text-sm text-text-secondary leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>
      </AnimateIn>

      {news.length > 0 && (
        <AnimateIn delay={80}>
          <div className="mt-16 border-t border-border pt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-accent uppercase tracking-wider">Latest</h2>
              <a href="/news" className="text-sm text-text-secondary hover:text-text-primary">
                All updates →
              </a>
            </div>
            <ul className="grid gap-4 md:grid-cols-3">
              {news.map((item) => {
                const ext = item.href.startsWith("http");
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      target={ext ? "_blank" : undefined}
                      rel={ext ? "noopener noreferrer" : undefined}
                      className="group block"
                    >
                      <p className="mb-1 text-xs text-text-secondary">
                        <span className="uppercase tracking-wide text-accent">{NEWS_KIND_LABELS[item.kind]}</span>
                        {" · "}
                        <time dateTime={item.date}>{formatNewsDate(item.date)}</time>
                      </p>
                      <p className="text-sm font-medium text-text-primary group-hover:text-accent">
                        {item.headline}
                      </p>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </AnimateIn>
      )}
    </section>
  );
}
