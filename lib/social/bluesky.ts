import "server-only";

// Direct posting to Bluesky over the AT Protocol. Bluesky is not in Buffer (the
// free plan holds three channels), so the board posts it itself: Approve marks
// the channel pending, and the cron (/api/social/cron) posts it when it is due.
//
// BLUESKY_HANDLE and BLUESKY_APP_PASSWORD are server-only (Vercel, Sensitive).
// The app password is never logged and never leaves this module.
//
// Video goes through Bluesky's video service (video.bsky.app), which transcodes
// it and hands back the blob the post embeds: a service-auth token from the
// PDS, uploadVideo, then getJobStatus until the job completes.

const ENTRYWAY = "https://bsky.social";
const VIDEO_SERVICE = "https://video.bsky.app";
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export function blueskyConfigured(): boolean {
  return !!process.env.BLUESKY_HANDLE && !!process.env.BLUESKY_APP_PASSWORD;
}

interface Session {
  did: string;
  handle: string;
  accessJwt: string;
  pds: string; // the account's PDS origin, e.g. https://xyz.us-west.host.bsky.network
}

async function xrpc<T>(
  base: string,
  method: string,
  opts: { token?: string; body?: unknown; raw?: { data: ArrayBuffer; type: string }; query?: Record<string, string>; get?: boolean } = {},
): Promise<T> {
  const url = new URL(`/xrpc/${method}`, base);
  for (const [k, v] of Object.entries(opts.query ?? {})) url.searchParams.set(k, v);
  const headers: Record<string, string> = {};
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;
  let body: BodyInit | undefined;
  if (opts.raw) {
    headers["Content-Type"] = opts.raw.type;
    body = opts.raw.data;
  } else if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.body);
  }
  const r = await fetch(url, { method: opts.get ? "GET" : "POST", headers, body, cache: "no-store" });
  const j = (await r.json().catch(() => ({}))) as T & { error?: string; message?: string };
  if (!r.ok) {
    // The video service answers 409 "already_exists" with the existing job; let
    // the caller read it.
    if (r.status === 409 && (j as { jobId?: string }).jobId) return j;
    throw new Error(`Bluesky ${method}: ${j.message ?? j.error ?? `HTTP ${r.status}`}`);
  }
  return j;
}

export async function blueskySession(): Promise<Session> {
  const identifier = process.env.BLUESKY_HANDLE;
  const password = process.env.BLUESKY_APP_PASSWORD;
  if (!identifier || !password) throw new Error("Bluesky is not connected (BLUESKY_HANDLE / BLUESKY_APP_PASSWORD not set)");
  const s = await xrpc<{
    did: string;
    handle: string;
    accessJwt: string;
    didDoc?: { service?: { id: string; serviceEndpoint: string }[] };
  }>(ENTRYWAY, "com.atproto.server.createSession", { body: { identifier, password } });
  const pds = s.didDoc?.service?.find((x) => x.id.endsWith("#atproto_pds"))?.serviceEndpoint ?? ENTRYWAY;
  return { did: s.did, handle: s.handle, accessJwt: s.accessJwt, pds };
}

// --- rich text: link facets ------------------------------------------------

const LINK_RE = /\bhttps?:\/\/[^\s<>"]+|\b(?:[a-z0-9-]+\.)+(?:com|org|net|io|dev|ai|co|app|gg|xyz)(?:\/[^\s<>"]*)?/gi;
const TRAILING = /[.,;:!?)\]'"]+$/;

export interface Facet {
  index: { byteStart: number; byteEnd: number };
  features: { $type: "app.bsky.richtext.facet#link"; uri: string }[];
}

// Byte offsets are UTF-8, as the AT Protocol requires.
export function linkFacets(text: string): Facet[] {
  const enc = new TextEncoder();
  const out: Facet[] = [];
  for (const m of text.matchAll(LINK_RE)) {
    const shown = m[0].replace(TRAILING, "");
    if (!shown) continue;
    const start = m.index ?? 0;
    const byteStart = enc.encode(text.slice(0, start)).length;
    const byteEnd = byteStart + enc.encode(shown).length;
    const uri = /^https?:\/\//i.test(shown) ? shown : `https://${shown}`;
    out.push({ index: { byteStart, byteEnd }, features: [{ $type: "app.bsky.richtext.facet#link", uri }] });
  }
  return out;
}

