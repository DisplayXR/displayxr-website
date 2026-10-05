"use client";

import { Download, Clock, Ban } from "lucide-react";
import { useVisitorOS } from "@/lib/visitor-os";
import type { ComponentRelease } from "@/lib/data/generated";

/**
 * The browser's own download action. Names the visitor's OS once known and
 * links the right installer directly; macOS says "coming soon", iOS says it
 * isn't available. Before detection (server render) it points at /download.
 */
export function BrowserDownload({ browser }: { browser?: ComponentRelease }) {
  const os = useVisitorOS();
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200";
  if (os === "macOS")
    return (
      <span className={`${base} border border-border text-text-secondary`}>
        <Clock size={16} /> macOS: coming soon
      </span>
    );
  if (os === "iOS")
    return (
      <span className={`${base} border border-border text-text-secondary`}>
        <Ban size={16} /> Not available on iOS
      </span>
    );
  const dl = os ? browser?.downloads.find((d) => d.platform === os) : undefined;
  return (
    <a
      href={dl ? dl.url : "/download"}
      data-umami-event="browser-download"
      data-umami-event-os={os ?? "unknown"}
      className={`${base} bg-accent text-white hover:bg-accent-hover hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]`}
    >
      <Download size={16} />
      {dl ? `Download for ${os}` : "Download the browser"}
    </a>
  );
}
