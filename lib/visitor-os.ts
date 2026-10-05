"use client";

import { useEffect, useState } from "react";
import type { Platform } from "@/lib/data/generated";

/** Platforms a visitor can be on: the four we ship for, plus iOS, which we don't. */
export type VisitorOS = Platform | "iOS";

/**
 * Best-effort guess at the visitor's OS, client-side only. Returns null on the
 * server and on the first client render, so pages always server-render the
 * all-platforms view (crawlers, no-JS) and only then promote the visitor's own.
 */
export function useVisitorOS(): VisitorOS | null {
  const [os, setOS] = useState<VisitorOS | null>(null);
  useEffect(() => {
    const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
    const ua = `${nav.userAgentData?.platform ?? ""} ${navigator.userAgent}`;
    // iPadOS reports itself as a Mac; a touch screen gives it away.
    const touchMac = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
    if (/iPhone|iPad|iPod/.test(ua) || touchMac) setOS("iOS");
    else if (/Android/i.test(ua)) setOS("Android");
    else if (/Win/.test(ua)) setOS("Windows");
    else if (/Mac/.test(ua)) setOS("macOS");
    else if (/Linux|X11|CrOS/.test(ua)) setOS("Linux");
  }, []);
  return os;
}
