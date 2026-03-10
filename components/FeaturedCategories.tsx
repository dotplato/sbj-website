"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import type { CollectionData } from "@/lib/types";

interface FeaturedCollectionsProps {
  collections?: CollectionData[];
}

export default function FeaturedCollections({
  collections,
}: FeaturedCollectionsProps) {
  const items = collections && collections.length > 0 ? collections : [];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C6A15B] mb-2">
            Browse By Collection
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Featured Collections
          </h2>
          <div className="w-10 h-px bg-[#C6A15B] mx-auto" />
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 text-gray-400 italic text-sm">
            Collections coming soon. Add collection entries in Contentful.
          </div>
        ) : (
          <>

            {/* Top row: 3 collections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-6 lg:mb-8">
          {items.slice(0, 3).map((category) => (
            <Link key={category.id} href={category.href}>
              <Card className="relative group overflow-hidden rounded-none border-0 cursor-pointer h-[400px] shadow-none">
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <h3 className="text-2xl font-bold text-white uppercase tracking-widest drop-shadow-lg mb-4">
                    {category.name}
                  </h3>
                  <div className="w-8 h-px bg-white group-hover:w-16 transition-all duration-500 mb-4" />
                  <span className="text-[10px] text-white/0 group-hover:text-white/100 uppercase tracking-[0.3em] transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    Discover More
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Bottom row: remaining collections (wider) */}
        {items.length > 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {items.slice(3, 5).map((category) => (
              <Link key={category.id} href={category.href}>
                <Card className="relative group overflow-hidden rounded-none border-0 cursor-pointer h-[320px] shadow-none">
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                  </div>

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <h3 className="text-2xl font-bold text-white uppercase tracking-widest drop-shadow-lg mb-4">
                      {category.name}
                    </h3>
                    <div className="w-8 h-px bg-white group-hover:w-16 transition-all duration-500 mb-4" />
                    <span className="text-[10px] text-white/0 group-hover:text-white/100 uppercase tracking-[0.3em] transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                      Discover More
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
          </>
        )}
      </div>
    </section>
  );
}
