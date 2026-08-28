import Image from "next/image";
import { AnimateIn } from "@/components/ui/AnimateIn";

export function ProblemSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 md:px-12 py-24">
      <div className="section-divider mb-24" />
      <AnimateIn>
        <div className="max-w-2xl">
          <h2 className="text-sm font-medium text-accent uppercase tracking-wider mb-4">
            The Problem
          </h2>
          <h3 className="text-3xl md:text-4xl font-display tracking-tight text-text-primary mb-8">
            The hardware is solved. The ecosystem is not.
          </h3>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              OpenXR standardized how applications talk to headsets and
              controllers. But a growing category of spatial displays — tracked
              spatial display monitors, laptops, and related systems — has no
              equivalent.
            </p>
            <p>
              Today, every vendor ships its own SDK with its own compositor, its
              own rendering path, and its own way of handling eye tracking and
              display geometry. So the bottleneck in this category is not the
              optics. It is content, and the reason is arithmetic:
            </p>
            <p>
              <span className="text-text-primary font-medium">
                A developer has to author it again for every display.
              </span>{" "}
              Nobody does that four times, so most do it zero times.{" "}
              <span className="text-text-primary font-medium">
                A display vendor has to ship an entire authoring toolchain with
                its panel
              </span>{" "}
              — a runtime, an SDK, a content pipeline, developer relations —
              or ship a panel with nothing to run on it. Neither cost scales,
              and both are paid over and over for the same result.
            </p>
          </div>
        </div>
        <div className="mt-12 max-w-4xl border border-border rounded-lg overflow-hidden">
          <Image
            src="/diagrams/dxr-fragmentation.svg"
            unoptimized
            alt="Without a standard, one app needs five separate SDK integrations for five displays; with DisplayXR, the same app hits one OpenXR target and runs on any display."
            width={1100}
            height={440}
            className="w-full h-auto"
          />
        </div>
      </AnimateIn>
    </section>
  );
}