export function graphemes(s: string): number {
  return [...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(s)].length;
}

// --- video -----------------------------------------------------------------

export type VideoBlob = { $type: "blob"; ref: { $link: string }; mimeType: string; size: number };

export type VideoStep =
  | { state: "done"; blob: VideoBlob }
  | { state: "processing"; jobId: string };

// Start (or resume) the video job and wait up to `waitMs` for it to finish.
export async function uploadVideo(
  s: Session,
  input: { url: string; name: string; jobId?: string },
  waitMs: number,
): Promise<VideoStep> {
  let jobId = input.jobId;
  if (!jobId) {
    const v = await fetch(input.url, { cache: "no-store" });
    if (!v.ok) throw new Error(`could not fetch the video (${v.status})`);
    const data = await v.arrayBuffer();
    if (data.byteLength > MAX_VIDEO_BYTES) throw new Error("the video is over Bluesky's 100 MB limit");
    const pdsHost = new URL(s.pds).host;
    const auth = await xrpc<{ token: string }>(s.pds, "com.atproto.server.getServiceAuth", {
      token: s.accessJwt,
      get: true,
      query: {
        aud: `did:web:${pdsHost}`,
        lxm: "com.atproto.repo.uploadBlob",
        exp: String(Math.floor(Date.now() / 1000) + 30 * 60),
      },
    });
    const st = await xrpc<{ jobId?: string; jobStatus?: { jobId: string; state: string; blob?: VideoBlob; error?: string } }>(
      VIDEO_SERVICE,
      "app.bsky.video.uploadVideo",
      { token: auth.token, raw: { data, type: "video/mp4" }, query: { did: s.did, name: input.name } },
    );
    jobId = st.jobStatus?.jobId ?? st.jobId;
    if (!jobId) throw new Error("the video service returned no job id");
    if (st.jobStatus?.blob) return { state: "done", blob: st.jobStatus.blob };
  }
  const until = Date.now() + waitMs;
  for (;;) {
    const j = await xrpc<{ jobStatus: { state: string; blob?: VideoBlob; error?: string; message?: string } }>(
      VIDEO_SERVICE,
      "app.bsky.video.getJobStatus",
      { get: true, query: { jobId } },
    );
    const js = j.jobStatus;
    if (js.blob && js.state === "JOB_STATE_COMPLETED") return { state: "done", blob: js.blob };
    if (js.state === "JOB_STATE_FAILED") throw new Error(`video processing failed: ${js.error ?? js.message ?? "unknown"}`);
    if (Date.now() > until) return { state: "processing", jobId };
    await new Promise((r) => setTimeout(r, 4000));
  }
}

// --- posting ---------------------------------------------------------------

export interface StrongRef { uri: string; cid: string }

const ASPECT: Record<string, { width: number; height: number }> = {
  "9:16": { width: 1080, height: 1920 },
  "16:9": { width: 1920, height: 1080 },
  "1:1": { width: 1080, height: 1080 },
};

export async function createPost(
  s: Session,
  input: { text: string; video?: VideoBlob; aspect?: string; reply?: { root: StrongRef; parent: StrongRef } },
): Promise<StrongRef> {
  const record: Record<string, unknown> = {
    $type: "app.bsky.feed.post",
    text: input.text,
    createdAt: new Date().toISOString(),
    langs: ["en"],
  };
  const facets = linkFacets(input.text);
  if (facets.length) record.facets = facets;
  if (input.video) {
    record.embed = {
      $type: "app.bsky.embed.video",
      video: input.video,
      ...(input.aspect && ASPECT[input.aspect] ? { aspectRatio: ASPECT[input.aspect] } : {}),
    };
  }
  if (input.reply) record.reply = input.reply;
  return xrpc<StrongRef>(s.pds, "com.atproto.repo.createRecord", {
    token: s.accessJwt,
    body: { repo: s.did, collection: "app.bsky.feed.post", record },
  });
}

export function postUrl(handle: string, uri: string): string {
  const rkey = uri.split("/").pop();
  return `https://bsky.app/profile/${handle}/post/${rkey}`;
}

export async function deletePost(s: Session, uri: string): Promise<void> {
  const rkey = uri.split("/").pop();
  await xrpc(s.pds, "com.atproto.repo.deleteRecord", {
    token: s.accessJwt,
    body: { repo: s.did, collection: "app.bsky.feed.post", rkey },
  });
}
