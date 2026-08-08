import { NEWS_KIND_LABELS, getAllNews } from "@/lib/data/news";

const SITE = "https://displayxr.org";

/** XML text escaping — headlines and blurbs contain & and — routinely. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const dynamic = "force-static";

export function GET(): Response {
  const items = getAllNews();
  const updated = items[0]?.date;

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DisplayXR — What's New</title>
    <link>${SITE}/news</link>
    <description>New platforms, graphics APIs, engines, vendors and capabilities across the DisplayXR ecosystem.</description>
    <language>en</language>
    <atom:link href="${SITE}/news/rss.xml" rel="self" type="application/rss+xml" />${
      updated
        ? `\n    <lastBuildDate>${new Date(`${updated}T00:00:00Z`).toUTCString()}</lastBuildDate>`
        : ""
    }
${items
  .map(
    (item) => `    <item>
      <title>${esc(item.headline)}</title>
      <link>${esc(item.href)}</link>
      <guid isPermaLink="true">${SITE}/news#${item.id}</guid>
      <category>${esc(NEWS_KIND_LABELS[item.kind])}</category>
      <pubDate>${new Date(`${item.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(item.blurb ?? item.headline)}</description>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
