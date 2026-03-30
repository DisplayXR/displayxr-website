import { AnimateIn } from "@/components/ui/AnimateIn";

export function WhyNowSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 md:px-12 py-24">
      <div className="section-divider mb-24" />
      <AnimateIn>
        <div className="max-w-2xl">
          <h2 className="text-sm font-medium text-accent uppercase tracking-wider mb-4">
            Why Now
          </h2>
          <h3 className="text-3xl md:text-4xl font-display tracking-tight text-text-primary mb-8">
            Spatial computing is not headset-only
          </h3>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              Spatial computing is still largely framed around headsets. But
              spatial displays are becoming a real category — tracked
              glasses-free 3D monitors, laptops, and related display systems are
              shipping from multiple vendors.
            </p>
            <p>
              These devices need a common interface layer. Without one, the
              ecosystem fragments before it has a chance to grow. DisplayXR
              brings that missing layer, so developers and hardware vendors can
              build against a shared interface rather than isolated SDKs.
            </p>
          </div>
        </div>
      </AnimateIn>
    </section>
  );
}
