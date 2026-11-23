import "server-only";
import { bufferConfigured, getPostStatus } from "./buffer";
import { getPackage, savePackage, seedMode } from "./store";
import type { Channel, Package } from "./types";

// Ask Buffer what happened to a scheduled post's channels and move the package
// to "posted" once every channel is out. Runs when a board page loads, only for
// packages whose time has come, so a quiet week makes no Buffer calls.
export async function syncFromBuffer(p: Package): Promise<Package> {
  if (seedMode() || !bufferConfigured()) return p;
  if (p.status !== "scheduled" || Date.parse(p.publish_at) > Date.now()) return p;

  const posted = { ...p.posted };
  const errors = { ...(p.buffer.errors ?? {}) };
  let changed = false;
  for (const [ch, id] of Object.entries(p.buffer.post_ids) as [Channel, string][]) {
    if (posted[ch]) continue;
    try {
      const s = await getPostStatus(id);
      const st = s.status?.toLowerCase();
      if (st === "sent") {
        posted[ch] = { at: new Date().toISOString(), url: s.externalLink ?? undefined, by: "buffer" };
        changed = true;
      } else if (st === "error") {
        if (errors[ch] !== "Buffer reported an error sending this post") {
          errors[ch] = "Buffer reported an error sending this post";
          changed = true;
        }
      }
    } catch {
      // A failed status read is not news; try again on the next page load.
    }
  }
  if (!changed) return p;

  // Re-read the newest version and apply only Buffer's channels to it: the
  // cron may have written a newer one (e.g. a Bluesky post) since `p` was read,
  // and saving over it would lose that and could make the cron post twice.
  const fresh = (await getPackage(p.id)) ?? p;
  const bufferChannels = Object.keys(p.buffer.post_ids) as Channel[];
  const mergedPosted = { ...fresh.posted };
  const mergedErrors = { ...(fresh.buffer.errors ?? {}) };
  for (const ch of bufferChannels) {
    if (posted[ch]) mergedPosted[ch] = posted[ch];
    if (errors[ch]) mergedErrors[ch] = errors[ch];
  }
  const allOut = (Object.keys(fresh.channels) as Channel[]).every((ch) => mergedPosted[ch]);
  const next: Package = {
    ...fresh,
    posted: mergedPosted,
    buffer: { ...fresh.buffer, errors: mergedErrors },
    status: allOut ? "posted" : fresh.status,
  };
  return savePackage(next, {
    at: new Date().toISOString(),
    by: "buffer",
    action: allOut ? "posted (all channels)" : "status update from Buffer",
  });
}
