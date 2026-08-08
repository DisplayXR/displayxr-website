"use client";

import { useEffect, useState } from "react";
import { NEWS_KIND_LABELS, type NewsItem } from "@/lib/data/news";

const DWELL_MS = 6000;
const FADE_MS = 260;

interface NewsTickerProps {
  /**
   * Already filtered and capped by `getBannerNews()` on the server — this
   * component deliberately does no date maths, so there is nothing for the
   * client and the server to disagree about at hydration.
   */
  items: NewsItem[];
}

export function NewsTicker({ items }: NewsTickerProps) {
  const count = items.length;
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Re-arms on every index change, so the dwell always restarts from the
  // moment an item actually became visible (including manual dot selection).
  useEffect(() => {
    if (count <= 1 || paused || reducedMotion) return;
    const fadeOut = setTimeout(() => setVisible(false), DWELL_MS);
    const fadeIn = setTimeout(() => {
      setIndex((i) => (i + 1) % count);
      setVisible(true);
    }, DWELL_MS + FADE_MS);
    return () => {
      clearTimeout(fadeOut);
      clearTimeout(fadeIn);
    };
  }, [index, paused, reducedMotion, count]);

  if (count === 0) return null;

  const item = items[Math.min(index, count - 1)];

  return (
    <div
      className="hero-animate flex items-center gap-3 mb-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <a
        href={item.href}
        target={item.href.startsWith("http") ? "_blank" : undefined}
        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="group inline-flex max-w-full items-center gap-2.5 rounded-full border border-accent/30 bg-surface/70 py-1.5 pl-2.5 pr-3.5 text-sm backdrop-blur-sm transition-colors hover:border-accent/60 hover:bg-surface/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        style={{
          opacity: visible ? 1 : 0,
          transition: `opacity ${FADE_MS}ms ease-out`,
        }}
      >
        <span className="inline-flex items-center gap-1.5 shrink-0">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 motion-safe:animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span className="text-xs font-medium uppercase tracking-wide text-accent">
            {NEWS_KIND_LABELS[item.kind]}
          </span>
        </span>
        <span className="h-3.5 w-px shrink-0 bg-border" aria-hidden />
        <span className="truncate font-medium text-text-primary">
          {item.headline}
        </span>
        <span
          className="shrink-0 text-text-secondary transition-transform group-hover:translate-x-0.5"
          aria-hidden
        >
          →
        </span>
      </a>

      {count > 1 && (
        <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
          {items.map((candidate, i) => (
            <button
              key={candidate.id}
              type="button"
              onClick={() => {
                setIndex(i);
                setVisible(true);
              }}
              aria-label={`Show update: ${candidate.headline}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                i === index
                  ? "w-4 bg-accent"
                  : "w-1.5 bg-text-secondary/40 hover:bg-text-secondary/70"
              }`}
            />
          ))}
        </div>
      )}

      {/* The pill links to the story it names; this is the only route from the
          hero to the feed itself, which holds more than the ticker can show. */}
      <a
        href="/news"
        className="group hidden shrink-0 items-center gap-1 text-sm text-text-secondary transition-colors hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:inline-flex"
      >
        All updates
        <span
          className="transition-transform group-hover:translate-x-0.5"
          aria-hidden
        >
          →
        </span>
      </a>
    </div>
  );
}
