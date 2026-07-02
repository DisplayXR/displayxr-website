import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import { REPO_URLS } from "@/lib/constants";
import {
  Scale,
  GitPullRequest,
  Landmark,
  FileText,
  Users,
  ArrowUpRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Governance",
  description:
    "How DisplayXR is governed during incubation, how extensions are proposed and stabilized, and the adoption milestones that transition the project to shared, multi-vendor governance and Khronos engagement.",
};

const GOVERNANCE_URL = `${REPO_URLS.extensions}/blob/main/GOVERNANCE.md`;
const ADR_URL = `${REPO_URLS.runtime}/tree/main/docs/adr`;

// Extension lifecycle — mirrors GOVERNANCE.md in the extensions repo.
const lifecycle = [
  {
    step: "Proposal",
    desc: "An issue or spec PR on displayxr-extensions: the problem, the API surface, and which display classes it serves.",
  },
  {
    step: "Spec + implementation",
    desc: "No spec lands without a working implementation in a conformant runtime. Both are reviewed together — the OpenXR working group's own rule.",
  },
  {
    step: "Experimental",
    desc: "Merged extensions ship in the runtime marked experimental; the API can still move in response to real-world use.",
  },
  {
    step: "Stable",
    desc: "Once shipped applications depend on it and a full release cycle passes without breaking changes, the extension is frozen.",
  },
  {
    step: "Upstream",
    desc: "Extensions proven across multiple vendors' hardware become candidates for the official Khronos OpenXR registry.",
  },
];

// Milestone-triggered governance transitions — the honest version of a
// Intended direction as adoption grows — a statement of intent, not binding
// commitments. Wording mirrors GOVERNANCE.md in the extensions repo.
const milestones = [
  {
    milestone: "Today — incubation",
    change:
      "Maintainer-led by a small core team. All design happens in public: specs, ADRs, issues, and PRs. Neutrality is enforced by architecture and license.",
    current: true,
  },
  {
    milestone: "A second, independent vendor adopts the plug-in boundary",
    change:
      "The project intends to form a Technical Steering Committee with representation from participating organizations alongside maintainer seats, and to move extension approval to that committee.",
    current: false,
  },
  {
    milestone: "Extensions in production across multiple vendors' hardware",
    change:
      "The project intends to pursue formal Khronos engagement — an exploratory-group proposal and/or submission of proven extensions to the OpenXR working group.",
    current: false,
  },
  {
    milestone: "Khronos adoption",
    change:
      "Specs migrate to the official OpenXR registry. The project intends to continue as the open reference implementation and the incubator for the next round of extensions.",
    current: false,
  },
];

