import { Button } from "@/components/ui/Button";
import { DownloadButton } from "@/components/download/DownloadButton";
import { NewsTicker } from "@/components/home/NewsTicker";
import { HeroVideo } from "@/components/home/HeroVideo";
import { getBannerNews } from "@/lib/data/news";

export function Hero() {
  // Filtered server-side; renders nothing once the pool ages out.
  const news = getBannerNews();

  return (
    <section className="relative overflow-hidden">
      <HeroVideo />

      {/* Animated grid overlay */}
      <div className="absolute inset-0 hero-grid" />

      {/* Gradient orb glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/8 rounded-full blur-[120px]" />

      {/* Bottom gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background" />

      <div className="relative mx-auto max-w-[1200px] px-6 md:px-12 pt-28 pb-36 md:pt-36 md:pb-44">
        <div className="max-w-3xl">
          <NewsTicker items={news} />
          <h1 className="hero-animate text-4xl md:text-6xl lg:text-7xl font-display tracking-tight text-text-primary leading-[1.05] mb-6">
            OpenXR for Spatial Displays
          </h1>
          {/* What DisplayXR IS, in one breath. "Agent-ready" is the honest form
              of the agentic claim: an MCP server is built into the runtime
              (per-app introspection, XR_DXR_mcp_tools) and the shell, opt-in
              via the MCP Tools installer; the browser is not part of it. */}
          <p className="hero-animate hero-animate-delay-1 text-lg md:text-xl text-text-secondary leading-relaxed mb-10 max-w-2xl">
            <span className="text-text-primary font-medium">
              Write once. Run on any spatial display.
            </span>{" "}
            DisplayXR is the OpenXR extensions spatial displays need, an
            open-source reference runtime, Unity and Unreal plug-ins, and a
            browser for 3D on the web. Portable across engines, graphics APIs
            and display makers, and agent-ready, with MCP built into the
            runtime.
          </p>
          {/* Stacked below sm, side by side above: never flex-wrap. The
              download label is OS-detected after hydration ("Get DisplayXR"
              becomes "Get DisplayXR for Android"), and on a phone the longer
              label wrapped "Build something" onto a second row, growing the
              hero by 60px after first paint: the homepage's only layout
              shift (mobile CLS 0.039). A fixed column keeps the height the
              same whatever the label says. */}
          <div className="hero-animate hero-animate-delay-2 flex flex-col gap-4 sm:flex-row">
            <DownloadButton />
            <Button variant="secondary" href="/developers">
              Build something
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
