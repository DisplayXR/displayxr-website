import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { REPO_URLS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Architecture",
  description:
    "How the DisplayXR stack works — from OpenXR API layer through native compositors to vendor display processors.",
};

function ArchDiagram() {
  return (
    <div className="my-12 bg-surface border border-border rounded-lg p-8 overflow-x-auto">
      <div className="flex flex-col items-center gap-0 font-mono text-sm min-w-[400px]">
        {/* App layer */}
        <div className="bg-accent/10 border border-accent/30 rounded-lg px-8 py-3 text-accent font-semibold">
          App (any graphics API)
        </div>
        <div className="w-px h-6 bg-border" />

        {/* OpenXR API */}
        <div className="bg-surface border border-border rounded-lg px-8 py-3 text-text-primary font-semibold">
          OpenXR API Layer
        </div>
        <div className="w-px h-6 bg-border" />

        {/* DisplayXR Runtime */}
        <div className="bg-accent/10 border border-accent/30 rounded-lg px-10 py-3 text-accent font-semibold">
          DisplayXR Runtime
        </div>
        <div className="w-px h-6 bg-border" />

        {/* Native Compositors */}
        <div className="flex gap-2 flex-wrap justify-center">
          {["D3D11", "D3D12", "Vulkan", "Metal", "OpenGL"].map((api) => (
            <div
              key={api}
              className="bg-surface border border-border rounded px-4 py-2 text-text-secondary text-xs font-medium"
            >
              {api}
            </div>
          ))}
        </div>
        <div className="w-px h-6 bg-border" />

        {/* Display Processor */}
        <div className="bg-warning/10 border border-warning/30 rounded-lg px-8 py-3 text-warning font-semibold text-xs">
          Display Processor (vendor-specific)
        </div>
        <div className="w-px h-6 bg-border" />

        {/* 3D Display */}
        <div className="bg-success/10 border border-success/30 rounded-lg px-8 py-3 text-success font-semibold">
          3D Display
        </div>
      </div>
    </div>
  );
}

export default function ArchitecturePage() {
  return (
    <PageLayout
      title="Architecture"
      description="How the DisplayXR stack works, from OpenXR API layer through native compositors to vendor display processors."
    >
      <div className="max-w-3xl space-y-12">
        {/* Stack Overview */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
            Stack Overview
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            DisplayXR sits between the OpenXR API and vendor-specific display
            hardware. Applications write to the standard OpenXR interface.
            DisplayXR handles session management, compositor orchestration, and
            extension dispatch. Vendor-specific processing — weaving,
            interlacing, calibration — happens below, in the display processor
            layer.
          </p>
          <ArchDiagram />
          <p className="text-sm text-text-secondary italic">
            Each graphics API gets its own native compositor. No cross-API
            interop or Vulkan intermediary is required.
          </p>
        </section>

        {/* Native Compositor Model */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
            Native Compositor Model
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Most XR runtimes use a single graphics API internally and translate
            submitted textures as needed. DisplayXR takes a different approach:
            each supported graphics API has its own dedicated compositor
            implementation.
          </p>
          <div className="bg-surface border border-border rounded-lg p-6 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-accent font-mono text-sm shrink-0">D3D11</span>
              <span className="text-text-secondary text-sm">
                Full compositor with LeiaSR weaver integration and window
                binding support.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent font-mono text-sm shrink-0">D3D12</span>
              <span className="text-text-secondary text-sm">
                Native compositor with window binding. Command queue managed per
                session.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent font-mono text-sm shrink-0">Vulkan</span>
              <span className="text-text-secondary text-sm">
                Native compositor with swapchain management. MoltenVK path
                available on macOS.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent font-mono text-sm shrink-0">Metal</span>
              <span className="text-text-secondary text-sm">
                Native compositor with sim_display weaver and window binding.
                macOS primary path.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent font-mono text-sm shrink-0">OpenGL</span>
              <span className="text-text-secondary text-sm">
                Native compositor supporting both Windows and macOS contexts.
              </span>
            </div>
          </div>
        </section>

        {/* Per-Graphics-API Design */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
            Per-Graphics-API Design
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            This per-API design means no texture copies between APIs, no
            translation overhead, and no dependency on a single &quot;blessed&quot;
            graphics backend. The compositor that runs is the one that matches
            the application&apos;s chosen API.
          </p>
          <p className="text-text-secondary leading-relaxed">
            The runtime selects the correct compositor at session creation time
            based on the graphics binding the application provides. This is
            transparent to the application — it simply uses OpenXR as normal.
          </p>
        </section>

        {/* Separation of Concerns */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
            Separation of Concerns
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            DisplayXR draws a clean boundary between two responsibilities:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-sm font-semibold text-accent mb-2">
                App-Facing Portability
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Standard OpenXR API, session management, swapchain handling,
                extension dispatch. Applications write once against this
                interface.
              </p>
            </div>
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-sm font-semibold text-warning mb-2">
                Vendor-Specific Processing
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Weaving, interlacing, calibration, eye tracking integration. This
                lives in the display processor layer and is owned by the hardware
                vendor.
              </p>
            </div>
          </div>
        </section>

        {/* Simulation Driver */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
            Simulation Driver
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            DisplayXR includes a simulation display processor (
            <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-sm font-mono">
              sim_display
            </code>
            ) that allows development and testing without physical 3D display
            hardware. It provides the same interface as a hardware-backed display
            processor but renders to a standard window.
          </p>
          <p className="text-text-secondary leading-relaxed">
            This means developers can build, test, and iterate on spatial display
            applications using any standard monitor. The simulation path supports
            all graphics APIs and all application classes.
          </p>
        </section>

        {/* Source link */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-text-secondary">
            Explore the runtime source code on{" "}
            <a
              href={REPO_URLS.runtime}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
