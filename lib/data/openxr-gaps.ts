// "Where vanilla OpenXR stops": the four ways a spatial display differs from a
// headset, and what DisplayXR adds to OpenXR for each. Authored, shared by the
// homepage "why it exists" section and /about, so both tell one story. The
// /extensions rewrite (P2) carries the same framing per extension.
//
// Framing rule (David, 2026-10-04): DisplayXR EXTENDS OpenXR toward displays.
// Never "replaces", "alternative to" or "instead of OpenXR". The headset
// column describes what core OpenXR was designed for, not a shortcoming.

export type OpenXRGap = {
  id: "where" | "windows" | "zones" | "desktop";
  title: string;
  /** What core OpenXR assumes, because it was written for headsets. */
  headset: string;
  /** What is different about a display on a desk. */
  display: string;
  /** What the extension adds to OpenXR. */
  adds: string;
  extensions: string[];
  image: { src: string; alt: string };
};

export const OPENXR_GAPS: OpenXRGap[] = [
  {
    id: "where",
    title: "Where the display is",
    headset: "A headset moves with your head, so OpenXR hands the app a symmetric field of view.",
    display: "A display has a physical size and stays put, and both eyes look at the same rectangle from different places.",
    adds: "The panel's size and position in metres, the tracked eye positions and the rendering modes, so each eye gets the right off-axis view. A 10 cm cube renders 10 cm.",
    extensions: ["XR_DXR_display_info", "XR_DXR_view_rig"],
    image: {
      src: "/diagrams/dxr-kooima-frustum.svg",
      alt: "Each eye's view converges on the physical display rectangle, an off-axis frustum per eye.",
    },
  },
  {
    id: "windows",
    title: "Many windows, not one screen",
    headset: "A headset session is exclusive: it owns the whole display, because on a headset that is the whole world.",
    display: "On a desk, several 3D apps share the screen in ordinary windows you drag, resize and overlap.",
    adds: "Window binding: the app hands the runtime its own window, and each window keeps its 3D while it moves.",
    extensions: [
      "XR_DXR_win32_window_binding",
      "XR_DXR_cocoa_window_binding",
      "XR_DXR_wayland_surface_binding",
      "XR_DXR_android_surface_binding",
    ],
    image: {
      src: "/art/gaps/many-windows.webp",
      alt: "Three 3D apps in three ordinary windows on one desktop monitor.",
    },
  },
  {
    id: "zones",
    title: "2D and 3D in the same window",
    headset: "Core OpenXR's layers (projection, quad, cube, cylinder) describe a world, not a 3D region inside a 2D window.",
    display: "Most of a screen is text and menus. The 3D is one region inside the window, with the flat page around it.",
    adds: "2D/3D zones: 3D inside, a flat page around it. This is the same capability a 3D object inside a web page uses.",
    extensions: ["XR_DXR_display_zones", "XR_DXR_local_3d_zone", "XR_DXR_weave"],
    image: {
      src: "/art/gaps/zones.webp",
      alt: "A laptop showing a web page whose product image is in 3D while the page around it stays flat.",
    },
  },
  {
    id: "desktop",
    title: "3D over the desktop, when you want it",
    headset: "In a headset there is no desktop: one compositor draws everything the eyes see.",
    display: "On a desk, 3D can sit over ordinary flat windows, see-through around its edges, with clicks passing to the window behind.",
    adds: "Transparent presentation and a depth budget, so 3D content can live on top of the desktop without taking it over.",
    extensions: ["XR_DXR_depth_budget", "XR_DXR_spatial_workspace"],
    image: {
      src: "/art/gaps/over-desktop.webp",
      alt: "A friendly 3D character standing over ordinary desktop windows, transparent around it.",
    },
  },
];
