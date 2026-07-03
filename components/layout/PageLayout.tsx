import Image from "next/image";
import { AnimateIn } from "@/components/ui/AnimateIn";

interface PageLayoutProps {
  title: string;
  description?: string;
  /** Optional header art (path under /public) — fades in behind the title on large screens. */
  art?: string;
  children: React.ReactNode;
}

export function PageLayout({ title, description, art, children }: PageLayoutProps) {
  return (
    <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-16 md:py-24">
      <AnimateIn>
        <div className="relative mb-12">
          {art && (
            <div
              aria-hidden
              className="pointer-events-none select-none absolute -top-12 -right-6 hidden lg:block h-[260px] w-[500px]"
              style={{
                maskImage:
                  "linear-gradient(to left, rgba(0,0,0,0.85), transparent 95%)",
                WebkitMaskImage:
                  "linear-gradient(to left, rgba(0,0,0,0.85), transparent 95%)",
              }}
            >
              <Image
                src={art}
                alt=""
                fill
                sizes="500px"
                className="object-cover opacity-70"
              />
            </div>
          )}
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-display tracking-tight text-text-primary mb-4">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </AnimateIn>
      {children}
    </div>
  );
}
