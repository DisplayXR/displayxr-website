import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import { REPO_URLS } from "@/lib/constants";
import {
  Monitor,
  Package,
  LayoutGrid,
  Bot,
  CheckCircle2,
  PlayCircle,
  HelpCircle,
} from "lucide-react";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Get Started with DisplayXR",
  description:
    "Install the DisplayXR runtime, shell, and MCP tools on Windows. End-to-end walkthrough from a fresh machine to a running spatial workspace.",
};

type Step = {
  num: number;
  title: string;
  required: boolean;
  icon: ReactNode;
  body: ReactNode;
};

const Mono = ({ children }: { children: ReactNode }) => (
  <code className="bg-background text-accent px-1.5 py-0.5 rounded text-xs font-mono">
    {children}
  </code>
);

const InstallerLink = ({
  href,
  filename,
}: {
  href: string;
  filename: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-accent hover:text-accent-hover underline underline-offset-2"
  >
    {filename}
  </a>
);

const steps: Step[] = [
  {
    num: 1,
    title: "Check the prerequisites",
    required: true,
    icon: <Monitor size={20} />,
    body: (
      <>
        <ul className="space-y-2 text-text-secondary leading-relaxed list-disc list-inside">
          <li>Windows 10 version 2004 or later (Windows 11 recommended)</li>
          <li>
            A tracked 3D display supported by DisplayXR — currently Leia SR
            displays (Lume Pad, Leia 3D laptops). See the{" "}
            <a
              href="/compatibility"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              compatibility matrix
            </a>{" "}
            for the full list.
          </li>
          <li>
            Admin rights to run the installers (each registers under{" "}
            <Mono>HKLM\Software\DisplayXR</Mono>)
          </li>
        </ul>
        <p className="text-sm text-text-secondary leading-relaxed mt-4">
          No 3D display? You can still install everything — the runtime ships
          a simulated display driver (<Mono>sim_display</Mono>) for development
          on a regular monitor with WASD + mouse eye-position control.
        </p>
      </>
    ),
  },
  {
    num: 2,
    title: "Install the DisplayXR Runtime",
    required: true,
    icon: <Package size={20} />,
    body: (
      <>
        <p className="text-text-secondary leading-relaxed mb-4">
          The runtime is the OpenXR layer every DisplayXR app talks to. It
          includes the native compositors (D3D11, D3D12, Vulkan, OpenGL) and
          the Windows service.
        </p>
        <ol className="space-y-2 text-text-secondary leading-relaxed list-decimal list-inside mb-4">
          <li>
            Download{" "}
            <InstallerLink
              href={`${REPO_URLS.runtime}/releases/latest`}
              filename="DisplayXRSetup-*.exe"
            />{" "}
            from the runtime releases page.
          </li>
          <li>Run the installer and accept the defaults.</li>
          <li>
            On first install, the <strong>DisplayXR Service</strong> is
            registered and started, and{" "}
            <Mono>HKLM\Software\Khronos\OpenXR\1\ActiveRuntime</Mono> is set
            to the DisplayXR runtime JSON.
          </li>
        </ol>
        <p className="text-sm text-text-secondary leading-relaxed">
          After this step, any OpenXR app on the system will route through
          DisplayXR. If you only want OpenXR for your own 3D-display app, you
          can stop here.
        </p>
      </>
    ),
  },
  {
    num: 3,
    title: "Install the DisplayXR Shell",
    required: false,
    icon: <LayoutGrid size={20} />,
    body: (
      <>
        <p className="text-text-secondary leading-relaxed mb-4">
          The shell is the reference spatial workspace UX — a 3D window
          manager that runs multiple OpenXR apps and captured 2D apps in a
          single head-tracked workspace. <strong>Optional</strong>; install
          it if you want a spatial-desktop experience.
        </p>
        <ol className="space-y-2 text-text-secondary leading-relaxed list-decimal list-inside mb-4">
          <li>
            Download{" "}
            <InstallerLink
              href={`${REPO_URLS.shell}/releases/latest`}
              filename="DisplayXRShellSetup-*.exe"
            />{" "}
            from the shell releases page.
          </li>
          <li>
            Run the installer. It reads{" "}
            <Mono>HKLM\Software\DisplayXR\Runtime\InstallPath</Mono> and will
            refuse to install if the runtime is missing — finish step 2
            first.
          </li>
          <li>
            The shell installs into the runtime&apos;s tree and registers
            itself at{" "}
            <Mono>HKLM\Software\DisplayXR\WorkspaceControllers\shell</Mono> so
            the runtime&apos;s service orchestrator can discover it.
          </li>
        </ol>
        <p className="text-sm text-text-secondary leading-relaxed">
          OEMs and vertical integrators can ship their own workspace
          controllers using the same{" "}
          <a
            href="/extensions"
            className="text-accent hover:text-accent-hover underline underline-offset-2"
          >
            <Mono>XR_EXT_spatial_workspace</Mono>
          </a>{" "}
          contract; the shell is just the reference implementation.
        </p>
      </>
    ),
  },
  {
    num: 4,
    title: "Install DisplayXR MCP Tools",
    required: false,
    icon: <Bot size={20} />,
    body: (
      <>
        <p className="text-text-secondary leading-relaxed mb-4">
          Enables AI-agent and voice control of your spatial workspace.{" "}
          <strong>Optional</strong>; install it if you want Claude, ChatGPT,
          or other MCP clients to introspect and drive your spatial
          workspace.
        </p>
        <ol className="space-y-2 text-text-secondary leading-relaxed list-decimal list-inside mb-4">
          <li>
            Download{" "}
            <InstallerLink
              href={`${REPO_URLS.mcp}/releases/latest`}
              filename="DisplayXRMCPSetup-*.exe"
            />{" "}
            from the MCP releases page.
          </li>
          <li>
            Run the installer. It writes{" "}
            <Mono>HKLM\Software\DisplayXR\Capabilities\MCP\Enabled = 1</Mono>.
          </li>
          <li>
            On next launch, the runtime and shell each spawn an MCP server
            thread. Phase A (per-app introspection) is exposed by the
            runtime; Phase B (workspace control) by the shell.
          </li>
        </ol>
        <p className="text-sm text-text-secondary leading-relaxed">
          Per-process opt-out:{" "}
          <Mono>set DISPLAYXR_MCP=0</Mono> before launching an app.
        </p>
      </>
    ),
  },
  {
    num: 5,
    title: "Verify the install",
    required: true,
    icon: <CheckCircle2 size={20} />,
    body: (
      <>
        <ul className="space-y-2 text-text-secondary leading-relaxed list-disc list-inside">
          <li>
            <strong>Service running:</strong> open{" "}
            <Mono>services.msc</Mono> and confirm{" "}
            <strong>DisplayXR Service</strong> shows as Running.
          </li>
          <li>
            <strong>Active OpenXR runtime:</strong> from a command prompt,{" "}
            <Mono>
              reg query HKLM\Software\Khronos\OpenXR\1 /v ActiveRuntime
            </Mono>{" "}
            should return the DisplayXR JSON path.
          </li>
          <li>
            <strong>Shell installed (if step 3):</strong>{" "}
            <Mono>
              reg query HKLM\Software\DisplayXR\WorkspaceControllers\shell
            </Mono>{" "}
            returns its install path. <strong>DisplayXR Shell</strong> appears
            in the Start menu.
          </li>
          <li>
            <strong>MCP installed (if step 4):</strong>{" "}
            <Mono>
              reg query HKLM\Software\DisplayXR\Capabilities\MCP /v Enabled
            </Mono>{" "}
            returns <Mono>0x1</Mono>.
          </li>
        </ul>
      </>
    ),
  },
  {
    num: 6,
    title: "First launch",
    required: true,
    icon: <PlayCircle size={20} />,
    body: (
      <>
        <p className="text-text-secondary leading-relaxed mb-4">
          Launch <strong>DisplayXR Shell</strong> from the Start menu (or
          Ctrl+Space from the tray icon). The shell auto-starts the service
          if it isn&apos;t running, then activates the spatial workspace on your
          tracked 3D display.
        </p>
        <p className="text-text-secondary leading-relaxed mb-4">
          Try the basics:
        </p>
        <ul className="space-y-2 text-text-secondary leading-relaxed list-disc list-inside mb-4">
          <li>Open a few apps — they auto-adopt as 3D-positioned windows</li>
          <li>
            <Mono>Ctrl+1</Mono>…<Mono>Ctrl+8</Mono> — cycle layout presets
            (side-by-side, theater, carousel, helix, …)
          </li>
          <li>
            <Mono>TAB</Mono> — cycle focus; <Mono>V</Mono> — toggle 2D/3D
            display mode
          </li>
          <li>
            <Mono>Ctrl+Shift+C</Mono> — capture a stereo screenshot
          </li>
          <li>
            <Mono>ESC</Mono> — dismiss the shell and restore your normal
            desktop
          </li>
        </ul>
        <p className="text-sm text-text-secondary leading-relaxed">
          Full keyboard reference and feature catalog:{" "}
          <a
            href={`${REPO_URLS.shell}#features`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-hover underline underline-offset-2"
          >
            shell README
          </a>
          .
        </p>
      </>
    ),
  },
];

export default function GettingStartedPage() {
  return (
    <PageLayout
      title="Get Started"
      description="Install DisplayXR on a fresh Windows machine. Three small installers, in order — runtime first, then optionally the spatial-workspace shell and the MCP tools for AI-agent control."
    >
      <div className="space-y-12">
        {/* Platform note */}
        <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-2">
            Windows today, macOS via source
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            This walkthrough covers the packaged Windows installers. macOS is
            currently a source build — clone{" "}
            <a
              href={REPO_URLS.runtime}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline underline-offset-2"
            >
              displayxr-runtime
            </a>{" "}
            and run <Mono>./scripts/build_macos.sh</Mono>. The shell and MCP
            Tools are Windows-only at the moment.
          </p>
        </div>

        {/* Steps */}
        <section className="space-y-6">
          {steps.map((step) => (
            <Card key={step.num} className="!p-0">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/15 text-accent text-sm font-semibold border border-accent/30">
                    {step.num}
                  </div>
                  <div className="text-accent">{step.icon}</div>
                  <h3 className="text-lg font-semibold text-text-primary flex-1">
                    {step.title}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      step.required
                        ? "bg-success/15 text-success border-success/30"
                        : "bg-text-secondary/15 text-text-secondary border-text-secondary/30"
                    }`}
                  >
                    {step.required ? "Required" : "Optional"}
                  </span>
                </div>
                <div className="ml-11">{step.body}</div>
              </div>
            </Card>
          ))}
        </section>

        {/* Troubleshooting */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="text-accent">
              <HelpCircle size={20} />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
              Troubleshooting
            </h2>
          </div>
          <div className="space-y-4">
            <details className="bg-surface border border-border rounded-lg">
              <summary className="cursor-pointer px-6 py-4 text-text-primary font-medium select-none">
                Shell installer says the runtime isn&apos;t installed
              </summary>
              <p className="px-6 pb-6 pt-2 text-sm text-text-secondary leading-relaxed">
                The shell installer reads{" "}
                <Mono>HKLM\Software\DisplayXR\Runtime\InstallPath</Mono>. If
                this key is missing, the runtime install didn&apos;t complete.
                Re-run <Mono>DisplayXRSetup-*.exe</Mono> as admin and confirm{" "}
                <strong>DisplayXR Service</strong> appears in{" "}
                <Mono>services.msc</Mono> before retrying the shell installer.
              </p>
            </details>
            <details className="bg-surface border border-border rounded-lg">
              <summary className="cursor-pointer px-6 py-4 text-text-primary font-medium select-none">
                OpenXR apps still route to my old runtime
              </summary>
              <p className="px-6 pb-6 pt-2 text-sm text-text-secondary leading-relaxed">
                The OpenXR loader picks the runtime registered at{" "}
                <Mono>HKLM\Software\Khronos\OpenXR\1\ActiveRuntime</Mono>.
                Confirm it points to the DisplayXR JSON; some VR runtimes
                (SteamVR, Oculus, WMR) reset this on launch. You can force
                DisplayXR per-process by setting{" "}
                <Mono>XR_RUNTIME_JSON</Mono> to its JSON path.
              </p>
            </details>
            <details className="bg-surface border border-border rounded-lg">
              <summary className="cursor-pointer px-6 py-4 text-text-primary font-medium select-none">
                Shell launches but the display stays in 2D
              </summary>
              <p className="px-6 pb-6 pt-2 text-sm text-text-secondary leading-relaxed">
                Press <Mono>V</Mono> to toggle 3D mode. The shell is
                focus-adaptive: focusing a 2D-only app intentionally drops
                back to 2D. If 3D mode never engages, check that the Leia SR
                service is running and that the display is recognized in your
                vendor control panel.
              </p>
            </details>
            <details className="bg-surface border border-border rounded-lg">
              <summary className="cursor-pointer px-6 py-4 text-text-primary font-medium select-none">
                MCP server isn&apos;t reachable from my agent
              </summary>
              <p className="px-6 pb-6 pt-2 text-sm text-text-secondary leading-relaxed">
                Confirm{" "}
                <Mono>HKLM\Software\DisplayXR\Capabilities\MCP\Enabled</Mono>{" "}
                is <Mono>1</Mono> and that the runtime / shell were restarted
                after installing MCP Tools. Each app process hosts its own
                named-pipe MCP endpoint; the shell hosts workspace-control
                tools. See the{" "}
                <a
                  href={`${REPO_URLS.mcp}/blob/main/docs/mcp-spec.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-hover underline underline-offset-2"
                >
                  MCP spec
                </a>{" "}
                for the connection topology.
              </p>
            </details>
          </div>
        </section>

        {/* Where next */}
        <section className="pt-8 border-t border-border">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Where to next
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card href="/architecture" title="How it works">
              <p className="text-sm text-text-secondary leading-relaxed">
                Native compositors per graphics API, the workspace controller
                model, and how 2D + 3D apps share one display.
              </p>
            </Card>
            <Card href="/extensions" title="Build for 3D displays">
              <p className="text-sm text-text-secondary leading-relaxed">
                The OpenXR extensions DisplayXR adds —{" "}
                <Mono>XR_EXT_display_info</Mono>, window bindings, and the
                workspace surface.
              </p>
            </Card>
            <Card href="/demos" title="See it in action">
              <p className="text-sm text-text-secondary leading-relaxed">
                Reference apps and demos you can install alongside the
                runtime to verify your setup.
              </p>
            </Card>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
