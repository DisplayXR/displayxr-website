import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import { REPO_URLS, WEB_SAMPLES_URL } from "@/lib/constants";
import { OsDownloads } from "@/components/download/OsDownloads";
import { components } from "@/lib/data/generated";
import { Package, LayoutGrid, Bot, Download, Glasses, Globe } from "lucide-react";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Download DisplayXR",
  description:
    "Download DisplayXR and the DisplayXR Browser for Windows, macOS, Linux and Android: two installs, in order, or each component individually.",
};

type Requirement = "Required" | "Optional";

type Installer = {
  /** Generated component id: platforms and direct downloads come from its release assets. */
  id: string;
  name: string;
  pitch: string;
  requirement: Requirement;
  releasesUrl: string;
  icon: ReactNode;
  links?: { label: string; href: string }[];
};

const installers: Installer[] = [
  {
    id: "runtime",
    name: "DisplayXR Runtime",
    pitch:
      "OpenXR runtime + service. Install this first; everything else depends on it.",
    requirement: "Required",
    releasesUrl: `${REPO_URLS.runtime}/releases/latest`,
    icon: <Package size={20} />,
  },
  {
    id: "shell",
    name: "DisplayXR Shell",
    pitch:
      "Reference spatial-workspace UX — 3D window manager with multi-app compositing and dynamic layouts.",
    requirement: "Optional",
    releasesUrl: `${REPO_URLS.shell}/releases/latest`,
    icon: <LayoutGrid size={20} />,
  },
  {
    id: "leia_plugin",
    name: "Leia SR Plug-in",
    pitch:
      "Display-processor plug-in for Leia hardware, the reference plug-in. The runtime discovers it at startup.",
    requirement: "Optional",
    releasesUrl: `${REPO_URLS.leiaPlugin}/releases/latest`,
    icon: <Glasses size={20} />,
  },
  {
    id: "mcp_tools",
    name: "DisplayXR MCP Tools",
    pitch:
      "AI-agent + voice control. Writes the Capabilities\\MCP registry flag the runtime and shell read at startup.",
    requirement: "Optional",
    releasesUrl: `${REPO_URLS.mcp}/releases/latest`,
    icon: <Bot size={20} />,
  },
  {
    id: "browser",
    name: "DisplayXR Browser",
    pitch:
      "A Chromium-based browser that renders the web normally and shows 3D web content in depth on a spatial display. Security updates follow Chrome stable. Not affiliated with Google; no Google account sign-in or sync. macOS coming soon.",
    requirement: "Optional",
    releasesUrl: `${REPO_URLS.browser}/releases/latest`,
    icon: <Globe size={20} />,
    links: [
      { label: "See it live", href: WEB_SAMPLES_URL },
      { label: "Build inline-3D apps (SDK)", href: REPO_URLS.web },
    ],
  },
];

const requirementChipClass: Record<Requirement, string> = {
  Required: "bg-success/15 text-success border-success/30",
  Optional:
    "bg-text-secondary/15 text-text-secondary border-text-secondary/30",
};

const byId = (id: string) => components.find((c) => c.id === id);

export default function DownloadPage() {
  return (
    <PageLayout
      title="Download"
      description="Two installs, in this order: DisplayXR, then the DisplayXR Browser. The browser on its own installs the runtime but not a display plug-in, so it shows 2D only until step 1 is in place."
    >
      <div className="space-y-12">
        <OsDownloads bundle={byId("installer")} browser={byId("browser")} />

        <p className="text-sm text-text-secondary leading-relaxed">
          <strong className="text-text-primary">No spatial display yet?</strong>{" "}
          Install step 1 anyway: the runtime includes a simulated display in an
          ordinary window, so you can build and test without hardware. New to
          DisplayXR? Start at{" "}
          <a href="/developers" className="text-accent hover:text-accent-hover underline underline-offset-2">
            Developers
          </a>
          .
        </p>

        {/* Everything else, for people who manage components one by one. */}
        <details className="group rounded-xl border border-border">
          <summary className="cursor-pointer list-none p-6 text-lg font-semibold text-text-primary">
            Individual components
            <span className="ml-2 text-sm font-normal text-text-secondary group-open:hidden">
              (show)
            </span>
          </summary>
          <div className="space-y-8 px-6 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {installers.map((installer) => {
                const gen = byId(installer.id);
                return (
                  <Card key={installer.name} title={installer.name} icon={installer.icon}>
                    <p className="text-sm text-text-secondary leading-relaxed mb-4">{installer.pitch}</p>
                    <div className="flex items-center gap-2 flex-wrap mb-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${requirementChipClass[installer.requirement]}`}
                      >
                        {installer.requirement}
                      </span>
                      {gen?.version && (
                        <span className="text-xs font-mono text-text-secondary">{gen.version}</span>
                      )}
                    </div>
                    <ul className="mb-4 space-y-1.5">
                      {(gen?.downloads ?? []).map((d) => (
                        <li key={d.url}>
                          <a
                            href={d.url}
                            data-umami-event="download"
                            data-umami-event-file={d.file}
                            className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover underline underline-offset-2"
                          >
                            <Download size={13} /> {d.platform}
                          </a>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={installer.releasesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-text-secondary hover:text-accent underline underline-offset-2"
                    >
                      All release files ↗
                    </a>
                    {installer.links && installer.links.length > 0 && (
                      <div className="mt-3 flex flex-col gap-1.5">
                        {installer.links.map((lnk) => (
                          <a
                            key={lnk.href}
                            href={lnk.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-text-secondary hover:text-accent underline underline-offset-2"
                          >
                            {lnk.label} ↗
                          </a>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              <strong className="text-text-primary">Bundle releases:</strong> the{" "}
              <a href={`${REPO_URLS.installer}/releases/latest`} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover underline underline-offset-2">
                DisplayXR installer
              </a>{" "}
              pins compatible versions of every component. Installers ship
              unsigned for now, so your OS may warn on first launch. On macOS,
              installing the package from Terminal with{" "}
              <code className="text-xs bg-background px-1.5 py-0.5 rounded border border-border font-mono">sudo installer</code>{" "}
              avoids the Gatekeeper warning.
            </p>
          </div>
        </details>
      </div>
    </PageLayout>
  );
}
