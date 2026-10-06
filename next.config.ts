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
      // 2026-10 overhaul: the DisplayXR Browser's home is /browser (it absorbed
      // /webxr; /web was its working name and never shipped). The /docs link
      // list folded into the /developers hub. The old manual install flow
      // (/getting-started) became the native quickstart.
      { source: "/webxr", destination: "/browser", permanent: true },
      { source: "/web", destination: "/browser", permanent: true },
      { source: "/docs", destination: "/developers", permanent: true },
      { source: "/getting-started", destination: "/developers/native", permanent: true },
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
