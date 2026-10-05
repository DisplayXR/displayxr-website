import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { HELLO_WORLD } from "@/lib/data/web";
import { DISCUSSIONS_URL, DOCS_URL, REPO_URLS } from "@/lib/constants";
import { BookOpen, Bot, FileCode2, HelpCircle, Layers, MessagesSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Developers",
  description:
    "Build for spatial displays: 3D web pages in a few lines of JavaScript, native OpenXR apps on Windows, macOS, Linux and Android, or Unity and Unreal. No spatial display needed to start.",
};

// One recommended graphics API per platform (David, 2026-10-04). The others
// stay supported; this is the default to reach for, not a restriction.
const native = [
  { os: "Windows", api: "D3D11", note: "D3D12 for engines" },
  { os: "macOS", api: "Metal" },
  { os: "Linux", api: "Vulkan" },
  { os: "Android", api: "Vulkan" },
];

const docs = [
  {
    title: "App developer guide",
    body: "The four ways an app hands its frames to the runtime, and which to pick.",
    href: `${REPO_URLS.runtime}/blob/main/docs/getting-started/app-classes.md`,
    icon: <BookOpen size={20} />,
  },
  {
    title: "Extensions",
    body: "What each XR_DXR_* extension adds to OpenXR for spatial displays.",
    href: "/extensions",
    icon: <FileCode2 size={20} />,
  },
  {
    title: "AI-agent control",
    body: "Apps register their own MCP tools with XR_DXR_mcp_tools, so an AI agent can drive them.",
    href: REPO_URLS.mcp,
    icon: <Bot size={20} />,
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
    href: `${REPO_URLS.runtime}/blob/main/docs/getting-started/faq.md`,
    icon: <HelpCircle size={20} />,
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
        {/* Recommended first: the web. */}
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
            <Button href="/web">The web, in depth</Button>
            <Button variant="secondary" href="/download">
              Get the browser
            </Button>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">Native OpenXR apps</h2>
          <p className="mb-6 max-w-2xl text-text-secondary leading-relaxed">
            Your OpenXR app already runs. Install DisplayXR, run on the
            simulated display in an ordinary window, and opt into the
            extensions when you want the display&apos;s full picture. The
            recommended graphics API per platform:
          </p>
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {native.map((n) => (
              <div key={n.os} className="rounded-lg border border-border bg-surface p-4">
                <p className="text-sm text-text-secondary">{n.os}</p>
                <p className="text-lg font-semibold text-text-primary">{n.api}</p>
                {n.note && <p className="text-xs text-text-secondary">{n.note}</p>}
              </div>
            ))}
          </div>
          <p className="mb-6 text-sm text-text-secondary">
            D3D11, D3D12, Vulkan, Metal and OpenGL each have their own native
            compositor, so the others work too.
          </p>
          <Button variant="secondary" href="/getting-started">
            Install and run your first app
          </Button>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">Unity and Unreal</h2>
          <p className="mb-6 max-w-2xl text-text-secondary leading-relaxed">
            Engine plug-ins with standard engine workflows, no custom forks.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" href={REPO_URLS.unity}>
              Unity plug-in
            </Button>
            <Button variant="secondary" href={REPO_URLS.unreal}>
              Unreal plug-in
            </Button>
            <Button variant="secondary" href="/demos">
              Demos
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
            <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover underline underline-offset-2">
              runtime repo&apos;s docs
            </a>
            .
          </p>
        </section>
      </div>
    </PageLayout>
  );
}
