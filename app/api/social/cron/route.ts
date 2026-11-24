import { NextResponse } from "next/server";
import { postDueBluesky } from "@/lib/social/direct";
import { listPackages, seedMode } from "@/lib/social/store";
import { syncFromBuffer } from "@/lib/social/sync";

// Vercel Cron, every 5 minutes (vercel.json). Posts the direct channels
// (Bluesky) that are due, and syncs Buffer's status for scheduled posts so the
// queue is right without anyone opening it. Vercel sends
// "Authorization: Bearer $CRON_SECRET"; anything else gets a 401.

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (seedMode()) return NextResponse.json({ ok: true, seed: true });

  const out: { id: string; bluesky?: string; error?: string }[] = [];
  for (const p of await listPackages()) {
    if (p.status !== "scheduled" || Date.parse(p.publish_at) > Date.now()) continue;
    try {
      const after = await postDueBluesky(p);
      await syncFromBuffer(after);
      out.push({ id: p.id, bluesky: after.direct?.bluesky?.state });
    } catch (e) {
      out.push({ id: p.id, error: (e as Error).message });
    }
  }
  return NextResponse.json({ ok: true, due: out });
}
