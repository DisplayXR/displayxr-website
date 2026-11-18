import { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for the DisplayXR hosted connector and page checker.",
};

const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="mb-3 mt-12 text-xl font-semibold text-text-primary first:mt-0">{children}</h2>
);
const P = ({ children }: { children: ReactNode }) => (
  <p className="mb-4 text-text-secondary leading-relaxed">{children}</p>
);
const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} className="text-accent hover:text-accent-hover underline underline-offset-2">
    {children}
  </a>
);

// Terms for the hosted MCP connector (mcp.displayxr.org), requested by the
// connector session for the Claude and OpenAI directory submissions. The
// operating entity is named as "the DisplayXR project", matching /privacy.
export default function TermsPage() {
  return (
    <PageLayout
      title="Terms"
      description="Terms for the DisplayXR connector for Claude and ChatGPT, and its hosted page checker."
    >
      <div className="max-w-3xl">
        <H2>The service</H2>
        <P>
          The DisplayXR project runs a connector for Claude and ChatGPT at mcp.displayxr.org, with a
          hosted checker that tests 3D web pages. Both are free and provided as is, with no warranty
          and no promise of availability.
        </P>
        <P>
          Check results come from a simulated 3D browser. They show whether a page follows the
          DisplayXR authoring rules; they do not guarantee how the page looks on a real 3D display.
        </P>

        <H2>Fair use</H2>
        <P>
          Rate limits and daily limits apply, and we may refuse or stop the service at any time. Do not
          use the checker to probe or attack websites you do not control, to reach non-public
          addresses, or to send unlawful content.
        </P>

        <H2>Your content</H2>
        <P>
          You remain responsible for the pages, files and links you submit, and you must have the right
          to submit them.
        </P>

        <H2>Privacy and contact</H2>
        <P>
          What the connector receives and keeps is described on the <A href="/privacy#hosted-checker">privacy</A>{" "}
          page. For questions, open an issue on the{" "}
          <A href="https://github.com/DisplayXR/displayxr-web/issues">displayxr-web repository</A>.
        </P>
      </div>
    </PageLayout>
  );
}
