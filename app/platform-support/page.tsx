import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { VersionDashboard } from "@/components/status/VersionDashboard";
import {
  VerificationChip,
  VERIFICATION_DEFINITIONS,
} from "@/components/ui/VerificationChip";
import {
  runtimeCompositors,
  enginePlugins,
  hardwareBackends,
  appClasses,
  desktopApps,
  APP_DISCUSSIONS_URL,
  APP_INTEGRATIONS_INDEX,
  type AppIntegration,
  type AppVerification,
} from "@/lib/data/compatibility";

const INTEGRATION_LABELS: Record<AppIntegration, string> = {
  "own-viewport": "In its own viewport",
  "dedicated-window": "Dedicated 3D window",
  "browser-page": "DisplayXR Browser page",
};

const VERIFICATION_ORDER: AppVerification[] = [
  "seated-verified",
  "sim-verified",
  "proposed",
];

const link = "text-accent hover:text-accent-hover underline underline-offset-2";
import { oems, devices } from "@/lib/data/devices";

export const metadata: Metadata = {
  title: "Platform Support",
  description:
    "Released versions of every DisplayXR component, plus the platform, graphics-API, engine, and hardware support matrix.",
};

export default function PlatformSupportPage() {
  return (
    <PageLayout
      title="Platform Support"
      description="What's released, and what's supported — the latest version of every component, then the platform, graphics-API, engine, and hardware matrix."
      art="/art/dxr-platform-panels.webp"
    >
      <div className="space-y-16 max-w-4xl">
        {/* Released versions (generated, auto-synced from the org) */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Released versions
          </h2>
          <p className="text-sm text-text-secondary mb-6">
            The latest released version of every DisplayXR component — each
            links to its GitHub release.
          </p>
          <VersionDashboard />
        </section>

        {/* Compatible Devices */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Compatible Devices
          </h2>
          <p className="text-sm text-text-secondary mb-6">
            Spatial displays supported by DisplayXR, grouped by OEM. The
            underlying display technology is shown per device — DisplayXR is
            vendor-neutral, and each panel is served through a plug-in.
          </p>
          <div className="space-y-6">
            {oems.map((oem) => {
              const oemDevices = devices.filter((d) => d.oemId === oem.id);
              if (oemDevices.length === 0) return null;
              return (
                <div
                  key={oem.id}
                  className="bg-surface border border-border rounded-lg overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-border">
                    <h3 className="text-base font-semibold text-text-primary">
                      {oem.name}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {oem.description}
                    </p>
                  </div>
                  <Table
                    headers={[
                      "Device",
                      "Form Factor",
                      "Display Tech",
                      "Status",
                    ]}
                  >
                    {oemDevices.map((device) => (
                      <TableRow key={device.name}>
                        <TableCell className="font-medium text-text-primary">
                          {device.url ? (
                            <a
                              href={device.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent hover:text-accent-hover underline underline-offset-2"
                            >
                              {device.name}
                            </a>
                          ) : (
                            device.name
                          )}
                        </TableCell>
                        <TableCell className="capitalize">
                          {device.formFactor}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {device.displayTech}
                        </TableCell>
                        <TableCell>
                          <Badge status={device.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </Table>
                </div>
              );
            })}
          </div>
        </section>

        {/* Runtime Compositors */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Runtime — Native Compositors
          </h2>
          <p className="text-sm text-text-secondary mb-6">
            Each graphics API has its own dedicated compositor implementation.
          </p>
          <Table headers={["Platform", "Graphics API", "Status", "Notes"]}>
            {runtimeCompositors.map((row) => (
              <TableRow key={`${row.platform}-${row.graphicsApi}`}>
                <TableCell className="font-medium text-text-primary">
                  {row.platform}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {row.graphicsApi}
                </TableCell>
                <TableCell>
                  <Badge status={row.status} />
                </TableCell>
                <TableCell>{row.notes}</TableCell>
              </TableRow>
            ))}
          </Table>
        </section>

        {/* Engine Plugins */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Engine Plugins
          </h2>
          <p className="text-sm text-text-secondary mb-6">
            Standard engine integrations for Unity and Unreal.
          </p>
          <Table headers={["Engine", "Status", "Notes"]}>
            {enginePlugins.map((row) => (
              <TableRow key={row.engine}>
                <TableCell className="font-medium text-text-primary">
                  {row.engine}
                </TableCell>
                <TableCell>
                  <Badge status={row.status} />
                </TableCell>
                <TableCell>{row.notes}</TableCell>
              </TableRow>
            ))}
          </Table>
        </section>

        {/* Desktop apps */}
        <section id="desktop-apps" className="scroll-mt-24">
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Desktop Apps
          </h2>
          <p className="text-sm text-text-secondary mb-6 max-w-2xl leading-relaxed">
            Since runtime v2.55.0 an app can show 3D inside its own viewport,
            with no window over it: it hands the runtime a texture through{" "}
            <a href="/extensions#XR_DXR_win32_window_binding" className={link}>
              <span className="font-mono">XR_DXR_win32_window_binding</span>
            </a>{" "}
            and its menus, gizmos and input stay its own. These integrations are
            in development and none is released yet; each row links its public
            proposal.
          </p>
          {/* Phone: a stacked list, so the status and proposal stay in view */}
          <ul className="sm:hidden divide-y divide-border rounded-lg border border-border">
            {desktopApps.map((row) => (
              <li key={row.app} className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-medium text-text-primary">
                    {row.app}
                    {row.version && (
                      <span className="ml-2 whitespace-nowrap text-xs font-normal text-text-secondary">
                        {row.version}
                      </span>
                    )}
                  </span>
                  <VerificationChip status={row.verification} />
                </div>
                <div className="mt-1 text-sm text-text-secondary">
                  {INTEGRATION_LABELS[row.integration]} ·{" "}
                  <a
                    href={`${APP_DISCUSSIONS_URL}/${row.proposal}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={link}
                  >
                    #{row.proposal}
                  </a>
                </div>
              </li>
            ))}
          </ul>
          <div className="hidden sm:block">
            <Table headers={["App", "Integration", "Status", "Proposal"]}>
              {desktopApps.map((row) => (
                <TableRow key={row.app}>
                  <TableCell className="font-medium text-text-primary">
                    {row.app}
                    {row.version && (
                      <span className="ml-2 whitespace-nowrap text-xs font-normal text-text-secondary">
                        {row.version}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{INTEGRATION_LABELS[row.integration]}</TableCell>
                  <TableCell>
                    <VerificationChip status={row.verification} />
                  </TableCell>
                  <TableCell>
                    <a
                      href={`${APP_DISCUSSIONS_URL}/${row.proposal}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={link}
                    >
                      #{row.proposal}
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </div>
          <dl className="mt-4 grid gap-2 text-sm text-text-secondary sm:grid-cols-[auto_1fr] sm:gap-x-4">
            {VERIFICATION_ORDER.map((s) => (
              <div key={s} className="contents">
                <dt className="sm:pt-0.5">
                  <VerificationChip status={s} />
                </dt>
                <dd className="mb-2 sm:mb-0 sm:self-center">
                  {VERIFICATION_DEFINITIONS[s]}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-text-secondary leading-relaxed">
            What all of them need from the shared host library is mapped in{" "}
            <a
              href={`${APP_DISCUSSIONS_URL}/${APP_INTEGRATIONS_INDEX}`}
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              discussion #{APP_INTEGRATIONS_INDEX}
            </a>
            .
          </p>
          <p className="mt-2 text-xs text-text-secondary">
            Product names are trademarks of their respective owners; no
            endorsement is implied.
          </p>
        </section>

        {/* Display processors */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Display Processors
          </h2>
          <p className="text-sm text-text-secondary mb-6">
            The component that makes each panel show 3D. Input and conversion
            providers are listed on{" "}
            <a
              href="/components"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              Components
            </a>
            .
          </p>
          <Table headers={["Display processor", "Status", "Notes"]}>
            {hardwareBackends.map((row) => (
              <TableRow key={row.backend}>
                <TableCell className="font-medium text-text-primary">
                  {row.backend}
                </TableCell>
                <TableCell>
                  <Badge status={row.status} />
                </TableCell>
                <TableCell>{row.notes}</TableCell>
              </TableRow>
            ))}
          </Table>
        </section>

        {/* App Classes */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Application Classes
          </h2>
          <p className="text-sm text-text-secondary mb-6">
            Different ways applications can integrate with the DisplayXR
            runtime.
          </p>
          <Table headers={["Class", "Description", "Status"]}>
            {appClasses.map((row) => (
              <TableRow key={row.className}>
                <TableCell className="font-mono font-medium text-text-primary">
                  {row.className}
                </TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>
                  <Badge status={row.status} />
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </section>

        {/* Get started CTA */}
        <div className="rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-1">
            Ready to try it on your platform?
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Install the Windows bundle or build from source on macOS — then run
            a sample in simulation on any monitor, no spatial display required.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button href="/developers">Get started →</Button>
            <Button href="/download" variant="secondary">
              Download
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
