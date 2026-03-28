import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://displayxr.dev";

  const routes = [
    "",
    "/docs",
    "/architecture",
    "/extensions",
    "/demos",
    "/compatibility",
    "/roadmap",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
