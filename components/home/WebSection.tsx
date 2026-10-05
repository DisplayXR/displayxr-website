import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { UseCaseGrid } from "@/components/web/UseCaseGrid";
import { BrowserPlatforms } from "@/components/web/BrowserPlatforms";
import { HELLO_WORLD } from "@/lib/data/web";
import { GALLERY_URL, WEB_SAMPLES_URL } from "@/lib/constants";

/**
 * The web is the front door: the easiest claim to understand and the
 * cheapest to try. Headline and the Shop / Watch / Call tiles come from the
 * browser feature catalog's advertising plan (option A).
 */
export function WebSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 md:px-12 py-24">
      <AnimateIn>
        <h2 className="text-sm font-medium text-accent uppercase tracking-wider mb-4">
          3D on the web
        </h2>
        <h3 className="text-3xl md:text-4xl font-display tracking-tight text-text-primary mb-4 max-w-2xl">
          Same web page. Now in 3D.
        </h3>
        <p className="text-text-secondary leading-relaxed mb-6 max-w-2xl">
          On a spatial display, the DisplayXR Browser shows a page&apos;s 3D
          products, movies, photos and calls in real depth, right in the page.
          Everywhere else, it&apos;s the page you already know.
        </p>
        <BrowserPlatforms className="mb-10" />
      </AnimateIn>

      <AnimateIn delay={80}>
        <UseCaseGrid ids={["shop", "watch", "call"]} />
      </AnimateIn>

      <AnimateIn delay={160}>
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <h4 className="text-xl font-semibold text-text-primary mb-3">
              For developers: a few lines of JavaScript
            </h4>
            <p className="text-text-secondary leading-relaxed mb-6">
              The <code className="font-mono text-sm">@displayxr/inline3d</code>{" "}
              SDK turns a canvas into a 3D window. The same page ships safely to
              every browser: it is 3D in the DisplayXR Browser and an ordinary
              2D view anywhere else, so there is nothing to branch on.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/download">Get the browser</Button>
              <Button variant="secondary" href="/web">
                For developers
              </Button>
            </div>
            <p className="mt-6 text-sm text-text-secondary">
              See it live:{" "}
              <a href={WEB_SAMPLES_URL} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover underline underline-offset-2">
                SDK samples
              </a>{" "}
              ·{" "}
              <a href={GALLERY_URL} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover underline underline-offset-2">
                DisplayXR Gallery
              </a>
            </p>
          </div>
          <CodeSnippet code={HELLO_WORLD} label="index.html" />
        </div>
      </AnimateIn>
    </section>
  );
}
