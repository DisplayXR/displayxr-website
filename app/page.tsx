import { Hero } from "@/components/home/Hero";
import { ProblemSection } from "@/components/home/ProblemSection";
import { SolutionSection } from "@/components/home/SolutionSection";
import { AudienceSection } from "@/components/home/AudienceSection";
import { EcosystemMap } from "@/components/home/EcosystemMap";
import { WhyNowSection } from "@/components/home/WhyNowSection";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <AudienceSection />
      <EcosystemMap />
      <WhyNowSection />
      <CTASection />
    </>
  );
}
