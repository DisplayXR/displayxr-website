import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { roadmapSections, type RoadmapPhase } from "@/lib/data/roadmap";
import { CheckCircle2, Circle, ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "Where DisplayXR is headed — completed milestones, current work, and future plans.",
};

const phaseConfig: Record<
  RoadmapPhase,
  { icon: React.ReactNode; color: string; dotColor: string }
> = {
  done: {
    icon: <CheckCircle2 size={20} />,
    color: "text-success",
    dotColor: "bg-success",
  },
  now: {
    icon: <Circle size={20} />,
    color: "text-accent",
    dotColor: "bg-accent",
  },
  next: {
    icon: <ArrowRight size={20} />,
    color: "text-text-secondary",
    dotColor: "bg-text-secondary",
  },
  later: {
    icon: <Clock size={20} />,
    color: "text-text-secondary",
    dotColor: "bg-border",
  },
};

export default function RoadmapPage() {
  return (
    <PageLayout
      title="Roadmap"
      description="Where DisplayXR is headed. This reflects actual milestones, not aspirational targets."
    >
      <div className="max-w-3xl">
        <div className="space-y-12">
          {roadmapSections.map((section) => {
            const config = phaseConfig[section.phase];
            return (
              <section key={section.phase}>
                <div className="flex items-center gap-3 mb-6">
                  <span className={config.color}>{config.icon}</span>
                  <h2 className="text-2xl font-semibold text-text-primary">
                    {section.label}
                  </h2>
                </div>
                <div className="space-y-0 ml-2.5 border-l-2 border-border pl-8">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="relative pb-6 last:pb-0">
                      <div
                        className={`absolute -left-[calc(2rem+5px)] top-1.5 w-2.5 h-2.5 rounded-full ${config.dotColor}`}
                      />
                      <h3 className="text-base font-semibold text-text-primary mb-1">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-text-secondary">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-sm text-text-secondary">
            This roadmap is high-level and public-safe. For detailed tracking,
            see individual repo milestones on{" "}
            <a
              href="https://github.com/DisplayXR"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
