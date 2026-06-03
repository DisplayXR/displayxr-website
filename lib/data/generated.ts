// Typed accessors over the machine-written lib/data/generated/*.json files.
// These JSON files are produced by scripts/sync-org.mjs from the DisplayXR org
// and must never be hand-edited. Authored TSX merges editorial fields by `id`.
// See docs/org-sync.md.
import componentsJson from "./generated/components.json";
import demosJson from "./generated/demos.json";
import enginesJson from "./generated/engines.json";
import extensionsJson from "./generated/extensions.json";

export interface ComponentRelease {
  id: string;
  name: string;
  version: string | null;
  releaseUrl: string;
  releaseDate: string | null;
  platforms: string;
  repoUrl: string;
}

export interface DemoEntry {
  id: string;
  repo: string;
  name: string;
  description: string;
  category: string;
  type: string | null;
  icon: string | null;
  repoUrl: string;
  releaseUrl: string | null;
  tag: string | null;
}

export interface EngineEntry {
  id: string;
  name: string;
  version: string | null;
  engineVersion: string | null;
  description: string;
  repoUrl: string;
  testRepoUrl: string;
  releaseUrl: string | null;
  logo: string | null;
}

export interface ExtensionEntry {
  name: string;
  group: "display" | "windowing" | "workspace";
}

export const components = componentsJson as ComponentRelease[];
export const demos = demosJson as DemoEntry[];
export const engines = enginesJson as EngineEntry[];
export const extensionsGenerated = extensionsJson as ExtensionEntry[];
