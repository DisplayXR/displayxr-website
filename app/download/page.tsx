import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import { REPO_URLS } from "@/lib/constants";
import { Package, LayoutGrid, Bot } from "lucide-react";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Download DisplayXR",
  description:
    "Get the DisplayXR runtime, shell, and MCP tools — three small installers covering OpenXR, spatial desktop, and AI-agent control.",
};

type Requirement = "Required" | "Optional";

type Installer = {
  name: string;
  pitch: string;
  platforms: string[];
  requirement: Requirement;
  releasesUrl: string;
  icon: ReactNode;
};

const installers: Installer[] = [
  {
    name: "DisplayXR Runtime",
    pitch:
      "OpenXR runtime and service for spatial 3D displays. The base layer every DisplayXR application talks to.",
    platforms: ["Windows installer", "macOS (source build)"],
    requirement: "Required",
    releasesUrl: `${REPO_URLS.runtime}/releases`,
    icon: <Package size={20} />,
  },
  {
    name: "DisplayXR Shell",
    pitch:
      "Reference spatial workspace UX — 3D window manager with multi-app compositing and dynamic layouts. Bundled with the Runtime installer; also available standalone.",
    platforms: ["Windows", "Bundled with Runtime"],
    requirement: "Optional",
    releasesUrl: `${REPO_URLS.shell}/releases`,
    icon: <LayoutGrid size={20} />,
  },
  {
    name: "DisplayXR MCP Tools",
    pitch:
      "AI-agent and voice control for the spatial workspace. Writes the Capabilities\\MCP registry flag the runtime and shell read at startup to spawn their MCP server thread.",
    platforms: ["Windows installer"],
    requirement: "Optional",
    releasesUrl: `${REPO_URLS.mcp}/releases`,
    icon: <Bot size={20} />,
  },
];

const requirementChipClass: Record<Requirement, string> = {
  Required: "bg-success/15 text-success border-success/30",
  Optional: "bg-text-secondary/15 text-text-secondary border-text-secondary/30",
};

export default function DownloadPage() {
  return (
    <PageLayout
      title="Get DisplayXR"
      description="DisplayXR ships as three small installers. Most users want the runtime; add the shell for a spatial desktop UX, and MCP Tools to give AI agents and voice control access to your spatial workspace."
    >
      <div className="space-y-12">
        {/* Intro callout */}
        <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-2">
            Windows today, macOS via source
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            The Runtime ships a packaged Windows installer (
            <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-xs font-mono">
              DisplayXRSetup-*.exe
            </code>
            ) that includes the Shell. macOS is currently a source build —
            see{" "}
            <a
              href={REPO_URLS.runtime}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              displayxr-runtime
            </a>
            . MCP Tools is a separate Windows installer.
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
                {installer.platforms.map((platform) => (
                  <span
                    key={platform}
                    className="text-xs text-text-secondary bg-background px-2 py-0.5 rounded border border-border"
                  >
                    {platform}
                  </span>
                ))}
              </div>
              <a
                href={installer.releasesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm text-accent hover:text-accent-hover underline underline-offset-2"
              >
                Download →
              </a>
            </Card>
          ))}
        </div>

        {/* Decision list */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
            Which install do I need?
          </h2>
          <ul className="space-y-2 text-text-secondary leading-relaxed">
            <li>
              Just want OpenXR for 3D displays in your own app? →{" "}
              <strong className="text-text-primary">Runtime</strong>.
            </li>
            <li>
              Want a spatial desktop UX? →{" "}
              <strong className="text-text-primary">Runtime + Shell</strong>.
            </li>
            <li>
              Want AI-agent / voice control? →{" "}
              <strong className="text-text-primary">
                Runtime + Shell + MCP Tools
              </strong>
              .
            </li>
          </ul>
        </section>

        {/* Verification (collapsed) */}
        <section>
          <details className="bg-surface border border-border rounded-lg">
            <summary className="cursor-pointer px-6 py-4 text-text-primary font-semibold select-none">
              Verify your install
            </summary>
            <div className="px-6 pb-6 pt-2 text-sm text-text-secondary leading-relaxed space-y-3">
              <p>After installing on Windows, you can confirm everything is wired up:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  Service{" "}
                  <code className="bg-background text-accent px-1.5 py-0.5 rounded text-xs font-mono">
                    DisplayXR Service
                  </code>{" "}
                  is running (check{" "}
                  <code className="bg-background text-accent px-1.5 py-0.5 rounded text-xs font-mono">
                    services.msc
                  </code>
                  ).
                </li>
                <li>
                  Active OpenXR runtime registered at{" "}
                  <code className="bg-background text-accent px-1.5 py-0.5 rounded text-xs font-mono">
                    HKLM\Software\Khronos\OpenXR\1\ActiveRuntime
                  </code>
                  .
                </li>
                <li>
                  If MCP Tools is installed:{" "}
                  <code className="bg-background text-accent px-1.5 py-0.5 rounded text-xs font-mono">
                    HKLM\Software\DisplayXR\Capabilities\MCP\Enabled = 1
                  </code>
                  . You can also override per-process with{" "}
                  <code className="bg-background text-accent px-1.5 py-0.5 rounded text-xs font-mono">
                    DISPLAYXR_MCP=1
                  </code>
                  .
                </li>
                <li>
                  Shell launches from the Start menu as{" "}
                  <strong className="text-text-primary">DisplayXR Shell</strong>
                  .
                </li>
              </ul>
            </div>
          </details>
        </section>

        {/* Build from source */}
        <div className="pt-8 border-t border-border">
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            Build from source
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            For developers, every component builds from source. Each repo has
            its own build instructions:
          </p>
          <ul className="space-y-2 text-text-secondary">
            <li>
              <a
                href={REPO_URLS.runtime}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover underline underline-offset-2"
              >
                displayxr-runtime
              </a>{" "}
              — runtime + service (Windows, macOS).
            </li>
            <li>
              <a
                href={REPO_URLS.shell}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover underline underline-offset-2"
              >
                displayxr-shell-releases
              </a>{" "}
              — reference spatial workspace controller.
            </li>
            <li>
              <a
                href={REPO_URLS.mcp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover underline underline-offset-2"
              >
                displayxr-mcp
              </a>{" "}
              — embeddable MCP server framework + the MCP Tools installer source.
            </li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
}
