import "server-only";
import { blueskyConfigured, blueskySession, createPost, deletePost, postUrl, uploadVideo, type StrongRef } from "./bluesky";
import { savePackage } from "./store";
import type { Channel, DirectState, Package } from "./types";

// The cron's job: post the direct channels (Bluesky) of every scheduled
// package whose time has come. Each step is saved before the next, so the
// state on the board is always what Bluesky has.

const VIDEO_WAIT_MS = 120_000;

function allOut(p: Package): boolean {
  return (Object.keys(p.channels) as Channel[]).every((ch) => p.posted[ch]);
}

async function save(p: Package, action: string, note?: string): Promise<Package> {
  return savePackage(p, { at: new Date().toISOString(), by: "bluesky", action, note });
}

function withState(p: Package, ch: Channel, st: DirectState, err?: string): Package {
  const errors = { ...(p.buffer.errors ?? {}) };
  if (err) errors[ch] = err;
  else delete errors[ch];
  return { ...p, direct: { ...(p.direct ?? {}), [ch]: st }, buffer: { ...p.buffer, errors } };
}

export async function postDueBluesky(p0: Package): Promise<Package> {
  let p = p0;
  const ch: Channel = "bluesky";
  const st = p.direct?.[ch];
  const c = p.channels[ch];
  if (!c || !st || p.status !== "scheduled") return p;
  if (st.state !== "pending" && st.state !== "processing") return p;
  if (Date.parse(p.publish_at) > Date.now()) return p;
  if (!blueskyConfigured()) {
    return save(withState(p, ch, { ...st, state: "error", error: "not connected" }, "Bluesky is not connected"), "Bluesky failed: not connected");
  }

  try {
    const s = await blueskySession();
    const m = c.media ? p.media[c.media] : undefined;
    let video;
    if (m) {
      const step = await uploadVideo(s, { url: m.url, name: m.file, jobId: st.video_job }, VIDEO_WAIT_MS);
      if (step.state === "processing") {
        if (st.video_job !== step.jobId) p = await save(withState(p, ch, { state: "processing", video_job: step.jobId }), "Bluesky video uploading");
        return p; // the next cron run picks it up
      }
      video = step.blob;
    }

    // From here on a retry could double-post, so mark it first.
    p = await save(withState(p, ch, { state: "posting", video_job: st.video_job, at: new Date().toISOString() }), "posting to Bluesky");
    const first = await createPost(s, { text: c.text, video, aspect: m?.aspect });
    let parent: StrongRef = first;
    const reply_uris: string[] = [];
    for (const t of (c.reply_texts ?? []).filter((x) => x.trim())) {
      parent = await createPost(s, { text: t, reply: { root: first, parent } });
      reply_uris.push(parent.uri);
    }
    const url = postUrl(s.handle, first.uri);
    const posted = { ...p.posted, [ch]: { at: new Date().toISOString(), url, by: "bluesky" } };
    const next: Package = withState({ ...p, posted }, ch, { state: "posted", uri: first.uri, reply_uris, at: new Date().toISOString() });
    return save({ ...next, status: allOut(next) ? "posted" : next.status }, "posted on Bluesky", url);
  } catch (e) {
    const msg = (e as Error).message;
    const cur = p.direct?.[ch];
    // A failure after "posting" may or may not have left a post: never retry.
    const note = cur?.state === "posting" ? `${msg} (check Bluesky before retrying: a post may exist)` : msg;
    return save(withState(p, ch, { ...(cur ?? st), state: "error", error: note }, note), "Bluesky failed", note);
  }
}

// Take a direct post back down: replies first (newest first), then the post.
// The package keeps its history; the channel reads "removed" and is no longer
// counted as posted, and the cron never posts a removed channel again.
export async function removeBluesky(p: Package, by: string): Promise<Package> {
  const ch: Channel = "bluesky";
  const st = p.direct?.[ch];
  if (!st || st.state !== "posted" || !st.uri) throw new Error("nothing posted on Bluesky to remove");
  const s = await blueskySession();
  for (const uri of [...(st.reply_uris ?? [])].reverse()) await deletePost(s, uri);
  await deletePost(s, st.uri);
  const posted = { ...p.posted };
  delete posted[ch];
  const next: Package = {
    ...p,
    posted,
    status: p.status === "posted" ? "dropped" : p.status,
    direct: { ...(p.direct ?? {}), [ch]: { state: "removed", at: new Date().toISOString() } },
  };
  return savePackage(next, { at: new Date().toISOString(), by, action: "removed from Bluesky", note: st.uri });
}
