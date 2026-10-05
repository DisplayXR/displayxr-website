import { ShoppingBag, Clapperboard, Video } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";

const TILES = [
  { label: "Shop", line: "See the product, not a photo of it.", icon: <ShoppingBag size={22} /> },
  { label: "Watch", line: "3D movies, right in the page.", icon: <Clapperboard size={22} /> },
  { label: "Call", line: "Face to face, in depth.", icon: <Video size={22} /> },
];

/**
 * One band for the DisplayXR Browser. The homepage tells the project's story;
 * the browser has its own page and header tab, so this only points there.
 * No code on the homepage (design spec §0).
 */
export function BrowserTeaser() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 md:px-12 py-24">
      <div className="section-divider mb-24" />
      <AnimateIn>
        <div className="rounded-2xl border border-border bg-surface p-8 md:p-12">
          <h2 className="text-sm font-medium text-accent uppercase tracking-wider mb-4">
            DisplayXR Browser
          </h2>
          <h3 className="text-3xl md:text-4xl font-display tracking-tight text-text-primary mb-4 max-w-2xl">
            Same web page. Now in 3D.
          </h3>
          <p className="text-text-secondary leading-relaxed mb-8 max-w-2xl">
            A Chromium-based browser for spatial displays: a page&apos;s 3D
            products, movies, photos and calls appear in depth, right in the
            page, and every other site works as usual.
          </p>
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {TILES.map((t) => (
              <div key={t.label} className="flex items-start gap-3">
                <span className="mt-0.5 text-accent">{t.icon}</span>
                <div>
                  <p className="font-semibold text-text-primary">{t.label}</p>
                  <p className="text-sm text-text-secondary">{t.line}</p>
                </div>
              </div>
            ))}
          </div>
          <Button href="/browser">Meet the DisplayXR Browser →</Button>
        </div>
      </AnimateIn>
    </section>
  );
}
