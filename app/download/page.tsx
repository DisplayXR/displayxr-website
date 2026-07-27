import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import { REPO_URLS } from "@/lib/constants";
import { Package, LayoutGrid, Bot, Download, Layers, Glasses, Globe } from "lucide-react";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Download DisplayXR",
  description:
    "Installer downloads for DisplayXR — the all-in-one bundle, or the runtime, shell, Leia SR plug-in, MCP tools, and the inline-3D browser preview individually.",
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
  links?: { label: string; href: string }[];
};

const installers: Installer[] = [
  {
    name: "DisplayXR Runtime",
    pitch:
      "OpenXR runtime + service. Install this first; everything else depends on it.",
    filename:
      "DisplayXRSetup-*.exe · DisplayXR-Installer-*.pkg · displayxr-runtime_*_amd64.deb",
    requirement: "Required",
    platforms: "Windows · macOS · Linux",
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
  {
    name: "DisplayXR Browser (Developer Preview)",
    pitch:
      "A Chromium-based browser that renders the web normally and weaves glasses-free inline-3D for inline-3d WebXR pages on DisplayXR hardware. Developer preview — rebased ~monthly onto Chrome stable but not patched to Chrome's mid-cycle security cadence; don't use it for sensitive browsing.",
    filename: "DisplayXR-Browser-Preview-Setup-*.exe",
    requirement: "Optional",
    platforms: "Windows",
    // /releases (not /releases/latest): the preview ships as a GitHub *pre-release*,
    // which /releases/latest excludes (404s). The list shows the preview at the top.
    releasesUrl: `${REPO_URLS.browser}/releases`,
    icon: <Globe size={20} />,
    links: [
      { label: "See it live", href: "https://displayxr.github.io/displayxr-web/" },
      { label: "Build inline-3D apps (SDK)", href: REPO_URLS.web },
    ],
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
            version. Windows{" "}
            <code className="text-xs bg-background px-1.5 py-0.5 rounded border border-border font-mono">
              .exe
            </code>
            , macOS{" "}
            <code className="text-xs bg-background px-1.5 py-0.5 rounded border border-border font-mono">
              .pkg
            </code>
            , and a Linux{" "}
            <code className="text-xs bg-background px-1.5 py-0.5 rounded border border-border font-mono">
              .tar.gz
            </code>{" "}
            that installs the runtime, the display plug-in, and all five demos
            in one command. (v1 ships unsigned; your OS may warn on first
            launch.)
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
              {installer.links && installer.links.length > 0 && (
                <div className="mt-3 flex flex-col gap-1.5">
                  {installer.links.map((lnk) => (
                    <a
                      key={lnk.href}
                      href={lnk.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent underline underline-offset-2"
                    >
                      {lnk.label} ↗
                    </a>
                  ))}
                </div>
              )}
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

        {/* Linux footnote */}
        <p className="text-sm text-text-secondary leading-relaxed">
          <strong className="text-text-primary">On Linux?</strong> Linux is a
          Preview platform — Vulkan-only, X11 or Wayland, validated on Ubuntu
          22.04, 24.04, and 26.04. Take the bundle{" "}
          <code className="text-xs bg-background px-1.5 py-0.5 rounded border border-border font-mono">
            .tar.gz
          </code>{" "}
          and run its{" "}
          <code className="text-xs bg-background px-1.5 py-0.5 rounded border border-border font-mono">
            install.sh
          </code>
          : it lays down the runtime, the display-processor plug-in, and all
          five demos as{" "}
          <code className="text-xs bg-background px-1.5 py-0.5 rounded border border-border font-mono">
            .deb
          </code>{" "}
          packages, registers the active runtime, and self-checks on install —
          no environment variables to set. Individual{" "}
          <code className="text-xs bg-background px-1.5 py-0.5 rounded border border-border font-mono">
            .deb
          </code>{" "}
          files are attached to each component&apos;s own release if you prefer
          to install piecemeal. The shell and MCP tools are Windows-only today.
        </p>
      </div>
    </PageLayout>
  );
}
