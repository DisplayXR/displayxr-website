import Image from "next/image";
import { GITHUB_ORG_URL, REPO_URLS } from "@/lib/constants";

const footerLinks = {
  Project: [
    { label: "Docs", href: "/docs" },
    { label: "Architecture", href: "/architecture" },
    { label: "Extensions", href: "/extensions" },
    { label: "Compatibility", href: "/compatibility" },
    { label: "Roadmap", href: "/roadmap" },
  ],
  Ecosystem: [
    { label: "Runtime", href: REPO_URLS.runtime },
    { label: "Extensions", href: REPO_URLS.extensions },
    { label: "Unity Plugin", href: REPO_URLS.unity },
    { label: "Unreal Plugin", href: REPO_URLS.unreal },
    { label: "Demos", href: REPO_URLS.demos },
  ],
  Resources: [
    { label: "GitHub", href: GITHUB_ORG_URL },
    { label: "Projection Library", href: REPO_URLS.projection },
    { label: "Spatial Shell", href: REPO_URLS.shell },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <Image
                src="/logos/displayxr-logo.png"
                alt="DisplayXR"
                width={24}
                height={24}
                className="rounded"
              />
              <span className="font-semibold text-text-primary">
                DisplayXR
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              An open runtime and extension stack for tracked glasses-free 3D
              displays.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-text-primary mb-3">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => {
                  const isExternal = link.href.startsWith("http");
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                        {...(isExternal
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border text-sm text-text-secondary">
          &copy; {new Date().getFullYear()} DisplayXR. Open source under MIT
          license.
        </div>
      </div>
    </footer>
  );
}
