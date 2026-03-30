import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { GITHUB_ORG_URL } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Hero background image */}
      <Image
        src="/diagrams/hero-v2-display.jpeg"
        alt=""
        fill
        className="object-cover opacity-50"
        priority
      />

      {/* Animated grid overlay */}
      <div className="absolute inset-0 hero-grid" />

      {/* Gradient orb glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/8 rounded-full blur-[120px]" />

      {/* Bottom gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background" />

      <div className="relative mx-auto max-w-[1200px] px-6 md:px-12 pt-28 pb-36 md:pt-36 md:pb-44">
        <div className="max-w-3xl">
          <h1 className="hero-animate text-4xl md:text-6xl lg:text-7xl font-display tracking-tight text-text-primary leading-[1.05] mb-6">
            OpenXR for Spatial Displays
          </h1>
          <p className="hero-animate hero-animate-delay-1 text-lg md:text-xl text-text-secondary leading-relaxed mb-10 max-w-2xl">
            DisplayXR is an open runtime and extension stack for 3D displays,
            including tracked stereo and multiview lightfield displays. Build
            portable spatial display applications across engines, graphics APIs,
            and vendor hardware runtimes.
          </p>
          <div className="hero-animate hero-animate-delay-2 flex flex-wrap gap-4">
            <Button href="/docs">Read the Docs</Button>
            <Button variant="secondary" href={GITHUB_ORG_URL}>
              Explore on GitHub
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
