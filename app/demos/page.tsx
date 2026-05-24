import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { REPO_URLS } from "@/lib/constants";
import { Monitor, Boxes, Sparkles, Gamepad2 } from "lucide-react";
import type { ReactNode } from "react";
import type { Status } from "@/lib/data/compatibility";

export const metadata: Metadata = {
  title: "Demos",
  description:
    "Demo applications showcasing DisplayXR capabilities. No hardware required — try with simulation mode.",
};

type Demo = {
  title: string;
  description: string;
  status: Status;
  icon: ReactNode;
  tags: string[];
  repo?: string;
};

const demos: Demo[] = [
  {
    title: "Cube Demo",
    description:
      "A minimal OpenXR application rendering a 3D cube through DisplayXR. Available for all supported graphics APIs. The simplest starting point for understanding the runtime.",
    status: "shipping",
    icon: <Boxes size={20} />,
    tags: ["All APIs", "Simulation", "Minimal"],
    repo: `${REPO_URLS.runtime}/tree/main/test_apps`,
  },
  {
    title: "Gaussian Splatting Viewer",
    description:
      "Real-time 3D gaussian splatting rendering through DisplayXR. Demonstrates the runtime's ability to handle advanced rendering techniques on spatial displays. Loads .spz and .ply files; bundled butterfly scene.",
    status: "shipping",
    icon: <Sparkles size={20} />,
    tags: ["Windows", "Vulkan", "macOS"],
    repo: REPO_URLS.demoGaussiansplat,
  },
  {
    title: "Unity Sample Scene",
    description:
      "Ready-to-open Unity 6 project demonstrating the DisplayXR Unity plugin. Sample scene runs in simulation mode or on a connected 3D display.",
    status: "active",
    icon: <Monitor size={20} />,
    tags: ["Unity 6", "UPM"],
    repo: REPO_URLS.unityTest,
  },
  {
    title: "Unreal Sample Scene",
    description:
      "Ready-to-open Unreal Engine project demonstrating the DisplayXR Unreal plugin. Sample scene runs in simulation mode or on a connected 3D display.",
    status: "beta",
    icon: <Gamepad2 size={20} />,
    tags: ["Unreal", "UE 5.7"],
    repo: REPO_URLS.unrealTest,
  },
];

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

        {/* Demo cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demos.map((demo) => (
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
              {demo.repo && (
                <a
                  href={demo.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm text-accent hover:text-accent-hover underline underline-offset-2"
                >
                  View repo →
                </a>
              )}
            </Card>
          ))}
        </div>

        {/* Source link */}
        <div className="pt-8 border-t border-border">
          <p className="text-text-secondary">
            Each card links to its source. Standalone demos go in their own
            repo under the{" "}
            <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-xs font-mono">
              displayxr-demo-&lt;name&gt;
            </code>{" "}
            convention (currently just Gaussian Splat); the Cube samples ship
            with the runtime under{" "}
            <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-xs font-mono">
              displayxr-runtime/test_apps
            </code>
            , and engine sample scenes live in their matching{" "}
            <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-xs font-mono">
              *-test
            </code>{" "}
            companion repos. See the{" "}
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
