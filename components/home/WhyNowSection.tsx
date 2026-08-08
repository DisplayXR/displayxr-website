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
              spatial displays are becoming a real category — tracked spatial
              display monitors, laptops, and Android devices are already shipping
              from <span className="text-text-primary font-medium">Samsung,
              Acer, Lenovo, ZTE, and Barco</span>, with more vendors on the way.
            </p>
            <p>
              These devices need a common interface layer. Without one, the
              ecosystem fragments before it has a chance to grow. DisplayXR
              brings that missing layer, so developers and hardware vendors can
              build against a shared interface rather than isolated SDKs.
            </p>
            <p>
              The end goal is not a parallel standard — it&apos;s{" "}
              <span className="text-text-primary font-medium">the standard</span>.
              The 3D-display extensions ship under the project&apos;s own{" "}
              <span className="text-text-primary font-medium">DXR</span> author
              tag, registered with Khronos in July 2026, and are designed to be
              upstreamed as cross-vendor KHR extensions — with DisplayXR as the
              open reference implementation, validated against the official
              OpenXR conformance suite on every release. An app written once
              runs on any spatial display, exactly as OpenXR did for headsets.
            </p>
          </div>
        </div>
      </AnimateIn>
    </section>
  );
}
