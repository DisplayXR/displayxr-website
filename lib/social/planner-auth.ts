import "server-only";
import { timingSafeEqual } from "node:crypto";

// The planner (KBXR) authenticates with its own bearer token, SOCIAL_PLANNER_TOKEN.
// It can upload packages and media, and nothing else: it never sees the Blob
// read-write token or the Buffer key, and it cannot approve.
export function plannerAuthorized(req: Request): boolean {
  const want = process.env.SOCIAL_PLANNER_TOKEN;
  if (!want || want.length < 32) return false;
  const got = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(got);
  const b = Buffer.from(want);
  return a.length === b.length && timingSafeEqual(a, b);
}
