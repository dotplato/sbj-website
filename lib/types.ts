// ─── CMS Types ──────────────────────────────────────────────────────────────

export interface HeroSlide {
  id: string;
  video: string;
  subtitle: string;
  title: string;
  description: string;
}

export interface VideoHeroData {
  subtitle: string;
  title: string;
  description: string;
  video: string;
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  image: string;
  href: string;
  order: number;
}

export interface WeddingGalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  href: string;
  order: number;
}

export interface ProductData {
  id: string;
  slug: string;
  name: string;
  sku: string;
  price: string;
  priceNum: number;
  images: string[];
  category: string; // resolved category name (from category reference)
  categoryId?: string; // Contentful entry ID of the referenced category
  isOnSale: boolean; // CMS toggle — when true, sale UI shows
  salePrice?: string; // the discounted price text shown when on sale
  salePriceNum?: number; // numeric discounted price
  originalPrice?: string; // the original (crossed-out) price text
  description?: string; // single field for product description (covers specs + details)
  bullets?: string[];
  options?: string[];
}
