import HomeHero from "@/components/home/HomeHero";
import BrandsBar from "@/components/home/BrandsBar";
import ServiceRows from "@/components/home/ServiceRows";
import CoverageMap from "@/components/home/CoverageMap";
import History from "@/components/home/History";
import SocialProof from "@/components/home/SocialProof";
import FinalCta from "@/components/home/FinalCta";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <BrandsBar />
      <ServiceRows />
      <CoverageMap />
      <History />
      <SocialProof />
      <FinalCta />
    </>
  );
}
