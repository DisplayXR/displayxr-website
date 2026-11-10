import type { ReactNode } from "react";
import type { AppStatus } from "@/lib/data/apps";

// Shared primitives for /apps and its product pages, in the /play and
// /browser mold: full-bleed bands, big type, one idea per screen.

export const Band = ({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) => (
  <section id={id} className={`scroll-mt-20 px-6 md:px-12 py-20 md:py-24 ${className}`}>
    <div className="mx-auto max-w-[1200px]">{children}</div>
  </section>
);

export const Eyebrow = ({ children, color }: { children: ReactNode; color?: string }) => (
  <p className="mb-4 text-sm font-medium uppercase tracking-wider text-accent" style={color ? { color } : undefined}>
    {children}
  </p>
);

export const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="mb-5 max-w-3xl text-4xl md:text-5xl font-display tracking-tight text-text-primary leading-[1.08]">
    {children}
  </h2>
);

export const Lead = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <p className={`max-w-2xl text-lg leading-relaxed text-text-secondary ${className}`}>{children}</p>
);

/** Status chip that follows public releases (see lib/data/apps.ts). */
export function StatusChip({ status }: { status: AppStatus }) {
  const { label, cls } =
    status.kind === "live"
      ? { label: "Live", cls: "bg-success/15 text-success" }
      : status.kind === "release"
        ? { label: `Released · ${status.version}`, cls: "bg-accent/15 text-accent" }
        : { label: "Community", cls: "bg-warning/15 text-warning" };
  return <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>{label}</span>;
}

/**
 * Page-level Open Graph / Twitter blocks. Next replaces (not merges) the
 * layout's `openGraph`, so the site image is restated here.
 */
export function socialMeta(title: string, description: string, path: string) {
  const og = "https://displayxr.org/og-image.jpeg";
  const images = [{ url: og, width: 1200, height: 630, alt: "DisplayXR — OpenXR for Spatial Displays" }];
  return {
    openGraph: { title, description, url: `https://displayxr.org${path}`, siteName: "DisplayXR", type: "website" as const, images },
    twitter: { card: "summary_large_image" as const, title, description, images: [og] },
  };
}

export const FeatureGrid =({ items, cols = 2 }: { items: { title: string; text: string }[]; cols?: 2 | 3 }) => (
  <div className={`grid gap-5 sm:grid-cols-2 ${cols === 3 ? "lg:grid-cols-3" : ""}`}>
    {items.map((f) => (
      <div key={f.title} className="rounded-2xl border border-border bg-surface p-6">
        <h3 className="mb-2 text-base font-semibold text-text-primary">{f.title}</h3>
        <p className="text-sm leading-relaxed text-text-secondary">{f.text}</p>
      </div>
    ))}
  </div>
);
