import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { GetDisplayXR } from "@/components/download/GetDisplayXR";
import { downloads, engines, type Platform } from "@/lib/data/generated";
import { OSES, PART_NAMES, TROUBLESHOOTING_URL, formatSize } from "@/lib/data/get";
import { REPO_URLS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Get DisplayXR",
  description:
    "Download DisplayXR for Windows, macOS, Linux and Android tablets: one installer with everything most people need, add-ons, and every part on its own.",
};

const link = "text-accent-hover underline underline-offset-2 hover:text-text-primary";
const EXT = (f: string) => (f.match(/\.(tar\.gz|[a-z]+)$/i)?.[0] ?? "").toLowerCase();

export default function DownloadPage() {
  const unity = engines.find((e) => e.id === "unity");
  const unreal = engines.find((e) => e.id === "unreal");
  const devkits = [
    { name: "Unity plug-in", desc: unity?.version ? `Version ${unity.version.replace(/^v/, "")}` : "UPM package", href: `${REPO_URLS.unity}/releases` },
    { name: "Unreal plug-in", desc: unreal?.version ? `Version ${unreal.version.replace(/^v/, "")}` : "Unreal Engine plug-in", href: `${REPO_URLS.unreal}/releases` },
    { name: "Unity samples", desc: "Built sample apps", href: `${REPO_URLS.unitySamples}/releases` },
    { name: "Input plug-in kit", desc: "Build support for a stylus or controller", href: REPO_URLS.inputTemplate },
  ];

  return (
    <PageLayout
      title="Get DisplayXR"
      description="Free software that runs 3D apps on spatial displays. One installer sets up everything most people need. No spatial display yet? It still runs, in a simulated mode."
    >
      <GetDisplayXR data={downloads} />

      {/* Individual installers */}
      <section id="individual" className="mt-16 scroll-mt-28">
        <details className="group rounded-xl border border-border bg-surface px-6">
          <summary className="flex min-h-[64px] cursor-pointer items-center text-xl font-semibold text-text-primary">
            Individual installers (advanced, offline, IT)
          </summary>
          <div className="flex flex-col gap-3 pb-6">
            <p className="text-sm text-text-secondary">
              The parts the installer already includes, one by one, for every system. You don&apos;t need these if you used the installer above.
            </p>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[760px] border-collapse text-sm">
                <thead>
                  <tr className="bg-background text-left text-text-secondary">
                    <th scope="col" className="px-4 py-2.5 font-medium">Part</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Version</th>
                    {OSES.map((o) => (
                      <th key={o.id} scope="col" className="px-4 py-2.5 font-medium">{o.id}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {downloads.parts.map((p) => (
                    <tr key={p.id} className="border-t border-border">
                      <th scope="row" className="px-4 py-2.5 text-left font-semibold text-text-primary">
                        <a href={p.releaseUrl} className="hover:text-accent-hover">{PART_NAMES[p.id] ?? p.id}</a>
                      </th>
                      <td className="px-4 py-2.5 font-mono text-text-secondary">{p.version}</td>
                      {OSES.map(({ id }) => {
                        const f = p.files[id as Platform];
                        return (
                          <td key={id} className="px-4 py-2.5">
                            {f ? (
                              <>
                                <a href={f.url} aria-label={`${PART_NAMES[p.id] ?? p.id} for ${id}, ${formatSize(f.size)}`} className={link} data-umami-event="download" data-umami-event-file={f.file}>
                                  {EXT(f.file)}
                                </a>{" "}
                                <span className="text-xs text-text-secondary">{formatSize(f.size)}</span>
                              </>
                            ) : (
                              <span className="text-text-secondary" aria-label="none">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-text-secondary">
              Linux packages are for Ubuntu 22.04, 24.04 and 26.04:{" "}
              <code className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-xs">sudo apt install ./&lt;file&gt;.deb</code>
            </p>
          </div>
        </details>
      </section>

      {/* Building apps? */}
      <section id="developers" aria-labelledby="dev-h" className="mt-10 rounded-2xl border border-border bg-surface p-6 md:p-8">
        <h2 id="dev-h" className="mb-1 text-2xl font-semibold text-text-primary">Building apps?</h2>
        <p className="mb-5 text-sm text-text-secondary">
          Engine plug-ins and kits. Install DisplayXR above first; the{" "}
          <a href="/developers" className={link}>developer page</a> has the guides.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {devkits.map((d) => (
            <a key={d.name} href={d.href} className="flex min-h-[44px] flex-col gap-1 rounded-xl border border-border p-4 transition-colors hover:border-accent">
              <strong className="text-text-primary">{d.name}</strong>
              <span className="text-xs text-text-secondary">{d.desc}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Footer facts */}
      <section className="mt-10 grid gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-6">
          <h3 className="mb-2 font-semibold text-text-primary">Check a download</h3>
          <p className="text-sm leading-relaxed text-text-secondary">
            Each release lists SHA-256 checksums
            {downloads.installer?.checksumsUrl ? (
              <>
                {" "}(<a href={downloads.installer.checksumsUrl} className={link}>installer checksums</a>)
              </>
            ) : null}
            .{downloads.windowsSigner ? ` Windows installers are signed by ${downloads.windowsSigner}, the company behind DisplayXR.` : ""}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6">
          <h3 className="mb-2 font-semibold text-text-primary">Older versions and release notes</h3>
          <p className="text-sm leading-relaxed text-text-secondary">
            <a href={`${REPO_URLS.installer}/releases`} className={link}>Installer releases</a> ·{" "}
            <a href={`${REPO_URLS.runtime}/releases`} className={link}>DisplayXR releases</a>
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6">
          <h3 className="mb-2 font-semibold text-text-primary">Something not working?</h3>
          <p className="text-sm leading-relaxed text-text-secondary">
            On Windows, the Dashboard&apos;s Troubleshooting page checks your setup.{" "}
            <a href={TROUBLESHOOTING_URL} className={link}>Troubleshooting guide</a>
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
