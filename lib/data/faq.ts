// Site-wide FAQ, grouped by who asks. Built Nov 11, 2026 from nine persona
// question lists run against the live site (display owner, Linux/SteamOS user,
// app developer, OpenXR engineer, web developer, display maker, device maker
// with an IT hat, press, standards + comfort). Answers are written from the
// runtime/web-SDK docs and code and from positions David approved the same day.
//
// Rules: answer first, two to four sentences; "the DisplayXR runtime", never a
// bare "the runtime"; never "conformant" or "certified" as a claim; no
// performance or adoption numbers; no OEM, partner or customer names; no
// health claims of our own. Page-specific questions stay on their pages
// (/play, /browser, /apps/*). Do not link a charter until it is published.

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqGroup {
  id: string;
  group: string;
  items: FaqItem[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "basics",
    group: "The basics",
    items: [
      {
        q: "What is DisplayXR, in one sentence?",
        a: "An open-source OpenXR runtime, plus the extensions OpenXR needs, that lets one app or web page show in 3D on any spatial display, from any vendor, with or without glasses. Display makers plug in underneath; developers build once on top.",
      },
      {
        q: "Why does a desk display need its own OpenXR runtime?",
        a: "OpenXR was written for headsets, which are worn and own the whole view. A spatial display sits on a desk, shares its screen with 2D windows, and has to follow where your eyes are. DisplayXR is built on OpenXR, the standard headsets use, so engines and apps can treat a spatial display as another XR device, and it adds what a display needs on top.",
      },
      {
        q: "Why now, when earlier glasses-free 3D faded?",
        a: "Earlier attempts faded because every display had its own SDK and its own small content silo, so developers could not reach enough screens. Two things changed: engines and apps already speak OpenXR, and AI can now convert and generate 3D content at scale. What was missing is one way to reach every screen, and that is what DisplayXR is.",
      },
      {
        q: "Which displays work today?",
        a: "Any spatial display whose maker ships a DisplayXR plug-in. The current list, by maker, with the operating systems each supports, is on the Platform Support page. Developers can also run everything on an ordinary monitor with the built-in simulated display.",
      },
      {
        q: "Is it free?",
        a: "Yes. The DisplayXR runtime, the extensions, the engine plug-ins, the web SDK and the demos are open source, and the DisplayXR Browser is a free app distributed by the DisplayXR project. Nothing is sold by the project.",
      },
      {
        q: "Who pays for development?",
        a: "Leia, where the project was founded and is incubated, funds it today: engineering, CI, signing and hosting. Other companies may sponsor work or infrastructure, but sponsorship buys no say in the interface. Display makers earn from their own hardware, which sits behind their plug-ins.",
      },
    ],
  },
  {
    id: "owners",
    group: "If you own a spatial display",
    items: [
      {
        q: "What do I install, and in what order?",
        a: "Install DisplayXR first, from the Download page: the all-in-one installer brings the DisplayXR runtime and your display's plug-in. Then install the apps you want, such as the DisplayXR Browser. Everything else depends on the DisplayXR runtime being there.",
      },
      {
        q: "Are the installers signed?",
        a: "Yes, the official Windows installers are code-signed and the macOS packages are signed and notarized. The one exception today is the macOS all-in-one bundle package, so on a Mac you may see a warning for that one. Builds you make yourself from source are unsigned.",
      },
      {
        q: "Does eye tracking send my camera images anywhere?",
        a: "No. Eye tracking runs on your device, in the display's plug-in or in DisplayXR's open camera tracker, and only eye positions come out of it. The DisplayXR runtime keeps those on your device and has no telemetry and no accounts. The display maker's own privacy policy covers its plug-in and tracking software.",
      },
      {
        q: "What happens to my display maker's own 3D software?",
        a: "It keeps working. DisplayXR is a separate OpenXR runtime that apps choose by using OpenXR; it does not replace or remove your maker's own viewer. Apps built for DisplayXR then run on your display without a maker-specific version.",
      },
      {
        q: "Can I always switch back to 2D?",
        a: "Yes. Every display plug-in must support 2D, and the V key toggles 2D and 3D in any app, including ones written for headsets. Apps can also switch the display to 2D themselves.",
      },
      {
        q: "What happens if the camera loses me, or I look away?",
        a: "By default the display's plug-in eases the 3D view to a comfortable default and, if tracking does not come back, switches the panel to 2D until it does. Apps can choose to handle this themselves instead.",
      },
      {
        q: "Is it comfortable, and is it suitable for children?",
        a: "Follow your device maker's health and safety guidance, which ships with the display: DisplayXR provides the software interface, not the display hardware. For developers, the platform reports a comfort zone at the viewer's distance so apps can keep depth comfortable.",
      },
      {
        q: "Where do I get help?",
        a: "Your device maker supports your device, including its display software. The DisplayXR project supports developers through public issues and docs on GitHub, and questions and ideas are welcome in GitHub Discussions.",
      },
    ],
  },
  {
    id: "developers",
    group: "App and engine developers",
    items: [
      {
        q: "Does my OpenXR app that runs on headsets work unmodified?",
        a: "Yes. It runs as a standard OpenXR app: the DisplayXR runtime opens a window, picks a mode the app can fill, and hands back ready-to-render views, with the V key toggling 2D and 3D. Enabling XR_DXR_display_info is the first step to more: every rendering mode, mode-change events and correctly sized swapchains.",
      },
      {
        q: "My app owns its window. What do I add?",
        a: "The window-binding extension for your platform, passed at session creation: XR_DXR_win32_window_binding, XR_DXR_cocoa_window_binding, XR_DXR_xlib_window_binding or XR_DXR_wayland_surface_binding, or XR_DXR_android_surface_binding. The DisplayXR runtime then draws into your window, and you keep input, lifecycle and your message loop.",
      },
      {
        q: "Do I have to rewrite my renderer?",
        a: "No. Each graphics API has its own native compositor (D3D11, D3D12, Vulkan, Metal and OpenGL), so you render your views into a standard OpenXR swapchain with the binding you already use. Windows supports all five, macOS supports Metal, Vulkan and OpenGL, and Linux is Vulkan.",
      },
      {
        q: "Does one build cover every display brand?",
        a: "Yes. Display support comes from each vendor's plug-in, found when your app starts, and the DisplayXR runtime contains no vendor code. You ship one build; the display maker's plug-in does the display-specific work.",
      },
      {
        q: "Does my app get eye positions, or finished views?",
        a: "Either, depending on what you enable. By default the DisplayXR runtime returns ready-to-render views and field of view; an app that binds its own window can instead take the tracked eye positions and build its own off-axis projection. Views are always filled in, even when tracking is lost.",
      },
      {
        q: "Can I test without a spatial display?",
        a: "Yes. The DisplayXR runtime ships a simulated display that behaves like a real one in an ordinary window, and it can simulate eye tracking and a moving viewer. You need a real panel only to see the final 3D image.",
      },
      {
        q: "What happens on a headset, or a machine without DisplayXR?",
        a: "It is a standard OpenXR binary, so check which extensions are offered before enabling the XR_DXR ones; on a headset runtime they are absent. With no OpenXR runtime installed, your app needs its own 2D path, as with any OpenXR app.",
      },
      {
        q: "Which Unity and Unreal versions are supported?",
        a: "The Unity plug-in supports Unity 2022.3 LTS and later, including Unity 6, on Windows, macOS, Linux and Android. The Unreal plug-in supports Unreal Engine 5.7 on Windows, macOS and Android and is in beta. Both use the DisplayXR runtime's ready-to-render views, so neither does its own projection math.",
      },
      {
        q: "Do my users have to install DisplayXR first?",
        a: "Yes, today. Like any OpenXR app, yours talks to the runtime installed on the machine, and DisplayXR's demo installers check that it is present. The DisplayXR runtime is BSL-1.0, a permissive license.",
      },
      {
        q: "How stable is the plug-in interface?",
        a: "Additions to the plug-in interface are append-only and need no version change; any change that is not additive bumps its major version, and the DisplayXR runtime refuses a plug-in from another major version and falls back. Extension spec versions only go up.",
      },
    ],
  },
  {
    id: "web",
    group: "Web developers",
    items: [
      {
        q: "Is this WebXR?",
        a: "It extends WebXR. In the DisplayXR Browser a page opens an 'inline-3d' session and binds a display layer to a canvas, using the normal WebXR render loop, and the 3D is composed by the DisplayXR runtime. It is a draft proposal, not a shipped web standard, and most pages use the @displayxr/inline3d SDK that wraps it.",
      },
      {
        q: "What do visitors in other browsers see?",
        a: "The ordinary page, in 2D. The SDK reports that 3D is not supported and the page shows its normal content, so a 3D page is safe to ship anywhere.",
      },
      {
        q: "Do I need PlayCanvas if my site uses three.js?",
        a: "No. The core SDK has no dependencies; three.js, Spark and PlayCanvas are optional and load only when a scene asks for one. The model module uses PlayCanvas by default or three.js on request, and splats work with three.js and Spark or with PlayCanvas.",
      },
      {
        q: "Can my page detect the DisplayXR Browser?",
        a: "Yes, by capability: ask the SDK whether inline 3D is available and branch on the answer. Don't sniff the user-agent string.",
      },
      {
        q: "What license is the web SDK?",
        a: "Apache-2.0, like the samples.",
      },
    ],
  },
  {
    id: "makers",
    group: "Display makers and device makers",
    items: [
      {
        q: "What does a display maker have to write?",
        a: "One plug-in library and an installer that registers it. The plug-in reports the display, its modes and tracking, and does the weave for each graphics API you support. The vendor template builds with no vendor SDK, so you start from working code and swap in your own.",
      },
      {
        q: "Do my weaving, calibration and tracking stay mine?",
        a: "Yes. They stay inside your plug-in binary and never cross the interface, and a closed-source plug-in owes an attribution notice and nothing else. The DisplayXR runtime never weaves; your plug-in always does.",
      },
      {
        q: "Can anything draw over my image after I weave?",
        a: "Only one thing: an app's flat 2D layer is composited after the weave wherever the app marks a region as 2D. The depth-aware cursor and in-scene overlays are drawn into the views before your plug-in receives them.",
      },
      {
        q: "My display has its own eye tracker. Does it stay in charge?",
        a: "Yes. A display that tracks always uses its own tracker. Separate viewer-tracking providers drive the views only on displays that do not track and opt in.",
      },
      {
        q: "Are glasses-based and multi-view displays supported?",
        a: "The plug-in interface treats the display as a black box, so glasses-based and other display types use the same boundary. Rendering modes support up to eight views, in any tile layout.",
      },
      {
        q: "How do a plug-in and its updates reach users?",
        a: "On desktop, through your own installer, on your own release schedule: it installs and registers the plug-in, and it updates independently of the DisplayXR runtime while both share the same interface version. On Android, the plug-in ships inside a display-vendor variant of the DisplayXR runtime package.",
      },
      {
        q: "If two plug-ins are installed, which one wins?",
        a: "The highest-priority plug-in whose hardware is present, with the simulated display always last. Users can override the choice, per screen if they want, from the command line or the DisplayXR Dashboard.",
      },
      {
        q: "Is there a certification?",
        a: "No. The project certifies no one. It publishes a headless self-test that checks a plug-in loads, matches the interface version and reports the panel's real size, and the DisplayXR runtime itself runs the official Khronos OpenXR conformance test suite.",
      },
      {
        q: "May device makers preload the DisplayXR Browser?",
        a: "Yes: device makers may preload the Browser free and unmodified under its binary license; contact the project for the license text. The open-source components may be bundled under their own licenses.",
      },
      {
        q: "Are plug-ins checked before they load?",
        a: "On Windows, yes: each plug-in must be signed, allowlisted by an administrator or installed to a trusted location, or the DisplayXR runtime skips it. On Linux and macOS the check is logged rather than enforced, except for packages installed to system locations.",
      },
    ],
  },
  {
    id: "project",
    group: "The project and the standard",
    items: [
      {
        q: "The founder works for the first plug-in's vendor. How is this not one company's SDK?",
        a: "Fair question: the founder works at Leia, and Leia incubates the project today, which is why neutrality is built into the structure instead of promised. The DisplayXR runtime ships no vendor code, checked in CI; any vendor writes a plug-in from a template that needs no vendor SDK; vendors' weaving, calibration and tracking stay in their own binaries; and all development is public. Judge it by the code, and by whether the second vendor finds the door open.",
      },
      {
        q: "What happens when other display makers join?",
        a: "Today the only shipping plug-in comes from the founding vendor. When a second display maker ships a plug-in for a product, or a Khronos filing needs a submitter other than Leia, the name, domain, GitHub organization, signing and the Khronos seat move to a small independent steward, and a technical steering committee follows as more vendors take part.",
      },
      {
        q: "Is DisplayXR a conformant OpenXR runtime?",
        a: "Not yet. Conformance is a status Khronos grants to a product after a formal submission, and none has been filed. DisplayXR runs the official Khronos OpenXR conformance test suite on every release, which shows developers it behaves like OpenXR.",
      },
      {
        q: "Will the XR_DXR extensions become standard OpenXR?",
        a: "That is the intent. The XR_DXR author tag has been registered with Khronos since July 2026, the first formal step; extensions proven across several vendors' hardware become candidates for EXT and KHR through the working group's own process.",
      },
      {
        q: "What is open source, and what is not?",
        a: "The DisplayXR runtime is BSL-1.0; the extension headers, original components and reference apps are Apache-2.0. Layers derived from third-party code keep their upstream licenses (Play includes LGPL components). The DisplayXR Browser, with Chat, is a free app distributed by the DisplayXR project under its own binary terms, and the Shell is a reference workspace in preview.",
      },
      {
        q: "How do I contribute, and do I sign a CLA?",
        a: "No CLA: contributions use a DCO sign-off and contributors keep their copyright. Open a pull request against the relevant repository. Each repository states its license (the DisplayXR runtime BSL-1.0, original components Apache-2.0, which includes Apache's patent grant), and standardization through Khronos comes with Khronos's IP framework.",
      },
      {
        q: "How does it relate to Monado?",
        a: "DisplayXR began as a fork of the Monado OpenXR runtime, with the headset-specific code removed and native per-API compositors, display plug-ins and the XR_DXR extensions added.",
      },
      {
        q: "Who builds the apps on the Apps page?",
        a: "Most were built by the project's maintainers, including Leia engineers, to prove the interface; others come from outside developers, and those are marked as community apps on their cards.",
      },
    ],
  },
  {
    id: "linux",
    group: "Linux",
    items: [
      {
        q: "Which distributions are supported?",
        a: "Ubuntu 22.04, 24.04 and 26.04 on amd64, as .deb packages, a user-level tarball and an all-in-one bundle. Packages are built on the oldest supported release and installed on all three in CI.",
      },
      {
        q: "Which GPUs work on Linux?",
        a: "Linux is Vulkan-only, so the requirement is a GPU with a working Vulkan driver.",
      },
      {
        q: "How do I build from source?",
        a: "Install the packages listed at the top of scripts/build_linux.sh in the runtime repository and run it; it builds and runs a self-test. Options add the service, the test apps and a clean rebuild.",
      },
      {
        q: "Where do I report a bug, and what do I attach?",
        a: "DisplayXR runtime and plug-in-loading bugs go to the runtime repository's issues, Browser and SDK bugs to the Browser's. Attach the output of displayxr-cli info, and on Linux the app's terminal output plus the service log from journalctl.",
      },
    ],
  },
];
