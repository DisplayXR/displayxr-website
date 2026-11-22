import { NextResponse } from "next/server";
import { generateClientTokenFromReadWriteToken } from "@vercel/blob/client";
import { plannerAuthorized } from "@/lib/social/planner-auth";
import { seedMode } from "@/lib/social/store";

export const dynamic = "force-dynamic";

// Videos are too large for a serverless request body (about 4.5 MB on Vercel),
// so the planner uploads media straight to Blob with a short-lived client token
// that this route issues for ONE path: social/posts/<id>/media/<file>.
//
// Body: {"id": "<post id>", "file": "v16x9.mp4"}
// Reply: {"pathname": "...", "clientToken": "..."}; then, in Node:
//   put(pathname, data, { access: "public", token: clientToken, multipart: true })
// and put the returned URL into the package's media entry.

const TYPES: Record<string, string> = { mp4: "video/mp4", mov: "video/quicktime", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png" };

export async function POST(req: Request) {
  if (!plannerAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (seedMode()) return NextResponse.json({ error: "seed mode: uploads are off" }, { status: 409 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: "blob store not configured" }, { status: 503 });

  const body = (await req.json().catch(() => null)) as { id?: string; file?: string } | null;
  const id = body?.id ?? "";
  const file = body?.file ?? "";
  if (!/^[a-z0-9][a-z0-9-]{2,80}$/.test(id) || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,80}$/.test(file))
    return NextResponse.json({ error: "id or file name not allowed" }, { status: 400 });
  const type = TYPES[file.split(".").pop()?.toLowerCase() ?? ""];
  if (!type) return NextResponse.json({ error: "only mp4, mov, jpg, png" }, { status: 400 });

  const pathname = `social/posts/${id}/media/${file}`;
  const clientToken = await generateClientTokenFromReadWriteToken({
    pathname,
    allowedContentTypes: [type],
    maximumSizeInBytes: 512 * 1024 * 1024,
    validUntil: Date.now() + 30 * 60_000,
    addRandomSuffix: true,
  });
  return NextResponse.json({ pathname, clientToken });
}
