"use client";

import { Download, Clock, Ban } from "lucide-react";
import { useVisitorOS, type VisitorOS } from "@/lib/visitor-os";
import type { ComponentDownload, ComponentRelease, Platform } from "@/lib/data/generated";

type Step = {
  title: string;
  body: string;
  download?: ComponentDownload;
  /** Shown instead of a download when there is none for this OS. */
  missing?: "coming-soon" | "unavailable";
};

const ORDER: Platform[] = ["Windows", "macOS", "Linux", "Android"];

function stepsFor(os: Platform, bundle?: ComponentRelease, browser?: ComponentRelease): Step[] {
  const b = bundle?.downloads.find((d) => d.platform === os);
  const w = browser?.downloads.find((d) => d.platform === os);
  const bundleBody: Record<Platform, string> = {
    Windows: "The runtime and the display plug-in in one installer, with pinned, compatible versions. Start here.",
    macOS: "The runtime in one installer package. Start here.",
    Linux: "Unpack and run install.sh: it installs the runtime, the display plug-in and the demos as .deb packages and checks itself. Ubuntu 24.04 or 26.04 recommended.",
    Android: "The DisplayXR installer app for Android spatial displays. Start here.",
  };
  return [
    { title: "DisplayXR", body: bundleBody[os], download: b, missing: b ? undefined : "unavailable" },
    {
      title: "DisplayXR Browser",
      body:
        os === "macOS"
          ? "The browser for 3D on the web is coming to macOS. It runs on Windows, Linux and Android today."
          : "A Chromium-based browser that shows 3D web content in depth on your spatial display. Install it after step 1.",
      download: w,
      missing: w ? undefined : os === "macOS" ? "coming-soon" : "unavailable",
    },
  ];
}

function StepCard({ n, step }: { n: number; step: Step }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-accent">Step {n}</p>
      <h3 className="mb-2 text-lg font-semibold text-text-primary">{step.title}</h3>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">{step.body}</p>
      {step.download ? (
        <a
          href={step.download.url}
          data-umami-event="download"
          data-umami-event-file={step.download.file}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          <Download size={15} /> Download
          <span className="hidden sm:inline font-mono text-xs opacity-80">{step.download.file}</span>
        </a>
      ) : step.missing === "coming-soon" ? (
        <span className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-text-secondary">
          <Clock size={15} /> Coming soon
        </span>
      ) : (
        <span className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-text-secondary">
          <Ban size={15} /> Not available for this platform
        </span>
      )}
    </div>
  );
}

function PlatformBlock({ os, mine, bundle, browser }: { os: Platform; mine: boolean; bundle?: ComponentRelease; browser?: ComponentRelease }) {
  const steps = stepsFor(os, bundle, browser);
  return (
    <section
      id={os.toLowerCase()}
      className={`rounded-xl border p-6 ${mine ? "border-accent/50 bg-accent/5" : "border-border"}`}
    >
      <h2 className="mb-4 flex items-center gap-3 text-xl font-semibold text-text-primary">
        {os}
        {mine && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-white">Your system</span>
        )}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {steps.map((s, i) => (
          <StepCard key={s.title} n={i + 1} step={s} />
        ))}
      </div>
    </section>
  );
}

/**
 * Two ordered installs per OS. The order matters: the browser installer
 * chains the runtime but not a display plug-in, so the browser on its own
 * shows 2D only. The server renders every platform (crawlers, no-JS); once
 * the visitor's OS is known it moves to the top and is marked.
 */
export function OsDownloads({ bundle, browser }: { bundle?: ComponentRelease; browser?: ComponentRelease }) {
  const os: VisitorOS | null = useVisitorOS();
  const mine = os && os !== "iOS" ? os : null;
  const order = mine ? [mine, ...ORDER.filter((p) => p !== mine)] : ORDER;
  return (
    <div className="space-y-6">
      {os === "iOS" && (
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-2 text-lg font-semibold text-text-primary">Not available on iOS</h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            DisplayXR runs on Windows, macOS, Linux and Android. Open this page on
            one of those to install it. Pages built with the web SDK still work in
            your browser here, as ordinary 2D.
          </p>
        </div>
      )}
      {order.map((p) => (
        <PlatformBlock key={p} os={p} mine={p === mine} bundle={bundle} browser={browser} />
      ))}
    </div>
  );
}
