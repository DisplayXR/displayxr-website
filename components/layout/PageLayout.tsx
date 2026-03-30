import { AnimateIn } from "@/components/ui/AnimateIn";

interface PageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function PageLayout({ title, description, children }: PageLayoutProps) {
  return (
    <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-16 md:py-24">
      <AnimateIn>
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display tracking-tight text-text-primary mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </AnimateIn>
      {children}
    </div>
  );
}
