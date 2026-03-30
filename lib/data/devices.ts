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
  },
  {
    name: "Acer Aspire 3D 15",
    oem: "Acer",
    formFactor: "laptop",
    status: "shipping",
    vendorId: "leia",
  },
  {
    name: "Acer SpatialLabs View",
    oem: "Acer",
    formFactor: "monitor",
    status: "shipping",
    vendorId: "leia",
  },
  {
    name: "Acer SpatialLabs View Pro",
    oem: "Acer",
    formFactor: "monitor",
    status: "shipping",
    vendorId: "leia",
  },
  {
    name: "Acer Predator Helios 300 SpatialLabs",
    oem: "Acer",
    formFactor: "laptop",
    status: "shipping",
    vendorId: "leia",
  },
  {
    name: "Acer ConceptD SpatialLabs",
    oem: "Acer",
    formFactor: "laptop",
    status: "shipping",
    vendorId: "leia",
  },
  {
    name: "Barco Eonis 3D",
    oem: "Barco",
    formFactor: "monitor",
    status: "shipping",
    vendorId: "leia",
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
