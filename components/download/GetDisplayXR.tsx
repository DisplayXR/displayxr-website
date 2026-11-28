"use client";

import { useEffect, useState } from "react";
import { Check, Download } from "lucide-react";
import { useVisitorOS } from "@/lib/visitor-os";
import type { DownloadsData, Platform, ReleaseFile } from "@/lib/data/generated";
import { ADDONS, INCLUDED, OSES, RERUN_NOTE, SHOW_UPCOMING, STEPS, formatSize, type Addon } from "@/lib/data/get";

// White on #2563eb is 5.2:1 (the site's #3b82f6 accent is 3.7:1, too low for a 15px label).
const primaryBtn =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#2563eb] px-5 font-semibold text-white transition-colors hover:bg-[#1d4ed8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-hover";
const secondaryBtn =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-accent px-5 font-semibold text-text-primary transition-colors hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-hover";
const link = "text-accent-hover underline underline-offset-2 hover:text-text-primary";

function DlLink({ f, label, primary = true, className = "" }: { f: ReleaseFile; label: string; primary?: boolean; className?: string }) {
  return (
    <a href={f.url} data-umami-event="download" data-umami-event-file={f.file} className={`${primary ? primaryBtn : secondaryBtn} ${className}`}>
      <Download size={18} aria-hidden /> {label}
    </a>
  );
}

const toneClass = {
  who: "bg-accent/15 text-accent-hover border-accent/30",
  research: "bg-games/15 text-games-hover border-games/30",
  soon: "bg-text-secondary/15 text-text-secondary border-text-secondary/30",
} as const;

function AddonCard({ a, os, data }: { a: Addon; os: Platform; data: DownloadsData }) {
  const gen = a.gen ? data.addons.find((x) => x.id === a.gen) : undefined;
  const way = a.ways[os];
  const file = way?.download ? gen?.files[os] : undefined;
  const any = !!(way?.dash || file || way?.cli);
  const elsewhere = Object.keys(a.ways).length > 0;
  return (
    <article id={`addon-${a.id}`} className="scroll-mt-28 flex flex-col gap-4 rounded-xl border border-border bg-surface p-6">
      <span className={`self-start rounded-full border px-2.5 py-1 text-xs font-medium ${toneClass[a.badge.tone]}`}>{a.badge.label}</span>
      <div>
        <h3 className="mb-2 text-xl font-semibold text-text-primary">{a.name}</h3>
        <p className="text-sm leading-relaxed text-text-secondary">{a.descOn?.[os] ?? a.desc}</p>
      </div>
      <dl className="grid grid-cols-[84px_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-sm">
        {a.facts.map((f) => (
          <div key={f.k} className="contents">
            <dt className="text-text-secondary">{f.k}</dt>
            <dd className={f.placeholder ? "text-warning" : "text-text-primary"}>{f.v}</dd>
          </div>
        ))}
        {gen?.version && (
          <>
            <dt className="text-text-secondary">Version</dt>
            <dd className="font-mono text-text-primary">{gen.version}</dd>
          </>
        )}
      </dl>
      <div className="mt-auto flex flex-col gap-3 border-t border-border pt-4">
        {way?.dash && (
          <p className="text-sm text-text-primary">
            <strong className="font-semibold">Add it:</strong> Dashboard › Components › {way.dash}
          </p>
        )}
        {file && (
          <div className="flex flex-wrap items-center gap-3">
            <DlLink f={file} label={way?.dash ? `Or download for ${os}` : `Download for ${os}`} primary={!way?.dash} className="text-sm" />
            <span className="text-xs text-text-secondary">{formatSize(file.size)}</span>
          </div>
        )}
        {way?.cli && (
          <details className="text-sm text-text-secondary">
            <summary className="flex min-h-[44px] cursor-pointer items-center">Command line</summary>
            <code className="mt-1 block whitespace-pre-wrap rounded-md border border-border bg-background p-3 font-mono text-xs text-warning">{way.cli}</code>
          </details>
        )}
        {!any && (
          <p className="text-sm text-text-secondary">
            {a.unavailable ?? (
              <>
                {elsewhere ? `Not available on ${os} yet. ` : ""}
                {a.later}
              </>
            )}
          </p>
        )}
        {!any && a.follow && (
          <a href={`https://github.com/DisplayXR/${a.follow}`} className={`${link} text-sm min-h-[44px] inline-flex items-center`}>
            Follow progress on GitHub
          </a>
        )}
      </div>
    </article>
  );
}

