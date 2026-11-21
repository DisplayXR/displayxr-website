"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";

// The Catalog landing's three intent doors. The nested frames in each
// aperture shift with the pointer, which reads as looking into a display.
// The styles live in globals.css (.catalog-aperture); this component only
// moves two custom properties. Under prefers-reduced-motion it attaches no
// listeners and the CSS pins the frames centered.

export interface Door {
  say: string;
  text: string;
  go: string;
  href: string;
  icon: ReactNode;
  games?: boolean;
}

export function Doors({ doors }: { doors: Door[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const apertures = () => el.querySelectorAll<HTMLElement>(".catalog-aperture");
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    const move = (e: PointerEvent) => {
      apertures().forEach((a) => {
        const r = a.getBoundingClientRect();
        const x = clamp((e.clientX - (r.left + r.width / 2)) / r.width);
        const y = clamp((e.clientY - (r.top + r.height / 2)) / r.height);
        a.style.setProperty("--px", (-x).toFixed(3));
        a.style.setProperty("--py", (-y).toFixed(3));
      });
    };
    const leave = () => {
      apertures().forEach((a) => {
        a.style.setProperty("--px", "0");
        a.style.setProperty("--py", "0");
      });
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ref} className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-3 md:gap-5">
      {doors.map((d) => {
        const door = d.games ? "var(--color-games)" : "var(--color-accent)";
        return (
          <Link
            key={d.say}
            href={d.href}
            style={{ "--door": door } as React.CSSProperties}
            className={`group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-300 ${
              d.games ? "hover:border-games/60" : "hover:border-accent/60"
            }`}
          >
            <div
              aria-hidden
              className="catalog-aperture relative h-[150px] overflow-hidden border-b border-border bg-[#050507] md:h-[230px]"
            >
              <i />
              <i />
              <i />
              <i />
              <i />
              <span className="catalog-aperture-icon">{d.icon}</span>
            </div>
            <div className="flex flex-1 flex-col gap-2.5 p-6">
              <p className="font-display text-[28px] leading-[1.12] tracking-tight text-text-primary">{d.say}</p>
              <p className="text-sm leading-relaxed text-text-secondary">{d.text}</p>
              <p className={`mt-auto pt-2.5 text-sm font-medium ${d.games ? "text-games" : "text-accent"}`}>
                {d.go} →
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
