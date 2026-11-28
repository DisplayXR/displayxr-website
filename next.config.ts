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
      // 2026-10: the vendor page became the component-model page (ADR-054).
      // 2026-11: /components moved under Developers, and the Catalog folded into
      // /download ("Get DisplayXR": add-ons are its #addon-* cards) and the
      // component-model page (its publisher half). Hashes survive a redirect,
      // so /components#input-providers still lands on its section.
      { source: "/vendors", destination: "/developers/components", permanent: true },
      { source: "/display-vendors/:path*", destination: "/developers/components", permanent: true },
      { source: "/components", destination: "/developers/components", permanent: true },
      { source: "/catalog", destination: "/download#addons", permanent: true },
      { source: "/catalog/games", destination: "/play", permanent: true },
      // Items first (more specific), then their shelves.
      { source: "/catalog/workspaces/shell", destination: "/download#addon-shell", permanent: true },
      { source: "/catalog/viewer-tracking/tracking-open", destination: "/download#addon-head-tracking", permanent: true },
      { source: "/catalog/apps/browser", destination: "/browser", permanent: true },
      { source: "/catalog/apps/media-player-pro", destination: "/apps/media-player-pro", permanent: true },
      { source: "/catalog/sdks/web-sdk", destination: "/browser#build", permanent: true },
      { source: "/catalog/sdks/:id(unity|unreal)", destination: "/developers", permanent: true },
      { source: "/catalog/sdks/:id*", destination: "/developers/components", permanent: true },
      { source: "/catalog/input/:id*", destination: "/developers/components#input-providers", permanent: true },
      { source: "/catalog/2d-to-3d/sim-conversion", destination: "/developers/components#conversion-providers", permanent: true },
      { source: "/catalog/2d-to-3d/:id*", destination: "/download", permanent: true },
      { source: "/catalog/displays/sim-display", destination: "/developers/components#display-processors", permanent: true },
      { source: "/catalog/displays/:id*", destination: "/download", permanent: true },
      { source: "/catalog/viewer-tracking/:id*", destination: "/download#addon-head-tracking", permanent: true },
      { source: "/catalog/workspaces/:id*", destination: "/download#addon-shell", permanent: true },
      { source: "/catalog/apps/:id*", destination: "/demos", permanent: true },
      { source: "/catalog/companions/:id*", destination: "/developers/components#publish", permanent: true },
      { source: "/catalog/:rest*", destination: "/download#addons", permanent: true },
      { source: "/README.md", destination: "/", permanent: true },
      // Short, ours-for-good address for the DisplayXR Discord. Temporary (307)
      // on purpose: if the invite is ever replaced, only this line and
      // DISCORD_URL in lib/constants.ts change, and no browser has cached the old one.
      { source: "/discord", destination: "https://discord.gg/AHW4sUT66z", permanent: false },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
