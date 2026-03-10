"use client";

import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import type { CollectionData } from "@/lib/types";

interface CollectionSpotlightProps {
  collection: CollectionData;
}

export default function CollectionSpotlight({
  collection,
}: CollectionSpotlightProps) {
  return (
    <section className="relative w-full bg-[#fdfcfb] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 lg:gap-24 py-16 md:py-24">
          {/* Content Column */}
          <div className="order-2 md:order-1 flex flex-col justify-center max-w-xl">
            <div className="mb-8">
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.4em] uppercase text-gray-500 mb-4 block animate-in fade-in slide-in-from-bottom-2 duration-700">
                Looking for the latest
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-gray-900 mb-6 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                {collection.name}
              </h2>
              <div className="w-12 h-[2px] bg-[#C6A15B] mb-8 animate-in fade-in scale-in-90 duration-700 delay-200" />
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
                {collection.homepageDescription ||
                  `Discover the exceptional artistry of our ${collection.name}. Each piece is meticulously crafted to capture moments of pure elegance and timeless beauty.`}
              </p>

              <Link
                href={collection.href}
                className="inline-flex items-center px-8 py-4 border-2 border-gray-900 text-sm font-bold tracking-widest uppercase hover:bg-gray-900 hover:text-white transition-all duration-300 group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500"
              >
                Shop Now
                <MoveRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Image Column */}
          <div className="order-1 md:order-2 relative aspect-[4/5] md:aspect-square overflow-hidden group shadow-2xl animate-in fade-in zoom-in-95 duration-1000">
            <Image
              src={collection.image}
              alt={collection.name}
              fill
              className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 border-[16px] border-white/10 pointer-events-none translate-x-4 translate-y-4 md:translate-x-8 md:translate-y-8" />
          </div>
        </div>
      </div>

      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 -z-10 w-1/3 h-full bg-[#f9f5f0] translate-x-1/2 -skew-x-12" />
    </section>
  );
}
