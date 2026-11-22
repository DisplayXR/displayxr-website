# Social review board (/admin/social)

The KB's social planner builds posts for the DisplayXR channels; this board is
where David reviews them and approves each one. Approval schedules that one post
in Buffer. Built 2026-11-22 from the marketing session's brief.

## Rules it enforces

- **One click, one post.** "Approve and schedule" on a single post's page is
  David's go for that post (D3). There is no bulk approve and no auto-approve.
  Every server action re-checks `isAllowed()` (GitHub login on `ADMIN_LOGINS`).
- A failed check blocks approval. The publish time must be 5+ minutes away.
- `hat` must be `"dxr"`: Leia posts never come here (D2).
- The planner can upload only `drafted` or `needs_review` packages, and cannot
  overwrite a post once it is approved, scheduled or posted.
- Every action is appended to the package's `history` (who, when, what, and a
  diff for caption and time edits).

## Environment

| Variable | Who sets it | Purpose |
|---|---|---|
| `BLOB_READ_WRITE_TOKEN` | Vercel (Blob store) | Storage for packages and media. Never given to the planner. |
| `BUFFER_API_KEY` | David, Sensitive | Buffer GraphQL API. Server only, never logged. Missing → "Buffer: not connected". |
| `SOCIAL_PLANNER_TOKEN` | David | 32+ random characters, shared with the planner. Upload only. |
| `BUFFER_CHANNELS` | optional | JSON `{ "x": "<channelId>", … }` if Buffer holds more than one account per network. |
| `SOCIAL_SEED` | preview only | `1` = three fake posts in memory; no storage, no Buffer. Ignored in production. |

## Planner API

All calls: `Authorization: Bearer $SOCIAL_PLANNER_TOKEN`.

1. **Media**: `POST /api/social/media-token` with `{"id":"<post id>","file":"v16x9.mp4"}`
   returns `{pathname, clientToken}` for that one path (mp4, mov, jpg, png; 512 MB; 30 min).
   Upload with `@vercel/blob`: `put(pathname, data, { access: "public", token: clientToken, multipart: true })`
   and keep the returned `url`. (Serverless request bodies are capped at about 4.5 MB,
   so media never goes through the site.)
2. **Package**: `POST /api/social/packages` with the post package JSON (schema 1,
   `lib/social/types.ts`). Each `media.<key>` needs `file` and the Blob `url`
   (and optionally `poster_url`). A 422 lists every problem.
3. **Status**: `GET /api/social/packages` returns id, status, publish time, Buffer ids
   and posted links for every package.

## Storage

Each write is a new object, `social/posts/<id>/state-<epoch ms>-<random>.json`; a
read takes the newest. That avoids reading a stale copy from the Blob CDN after an
edit, keeps every version as an audit trail, and keeps URLs unguessable.

## Buffer

`createPost` with `mode: customScheduled`, `schedulingType: automatic`, `dueAt` (UTC)
and the video as a public Blob URL. Channel ids are discovered from the account
(`account.organizations` → `channels`) by service. Status: `post { status externalLink }`.
When a scheduled post's time has passed, opening the board syncs it; `sent` on
every channel moves the package to `posted`.

**Checked against the live schema (2026-11-22, real key):** `needsApproval` is a
required Boolean and the board sends `false` (the board is the approval step). The
video asset carries the poster as `thumbnailUrl`. YouTube Shorts go out with
`metadata.youtube { title, privacy: public, madeForKids: false, categoryId: "28" }`;
Approve refuses an empty title or one over 100 characters. X reply threads are still
posted by hand (`metadata.twitter.thread` exists but is not wired yet).
