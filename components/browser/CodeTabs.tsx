"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { CodeSnippet } from "@/components/ui/CodeSnippet";

type Tab = { id: string; label: string; code: string; sample: string };

/** Tabbed SDK snippets, each with its live sample. */
export function CodeTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const tab = tabs.find((t) => t.id === active) ?? tabs[0];
  return (
    <div>
      <div role="tablist" aria-label="SDK examples" className="mb-3 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={t.id === tab.id}
            onClick={() => setActive(t.id)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              t.id === tab.id
                ? "border-accent bg-accent/15 text-accent"
                : "border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        <CodeSnippet code={tab.code} label={tab.label.toLowerCase() + (tab.id === "call" ? ".html" : ".js")} />
        <a
          href={tab.sample}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover"
        >
          Open the live sample <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  );
}
