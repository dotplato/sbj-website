import { createClient, type Asset } from "contentful";
import type {
  HeroSlide,
  VideoHeroData,
  CategoryData,
  ProductData,
  WeddingGalleryItem,
} from "./types";

// ─── Client ─────────────────────────────────────────────────────────────────

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Safely extract url from a Contentful Asset */
function assetUrl(asset: unknown): string {
  if (!asset) return "";
  const a = asset as Asset;
  const url = a?.fields?.file?.url;
  if (typeof url === "string")
    return url.startsWith("//") ? `https:${url}` : url;
  return "";
}

/** Safely extract urls from an array of Assets */
function assetUrls(assets: unknown): string[] {
  if (!Array.isArray(assets)) return [];
  return assets.map(assetUrl).filter(Boolean);
}

// ─── Fetchers ───────────────────────────────────────────────────────────────

/**
 * Fetch hero slides from Contentful.
 * Content type: `heroSlide`
 *
 * Fields expected in Contentful:
 *   - title (Short Text)
 *   - subtitle (Short Text)
 *   - description (Long Text)
 *   - video (Media — video file)
 *   - order (Integer — controls slide order)
 */
export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const entries = await client.getEntries({
      content_type: "heroSlide",
      order: ["fields.order"] as any,
      include: 2,
    });

    return entries.items.map((item) => {
      const f = item.fields as Record<string, any>;
      return {
        id: item.sys.id,
        video: assetUrl(f.video),
        subtitle: f.subtitle || "",
        title: f.title || "",
        description: f.description || "",
      };
    });
  } catch (error) {
    console.error("Failed to fetch hero slides from Contentful:", error);
    return [];
  }
}

/**
 * Fetch video hero section data from Contentful.
 * Content type: `videoHero`
 *
 * Fields expected:
 *   - subtitle (Short Text)
 *   - title (Short Text)
 *   - description (Long Text)
 *   - buttonText (Short Text)
 *   - buttonLink (Short Text)
 *   - video (Media — video file)
 */
export async function getVideoHero(): Promise<VideoHeroData | null> {
  try {
    const entries = await client.getEntries({
      content_type: "videoHero",
      limit: 1,
      include: 2,
    });

    if (entries.items.length === 0) return null;

    const f = entries.items[0].fields as Record<string, any>;
    return {
      subtitle: f.subtitle || "",
      title: f.title || "",
      description: f.description || "",
      video: assetUrl(f.video),
    };
  } catch (error) {
    console.error("Failed to fetch video hero from Contentful:", error);
    return null;
  }
}

/**
 * Fetch categories from Contentful.
 * Content type: `category`
 *
 * Fields expected:
 *   - name (Short Text)
 *   - slug (Short Text)
 *   - image (Media — image)
 *   - order (Integer — display order)
 */
export async function getCategories(): Promise<CategoryData[]> {
  try {
    const entries = await client.getEntries({
      content_type: "category",
      order: ["fields.order"] as any,
      include: 2,
    });

    return entries.items.map((item) => {
      const f = item.fields as Record<string, any>;
      const name = f.name || "";
      const slug = f.slug || name;
      return {
        id: item.sys.id,
        name,
        slug,
        image: assetUrl(f.image),
        href: `/collections?category=${encodeURIComponent(name)}`,
        order: f.order || 0,
      };
    });
  } catch (error) {
    console.error("Failed to fetch categories from Contentful:", error);
    return [];
  }
}

// ─── Product helpers ────────────────────────────────────────────────────────

/** Parse a single product entry into our ProductData shape */
function parseProduct(item: any): ProductData {
  const f = item.fields as Record<string, any>;

  // ── Resolve category reference ────────────────────────────────────────
  // Primary: `category` field as a single Reference → `category` entry.
  // Fallbacks:
  //   - `category` as a plain string
  //   - `categories` as an array of References or strings
  // This makes the site resilient to slight differences in the CMS model.
  let categoryName = "";
  let categoryId: string | undefined;

  const extractCategoryFromRef = (ref: any) => {
    if (ref && typeof ref === "object" && ref.sys) {
      return {
        id: ref.sys.id as string | undefined,
        name: ref.fields?.name || "",
      };
    }
    if (typeof ref === "string") {
      return {
        id: undefined,
        name: ref,
      };
    }
    return { id: undefined, name: "" };
  };

  if (f.category) {
    // Single reference or string
    const extracted = extractCategoryFromRef(f.category);
    categoryId = extracted.id;
    categoryName = extracted.name;
  } else if (Array.isArray(f.categories) && f.categories.length > 0) {
    // Multi-reference / multi-select field — take the first for now
    const extracted = extractCategoryFromRef(f.categories[0]);
    categoryId = extracted.id;
    categoryName = extracted.name;
  } else if (typeof f.categories === "string") {
    // Plain string in `categories`
    categoryName = f.categories;
  }

  // Extra defensive fallbacks for common alternative field IDs
  if (!categoryName) {
    if (typeof (f as any).categoryName === "string") {
      categoryName = (f as any).categoryName;
    } else if (typeof (f as any).productCategory === "string") {
      categoryName = (f as any).productCategory;
    } else if (typeof (f as any).product_type === "string") {
      categoryName = (f as any).product_type;
    }
  }

  // ── Sale logic (CMS-controlled) ───────────────────────────────────────
  // `isOnSale`      — Boolean toggle in CMS
  // `salePrice`     — the reduced price shown when on sale (Short Text)
  // `salePriceNum`  — numeric reduced price (Number)
  // `originalPrice` — the crossed-out original price (Short Text)
  //
  // When isOnSale is OFF, we just show `price` / `priceNum` normally.
  // When isOnSale is ON, the UI shows:
  //     salePrice (red)  +  originalPrice (line-through)
  const isOnSale: boolean = f.isOnSale === true;

  return {
    id: item.sys.id,
    slug: f.slug || "",
    name: f.name || "",
    sku: f.sku || "",
    price: f.price || "",
    priceNum: f.priceNum || 0,
    images: assetUrls(f.images),
    category: categoryName,
    categoryId,
    isOnSale,
    salePrice: isOnSale ? f.salePrice || undefined : undefined,
    salePriceNum: isOnSale ? f.salePriceNum || undefined : undefined,
    originalPrice: isOnSale ? f.originalPrice || undefined : undefined,
    description: f.description || undefined,
    bullets: f.bullets || undefined,
    options: f.options || undefined,
  };
}

