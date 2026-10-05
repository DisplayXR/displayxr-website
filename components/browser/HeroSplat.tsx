"use client";

import { memo, useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * The /browser hero demonstrates itself: an interactive Gaussian splat behind
 * the page, through the same SDK the page advertises. In the DisplayXR
 * Browser on a spatial display it is in depth; everywhere else it is an
 * interactive 2D splat (drag to look around).
 *
 * Woven-canvas rules (displayxr-web docs/woven-canvas-rules.md):
 *  1. one session per document: sharedInline3D(), never a second createInline3D();
 *  2. the poster stays up until the first woven frame (`firstWoven`), so no
 *     raw side-by-side frame ever shows;
 *  3. the canvas lives in a memoized child React never re-renders over.
 *
 * Performance: the poster is the LCP. The SDK, its engine and the .sog
 * (~10 MB) load only on idle, only with a fine pointer and without reduced
 * motion; touch devices keep the poster and get a "Try 3D" button.
 *
 * Content: our own scene (generated image → SHARP mono → .sog). SHARP's
 * weights are research-licensed; David accepted that for this asset
 * (2026-10-04).
 */

const SOG_URL = "/media/browser-hero.sog";
const POSTER = "/media/browser-hero-poster.webp";

type Phase = "poster" | "loading" | "live" | "failed";

const SplatCanvas = memo(function SplatCanvas({
  canvasRef,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) {
  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />;
});

type SplatHandleLike = { ready: Promise<unknown>; firstWoven?: Promise<unknown>; remove?: () => void };

export function HeroSplat() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handleRef = useRef<SplatHandleLike | null>(null);
  const startedRef = useRef(false);
  const [phase, setPhase] = useState<Phase>("poster");
  const [supported, setSupported] = useState<boolean | null>(null);
  const [touch, setTouch] = useState(false);

  async function start() {
    if (startedRef.current || !canvasRef.current) return;
    startedRef.current = true;
    setPhase("loading");
    try {
      const [{ sharedInline3D }, { addSplat }] = await Promise.all([
        import("@displayxr/inline3d"),
        import("@displayxr/inline3d/splat"),
      ]);
      const wall = await sharedInline3D();
      setSupported(wall.supported);
      const bytes = await (await fetch(SOG_URL)).arrayBuffer();
      const handle = addSplat(wall, canvasRef.current, bytes, {
        engine: "playcanvas",
        rig: "auto",
        orbit: true,
        idleSpin: 0,
        flipY: true,
        focusInput: false,
        // A peek, not a navigation: never zoom out past the splat's edges.
        zoom: { min: 1, max: 2, relax: true },
      }) as unknown as SplatHandleLike;
      handleRef.current = handle;
      await handle.ready;
      // In the DisplayXR Browser, hold the poster until the first woven frame.
      if (wall.supported && handle.firstWoven) await handle.firstWoven;
      setPhase("live");
    } catch (err) {
      console.warn("[browser-hero] splat unavailable, keeping the poster:", err);
      setPhase("failed");
    }
  }

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTouch(!fine);
    if (!fine || calm) return;
    const ric =
      (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
        .requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    const id = ric(() => void start(), { timeout: 3000 });
    return () => {
      const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (cic) cic(id as number);
      else window.clearTimeout(id as number);
    };
    // start() is stable for this component's lifetime.
  }, []);

  useEffect(() => () => handleRef.current?.remove?.(), []);

  return (
    <div className="absolute inset-0">
      <SplatCanvas canvasRef={canvasRef} />
      <Image
        src={POSTER}
        alt=""
        fill
        priority
        sizes="100vw"
        className={`object-cover transition-opacity duration-700 ${phase === "live" ? "opacity-0" : "opacity-100"}`}
      />
      {/* Caption: switches on wall.supported (design spec S5). */}
      <div className="pointer-events-none absolute bottom-6 right-6 z-10 max-w-xs text-right text-xs text-white/80 drop-shadow">
        {phase === "live" && supported && <p>You&apos;re seeing this in 3D.</p>}
        {phase === "live" && supported === false && (
          <p>
            Drag to look around. Open this page in the DisplayXR Browser on a
            spatial display and this scene comes out of the page.
          </p>
        )}
      </div>
      {touch && phase === "poster" && (
        <button
          type="button"
          onClick={() => void start()}
          className="absolute bottom-6 right-6 z-10 rounded-full border border-white/40 bg-black/40 px-4 py-2 text-sm text-white backdrop-blur"
        >
          Try 3D
        </button>
      )}
      {phase === "loading" && touch && (
        <p className="absolute bottom-6 right-6 z-10 text-sm text-white/80">Loading 3D…</p>
      )}
    </div>
  );
}
