import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { Band, Eyebrow, H2, Lead, StatusChip, socialMeta } from "@/components/apps/Product";
import { APPS, type AppCard } from "@/lib/data/apps";

export const metadata: Metadata = {
  title: "Apps",
  description:
    "Apps built on DisplayXR: 3D video chat, a social wall of stereo photos, an in-car 3D screen, a stereo monitoring and QC station, and community projects made with the web SDK.",
  ...socialMeta(
    "Apps built on DisplayXR",
    "3D video chat, stereo photos, an in-car 3D screen and a stereo QC station: real apps running on spatial displays through DisplayXR.",
    "/apps",
  ),
};

// The hub shows that the platform works: one card per app, each with a status
// chip that follows public releases. Apps with a product page link there;
// the rest open their live site. Data: lib/data/apps.ts.

function CardMedia({ app }: { app: AppCard }) {
  if (app.image) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={app.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {app.imageNote && (
          <span className="absolute bottom-2.5 left-3 rounded bg-black/55 px-1.5 py-0.5 text-[11px] uppercase tracking-wider text-white/80">
            {app.imageNote}
          </span>
        )}
      </div>
    );
  }
  // No art: a clean gradient with the app's name, never an invented screenshot.
  return (
    <div className={`relative flex aspect-[16/10] items-end overflow-hidden bg-[#0b0c10] p-6 ${app.gradient ?? ""}`}>
      <span className="text-3xl font-display tracking-tight text-white/90 leading-tight">{app.name}</span>
    </div>
  );
}

function AppTile({ app }: { app: AppCard }) {
  const internal = Boolean(app.page);
  const href = app.page ?? app.url;
  const body = (
    <>
      <CardMedia app={app} />
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-xl font-semibold text-text-primary">{app.name}</h3>
          <StatusChip status={app.status} />
        </div>
        {app.byline && <p className="mb-2 text-xs font-medium uppercase tracking-wider text-warning">{app.byline}</p>}
        <p className="mb-4 text-sm leading-relaxed text-text-secondary">{app.tagline}</p>
        <p className="mb-5 font-mono text-xs text-text-secondary">{app.builtOn}</p>
        <span className="mt-auto inline-flex items-center gap-1 text-sm text-accent">
          {internal ? "Learn more →" : (
            <>
              {app.urlLabel} <ArrowUpRight size={14} />
            </>
          )}
        </span>
      </div>
    </>
  );
  const cls = "card-interactive group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface";
  return internal ? (
    <Link href={href} className={cls} data-umami-event="apps-card" data-umami-event-app={app.id}>
      {body}
    </Link>
  ) : (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cls}
      data-umami-event="apps-outbound"
      data-umami-event-app={app.id}
    >
      {body}
    </a>
  );
}

export default function AppsPage() {
  return (
    <div className="bg-[#050507]">
      <section className="relative overflow-hidden px-6 md:px-12 pt-28 pb-12 md:pt-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_500px_at_75%_20%,rgba(59,130,246,0.18),rgba(5,5,7,0)_60%)]"
        />
        <div className="relative mx-auto max-w-[1200px]">
          <Eyebrow>Apps</Eyebrow>
          <h1 className="mb-6 max-w-3xl text-5xl md:text-6xl font-display tracking-tight text-white leading-[1.04]">
            Built on DisplayXR.
          </h1>
          <Lead className="text-white/80">
            Real apps running on spatial displays today: on the web through the DisplayXR Browser, and
            natively on the DisplayXR runtime. Each one is something you can open or install now.
          </Lead>
        </div>
      </section>

      <Band className="pt-8 md:pt-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {APPS.map((app, i) => (
            <AnimateIn key={app.id} delay={i * 60}>
              <AppTile app={app} />
            </AnimateIn>
          ))}
        </div>
        <p className="mt-6 text-sm text-text-secondary">
          Images marked &ldquo;Illustration&rdquo; are concept art, not screenshots. Web apps open in any
          browser; on a spatial display, open them in the DisplayXR Browser to see depth.
        </p>
      </Band>

      <Band className="bg-[#0b0c10]">
        <AnimateIn>
          <Eyebrow>Make your own</Eyebrow>
          <H2>Every app here started the same way.</H2>
          <Lead className="mb-8">
            The web apps use the DisplayXR web SDK, a few lines of JavaScript that show 3D in the
            DisplayXR Browser and 2D everywhere else. The native ones use OpenXR with the DisplayXR
            extensions.
          </Lead>
          <div className="flex flex-wrap gap-3">
            <Button href="/browser#build">Build for the web</Button>
            <Button variant="secondary" href="/developers">Developers</Button>
            <Button variant="secondary" href="/demos">Native demos</Button>
          </div>
        </AnimateIn>
      </Band>
    </div>
  );
}
