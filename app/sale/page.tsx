"use client";

import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/data";
import FeaturesSection from "@/components/FeaturesSection";

// Single product type derived from data
type Product = (typeof products)[0];

export default function SalePage() {
  const saleProducts = products.filter((p: Product) => p.isOnSale);

  return (
    <main className="min-h-screen bg-white pt-14 sm:pt-16 lg:pt-[73px]">
      {/* Hero Section */}
      <section className="relative h-[35vh] bg-red-900 flex items-center justify-center text-center px-4">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/Gold-bracelet.jpg"
            alt="Sale Hero"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[var(--brand-gold)] mb-3">
            Limited Time Offers
          </p>
          <h1 className="text-4xl md:text-6xl font-fancy text-white mb-4 tracking-widest">
            Exclusive Sale
          </h1>
          <div className="w-16 h-px bg-[var(--brand-gold)] mx-auto" />
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-100 px-4 sm:px-8 lg:px-16 py-4">
        <ol className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase max-w-7xl mx-auto">
          <li>
            <Link
              href="/"
              className="text-gray-400 hover:text-[var(--brand-gold)] transition-colors"
            >
              Home
            </Link>
          </li>
          <li className="text-gray-200">›</li>
          <li className="text-gray-800 font-bold underline decoration-[var(--brand-gold)] underline-offset-4">
            Sale
          </li>
        </ol>
      </nav>

      <section className="py-16 px-4 sm:px-8 lg:px-16 container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {saleProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {saleProducts.length === 0 && (
          <div className="text-center py-20 bg-gray-50">
            <p className="text-gray-400 italic">
              Watch this space for our next exclusive sale.
            </p>
          </div>
        )}
      </section>

      <FeaturesSection />
    </main>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group">
      <div className="relative aspect-[4/5] bg-[#fcfcfc] overflow-hidden mb-4 border border-gray-50 flex items-center justify-center">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
        />

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-red-600 text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1 shadow-sm">
            Sale
          </span>
        </div>

        {/* Quick Add Overlay */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-full bg-white/95 backdrop-blur-sm text-gray-900 py-3 text-[10px] font-bold tracking-[0.2em] uppercase shadow-lg hover:bg-[var(--brand-gold)] hover:text-white transition-colors border-none text-center flex items-center justify-center cursor-pointer">
            View Details
          </div>
        </div>
      </div>

      <div className="text-center px-2">
        <p className="text-[9px] tracking-[0.25em] uppercase text-[var(--brand-gold)] mb-1.5 font-bold">
          {product.category}
        </p>
        <h3 className="text-xs font-medium text-gray-800 group-hover:text-[var(--brand-gold)] transition-colors mb-2 leading-relaxed tracking-wide px-4">
          {product.name}
        </h3>
        <div className="flex items-center justify-center gap-2">
          <p className="text-sm font-bold text-red-600">{product.price}</p>
          {product.originalPrice && (
            <p className="text-xs text-gray-400 line-through">
              {product.originalPrice}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