export default function GovernancePage() {
  return (
    <PageLayout
      title="Governance"
      description="DisplayXR is an open incubator for spatial-display extensions to OpenXR, with the aim of upstreaming proven extensions into the official specification. The project is maintainer-led during incubation, with governance intended to broaden as adoption grows."
    >
      <div className="space-y-16">
        {/* Where the project stands */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-text-primary">
            Project status
          </h2>
          <p className="mb-6 text-sm text-text-secondary leading-relaxed max-w-3xl">
            DisplayXR is in its incubation phase, stewarded by its founder and
            lead maintainer, David Fattal. During this phase, vendor neutrality
            rests on three structural guarantees:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card title="Open by license" icon={<Scale size={20} />}>
              <p className="text-sm text-text-secondary leading-relaxed">
                Extension specs, runtime, engine plugins, and demos are
                permissively licensed open source — the runtime is a
                Monado-derived codebase under the Boost Software License.
              </p>
            </Card>
            <Card title="Neutral by architecture" icon={<Users size={20} />}>
              <p className="text-sm text-text-secondary leading-relaxed">
                Every display vendor integrates through the same documented
                plug-in boundary; no vendor has a privileged code path. The
                first such plug-in targets Leia-based displays — one
                implementation of that boundary among the many it is designed
                to support.
              </p>
            </Card>
            <Card title="Decided in public" icon={<FileText size={20} />}>
              <p className="text-sm text-text-secondary leading-relaxed">
                Design rationale is recorded as public{" "}
                <a
                  href={ADR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-hover underline underline-offset-2"
                >
                  Architecture Decision Records
                </a>
                . Architectural decisions take effect when they&apos;re
                written down.
              </p>
            </Card>
          </div>

          {/* Conflict-of-interest disclosure — stated head-on. */}
          <div className="mt-6 rounded-lg border border-border bg-surface p-6 max-w-3xl">
            <h3 className="mb-2 text-sm font-semibold text-text-primary">
              Stewardship &amp; conflict of interest
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              We state the conflict directly rather than leave it to be
              inferred: DisplayXR&apos;s founder and lead maintainer, David
              Fattal, is also an employee of Leia Inc. — the vendor whose
              plug-in is the first integration of the plug-in boundary. Two
              commitments hold neutrality in place: <strong className="text-text-primary">Leia
              has no privileged position</strong> — no privileged code path
              (the runtime ships zero vendor identifiers, CI-asserted), no
              privileged review authority, and no reserved governance seat — and
              the project intends to move its identity (domain, organization,
              name, signing keys, reference builds) to a small{" "}
              <strong className="text-text-primary">independent steward outside any single
              vendor</strong> as adoption grows. Full detail in the{" "}
              <a
                href={GOVERNANCE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover underline underline-offset-2"
              >
                governance document
              </a>
              .
            </p>
          </div>
        </section>

        {/* Extension lifecycle */}
        <section>
          <h2 className="mb-2 text-xl font-semibold text-text-primary">
            How an extension becomes part of the standard
          </h2>
          <p className="mb-6 text-sm text-text-secondary leading-relaxed max-w-3xl">
            The lifecycle is modeled on the OpenXR working group&apos;s own
            process. Extension identifiers are provisional until registered
            with Khronos through the official process.
          </p>
          <ol className="space-y-3">
            {lifecycle.map((item, i) => (
              <li
                key={item.step}
                className="flex gap-4 rounded-lg border border-border bg-surface p-5"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 font-mono text-xs font-semibold text-accent">
                  {i + 1}
                </span>
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-text-primary">
                    {item.step}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Path to shared governance */}
        <section>
          <h2 className="mb-2 text-xl font-semibold text-text-primary">
            The path to shared governance
          </h2>
          <p className="mb-6 text-sm text-text-secondary leading-relaxed max-w-3xl">
            The transitions below describe the direction the project intends to
            take as adoption grows — a statement of intent for how governance
            will broaden, not binding commitments.
          </p>
          <div className="space-y-3">
            {milestones.map((m) => (
              <div
                key={m.milestone}
                className={`rounded-lg border p-5 ${
                  m.current
                    ? "border-accent/40 bg-accent/5"
                    : "border-border bg-surface"
                }`}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <Landmark
                    size={15}
                    className={m.current ? "text-accent" : "text-text-secondary"}
                  />
                  <h3 className="text-sm font-semibold text-text-primary">
                    {m.milestone}
                  </h3>
                  {m.current && (
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-medium text-accent">
                      current
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {m.change}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Participate */}
        <section>
          <div className="rounded-lg border border-accent/30 bg-accent/10 p-6">
            <div className="mb-3 flex items-center gap-3">
              <GitPullRequest size={22} className="text-accent" />
              <h2 className="text-lg font-semibold text-text-primary">
                How to participate
              </h2>
            </div>
            <p className="mb-4 text-sm text-text-secondary leading-relaxed max-w-3xl">
              A second independent vendor plug-in is the milestone at which the
              project intends to move toward shared governance. Display vendors
              start with the{" "}
              <a
                href="/vendors"
                className="text-accent hover:text-accent-hover underline underline-offset-2"
              >
                plug-in guide
              </a>
              ; developers and contributors start at{" "}
              <a
                href="/contribute"
                className="text-accent hover:text-accent-hover underline underline-offset-2"
              >
                Contribute
              </a>
              . No membership, fee, or affiliation required.
            </p>
            <a
              href={GOVERNANCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover underline underline-offset-2"
            >
              Read the full governance document <ArrowUpRight size={14} />
            </a>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
