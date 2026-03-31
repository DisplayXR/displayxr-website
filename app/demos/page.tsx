import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { REPO_URLS } from "@/lib/constants";
import { Monitor, Boxes, Sparkles, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "Demos",
  description:
    "Demo applications showcasing DisplayXR capabilities. No hardware required — try with simulation mode.",
};

const demos = [
  {
    title: "Cube Demo",
    description:
      "A minimal OpenXR application rendering a 3D cube through DisplayXR. Available for all supported graphics APIs. The simplest starting point for understanding the runtime.",
    status: "shipping" as const,
    icon: <Boxes size={20} />,
    tags: ["All APIs", "Simulation", "Minimal"],
  },
  {
    title: "Gaussian Splatting Viewer",
    description:
      "Real-time 3D gaussian splatting rendering through DisplayXR. Demonstrates the runtime's ability to handle advanced rendering techniques on spatial displays.",
    status: "shipping" as const,
    icon: <Sparkles size={20} />,
    tags: ["D3D11", "Advanced"],
  },
  {
    title: "Unity Sample Scene",
    description:
      "A Unity sample scene demonstrating the DisplayXR Unity plugin (UPM). Shows how to set up a Unity project targeting spatial displays.",
    status: "active" as const,
    icon: <Monitor size={20} />,
    tags: ["Unity", "UPM"],
  },
  {
    title: "Eye Tracking Visualization",
    description:
      "Demonstrates real-time eye tracking integration with the Leia SR SDK backend. Visualizes tracked eye positions and head pose.",
    status: "shipping" as const,
    icon: <Eye size={20} />,
    tags: ["LeiaSR", "Eye Tracking"],
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
            </Card>
          ))}
        </div>

        {/* Source link */}
        <div className="pt-8 border-t border-border">
          <p className="text-text-secondary">
            All demo source code is available in the{" "}
            <a
              href={REPO_URLS.demos}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              displayxr-demos
            </a>{" "}
            repository.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
