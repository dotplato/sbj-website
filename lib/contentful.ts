import { createClient, type Asset } from "contentful";
import type {
  HeroSlide,
  VideoHeroData,
  CollectionData,
  ProductData,
  BlogPost,
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
 * Fetch collections from Contentful.
 * Content type: `category` (CMS model name can be "Collection", ID stays `category`)
 *
 * Fields expected:
 *   - name (Short Text)
 *   - slug (Short Text)
 *   - image (Media — image)
 *   - order (Integer — display order)
 */
export async function getCollections(): Promise<CollectionData[]> {
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
        line: (f.line as any) || undefined,
        audience: Array.isArray(f.audience)
          ? (f.audience as string[])
          : undefined,
        showInWeddingAlbum: f.showInWeddingAlbum === true,
        showOnHomepage: f.showOnHomepage === true,
        homepageDescription:
          typeof f.homepageDescription === "string"
            ? f.homepageDescription
            : undefined,
      };
    });
  } catch (error) {
    console.error("Failed to fetch categories from Contentful:", error);
    return [];
  }
}

// ─── Product helpers ────────────────────────────────────────────────────────

type LinkedEntry = {
  sys: { id: string };
  fields?: Record<string, any>;
};

type EntryLookup = Map<string, LinkedEntry>;

/** Parse a single product entry into our ProductData shape */
function parseProduct(item: any, includes?: EntryLookup): ProductData {
  const f = item.fields as Record<string, any>;

  // ── Resolve category reference via includes ────────────────────────────
  let categoryName = "";
  let categoryId: string | undefined;

  const resolveCategoryById = (id?: string) => {
    if (!id || !includes)
      return { id: undefined as string | undefined, name: "" };
    const entry = includes.get(id);
    if (!entry || !entry.fields) return { id, name: "" };
    const ef = entry.fields;
    const nameField =
      ef.name ||
      ef.title ||
      (typeof ef.categoryName === "string" ? ef.categoryName : "");
    return { id, name: nameField || "" };
  };

  if (Array.isArray(f.category) && f.category.length > 0) {
    const first = f.category[0];
    const id = first?.sys?.id as string | undefined;
    const resolved = resolveCategoryById(id);
    categoryId = resolved.id;
    categoryName = resolved.name;
  } else if (f.category && typeof f.category === "object" && f.category.sys) {
    const id = f.category.sys.id as string | undefined;
    const resolved = resolveCategoryById(id);
    categoryId = resolved.id;
    categoryName = resolved.name;
  } else if (typeof f.category === "string") {
    categoryName = f.category;
  } else if (Array.isArray(f.categories) && f.categories.length > 0) {
    const first = f.categories[0];
    const id = first?.sys?.id as string | undefined;
    const resolved = resolveCategoryById(id);
    categoryId = resolved.id;
    categoryName = resolved.name;
  } else if (typeof f.categories === "string") {
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

  // ── Price & sale (numeric in CMS, formatted in UI) ────────────────────
  const isOnSale: boolean = f.isOnSale === true;
  const basePriceNum: number =
    typeof f.priceNumber === "number"
      ? f.priceNumber
      : typeof f.priceNum === "number"
        ? f.priceNum
        : 0;
  const salePriceNum: number | undefined =
    isOnSale && typeof f.salePriceNum === "number" ? f.salePriceNum : undefined;

  const formatPrice = (n: number) =>
    "Rs. " + n.toLocaleString("en-PK", { maximumFractionDigits: 0 });

  return {
    id: item.sys.id,
    slug: f.slug || "",
    name: f.name || "",
    sku: f.sku || "",
    // Single numeric source of truth; display string is derived
    price: formatPrice(basePriceNum),
    priceNum: basePriceNum,
    images: assetUrls(f.images),
    category: categoryName,
    categoryId,
    isOnSale,
    salePrice: salePriceNum ? formatPrice(salePriceNum) : undefined,
    salePriceNum: salePriceNum,
    originalPrice: isOnSale
      ? f.originalPrice || formatPrice(basePriceNum)
      : undefined,
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
    const includes: EntryLookup = new Map();
    const includedEntries = (entries as any).includes?.Entry as
      | LinkedEntry[]
      | undefined;
    if (includedEntries) {
      for (const e of includedEntries) {
        if (e?.sys?.id) {
          includes.set(e.sys.id, e);
        }
      }
    }

    return entries.items.map((item) => parseProduct(item, includes));
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
    const includes: EntryLookup = new Map();
    const includedEntries = (entries as any).includes?.Entry as
      | LinkedEntry[]
      | undefined;
    if (includedEntries) {
      for (const e of includedEntries) {
        if (e?.sys?.id) {
          includes.set(e.sys.id, e);
        }
      }
    }

    return parseProduct(entries.items[0], includes);
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

// Note: old `weddingGallery` content type is no longer used.

// ─── Blog Fetchers ───────────────────────────────────────────────────────────

/**
 * Fetch blog posts from Contentful.
 * Content type: `blogPost`
 *
 * Fields expected in Contentful:
 *   - title        (Short Text)
 *   - slug         (Short Text — URL-safe, unique)
 *   - excerpt      (Long Text — 1-2 sentence teaser)
 *   - body         (Long Text — full article content, markdown supported)
 *   - coverImage   (Media — image)
 *   - author       (Short Text — author display name)
 *   - publishedAt  (Date — ISO date)
 *   - category     (Short Text — optional tag, e.g. "Jewellery Tips")
 */
export async function getBlogs(): Promise<BlogPost[]> {
  try {
    const entries = await client.getEntries({
      content_type: "blogPost",
      order: ["-fields.publishedAt"] as any,
      include: 2,
      limit: 100,
    });

    return entries.items.map((item) => {
      const f = item.fields as Record<string, any>;
      return {
        id: item.sys.id,
        slug: f.slug || item.sys.id,
        title: f.title || "",
        excerpt: f.excerpt || "",
        body: f.body || "",
        coverImage: assetUrl(f.coverImage),
        author: f.author || "SBJ Team",
        publishedAt: f.publishedAt || item.sys.createdAt,
        category: f.category || undefined,
      };
    });
  } catch (error) {
    console.error("Failed to fetch blog posts from Contentful:", error);
    return [];
  }
}

/**
 * Fetch a single blog post by its slug.
 */
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const entries = await client.getEntries({
      content_type: "blogPost",
      "fields.slug": slug,
      include: 2,
      limit: 1,
    } as any);

    if (entries.items.length === 0) return null;

    const item = entries.items[0];
    const f = item.fields as Record<string, any>;
    return {
      id: item.sys.id,
      slug: f.slug || item.sys.id,
      title: f.title || "",
      excerpt: f.excerpt || "",
      body: f.body || "",
      coverImage: assetUrl(f.coverImage),
      author: f.author || "SBJ Team",
      publishedAt: f.publishedAt || item.sys.createdAt,
      category: f.category || undefined,
    };
  } catch (error) {
    console.error("Failed to fetch blog post from Contentful:", error);
    return null;
  }
}
