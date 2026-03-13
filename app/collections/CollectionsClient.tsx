"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import FeaturesSection from "@/components/FeaturesSection";
import SectionReveal from "@/components/SectionReveal";
import type { ProductData } from "@/lib/types";

interface CollectionsClientProps {
  products: ProductData[];
  categoryNames: string[];
  categoryMeta: Record<string, { image?: string }>;
}

function CollectionsContent({
  products,
  categoryNames,
  categoryMeta,
}: CollectionsClientProps) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
  const searchQuery = searchParams.get("search")?.toLowerCase();

  const metadata =
    activeCategory && categoryMeta[activeCategory]
      ? categoryMeta[activeCategory]
      : categoryMeta["default"] || {};

  const normalizedActive = activeCategory?.trim().toLowerCase();

  // 🔹 safer filtering
  let filteredProducts = normalizedActive
    ? products.filter((p) =>
        (p.category || "")
          .trim()
          .toLowerCase()
          .includes(normalizedActive),
      )
    : products;

  if (searchQuery) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name?.toLowerCase().includes(searchQuery) ||
        p.category?.toLowerCase().includes(searchQuery),
    );
  }

  const heroSubtitle = searchQuery
    ? `Search Results for "${searchQuery}"`
    : activeCategory || "Our Heritage";

  const heroTitle = searchQuery
    ? `${filteredProducts.length} Items Found`
    : activeCategory
      ? activeCategory
      : "Exquisite Collections";

  return (
    <main className="min-h-screen bg-white pt-14 sm:pt-16 lg:pt-[73px]">
      {/* Hero Section */}
      <section
        className="relative h-[35vh] flex items-center justify-center text-center px-4 transition-colors duration-500"
        style={{ backgroundColor: "#111827" }}
      >
        {metadata.image && (
          <div className="absolute inset-0 opacity-40">
            <Image
              src={metadata.image}
              alt={activeCategory || "Collections"}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="relative z-10">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#C6A15B] mb-3">
            {heroSubtitle}
          </p>
          <h1 className="text-4xl md:text-6xl font-fancy text-white mb-4 tracking-widest">
            {heroTitle}
          </h1>
          <div className="w-16 h-px bg-[#C6A15B] mx-auto" />
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-100 px-4 sm:px-8 lg:px-16 py-4">
        <ol className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase max-w-7xl mx-auto">
          <li>
            <Link
              href="/"
              className="text-gray-400 hover:text-[#C6A15B] transition-colors"
            >
              Home
            </Link>
          </li>

          <li className="text-gray-200">›</li>

          <li>
            <Link
              href="/collections"
              className="text-gray-400 hover:text-[#C6A15B] transition-colors"
            >
              Collections
            </Link>
          </li>

          {activeCategory && (
            <>
              <li className="text-gray-200">›</li>
              <li className="text-gray-800 font-bold">{activeCategory}</li>
            </>
          )}
        </ol>
      </nav>

      {/* Category Pills */}
      <div className="bg-gray-50 py-4 overflow-x-auto whitespace-nowrap px-4 sm:px-8 lg:px-16 border-b border-gray-100 scrollbar-hide">
        <div className="max-w-7xl mx-auto flex gap-4">
          <Link
            href="/collections"
            className={`px-6 py-2 text-[10px] tracking-widest uppercase rounded-full border transition-all ${
              !activeCategory
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-500 border-gray-200 hover:border-[#C6A15B]"
            }`}
          >
            All
          </Link>

          {categoryNames.map((cat) => (
            <Link
              key={cat}
              href={`/collections?category=${encodeURIComponent(cat)}`}
              className={`px-6 py-2 text-[10px] tracking-widest uppercase rounded-full border transition-all ${
                activeCategory === cat
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-500 border-gray-200 hover:border-[#C6A15B]"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      <SectionReveal>
        <section className="py-16 px-4 sm:px-8 lg:px-16 container mx-auto max-w-7xl">
          {activeCategory || searchQuery ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-20 bg-gray-50">
                  <p className="text-gray-400 italic">
                    {searchQuery
                      ? `No products found matching "${searchQuery}".`
                      : "No products found in this category yet."}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-24">
              {categoryNames.map((cat) => {
                const catProducts = products.filter((p) =>
                  (p.category || "")
                    .trim()
                    .toLowerCase()
                    .includes(cat.trim().toLowerCase()),
                );

                if (catProducts.length === 0) return null;

                return (
                  <div key={cat} className="space-y-10">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest">
                        {cat}
                      </h2>

                      <Link
                        href={`/collections?category=${encodeURIComponent(cat)}`}
                        className="text-xs font-semibold text-[#C6A15B] hover:underline underline-offset-4 tracking-widest uppercase"
                      >
                        Browse All
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                      {catProducts.slice(0, 4).map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </SectionReveal>

      <SectionReveal>
        <FeaturesSection />
      </SectionReveal>
    </main>
  );
}

function ProductCard({ product }: { product: ProductData }) {
  const displayPrice =
    product.isOnSale && product.salePrice ? product.salePrice : product.price;

  const crossedOutPrice = product.isOnSale
    ? product.originalPrice || product.price
    : undefined;

  // 🔹 slug fallback
  const safeSlug =
    product.slug ||
    product.name
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  return (
    <Link href={`/product/${safeSlug}`} className="group">
      <div className="relative aspect-[4/5] bg-[#fcfcfc] overflow-hidden mb-4 border border-gray-50 flex items-center justify-center">
        {product.images?.[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          />
        )}

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isOnSale ? (
            <span className="bg-red-600 text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1 shadow-sm">
              Sale
            </span>
          ) : (
            <span className="bg-gray-900 text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1">
              New
            </span>
          )}
        </div>

        {/* Hover overlay — "View Details" button */}
        <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-400 bg-black/10">
          <span className="bg-[#C6A15B] text-white text-[10px] font-bold tracking-[0.2em] uppercase px-6 py-2.5 translate-y-3 group-hover:translate-y-0 transition-transform duration-400 shadow-lg">
            View Details
          </span>
        </div>
      </div>

      <div className="text-center px-2">
        <p className="text-[9px] tracking-[0.25em] uppercase text-[#C6A15B] mb-1.5 font-bold">
          {product.category}
        </p>

        <h3 className="text-xs font-medium text-gray-800 group-hover:text-[#C6A15B] transition-colors mb-2 leading-relaxed tracking-wide px-4">
          {product.name}
        </h3>

        <div className="flex items-center justify-center gap-2">
          <p
            className={`text-sm font-bold ${
              product.isOnSale ? "text-red-600" : "text-gray-900"
            }`}
          >
            {displayPrice}
          </p>

          {product.isOnSale &&
            crossedOutPrice &&
            crossedOutPrice !== displayPrice && (
              <p className="text-xs text-gray-400 line-through">
                {crossedOutPrice}
              </p>
            )}
        </div>
      </div>
    </Link>
  );
}

export default function CollectionsClient(props: CollectionsClientProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading collections...
        </div>
      }
    >
      <CollectionsContent {...props} />
    </Suspense>
  );
}