import { getProducts, getCollections } from "@/lib/contentful";
import CollectionsClient from "./CollectionsClient";

export const revalidate = 60;

export default async function CollectionsPage() {
  // Fetch from CMS — products AND categories
  const [cmsProducts, cmsCollections] = await Promise.all([
    getProducts(),
    getCollections(),
  ]);

  // ── Category list: derive from products first (ensures exact match) ───────
  const productCategoryNames = Array.from(
    new Set(
      cmsProducts
        .map((p) => p.category?.trim())
        .filter((name): name is string => !!name && name.length > 0),
    ),
  );

  const categoryNames: string[] =
    productCategoryNames.length > 0
      ? productCategoryNames
      : cmsCollections.length > 0
        ? cmsCollections.map((c) => c.name)
        : [];

  // ── Category metadata (image for hero) ────────────────────────────────────
  const categoryMeta: Record<string, { image?: string }> =
    cmsCollections.length > 0
      ? Object.fromEntries(
          cmsCollections.map((c) => [c.name, { image: c.image || undefined }]),
        )
      : {};

  // ── Products: CMS only ────────────────────────────────────────────────────
  // Pass whatever the CMS returns. Empty = show nothing (not static fallback).
  return (
    <CollectionsClient
      products={cmsProducts}
      categoryNames={categoryNames}
      categoryMeta={categoryMeta}
    />
  );
}
