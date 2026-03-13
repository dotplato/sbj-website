"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ProductData } from "@/lib/types";

// ─── Unified product type for display ───────────────────────────────────────
type DisplayProduct = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  price: string;
  priceNum: number;
  images: string[];
  category: string;
  isOnSale: boolean;
  salePrice?: string;
  originalPrice?: string;
};

/** Map CMS data to display shape */
function cmsToDisplay(p: ProductData): DisplayProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    sku: p.sku,
    // When on sale, show salePrice as main price and originalPrice crossed out
    price: p.isOnSale && p.salePrice ? p.salePrice : p.price,
    priceNum: p.isOnSale && p.salePriceNum ? p.salePriceNum : p.priceNum,
    images: p.images,
    category: p.category,
    isOnSale: p.isOnSale,
    salePrice: p.salePrice,
    originalPrice: p.isOnSale ? p.originalPrice || p.price : undefined,
  };
}

interface ProductCardProps {
  product: DisplayProduct;
}

function ProductCard({ product }: ProductCardProps) {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Card className="group bg-[#f5f5f5] border-0 shadow-none transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      {/* Inner Image Carousel */}
      <div className="relative h-[380px] sm:h-[420px] flex items-center justify-center">
        {/* Sale Badge */}
        {product.isOnSale && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-red-600 text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1 shadow-sm">
              Sale
            </span>
          </div>
        )}

        <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
          <CarouselContent>
            {product.images.map((img, index) => (
              <CarouselItem key={index} className="flex justify-center">
                <div className="relative h-[360px] w-full">
                  <Image
                    src={img}
                    alt={product.name}
                    fill
                    className="object-contain"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="left-2 bg-transparent border-0 shadow-none text-gray-500 hover:text-black" />
          <CarouselNext className="right-2 bg-transparent border-0 shadow-none text-gray-500 hover:text-black" />
        </Carousel>
      </div>

      {/* Slide Indicator */}
      <div className="flex justify-center gap-2 py-4">
        {product.images.map((_, index) => (
          <div
            key={index}
            className={`h-[3px] rounded-full transition-all duration-300 ${
              current === index ? "w-10 bg-black" : "w-3 bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <CardContent className="text-center pb-6">
        <h3 className="text-lg tracking-wide text-gray-900 mb-1">
          {product.name.toUpperCase()}
        </h3>

        <p className="text-sm text-gray-500 mb-3">{product.sku}</p>

        {/* Price display — sale-aware */}
        <div className="flex items-center justify-center gap-2">
          <p
            className={`text-lg font-semibold ${product.isOnSale ? "text-red-600" : ""}`}
            style={product.isOnSale ? {} : { color: "#C6A15B" }}
          >
            {product.price}
          </p>
          {product.isOnSale && product.originalPrice && (
            <p className="text-sm text-gray-400 line-through">
              {product.originalPrice}
            </p>
          )}
        </div>

        {/* Hover Button */}
        <div className="mt-4">
          <Link href={`/product/${product.slug}`}>
            <Button
              className="w-full text-white text-sm tracking-widest uppercase opacity-100 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:mt-6 transition-all duration-300"
              style={{ backgroundColor: "#C6A15B" }}
            >
              Discover More
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProductShowcaseProps {
  products?: ProductData[];
}

export default function ProductShowcase({ products }: ProductShowcaseProps) {
  // CMS only — show up to 10 products
  const displayProducts: DisplayProduct[] =
    products && products.length > 0
      ? products.slice(0, 10).map(cmsToDisplay)
      : [];

  if (displayProducts.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section heading */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C6A15B] mb-2">
            New Arrivals
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Our Collections
          </h2>
          <div className="w-10 h-px bg-[#C6A15B] mx-auto" />
        </div>

        {/* Outer Carousel (Cards Slider) */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-6">
            {displayProducts.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-6 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Outer Arrows */}
          <CarouselPrevious className="-left-12 bg-black text-white border-0 hover:bg-gray-800 hidden md:flex" />
          <CarouselNext className="-right-12 bg-black text-white border-0 hover:bg-gray-800 hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
}
