import { Metadata } from "next";
import Image from "next/image";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { REPO_URLS } from "@/lib/constants";
import { demos, engines } from "@/lib/data/generated";
import { Boxes } from "lucide-react";
import type { ReactNode } from "react";
import type { Status } from "@/lib/data/compatibility";

export const metadata: Metadata = {
  title: "Demos",
  description:
    "Demo applications showcasing DisplayXR capabilities. No hardware required — try with simulation mode.",
};

// Editorial overlay merged by id onto the generated demo/engine data. The
// generator owns name/description/icon/version; status + tags stay authored.
// A missing entry falls back to sensible defaults so a new demo still renders.
const demoEditorial: Record<string, { status: Status; tags: string[] }> = {
  modelviewer: { status: "active", tags: ["Windows", "macOS", "Vulkan"] },
  gaussiansplat: { status: "shipping", tags: ["Windows", "macOS", "Vulkan"] },
};

const engineEditorial: Record<string, { status: Status; tags: string[] }> = {
  unity: { status: "active", tags: ["UPM", "Sample scene"] },
  unreal: { status: "beta", tags: ["Blueprint", "Sample scene"] },
};

// Built-in samples that ship inside the runtime tree — no repo of their own,
// no launcher manifest, so they stay authored here.
type BuiltIn = {
  title: string;
  description: string;
  status: Status;
  icon: ReactNode;
  tags: string[];
  repo: string;
};

const builtIns: BuiltIn[] = [
  {
    title: "Cube Demo",
    description:
      "A minimal OpenXR application rendering a 3D cube through DisplayXR. Available for all supported graphics APIs — the simplest starting point for understanding the runtime.",
    status: "shipping",
    icon: <Boxes size={20} />,
    tags: ["All APIs", "Simulation", "Minimal"],
    repo: `${REPO_URLS.runtime}/tree/main/test_apps`,
  },
];

function IconThumb({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
      <Image src={src} alt={alt} width={48} height={48} className="object-contain" />
    </div>
  );
}

export default function DemosPage() {
  return (
    <PageLayout
      title="Demos"
      description="Explore sample applications built with DisplayXR. No hardware required — all demos work in simulation mode."
    >
      <div className="space-y-12">
        {/* No hardware callout */}
        <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-2">
            No hardware required
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            All demos work with the{" "}
            <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-xs font-mono">
              sim_display
            </code>{" "}
            simulation backend. You can build and run them on any standard
            monitor. When a physical 3D display is connected, the same
            application automatically uses the hardware backend.
          </p>
        </div>

        {/* Standalone demos — generated from each demo repo's launcher manifest */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-text-primary">
            Standalone apps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demos.map((demo) => {
              const overlay = demoEditorial[demo.id] ?? {
                status: "active" as Status,
                tags: [],
              };
              return (
                <Card key={demo.id}>
                  <div className="mb-3 flex items-center gap-3">
                    {demo.icon && <IconThumb src={demo.icon} alt={demo.name} />}
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">
                        {demo.name}
                      </h3>
                      {demo.tag && (
                        <span className="font-mono text-xs text-text-secondary">
                          {demo.tag}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">
                    {demo.description}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge status={overlay.status} />
                    {overlay.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-text-secondary bg-background px-2 py-0.5 rounded border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={demo.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm text-accent hover:text-accent-hover underline underline-offset-2"
                  >
                    View repo →
                  </a>
                </Card>
              );
            })}

            {/* Built-in runtime samples */}
            {builtIns.map((demo) => (
              <Card key={demo.title} title={demo.title} icon={demo.icon}>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  {demo.description}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge status={demo.status} />
                  {demo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-text-secondary bg-background px-2 py-0.5 rounded border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={demo.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm text-accent hover:text-accent-hover underline underline-offset-2"
                >
                  View repo →
                </a>
              </Card>
            ))}
          </div>
        </section>

        {/* Engine demos — standalone builds; generated from the plugin + *-test repos */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-text-primary">
            Engine demos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {engines.map((engine) => {
              const overlay = engineEditorial[engine.id] ?? {
                status: "active" as Status,
                tags: [],
              };
              return (
                <Card key={engine.id}>
                  <div className="mb-3 flex items-center gap-3">
                    {engine.logo && (
                      <IconThumb src={engine.logo} alt={engine.name} />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">
                        {engine.name}
                      </h3>
                      <span className="font-mono text-xs text-text-secondary">
                        {[engine.version, engine.engineVersion]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">
                    Standalone {engine.name} demo, built with the DisplayXR{" "}
                    {engine.name} plugin — no plugin install or editor needed to
                    run it. Works in simulation mode or on a connected 3D
                    display.
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge status={overlay.status} />
                    {overlay.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-text-secondary bg-background px-2 py-0.5 rounded border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <a
                      href={engine.testRepoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm text-accent hover:text-accent-hover underline underline-offset-2"
                    >
                      Demo project →
                    </a>
                    <a
                      href={engine.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm text-accent hover:text-accent-hover underline underline-offset-2"
                    >
                      Plugin source →
                    </a>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Source link */}
        <div className="pt-8 border-t border-border">
          <p className="text-text-secondary">
            Demo cards are generated from each demo repo&apos;s{" "}
            <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-xs font-mono">
              *.displayxr.json
            </code>{" "}
            launcher manifest — the same file the Shell reads — so a new demo
            appears here automatically. Standalone demos live in their own{" "}
            <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-xs font-mono">
              displayxr-demo-&lt;name&gt;
            </code>{" "}
            repo; the Cube samples ship with the runtime. See the{" "}
            <a
              href="https://github.com/DisplayXR"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              DisplayXR org page
            </a>{" "}
            for the full list.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
