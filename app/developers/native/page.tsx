import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { NativeQuickstart } from "@/components/developers/NativeQuickstart";
import { APP_CLASSES, NATIVE_DOCS, NATIVE_PLATFORMS } from "@/lib/data/native";
import { DISCUSSIONS_URL } from "@/lib/constants";
import { HelpCircle, LifeBuoy, MessagesSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Native OpenXR apps",
  description:
    "Build a native OpenXR app for spatial displays on Windows, macOS, Linux or Android: the recommended graphics API, a reference app to start from, and a no-hardware run on sim-display.",
};

const link = "text-accent hover:text-accent-hover underline underline-offset-2";

export default function NativePage() {
  return (
    <PageLayout
      title="Native OpenXR apps"
      description="Start from a reference app, run it without a spatial display, lint it, ship it."
    >
      <div className="max-w-4xl space-y-20">
        <div className="rounded-lg border border-accent/30 bg-accent/10 p-5">
          <p className="text-sm leading-relaxed text-text-secondary">
            <strong className="text-text-primary">No spatial display? Develop on sim-display.</strong>{" "}
            DisplayXR ships a simulated spatial display, so you can build, run
            and self-test on an ordinary monitor. You need real hardware only to
            see the woven 3D image and real eye tracking.
          </p>
        </div>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">Pick your graphics API</h2>
          <p className="mb-6 max-w-2xl leading-relaxed text-text-secondary">
            Every API listed has a native compositor. Reach for the recommended
            one first.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {NATIVE_PLATFORMS.map((p) => (
              <div key={p.id} className="rounded-lg border border-border bg-surface p-4">
                <p className="text-sm text-text-secondary">{p.os}</p>
                <p className="text-lg font-semibold text-text-primary">{p.api}</p>
                {p.apiNote && <p className="text-xs text-text-secondary">{p.apiNote}</p>}
                <p className="mt-2 text-xs text-text-secondary">
                  {p.alsoSupported.length > 0
                    ? `Also supported: ${p.alsoSupported.join(", ")}`
                    : `${p.api} only`}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="quickstart" className="scroll-mt-24">
          <h2 className="mb-6 text-2xl font-semibold text-text-primary">Quickstart</h2>
          <NativeQuickstart />
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">App classes</h2>
          <p className="mb-6 max-w-2xl leading-relaxed text-text-secondary">
            The class decides who owns the window and the final surface. Mixing
            2D and 3D is a separate choice that works in every class.
          </p>
          <dl className="space-y-4">
            {APP_CLASSES.map((c) => (
              <div key={c.name} className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
                <dt className="font-semibold text-text-primary">{c.name}</dt>
                <dd className="text-sm leading-relaxed text-text-secondary">{c.line}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-text-secondary">
            More in{" "}
            <a href={NATIVE_DOCS.appClasses} target="_blank" rel="noopener noreferrer" className={link}>
              App classes
            </a>
            , and the extensions each class uses on{" "}
            <a href="/extensions" className={link}>Extensions</a>.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">If something is wrong</h2>
          <p className="mb-4 max-w-2xl leading-relaxed text-text-secondary">
            Run the headless self-test first. It checks plug-in discovery and
            the display without a compositor, GPU or window, and ends with{" "}
            <code className="font-mono text-sm">SELF-TEST PASSED</code> when the
            runtime is healthy.
          </p>
          <CodeSnippet code="displayxr-cli selftest" label="terminal" />
          <p className="mt-2 text-xs text-text-secondary">
            On Windows the CLI is in{" "}
            <code className="font-mono">C:\Program Files\DisplayXR\Runtime\</code>.
          </p>
          <p className="mt-4 text-sm text-text-secondary">
            Symptom-by-symptom fixes:{" "}
            <a href={NATIVE_DOCS.troubleshooting} target="_blank" rel="noopener noreferrer" className={link}>
              Troubleshooting
            </a>
            .
          </p>
        </section>

        <section>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card title="FAQ" icon={<HelpCircle size={20} />} href={NATIVE_DOCS.faq} className="h-full">
              <p className="text-sm leading-relaxed text-text-secondary">Hardware, platforms, project status.</p>
            </Card>
            <Card title="Troubleshooting" icon={<LifeBuoy size={20} />} href={NATIVE_DOCS.troubleshooting} className="h-full">
              <p className="text-sm leading-relaxed text-text-secondary">Symptom, cause, fix.</p>
            </Card>
            <Card title="Ask" icon={<MessagesSquare size={20} />} href={DISCUSSIONS_URL} className="h-full">
              <p className="text-sm leading-relaxed text-text-secondary">GitHub Discussions.</p>
            </Card>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
