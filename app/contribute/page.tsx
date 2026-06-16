import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import { REPO_URLS, GITHUB_ORG_URL } from "@/lib/constants";
import { ecosystemRepos } from "@/lib/data/ecosystem";
import {
  Boxes,
  Layers,
  FileText,
  Wrench,
  Hammer,
  GitPullRequest,
  ArrowUpRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contribute",
  description:
    "Help expand DisplayXR — where the code lives, how it's architected, the key decisions, and how to add an extension, a driver, or a platform.",
};

const repoGroups = [
  { key: "core", label: "Core" },
  { key: "engines", label: "Engine plugins" },
  { key: "tools", label: "Libraries & tools" },
  { key: "demos", label: "Demo apps" },
  { key: "apps", label: "Workspace controllers" },
] as const;

const RUNTIME = REPO_URLS.runtime;

// Headline ADRs worth knowing before contributing — full set lives in the repo.
const adrs = [
  {
    id: "ADR-001",
    title: "Native compositors per graphics API",
    href: `${RUNTIME}/blob/main/docs/adr/ADR-001-native-compositors-per-graphics-api.md`,
  },
  {
    id: "ADR-007",
    title: "The compositor never weaves (that's the display processor's job)",
    href: `${RUNTIME}/blob/main/docs/adr/ADR-007-compositor-never-weaves.md`,
  },
  {
    id: "ADR-019",
    title: "Vendor plug-in / aux boundary",
    href: `${RUNTIME}/blob/main/docs/adr/ADR-019-vendor-plugin-aux-boundary.md`,
  },
  {
    id: "ADR-022",
    title: "Per-mode capability flags + frozen enumerated app structs",
    href: `${RUNTIME}/blob/main/docs/adr/ADR-022-per-mode-capability-flags-frozen-enum-structs.md`,
  },
  {
    id: "ADR-025",
    title: "Android vendor display processors run out-of-process",
    href: `${RUNTIME}/blob/main/docs/adr/ADR-025-android-vendor-dp-out-of-process.md`,
  },
  {
    id: "ADR-027",
    title: "Display zones — decoupled mixed 2D/3D layout with per-zone rigs",
    href: `${RUNTIME}/blob/main/docs/adr/ADR-027-display-zones.md`,
  },
];

const extendLinks = [
  {
    title: "Add an OpenXR extension",
    desc: "Wire a new XR_EXT_* through the loader, state tracker, and compositors.",
    href: `${RUNTIME}/blob/main/docs/guides/implementing-extension.md`,
  },
  {
    title: "Write a device driver",
    desc: "Add input or device support inside the runtime.",
    href: `${RUNTIME}/blob/main/docs/guides/writing-driver.md`,
  },
  {
    title: "Build & CI",
    desc: "Build on Windows/macOS, the MinGW compile-check, and the headless displayxr-cli selftest gate.",
    href: `${RUNTIME}/blob/main/docs/getting-started/building.md`,
  },
];

function ExtLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}

