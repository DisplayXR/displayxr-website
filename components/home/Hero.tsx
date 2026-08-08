import { Button } from "@/components/ui/Button";
import { NewsTicker } from "@/components/home/NewsTicker";
import { GITHUB_ORG_URL } from "@/lib/constants";
import { getBannerNews } from "@/lib/data/news";

export function Hero() {
  // Filtered server-side; renders nothing once the pool ages out.
  const news = getBannerNews();

  return (
    <section className="relative overflow-hidden">
      {/* Hero background animation (ping-pong palindrome loop) */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-50"
        src="/videos/hero-loop.mp4"
        poster="/videos/hero-loop-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
      />

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
          <p className="hero-animate hero-animate-delay-1 text-lg md:text-xl text-text-secondary leading-relaxed mb-10 max-w-2xl">
            <span className="text-text-primary font-medium">
              Write once. Run on any spatial display.
            </span>{" "}
            DisplayXR is an open platform for spatial displays — OpenXR
            extension specifications, a reference runtime, and reference
            implementations — for tracked stereo and multiview lightfield
            3D, portable across engines, graphics APIs, and vendor hardware.
          </p>
          <div className="hero-animate hero-animate-delay-2 flex flex-wrap gap-4">
            <Button href="/getting-started">Get Started</Button>
            <Button variant="secondary" href="/docs">
              Read the Docs
            </Button>
            <Button variant="secondary" href={GITHUB_ORG_URL}>
              Explore on GitHub
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
