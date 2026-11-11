"use client";

import { memo, useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * /apps/gallery: one Gallery photo in Spatial View, live, through the same SDK
 * the Gallery uses. In the DisplayXR Browser on a spatial display it is in
 * depth; everywhere else it is interactive 2D (drag to turn the scene; move
 * the mouse, or tilt a phone, to shift the viewpoint).
 *
 * The pattern is components/browser/HeroSplat.tsx, rule for rule
 * (displayxr-web docs/woven-canvas-rules.md):
 *  1. one session per document: sharedInline3D(), never a second createInline3D();
 *  2. the poster stays up until the first woven frame (`firstWoven`);
 *  3. the canvas lives in a memoized child React never re-renders over;
 *  4. the SDK + scene load on idle, only with a fine pointer (and here only once
 *     the tile nears the viewport); touch devices keep the poster and get "Try 3D";
 *  5. reduced motion still loads the scene but drops the hover parallax and the
 *     load reveal.
 *
 * Framing matches the Gallery's own Spatial View (displayxr-gallery-pvt,
 * SpatialView.tsx, PlayCanvas path): rig "auto" reads the scene's camera block
 * (the capture camera's rest pose, intrinsics and focus point), the orbit is
 * the SDK's tilt-and-relax, and the zoom is a 1x–2x peek that relaxes back.
 *
 * Content: the first picture of the Gallery post "Stereo macros by Don
 * Komarechka · donkom.ca" (asset 96dfb09b-1769-4e90-b79c-cc3fff81f30d),
 * picked by David 2026-11-10. Credit is mandatory and always visible.
 */

// A Streamed SOG on Vercel Blob (store displayxr-website-media; public, CORS *,
// immutable versioned prefix: a rebuild goes to a NEW prefix). Built from the
// Gallery's scene with the gallery repo's scripts/make_streamed_sog.ts
// (--levels 4 --force): four levels, finest first (100 / 50 / 25 / 12.5 %),
// camera block injected at the top level of lod-meta.json. The coarsest level
// paints first, and the final state is the full 1,179,648 gaussians.
const SOG_URL =
  "https://fbocp00kywsybakc.public.blob.vercel-storage.com/media/gallery-flower/v1/lod-meta.json";
// Above the finest level's count, so the budget never thins the final state
// (the SDK's default streamed budget is 600k).
const SPLAT_BUDGET = 1_250_000;

// The left eye of the Gallery's feed rendition (the scene's rest view IS the
// left capture camera, so the poster and the first frame line up).
const POSTER = "/media/gallery-flower-poster.webp";
export const GALLERY_FLOWER_CREDIT = "Stereo macro by Don Komarechka · donkom.ca";
const CREDIT_URL = "https://donkom.ca";
// Eye-offset range for the 2D look-around (a photo lift only holds up over a
// small eye move; same values as the /browser hero).
const MAX_X = 0.18;
const MAX_Y = 0.12;

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
};

