import Image from "next/image";
import { DISCUSSIONS_URL, DOCS_URL, GITHUB_ORG_URL, REPO_URLS } from "@/lib/constants";

// Mirrors the header hubs, plus the pages that live under each.
const footerLinks = {
  Developers: [
    { label: "Developers", href: "/developers" },
    { label: "3D on the web", href: "/browser" },
    { label: "Download", href: "/download" },
    { label: "Extensions", href: "/extensions" },
    { label: "Demos", href: "/demos" },
    { label: "Platform Support", href: "/platform-support" },
    { label: "Docs ↗", href: DOCS_URL },
  ],
  Contribute: [
    { label: "Contribute", href: "/contribute" },
    { label: "Architecture", href: "/architecture" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Governance", href: "/governance" },
    { label: "Discussions ↗", href: DISCUSSIONS_URL },
    { label: "GitHub ↗", href: GITHUB_ORG_URL },
  ],
  "Display Vendors": [
    { label: "Plug-in guide", href: "/vendors" },
    { label: "Input providers", href: "/vendors#input-providers" },
    { label: "Platform Support", href: "/platform-support" },
    { label: "Common Library ↗", href: REPO_URLS.common },
    { label: "About DisplayXR", href: "/about" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/30">
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
              An open-source OpenXR runtime and the extensions OpenXR needs for spatial displays, with or without glasses.
            </p>
            {/* Cross-persona, so it lives here rather than in one audience column. */}
            <a
              href="/news"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              What&rsquo;s New
            </a>
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
          &copy; {new Date().getFullYear()} DisplayXR. Open source under the
          Boost Software License 1.0.
        </div>
      </div>
    </footer>
  );
}
