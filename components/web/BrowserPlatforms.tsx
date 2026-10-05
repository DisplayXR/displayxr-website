import { browserAvailability } from "@/lib/data/web";

/**
 * Where the DisplayXR Browser runs, from the browser's actual release assets
 * (generated) plus the two honest states the generator can't know: macOS is
 * coming soon, and there is no iOS build.
 */
export function BrowserPlatforms({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="DisplayXR Browser platforms">
      {browserAvailability().map((b) => (
        <li
          key={b.os}
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
            b.state === "available"
              ? "border-accent/30 bg-accent/10 text-accent"
              : "border-border text-text-secondary"
          }`}
        >
          {b.os}
          {b.state === "coming-soon" && <span className="opacity-80">· coming soon</span>}
          {b.state === "unavailable" && <span className="opacity-80">· not available</span>}
        </li>
      ))}
    </ul>
  );
}
