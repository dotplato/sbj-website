import HeroBanner from "@/components/HeroBanner";
import ProductShowcase from "@/components/ProductShowcase";
import VideoHero from "@/components/VideoHero";
import FeaturedCategories from "@/components/FeaturedCategories";
import WeddingGallery from "@/components/WeddingGallery";
import ReviewsSection from "@/components/ReviewsSection";
import FeaturesSection from "@/components/FeaturesSection";
import SectionReveal from "@/components/SectionReveal";
import {
  getHeroSlides,
  getVideoHero,
  getCategories,
  getProducts,
  getWeddingGallery,
} from "@/lib/contentful";

export const revalidate = 60;

export default async function Home() {
  // Fetch all CMS data in parallel (server-side)
  const [heroSlides, videoHeroData, categories, products, galleryItems] =
    await Promise.all([
      getHeroSlides(),
      getVideoHero(),
      getCategories(),
      getProducts(),
      getWeddingGallery(),
    ]);

  return (
    <div className="min-h-screen bg-white">
      <HeroBanner slides={heroSlides} />
      <SectionReveal>
        <ProductShowcase products={products} />
      </SectionReveal>
      <SectionReveal>
        <VideoHero data={videoHeroData} />
      </SectionReveal>
      <SectionReveal>
        <FeaturesSection />
      </SectionReveal>
      <SectionReveal>
        <FeaturedCategories categories={categories} />
      </SectionReveal>
      <SectionReveal>
        <WeddingGallery items={galleryItems} />
      </SectionReveal>
      <SectionReveal>
        <ReviewsSection />
      </SectionReveal>
    </div>
  );
}
