import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  async redirects() {
    // All permanent (308). Keep old URLs working when a page moves.
    return [
      // Status + Compatibility merged into one Platform Support page.
      { source: "/status", destination: "/platform-support", permanent: true },
      {
        source: "/compatibility",
        destination: "/platform-support",
        permanent: true,
      },
      // 2026-10 overhaul: /webxr became /web, the browser's home; the /docs
      // link list folded into the /developers hub. (/getting-started stays
      // live until /developers/native replaces it.)
      { source: "/webxr", destination: "/web", permanent: true },
      { source: "/docs", destination: "/developers", permanent: true },
      // Guessed URLs seen in analytics (a nav label read as a path). Source
      // matching is case-insensitive (verified: /Display-Vendors/… and /WEBXR
      // both redirect), so one lowercase rule covers every casing.
      { source: "/display-vendors/:path*", destination: "/vendors", permanent: true },
      { source: "/README.md", destination: "/", permanent: true },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
