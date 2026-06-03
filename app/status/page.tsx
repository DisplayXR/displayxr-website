import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { VersionDashboard } from "@/components/status/VersionDashboard";

export const metadata: Metadata = {
  title: "Release status",
  description:
    "Current released versions of every DisplayXR component — runtime, shell, plug-ins, MCP tools, engine plugins, and demos. Auto-synced from the DisplayXR org.",
};

export default function StatusPage() {
  return (
    <PageLayout
      title="Release status"
      description="The latest released version of every DisplayXR component. This page is generated from the org — each version links straight to its GitHub release."
    >
      <VersionDashboard />

      <p className="mt-12 text-sm text-text-secondary leading-relaxed">
        Runtime, shell, Leia SR plug-in, MCP tools, and demos share a{" "}
        <a
          href="https://github.com/DisplayXR/displayxr-runtime/blob/main/versions.json"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-accent-hover underline underline-offset-2"
        >
          tested-together version matrix
        </a>{" "}
        (<code className="font-mono text-xs">versions.json</code>) that the
        all-in-one installer pins. Engine plugins version independently. To
        install a matched set, grab the{" "}
        <a
          href="/download"
          className="text-accent hover:text-accent-hover underline underline-offset-2"
        >
          all-in-one bundle
        </a>
        .
      </p>
    </PageLayout>
  );
}