export function GallerySpatialView() {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handleRef = useRef<SplatHandleLike | null>(null);
  const startedRef = useRef(false);
  const calmRef = useRef(false);
  const cleanupRef = useRef<(() => void) | null>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const [phase, setPhase] = useState<Phase>("poster");
  const [supported, setSupported] = useState<boolean | null>(null);
  const [touch, setTouch] = useState(false);
  // Leaves the DOM once live: never a full-size layer parked at opacity 0
  // over a woven canvas (rule 8), and a hard cut in 3D (rule 11).
  const [posterGone, setPosterGone] = useState(false);
  const [tilt, setTilt] = useState<"granted" | "denied" | null>(null);
  const tiltRef = useRef<Promise<"granted" | "denied"> | null>(null);

  // MUST run synchronously inside the tap: iOS rejects a permission request
  // made after an await.
  function requestTilt() {
    if (tiltRef.current) return;
    const DOE = (window as Window & {
      DeviceOrientationEvent?: { requestPermission?: () => Promise<"granted" | "denied"> };
    }).DeviceOrientationEvent;
    if (!DOE) tiltRef.current = Promise.resolve("denied");
    else if (typeof DOE.requestPermission === "function")
      tiltRef.current = DOE.requestPermission().catch(() => "denied" as const);
    else tiltRef.current = Promise.resolve("granted");
  }

  function onTryTap() {
    requestTilt();
    void start();
  }

  async function start() {
    if (startedRef.current || !canvasRef.current) return;
    startedRef.current = true;
    setPhase("loading");
    try {
      const [{ sharedInline3D }, { addSplat }] = await Promise.all([
        import("@displayxr/inline3d"),
        import("@displayxr/inline3d/splat/playcanvas"),
      ]);
      const wall = await sharedInline3D();
      setSupported(wall.supported);
      const handle = addSplat(wall, canvasRef.current, SOG_URL, {
        engine: "playcanvas",
        // The camera block drives the rig: the capture camera at its rest pose.
        rig: "auto",
        orbit: true,
        idleSpin: 0,
        renderScale: 1,
        flipY: true,
        focusInput: false,
        // The Gallery's peek: never past 1x (that shows the scene's edges), at
        // most 2x, relaxing back on release.
        zoom: { min: 1, max: 2, relax: true },
        reveal: calmRef.current ? false : "assemble",
        cursor: "depth",
        perf: { splatBudget: SPLAT_BUDGET, lodUnderfillLimit: 3 },
      }) as unknown as SplatHandleLike;
      handleRef.current = handle;
      await handle.ready;
      // The zoom peek cancels wheel events on the canvas; stop them in the
      // capture phase (no preventDefault) so the page keeps scrolling under
      // the mouse. Pinch still peeks.
      const box = boxRef.current;
      if (box) {
        const passWheel = (e: WheelEvent) => e.stopPropagation();
        box.addEventListener("wheel", passWheel, { capture: true, passive: true });
        cleanupRef.current = () => box.removeEventListener("wheel", passWheel, { capture: true });
      }
      if (!window.matchMedia("(pointer: fine)").matches && canvasRef.current) {
        // Give vertical swipes back to the page; horizontal swipes still turn the scene.
        const c = canvasRef.current;
        c.style.touchAction = "pan-y";
        window.setTimeout(() => { c.style.touchAction = "pan-y"; }, 1000);
      }
      if (wall.supported && handle.firstWoven) await handle.firstWoven;
      setPhase("live");
      if (wall.supported) {
        setPosterGone(true);
        // The sticky navbar's blur would read the weave under it (rule 10).
        document.documentElement.dataset.inline3d = "woven";
      } else {
        window.setTimeout(() => setPosterGone(true), 800);
      }
      if (!wall.supported && !calmRef.current) {
        if (tiltRef.current) {
          const t = await tiltRef.current;
          setTilt(t);
          if (t === "granted") startTilt(handle);
        } else {
          startParallax(handle);
        }
      }
    } catch (err) {
      console.warn("[gallery-spatial-view] unavailable, keeping the poster:", err);
      setPhase("failed");
    }
  }

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    calmRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTouch(!fine);
    const conn = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    const slow = !!conn && (conn.saveData === true || conn.effectiveType === "2g" || conn.effectiveType === "slow-2g");
    if (!fine || slow || !boxRef.current) return;
    let idleId: number | null = null;
    const ric =
      (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
        .requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    // Below the fold: wait until the tile nears the viewport, then start on idle.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          idleId = ric(() => void start(), { timeout: 3000 });
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(boxRef.current);
    return () => {
      io.disconnect();
      if (idleId != null) {
        const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
        if (cic) cic(idleId);
        else window.clearTimeout(idleId);
      }
    };
    // start() is stable for this component's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2D, fine pointer: the mouse over the tile eases the eye offset, so near
  // petals slide against the background. A drag still turns the scene.
  function startParallax(handle: SplatHandleLike) {
    const box = boxRef.current;
    if (!handle.setViewOffset || !box) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
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
    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);
    stopRef.current = () => {
      cancelAnimationFrame(raf);
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerleave", onLeave);
    };
  }

  // 2D, touch: the phone's tilt moves the eye, like a head. The first reading
  // is the rest pose, drifting slowly toward how the phone is held.
  function startTilt(handle: SplatHandleLike) {
    if (!handle.setViewOffset) return;
    const TILT_DEG = 18;
    let rest: { a: number; b: number } | null = null;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      const angle =
        (screen.orientation?.angle ?? (window as Window & { orientation?: number }).orientation ?? 0) % 360;
      const [a, b] =
        angle === 90 ? [e.beta, -e.gamma] : angle === 270 || angle === -90 ? [-e.beta, e.gamma] : [e.gamma, e.beta];
      if (!rest) rest = { a, b };
      rest.a += (a - rest.a) * 0.01;
      rest.b += (b - rest.b) * 0.01;
      tx = -clamp((a - rest.a) / TILT_DEG) * MAX_X;
      ty = clamp((b - rest.b) / TILT_DEG) * MAX_Y;
    };
    const tick = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      handle.setViewOffset?.({ x, y });
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("deviceorientation", onOrient);
    raf = requestAnimationFrame(tick);
    stopRef.current = () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("deviceorientation", onOrient);
    };
  }

  useEffect(
    () => () => {
      stopRef.current?.();
      cleanupRef.current?.();
      delete document.documentElement.dataset.inline3d;
      handleRef.current?.remove?.();
    },
    [],
  );

  return (
    <figure className="flex flex-col gap-3">
      <div
        ref={boxRef}
        data-spatial-view-phase={phase}
        className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-[#0c1222]"
      >
        <SplatCanvas canvasRef={canvasRef} />
        {!posterGone && (
          <Image
            src={POSTER}
            alt="A stereo macro photograph of a flower, shown flat until the live view loads."
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className={`pointer-events-none object-cover transition-opacity duration-700 ${phase === "live" ? "opacity-0" : "opacity-100"}`}
          />
        )}
        {touch && phase === "poster" && (
          <button
            type="button"
            onClick={onTryTap}
            className="absolute bottom-4 right-4 z-10 rounded-full border border-white/40 bg-black/55 px-4 py-2 text-sm text-white"
          >
            Try 3D
          </button>
        )}
        {phase === "loading" && touch && (
          <p className="absolute bottom-4 right-4 z-10 text-sm text-white/80">Loading 3D…</p>
        )}
      </div>
      <figcaption className="text-sm text-text-secondary">
        <a href={CREDIT_URL} target="_blank" rel="noopener noreferrer" className="text-text-primary hover:text-accent">
          {GALLERY_FLOWER_CREDIT}
        </a>
        <span className="block mt-1">
          {phase === "live" && supported
            ? "In depth on your display. Drag to turn the scene."
            : phase === "live"
              ? !touch
                ? "Drag to turn the scene; move your mouse to shift your viewpoint. In the DisplayXR Browser on a spatial display it is in depth."
                : tilt === "granted"
                  ? "Tilt your phone to shift your viewpoint, or swipe sideways to turn the scene."
                  : "Swipe sideways to turn the scene."
              : "Live Spatial View, from the DisplayXR Gallery."}
        </span>
      </figcaption>
    </figure>
  );
}
