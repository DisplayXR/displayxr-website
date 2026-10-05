"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * The homepage hero background. The poster is a priority image (the LCP);
 * the 1.4 MB loop is attached only on wide screens without reduced motion,
 * after the page is idle, and fades in once it actually plays. Phones keep
 * the poster: decoding the video there cost ~1.8 s of main-thread time in
 * Lighthouse's mobile run.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const v = ref.current;
    if (!wide || calm || !v) return;
    const ric =
      (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
        .requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 800));
    ric(() => {
      v.src = "/videos/hero-loop.mp4";
      void v.play().catch(() => {});
    }, { timeout: 2500 });
  }, []);

  return (
    <>
      <Image
        src="/videos/hero-loop-poster.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-50"
      />
      {/* Hero background animation (ping-pong palindrome loop) */}
      <video
        ref={ref}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? "opacity-50" : "opacity-0"}`}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        onPlaying={() => setPlaying(true)}
      />
    </>
  );
}
