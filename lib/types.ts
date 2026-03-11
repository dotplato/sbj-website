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

export interface CollectionData {
  id: string;
  name: string;
  slug: string;
  image: string;
  href: string;
  order: number;
  line?: "diamond" | "gold" | "watches";
  audience?: string[]; // e.g. ["men","women"]
  showInWeddingAlbum?: boolean;
  /** When true, this collection is displayed as a spotlight section on the homepage */
  showOnHomepage?: boolean;
  /** Short marketing description shown under the collection name in the homepage spotlight */
  homepageDescription?: string;
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

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  /** Short teaser shown in cards */
  excerpt: string;
  /** Full rich-text body stored as plain text or markdown */
  body: string;
  /** Cover / featured image URL */
  coverImage: string;
  /** Author name */
  author: string;
  /** ISO date string */
  publishedAt: string;
  /** Optional category tag, e.g. "Jewellery Tips" */
  category?: string;
}
