import { auth, signOut } from "@/lib/auth";
import { getOrgDashboard } from "@/lib/github";
import { getAnalytics, type MetricItem } from "@/lib/umami";
import { GitHubIcon } from "@/components/ui/GitHubIcon";

// Live dashboard — fetched per request with 5-min ISR on the upstream calls.
export const revalidate = 300;

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-surface border border-border rounded-lg px-5 py-4">
      <div className="text-2xl font-semibold text-text-primary tabular-nums">
        {value}
      </div>
      <div className="text-xs uppercase tracking-wide text-text-secondary mt-1">
        {label}
      </div>
    </div>
  );
}

function nfmt(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

function timeAgo(iso: string | null): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  return `${months}mo ago`;
}

function prettyHost(referrer: string | null): string {
  if (!referrer) return "Direct / none";
  return referrer;
}

function MetricList({
  title,
  items,
  format = (x) => x ?? "—",
}: {
  title: string;
  items: MetricItem[];
  format?: (x: string | null) => string;
}) {
  const max = Math.max(1, ...items.map((i) => i.y));
  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-3">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-text-secondary">No data yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-text-secondary truncate">
                  {format(item.x)}
                </span>
                <span className="text-text-primary tabular-nums shrink-0">
                  {nfmt(item.y)}
                </span>
              </div>
              <div className="mt-1 h-1 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-accent/60"
                  style={{ width: `${(item.y / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SectionNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-warning bg-warning/10 border border-warning/30 rounded-md px-4 py-2">
      {children}
    </p>
  );
}

export default async function AdminPage() {
  const session = await auth();
  const [gh, analytics] = await Promise.all([
    getOrgDashboard(),
    getAnalytics(30),
  ]);

  const bounceRate =
    analytics.visits > 0
      ? Math.round((analytics.bounces / analytics.visits) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-10">
      {/* Admin bar */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-display tracking-tight text-text-primary">
            Admin
          </h1>
          <p className="text-sm text-text-secondary">
            Site analytics &amp; DisplayXR org activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          {session?.user?.avatarUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.avatarUrl}
              alt=""
              className="h-8 w-8 rounded-full border border-border"
            />
          )}
          <span className="text-sm text-text-secondary hidden sm:inline">
            {session?.user?.login}
          </span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/signin" });
            }}
          >
            <button
              type="submit"
              className="text-sm text-text-secondary hover:text-text-primary border border-border rounded-md px-3 py-1.5 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      {/* ── Analytics ─────────────────────────────────────────────── */}
      <section className="mb-14">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Site analytics{" "}
          <span className="text-text-secondary font-normal text-sm">
            · last {analytics.rangeDays} days
          </span>
        </h2>
        {analytics.error ? (
          <SectionNote>Analytics unavailable — {analytics.error}</SectionNote>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <StatTile label="Visitors" value={nfmt(analytics.visitors)} />
              <StatTile label="Page views" value={nfmt(analytics.pageviews)} />
              <StatTile label="Visits" value={nfmt(analytics.visits)} />
              <StatTile label="Bounce rate" value={`${bounceRate}%`} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricList title="Top pages" items={analytics.topPages} />
              <MetricList
                title="Top referrers"
                items={analytics.topReferrers}
                format={prettyHost}
              />
              <MetricList title="Top countries" items={analytics.topCountries} />
            </div>
          </>
        )}
      </section>

      {/* ── GitHub org ────────────────────────────────────────────── */}
      <section>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-text-primary mb-4">
          <GitHubIcon className="h-5 w-5" /> DisplayXR org
        </h2>
        {gh.error ? (
          <SectionNote>GitHub data unavailable — {gh.error}</SectionNote>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <StatTile label="Repos" value={gh.totals.repos} />
              <StatTile label="Stars" value={nfmt(gh.totals.stars)} />
              <StatTile label="Forks" value={nfmt(gh.totals.forks)} />
              <StatTile label="Open PRs" value={gh.totals.openPRs} />
              <StatTile label="Releases" value={gh.totals.releases} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              {/* Recent releases */}
              <div className="bg-surface border border-border rounded-lg p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-3">
                  Latest releases
                </h3>
                <ul className="space-y-3">
                  {gh.recentReleases.map((r, i) => (
                    <li key={i} className="text-sm">
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline font-medium"
                      >
                        {r.repo} {r.tagName}
                      </a>
                      {r.isPrerelease && (
                        <span className="ml-2 text-xs text-warning">pre</span>
                      )}
                      <div className="text-text-secondary text-xs">
                        {timeAgo(r.publishedAt)}
                      </div>
                    </li>
                  ))}
                  {gh.recentReleases.length === 0 && (
                    <li className="text-sm text-text-secondary">No releases.</li>
                  )}
                </ul>
              </div>

              {/* Recent commits */}
              <div className="bg-surface border border-border rounded-lg p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-3">
                  Recent commits
                </h3>
                <ul className="space-y-3">
                  {gh.recentCommits.map((c, i) => (
                    <li key={i} className="text-sm">
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-primary hover:text-accent line-clamp-1"
                      >
                        {c.messageHeadline}
                      </a>
                      <div className="text-text-secondary text-xs">
                        {c.repo} · {c.author ?? "unknown"} ·{" "}
                        {timeAgo(c.committedDate)}
                      </div>
                    </li>
                  ))}
                  {gh.recentCommits.length === 0 && (
                    <li className="text-sm text-text-secondary">No commits.</li>
                  )}
                </ul>
              </div>

              {/* Open PRs */}
              <div className="bg-surface border border-border rounded-lg p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-3">
                  Open pull requests
                </h3>
                <ul className="space-y-3">
                  {gh.openPRList.map((p, i) => (
                    <li key={i} className="text-sm">
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-primary hover:text-accent line-clamp-1"
                      >
                        {p.title}
                      </a>
                      <div className="text-text-secondary text-xs">
                        {p.repo} · {p.author ?? "unknown"} ·{" "}
                        {timeAgo(p.createdAt)}
                      </div>
                    </li>
                  ))}
                  {gh.openPRList.length === 0 && (
                    <li className="text-sm text-text-secondary">
                      No open PRs.
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Per-repo table */}
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface border-b border-border text-left">
                    <th className="px-4 py-3 font-semibold text-text-primary">
                      Repository
                    </th>
                    <th className="px-4 py-3 font-semibold text-text-primary tabular-nums">
                      Stars
                    </th>
                    <th className="px-4 py-3 font-semibold text-text-primary tabular-nums">
                      Forks
                    </th>
                    <th className="px-4 py-3 font-semibold text-text-primary tabular-nums">
                      Open PRs
                    </th>
                    <th className="px-4 py-3 font-semibold text-text-primary tabular-nums">
                      Releases
                    </th>
                    <th className="px-4 py-3 font-semibold text-text-primary">
                      Last push
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {gh.repos.map((r) => (
                    <tr key={r.name} className="table-row-interactive">
                      <td className="px-4 py-3">
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-primary hover:text-accent font-medium"
                        >
                          {r.name}
                        </a>
                        {r.archived && (
                          <span className="ml-2 text-xs text-text-secondary">
                            archived
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-text-secondary tabular-nums">
                        {nfmt(r.stars)}
                      </td>
                      <td className="px-4 py-3 text-text-secondary tabular-nums">
                        {nfmt(r.forks)}
                      </td>
                      <td className="px-4 py-3 text-text-secondary tabular-nums">
                        {r.openPRs}
                      </td>
                      <td className="px-4 py-3 text-text-secondary tabular-nums">
                        {r.totalReleases}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {timeAgo(r.pushedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
