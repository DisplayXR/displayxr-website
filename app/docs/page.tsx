import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import { REPO_URLS } from "@/lib/constants";
import {
  BookOpen,
  Lightbulb,
  Code2,
  Gamepad2,
  MonitorSpeaker,
  FileCode2,
  Layers,
  HelpCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "Documentation hub for DisplayXR — getting started, concepts, engine integrations, and more.",
};

const docSections = [
  {
    title: "Getting Started",
    description:
      "Set up the DisplayXR runtime, build a sample app, and run it in simulation mode.",
    icon: <BookOpen size={20} />,
    href: REPO_URLS.runtime,
  },
  {
    title: "Concepts",
    description:
      "Understand sessions, swapchains, reference spaces, and how DisplayXR extends OpenXR for spatial displays.",
    icon: <Lightbulb size={20} />,
    href: REPO_URLS.runtime,
  },
  {
    title: "App Developer Guide",
    description:
      "Build OpenXR applications targeting spatial displays. Covers all four application classes.",
    icon: <Code2 size={20} />,
    href: REPO_URLS.demos,
  },
  {
    title: "Engine Integrations",
    description:
      "Unity plugin setup (UPM), sample scenes, and Unreal Engine integration status.",
    icon: <Gamepad2 size={20} />,
    href: REPO_URLS.unity,
  },
  {
    title: "Vendor Integration",
    description:
      "How hardware vendors integrate display processors, weavers, and eye tracking with the DisplayXR runtime.",
    icon: <MonitorSpeaker size={20} />,
    href: REPO_URLS.runtime,
  },
  {
    title: "Specs & Extensions",
    description:
      "Custom OpenXR extension specifications for display_info, window bindings, and spatial display capabilities.",
    icon: <FileCode2 size={20} />,
    href: REPO_URLS.extensions,
  },
  {
    title: "Architecture",
    description:
      "Deep dive into the runtime architecture, native compositor model, and separation of concerns.",
    icon: <Layers size={20} />,
    href: "/architecture",
  },
  {
    title: "FAQ",
    description:
      "Common questions about DisplayXR, hardware requirements, supported platforms, and project status.",
    icon: <HelpCircle size={20} />,
    href: REPO_URLS.runtime,
  },
];

export default function DocsPage() {
  return (
    <PageLayout
      title="Documentation"
      description="Start here to understand, build with, and integrate DisplayXR."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docSections.map((section) => (
          <Card
            key={section.title}
            title={section.title}
            icon={section.icon}
            href={section.href}
          >
            <p className="text-sm text-text-secondary leading-relaxed">
              {section.description}
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-border">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Looking for something specific?
        </h2>
        <p className="text-text-secondary leading-relaxed">
          Documentation is currently maintained alongside the source code. Each
          repo contains detailed READMEs and inline docs. The links above point
          to the most relevant starting points.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {Object.entries(REPO_URLS).map(([key, url]) => (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:text-accent-hover font-mono underline underline-offset-2"
            >
              {url.split("/").pop()}
            </a>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
