import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Charter",
  description:
    "Why DisplayXR exists, what the project commits to, and how it is run.",
};

const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="mb-3 mt-12 text-xl font-semibold text-text-primary first:mt-0">{children}</h2>
);
const P = ({ children }: { children: ReactNode }) => (
  <p className="mb-4 text-text-secondary leading-relaxed">{children}</p>
);
const LI = ({ children }: { children: ReactNode }) => (
  <li className="text-text-secondary leading-relaxed">{children}</li>
);

// The public charter. Deliberately short: the problem, the commitments, how
// the project is run. No funding, asset, signing or adoption-process detail
// (that stays in the internal charter), and no decision history.
export default function CharterPage() {
  return (
    <PageLayout
      title="Charter"
      description="Why DisplayXR exists, what the project commits to, and how it is run."
    >
      <div className="max-w-3xl">
        <H2>Why DisplayXR exists</H2>
        <P>
          Spatial displays, with or without glasses, are reaching laptops, monitors, tablets and
          phones, but each vendor ships its own SDK. An app written for one display has to be
          rewritten for the next, so few apps get written at all.
        </P>
        <P>
          DisplayXR fixes this with one open platform for every spatial display, built on OpenXR,
          the industry standard for XR. Developers write an app once and it runs on any supported
          display. Display makers plug their hardware in once and get every DisplayXR app.
        </P>
        <P>
          The project was founded and incubated at Leia, and it is open to every display vendor,
          developer and device maker.
        </P>

        <H2>What the project commits to</H2>
        <ul className="mb-4 list-disc space-y-3 pl-5">
          <LI>
            Open source. The DisplayXR runtime is licensed under BSL-1.0 and the project&apos;s
            original components under Apache-2.0. Contributors keep the copyright to their work.
          </LI>
          <LI>
            Vendor neutrality. Every display connects through the same documented plug-in
            interface, and the DisplayXR runtime contains no vendor-specific code. The extensions
            are designed for all spatial displays, not one family of panels.
          </LI>
          <LI>Open development. Issues, pull requests, design decisions and releases are all public.</LI>
          <LI>
            One shared core. Every product built on DisplayXR, including those of the companies
            that contribute to it, uses the same public code and released versions.
          </LI>
          <LI>
            Testing, not certification. The project publishes tests that anyone can run against
            their own plug-in, and it makes no claim of Khronos conformance before that conformance
            has been granted.
          </LI>
          <LI>
            Working with the standard. Extensions proven on several vendors&apos; hardware are
            proposed for the official OpenXR specification.
          </LI>
        </ul>

        <H2>How the project is run</H2>
        <P>
          Today the project is led by its founder with a small group of maintainers, named in each
          repository. Anyone can become a maintainer through their contributions.
        </P>
        <P>
          As other display vendors adopt DisplayXR, the project will move to shared governance: a
          technical steering committee drawn from the participating organizations, and an
          independent steward holding the project&apos;s name, domain and repositories. How
          decisions are made day to day is described on the{" "}
          <a href="/governance" className="text-accent hover:text-accent-hover underline underline-offset-2">
            governance
          </a>{" "}
          page.
        </P>
      </div>
    </PageLayout>
  );
}
