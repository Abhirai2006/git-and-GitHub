import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import FeatureCards from "@/components/FeatureCards";
import GraphSection from "@/components/GraphSection";
import ProgressSnapshot from "@/components/ProgressSnapshot";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsSection />
      <FeatureCards />
      <GraphSection />
      <ProgressSnapshot />
    </>
  );
}
