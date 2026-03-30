import { Card } from "@/components/ui/Card";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { GitHubIcon } from "@/components/ui/GitHubIcon";
import { ecosystemRepos } from "@/lib/data/ecosystem";

const categoryLabels: Record<string, string> = {
  core: "Core",
  engines: "Engine Plugins",
  tools: "Libraries",
  apps: "Applications",
};

const categoryOrder = ["core", "engines", "tools", "apps"];

export function EcosystemMap() {
  const grouped = categoryOrder.map((cat) => ({
    category: cat,
    label: categoryLabels[cat],
    repos: ecosystemRepos.filter((r) => r.category === cat),
  }));

  return (
    <section className="mx-auto max-w-[1200px] px-6 md:px-12 py-24">
      <div className="section-divider mb-24" />
      <AnimateIn>
        <h2 className="text-sm font-medium text-accent uppercase tracking-wider mb-4">
          The Ecosystem
        </h2>
        <h3 className="text-3xl md:text-4xl font-display tracking-tight text-text-primary mb-12 max-w-2xl">
          One project, many repos
        </h3>
      </AnimateIn>

      <div className="space-y-10">
        {grouped.map((group, gi) => (
          <AnimateIn key={group.category} delay={gi * 100}>
            <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-4">
              {group.label}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.repos.map((repo) => (
                <Card key={repo.name} href={repo.url}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h5 className="text-sm font-semibold text-text-primary font-mono mb-1.5">
                        {repo.name}
                      </h5>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {repo.description}
                      </p>
                    </div>
                    <GitHubIcon
                      size={16}
                      className="text-text-secondary shrink-0 mt-0.5"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </AnimateIn>
        ))}
      </div>
    </section>
  );
}
