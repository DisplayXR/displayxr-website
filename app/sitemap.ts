import type { MetadataRoute } from "next";
import { ITEMS, itemHref, LISTED_CATEGORIES } from "@/lib/data/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://displayxr.org";

  const routes = [
    "",
    "/about",
    "/developers",
    "/browser",
    "/play",
    "/apps",
    "/apps/chat",
    "/apps/gallery",
    "/apps/media-player-pro",
    "/developers/native",
    "/architecture",
    "/extensions",
    "/components",
    "/demos",
    "/download",
    "/platform-support",
    "/contribute",
    "/roadmap",
    "/governance",
    "/charter",
    "/faq",
    "/privacy",
    "/terms",
    "/news",
    // The Catalog: its landing, the Games shelf, then one route per listed
    // category and per item, from the same data the pages render.
    "/catalog",
    "/catalog/games",
    ...LISTED_CATEGORIES.map((c) => `/catalog/${c.id}`),
    ...ITEMS.map(itemHref),
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
