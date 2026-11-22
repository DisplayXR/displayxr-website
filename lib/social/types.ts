// The post package the social planner (KBXR, _toolkit/social/) uploads, one per
// post. Schema 1, agreed with the marketing session on 2026-11-22. The planner
// writes it; the review board (/admin/social) edits captions, the time and the
// status, and appends to `history`. See docs/social-review-board.md.

export const POST_STATUSES = [
  "drafted",
  "needs_review",
  "changes_requested",
  "approved",
  "scheduled",
  "posted",
  "dropped",
] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

// Channels the board knows. `mode` decides who publishes: Buffer, or a person
// by hand (copy text, then "Mark posted").
export const CHANNELS = [
  "x",
  "bluesky",
  "linkedin",
  "threads",
  "instagram",
  "tiktok",
  "youtube_shorts",
  "reddit",
  "hackernews",
  "discord",
] as const;
export type Channel = (typeof CHANNELS)[number];

export const MANUAL_ONLY: readonly Channel[] = ["reddit", "hackernews", "discord"];

export interface ChannelPost {
  text: string;
  title?: string; // reddit, hackernews, youtube_shorts
  reply_texts?: string[]; // x: follow-up replies, sent as a thread through Buffer
  media?: string; // key into Package.media
  mode: "buffer" | "manual";
}

export interface MediaItem {
  file: string; // file name beside post.json
  url: string; // public Blob URL (what Buffer fetches)
  duration_s?: number;
  poster?: string; // file name of the poster frame
  poster_url?: string;
  aspect?: "9:16" | "16:9" | "1:1"; // YouTube Shorts accepts only 9:16
}

export interface Check {
  name: string;
  result: "pass" | "note" | "fail";
  detail?: string;
}

export interface HistoryEntry {
  at: string; // ISO time
  by: string; // "planner" or a GitHub login
  action: string;
  note?: string;
  diff?: { channel: string; field: "text" | "title" | "publish_at"; from: string; to: string }[];
}

export interface Package {
  id: string;
  schema: 1;
  hat: "dxr";
  title: string;
  status: PostStatus;
  publish_at: string; // ISO UTC
  channels: Partial<Record<Channel, ChannelPost>>;
  media: Record<string, MediaItem>;
  clips?: { id: string; range?: string; note?: string }[];
  checks?: Check[];
  buffer: {
    post_ids: Partial<Record<Channel, string>>;
    errors?: Partial<Record<Channel, string>>;
  };
  posted: Partial<Record<Channel, { at: string; url?: string; by: string }>>;
  history: HistoryEntry[];
}

// Display limits per channel, for the character counter. X counts every URL as
// 23 characters; the others count what is typed.
export const LIMITS: Record<Channel, { text: number; title?: number }> = {
  x: { text: 280 },
  bluesky: { text: 300 },
  linkedin: { text: 3000 },
  threads: { text: 500 },
  instagram: { text: 2200 },
  tiktok: { text: 2200 },
  youtube_shorts: { text: 5000, title: 100 },
  reddit: { text: 40000, title: 300 },
  hackernews: { text: 4000, title: 80 },
  discord: { text: 2000 },
};

export const CHANNEL_LABEL: Record<Channel, string> = {
  x: "X",
  bluesky: "Bluesky",
  linkedin: "LinkedIn",
  threads: "Threads",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube_shorts: "YouTube Shorts",
  reddit: "Reddit",
  hackernews: "Hacker News",
  discord: "Discord",
};

export const STATUS_LABEL: Record<PostStatus, string> = {
  drafted: "Drafted",
  needs_review: "Needs review",
  changes_requested: "Changes requested",
  approved: "Approved",
  scheduled: "Scheduled",
  posted: "Posted",
  dropped: "Dropped",
};
