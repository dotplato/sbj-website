import { getProducts, getCategories } from "@/lib/contentful";
import {
  categories as staticCategories,
  categoryMetadata as staticCategoryMetadata,
} from "@/lib/data";
import CollectionsClient from "./CollectionsClient";

export const revalidate = 60;

export default async function CollectionsPage() {
  // Fetch from CMS — products AND categories
  const [cmsProducts, cmsCategories] = await Promise.all([
    getProducts(),
    getCategories(),
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
      : cmsCategories.length > 0
        ? cmsCategories.map((c) => c.name)
        : staticCategories;

  // ── Category metadata (image for hero) ────────────────────────────────────
  const categoryMeta: Record<string, { image?: string }> =
    cmsCategories.length > 0
      ? Object.fromEntries(
          cmsCategories.map((c) => [c.name, { image: c.image || undefined }]),
        )
      : Object.fromEntries(
          Object.entries(staticCategoryMetadata).map(([key, val]) => [
            key,
            { image: val.image },
          ]),
        );

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
