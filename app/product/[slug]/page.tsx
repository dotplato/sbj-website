import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/contentful";
import type { ProductData } from "@/lib/types";
import ProductDetailClient from "./ProductDetailClient";

export const revalidate = 60;

// ─── Fallback extended details (used when CMS doesn't provide them) ─────────
const defaultBullets = [
  "925 Sterling Silver",
  "Exchange: 50% of the current price",
  "Refund: 50% of the sale price",
  "Yellow & White Gold Electroplating",
  "Expert Craftmanship",
  "Premium Packaging",
];

const defaultOptions = ["Standard Set", "Full Set", "Custom"];

const defaultDescription = `Studded with Fine Zircons
925 Sterling Silver
Yellow Gold Electroplated

Saleem Butt Jewellers provides top-notch quality in all of its products. Prioritizing customer satisfaction and demands, we give the best after-sale service.
All our Silver Jewellery products are repairable, exchangeable, and refundable on an unlimited-time basis.
We provide,
Exchange: 50% value of the sale price.
Refund: 30% value of the sale price.

P.s: All products can be customized as per customer requirement`;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // CMS only — 404 if not found
  const product: ProductData | null = await getProductBySlug(slug);
  if (!product) notFound();

  // Merge defaults for fields the CMS might not have filled in yet
  const fullProduct = {
    ...product,
    bullets:
      product.bullets && product.bullets.length > 0
        ? product.bullets
        : defaultBullets,
    options:
      product.options && product.options.length > 0
        ? product.options
        : defaultOptions,
    // Pass through rich text document as-is, or fall back to plain string default
    descriptionText: product.description ?? defaultDescription,
  };

  // Related products from CMS (same category)
  let relatedProducts: ProductData[] = [];
  try {
    const allProducts = await getProducts();
    relatedProducts = allProducts
      .filter((p) => p.category === product!.category && p.slug !== slug)
      .slice(0, 10);
  } catch {
    // ignore
  }

  return (
    <ProductDetailClient
      product={fullProduct}
      relatedProducts={relatedProducts}
    />
  );
}
