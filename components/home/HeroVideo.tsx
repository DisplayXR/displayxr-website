"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * The homepage hero background. The poster is a priority image (the LCP);
 * the loop is attached after the page is idle and fades in once it actually
 * plays, on every device (David: it has always played fine on phones).
 * Phones get a light 360p encode (~280 kB, vs 1.4 MB at 720p).
 * The still stays only when motion is unwanted or the connection is genuinely
 * bad: prefers-reduced-motion, Save-Data, or an effective type of 2g/slow-2g
 * (feature-detected; Safari has no navigator.connection, so it plays).
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    const slow = !!conn && (conn.saveData === true || conn.effectiveType === "2g" || conn.effectiveType === "slow-2g");
    const v = ref.current;
    if (calm || slow || !v) return;
    const ric =
      (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
        .requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 800));
    ric(() => {
      v.src = wide ? "/videos/hero-loop.mp4" : "/videos/hero-loop-mobile.mp4";
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
