"use client";

import { memo, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The /play hero's real eye pair, woven. In the DisplayXR Browser on a spatial
 * display the two captured eyes are composed side by side and handed to the
 * SDK's addImage, so the frame shows in depth as one picture. Everywhere else
 * (and until the first woven frame, and if weaving fails) the page's own
 * two-image layout, passed as children, is what shows: nothing changes there.
 *
 * Woven-canvas rules (displayxr-web docs/woven-canvas-rules.md), as in
 * components/browser/HeroSplat.tsx: one session per document
 * (sharedInline3D), a poster over the canvas until `firstWoven`, and a
 * memoized canvas React never re-renders over. The images are small, so
 * there is no fine-pointer gate; the SDK is imported only where
 * inline3DAvailable() says the browser can weave at all.
 */

const EYE_W = 1440;
const EYE_H = 900;

type Phase = "flat" | "weaving" | "woven";

const PairCanvas = memo(function PairCanvas({
  canvasRef,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) {
  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />;
});

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`could not load ${src}`));
    img.src = src;
  });
}

export function WovenEyePair({ left, right, children }: { left: string; right: string; children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handleRef = useRef<{ remove?: () => void } | null>(null);
  const [phase, setPhase] = useState<Phase>("flat");

  useEffect(() => {
    let cancelled = false;
    const ric =
      (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
        .requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 600));
    const run = async () => {
      try {
        const sdk = await import("@displayxr/inline3d");
        if (cancelled || !sdk.inline3DAvailable()) return;
        const [wall, l, r] = await Promise.all([sdk.sharedInline3D(), loadImage(left), loadImage(right)]);
        if (cancelled || !wall.supported) return;
        // Show the canvas (with the left eye as its poster) before adding the
        // tile: a window must be laid out to join the weave.
        setPhase("weaving");
        await new Promise((res) => requestAnimationFrame(() => res(null)));
        const canvas = canvasRef.current;
        if (cancelled || !canvas) return;
        const sbs = document.createElement("canvas");
        sbs.width = EYE_W * 2;
        sbs.height = EYE_H;
        const ctx = sbs.getContext("2d");
        if (!ctx) throw new Error("no 2D context");
        ctx.drawImage(l, 0, 0, EYE_W, EYE_H);
        ctx.drawImage(r, EYE_W, 0, EYE_W, EYE_H);
        const handle = wall.addImage(canvas, sbs, { width: EYE_W, height: EYE_H });
        handleRef.current = handle;
        const res = await handle.firstWoven;
        if (cancelled) return;
        if (res.woven || res.confirmed) {
          setPhase("woven");
          document.documentElement.dataset.inline3d = "woven";
        } else {
          handle.remove();
          handleRef.current = null;
          setPhase("flat");
        }
      } catch (err) {
        console.warn("[play-hero] weave unavailable, keeping the flat pair:", err);
        if (!cancelled) setPhase("flat");
      }
    };
    const id = ric(() => void run(), { timeout: 2000 });
    return () => {
      cancelled = true;
      const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (cic) cic(id as number);
      else window.clearTimeout(id as number);
      delete document.documentElement.dataset.inline3d;
      handleRef.current?.remove?.();
    };
  }, [left, right]);

  if (phase === "flat") return <>{children}</>;
  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-[#0c1222]">
        <PairCanvas canvasRef={canvasRef} />
        {phase === "weaving" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={left} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
        )}
      </div>
      <p className="text-sm text-text-secondary">
        The same frame, both eyes at once: rendered twice by the stereo layer on Steam for Linux and woven
        for your display.
      </p>
    </div>
  );
}
