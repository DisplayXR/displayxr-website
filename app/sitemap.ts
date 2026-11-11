import type { MetadataRoute } from "next";

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
    "/faq",
    "/news",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
