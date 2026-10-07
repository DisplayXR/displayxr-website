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
 * Interaction: in 2D the SDK's eye offset (setViewOffset, a head-parallax
 * analogue) is driven, eased, by the mouse position over the hero on desktop
 * and by the phone's tilt on touch devices, so near content slides against
 * far content. iOS only grants motion access from a user gesture, so the
 * permission is requested synchronously inside the "Try 3D" tap; if it is
 * refused (or there is no gyroscope) dragging still orbits. In woven 3D the
 * head tracker owns the eyes and the offset draws nothing.
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

// A Streamed SOG on Vercel Blob (store displayxr-website-media; public, CORS *,
// range requests OK, immutable versioned prefix: a rebuild goes to a NEW
// prefix). Four levels, finest first (100 / 50 / 25 / 12.5 %): the coarsest
// (~1.8 MB) paints first, finer chunks stream in, and the final state is the
// full original 1,179,648 gaussians, nothing thinned (David's condition).
const SOG_URL =
  "https://fbocp00kywsybakc.public.blob.vercel-storage.com/media/browser-hero/streamed-v2/lod-meta.json";
// Above the finest level's count, so the budget never thins the final state
// (the SDK's default streamed budget is 600k).
const SPLAT_BUDGET = 1_250_000;

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
  // The poster leaves the DOM once the splat is live. Over a woven canvas a
  // full-size layer must never linger at opacity 0 (woven-canvas rule 8: hide
  // with display:none), and in 3D the cover is a hard cut, never a fade (rule 11).
  const [posterGone, setPosterGone] = useState(false);
  // Device-orientation access on touch devices: null until asked.
  const [tilt, setTilt] = useState<"granted" | "denied" | null>(null);
  const tiltRef = useRef<Promise<"granted" | "denied"> | null>(null);

  // MUST run synchronously inside the tap: iOS rejects a permission request
  // made after an await. Android and others need no permission.
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
      // A Streamed SOG loads by URL (its chunks are relative to lod-meta.json).
      const handle = addSplat(wall, canvasRef.current, SOG_URL, {
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
        // Twice the stereo baseline of the photo's own rig: David asked for
        // double the depth on the panel (2026-10-05). Absolute, not normalised.
        ipdFactor: 2,
        // Coarser levels stand in while finer ones stream; the budget clears
        // the full count, so the settled frame is the original resolution.
        perf: { splatBudget: SPLAT_BUDGET, lodUnderfillLimit: 3 },
      }) as unknown as SplatHandleLike;
      handleRef.current = handle;
      // For tests and curious devs: window.__heroSplatStats() → SDK stats().
      (window as Window & { __heroSplatStats?: () => unknown }).__heroSplatStats = () =>
        (handle as unknown as { stats?: () => unknown }).stats?.();
      await handle.ready;
      handle.setPose?.({ zoom: restZoom(canvasRef.current) });
      // Touch: the SDK's drag sets touch-action:none on the canvas, so a hero
      // this tall traps every swipe and the page cannot scroll. pan-y gives
      // vertical swipes back to the browser (the SDK sees pointercancel and
      // relaxes) while horizontal swipes still orbit. The vertical look-around
      // comes from the scroll itself (startTouchLook). Re-asserted once in case
      // the SDK re-attaches its handlers after the first frame.
      // Wheel: the SDK's zoom peek cancels wheel events on the canvas, so a
      // hero this tall would stop the page scrolling under the mouse. A
      // capture-phase listener on the section stops the event before it
      // reaches the canvas, without preventDefault, so the page scrolls.
      const sec = canvasRef.current?.closest("section");
      if (sec) {
        const passWheel = (e: WheelEvent) => e.stopPropagation();
        sec.addEventListener("wheel", passWheel, { capture: true, passive: true });
        const prevOff = resizeOffRef.current;
        resizeOffRef.current = () => {
          prevOff?.();
          sec.removeEventListener("wheel", passWheel, { capture: true });
        };
      }
      if (!window.matchMedia("(pointer: fine)").matches && canvasRef.current) {
        const c = canvasRef.current;
        c.style.touchAction = "pan-y";
        window.setTimeout(() => { c.style.touchAction = "pan-y"; }, 1000);
      }
      const onResize = () => handle.setPose?.({ zoom: restZoom(canvasRef.current) });
      window.addEventListener("resize", onResize);
      resizeOffRef.current = () => window.removeEventListener("resize", onResize);
      // In the DisplayXR Browser, hold the poster until the first woven frame.
      if (wall.supported && handle.firstWoven) await handle.firstWoven;
      setPhase("live");
      if (wall.supported) {
        setPosterGone(true);
        // The sticky navbar's backdrop blur would read the interlaced weave
        // under it (rule 10); globals.css swaps it for a plain tint on this flag.
        document.documentElement.dataset.inline3d = "woven";
      } else {
        window.setTimeout(() => setPosterGone(true), 800);
      }
      if (!wall.supported && !calmRef.current) {
        if (tiltRef.current) {
          const t = await tiltRef.current;
          setTilt(t);
          startTouchLook(handle, t === "granted");
        } else {
          startParallax(handle);
        }
      }
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
    // Same rule as the homepage video: don't auto-fetch ~10 MB on Save-Data or
    // a 2g-class link (feature-detected; Safari has no navigator.connection).
    const conn = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    const slow = !!conn && (conn.saveData === true || conn.effectiveType === "2g" || conn.effectiveType === "slow-2g");
    if (!fine || slow) return;
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

  // Touch look-around: phone tilt (when allowed) plus the page's own scroll
  // drive the SDK eye offset. Tilt: the first reading is the rest pose, which
  // drifts slowly toward how the phone is held, and ±TILT_DEG reaches the
  // comfort-limited offset. Scroll: as the hero scrolls away the eye moves
  // down past the scene, so a vertical swipe both scrolls the page and looks
  // around (David, 2026-10-06). Horizontal swipes orbit through the SDK.
  function startTouchLook(handle: SplatHandleLike, useTilt: boolean) {
    if (!handle.setViewOffset) return;
    const section = canvasRef.current?.closest("section");
    const TILT_DEG = 18;
    const SCROLL_Y = MAX_Y * 1.5; // offset when the hero has fully scrolled away
    const LIMIT_Y = MAX_Y * 1.6;  // tilt + scroll together never tear the splat
    let rest: { a: number; b: number } | null = null;
    let tx = 0, tyTilt = 0, tyScroll = 0, x = 0, y = 0, raf = 0;
    const clamp = (v: number, m = 1) => Math.max(-m, Math.min(m, v));
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      // Map to screen axes for the current orientation: a = left/right, b = toward/away.
      const angle =
        (screen.orientation?.angle ?? (window as Window & { orientation?: number }).orientation ?? 0) % 360;
      const [a, b] =
        angle === 90 ? [e.beta, -e.gamma] : angle === 270 || angle === -90 ? [-e.beta, e.gamma] : [e.gamma, e.beta];
      if (!rest) rest = { a, b };
      rest.a += (a - rest.a) * 0.01;
      rest.b += (b - rest.b) * 0.01;
      // Tilting the right edge away moves the eye to the left of the glass;
      // tilting the top away moves it up (pitch sign verified on an iPhone by
      // David, 2026-10-05: the first version had it inverted).
      tx = -clamp((a - rest.a) / TILT_DEG) * MAX_X;
      tyTilt = clamp((b - rest.b) / TILT_DEG) * MAX_Y;
    };
    const onScroll = () => {
      if (!section) return;
      const r = section.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height)));
      tyScroll = -p * SCROLL_Y;
    };
    const tick = () => {
      const ty = clamp(tyTilt + tyScroll, LIMIT_Y);
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      handle.setViewOffset?.({ x, y });
      raf = requestAnimationFrame(tick);
    };
    if (useTilt) window.addEventListener("deviceorientation", onOrient);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    raf = requestAnimationFrame(tick);
    stopRef.current = () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("deviceorientation", onOrient);
      window.removeEventListener("scroll", onScroll);
    };
  }

  useEffect(
    () => () => {
      stopRef.current?.();
      resizeOffRef.current?.();
      delete document.documentElement.dataset.inline3d;
      handleRef.current?.remove?.();
    },
    [],
  );

  return (
    <div className="absolute inset-0" data-hero-phase={phase}>
      <SplatCanvas canvasRef={canvasRef} />
      {!posterGone && (
        <Image
          src={POSTER}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={65}
          className={`pointer-events-none object-cover transition-opacity duration-700 ${phase === "live" ? "opacity-0" : "opacity-100"}`}
        />
      )}
      {/* Caption, 2D only: in the DisplayXR Browser the scene speaks for itself. */}
      <div className="pointer-events-none absolute bottom-6 right-6 z-10 max-w-xs text-right text-xs text-white/80 drop-shadow">
        {phase === "live" && supported === false && (
          <p>
            {!touch
              ? "Move your mouse to look around this scene."
              : tilt === "granted"
                ? "Tilt your phone, or scroll, to look around this scene."
                : "Swipe sideways, or scroll, to look around this scene."}{" "}
            Open this page in the DisplayXR Browser on a spatial display and it
            comes out of the page.
          </p>
        )}
      </div>
      {touch && phase === "poster" && (
        <button
          type="button"
          onClick={onTryTap}
          className="absolute bottom-6 right-6 z-10 rounded-full border border-white/40 bg-black/55 px-4 py-2 text-sm text-white"
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
