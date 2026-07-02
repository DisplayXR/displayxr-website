import type { Status } from "./compatibility";

// Devices are grouped by OEM (the company that ships the product), not by the
// display-technology vendor. The underlying spatial-display tech is surfaced as
// a per-device attribute — one column among many — because DisplayXR is
// vendor-neutral: an OEM's product is the unit a developer or buyer recognizes,
// and the display tech behind it is an implementation detail served through a
// plug-in.
export interface OEM {
  id: string;
  name: string;
  description: string;
}

export interface Device {
  name: string;
  formFactor: "laptop" | "tablet" | "monitor" | "desktop" | "handheld";
  status: Status;
  oemId: string;
  /** Spatial-display technology behind the panel, shown as an attribute. */
  displayTech: string;
  url?: string;
}

export const oems: OEM[] = [
  {
    id: "samsung",
    name: "Samsung",
    description: "Spatial-display gaming monitors",
  },
  {
    id: "acer",
    name: "Acer",
    description: "SpatialLabs laptops and monitors",
  },
  {
    id: "zte",
    name: "ZTE",
    description: "Nubia and Red Magic Android 3D devices",
  },
  {
    id: "barco",
    name: "Barco",
    description: "Medical-grade 3D displays",
  },
  {
    id: "simulation",
    name: "Simulation",
    description: "No hardware required — any standard monitor",
  },
];

export const devices: Device[] = [
  // Samsung
  {
    name: "Samsung Odyssey 3D",
    oemId: "samsung",
    formFactor: "monitor",
    status: "shipping",
    displayTech: "Leia SR",
    url: "https://www.samsung.com/us/monitors/gaming/27-inch-odyssey-3d-g90xf-4k-165hz-gaming-monitor-sku-ls27fg900xnxza/",
  },

  // Acer
  {
    name: "Acer Aspire 3D 15 SpatialLabs Edition",
    oemId: "acer",
    formFactor: "laptop",
    status: "shipping",
    displayTech: "Leia SR",
    url: "https://www.acer.com/us-en/laptops/aspire/aspire-3d-15-spatiallabs-edition",
  },
  {
    name: "Acer SpatialLabs View",
    oemId: "acer",
    formFactor: "monitor",
    status: "shipping",
    displayTech: "Leia SR",
    url: "https://store.acer.com/en-us/15-6-acer-spatiallabs-view-monitor-asv15-1b",
  },
  {
    name: "Acer SpatialLabs View Pro",
    oemId: "acer",
    formFactor: "monitor",
    status: "shipping",
    displayTech: "Leia SR",
    url: "https://www.acer.com/us-en/monitors/spatiallabs/acer-spatiallabs-view-pro",
  },
  {
    name: "Acer Predator Helios 300 SpatialLabs Edition",
    oemId: "acer",
    formFactor: "laptop",
    status: "shipping",
    displayTech: "Leia SR",
    url: "https://www.acer.com/us-en/predator/laptops/helios/predator-helios-300-spatiallabs-edition",
  },
  {
    name: "Acer ConceptD 7 SpatialLabs Edition",
    oemId: "acer",
    formFactor: "laptop",
    status: "shipping",
    displayTech: "Leia SR",
    url: "https://www.acer.com/us-en/conceptd/laptops/conceptd-7-spatiallabs-edition",
  },

  // ZTE (Android 3D — DisplayXR runs natively on Android)
  {
    name: "Nubia Pad 2",
    oemId: "zte",
    formFactor: "tablet",
    status: "shipping",
    displayTech: "Leia SR",
    url: "https://www.nubia.com/",
  },
  {
    name: "Red Magic Explorer 3D",
    oemId: "zte",
    formFactor: "handheld",
    status: "shipping",
    displayTech: "Leia SR",
    url: "https://www.redmagic.gg/",
  },

  // Barco
  {
    name: "Barco Eonis 3D",
    oemId: "barco",
    formFactor: "monitor",
    status: "shipping",
    displayTech: "Leia SR",
    url: "https://www.barco.com/en/product/eonis-3d-mdrc-8127",
  },

  // Simulation
  {
    name: "Any standard monitor",
    oemId: "simulation",
    formFactor: "desktop",
    status: "shipping",
    displayTech: "sim_display",
  },
];
