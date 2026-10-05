import { Card } from "@/components/ui/Card";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Code2, GitPullRequest, MonitorSpeaker, Info } from "lucide-react";

// One card per audience, matching the header hubs one to one.
const paths = [
  {
    title: "Build apps",
    body: "3D web pages with a few lines of JavaScript, or native OpenXR apps on Windows, macOS, Linux and Android. No spatial display needed to start.",
    href: "/developers",
    icon: <Code2 size={20} />,
  },
  {
    title: "Contribute",
    body: "The runtime, extensions, engine plug-ins and demos are open source. Fork, build, run on the simulated display, open a PR.",
    href: "/contribute",
    icon: <GitPullRequest size={20} />,
  },
  {
    title: "Integrate a display",
    body: "One plug-in, not a runtime: bring your display or tracking hardware and every DisplayXR app runs on it, unchanged.",
    href: "/vendors",
    icon: <MonitorSpeaker size={20} />,
  },
  {
    title: "About DisplayXR",
    body: "What a spatial display is, how it differs from a headset, and why DisplayXR is built as an open, modular standard.",
    href: "/about",
    icon: <Info size={20} />,
  },
];

export function PathsSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 md:px-12 py-24">
      <div className="section-divider mb-24" />
      <AnimateIn>
        <h2 className="text-sm font-medium text-accent uppercase tracking-wider mb-4">
          Pick your path
        </h2>
        <h3 className="text-3xl md:text-4xl font-display tracking-tight text-text-primary mb-12 max-w-2xl">
          Start where you are
        </h3>
      </AnimateIn>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {paths.map((p, i) => (
          <AnimateIn key={p.title} delay={i * 60}>
            <Card title={p.title} icon={p.icon} href={p.href} className="h-full">
              <p className="text-sm leading-relaxed text-text-secondary">{p.body}</p>
            </Card>
          </AnimateIn>
        ))}
      </div>
    </section>
  );
}
