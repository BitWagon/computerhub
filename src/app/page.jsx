import Hero from "@/components/home/Hero";
import CategorySection from "@/components/home/CategorySection";
import FlashDeals from "@/components/home/FlashDeals";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PopularBrands from "@/components/home/PopularBrands";
import Benefits from "@/components/home/Benefits";

export default function HomePage() {
  return (
    <>
      <Hero />

      <CategorySection />

      <FlashDeals />

      <FeaturedProducts />

      <PopularBrands />

      <Benefits />
    </>
  );
}