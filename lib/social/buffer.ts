import "server-only";
import type { Channel } from "./types";

// Buffer's public GraphQL API (developers.buffer.com): POST https://api.buffer.com
// with "Authorization: Bearer <API key>". BUFFER_API_KEY lives in the server
// environment only (David adds it in Vercel as a Sensitive variable); it is
// never sent to the browser and never logged.
//
// Field names below were checked on 2026-11-22 by introspecting the live
// schema with the real key: CreatePostInput needs needsApproval (non-null
// Boolean), YouTube posts take metadata.youtube (YoutubePostMetadataInput),
// VideoAssetInput takes thumbnailUrl, and PostStatus is one of draft, error,
// needs_approval, scheduled, sending, sent.

const ENDPOINT = "https://api.buffer.com";

export function bufferConfigured(): boolean {
  return !!process.env.BUFFER_API_KEY;
}

async function gql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const key = process.env.BUFFER_API_KEY;
  if (!key) throw new Error("Buffer is not connected (BUFFER_API_KEY is not set)");
  const r = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (r.status === 429) throw new Error(`Buffer rate limit; retry after ${r.headers.get("retry-after") ?? "?"} s`);
  const j = (await r.json().catch(() => ({}))) as { data?: T; errors?: { message: string }[] };
  if (!r.ok || j.errors?.length) throw new Error(`Buffer: ${j.errors?.map((e) => e.message).join("; ") || `HTTP ${r.status}`}`);
  return j.data as T;
}

// Board channel → Buffer `Service` value.
const SERVICE: Partial<Record<Channel, string>> = {
  x: "twitter",
  linkedin: "linkedin",
  threads: "threads",
  instagram: "instagram",
  tiktok: "tiktok",
  youtube_shorts: "youtube",
};

// The DisplayXR channels connected in Buffer, keyed by board channel.
// BUFFER_CHANNELS (JSON, e.g. {"x":"<channelId>"}) overrides discovery, which
// is needed if Buffer ever holds more than one account per service.
export async function bufferChannels(): Promise<Partial<Record<Channel, string>>> {
  if (process.env.BUFFER_CHANNELS) return JSON.parse(process.env.BUFFER_CHANNELS);
  const acct = await gql<{ account: { organizations: { id: string }[] } }>(
    `query { account { organizations { id } } }`,
  );
  const out: Partial<Record<Channel, string>> = {};
  for (const org of acct.account.organizations) {
    const c = await gql<{ channels: { id: string; service: string; name: string }[] }>(
      `query($input: ChannelsInput!) { channels(input: $input) { id service name } }`,
      { input: { organizationId: org.id } },
    );
    for (const ch of c.channels) {
      for (const [board, svc] of Object.entries(SERVICE)) {
        if (ch.service?.toLowerCase() === svc && !out[board as Channel]) out[board as Channel] = ch.id;
      }
    }
  }
  return out;
}

export interface YoutubeMeta {
  title: string; // YouTube caps it at 100 characters
}

export async function createScheduledPost(input: {
  channelId: string;
  text: string;
  dueAt: string; // ISO UTC
  videoUrl?: string;
  thumbnailUrl?: string;
  youtube?: YoutubeMeta;
  xReplies?: string[]; // X only: sent as a thread after the main post
}): Promise<string> {
  const assets = input.videoUrl
    ? [{ video: { url: input.videoUrl, ...(input.thumbnailUrl ? { thumbnailUrl: input.thumbnailUrl } : {}) } }]
    : [];
  // metadata.twitter.thread lists the WHOLE thread, first post included
  // (checked on 2026-11-22: a plain post reads back thread []). Buffer rebuilds
  // the post from the thread, so thread[0] MUST carry the video: without it the
  // top-level video is silently dropped. With it, one video is posted.
  const metadata = input.youtube
    ? {
        youtube: {
          title: input.youtube.title,
          privacy: "public",
          madeForKids: false,
          categoryId: "28", // Science & Technology
        },
      }
    : input.xReplies && input.xReplies.length > 0
      ? {
          twitter: {
            thread: [
              { text: input.text, assets },
              ...input.xReplies.map((text) => ({ text, assets: [] })),
            ],
          },
        }
      : undefined;
  const d = await gql<{ createPost: { post?: { id: string }; message?: string } }>(
    `mutation($input: CreatePostInput!) {
      createPost(input: $input) {
        ... on PostActionSuccess { post { id } }
        ... on MutationError { message }
      }
    }`,
    {
      input: {
        channelId: input.channelId,
        text: input.text,
        schedulingType: "automatic",
        mode: "customScheduled",
        dueAt: input.dueAt,
        // The board is the approval step; Buffer's own approval queue stays off.
        needsApproval: false,
        assets,
        ...(metadata ? { metadata } : {}),
      },
    },
  );
  if (!d.createPost?.post?.id) throw new Error(`Buffer: ${d.createPost?.message ?? "no post id returned"}`);
  return d.createPost.post.id;
}

export async function getPostStatus(id: string): Promise<{ status: string; externalLink?: string | null }> {
  const d = await gql<{ post: { status: string; externalLink?: string | null } }>(
    `query($input: PostInput!) { post(input: $input) { status externalLink } }`,
    { input: { id } },
  );
  return d.post;
}
