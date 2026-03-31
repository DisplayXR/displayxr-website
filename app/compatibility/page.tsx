import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/Badge";
import { Table, TableRow, TableCell } from "@/components/ui/Table";
import {
  runtimeCompositors,
  enginePlugins,
  hardwareBackends,
  appClasses,
} from "@/lib/data/compatibility";
import { vendors, devices } from "@/lib/data/devices";

export const metadata: Metadata = {
  title: "Compatibility",
  description:
    "Current platform, graphics API, engine, and hardware support status for DisplayXR.",
};

export default function CompatibilityPage() {
  return (
    <PageLayout
      title="Compatibility"
      description="Current support status across platforms, graphics APIs, engines, and hardware backends."
    >
      <div className="space-y-16 max-w-4xl">
        {/* Compatible Devices */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Compatible Devices
          </h2>
          <p className="text-sm text-text-secondary mb-6">
            Devices with spatial displays supported by
            DisplayXR, grouped by display technology vendor.
          </p>
          <div className="space-y-6">
            {vendors.map((vendor) => {
              const vendorDevices = devices.filter(
                (d) => d.vendorId === vendor.id
              );
              if (vendorDevices.length === 0) return null;
              return (
                <div
                  key={vendor.id}
                  className="bg-surface border border-border rounded-lg overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-border">
                    <h3 className="text-base font-semibold text-text-primary">
                      {vendor.name}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {vendor.description}
                    </p>
                  </div>
                  <Table
                    headers={["Device", "OEM", "Form Factor", "Status"]}
                  >
                    {vendorDevices.map((device) => (
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
                        <TableCell>{device.oem}</TableCell>
                        <TableCell className="capitalize">
                          {device.formFactor}
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
      </div>
    </PageLayout>
  );
}
