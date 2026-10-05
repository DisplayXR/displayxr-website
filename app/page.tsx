import { Hero } from "@/components/home/Hero";
import { WhySection } from "@/components/home/WhySection";
import { PathsSection } from "@/components/home/PathsSection";
import { BrowserTeaser } from "@/components/home/BrowserTeaser";
import { ProofSection } from "@/components/home/ProofSection";

// The homepage tells the DisplayXR project's story: what it is, why it
// exists, where each audience goes next, then one band for the browser (which
// has its own page and header tab) and the receipts. Depth lives on the hub
// pages and in the runtime repo.
export default function Home() {
  return (
    <>
      <Hero />
      <WhySection />
      <PathsSection />
      <BrowserTeaser />
      <ProofSection />
    </>
  );
}
