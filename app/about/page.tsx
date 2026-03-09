"use client";

import Image from "next/image";
import Link from "next/link";
import FeaturesSection from "@/components/FeaturesSection";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white pt-14 sm:pt-16 lg:pt-[73px]">
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-gray-900 flex items-center justify-center text-center px-4">
        <div className="absolute inset-0 opacity-50">
          <Image
            src="/bridal-sets/Eternal Glow Bridal Set.png"
            alt="About Saleem Butt Jewellers"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.4em] uppercase text-[var(--brand-gold)] mb-4">
            Legacy Of Excellence
          </p>
          <h1 className="text-5xl md:text-7xl font-fancy text-white mb-6">
            Crafting Elegance Since 1995
          </h1>
          <div className="w-20 h-px bg-[var(--brand-gold)] mx-auto mb-6" />
          <p className="text-gray-200 text-lg leading-relaxed font-light">
            Saleem Butt Jewellers has been at the forefront of exquisite
            craftsmanship and timeless designs for over three decades.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-4 sm:px-8 lg:px-16 container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square">
            <Image
              src="/bridal-sets/Eternal Glow Bridal Set.png"
              alt="Crafstmanship"
              fill
              className="object-cover shadow-2xl"
            />
            <div className="absolute -bottom-8 -right-8 w-64 h-64 border-8 border-[var(--brand-gold)]/20 -z-10" />
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-[var(--brand-gold)] font-semibold tracking-widest uppercase text-sm">
                Our Story
              </span>
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Where Tradition Meets <br /> Modern Luxury
              </h2>
              <div className="w-12 h-px bg-[var(--brand-gold)]" />
            </div>

            <p className="text-gray-600 leading-relaxed text-lg">
              Each piece at Saleem Butt Jewellers is a masterpiece, meticulously
              handcrafted by our master artisans who have inherited
              centuries-old techniques. We believe that jewelry is not just an
              accessory, but a celebration of life's most precious moments.
            </p>

            <p className="text-gray-600 leading-relaxed text-lg">
              From our signature bridal collections to our modern everyday wear,
              every design reflects our commitment to purity, quality, and
              exceptional service.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-6">
              <div>
                <p className="text-3xl font-bold text-gray-900 mb-1">30+</p>
                <p className="text-sm text-gray-500 uppercase tracking-widest">
                  Years of Experience
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 mb-1">10k+</p>
                <p className="text-sm text-gray-500 uppercase tracking-widest">
                  Happy Clients
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-[#fcfaf7] py-24 px-4 sm:px-8 lg:px-16">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-6">
              <div className="w-8 h-8 rounded-full border-2 border-[var(--brand-gold)]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 tracking-wide uppercase">
              Our Vision
            </h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              To be the world's most trusted bridal jewelry house, recognized
              for our artistic designs and unwavering commitment to quality.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-6">
              <div className="w-8 h-8 rounded-full border-2 border-[var(--brand-gold)]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 tracking-wide uppercase">
              Our Mission
            </h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              To create timeless jewelry that empowers and inspires, fostering
              lasting relationships through transparency and excellence.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-6">
              <div className="w-8 h-8 rounded-full border-2 border-[var(--brand-gold)]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 tracking-wide uppercase">
              Our Values
            </h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Purity in materials, precision in craft, and integrity in service.
              These are the pillars that stand behind every Saleem Butt Jewellers creation.
            </p>
          </div>
        </div>
      </section>

      <FeaturesSection />

      {/* CTA Section */}
      <section className="py-24 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 uppercase tracking-wider">
          Experience Luxury In Person
        </h2>
        <p className="text-gray-500 mb-8 max-w-xl mx-auto">
          Visit our flagship store to explore our exclusive collections and
          enjoy personalized styling sessions.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-gray-900 text-white px-10 py-4 text-xs font-semibold tracking-widest uppercase hover:bg-[var(--brand-gold)] transition-colors"
        >
          Book An Appointment
        </Link>
      </section>
    </main>
  );
}
