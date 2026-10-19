import HomeHero from "@/components/home/HomeHero";
import DealerStill from "@/components/home/DealerStill";
import ServiceCards from "@/components/home/ServiceCards";
import MachineShowcase from "@/components/home/MachineShowcase";
import CoverageMap from "@/components/home/CoverageMap";
import History from "@/components/home/History";
import FinalCta from "@/components/home/FinalCta";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <DealerStill />
      <ServiceCards />
      <MachineShowcase />
      <CoverageMap />
      <History />
      <FinalCta />
    </>
  );
}
