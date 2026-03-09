"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FeaturesSection from "@/components/FeaturesSection";
import ProductShowcase from "@/components/ProductShowcase";
import { useCart } from "@/context/CartContext";
import SectionReveal from "@/components/SectionReveal";
import type { ProductData } from "@/lib/types";

// ─── Payment method icons (text-based badges) ──────────────────────────────
const paymentMethods = [
  "Amazon",
  "Amex",
  "Apple Pay",
  "Discover",
  "Facebook Pay",
  "Google Pay",
  "JCB",
  "Klarna",
  "Mastercard",
  "PayPal",
  "Shop",
  "Visa",
];

interface FullProduct extends ProductData {
  bullets: string[];
  options: string[];
  descriptionText: string;
}

interface ProductDetailClientProps {
  product: FullProduct;
  relatedProducts: ProductData[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  return (
    <main className="min-h-screen bg-white">
      {/* ── Breadcrumb ── */}
      <nav className="bg-white border-b border-gray-100 px-4 sm:px-8 lg:px-16 py-3">
        <ol className="flex items-center gap-1.5 text-xs tracking-widest uppercase max-w-7xl mx-auto">
          <li>
            <Link
              href="/"
              className="text-gray-500 hover:text-[#C6A15B] transition-colors"
            >
              Home
            </Link>
          </li>
          <li className="text-gray-300">›</li>
          <li>
            <Link
              href="/collections"
              className="text-gray-400 hover:text-[#C6A15B] transition-colors"
            >
              Collections
            </Link>
          </li>
          <li className="text-gray-300">›</li>
          <li>
            <Link
              href={`/collections?category=${encodeURIComponent(product.category)}`}
              className="text-gray-400 hover:text-[#C6A15B] transition-colors"
            >
              {product.category}
            </Link>
          </li>
          <li className="text-gray-300">›</li>
          <li className="text-gray-800 font-medium truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* ── Features Bar ── */}
      <SectionReveal>
        <FeaturesSection />
      </SectionReveal>

      {/* ── Product Detail ── */}
      <SectionReveal>
        <ProductDetail product={product} />
      </SectionReveal>

      {/* ══ YOU MAY ALSO LIKE ══ */}
      <SectionReveal>
        <div className="border-t border-gray-100 mt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-12 pb-4">
            <h2 className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-gray-700 mb-1">
              You May Also Like
            </h2>
            <div className="w-10 h-px bg-[#C6A15B] mx-auto mb-8" />
          </div>
          <ProductShowcase
            products={relatedProducts.length > 0 ? relatedProducts : undefined}
          />
        </div>
      </SectionReveal>
    </main>
  );
}

function ProductDetail({ product }: { product: FullProduct }) {
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedOption, setSelectedOption] = useState(product.options[0]);
  const { addItem } = useCart();

  // ── Sale-aware pricing ──────────────────────────────────────────────────
  const displayPrice =
    product.isOnSale && product.salePrice ? product.salePrice : product.price;
  const displayPriceNum =
    product.isOnSale && product.salePriceNum
      ? product.salePriceNum
      : product.priceNum;
  const crossedOutPrice = product.isOnSale
    ? product.originalPrice || product.price
    : undefined;

  const handleAddToCart = () => {
    addItem({
      id: `${product.slug}-${selectedOption}`,
      slug: product.slug,
      name: product.name,
      price: displayPrice,
      priceNum: displayPriceNum,
      option: selectedOption,
      image: product.images[0],
    });
  };

  return (
    <section className="bg-white py-10 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Thumbnails */}
          <div className="flex flex-row lg:flex-col gap-3 lg:w-[90px] shrink-0 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] pb-2 lg:pb-0 scrollbar-hide">
            {product.images.map((img: string, i: number) => (
              <button
                key={i}
                onMouseEnter={() => setActiveImg(i)}
                onClick={() => setActiveImg(i)}
                className={`relative shrink-0 w-[70px] h-[70px] lg:w-[80px] lg:h-[80px] border-2 transition-all duration-200 ${
                  activeImg === i
                    ? "border-[#C6A15B]"
                    : "border-gray-200 hover:border-[#C6A15B]"
                }`}
              >
                <Image
                  src={img}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Large Image */}
          <div className="relative flex-1 min-h-[400px] lg:min-h-[580px] bg-[#f8f8f8] overflow-hidden group">
            <Image
              src={product.images[activeImg]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
          </div>

          {/* Info Panel */}
          <div className="lg:w-[360px] shrink-0 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl md:text-5xl font-fancy text-gray-900 leading-snug">
                {product.name}
              </h1>
              {product.isOnSale && (
                <span className="bg-red-600 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 shadow-sm">
                  Sale
                </span>
              )}
            </div>

            {/* Sale-aware price display */}
            <div className="flex items-center gap-4">
              <p
                className={`text-2xl font-bold ${product.isOnSale ? "text-red-600" : "text-[#C6A15B]"}`}
              >
                {displayPrice}
              </p>
              {product.isOnSale &&
                crossedOutPrice &&
                crossedOutPrice !== displayPrice && (
                  <p className="text-lg text-gray-400 line-through">
                    {crossedOutPrice}
                  </p>
                )}
            </div>

            <ul className="space-y-1">
              {product.bullets.map((b: string, i: number) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <span className="mt-1 text-gray-400">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm text-gray-500 border-t border-gray-100 pt-3">
              <span className="text-gray-400">SKU:</span>{" "}
              <span className="text-gray-700">{product.sku}</span>
            </p>

            {/* Category link */}
            <p className="text-sm text-gray-500">
              <span className="text-gray-400">Category:</span>{" "}
              <Link
                href={`/collections?category=${encodeURIComponent(product.category)}`}
                className="text-[#C6A15B] hover:underline"
              >
                {product.category}
              </Link>
            </p>

            <div>
              <p className="text-xs font-semibold tracking-widest text-gray-700 uppercase mb-2">
                Options
              </p>
              <div className="flex flex-wrap gap-2">
                {product.options.map((opt: string) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedOption(opt)}
                    className={`px-4 py-2 text-sm border rounded-full transition-all ${
                      selectedOption === opt
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-medium">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-[#C6A15B] text-white text-sm font-semibold tracking-widest uppercase rounded-full hover:bg-[#b8966b] transition-colors"
              >
                Add to Cart
              </button>
            </div>

            <div className="flex flex-wrap gap-1 mt-1">
              {paymentMethods.map((pm) => (
                <span
                  key={pm}
                  className="px-2 py-1 text-[10px] border border-gray-100 rounded text-gray-400 bg-gray-50"
                >
                  {pm}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-16 bg-[#f9f9f9] py-12 px-4 sm:px-8 lg:px-16 lg:-mx-16">
          <div className="flex justify-center mb-10">
            <span className="px-8 py-2 border border-gray-400 rounded-full text-sm text-gray-700 font-medium">
              Description
            </span>
          </div>
          <div className="max-w-3xl mx-auto space-y-2">
            {product.descriptionText
              .split("\n")
              .map((line: string, i: number) => (
                <p key={i} className="text-sm text-[#5a7a9a] leading-relaxed">
                  {line || "\u00A0"}
                </p>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
