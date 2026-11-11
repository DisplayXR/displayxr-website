import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { FAQ_GROUPS } from "@/lib/data/faq";
import { DISCUSSIONS_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Questions people ask about DisplayXR: what it is, which displays work, privacy, building apps and web pages, writing a display plug-in, and how the project is run.",
};

// Data and writing rules: lib/data/faq.ts. Page-specific questions live on
// their own pages (/play, /browser, /apps/*).
export default function FaqPage() {
  return (
    <PageLayout
      title="Frequently asked questions"
      description="Grouped by who asks. Questions about games are on the Play page, and about the browser on the Browser page."
    >
      <nav aria-label="FAQ sections" className="mb-12 flex flex-wrap gap-2">
        {FAQ_GROUPS.map((g) => (
          <a
            key={g.id}
            href={`#${g.id}`}
            className="rounded-full border border-border px-3 py-1 text-sm text-text-secondary hover:text-text-primary"
          >
            {g.group}
          </a>
        ))}
      </nav>
      <div className="flex max-w-3xl flex-col gap-14">
        {FAQ_GROUPS.map((g) => (
          <section key={g.id} id={g.id} className="scroll-mt-24">
            <h2 className="mb-2 text-sm font-medium uppercase tracking-wider text-text-secondary">{g.group}</h2>
            <div className="divide-y divide-border">
              {g.items.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="cursor-pointer list-none text-lg font-medium text-text-primary">{f.q}</summary>
                  <p className="mt-3 text-text-secondary leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
      <p className="mt-14 text-sm text-text-secondary">
        A question that is not here?{" "}
        <a
          href={DISCUSSIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-2 hover:text-accent-hover"
        >
          Ask in GitHub Discussions
        </a>
        .
      </p>
    </PageLayout>
  );
}
