import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth, isAllowed } from "@/lib/auth";
import { bufferConfigured } from "@/lib/social/buffer";
import { getPackage, seedMode } from "@/lib/social/store";
import { syncFromBuffer } from "@/lib/social/sync";
import { formatPacific, isoToPacificLocal } from "@/lib/social/time";
import { CHANNEL_LABEL, type Channel } from "@/lib/social/types";
import { approveAndSchedule, dropPost, markPosted, requestChanges, saveEdits } from "../actions";
import { Banner, CheckBadge, SocialNav, StatusPill } from "../ui";
import { CaptionField, CopyButton } from "./client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Review post · Admin", robots: { index: false, follow: false } };

const EDITABLE = new Set(["drafted", "needs_review", "changes_requested", "approved"]);

export default async function ReviewPost({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ msg?: string; err?: string }>;
}) {
  const session = await auth();
  if (!isAllowed(session?.user?.login)) redirect("/admin/signin");
  const { id } = await params;
  const sp = await searchParams;
  const loaded = await getPackage(id);
  if (!loaded) notFound();
  const p = await syncFromBuffer(loaded);

  const editable = EDITABLE.has(p.status);
  const canApprove = ["needs_review", "changes_requested", "approved"].includes(p.status);
  const failedCheck = p.checks?.some((c) => c.result === "fail");
  const media = Object.entries(p.media);
  const chans = Object.keys(p.channels) as Channel[];
  const btn = "rounded-md px-4 py-2 text-sm font-medium";

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-12">
      <SocialNav active="queue" />
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold text-text-primary">{p.title}</h1>
        <StatusPill status={p.status} />
      </div>
      <p className="mb-8 text-text-secondary">
        {formatPacific(p.publish_at)} · <span className="font-mono text-xs">{p.id}</span>
      </p>

      {seedMode() && <Banner tone="info">Seed mode: edits stay in memory and approvals never reach Buffer.</Banner>}
      {!bufferConfigured() && !seedMode() && <Banner tone="warn">Buffer: not connected. You can edit; approval is off until the key is set.</Banner>}
      {sp.msg && <Banner tone="ok">{sp.msg}</Banner>}
      {sp.err && <Banner tone="err">{sp.err}</Banner>}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Left: the video, clips, checks, history */}
        <div className="space-y-8">
          {media.map(([key, m]) => (
            <figure key={key}>
              <video
                src={m.url}
                poster={m.poster_url}
                controls
                preload="metadata"
                className={`w-full rounded-lg border border-border bg-black ${key.includes("9x16") ? "mx-auto max-h-[520px] w-auto" : ""}`}
              />
              <figcaption className="mt-1 text-xs text-text-secondary">
                {key}{m.duration_s ? ` · ${m.duration_s} s` : ""}
              </figcaption>
            </figure>
          ))}

          {p.clips && p.clips.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-medium uppercase tracking-wider text-text-secondary">Clips used</h2>
              <ul className="space-y-1 text-sm">
                {p.clips.map((c, i) => (
                  <li key={i} className="text-text-primary">
                    <span className="font-mono text-xs">{c.id}</span>
                    {c.range && <span className="text-text-secondary"> · {c.range}</span>}
                    {c.note && <span className="text-text-secondary"> · {c.note}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 className="mb-2 text-sm font-medium uppercase tracking-wider text-text-secondary">Checks</h2>
            {p.checks && p.checks.length > 0 ? (
              <ul className="space-y-1">{p.checks.map((c, i) => <CheckBadge key={i} c={c} />)}</ul>
            ) : (
              <p className="text-sm text-text-secondary">No checks reported.</p>
            )}
          </section>

          <section>
            <h2 className="mb-2 text-sm font-medium uppercase tracking-wider text-text-secondary">History</h2>
            <ol className="space-y-2 text-sm">
              {[...p.history].reverse().map((h, i) => (
                <li key={i} className="border-l border-border pl-3">
                  <div className="text-text-primary">{h.action}</div>
                  <div className="text-xs text-text-secondary">
                    {h.by} · {formatPacific(h.at)}
                  </div>
                  {h.note && <div className="mt-0.5 text-text-secondary">“{h.note}”</div>}
                  {h.diff?.map((d, j) => (
                    <details key={j} className="mt-1 text-xs text-text-secondary">
                      <summary>{d.channel} {d.field} changed</summary>
                      <div className="mt-1 whitespace-pre-wrap"><span className="text-red-400">− </span>{d.from}</div>
                      <div className="whitespace-pre-wrap"><span className="text-success">+ </span>{d.to}</div>
                    </details>
                  ))}
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Right: captions and actions, in one form */}
        <div>
          <form className="space-y-6">
            <input type="hidden" name="id" value={p.id} />
            <div>
              <label htmlFor="publish_local" className="mb-1 block text-sm font-medium text-text-primary">
                Publish time (Pacific)
              </label>
              <input
                id="publish_local"
                type="datetime-local"
                name="publish_local"
                defaultValue={isoToPacificLocal(p.publish_at)}
                readOnly={!editable}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
              />
            </div>

            {chans.map((ch) => {
              const c = p.channels[ch]!;
              const done = p.posted[ch];
              const err = p.buffer.errors?.[ch];
              return (
                <fieldset key={ch} className="rounded-xl border border-border bg-surface p-4">
                  <legend className="px-1 text-sm font-medium text-text-primary">
                    {CHANNEL_LABEL[ch]}
                    <span className="ml-2 text-xs font-normal text-text-secondary">
                      {c.mode === "manual" ? "by hand" : "via Buffer"}
                      {c.media ? ` · ${c.media}` : ""}
                    </span>
                  </legend>
                  {c.title !== undefined && (
                    <div className="mb-2">
                      <CaptionField channel={ch} name={`title__${ch}`} defaultValue={c.title} kind="title" readOnly={!editable} />
                    </div>
                  )}
                  <CaptionField channel={ch} name={`text__${ch}`} defaultValue={c.text} kind="text" readOnly={!editable} rows={ch === "linkedin" || ch === "reddit" ? 8 : 4} />
                  {c.reply_texts && c.reply_texts.length > 0 && (
                    <p className="mt-2 text-xs text-text-secondary">
                      + {c.reply_texts.length} reply post(s), posted by hand after the first goes out.
                    </p>
                  )}
                  {p.buffer.post_ids[ch] && !done && <p className="mt-2 text-xs text-accent-hover">Scheduled in Buffer</p>}
                  {done && (
                    <p className="mt-2 text-xs text-success">
                      Posted {formatPacific(done.at)}
                      {done.url && <> · <a href={done.url} target="_blank" rel="noopener noreferrer" className="underline">open</a></>}
                    </p>
                  )}
                  {err && <p className="mt-2 text-xs text-red-400">{err}</p>}
                  {c.mode === "manual" && !done && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <CopyButton text={c.title ? `${c.title}\n\n${c.text}` : c.text} />
                    </div>
                  )}
                </fieldset>
              );
            })}

            <div className="rounded-xl border border-border p-4">
              <label htmlFor="note" className="mb-1 block text-sm font-medium text-text-primary">
                Note to the planner (for “Ask for changes” or “Drop”)
              </label>
              <textarea id="note" name="note" rows={2} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary" />
            </div>

            <div className="flex flex-wrap gap-3">
              {canApprove && (
                <button
                  formAction={approveAndSchedule}
                  disabled={!!failedCheck || (!bufferConfigured() && !seedMode())}
                  className={`${btn} bg-accent text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  Approve and schedule
                </button>
              )}
              {editable && (
                <button formAction={saveEdits} className={`${btn} border border-border text-text-primary hover:bg-surface-hover`}>
                  Save edits
                </button>
              )}
              {editable && (
                <button formAction={requestChanges} className={`${btn} border border-border text-text-primary hover:bg-surface-hover`}>
                  Ask for changes
                </button>
              )}
              {p.status !== "posted" && p.status !== "dropped" && p.status !== "scheduled" && (
                <button formAction={dropPost} className={`${btn} text-red-300 hover:bg-red-500/10`}>
                  Drop
                </button>
              )}
            </div>
            {failedCheck && <p className="text-sm text-red-400">A check failed, so this post can&apos;t be approved. Fix it in the planner.</p>}
            {canApprove && (
              <p className="text-xs text-text-secondary">
                Approving schedules this one post in Buffer for every “via Buffer” channel, with the captions and time shown here. By-hand channels are posted by you. YouTube Shorts needs a title (up to 100 characters) and goes out public.
              </p>
            )}
          </form>

          {/* "Mark posted" for by-hand channels, one small form each (forms can't nest). */}
          {chans
            .filter((ch) => p.channels[ch]!.mode === "manual" && !p.posted[ch] && ["approved", "scheduled", "posted"].includes(p.status))
            .map((ch) => (
              <form key={ch} action={markPosted} className="mt-4 flex flex-wrap items-end gap-2 rounded-xl border border-dashed border-border p-4">
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="channel" value={ch} />
                <div className="min-w-[240px] flex-1">
                  <label htmlFor={`url-${ch}`} className="mb-1 block text-sm text-text-primary">
                    {CHANNEL_LABEL[ch]}: link to the post
                  </label>
                  <input id={`url-${ch}`} name="url" type="url" placeholder="https://" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary" />
                </div>
                <button className={`${btn} border border-border text-text-primary hover:bg-surface-hover`}>Mark posted</button>
              </form>
            ))}

          <p className="mt-8 text-sm">
            <Link href="/admin/social" className="text-text-secondary hover:text-text-primary">← Back to the queue</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
