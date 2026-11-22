import type { Package } from "./types";

// Three fake packages for preview deployments (SOCIAL_SEED=1). The copy is
// illustrative; nothing here is ever sent to Buffer.

const VIDEO = "/videos/hero-loop.mp4";
const POSTER = "/videos/hero-loop-poster.jpg";

function at(days: number, hourPt: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  d.setUTCHours(hourPt + 8, 0, 0, 0); // PST = UTC−8, close enough for a seed
  return d.toISOString();
}

export function seedPackages(): Package[] {
  const media = {
    v16x9: { file: "v16x9.mp4", url: VIDEO, duration_s: 20, poster: "v16x9.jpg", poster_url: POSTER },
    v9x16: { file: "v9x16.mp4", url: VIDEO, duration_s: 15, poster: "v9x16.jpg", poster_url: POSTER },
  };
  const base = { schema: 1 as const, hat: "dxr" as const, media, buffer: { post_ids: {} }, posted: {} };
  return [
    {
      ...base,
      id: "seed-prompt-to-3d",
      title: "Prompt to 3D (seed)",
      status: "needs_review",
      publish_at: at(2, 9),
      channels: {
        x: { text: "Describe a page, get a 3D page. An assistant builds it with the DisplayXR inline 3D tools, and it opens in 3D on a spatial display. displayxr.org", media: "v16x9", mode: "buffer" },
        bluesky: { text: "Describe a page, get a 3D page. An assistant builds it with the DisplayXR inline 3D tools. displayxr.org", media: "v16x9", mode: "buffer" },
        linkedin: { text: "A 3D web page, built by an assistant in a few minutes, shown on a spatial display. The same link opens in 2D everywhere else.", media: "v16x9", mode: "buffer" },
        reddit: { title: "We let an assistant build a 3D web page", text: "Seed text for a hand-written Reddit post.", mode: "manual" },
      },
      clips: [{ id: "screen-chatgpt-builds-inline3d-page-connector-demo-v2", range: "0:08-1:40", note: "seed" }],
      checks: [
        { name: "copy", result: "pass", detail: "13/13" },
        { name: "rights", result: "pass" },
        { name: "display-footage", result: "note", detail: "never shows a spatial display" },
      ],
      history: [{ at: new Date().toISOString(), by: "planner", action: "drafted" }],
    },
    {
      ...base,
      id: "seed-developer-60s",
      title: "Developer in 60 seconds (seed)",
      status: "scheduled",
      publish_at: at(3, 10),
      channels: {
        x: { text: "Unity project → spatial display in under a minute. Seed copy.", media: "v16x9", mode: "buffer" },
        youtube_shorts: { title: "Unity on a spatial display in 60 seconds", text: "Seed copy.", media: "v9x16", mode: "buffer" },
      },
      checks: [{ name: "copy", result: "pass" }, { name: "rights", result: "pass" }],
      history: [
        { at: new Date().toISOString(), by: "planner", action: "drafted" },
        { at: new Date().toISOString(), by: "seed", action: "approved and scheduled (seed, not sent)" },
      ],
    },
    {
      ...base,
      id: "seed-community-roundup",
      title: "Community roundup (seed)",
      status: "changes_requested",
      publish_at: at(5, 9),
      channels: {
        linkedin: { text: "Seed copy for a weekly roundup.", media: "v16x9", mode: "buffer" },
        discord: { text: "Seed announcement for #announcements.", mode: "manual" },
      },
      checks: [{ name: "copy", result: "fail", detail: "names a vendor (seed)" }],
      history: [
        { at: new Date().toISOString(), by: "planner", action: "drafted" },
        { at: new Date().toISOString(), by: "seed", action: "changes requested", note: "Drop the vendor name." },
      ],
    },
  ];
}
