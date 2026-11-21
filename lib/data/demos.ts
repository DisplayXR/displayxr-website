// Authored overlay for the demo apps, merged by id onto the generated demo
// data (lib/data/generated/demos.json). The generator owns name, description,
// icon and version; status and tags stay authored here. A missing entry falls
// back to sensible defaults so a new demo still renders. Read by /demos and by
// the Catalog (lib/data/catalog.ts), which takes each demo's platforms from
// its tags.
import type { Status } from "./compatibility";

export const demoEditorial: Record<string, { status: Status; tags: string[] }> = {
  modelviewer: { status: "active", tags: ["Windows", "macOS", "Linux", "Android", "Vulkan"] },
  mediaplayer: { status: "active", tags: ["Windows", "macOS", "Linux", "Android", "Vulkan"] },
  gaussiansplat: { status: "shipping", tags: ["Windows", "macOS", "Linux", "Android", "Vulkan"] },
  avatar: { status: "active", tags: ["Windows", "macOS", "Linux", "Android", "Vulkan"] },
  earthview: { status: "beta", tags: ["Windows", "macOS", "Linux", "Android", "Vulkan"] },
};