/**
 * Fetch all products from Contentful.
 * Content type: `product`
 *
 * Fields expected:
 *   - name (Short Text)
 *   - slug (Short Text)
 *   - sku (Short Text)
 *   - price (Short Text — the main display price)
 *   - priceNum (Number — numeric value of main price)
 *   - images (Media, many files)
 *   - category (Reference → `category` entry)
 *   - isOnSale (Boolean — CMS toggle)
 *   - salePrice (Short Text — reduced price text, shown only when isOnSale)
 *   - salePriceNum (Number — numeric reduced price)
 *   - originalPrice (Short Text — crossed-out price, shown only when isOnSale)
 *   - description (Long Text — product description & specifications combined)
 *   - bullets (Short Text, list)
 *   - options (Short Text, list)
 */
export async function getProducts(): Promise<ProductData[]> {
  try {
    const entries = await client.getEntries({
      content_type: "product",
      include: 2,
      limit: 1000,
    });

    return entries.items.map(parseProduct);
  } catch (error) {
    console.error("Failed to fetch products from Contentful:", error);
    return [];
  }
}

/**
 * Fetch a single product by its slug.
 */
export async function getProductBySlug(
  slug: string,
): Promise<ProductData | null> {
  try {
    const entries = await client.getEntries({
      content_type: "product",
      "fields.slug": slug,
      include: 2,
      limit: 1,
    } as any);

    if (entries.items.length === 0) return null;
    return parseProduct(entries.items[0]);
  } catch (error) {
    console.error("Failed to fetch product from Contentful:", error);
    return null;
  }
}

/**
 * Fetch products filtered by category name.
 */
export async function getProductsByCategory(
  categoryName: string,
): Promise<ProductData[]> {
  try {
    const all = await getProducts();
    return all.filter(
      (p) => p.category.toLowerCase() === categoryName.toLowerCase(),
    );
  } catch (error) {
    console.error("Failed to fetch products by category:", error);
    return [];
  }
}

/**
 * Fetch wedding gallery items from Contentful.
 * Content type: `weddingGallery`
 *
 * Fields expected:
 *   - title    (Short Text)
 *   - category (Reference → `category` entry)  ← same as product
 *   - image    (Media — single image)
 *   - order    (Integer — display order 1–8)
 *
 * Note: `href` is auto-generated from the resolved category name.
 * No separate href field needed in Contentful.
 */
export async function getWeddingGallery(): Promise<WeddingGalleryItem[]> {
  try {
    const entries = await client.getEntries({
      content_type: "weddingGallery",
      order: ["fields.order"] as any,
      include: 2, // ensures the category reference is resolved
    });

    return entries.items.map((item) => {
      const f = item.fields as Record<string, any>;

      // ── Resolve category Reference (same pattern as products) ──────────
      let categoryName = "";
      if (f.category && typeof f.category === "object" && f.category.sys) {
        // Resolved reference — pull the name from the linked category entry
        categoryName = f.category.fields?.name || "";
      } else if (typeof f.category === "string") {
        // Fallback: plain string (shouldn't happen with a Reference field)
        categoryName = f.category;
      }

      // Auto-generate href from the category name
      const href = categoryName
        ? `/collections?category=${encodeURIComponent(categoryName)}`
        : "/collections";

      return {
        id: item.sys.id,
        title: f.title || "",
        category: categoryName,
        image: assetUrl(f.image),
        href,
        order: f.order || 0,
      };
    });
  } catch (error) {
    console.error("Failed to fetch wedding gallery from Contentful:", error);
    return [];
  }
}
