import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import { REPO_URLS } from "@/lib/constants";
import { Package, LayoutGrid, Bot, Download, Layers, Glasses, Globe, AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Download DisplayXR",
  description:
    "Installer downloads for DisplayXR — the all-in-one bundle, or the runtime, shell, Leia SR plug-in, and MCP tools individually.",
};

type Requirement = "Required" | "Optional";

type Installer = {
  name: string;
  pitch: string;
  filename: string;
  requirement: Requirement;
  platforms: string;
  releasesUrl: string;
  icon: ReactNode;
};

const installers: Installer[] = [
  {
    name: "DisplayXR Runtime",
    pitch:
      "OpenXR runtime + service. Install this first; everything else depends on it.",
    filename: "DisplayXRSetup-*.exe · DisplayXR-Installer-*.pkg",
    requirement: "Required",
    platforms: "Windows · macOS",
    releasesUrl: `${REPO_URLS.runtime}/releases/latest`,
    icon: <Package size={20} />,
  },
  {
    name: "DisplayXR Shell",
    pitch:
      "Reference spatial-workspace UX — 3D window manager with multi-app compositing and dynamic layouts.",
    filename: "DisplayXRShellSetup-*.exe",
    requirement: "Optional",
    platforms: "Windows",
    releasesUrl: `${REPO_URLS.shell}/releases/latest`,
    icon: <LayoutGrid size={20} />,
  },
  {
    name: "Leia SR Plug-in",
    pitch:
      "Display-processor plug-in for Leia SR hardware. The runtime discovers it at startup. Windows-only because the Leia SR SDK is Windows-only.",
    filename: "DisplayXRLeiaSRSetup-*.exe",
    requirement: "Optional",
    platforms: "Windows",
    releasesUrl: `${REPO_URLS.leiaPlugin}/releases/latest`,
    icon: <Glasses size={20} />,
  },
  {
    name: "DisplayXR MCP Tools",
    pitch:
      "AI-agent + voice control. Writes the Capabilities\\MCP registry flag the runtime and shell read at startup.",
    filename: "DisplayXRMCPSetup-*.exe",
    requirement: "Optional",
    platforms: "Windows",
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
      description="Start with the all-in-one bundle, or grab individual components below. The runtime is required; the shell, Leia SR plug-in, and MCP tools are optional."
    >
      <div className="space-y-10">
        {/* Meta-installer — start here */}
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-accent">
              <Layers size={22} />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">
              All-in-one installer (recommended)
            </h2>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            The{" "}
            <a
              href={REPO_URLS.installer}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-2 font-medium"
            >
              DisplayXR meta-installer
            </a>{" "}
            bundles the runtime, shell, and plug-ins into a single download
            with pinned, compatible versions — the simplest way to get a
            working setup. Prefer it unless you need a specific component
            version. (v1 ships unsigned; your OS may warn on first launch.)
          </p>
          <a
            href={`${REPO_URLS.installer}/releases/latest`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover underline underline-offset-2 font-medium"
          >
            <Download size={14} />
            Latest bundle release
          </a>
        </div>

        {/* DisplayXR Browser — developer preview */}
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-accent">
              <Globe size={22} />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">
              DisplayXR Browser{" "}
              <span className="align-middle inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border border-accent/30 text-accent bg-accent/10">
                Developer Preview
              </span>
            </h2>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            A Chromium-based browser that renders the whole web normally{" "}
            <strong className="text-text-primary">and</strong> weaves glasses-free 3D for{" "}
            <a href="/webxr" className="text-accent hover:text-accent-hover underline underline-offset-2 font-medium">
              inline-3D WebXR
            </a>{" "}
            pages on DisplayXR hardware — the surrounding 2D page stays flat. On any other machine it is
            an ordinary browser. <strong className="text-text-primary">Windows</strong>, and it needs a
            DisplayXR 3D display + the runtime and a display plug-in (the installer chains/detects them).
          </p>
          {/* Security disclaimer — mandatory, locked policy */}
          <div className="flex items-start gap-2.5 bg-warning/10 border border-warning/30 rounded-md p-3 mb-4">
            <div className="text-warning mt-0.5 shrink-0">
              <AlertTriangle size={16} />
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              <strong className="text-text-primary">Developer preview.</strong> Rebased ~monthly onto
              Chrome stable, but <strong className="text-text-primary">not</strong> maintained to
              Chrome&rsquo;s mid-cycle security cadence — don&rsquo;t use it for sensitive browsing; use
              your primary browser for banking, etc.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href={`${REPO_URLS.browser}/releases/latest`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover underline underline-offset-2 font-medium"
            >
              <Download size={14} />
              Latest preview release
            </a>
            <a
              href={REPO_URLS.web}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover underline underline-offset-2 font-medium"
            >
              <Globe size={14} />
              inline-3D web samples
            </a>
          </div>
        </div>

        {/* Pointer for first-timers */}
        <div className="bg-surface border border-border rounded-lg p-5">
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
            and first launch. The individual installers below are for users
            who want to manage components separately.
          </p>
        </div>

        {/* Installer cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-accent/30 text-accent bg-accent/10">
                  {installer.platforms}
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
          <strong className="text-text-primary">On macOS?</strong> The runtime
          ships a{" "}
          <code className="text-xs bg-background px-1.5 py-0.5 rounded border border-border font-mono">
            .pkg
          </code>{" "}
          installer (install from Terminal with{" "}
          <code className="text-xs bg-background px-1.5 py-0.5 rounded border border-border font-mono">
            sudo installer
          </code>{" "}
          to bypass the Gatekeeper warning on the unsigned package). The shell,
          Leia SR plug-in, and MCP tools are Windows-only today. See the{" "}
          <a
            href="/getting-started"
            className="text-accent hover:text-accent-hover underline underline-offset-2"
          >
            Get Started
          </a>{" "}
          walkthrough for the macOS flow.
        </p>
      </div>
    </PageLayout>
  );
}
