import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, isAllowed } from "@/lib/auth";
import { bufferConfigured } from "@/lib/social/buffer";
import { listPackages, seedMode, storeConfigured } from "@/lib/social/store";
import { syncFromBuffer } from "@/lib/social/sync";
import { formatPacific, weekKey } from "@/lib/social/time";
import { CHANNEL_LABEL, type Channel, type Package } from "@/lib/social/types";
import { Banner, SocialNav, StatusPill } from "./ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Social queue · Admin", robots: { index: false, follow: false } };

const FILTERS = {
  all: { label: "All", test: () => true },
  review: { label: "Needs review", test: (p: Package) => p.status === "needs_review" || p.status === "changes_requested" },
  scheduled: { label: "Scheduled", test: (p: Package) => p.status === "scheduled" || p.status === "approved" },
  hand: {
    label: "By hand",
    test: (p: Package) =>
      (Object.entries(p.channels) as [Channel, { mode: string }][]).some(([ch, c]) => c.mode === "manual" && !p.posted[ch]) &&
      p.status !== "dropped",
  },
  posted: { label: "Posted", test: (p: Package) => p.status === "posted" },
} as const;
type FilterKey = keyof typeof FILTERS;

export default async function SocialQueue({ searchParams }: { searchParams: Promise<{ f?: string; err?: string }> }) {
  const session = await auth();
  if (!isAllowed(session?.user?.login)) redirect("/admin/signin");
  const sp = await searchParams;
  const f: FilterKey = (sp.f && sp.f in FILTERS ? sp.f : "all") as FilterKey;

  let packages: Package[] = [];
  let loadErr: string | null = null;
  try {
    packages = await Promise.all((await listPackages()).map(syncFromBuffer));
  } catch (e) {
    loadErr = (e as Error).message;
  }
  packages.sort((a, b) => a.publish_at.localeCompare(b.publish_at));

  const counts = Object.fromEntries(
    (Object.keys(FILTERS) as FilterKey[]).map((k) => [k, packages.filter(FILTERS[k].test).length]),
  ) as Record<FilterKey, number>;
  const shown = packages.filter(FILTERS[f].test);
  const weeks = new Map<string, Package[]>();
  for (const p of shown) {
    const k = weekKey(p.publish_at);
    weeks.set(k, [...(weeks.get(k) ?? []), p]);
  }

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-12">
      <SocialNav active="queue" />
      <h1 className="text-3xl font-semibold text-text-primary mb-2">Social queue</h1>
      <p className="text-text-secondary mb-8 max-w-2xl">
        Posts the planner has built for the DisplayXR channels. Nothing goes out until you approve it here, one post at a time.
      </p>

      {seedMode() && <Banner tone="info">Seed mode: three fake posts, kept in memory. Nothing is stored and nothing is sent to Buffer.</Banner>}
      {!seedMode() && !storeConfigured() && <Banner tone="err">The Blob store is not connected (BLOB_READ_WRITE_TOKEN is missing).</Banner>}
      {!bufferConfigured() && !seedMode() && <Banner tone="warn">Buffer: not connected. Posts can be reviewed and edited, not scheduled.</Banner>}
      {(sp.err || loadErr) && <Banner tone="err">{sp.err ?? loadErr}</Banner>}

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {(Object.keys(FILTERS) as FilterKey[]).map((k) => (
          <Link
            key={k}
            href={k === "all" ? "/admin/social" : `/admin/social?f=${k}`}
            aria-current={k === f ? "page" : undefined}
            className={`rounded-lg border px-4 py-3 transition-colors ${k === f ? "border-accent bg-surface" : "border-border bg-surface hover:bg-surface-hover"}`}
          >
            <div className="text-2xl font-semibold tabular-nums text-text-primary">{counts[k]}</div>
            <div className="text-xs uppercase tracking-wide text-text-secondary">{FILTERS[k].label}</div>
          </Link>
        ))}
      </div>

      {shown.length === 0 && !loadErr && (
        <p className="text-text-secondary">No posts here yet. The planner uploads them with its token; see How it works.</p>
      )}

      {[...weeks.entries()].map(([week, items]) => (
        <section key={week} className="mb-10">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-text-secondary">
            Week of {formatPacific(`${week}T20:00:00Z`, { weekday: undefined, hour: undefined, minute: undefined }).replace(" PT", "")}
          </h2>
          <ul className="grid gap-3">
            {items.map((p) => {
              const poster = Object.values(p.media)[0]?.poster_url;
              const chans = Object.keys(p.channels) as Channel[];
              return (
                <li key={p.id}>
                  <Link
                    href={`/admin/social/${p.id}`}
                    className="flex gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:bg-surface-hover"
                  >
                    {poster ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={poster} alt="" className="h-20 w-36 shrink-0 rounded-md object-cover bg-black" />
                    ) : (
                      <div className="h-20 w-36 shrink-0 rounded-md bg-black" aria-hidden="true" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-text-primary">{p.title}</span>
                        <StatusPill status={p.status} />
                        {p.checks?.some((c) => c.result === "fail") && <span className="text-xs text-red-400">check failed</span>}
                      </div>
                      <div className="mt-1 text-sm text-text-secondary">{formatPacific(p.publish_at)}</div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {chans.map((ch) => (
                          <span
                            key={ch}
                            className={`rounded border px-1.5 py-0.5 text-[11px] ${p.posted[ch] ? "border-success/40 text-success" : p.channels[ch]!.mode === "manual" ? "border-dashed border-border text-text-secondary" : "border-border text-text-secondary"}`}
                          >
                            {CHANNEL_LABEL[ch]}
                            {p.channels[ch]!.mode === "manual" ? " · by hand" : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </main>
  );
}
