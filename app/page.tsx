import Hero from "@/components/Hero";
import CommandMarquee from "@/components/CommandMarquee";
import StatsSection from "@/components/StatsSection";
import FeatureCards from "@/components/FeatureCards";
import GraphSection from "@/components/GraphSection";
import ProgressSnapshot from "@/components/ProgressSnapshot";

export default function Home() {
  return (
    <>
      <Hero />
      <CommandMarquee />
      <StatsSection />
      <FeatureCards />
      <GraphSection />
      <ProgressSnapshot />
    </>
  );
}
