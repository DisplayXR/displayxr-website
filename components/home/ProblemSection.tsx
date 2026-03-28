export function ProblemSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 md:px-12 py-24">
      <div className="max-w-2xl">
        <h2 className="text-sm font-medium text-accent uppercase tracking-wider mb-4">
          The Problem
        </h2>
        <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary mb-8">
          Spatial displays deserve a common interface
        </h3>
        <div className="space-y-4 text-text-secondary leading-relaxed">
          <p>
            OpenXR standardized how applications talk to headsets and controllers.
            But a growing category of spatial displays — tracked glasses-free 3D
            monitors, laptops, and related systems — has no equivalent.
          </p>
          <p>
            Today, every vendor ships its own SDK with its own compositor, its
            own rendering path, and its own way of handling eye tracking and
            display geometry. Developers who want to target multiple displays
            must write and maintain separate integrations for each.
          </p>
          <p>
            The result is fragmentation: duplicated effort, inconsistent
            behavior, and a higher barrier for both developers and vendors
            entering the space.
          </p>
        </div>
      </div>
    </section>
  );
}
