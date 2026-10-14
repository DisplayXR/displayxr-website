import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { ComponentModelDiagram } from "@/components/components/ComponentModelDiagram";
import { NoteChip, StatusChip } from "@/components/components/StatusChip";
import { REPO_URLS, GITHUB_ORG_URL } from "@/lib/constants";
import {
  componentClasses,
  COMPONENT_SPECS,
  type ComponentClass,
} from "@/lib/data/components";
import { Mail, Rocket, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Components",
  description:
    "Plug your display, tracker or 2D-to-3D model into DisplayXR. One runtime nobody forks; display processors, input providers and conversion providers plug in over versioned C ABIs, each with a reference implementation.",
};

const DOCS_BASE = `${REPO_URLS.runtime}/blob/main/docs`;

const byId = Object.fromEntries(componentClasses.map((c) => [c.id, c])) as Record<
  string,
  ComponentClass
>;

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-sm text-accent">
      {children}
    </code>
  );
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="text-accent underline underline-offset-2 hover:text-accent-hover"
    >
      {children}
    </a>
  );
}

/** Heading, chip, contract line and implementations shared by every class section. */
function ClassSection({ cls, children }: { cls: ComponentClass; children: React.ReactNode }) {
  return (
    <section id={cls.id} className="scroll-mt-32">
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary">{cls.name}</h2>
        <StatusChip cls={cls} />
      </div>
      <p className="mb-4 text-text-secondary">{cls.plain}</p>
      {cls.symbol && (
        <p className="mb-4 font-mono text-xs text-text-secondary">
          {cls.symbol} · ABI {cls.abi} ·{" "}
          <A href={cls.record.href}>{cls.record.label}</A>
        </p>
      )}
      <div className="space-y-4 leading-relaxed text-text-secondary">{children}</div>
      {cls.impls.length > 0 && (
        <ul className="mt-5 divide-y divide-border rounded-lg border border-border">
          {cls.impls.map((i) => (
            <li key={i.name} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4">
              <span className="flex shrink-0 items-center gap-2 sm:w-64">
                <span className="text-sm font-medium text-text-primary">
                  {i.href ? <A href={i.href}>{i.name}</A> : i.name}
                </span>
                {i.chip && <NoteChip label={i.chip.label} title={i.chip.title} />}
              </span>
              <span className="text-sm text-text-secondary">
                <span className="mr-2 font-mono text-[11px] uppercase tracking-wide">{i.role}</span>
                {i.note}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function ComponentsPage() {
  const dp = byId["display-processors"];
  const input = byId["input-providers"];
  const conv = byId["conversion-providers"];
  const tracking = byId["viewer-tracking"];

  return (
    <PageLayout
      title="Components"
      description="Plug your display, tracker or 2D-to-3D model into DisplayXR. The runtime is one trunk that nobody forks. Everything hardware- or model-specific is a component it discovers at startup, so you ship a library from your own repo and every DisplayXR app runs on it, unchanged."
    >
      <div className="max-w-4xl space-y-14">
        <ComponentModelDiagram />

        <div className="max-w-3xl space-y-14">
          <p className="leading-relaxed text-text-secondary">
            Each component class has its own entry point, its own ABI version
            and its own discovery root, and the runtime ships a reference
            implementation for each, so the whole system runs on a laptop with
            no hardware. The runtime owns selection and policy; a component owns
            one capability. The model is recorded in{" "}
            <A href={tracking.record.href}>ADR-054</A>.
          </p>

          {/* Start here: the display-maker path, the most common one */}
          <section className="rounded-lg border border-accent/30 bg-accent/10 p-6">
            <div className="mb-3 flex items-center gap-3">
              <Rocket size={20} className="text-accent" />
              <h2 className="text-xl font-semibold tracking-tight text-text-primary">
                Building a spatial display? Start here
              </h2>
            </div>
            <ol className="mb-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-text-secondary">
              <li>
                Clone the <A href={REPO_URLS.vendorTemplate}>vendor template</A>.
                It builds green with no vendor SDK, so the first thing you see is
                a working pixel path.
              </li>
              <li>
                Replace one function, the weave. Two of about nineteen vtable
                slots are mandatory (<Code>process_atlas</Code> and{" "}
                <Code>destroy</Code>); the rest are optional and NULL-safe.
              </li>
              <li>
                Ship the library and an installer from your own repo, on your own
                cadence. Check it with <Code>displayxr-cli selftest</Code>.
              </li>
            </ol>
            <p className="text-sm leading-relaxed text-text-secondary">
              Expect about a week of DisplayXR plumbing. Your weaver and
              calibration stay inside your binary and never cross the ABI.{" "}
              <A href={`${DOCS_BASE}/guides/vendor-plugin-onboarding.md`}>
                Onboarding guide →
              </A>
            </p>
          </section>

          <ClassSection cls={dp}>
            <p>
              A display processor is the one component that knows your panel. It
              turns the rendered views into whatever the optics need, carries the
              calibration and, where the panel tracks the viewer, owns that
              tracker. The compositor calls it every frame and never weaves
              itself; the runtime carries zero vendor identifiers, and its build
              checks that.
            </p>
            <p>
              Discovery: on Windows your installer registers the library under{" "}
              <Code>HKLM\Software\DisplayXR\DisplayProcessors</Code>; on macOS and
              Linux a JSON manifest points at it. The first one whose hardware is
              present wins, and <Code>sim_display</Code> always loses to real
              hardware. <A href={COMPONENT_SPECS.displayProcessors}>Discovery spec →</A>
            </p>
          </ClassSection>

          <ClassSection cls={input}>
            <p>
              An input provider surfaces tracked hands, controllers or a
              navigation device from any tracking source. Apps read them through{" "}
              <Code>xrSyncActions</Code> with no idea where the poses came from,
              and a display maker is never obliged to implement input. Discovery,
              probe order and ABI gating mirror display processors.
            </p>
            <p>
              There is no input-provider template yet: start from the
              display-processor template&apos;s build scaffolding and the{" "}
              <A href={COMPONENT_SPECS.inputProviders}>discovery spec</A>.{" "}
              <Code>displayxr-cli input list</Code> shows what loaded.
            </p>
          </ClassSection>

          <ClassSection cls={conv}>
            <p>
              A conversion provider turns 2D into 3D: depth from an image or a
              video, disparity from a stereo pair, extra views from one image,
              Gaussian splats from a photo. It declares what it can do per task;
              the runtime picks one provider per task, hosts it and shares it
              across every app. Apps reach it through{" "}
              <A href="/extensions#XR_DXR_lift">
                <span className="font-mono">XR_DXR_lift</span>
              </A>{" "}
              and never ship a model.
            </p>
            <p>
              This opens DisplayXR to model makers who are not display makers: a
              depth or view-synthesis model reaches every panel without a display
              partner. <Code>displayxr-cli conv list</Code> shows the providers and
              which one serves each task.
            </p>
          </ClassSection>

          <section id={tracking.id} className="scroll-mt-32">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
                {tracking.name}
              </h2>
              <StatusChip cls={tracking} />
            </div>
            <p className="leading-relaxed text-text-secondary">
              {tracking.plain} The class is designed in{" "}
              <A href={tracking.record.href}>ADR-054</A>; its contract and code
              are not on main yet. When a display tracks the viewer itself, its
              own tracker wins.
            </p>
          </section>

          {/* Licensing */}
          <section>
            <div className="mb-3 flex items-center gap-3">
              <Scale size={20} className="text-accent" />
              <h2 className="text-xl font-semibold tracking-tight text-text-primary">
                Licensing
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-text-secondary">
              The runtime and the plug-in contract headers are BSL-1.0; the{" "}
              <span className="font-mono">XR_DXR_*</span> extension headers and the
              vendor template are Apache-2.0. There is no copyleft anywhere, so a
              closed-source component owes an attribution notice and nothing else.
            </p>
          </section>

          {/* Partner contact CTA */}
          <section className="rounded-lg border border-border bg-surface p-6">
            <div className="mb-3 flex items-center gap-3">
              <Mail size={20} className="text-accent" />
              <h2 className="text-xl font-semibold tracking-tight text-text-primary">
                Bring your hardware or model to DisplayXR
              </h2>
            </div>
            <p className="mb-5 leading-relaxed text-text-secondary">
              We&apos;ll help you scope a component and get it onto the platform.
              A second independent display vendor is also the milestone that
              moves the project toward shared, multi-vendor governance, so get in
              touch early.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`${GITHUB_ORG_URL}/displayxr-runtime/issues/new?title=Component+integration+inquiry&labels=vendor`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-background hover:bg-accent-hover"
              >
                <Mail size={15} /> Start a conversation on GitHub
              </a>
              <a
                href="/architecture"
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-text-primary hover:border-accent/50"
              >
                Read the architecture
              </a>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
