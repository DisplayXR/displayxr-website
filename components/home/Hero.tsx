import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { GITHUB_ORG_URL } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Hero background image */}
      <Image
        src="/diagrams/hero-bg.jpeg"
        alt=""
        fill
        className="object-cover opacity-40"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />

      <div className="relative mx-auto max-w-[1200px] px-6 md:px-12 pt-24 pb-32 md:pt-32 md:pb-40">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-text-primary leading-[1.1] mb-6">
            OpenXR for glasses-free 3D displays
          </h1>
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-10 max-w-2xl">
            DisplayXR is an open runtime and extension stack for tracked spatial
            displays. It helps developers build portable 3D display applications
            across engines, graphics APIs, and vendor-specific hardware runtimes.
          </p>
          <div className="flex flex-wrap gap-4">
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
