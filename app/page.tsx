import { Hero } from "@/components/home/Hero";
import { WebSection } from "@/components/home/WebSection";
import { WhySection } from "@/components/home/WhySection";
import { PathsSection } from "@/components/home/PathsSection";
import { ProofSection } from "@/components/home/ProofSection";

// Five sections, in the order a first-time visitor needs them: what it is,
// the easiest thing to try (the web), why it exists, where to go next, and
// the receipts. Depth lives on the hub pages and in the runtime repo.
export default function Home() {
  return (
    <>
      <Hero />
      <WebSection />
      <WhySection />
      <PathsSection />
      <ProofSection />
    </>
  );
}
