import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://displayxr.org";

  const routes = [
    "",
    "/about",
    "/developers",
    "/browser",
    "/developers/native",
    "/architecture",
    "/extensions",
    "/vendors",
    "/demos",
    "/download",
    "/platform-support",
    "/contribute",
    "/roadmap",
    "/governance",
    "/news",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
