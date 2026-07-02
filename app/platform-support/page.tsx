import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { VersionDashboard } from "@/components/status/VersionDashboard";
import {
  runtimeCompositors,
  enginePlugins,
  hardwareBackends,
  appClasses,
} from "@/lib/data/compatibility";
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

        {/* Hardware Backends */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Hardware Backends
          </h2>
          <p className="text-sm text-text-secondary mb-6">
            Display processor integrations for vendor hardware.
          </p>
          <Table headers={["Backend", "Status", "Notes"]}>
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
            Different ways applications can integrate with the DisplayXR runtime.
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
            Install the Windows bundle or build from source on macOS — then run a
            sample in simulation on any monitor, no 3D display required.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button href="/getting-started">Get started →</Button>
            <Button href="/download" variant="secondary">
              Download
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
