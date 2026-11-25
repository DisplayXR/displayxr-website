"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth, isAllowed } from "@/lib/auth";
import { bufferChannels, bufferConfigured, createScheduledPost } from "@/lib/social/buffer";
import { blueskyConfigured, graphemes } from "@/lib/social/bluesky";
import { removeBluesky } from "@/lib/social/direct";
import { getPackage, savePackage, seedMode } from "@/lib/social/store";
import { pacificLocalToIso } from "@/lib/social/time";
import { DIRECT, type Channel, type HistoryEntry, type Package } from "@/lib/social/types";

// Every action re-checks the allowlist itself: middleware guards the pages, but
// a server action is a POST that can be called directly.
async function requireLogin(): Promise<string> {
  const session = await auth();
  const login = session?.user?.login;
  if (!isAllowed(login)) redirect("/admin/signin");
  return login as string;
}

function back(id: string, kind: "msg" | "err", text: string): never {
  revalidatePath("/admin/social");
  revalidatePath(`/admin/social/${id}`);
  redirect(`/admin/social/${id}?${kind}=${encodeURIComponent(text)}`);
}

const EDITABLE = new Set(["drafted", "needs_review", "changes_requested", "approved"]);

// Fold the form's caption and time fields into the package; returns the diff.
function applyEdits(p: Package, form: FormData): { next: Package; diff: NonNullable<HistoryEntry["diff"]> } {
  const diff: NonNullable<HistoryEntry["diff"]> = [];
  const channels = structuredClone(p.channels);
  for (const ch of Object.keys(channels) as Channel[]) {
    const c = channels[ch]!;
    const text = form.get(`text__${ch}`);
    if (typeof text === "string" && text !== c.text) {
      diff.push({ channel: ch, field: "text", from: c.text, to: text });
      c.text = text;
    }
    const title = form.get(`title__${ch}`);
    if (typeof title === "string" && c.title !== undefined && title !== c.title) {
      diff.push({ channel: ch, field: "title", from: c.title, to: title });
      c.title = title;
    }
  }
  let publish_at = p.publish_at;
  const local = form.get("publish_local");
  if (typeof local === "string" && local) {
    const iso = pacificLocalToIso(local);
    if (iso && iso !== p.publish_at) {
      diff.push({ channel: "all", field: "publish_at", from: p.publish_at, to: iso });
      publish_at = iso;
    }
  }
  return { next: { ...p, channels, publish_at }, diff };
}

async function load(form: FormData): Promise<{ login: string; p: Package }> {
  const login = await requireLogin();
  const id = String(form.get("id") ?? "");
  const p = await getPackage(id);
  if (!p) redirect("/admin/social?err=" + encodeURIComponent("Post not found"));
  return { login, p };
}

export async function saveEdits(form: FormData) {
  const { login, p } = await load(form);
  if (!EDITABLE.has(p.status)) back(p.id, "err", `A ${p.status} post can't be edited here`);
  const { next, diff } = applyEdits(p, form);
  if (diff.length === 0) back(p.id, "msg", "No changes");
  await savePackage(next, { at: new Date().toISOString(), by: login, action: "edited", diff });
  back(p.id, "msg", "Saved");
}

