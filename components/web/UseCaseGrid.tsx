import { ShoppingBag, Clapperboard, Video, Images, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { USE_CASES, type UseCase } from "@/lib/data/web";
import { WEB_SAMPLES_URL } from "@/lib/constants";

const ICONS: Record<UseCase["id"], ReactNode> = {
  shop: <ShoppingBag size={20} />,
  watch: <Clapperboard size={20} />,
  call: <Video size={20} />,
  photos: <Images size={20} />,
};

/** The mainstream use cases, each linking to its live sample (safe in 2D anywhere). */
export function UseCaseGrid({
  ids,
  showModule = false,
}: {
  ids?: UseCase["id"][];
  showModule?: boolean;
}) {
  const items = ids ? USE_CASES.filter((u) => ids.includes(u.id)) : USE_CASES;
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${items.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
      {items.map((u) => (
        <a
          key={u.id}
          href={`${WEB_SAMPLES_URL}${u.sample}`}
          target="_blank"
          rel="noopener noreferrer"
          data-umami-event="sample-outbound"
          data-umami-event-sample={u.id}
          className="card-interactive flex h-full flex-col rounded-lg border border-border bg-surface p-6"
        >
          <div className="mb-3 flex items-center gap-3 text-accent">
            {ICONS[u.id]}
            <h3 className="text-lg font-semibold text-text-primary">{u.title}</h3>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-text-secondary">{u.body}</p>
          <span className="mt-auto inline-flex items-center gap-1 text-sm text-accent">
            Try the sample <ArrowUpRight size={14} />
          </span>
          {showModule && (
            <code className="mt-3 text-xs font-mono text-text-secondary">{u.module}</code>
          )}
        </a>
      ))}
    </div>
  );
}
