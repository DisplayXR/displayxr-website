import { Table, TableRow, TableCell } from "@/components/ui/Table";
import { components, engines, demos } from "@/lib/data/generated";
import { ExternalLink } from "lucide-react";

// A linked monospace version chip. Falls back to a muted dash when a component
// has no resolvable version.
function VersionPill({ version, href }: { version: string | null; href: string | null }) {
  if (!version) {
    return <span className="text-text-secondary/60">—</span>;
  }
  const pill = (
    <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 font-mono text-xs font-medium text-accent">
      {version}
    </span>
  );
  if (!href) return pill;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 hover:opacity-80"
    >
      {pill}
      <ExternalLink size={12} className="text-text-secondary" />
    </a>
  );
}

export function VersionDashboard() {
  return (
    <div className="space-y-12">
      {/* Runtime & system components — the versions.json bundle matrix */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-text-primary">
          Runtime &amp; system
        </h2>
        <Table headers={["Component", "Version", "Platforms", "Released"]}>
          {components.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium text-text-primary">
                <a
                  href={c.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent"
                >
                  {c.name}
                </a>
              </TableCell>
              <TableCell>
                <VersionPill version={c.version} href={c.releaseUrl} />
              </TableCell>
              <TableCell>{c.platforms}</TableCell>
              <TableCell className="font-mono text-xs">
                {c.releaseDate ?? "—"}
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </section>

      {/* Engine plugins — not in versions.json; tracked via their own releases */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-text-primary">
          Engine plugins
        </h2>
        <Table headers={["Engine", "Version", "Target"]}>
          {engines.map((e) => (
            <TableRow key={e.id}>
              <TableCell className="font-medium text-text-primary">
                <a
                  href={e.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent"
                >
                  {e.name}
                </a>
              </TableCell>
              <TableCell>
                <VersionPill version={e.version} href={e.releaseUrl} />
              </TableCell>
              <TableCell>{e.engineVersion ?? "—"}</TableCell>
            </TableRow>
          ))}
        </Table>
      </section>

      {/* Standalone demos */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-text-primary">Demos</h2>
        <Table headers={["Demo", "Version", "Source"]}>
          {demos.map((d) => (
            <TableRow key={d.id}>
              <TableCell className="font-medium text-text-primary">
                {d.name}
              </TableCell>
              <TableCell>
                <VersionPill version={d.tag} href={d.releaseUrl} />
              </TableCell>
              <TableCell>
                <a
                  href={d.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-hover underline underline-offset-2"
                >
                  {d.repo}
                </a>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </section>
    </div>
  );
}
