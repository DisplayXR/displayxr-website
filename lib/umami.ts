// Umami Cloud Stats API — site analytics rendered directly in /admin instead of
// behind a paid Vercel team seat. Privacy-friendly, cookieless; access is gated
// only by our GitHub allowlist.
//
// Auth: x-umami-api-key header (Umami Cloud → Settings → API keys).
// Docs: https://umami.is/docs/api/cloud-api

const BASE = "https://api.umami.is/v1";
const API_KEY = process.env.UMAMI_API_KEY || "";
const WEBSITE_ID = process.env.UMAMI_WEBSITE_ID || "";

export interface MetricItem {
  x: string | null; // value (url, referrer, country, …)
  y: number; // count
}

export interface Analytics {
  rangeDays: number;
  pageviews: number;
  visitors: number;
  visits: number;
  bounces: number;
  topPages: MetricItem[];
  topReferrers: MetricItem[];
  topCountries: MetricItem[];
  error: string | null;
}

function emptyAnalytics(rangeDays: number, error: string | null): Analytics {
  return {
    rangeDays,
    pageviews: 0,
    visitors: 0,
    visits: 0,
    bounces: 0,
    topPages: [],
    topReferrers: [],
    topCountries: [],
    error,
  };
}

async function umamiFetch<T>(
  path: string,
  params: Record<string, string | number>
): Promise<T> {
  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  );
  const res = await fetch(`${BASE}${path}?${qs}`, {
    headers: { "x-umami-api-key": API_KEY, accept: "application/json" },
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`Umami API ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// Umami Cloud returns flat numbers ({ pageviews: 27 }); self-hosted v2 wraps
// them ({ pageviews: { value: 27, prev: 12 } }). Accept either.
type StatValue = number | { value: number; prev: number };

function statValue(v: StatValue | undefined): number {
  if (typeof v === "number") return v;
  return v?.value ?? 0;
}

export async function getAnalytics(rangeDays = 30): Promise<Analytics> {
  if (!API_KEY || !WEBSITE_ID) {
    return emptyAnalytics(
      rangeDays,
      "Umami not configured (UMAMI_API_KEY / UMAMI_WEBSITE_ID)."
    );
  }

  const endAt = Date.now();
  const startAt = endAt - rangeDays * 24 * 60 * 60 * 1000;
  const range = { startAt, endAt };
  const base = `/websites/${WEBSITE_ID}`;

  try {
    const [stats, pages, referrers, countries] = await Promise.all([
      umamiFetch<{
        pageviews: StatValue;
        visitors: StatValue;
        visits: StatValue;
        bounces: StatValue;
      }>(`${base}/stats`, range),
      umamiFetch<MetricItem[]>(`${base}/metrics`, { ...range, type: "url", limit: 8 }),
      umamiFetch<MetricItem[]>(`${base}/metrics`, { ...range, type: "referrer", limit: 8 }),
      umamiFetch<MetricItem[]>(`${base}/metrics`, { ...range, type: "country", limit: 8 }),
    ]);

    return {
      rangeDays,
      pageviews: statValue(stats.pageviews),
      visitors: statValue(stats.visitors),
      visits: statValue(stats.visits),
      bounces: statValue(stats.bounces),
      topPages: pages ?? [],
      topReferrers: referrers ?? [],
      topCountries: countries ?? [],
      error: null,
    };
  } catch (e) {
    return emptyAnalytics(rangeDays, (e as Error).message);
  }
}
