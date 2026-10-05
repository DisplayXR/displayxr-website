import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { USE_CASES, type UseCase } from "@/lib/data/web";

/** The mainstream use cases, each linking to its live sample (safe in 2D anywhere). */
export function UseCaseGrid({ ids }: { ids?: UseCase["id"][] }) {
  const items = ids ? USE_CASES.filter((u) => ids.includes(u.id)) : USE_CASES;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((u) => (
        <a
          key={u.id}
          href={u.href}
          target="_blank"
          rel="noopener noreferrer"
          data-umami-event="sample-outbound"
          data-umami-event-sample={u.id}
          className="card-interactive group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface"
        >
          <div className="relative aspect-[3/2] overflow-hidden">
            <Image src={u.image} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-accent">{u.title}</p>
            <h3 className="mt-1 mb-2 text-lg font-semibold text-text-primary">{u.pitch}</h3>
            <p className="mb-4 text-sm leading-relaxed text-text-secondary">{u.body}</p>
            <span className="mt-auto inline-flex items-center gap-1 text-sm text-accent">
              Try it <ArrowUpRight size={14} />
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
