"use client";

import { useEffect, useState } from "react";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { NATIVE_DOCS, NATIVE_PLATFORMS, type NativePlatform } from "@/lib/data/native";
import { useVisitorOS } from "@/lib/visitor-os";

const link = "text-accent hover:text-accent-hover underline underline-offset-2";

const Mono = ({ children }: { children: React.ReactNode }) => (
  <code className="rounded bg-background px-1.5 py-0.5 font-mono text-xs text-accent break-all">
    {children}
  </code>
);

function Steps({ p }: { p: NativePlatform }) {
  return (
    <ol className="space-y-8">
      <li>
        <h3 className="mb-2 font-semibold text-text-primary">1. Install DisplayXR</h3>
        <p className="text-sm leading-relaxed text-text-secondary">
          The runtime and the sim-display plug-in, from{" "}
          <a href="/download" className={link}>Download</a>.
        </p>
      </li>
      <li>
        <h3 className="mb-2 font-semibold text-text-primary">2. Start from the reference app</h3>
        <p className="mb-3 text-sm leading-relaxed text-text-secondary">
          <Mono>{p.referenceApp}</Mono> in displayxr-runtime is a small, correct
          {" "}{p.api} app: copy it and adapt it.
          {p.scaffolder && (
            <>
              {" "}In Claude Code, the runtime repo&apos;s{" "}
              <a href={NATIVE_DOCS.scaffolder} target="_blank" rel="noopener noreferrer" className={link}>
                <Mono>/new-displayxr-app</Mono>
              </a>{" "}
              skill does this for you: it clones the nearest reference app, adds
              the manifest and CMake wiring, and runs the linter until it is clean.
            </>
          )}
        </p>
        <CodeSnippet code={p.build} label={`${p.os}: build and run from source`} />
        <p className="mt-2 text-xs text-text-secondary">
          Prerequisites:{" "}
          <a href={p.id === "android" ? NATIVE_DOCS.androidBuild : NATIVE_DOCS.building} target="_blank" rel="noopener noreferrer" className={link}>
            {p.id === "android" ? "Android build guide" : "build guide"}
          </a>
          .
        </p>
      </li>
      <li>
        <h3 className="mb-2 font-semibold text-text-primary">3. Run it on sim-display</h3>
        <p className="text-sm leading-relaxed text-text-secondary">
          {p.sim} sim-display is a simulated spatial display in an ordinary
          window{p.id === "android" ? "" : "; WASD and the mouse move the virtual eye"}. To use it on a machine that has a vendor plug-in,{" "}
          <Mono>displayxr-cli dp use sim-display</Mono> (undo with{" "}
          <Mono>dp reset</Mono>).
        </p>
      </li>
      <li>
        <h3 className="mb-2 font-semibold text-text-primary">4. Lint it</h3>
        <p className="mb-3 text-sm leading-relaxed text-text-secondary">
          The{" "}
          <a href={NATIVE_DOCS.linter} target="_blank" rel="noopener noreferrer" className={link}>
            app linter
          </a>{" "}
          checks your source against the{" "}
          <a href={NATIVE_DOCS.appRules} target="_blank" rel="noopener noreferrer" className={link}>
            authoring rules
          </a>
          {p.id === "android" ? ", including the Android ones" : ""}. Python 3,
          no dependencies.
        </p>
        <CodeSnippet code="python3 scripts/check_displayxr_app.py <app-dir>" label="from displayxr-runtime" />
      </li>
      <li>
        <h3 className="mb-2 font-semibold text-text-primary">5. Ship</h3>
        <p className="text-sm leading-relaxed text-text-secondary">
          Put a <Mono>.displayxr.json</Mono> manifest and an icon next to your
          binary so launchers and workspace controllers can list it.{" "}
          <a href={NATIVE_DOCS.shipManifest} target="_blank" rel="noopener noreferrer" className={link}>
            Ship a manifest
          </a>
          .
        </p>
      </li>
    </ol>
  );
}

/**
 * Per-platform tabs. Every panel is server-rendered (inactive ones `hidden`),
 * so the steps are in the HTML for search and no-JS readers; the visitor's OS,
 * once detected, picks the default tab, and #windows / #macos / #linux /
 * #android deep-link to one.
 */
export function NativeQuickstart() {
  const os = useVisitorOS();
  const [picked, setPicked] = useState<NativePlatform["id"] | null>(null);

  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      if (NATIVE_PLATFORMS.some((p) => p.id === h)) setPicked(h as NativePlatform["id"]);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const detected = NATIVE_PLATFORMS.find((p) => p.os === os)?.id;
  const active = picked ?? detected ?? "windows";

  return (
    <div>
      <div role="tablist" aria-label="Platform" className="mb-8 flex flex-wrap gap-2">
        {NATIVE_PLATFORMS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            id={`tab-${p.id}`}
            aria-selected={active === p.id}
            aria-controls={`panel-${p.id}`}
            onClick={() => {
              setPicked(p.id);
              history.replaceState(null, "", `#${p.id}`);
            }}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              active === p.id
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            {p.os}
          </button>
        ))}
      </div>
      {NATIVE_PLATFORMS.map((p) => (
        <div
          key={p.id}
          role="tabpanel"
          id={`panel-${p.id}`}
          aria-labelledby={`tab-${p.id}`}
          hidden={active !== p.id}
        >
          <Steps p={p} />
        </div>
      ))}
    </div>
  );
}