// One click = David's go for this one post (D3). Never called in bulk, never
// automatically: only from the Approve button on a single post's page.
export async function approveAndSchedule(form: FormData) {
  const { login, p } = await load(form);
  if (!["needs_review", "changes_requested", "approved"].includes(p.status))
    back(p.id, "err", `A ${p.status} post can't be approved`);
  if (p.checks?.some((c) => c.result === "fail")) back(p.id, "err", "A check failed; fix it in the planner first");

  const { next: edited, diff } = applyEdits(p, form);
  if (Date.parse(edited.publish_at) < Date.now() + 5 * 60_000)
    back(p.id, "err", "The publish time must be at least 5 minutes from now");

  const yt = edited.channels.youtube_shorts;
  if (yt?.mode === "buffer") {
    const t = (yt.title ?? "").trim();
    if (!t) back(p.id, "err", "YouTube Shorts needs a title before it can be scheduled");
    if ([...t].length > 100) back(p.id, "err", "The YouTube Shorts title is over 100 characters");
    const m = yt.media ? edited.media[yt.media] : undefined;
    if (!m) back(p.id, "err", "YouTube Shorts needs a vertical video");
    if (m.aspect !== "9:16")
      back(p.id, "err", `YouTube Shorts takes only vertical (9:16) video; "${yt.media}" is ${m.aspect ?? "not marked with an aspect"}`);
  }

  // Scheduled channels split two ways: Bluesky is posted by the site's cron
  // (it is not in Buffer); the rest go to Buffer now.
  const scheduledChans = (Object.entries(edited.channels) as [Channel, NonNullable<Package["channels"][Channel]>][])
    .filter(([, c]) => c.mode === "buffer");
  const bufferTargets = scheduledChans.filter(([ch]) => !DIRECT.includes(ch));
  const directTargets = scheduledChans.filter(([ch]) => DIRECT.includes(ch));

  const bsky = edited.channels.bluesky;
  if (bsky?.mode === "buffer") {
    if (!blueskyConfigured()) back(p.id, "err", "Bluesky is not connected (BLUESKY_HANDLE / BLUESKY_APP_PASSWORD)");
    // Without the cron secret the cron gets a 401 and the post would wait forever.
    if (!process.env.CRON_SECRET) back(p.id, "err", "The posting job is not set up (CRON_SECRET), so Bluesky can't be scheduled");
    for (const t of [bsky.text, ...(bsky.reply_texts ?? [])])
      if (graphemes(t) > 300) back(p.id, "err", "A Bluesky post is over 300 characters");
  }

  const now = new Date().toISOString();
  if (seedMode()) {
    await savePackage(
      { ...edited, status: "scheduled" },
      { at: now, by: login, action: "approved and scheduled (seed mode: nothing sent to Buffer)", diff: diff.length ? diff : undefined },
    );
    back(p.id, "msg", "Seed mode: marked scheduled, nothing sent");
  }
  if (bufferTargets.length > 0 && !bufferConfigured()) back(p.id, "err", "Buffer is not connected");

  const post_ids = { ...edited.buffer.post_ids };
  const errors: Partial<Record<Channel, string>> = {};
  if (bufferTargets.length > 0) {
    let map: Partial<Record<Channel, string>> = {};
    try {
      map = await bufferChannels();
    } catch (e) {
      back(p.id, "err", (e as Error).message);
    }
    for (const [ch, c] of bufferTargets) {
      if (post_ids[ch]) continue; // already scheduled on an earlier attempt
      const channelId = map[ch];
      if (!channelId) { errors[ch] = "No connected Buffer channel for this network"; continue; }
      const m = c.media ? edited.media[c.media] : undefined;
      try {
        post_ids[ch] = await createScheduledPost({
          channelId,
          text: c.text,
          dueAt: edited.publish_at,
          videoUrl: m?.url,
          thumbnailUrl: m?.poster_url,
          youtube: ch === "youtube_shorts" ? { title: (c.title ?? "").trim() } : undefined,
          xReplies: ch === "x" ? c.reply_texts?.filter((t) => t.trim()) : undefined,
        });
      } catch (e) {
        errors[ch] = (e as Error).message;
      }
    }
  }
  const direct = { ...(edited.direct ?? {}) };
  for (const [ch] of directTargets) {
    if (!direct[ch] || (direct[ch]!.state === "error" && !edited.posted[ch])) direct[ch] = { state: "pending" };
  }
  const failed = Object.keys(errors).length;
  const next: Package = {
    ...edited,
    status: failed ? "approved" : "scheduled",
    buffer: { post_ids, errors },
    direct,
  };
  await savePackage(next, {
    at: now,
    by: login,
    action: failed
      ? `approved; Buffer failed for ${Object.keys(errors).join(", ")}`
      : `approved and scheduled${bufferTargets.length ? " in Buffer" : ""}${directTargets.length ? `${bufferTargets.length ? "; " : " "}${directTargets.map(([c]) => c).join(", ")} posted by the site at that time` : ""}`,
    diff: diff.length ? diff : undefined,
  });
  back(p.id, failed ? "err" : "msg", failed ? `Scheduled ${Object.keys(post_ids).length}, failed ${failed}: see the channels` : "Scheduled");
}

export async function requestChanges(form: FormData) {
  const { login, p } = await load(form);
  const note = String(form.get("note") ?? "").trim();
  if (!note) back(p.id, "err", "Write what should change");
  if (!EDITABLE.has(p.status)) back(p.id, "err", `A ${p.status} post can't be sent back`);
  await savePackage({ ...p, status: "changes_requested" }, { at: new Date().toISOString(), by: login, action: "changes requested", note });
  back(p.id, "msg", "Sent back to the planner");
}

export async function dropPost(form: FormData) {
  const { login, p } = await load(form);
  if (p.status === "scheduled") back(p.id, "err", "It is scheduled in Buffer: delete it there first, then drop it here");
  if (p.status === "posted") back(p.id, "err", "It is already posted");
  await savePackage({ ...p, status: "dropped" }, { at: new Date().toISOString(), by: login, action: "dropped", note: String(form.get("note") ?? "") || undefined });
  back(p.id, "msg", "Dropped");
}

export async function markPosted(form: FormData) {
  const { login, p } = await load(form);
  const ch = String(form.get("channel") ?? "") as Channel;
  const c = p.channels[ch];
  if (!c || c.mode !== "manual") back(p.id, "err", "Only by-hand channels are marked here");
  if (p.status !== "approved" && p.status !== "scheduled" && p.status !== "posted")
    back(p.id, "err", "Approve the post first");
  const url = String(form.get("url") ?? "").trim();
  if (url && !/^https:\/\//.test(url)) back(p.id, "err", "The link must start with https://");
  const posted = { ...p.posted, [ch]: { at: new Date().toISOString(), url: url || undefined, by: login } };
  const allOut = (Object.keys(p.channels) as Channel[]).every((k) => posted[k]);
  await savePackage(
    { ...p, posted, status: allOut ? "posted" : p.status },
    { at: new Date().toISOString(), by: login, action: `marked posted on ${ch}`, note: url || undefined },
  );
  back(p.id, "msg", `Marked posted on ${ch}`);
}

export async function removeFromBluesky(form: FormData) {
  const { login, p } = await load(form);
  if (p.direct?.bluesky?.state !== "posted") back(p.id, "err", "Nothing posted on Bluesky to remove");
  try {
    await removeBluesky(p, login);
  } catch (e) {
    back(p.id, "err", `Bluesky: ${(e as Error).message}`);
  }
  back(p.id, "msg", "Removed from Bluesky");
}
