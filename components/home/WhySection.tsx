import Image from "next/image";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { OPENXR_GAPS } from "@/lib/data/openxr-gaps";

/**
 * Why DisplayXR exists, in the order the argument runs: content is written
 * once per display today; OpenXR is the standard to build on; and the four
 * ways a display differs from a headset are what the XR_DXR_* extensions add.
 * DisplayXR extends OpenXR. Never frame it as a replacement.
 */
export function WhySection() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 md:px-12 py-24">
      <div className="section-divider mb-24" />
      <AnimateIn>
        <div className="max-w-2xl">
          <h2 className="text-sm font-medium text-accent uppercase tracking-wider mb-4">
            Why it exists
          </h2>
          <h3 className="text-3xl md:text-4xl font-display tracking-tight text-text-primary mb-6">
            Write once, for every spatial display
          </h3>
          <p className="text-text-secondary leading-relaxed mb-4">
            Today every spatial display ships its own SDK, so an app is written
            again for each one, or not at all. OpenXR already solved this for
            headsets: one standard, any device.
          </p>
          <p className="text-text-secondary leading-relaxed">
            DisplayXR builds on OpenXR rather than starting over. It is an
            open-source OpenXR runtime that runs the official Khronos
            conformance suite, plus the <code className="font-mono text-sm">XR_DXR_*</code>{" "}
            extensions OpenXR needs for spatial displays. Display vendors plug
            in underneath; apps never see the difference.
          </p>
        </div>
        <div className="mt-10 max-w-4xl border border-border rounded-lg overflow-hidden">
          <Image
            src="/diagrams/dxr-fragmentation.svg"
            unoptimized
            alt="Without a standard, one app needs a separate SDK integration per display; with DisplayXR, the same app hits one OpenXR target and runs on any display."
            width={1100}
            height={440}
            className="w-full h-auto"
          />
        </div>
      </AnimateIn>

      <AnimateIn delay={80}>
        <h4 className="mt-16 mb-2 text-xl font-semibold text-text-primary">
          Where a display differs from a headset
        </h4>
        <p className="mb-8 max-w-2xl text-text-secondary leading-relaxed">
          OpenXR was written for headsets, which are worn and own the whole
          view. A display sits on a desk and shares its screen with 2D. Four
          examples of what the extensions add:
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {OPENXR_GAPS.map((g) => (
            <div key={g.id} className="rounded-lg border border-border bg-surface p-6">
              <h5 className="mb-3 font-semibold text-text-primary">{g.title}</h5>
              <p className="mb-2 text-sm leading-relaxed text-text-secondary">
                <span className="text-text-primary">Headset:</span> {g.headset}
              </p>
              <p className="text-sm leading-relaxed text-text-secondary">
                <span className="text-accent">DisplayXR adds:</span> {g.adds}
              </p>
            </div>
          ))}
        </div>
        <a href="/about" className="mt-6 inline-block text-sm text-accent hover:text-accent-hover">
          What is a spatial display? →
        </a>
      </AnimateIn>
    </section>
  );
}
