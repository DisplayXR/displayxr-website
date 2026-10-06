import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { HELLO_WORLD } from "@/lib/data/web";
import { NATIVE_DOCS, NATIVE_PLATFORMS } from "@/lib/data/native";
import { engines } from "@/lib/data/generated";
import { enginePlugins } from "@/lib/data/compatibility";
import { DISCUSSIONS_URL, DOCS_URL, REPO_URLS } from "@/lib/constants";
import { FileCode2, HelpCircle, Layers, LifeBuoy, MessagesSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Developers",
  description:
    "Build for spatial displays: 3D web pages in a few lines of JavaScript, native OpenXR apps on Windows, macOS, Linux and Android, or Unity and Unreal. No spatial display needed to start.",
};

const link = "text-accent hover:text-accent-hover underline underline-offset-2";

// Versions come from the generated engine data (synced from each plug-in's
// release); platforms and status are authored, verified against the plug-in
// READMEs on 2026-10-05.
const ENGINE_FACTS: Record<string, { platforms: string; samplesLabel: string }> = {
  unity: { platforms: "Windows and macOS", samplesLabel: "Unity samples" },
  unreal: { platforms: "Windows, macOS and Android", samplesLabel: "Unreal test project" },
};

const docs = [
  {
    title: "Extensions",
    body: "Where vanilla OpenXR stops on a spatial display, and the XR_DXR_* extension that covers each gap.",
    href: "/extensions",
    icon: <FileCode2 size={20} />,
  },
  {
    title: "Architecture",
    body: "How the runtime, the native compositors and the vendor plug-ins fit together.",
    href: "/architecture",
    icon: <Layers size={20} />,
  },
  {
    title: "FAQ",
    body: "Hardware, platforms, project status.",
    href: NATIVE_DOCS.faq,
    icon: <HelpCircle size={20} />,
  },
  {
    title: "Troubleshooting",
    body: "Start with displayxr-cli selftest, then symptom, cause, fix.",
    href: NATIVE_DOCS.troubleshooting,
    icon: <LifeBuoy size={20} />,
  },
  {
    title: "Ask the community",
    body: "Questions, ideas and show-and-tell on GitHub Discussions.",
    href: DISCUSSIONS_URL,
    icon: <MessagesSquare size={20} />,
  },
];

export default function DevelopersPage() {
  return (
    <PageLayout
      title="Developers"
      description="Build for spatial displays on the web, natively, or in an engine. You don't need a spatial display to start."
    >
      <div className="max-w-4xl space-y-20">
        {/* Recommended first: the web. One snippet; the full guide is /browser#build. */}
        <section>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-accent">Recommended for most new content</p>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">3D on the web</h2>
          <p className="mb-6 max-w-2xl text-text-secondary leading-relaxed">
            A few lines of JavaScript with{" "}
            <code className="font-mono text-sm">@displayxr/inline3d</code>,
            shared with a URL. In the DisplayXR Browser the page is 3D; in every
            other browser it is the same page in 2D.
          </p>
          <CodeSnippet code={HELLO_WORLD} label="index.html" />
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/browser#build">Full guide</Button>
          </div>
        </section>

        <div className="rounded-lg border border-accent/30 bg-accent/10 p-5">
          <p className="text-sm leading-relaxed text-text-secondary">
            <strong className="text-text-primary">No spatial display? Develop on sim-display.</strong>{" "}
            DisplayXR ships a simulated spatial display: native apps build, run
            and self-test on an ordinary monitor, in an ordinary window.{" "}
            <a href="/developers/native#quickstart" className={link}>How</a>
          </p>
        </div>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">Native OpenXR apps</h2>
          <p className="mb-6 max-w-2xl text-text-secondary leading-relaxed">
            Start from a reference app, run it on sim-display, lint it, ship
            it. The recommended graphics API per platform:
          </p>
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {NATIVE_PLATFORMS.map((p) => (
              <a
                key={p.id}
                href={`/developers/native#${p.id}`}
                className="card-interactive rounded-lg border border-border bg-surface p-4"
              >
                <p className="text-sm text-text-secondary">{p.os}</p>
                <p className="text-lg font-semibold text-text-primary">{p.api}</p>
                {p.apiNote && <p className="text-xs text-text-secondary">{p.apiNote}</p>}
              </a>
            ))}
          </div>
          <Button variant="secondary" href="/developers/native">
            Native quickstart
          </Button>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">Unity and Unreal</h2>
          <p className="mb-6 max-w-2xl text-text-secondary leading-relaxed">
            Engine plug-ins with standard engine workflows, no custom forks.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {engines.map((e) => {
              const facts = ENGINE_FACTS[e.id];
              const status = enginePlugins.find((p) => p.engine === e.name)?.status;
              return (
                <div key={e.id} className="rounded-lg border border-border bg-surface p-6">
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold text-text-primary">{e.name}</h3>
                    {status && <Badge status={status} />}
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                    {[e.version && `Plug-in ${e.version}`, e.engineVersion, facts?.platforms]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    <a href={e.repoUrl} target="_blank" rel="noopener noreferrer" className={link}>
                      Plug-in
                    </a>
                    <a href={e.testRepoUrl} target="_blank" rel="noopener noreferrer" className={link}>
                      {facts?.samplesLabel ?? "Samples"}
                    </a>
                    {e.releaseUrl && (
                      <a href={e.releaseUrl} target="_blank" rel="noopener noreferrer" className={link}>
                        Release notes
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-6 text-sm text-text-secondary">
            See them running in the <a href="/demos" className={link}>demos</a>.
          </p>
        </section>

        <section>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-accent">Opt-in</p>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">Let an AI agent drive your app</h2>
          <p className="mb-4 max-w-2xl text-text-secondary leading-relaxed">
            With MCP enabled, the runtime hosts a{" "}
            <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer" className={link}>
              Model Context Protocol
            </a>{" "}
            server in each app, so an agent such as Claude Code can inspect it.
            With{" "}
            <code className="font-mono text-sm">XR_DXR_mcp_tools</code> your app
            adds its own tools (<code className="font-mono text-sm">play_pause</code>,{" "}
            <code className="font-mono text-sm">load_model</code>): calls arrive
            on the OpenXR event queue and you answer from your frame loop. Your
            app never links an MCP library.
          </p>
          <p className="mb-6 max-w-2xl text-sm text-text-secondary leading-relaxed">
            Off unless MCP is enabled on the machine; with it off, the
            extension&apos;s calls return unsupported and the app carries on.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" href={REPO_URLS.mcp}>
              displayxr-mcp
            </Button>
            <Button variant="secondary" href="/extensions#XR_DXR_mcp_tools">
              XR_DXR_mcp_tools
            </Button>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-semibold text-text-primary">Go deeper</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {docs.map((d) => (
              <Card key={d.title} title={d.title} icon={d.icon} href={d.href} className="h-full">
                <p className="text-sm leading-relaxed text-text-secondary">{d.body}</p>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-sm text-text-secondary">
            Full documentation lives with the code, in the{" "}
            <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className={link}>
              runtime repo&apos;s docs
            </a>
            .
          </p>
        </section>
      </div>
    </PageLayout>
  );
}
