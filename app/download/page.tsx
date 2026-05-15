import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import { REPO_URLS } from "@/lib/constants";
import { Package, LayoutGrid, Bot, Download } from "lucide-react";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Download DisplayXR",
  description:
    "Direct installer downloads for the DisplayXR runtime, shell, and MCP tools.",
};

type Requirement = "Required" | "Optional";

type Installer = {
  name: string;
  pitch: string;
  filename: string;
  requirement: Requirement;
  releasesUrl: string;
  icon: ReactNode;
};

const installers: Installer[] = [
  {
    name: "DisplayXR Runtime",
    pitch:
      "OpenXR runtime + Windows service. Install this first; everything else depends on it.",
    filename: "DisplayXRSetup-*.exe",
    requirement: "Required",
    releasesUrl: `${REPO_URLS.runtime}/releases/latest`,
    icon: <Package size={20} />,
  },
  {
    name: "DisplayXR Shell",
    pitch:
      "Reference spatial-workspace UX — 3D window manager with multi-app compositing and dynamic layouts.",
    filename: "DisplayXRShellSetup-*.exe",
    requirement: "Optional",
    releasesUrl: `${REPO_URLS.shell}/releases/latest`,
    icon: <LayoutGrid size={20} />,
  },
  {
    name: "DisplayXR MCP Tools",
    pitch:
      "AI-agent + voice control. Writes the Capabilities\\MCP registry flag the runtime and shell read at startup.",
    filename: "DisplayXRMCPSetup-*.exe",
    requirement: "Optional",
    releasesUrl: `${REPO_URLS.mcp}/releases/latest`,
    icon: <Bot size={20} />,
  },
];

const requirementChipClass: Record<Requirement, string> = {
  Required: "bg-success/15 text-success border-success/30",
  Optional:
    "bg-text-secondary/15 text-text-secondary border-text-secondary/30",
};

export default function DownloadPage() {
  return (
    <PageLayout
      title="Download"
      description="Three small Windows installers. Install in order — Runtime first, then Shell and MCP Tools as needed."
    >
      <div className="space-y-10">
        {/* Pointer for first-timers */}
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-5">
          <p className="text-sm text-text-secondary leading-relaxed">
            <strong className="text-text-primary">First time installing?</strong>{" "}
            The{" "}
            <a
              href="/getting-started"
              className="text-accent hover:text-accent-hover underline underline-offset-2 font-medium"
            >
              Get Started
            </a>{" "}
            walkthrough covers prerequisites, install order, verification,
            and first launch. This page is the quick installer index for
            returning users.
          </p>
        </div>

        {/* Installer cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {installers.map((installer) => (
            <Card
              key={installer.name}
              title={installer.name}
              icon={installer.icon}
            >
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                {installer.pitch}
              </p>
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                    requirementChipClass[installer.requirement]
                  }`}
                >
                  {installer.requirement}
                </span>
                <code className="text-xs text-text-secondary bg-background px-2 py-0.5 rounded border border-border font-mono">
                  {installer.filename}
                </code>
              </div>
              <a
                href={installer.releasesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover underline underline-offset-2 font-medium"
              >
                <Download size={14} />
                Latest release
              </a>
            </Card>
          ))}
        </div>

        {/* macOS footnote */}
        <p className="text-sm text-text-secondary leading-relaxed">
          <strong className="text-text-primary">On macOS?</strong> No packaged
          installer yet — see the{" "}
          <a
            href="/getting-started"
            className="text-accent hover:text-accent-hover underline underline-offset-2"
          >
            macOS source-build walkthrough
          </a>
          .
        </p>
      </div>
    </PageLayout>
  );
}
