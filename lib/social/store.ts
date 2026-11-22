import "server-only";
import { list, put } from "@vercel/blob";
import type { HistoryEntry, Package } from "./types";
import { seedPackages } from "./seed";

// Storage for post packages in the site's Vercel Blob store.
//
// Every write is a NEW object, social/posts/<id>/state-<epoch ms>-<random>.json,
// and a read takes the newest. Overwriting one post.json would serve stale
// copies from the Blob CDN for up to a minute, and an edit or approval must
// never act on a stale package. The random suffix keeps the URLs unguessable,
// since the store is public (Buffer must be able to fetch the media).
//
// Seed mode (SOCIAL_SEED=1, never in production) serves three fake packages
// from memory so a preview deployment can be clicked through. Nothing is
// stored and Buffer is never called in seed mode.

const PREFIX = "social/posts/";

export function seedMode(): boolean {
  return process.env.SOCIAL_SEED === "1" && process.env.VERCEL_ENV !== "production";
}

export function storeConfigured(): boolean {
  return seedMode() || !!process.env.BLOB_READ_WRITE_TOKEN;
}

// Module-level copy so seed-mode edits survive within one server instance.
const seedState = new Map<string, Package>();
function seeds(): Map<string, Package> {
  if (seedState.size === 0) for (const p of seedPackages()) seedState.set(p.id, structuredClone(p));
  return seedState;
}

async function allBlobs(prefix: string) {
  const out: { pathname: string; url: string }[] = [];
  let cursor: string | undefined;
  do {
    const r = await list({ prefix, cursor, limit: 1000 });
    out.push(...r.blobs.map((b) => ({ pathname: b.pathname, url: b.url })));
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  return out;
}

const STATE_RE = /^social\/posts\/([a-z0-9-]+)\/state-(\d{13})-/;

async function readJson(url: string): Promise<Package> {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(`blob read ${r.status}`);
  return (await r.json()) as Package;
}

export async function listPackages(): Promise<Package[]> {
  if (seedMode()) return [...seeds().values()].map((p) => structuredClone(p));
  if (!storeConfigured()) return [];
  const newest = new Map<string, { t: string; url: string }>();
  for (const b of await allBlobs(PREFIX)) {
    const m = STATE_RE.exec(b.pathname);
    if (!m) continue;
    const cur = newest.get(m[1]);
    if (!cur || m[2] > cur.t) newest.set(m[1], { t: m[2], url: b.url });
  }
  return Promise.all([...newest.values()].map((v) => readJson(v.url)));
}

export async function getPackage(id: string): Promise<Package | null> {
  if (!/^[a-z0-9-]+$/.test(id)) return null;
  if (seedMode()) {
    const p = seeds().get(id);
    return p ? structuredClone(p) : null;
  }
  if (!storeConfigured()) return null;
  let best: { t: string; url: string } | null = null;
  for (const b of await allBlobs(`${PREFIX}${id}/state-`)) {
    const m = STATE_RE.exec(b.pathname);
    if (m && (!best || m[2] > best.t)) best = { t: m[2], url: b.url };
  }
  return best ? readJson(best.url) : null;
}

// Write a new version of the package with `entry` appended to its history.
export async function savePackage(p: Package, entry: HistoryEntry): Promise<Package> {
  const next: Package = { ...p, history: [...(p.history ?? []), entry] };
  if (seedMode()) {
    seeds().set(next.id, structuredClone(next));
    return next;
  }
  await put(`${PREFIX}${next.id}/state-${Date.now()}.json`, JSON.stringify(next, null, 2), {
    access: "public",
    addRandomSuffix: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
  return next;
}
