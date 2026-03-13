"use client";

import Image from "next/image";
import Link from "next/link";
import type { CollectionData } from "@/lib/types";

interface WeddingGalleryProps {
  collections?: CollectionData[];
}

export default function WeddingGallery({ collections }: WeddingGalleryProps) {
  const hasItems = collections && collections.length > 0;

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--brand-gold)] mb-2">
            The Journey of Elegance
          </p>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Wedding Album
          </h2>
          <div className="w-16 h-px bg-[var(--brand-gold)] mx-auto" />
        </div>

        {hasItems ? (
          <GalleryGrid collections={collections!} />
        ) : (
          // Empty state — shown when no CMS entries exist yet
          <div className="text-center py-20 text-gray-400 italic text-sm">
            Wedding album coming soon. Mark collections in Contentful with{" "}
            <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
              showInWeddingAlbum = true
            </span>
            .
          </div>
        )}
      </div>
    </section>
  );
}

/** Masonry-style 4-column grid — adapts to any number of items */
function GalleryGrid({ collections }: { collections: CollectionData[] }) {
  // Distribute items across 4 columns top-to-bottom
  const columns: CollectionData[][] = [[], [], [], []];
  collections.forEach((item, i) => columns[i % 4].push(item));

  // Alternating aspect ratios per column for visual rhythm
  const aspectPatterns = [
    ["aspect-[3/4]", "aspect-square"],
    ["aspect-square", "aspect-[3/4]"],
    ["aspect-[3/4]", "aspect-square"],
    ["aspect-square", "aspect-[3/4]"],
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((col, colIdx) => (
        <div
          key={colIdx}
          className={`flex flex-col gap-4 ${colIdx >= 2 ? "pt-8" : ""}`}
        >
          {col.map((item, rowIdx) => (
            <Link key={item.id} href={item.href} className="block">
              <GalleryCard
                item={item}
                aspect={aspectPatterns[colIdx][rowIdx % 2]}
              />
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

function GalleryCard({
  item,
  aspect,
}: {
  item: CollectionData;
  aspect: string;
}) {
  return (
    <div
      className={`relative overflow-hidden group ${aspect} bg-gray-50 border border-gray-100`}
    >
      <Image
        src={item.image}
        alt={item.name}
        fill
        className="object-cover grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500" />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-center">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          {item.name}
        </h3>
      </div>
    </div>
  );
}
