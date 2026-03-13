"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import FeaturesSection from "@/components/FeaturesSection";
import ProductShowcase from "@/components/ProductShowcase";
import { useCart } from "@/context/CartContext";
import SectionReveal from "@/components/SectionReveal";
import type { ProductData } from "@/lib/types";
import RichTextRenderer from "@/components/RichTextRenderer";
import type { Document as RichTextDocument } from "@contentful/rich-text-types";
import { Button } from "@/components/ui/button";

// ─── Custom cursors ────────────────────────────────────────────────────────
// Magnifying glass with + (matches the zoom-in UI icon) — 22px
const ZOOM_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 36 36'%3E%3Ccircle cx='14' cy='14' r='11' fill='white' stroke='black' stroke-width='3'/%3E%3Crect x='12' y='7' width='4' height='14' rx='1.5' fill='black'/%3E%3Crect x='7' y='12' width='14' height='4' rx='1.5' fill='black'/%3E%3Cline x1='22.5' y1='22.5' x2='33' y2='33' stroke='black' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E") 9 9, zoom-in`;
// Same cursor while panning
const PAN_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 36 36'%3E%3Ccircle cx='14' cy='14' r='11' fill='white' stroke='black' stroke-width='3'/%3E%3Crect x='12' y='7' width='4' height='14' rx='1.5' fill='black'/%3E%3Crect x='7' y='12' width='14' height='4' rx='1.5' fill='black'/%3E%3Cline x1='22.5' y1='22.5' x2='33' y2='33' stroke='black' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E") 9 9, crosshair`;

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
  descriptionText: string | RichTextDocument;
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

  // ── Pan-zoom state ──────────────────────────────────────────────────────
  const [isZoomed, setIsZoomed] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("50% 50%");
  const imgContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = imgContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setTransformOrigin(`${x}% ${y}%`);
  };

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

  const whatsappNumber = "923001234567"; // replace with actual WhatsApp number

  const handleAddToCart = () => {
    addItem({
      id: `${product.slug}-${selectedOption}`,
      slug: product.slug,
      name: product.name,
      price: displayPrice,
      priceNum: displayPriceNum,
      option: selectedOption,
      image: product.images[0],
      qty,
    });
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi! I'm interested in ordering:\n\n*${product.name}*\nOption: ${selectedOption}\nQty: ${qty}\nPrice: ${displayPrice}\n\nPlease confirm availability.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, "_blank");
  };

  return (
    <section className="bg-white py-10 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Thumbnails */}
          <div className="flex flex-row lg:flex-col gap-3 lg:w-[90px] shrink-0 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] pb-2 lg:pb-0 scrollbar-hide">
            {product.images.map((img: string, i: number) => (
              <Button
                key={i}
                variant="outline"
                onMouseEnter={() => setActiveImg(i)}
                onClick={() => setActiveImg(i)}
                className={`relative shrink-0 w-[70px] h-[70px] lg:w-[80px] lg:h-[80px] border-2 transition-all duration-200 p-0 overflow-hidden ${
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
              </Button>
            ))}
          </div>

          {/* Large Image — pan-zoom on hover */}
          <div
            ref={imgContainerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => { setIsZoomed(false); setTransformOrigin("50% 50%"); }}
            className="relative flex-1 min-h-[400px] lg:min-h-[580px] bg-[#f8f8f8] overflow-hidden"
            style={{ cursor: isZoomed ? PAN_CURSOR : ZOOM_CURSOR }}
          >
            <div
              className="absolute inset-0"
              style={{
                transformOrigin,
                transform: isZoomed ? "scale(2.2)" : "scale(1)",
                transition: isZoomed
                  ? "transform 0.08s ease-out"
                  : "transform 0.35s ease-out",
                willChange: "transform",
              }}
            >
              <Image
                src={product.images[activeImg]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Subtle corner hint — fades out once hovered */}
            {!isZoomed && (
              <div className="absolute bottom-3 right-3 bg-black/40 text-white text-[10px] px-2 py-1 rounded-full tracking-widest uppercase pointer-events-none select-none">
                Hover to zoom
              </div>
            )}
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
                  <Button
                    key={opt}
                    variant={selectedOption === opt ? "default" : "outline"}
                    onClick={() => setSelectedOption(opt)}
                    className={`px-4 py-2 text-sm rounded-full transition-all h-auto ${
                      selectedOption === opt
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              {/* Qty stepper */}
              <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                <Button
                  variant="ghost"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-none p-0"
                >
                  −
                </Button>
                <span className="w-10 text-center text-sm font-medium">
                  {qty}
                </span>
                <Button
                  variant="ghost"
                  onClick={() => setQty(qty + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-none p-0"
                >
                  +
                </Button>
              </div>

              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-[#C6A15B] text-white text-sm font-semibold tracking-widest uppercase rounded-full hover:bg-[#b8966b] transition-colors h-auto"
              >
                Add to Cart
              </Button>

              {/* WhatsApp */}
              <Button
                onClick={handleWhatsApp}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#25D366] hover:bg-[#1ebe5d] transition-colors p-0 shrink-0 shadow-md"
                title="Order via WhatsApp"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-6 h-6"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </Button>
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
          <RichTextRenderer
            content={product.descriptionText}
            variant="product"
          />
        </div>
      </div>
    </section>
  );
}
