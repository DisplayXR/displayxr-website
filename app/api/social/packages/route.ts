import { NextResponse } from "next/server";
import { plannerAuthorized } from "@/lib/social/planner-auth";
import { getPackage, listPackages, savePackage, seedMode, storeConfigured } from "@/lib/social/store";
import { sanitizeUpload, validatePackage } from "@/lib/social/validate";
import type { Package } from "@/lib/social/types";

export const dynamic = "force-dynamic";

// POST: the planner uploads one post package (JSON, schema 1). Media must
// already be in the Blob store (see /api/social/media-token).
// GET: status of every package, so the planner can see what was approved,
// scheduled and posted (and where).
//
// Auth: "Authorization: Bearer <SOCIAL_PLANNER_TOKEN>".

export async function POST(req: Request) {
  if (!plannerAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (seedMode()) return NextResponse.json({ error: "seed mode: uploads are off" }, { status: 409 });
  if (!storeConfigured()) return NextResponse.json({ error: "blob store not configured" }, { status: 503 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "body must be JSON" }, { status: 400 });
  }
  const errors = validatePackage(body);
  if (errors.length) return NextResponse.json({ error: "invalid package", details: errors }, { status: 422 });

  const incoming = sanitizeUpload(body as Package);
  const prior = await getPackage(incoming.id);
  // Once David has approved a post, the planner can't change it underneath him.
  if (prior && !["drafted", "needs_review", "changes_requested", "dropped"].includes(prior.status)) {
    return NextResponse.json({ error: `post is ${prior.status}; uploads are refused` }, { status: 409 });
  }
  const saved = await savePackage(
    { ...incoming, history: prior?.history ?? [] },
    { at: new Date().toISOString(), by: "planner", action: prior ? "re-uploaded" : "uploaded" },
  );
  return NextResponse.json({ ok: true, id: saved.id, status: saved.status });
}

export async function GET(req: Request) {
  if (!plannerAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const all = await listPackages();
  return NextResponse.json(
    all.map((p) => ({ id: p.id, status: p.status, publish_at: p.publish_at, buffer: p.buffer, posted: p.posted })),
  );
}
