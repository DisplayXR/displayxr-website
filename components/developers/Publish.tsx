import { Button } from "@/components/ui/Button";
import { HOW_IT_WORKS, PAID_POINTS, PUBLISH_URL, PUBLISHER_SLOTS } from "@/lib/data/publish";

/** A dashed, hatched card: a shelf a publisher could fill. */
function Slot({ kind, title, text, href }: { kind: string; title: string; text: string; href: string }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="publish-slot flex min-h-[170px] flex-col gap-2 rounded-xl border border-dashed border-accent/40 p-6 transition-colors hover:border-accent"
    >
      <span className="font-mono text-xs text-text-secondary">{kind}</span>
      <span className="font-display text-2xl leading-[1.15] text-text-primary">{title}</span>
      <span className="text-sm leading-relaxed text-text-secondary">{text}</span>
      <span className="mt-auto pt-1 text-sm font-medium text-accent">List yours {external ? "↗" : "→"}</span>
    </a>
  );
}

// Publisher content (how listing works, open shelves, selling a component),
// kept when the Catalog page was erased on 2026-11-28.
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
            <Slot key={s.title} kind={s.kind} title={s.title} text={s.text} href={s.href} />
          ))}
        </div>
        <div className="mt-6">
          <Button href={PUBLISH_URL}>Build and list a component</Button>
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
