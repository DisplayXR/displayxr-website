import { Button } from "@/components/ui/Button";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { GITHUB_ORG_URL } from "@/lib/constants";

export function CTASection() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 md:px-12 py-24">
      <div className="section-divider mb-24" />
      <AnimateIn>
        <div className="gradient-border rounded-2xl p-12 md:p-16 text-center glow-accent">
          <h2 className="text-3xl md:text-4xl font-display tracking-tight text-text-primary mb-4">
            Try it. Fork it. Ship it.
          </h2>
          <p className="text-text-secondary mb-8 max-w-xl mx-auto leading-relaxed">
            Try the runtime in simulation with no hardware at all. Fork a
            reference demo and swap in your own content. Or write a plug-in and
            bring your display to the platform — no licence, no fee, no
            permission.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/docs">Read the Docs</Button>
            <Button variant="secondary" href="/demos">
              Explore Demos
            </Button>
            <Button variant="secondary" href={GITHUB_ORG_URL}>
              View on GitHub
            </Button>
          </div>
        </div>
      </AnimateIn>
    </section>
  );
}
