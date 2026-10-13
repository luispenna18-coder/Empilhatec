import HomeHero from "@/components/home/HomeHero";
import DealerStill from "@/components/home/DealerStill";
import ServiceRows from "@/components/home/ServiceRows";
import CoverageMap from "@/components/home/CoverageMap";
import History from "@/components/home/History";
import SocialProof from "@/components/home/SocialProof";
import FinalCta from "@/components/home/FinalCta";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <DealerStill />
      <ServiceRows />
      <CoverageMap />
      <History />
      <SocialProof />
      <FinalCta />
    </>
  );
}
