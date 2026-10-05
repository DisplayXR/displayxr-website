import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { BrowserPlatforms } from "@/components/web/BrowserPlatforms";

/**
 * One band for the DisplayXR Browser. The homepage tells the project's story;
 * the browser has its own page (and header tab), so this only points there.
 */
export function BrowserTeaser() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 md:px-12 py-24">
      <div className="section-divider mb-24" />
      <AnimateIn>
        <div className="rounded-2xl border border-border bg-surface p-8 md:p-12 md:flex md:items-center md:justify-between md:gap-12">
          <div className="max-w-2xl">
            <h2 className="text-sm font-medium text-accent uppercase tracking-wider mb-4">
              DisplayXR Browser
            </h2>
            <h3 className="text-3xl md:text-4xl font-display tracking-tight text-text-primary mb-4">
              Same web page. Now in 3D.
            </h3>
            <p className="text-text-secondary leading-relaxed mb-6">
              A Chromium-based browser that shows a page&apos;s 3D products,
              movies, photos and calls in depth on a spatial display, and the
              same page as usual everywhere else.
            </p>
            <BrowserPlatforms />
          </div>
          <div className="mt-8 flex shrink-0 flex-wrap gap-3 md:mt-0">
            <Button href="/web">Explore the browser</Button>
          </div>
        </div>
      </AnimateIn>
    </section>
  );
}
