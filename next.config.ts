import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  async redirects() {
    // Status + Compatibility merged into one Platform Support page.
    return [
      { source: "/status", destination: "/platform-support", permanent: true },
      {
        source: "/compatibility",
        destination: "/platform-support",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
