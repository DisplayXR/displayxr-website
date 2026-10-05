"use client";

import { memo, useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * The /browser hero demonstrates itself: an interactive Gaussian splat behind
 * the page, through the same SDK the page advertises. In the DisplayXR
 * Browser on a spatial display it is in depth; everywhere else it is an
 * interactive 2D splat (drag to look around).
 *
 * Reveal: the SDK's "assemble" particle reveal, as in the DisplayXR Gallery.
 *
 * Woven-canvas rules (displayxr-web docs/woven-canvas-rules.md):
 *  1. one session per document: sharedInline3D(), never a second createInline3D();
 *  2. the poster stays up until the first woven frame (`firstWoven`), so no
 *     raw side-by-side frame ever shows;
 *  3. the canvas lives in a memoized child React never re-renders over.
 *
 * Interaction: in 2D the mouse position over the hero drives the SDK's eye
 * offset (setViewOffset, a head-parallax analogue), eased, so near content
 * slides against far content without a click; dragging still orbits. In
 * woven 3D the head tracker owns the eyes and the offset draws nothing.
 *
 * Performance: the poster is the LCP. The SDK, its engine and the .sog
 * (~10 MB) load only on idle and only with a fine pointer; touch devices keep
 * the poster and get a "Try 3D" button. Reduced motion still loads the splat
 * but turns the hover parallax off.
 *
 * Content: our own scene (generated image → SHARP mono → .sog). SHARP's
 * weights are research-licensed; David accepted that for this asset
 * (2026-10-04).
 */

const SOG_URL = "/media/browser-hero.sog";
const POSTER = "/media/browser-hero-poster.webp";
const MAX_X = 0.18;
const MAX_Y = 0.12;
// Rest zoom: 1.25× at the 1440×792 hero (aspect ≈1.82) keeps the splat's
// edges off-screen through the eye offset; wider heroes crop the 3:2 scene
// less, so the zoom scales with the aspect.
const restZoom = (el: Element | null) => {
  const r = el?.getBoundingClientRect();
  const aspect = r && r.height > 0 ? r.width / r.height : 1.82;
  return Math.min(1.7, Math.max(1.25, 1.25 * (aspect / 1.82)));
};

type Phase = "poster" | "loading" | "live" | "failed";

const SplatCanvas = memo(function SplatCanvas({
  canvasRef,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) {
  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />;
});

type SplatHandleLike = {
  ready: Promise<unknown>;
  firstWoven?: Promise<unknown>;
  remove?: () => void;
  setViewOffset?: (o: { x?: number; y?: number } | null) => unknown;
  setPose?: (p: { zoom?: number }) => void;
};

export function HeroSplat() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handleRef = useRef<SplatHandleLike | null>(null);
  const startedRef = useRef(false);
  const calmRef = useRef(false);
  const resizeOffRef = useRef<(() => void) | null>(null);
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
        // Rest zoom (restZoom) keeps the splat's edges off-screen through the
        // eye offset; the wheel/pinch peek relaxes back to it.
        zoom: { min: restZoom(canvasRef.current), max: 2.4, relax: true },
        // The Gallery's reveal: every gaussian flies in to assemble the scene.
        // Played once firstWoven settles (at once in 2D), while the poster fades.
        reveal: "assemble",
      }) as unknown as SplatHandleLike;
      handleRef.current = handle;
      await handle.ready;
      handle.setPose?.({ zoom: restZoom(canvasRef.current) });
      const onResize = () => handle.setPose?.({ zoom: restZoom(canvasRef.current) });
      window.addEventListener("resize", onResize);
      resizeOffRef.current = () => window.removeEventListener("resize", onResize);
      // In the DisplayXR Browser, hold the poster until the first woven frame.
      if (wall.supported && handle.firstWoven) await handle.firstWoven;
      setPhase("live");
      if (!wall.supported && !calmRef.current) startParallax(handle);
    } catch (err) {
      console.warn("[browser-hero] splat unavailable, keeping the poster:", err);
      setPhase("failed");
    }
  }

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTouch(!fine);
    calmRef.current = calm;
    if (!fine) return;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopRef = useRef<(() => void) | null>(null);
  function startParallax(handle: SplatHandleLike) {
    if (!handle.setViewOffset) return;
    const section = canvasRef.current?.closest("section");
    if (!section) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      // Normalised to [-1, 1] across the hero, then scaled down hard: a splat
      // lifted from ONE photo only holds up over a small eye move (|offset| = 1
      // swings 15° and tears disocclusion holes). MAX_X/MAX_Y were tuned by eye.
      tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1)) * MAX_X;
      ty = -Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1)) * MAX_Y;
    };
    const onLeave = () => { tx = 0; ty = 0; };
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      handle.setViewOffset?.({ x, y });
      raf = requestAnimationFrame(tick);
    };
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);
    stopRef.current = () => {
      cancelAnimationFrame(raf);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }

  useEffect(
    () => () => {
      stopRef.current?.();
      resizeOffRef.current?.();
      handleRef.current?.remove?.();
    },
    [],
  );

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
            Move your mouse to look around this scene. Open this page in the
            DisplayXR Browser on a spatial display and it comes out of the page.
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