export function GetDisplayXR({ data }: { data: DownloadsData }) {
  const detected = useVisitorOS();
  const [os, setOs] = useState<Platform>("Windows");
  const [picked, setPicked] = useState(false);
  useEffect(() => {
    if (!picked && detected && detected !== "iOS") setOs(detected);
  }, [detected, picked]);

  const bundle = data.installer?.files[os];
  const browser = data.browser?.files[os];
  const included = INCLUDED.filter((i) => i.on.includes(os));
  const addons = ADDONS.filter((a) => {
    if (SHOW_UPCOMING) return true;
    if (a.upcoming) return false;
    return !!a.ways[os];
  });

  return (
    <>
      {detected === "iOS" && (
        <p className="mb-6 rounded-xl border border-border bg-surface p-4 text-sm text-text-secondary">
          DisplayXR runs on Windows, macOS, Linux and Android tablets, not on iOS. Pick a system below to see its download.
        </p>
      )}

      <div role="radiogroup" aria-label="Your system" className="mb-6 flex flex-wrap gap-2">
        {OSES.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={o.id === os}
            onClick={() => {
              setOs(o.id);
              setPicked(true);
            }}
            className={`min-h-[44px] rounded-full border-2 px-5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-hover ${
              o.id === os ? "border-text-primary bg-text-primary text-background" : "border-border text-text-primary hover:border-text-secondary"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-5">
        {/* The installer */}
        <section aria-labelledby="bundle-h" className="flex min-w-0 flex-[999_1_560px] flex-col gap-5 rounded-2xl border border-accent/40 bg-surface p-6 md:p-8">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent-hover">New to DisplayXR · start here</p>
            <h2 id="bundle-h" className="text-2xl font-semibold text-text-primary md:text-3xl">The DisplayXR installer</h2>
          </div>
          {bundle && data.installer ? (
            <div className="flex flex-col gap-2">
              <DlLink f={bundle} label={`Download for ${os}`} className="min-h-[56px] text-lg" />
              <p className="text-xs text-text-secondary">
                <span className="font-mono">{bundle.file}</span> · {formatSize(bundle.size)} · installer {data.installer.version}
                {data.runtimeVersion ? `, with DisplayXR ${data.runtimeVersion}` : ""}
              </p>
              {os === "Android" && data.installer.androidApp && (
                <p className="text-xs text-text-secondary">
                  For developers and testers: install over USB from a computer. Or put the{" "}
                  <a href={data.installer.androidApp.url} className={link} data-umami-event="download" data-umami-event-file={data.installer.androidApp.file}>
                    DisplayXR installer app
                  </a>{" "}
                  ({formatSize(data.installer.androidApp.size)}) on the tablet. No store listing: Android asks you to allow the install.
                </p>
              )}
            </div>
          ) : (
            <a href={data.installer?.releaseUrl ?? "https://github.com/DisplayXR/displayxr-installer/releases/latest"} className={primaryBtn}>
              See the installer release
            </a>
          )}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-text-primary">What it installs</h3>
            <ul className="grid gap-x-5 gap-y-2.5 sm:grid-cols-2">
              {included.map((i) => (
                <li key={i.name} className="flex items-start gap-2.5 text-sm leading-snug">
                  <Check size={18} aria-hidden className="mt-0.5 flex-none text-success" />
                  <span>
                    <strong className="font-semibold text-text-primary">{i.name}</strong>{" "}
                    <span className="text-text-secondary">{i.gloss}</span>
                  </span>
                </li>
              ))}
            </ul>
            {os === "Windows" && (
              <p className="rounded-lg bg-accent/10 p-3 text-sm leading-relaxed text-text-secondary">
                <strong className="font-semibold text-text-primary">On a Leia SR display</strong> it also adds the Leia SR plug-in and Leia&apos;s own
                2D-to-3D conversion, and downloads the Leia software they need. On any other screen it leaves them out.
              </p>
            )}
            <p className="text-xs leading-relaxed text-text-secondary">
              {RERUN_NOTE[os]}
            </p>
          </div>
        </section>

        <div className="flex flex-[1_1_320px] flex-col gap-5">
          <section aria-labelledby="have-h" className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6">
            <h2 id="have-h" className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Already have DisplayXR?</h2>
            {os === "Windows" ? (
              <>
                <p className="text-sm leading-relaxed text-text-primary">
                  Open the <strong>DisplayXR Dashboard</strong> from the Start menu. Its <strong>Components</strong> page shows what you have and installs,
                  updates and removes everything on this page, add-ons included.
                </p>
                <p className="text-xs text-text-secondary">This page is for a first install, other computers and offline copies.</p>
              </>
            ) : (
              <>
                <p className="text-sm leading-relaxed text-text-primary">
                  Download the installer again: it updates what you have and keeps your settings. Add-ons below install the same way.
                </p>
                <p className="text-xs text-text-secondary">Installing and updating from the Dashboard is Windows only today.</p>
              </>
            )}
          </section>
          {os !== "Android" && data.browser && (
            <section aria-labelledby="browser-h" className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Separate download</p>
              <h2 id="browser-h" className="text-xl font-semibold text-text-primary">DisplayXR Browser</h2>
              <p className="text-sm leading-relaxed text-text-secondary">
                A web browser that shows 3D web pages in 3D. Not in the installer; install DisplayXR first.
                {os === "macOS" ? " For Apple silicon Macs." : ""}
              </p>
              {browser ? (
                <>
                  <DlLink f={browser} label={`Download Browser for ${os}`} primary={false} />
                  <p className="text-xs text-text-secondary">
                    <span className="font-mono">{browser.file}</span> · {formatSize(browser.size)} · version {data.browser.version}
                  </p>
                </>
              ) : (
                <a href={data.browser.releaseUrl} className={link}>
                  Browser releases
                </a>
              )}
            </section>
          )}
        </div>
      </div>

      {/* After you install */}
      <section aria-labelledby="after-h" className="mt-14">
        <h2 id="after-h" className="mb-6 text-2xl font-semibold text-text-primary">After you install</h2>
        <ol className="grid gap-5 md:grid-cols-3">
          {STEPS[os].map((s, i) => (
            <li key={s.title} className="flex items-start gap-4">
              <span aria-hidden className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-accent/15 font-semibold text-accent-hover">
                {i + 1}
              </span>
              <span>
                <strong className="mb-1 block text-text-primary">{s.title}</strong>
                <span className="text-sm leading-relaxed text-text-secondary">{s.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Add-ons */}
      <section id="addons" aria-labelledby="addons-h" className="mt-16 scroll-mt-28">
        <h2 id="addons-h" className="mb-2 text-3xl font-semibold text-text-primary">Add-ons</h2>
        <p className="mb-6 max-w-3xl text-text-secondary">
          Extras that are <strong className="text-text-primary">not</strong> in the installer. Most people don&apos;t need them. Each one says what it&apos;s for,
          what else it needs, and how to add it on {os}.
        </p>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {addons.map((a) => (
            <AddonCard key={a.id} a={a} os={os} data={data} />
          ))}
        </div>
      </section>
    </>
  );
}
