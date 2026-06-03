"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { GitHubIcon } from "@/components/ui/GitHubIcon";
import {
  NAV,
  GITHUB_ORG_URL,
  DOWNLOAD_HREF,
  isMenu,
  type NavLeaf,
  type NavMenu,
} from "@/lib/constants";

// A nav target is "current" when the path matches it or sits beneath it.
function hrefActive(pathname: string, href: string, external?: boolean) {
  if (external) return false;
  return pathname === href || pathname.startsWith(href + "/");
}
function menuActive(pathname: string, menu: NavMenu) {
  return menu.items.some((i) => hrefActive(pathname, i.href, i.external));
}

function LeafLink({
  item,
  onClick,
  className,
}: {
  item: NavLeaf;
  onClick?: () => void;
  className?: string;
}) {
  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={className}
      >
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} onClick={onClick} className={className}>
      {item.label}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null); // desktop
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close desktop dropdown on Escape or outside click.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenMenu(null);
    const onClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-border bg-background/90 backdrop-blur-lg shadow-[0_1px_12px_rgba(0,0,0,0.4)]"
          : "border-transparent bg-background/60 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logos/displayxr-logo.png"
              alt="DisplayXR"
              width={32}
              height={32}
              className="rounded transition-transform duration-200 group-hover:scale-105"
            />
            <span className="text-lg font-semibold text-text-primary">
              DisplayXR
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV.map((entry) => {
              if (!isMenu(entry)) {
                const active = hrefActive(pathname, entry.href, entry.external);
                return (
                  <Link
                    key={entry.label}
                    href={entry.href}
                    className={`px-3 py-2 rounded-md text-sm transition-colors relative ${
                      active
                        ? "text-accent"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {entry.label}
                    {active && (
                      <span className="absolute bottom-0 left-3 right-3 h-px bg-accent" />
                    )}
                  </Link>
                );
              }

              const active = menuActive(pathname, entry);
              const open = openMenu === entry.label;
              return (
                <div
                  key={entry.label}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(entry.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={open}
                    onClick={() =>
                      setOpenMenu(open ? null : entry.label)
                    }
                    className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm transition-colors relative ${
                      active || open
                        ? "text-accent"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {entry.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                    {active && (
                      <span className="absolute bottom-0 left-3 right-6 h-px bg-accent" />
                    )}
                  </button>
                  {open && (
                    <div className="absolute left-0 top-full pt-2">
                      <div className="min-w-[200px] rounded-lg border border-border bg-surface p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
                        {entry.items.map((item) => {
                          const itemActive = hrefActive(
                            pathname,
                            item.href,
                            item.external
                          );
                          return (
                            <LeafLink
                              key={item.label}
                              item={item}
                              onClick={() => setOpenMenu(null)}
                              className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                                itemActive
                                  ? "text-accent bg-accent/10"
                                  : "text-text-secondary hover:text-text-primary hover:bg-background"
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right cluster: Download CTA + GitHub + mobile toggle */}
          <div className="flex items-center gap-2">
            <Link
              href={DOWNLOAD_HREF}
              className="hidden sm:inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-accent-hover hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-[0.98]"
            >
              Download
            </Link>
            <a
              href={GITHUB_ORG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-text-secondary hover:text-text-primary transition-colors"
              aria-label="GitHub"
            >
              <GitHubIcon size={20} />
            </a>
            <button
              className="md:hidden p-2 text-text-secondary hover:text-text-primary"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav — Download pinned on top, then each entry (menus as sections) */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-border mt-2 pt-4 space-y-1">
            <Link
              href={DOWNLOAD_HREF}
              onClick={() => setMobileOpen(false)}
              className="block rounded-md bg-accent px-3 py-2 text-center text-sm font-medium text-white"
            >
              Download
            </Link>
            {NAV.map((entry) => {
              if (!isMenu(entry)) {
                const active = hrefActive(pathname, entry.href, entry.external);
                return (
                  <Link
                    key={entry.label}
                    href={entry.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      active
                        ? "text-accent"
                        : "text-text-primary hover:text-accent"
                    }`}
                  >
                    {entry.label}
                  </Link>
                );
              }
              return (
                <div key={entry.label} className="pt-2">
                  <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    {entry.label}
                  </p>
                  {entry.items.map((item) => {
                    const itemActive = hrefActive(
                      pathname,
                      item.href,
                      item.external
                    );
                    return (
                      <LeafLink
                        key={item.label}
                        item={item}
                        onClick={() => setMobileOpen(false)}
                        className={`block rounded-md px-5 py-2 text-sm transition-colors ${
                          itemActive
                            ? "text-accent"
                            : "text-text-secondary hover:text-text-primary"
                        }`}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
