// The component model (runtime ADR-054): one trunk nobody forks, plus peer
// component classes that plug in over versioned C ABIs. This file is the one
// source for the /components page, its diagram and its status chips, so the
// picture can never disagree with the cards.
//
// Status is data, never an adjective in prose:
//   shipped      in a tagged runtime release
//   core-merged  ADR accepted and code on main, not yet in a release
//   designed     decision recorded, no code on main
//   planned      on a roadmap or ADR phase, no decision yet
// A class with `shippedIn` flips to "shipped" by itself once the generated
// runtime version reaches that tag, so nobody edits prose on release day.
import { components as releases } from "@/lib/data/generated";
import { REPO_URLS } from "@/lib/constants";

export type ComponentStatus = "shipped" | "core-merged" | "designed" | "planned";

export const STATUS_LABELS: Record<ComponentStatus, string> = {
  shipped: "Shipped",
  "core-merged": "Core merged",
  designed: "Designed",
  planned: "Planned",
};

const ADR = `${REPO_URLS.runtime}/blob/main/docs/adr`;
const SPECS = `${REPO_URLS.runtime}/blob/main/docs/specs/runtime`;
const DRIVERS = `${REPO_URLS.runtime}/tree/main/src/xrt/drivers`;

export interface ComponentImpl {
  name: string;
  role: "reference" | "diagnostic" | "vendor" | "template";
  note: string;
  href?: string;
  /** Short honest qualifier rendered as a chip, e.g. "build-verified". */
  chip?: { label: string; title: string };
}

export interface ComponentClass {
  /** Anchor id on /components. */
  id: string;
  name: string;
  /** Plain-words line for the card. */
  plain: string;
  /** Short "owns" line for the diagram slot. */
  owns: string;
  /** Contract summary; null while the contract is still being written. */
  symbol: string | null;
  abi: number | null;
  reference: string | null;
  /** Status before `shippedIn` is reached (or permanently, without it). */
  baseStatus: ComponentStatus;
  /** Runtime tag that first shipped this class, e.g. "v2.42.0". */
  shippedIn?: string;
  record: { label: string; href: string };
  impls: ComponentImpl[];
}

export const componentClasses: ComponentClass[] = [
  {
    id: "display-processors",
    name: "Display processors",
    plain: "Makes your panel show 3D: weaving, calibration and the panel's own eye tracker.",
    owns: "weave · calibration · the panel's tracker",
    symbol: "xrtPluginNegotiate",
    abi: 5,
    reference: "sim_display",
    baseStatus: "shipped",
    record: { label: "ADR-019", href: `${ADR}/ADR-019-vendor-plugin-aux-boundary.md` },
    impls: [
      {
        name: "sim_display",
        role: "reference",
        note: "No hardware: renders to an ordinary window on Windows, macOS, Linux and Android.",
      },
      {
        name: "Leia SR display processor",
        role: "vendor",
        note: "The first vendor display processor. Windows, Linux and Android.",
        href: REPO_URLS.leiaPlugin,
      },
      {
        name: "Vendor template",
        role: "template",
        note: "Buildable, ABI-correct starter with no vendor SDK.",
        href: REPO_URLS.vendorTemplate,
      },
    ],
  },
  {
    id: "input-providers",
    name: "Input providers",
    plain: "Brings hands, controllers and navigation devices into the standard OpenXR action system.",
    owns: "hands · controllers · navigation",
    symbol: "xrtInputPluginNegotiate",
    abi: 1,
    reference: "sim_input",
    baseStatus: "shipped",
    record: { label: "ADR-034", href: `${ADR}/ADR-034-input-provider-plugins.md` },
    impls: [
      {
        name: "sim_input",
        role: "reference",
        note: "Deterministic, no hardware.",
      },
      {
        name: "net_input",
        role: "diagnostic",
        note: "Loopback TCP with a documented wire protocol: drive the action system from any language.",
        href: `${DRIVERS}/net_input`,
      },
      {
        name: "Ultraleap hand tracking",
        role: "vendor",
        note: "The first third-party input provider. Builds where the Ultraleap SDK is installed.",
        href: `${DRIVERS}/ultraleap`,
        chip: { label: "build-verified", title: "Not yet hardware-tested" },
      },
    ],
  },
  {
    id: "conversion-providers",
    name: "Conversion providers",
    plain: "Turns 2D into 3D: depth, disparity, extra views or Gaussian splats, by task.",
    owns: "depth · views · splats, by task",
    symbol: "xrtConversionPluginNegotiate",
    abi: 1,
    reference: "sim_conversion",
    baseStatus: "core-merged",
    shippedIn: "v2.45.0",
    record: { label: "ADR-053", href: `${ADR}/ADR-053-conversion-providers.md` },
    impls: [
      {
        name: "DisplayXR-SimConversion",
        role: "reference",
        note: "CPU-only and deterministic; exercises every task and readiness state.",
        href: `${DRIVERS}/sim_conversion`,
      },
      {
        name: "Leia conversion provider",
        role: "vendor",
        note: "The display vendor's own 2D-to-3D module, as a separate DLL that the runtime hosts out of process. Windows.",
        href: REPO_URLS.leiaPlugin,
      },
      {
        name: "Open-model provider",
        role: "reference",
        note: "Depth models on ONNX Runtime (DirectML on Windows, CPU elsewhere), so every box has a converter without a vendor module. Models come from the runtime's model store.",
        href: REPO_URLS.conversionOpen,
        chip: { label: "build-verified", title: "First release; the installer is unsigned" },
      },
      {
        name: "Conversion template",
        role: "template",
        note: "Vendor-neutral starter kit: a CPU-only provider skeleton, a fake host and dev registration scripts.",
        href: REPO_URLS.conversionTemplate,
      },
    ],
  },
  {
    id: "viewer-tracking",
    name: "Viewer-tracking providers",
    plain: "Look-around from a webcam or any tracker, for displays without their own eye tracker.",
    owns: "viewer eyes from a webcam or tracker",
    symbol: null,
    abi: null,
    reference: null,
    baseStatus: "designed",
    record: { label: "ADR-054", href: `${ADR}/ADR-054-component-model.md` },
    impls: [],
  },
];

function semver(v: string): number[] {
  return v.replace(/^v/, "").split(".").map((n) => parseInt(n, 10) || 0);
}

function atLeast(have: string, want: string): boolean {
  const a = semver(have);
  const b = semver(want);
  for (let i = 0; i < 3; i++) {
    if ((a[i] ?? 0) !== (b[i] ?? 0)) return (a[i] ?? 0) > (b[i] ?? 0);
  }
  return true;
}

const runtimeVersion = releases.find((c) => c.id === "runtime")?.version ?? null;

export function statusOf(c: ComponentClass): ComponentStatus {
  if (c.shippedIn && runtimeVersion && atLeast(runtimeVersion, c.shippedIn)) {
    return "shipped";
  }
  return c.baseStatus;
}

/** "Shipped in v2.42.0" style detail for the chip's title. */
export function statusDetail(c: ComponentClass): string {
  const s = statusOf(c);
  if (s === "shipped" && c.shippedIn) return `In every runtime release since ${c.shippedIn}`;
  if (s === "shipped") return "In tagged runtime releases";
  if (s === "core-merged") return "Code on main; ships in the next runtime release";
  if (s === "designed") return "Decision recorded; no code on main yet";
  return "On the roadmap";
}

export const COMPONENT_SPECS = {
  displayProcessors: `${SPECS}/plugin-discovery.md`,
  inputProviders: `${SPECS}/input-provider-discovery.md`,
  conversionProviders: `${SPECS}/conversion-provider-discovery.md`,
};
