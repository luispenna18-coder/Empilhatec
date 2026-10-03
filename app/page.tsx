import Hero from "@/components/Hero";
import BrandsStrip from "@/components/BrandsStrip";
import ProductsCatalog from "@/components/ProductsCatalog";
import PartsSection from "@/components/PartsSection";
import AreaMap from "@/components/AreaMap";
import AboutSection from "@/components/AboutSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandsStrip />
      <ProductsCatalog />
      <PartsSection />
      <AreaMap />
      <AboutSection />
    </>
  );
}