export default function ContributePage() {
  return (
    <PageLayout
      title="Contribute"
      description="DisplayXR is open source and vendor-neutral. Whether you want to add a feature, an extension, or a new platform, here's how the project is laid out and where to start."
    >
      <div className="space-y-16">
        {/* Orient */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-text-primary">
            Understand the design first
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card title="Architecture" icon={<Layers size={20} />} href="/architecture">
              <p className="text-sm text-text-secondary leading-relaxed">
                The runtime stack, the native-compositor model, and the
                display-processor boundary — start here before changing the
                pipeline.
              </p>
            </Card>
            <Card title="Roadmap" icon={<FileText size={20} />} href="/roadmap">
              <p className="text-sm text-text-secondary leading-relaxed">
                What&apos;s done, in progress, and planned — so your work lands
                where it&apos;s needed and doesn&apos;t duplicate effort.
              </p>
            </Card>
          </div>
        </section>

        {/* Repo map */}
        <section>
          <h2 className="mb-2 text-xl font-semibold text-text-primary">
            Where the code lives
          </h2>
          <p className="mb-6 text-sm text-text-secondary leading-relaxed">
            DisplayXR is a multi-repo project under the{" "}
            <ExtLink
              href={GITHUB_ORG_URL}
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              DisplayXR org
            </ExtLink>
            . External contributors PR directly against the relevant repo.
          </p>
          <div className="space-y-8">
            {repoGroups.map((group) => {
              const repos = ecosystemRepos.filter(
                (r) => r.category === group.key
              );
              if (repos.length === 0) return null;
              return (
                <div key={group.key}>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">
                    {group.label}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {repos.map((repo) => (
                      <ExtLink key={repo.repo} href={repo.url}>
                        <div className="h-full rounded-lg border border-border bg-surface p-5 transition-colors hover:border-accent/50">
                          <div className="mb-1.5 flex items-center gap-1.5">
                            <Boxes size={16} className="text-accent" />
                            <code className="font-mono text-sm font-semibold text-text-primary">
                              {repo.name}
                            </code>
                            <ArrowUpRight
                              size={13}
                              className="text-text-secondary"
                            />
                          </div>
                          <p className="text-sm text-text-secondary leading-relaxed">
                            {repo.description}
                          </p>
                        </div>
                      </ExtLink>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Key decisions */}
        <section>
          <h2 className="mb-2 text-xl font-semibold text-text-primary">
            Key decisions (ADRs)
          </h2>
          <p className="mb-6 text-sm text-text-secondary leading-relaxed">
            Architecture Decision Records capture why the runtime is built the
            way it is. A few you&apos;ll want before touching the pipeline — the
            full set is in{" "}
            <ExtLink
              href={`${RUNTIME}/tree/main/docs/adr`}
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              docs/adr
            </ExtLink>
            .
          </p>
          <div className="space-y-3">
            {adrs.map((adr) => (
              <ExtLink
                key={adr.id}
                href={adr.href}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface px-5 py-3 transition-colors hover:border-accent/50"
              >
                <code className="font-mono text-xs font-semibold text-accent">
                  {adr.id}
                </code>
                <span className="text-sm text-text-secondary">{adr.title}</span>
                <ArrowUpRight
                  size={14}
                  className="ml-auto shrink-0 text-text-secondary"
                />
              </ExtLink>
            ))}
          </div>
        </section>

        {/* Extend */}
        <section>
          <h2 className="mb-2 text-xl font-semibold text-text-primary">
            Add a feature, extension, or platform
          </h2>
          <p className="mb-6 text-sm text-text-secondary leading-relaxed">
            The deep guides live in the runtime repo; these are the entry
            points. (Writing a plug-in for a 3D-display panel instead? See the{" "}
            <a
              href="/vendors"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              Display Vendors guide
            </a>
            .)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {extendLinks.map((l, i) => (
              <ExtLink key={l.title} href={l.href}>
                <Card
                  title={l.title}
                  icon={i === 2 ? <Hammer size={20} /> : <Wrench size={20} />}
                >
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {l.desc}
                  </p>
                </Card>
              </ExtLink>
            ))}
          </div>
        </section>

        {/* Get involved */}
        <section>
          <div className="rounded-lg border border-accent/30 bg-accent/10 p-6">
            <div className="mb-3 flex items-center gap-3">
              <GitPullRequest size={22} className="text-accent" />
              <h2 className="text-lg font-semibold text-text-primary">
                Pick up an issue
              </h2>
            </div>
            <p className="mb-4 text-sm text-text-secondary leading-relaxed">
              Runtime dev issues live in the runtime repo; external contributors
              open a PR directly against it. New here? Filter for{" "}
              <code className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-xs">
                good first issue
              </code>
              .
            </p>
            <div className="flex flex-wrap gap-4">
              <ExtLink
                href={`${RUNTIME}/issues`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover underline underline-offset-2"
              >
                Open issues <ArrowUpRight size={14} />
              </ExtLink>
              <ExtLink
                href={`${RUNTIME}/labels/good%20first%20issue`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover underline underline-offset-2"
              >
                Good first issues <ArrowUpRight size={14} />
              </ExtLink>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
