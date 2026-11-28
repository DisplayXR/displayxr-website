import { Button } from "@/components/ui/Button";
import { Slot } from "@/components/catalog/parts";
import { CATALOG_PUBLISH_URL, categoryById, HOW_IT_WORKS, PAID_POINTS, PUBLISHER_SLOTS } from "@/lib/data/catalog";

// The publisher half of the former /catalog page (folded 2026-11 into
// /download and this page). Kept here, not deleted: how listing works, the
// open shelves and how a vendor sells a component.
export function Publish() {
  return (
    <div id="publish" className="scroll-mt-28 space-y-12">
      <section>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">How it works</p>
        <h2 className="mb-3 text-2xl font-semibold tracking-tight text-text-primary">Install it once. Every app gets it.</h2>
        <p className="mb-6 max-w-3xl text-text-secondary">
          DisplayXR is the one layer your apps talk to. Add a display, a tracker or a converter to it, and everything
          people run picks it up.
        </p>
        <ol className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {HOW_IT_WORKS.map((s) => (
            <li key={s.n} className="rounded-2xl border border-border bg-surface p-6">
              <span className="font-mono text-xs text-accent">{s.n}</span>
              <h3 className="mb-2 mt-3 text-lg font-semibold text-text-primary">{s.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">Open for publishers</p>
        <h2 className="mb-3 text-2xl font-semibold tracking-tight text-text-primary">Build one component. Reach every spatial display.</h2>
        <p className="mb-6 max-w-3xl text-text-secondary">
          You host the files and keep your customers. Once listed, the DisplayXR Dashboard and the download page send
          people to your release. Listing costs nothing.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PUBLISHER_SLOTS.map((s) => (
            <Slot key={s.title} slot={categoryById(s.category)?.label ?? ""} title={s.title} text={s.text} cta="List yours" href={s.href} />
          ))}
        </div>
        <div className="mt-6">
          <Button href={CATALOG_PUBLISH_URL}>Build and list a component</Button>
        </div>
      </section>

      <section id="paid" className="scroll-mt-28 rounded-2xl border border-border bg-surface p-7">
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary">Selling a component</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-text-secondary">
          Sell your component your way. People install it free, you sell it on your own site, and DisplayXR stays out of
          the transaction.
        </p>
        <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PAID_POINTS.map((p) => (
            <li key={p.title}>
              <h3 className="text-base font-semibold text-text-primary">{p.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
