import { CHANNELS, MANUAL_ONLY, POST_STATUSES, type Channel, type Package } from "./types";

// Hand-written validation for the planner's upload (no schema library in this
// repo). Returns a list of problems; empty means the package is acceptable.

const ID_RE = /^[a-z0-9][a-z0-9-]{2,80}$/;
const FILE_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,80}$/;

const ASPECTS = ["9:16", "16:9", "1:1"];

export function isBlobUrl(u: unknown): u is string {
  if (typeof u !== "string") return false;
  try {
    const url = new URL(u);
    return url.protocol === "https:" && url.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export function validatePackage(p: unknown): string[] {
  const errs: string[] = [];
  if (!p || typeof p !== "object") return ["body is not a JSON object"];
  const o = p as Record<string, unknown>;

  if (typeof o.id !== "string" || !ID_RE.test(o.id)) errs.push("id: lower-case letters, digits and dashes, 3–81 chars");
  if (o.schema !== 1) errs.push("schema: must be 1");
  // Leia-hat posts never come through this board (D2: they go to Leia marketing).
  if (o.hat !== "dxr") errs.push('hat: must be "dxr"');
  if (typeof o.title !== "string" || !o.title.trim()) errs.push("title: required");
  if (typeof o.status !== "string" || !(POST_STATUSES as readonly string[]).includes(o.status))
    errs.push("status: unknown");
  // The planner may only submit drafts; approval happens on the board.
  if (o.status !== "drafted" && o.status !== "needs_review")
    errs.push('status: the planner may only upload "drafted" or "needs_review"');
  if (typeof o.publish_at !== "string" || Number.isNaN(Date.parse(o.publish_at)))
    errs.push("publish_at: ISO time required");

  const media = (o.media ?? {}) as Record<string, unknown>;
  if (typeof media !== "object") errs.push("media: object required");
  for (const [key, m] of Object.entries(media)) {
    const mm = m as Record<string, unknown>;
    if (!mm || typeof mm !== "object") { errs.push(`media.${key}: object required`); continue; }
    if (typeof mm.file !== "string" || !FILE_RE.test(mm.file)) errs.push(`media.${key}.file: plain file name required`);
    if (!isBlobUrl(mm.url)) errs.push(`media.${key}.url: must be a public Vercel Blob URL`);
    if (mm.poster_url !== undefined && !isBlobUrl(mm.poster_url)) errs.push(`media.${key}.poster_url: must be a public Vercel Blob URL`);
    if (mm.aspect !== undefined && !ASPECTS.includes(mm.aspect as string)) errs.push(`media.${key}.aspect: one of ${ASPECTS.join(", ")}`);
  }

  const channels = o.channels as Record<string, unknown> | undefined;
  if (!channels || typeof channels !== "object" || Object.keys(channels).length === 0) {
    errs.push("channels: at least one channel");
  } else {
    for (const [name, c] of Object.entries(channels)) {
      if (!(CHANNELS as readonly string[]).includes(name)) { errs.push(`channels.${name}: unknown channel`); continue; }
      const cc = c as Record<string, unknown>;
      if (!cc || typeof cc !== "object") { errs.push(`channels.${name}: object required`); continue; }
      if (typeof cc.text !== "string") errs.push(`channels.${name}.text: required`);
      if (cc.mode !== "buffer" && cc.mode !== "manual") errs.push(`channels.${name}.mode: "buffer" or "manual"`);
      if (cc.mode === "buffer" && MANUAL_ONLY.includes(name as Channel)) errs.push(`channels.${name}: this channel is posted by hand (mode "manual")`);
      if (cc.media !== undefined && (typeof cc.media !== "string" || !(cc.media in media))) errs.push(`channels.${name}.media: must name a key in media`);
    }
  }
  return errs;
}

// What the board keeps from an upload: planner-owned fields only. Buffer ids,
// "posted" records and history entries never come from the planner.
export function sanitizeUpload(p: Package): Package {
  return {
    id: p.id,
    schema: 1,
    hat: "dxr",
    title: p.title,
    status: p.status,
    publish_at: new Date(p.publish_at).toISOString(),
    channels: p.channels,
    media: p.media,
    clips: Array.isArray(p.clips) ? p.clips : [],
    checks: Array.isArray(p.checks) ? p.checks : [],
    buffer: { post_ids: {} },
    posted: {},
    history: [],
  };
}
