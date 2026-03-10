import HeroBanner from "@/components/HeroBanner";
import ProductShowcase from "@/components/ProductShowcase";
import VideoHero from "@/components/VideoHero";
import FeaturedCollections from "@/components/FeaturedCategories";
import WeddingGallery from "@/components/WeddingGallery";
import ReviewsSection from "@/components/ReviewsSection";
import FeaturesSection from "@/components/FeaturesSection";
import SectionReveal from "@/components/SectionReveal";
import CollectionSpotlight from "@/components/CollectionSpotlight";
import {
  getHeroSlides,
  getVideoHero,
  getCollections,
  getProducts,
} from "@/lib/contentful";

export const revalidate = 60;

export default async function Home() {
  // Fetch all CMS data in parallel (server-side)
  const [heroSlides, videoHeroData, collections, products] = await Promise.all([
    getHeroSlides(),
    getVideoHero(),
    getCollections(),
    getProducts(),
  ]);

  // Find the collection that should be spotlighted on homepage
  const spotlightCollection = collections.find((c) => c.showOnHomepage);

  return (
    <div className="min-h-screen bg-white font-sans">
      <HeroBanner slides={heroSlides} />

     

      <SectionReveal>
        <WeddingGallery
          collections={collections.filter((c) => (c as any).showInWeddingAlbum)}
        />
      </SectionReveal>
       {spotlightCollection && (
        <SectionReveal>
          <CollectionSpotlight collection={spotlightCollection} />
        </SectionReveal>
      )}
      <SectionReveal>
        <FeaturedCollections collections={collections} />
      </SectionReveal>
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
        <ReviewsSection />
      </SectionReveal>
    </div>
  );
}
