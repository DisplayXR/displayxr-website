import type { Status } from "./compatibility";

export interface DisplayVendor {
  id: string;
  name: string;
  description: string;
}

export interface Device {
  name: string;
  oem: string;
  formFactor: "laptop" | "tablet" | "monitor" | "desktop";
  status: Status;
  vendorId: string;
  url?: string;
}

export const vendors: DisplayVendor[] = [
  {
    id: "leia",
    name: "Leia Inc.",
    description: "Glasses-free 3D display technology",
  },
  {
    id: "sim_display",
    name: "sim_display",
    description: "Simulation backend — no hardware required",
  },
];

export const devices: Device[] = [
  // Leia-based devices
  {
    name: "Samsung Odyssey 3D",
    oem: "Samsung",
    formFactor: "monitor",
    status: "shipping",
    vendorId: "leia",
    url: "https://www.samsung.com/us/monitors/gaming/27-inch-odyssey-3d-g90xf-4k-165hz-gaming-monitor-sku-ls27fg900xnxza/",
  },
  {
    name: "Acer Aspire 3D 15 SpatialLabs Edition",
    oem: "Acer",
    formFactor: "laptop",
    status: "shipping",
    vendorId: "leia",
    url: "https://www.acer.com/us-en/laptops/aspire/aspire-3d-15-spatiallabs-edition",
  },
  {
    name: "Acer SpatialLabs View",
    oem: "Acer",
    formFactor: "monitor",
    status: "shipping",
    vendorId: "leia",
    url: "https://store.acer.com/en-us/15-6-acer-spatiallabs-view-monitor-asv15-1b",
  },
  {
    name: "Acer SpatialLabs View Pro",
    oem: "Acer",
    formFactor: "monitor",
    status: "shipping",
    vendorId: "leia",
    url: "https://www.acer.com/us-en/monitors/spatiallabs/acer-spatiallabs-view-pro",
  },
  {
    name: "Acer Predator Helios 300 SpatialLabs Edition",
    oem: "Acer",
    formFactor: "laptop",
    status: "shipping",
    vendorId: "leia",
    url: "https://www.acer.com/us-en/predator/laptops/helios/predator-helios-300-spatiallabs-edition",
  },
  {
    name: "Acer ConceptD 7 SpatialLabs Edition",
    oem: "Acer",
    formFactor: "laptop",
    status: "shipping",
    vendorId: "leia",
    url: "https://www.acer.com/us-en/conceptd/laptops/conceptd-7-spatiallabs-edition",
  },
  {
    name: "Barco Eonis 3D",
    oem: "Barco",
    formFactor: "monitor",
    status: "shipping",
    vendorId: "leia",
    url: "https://www.barco.com/en/product/eonis-3d-mdrc-8127",
  },

  // Simulation
  {
    name: "Any standard monitor",
    oem: "Any",
    formFactor: "desktop",
    status: "shipping",
    vendorId: "sim_display",
  },
];
