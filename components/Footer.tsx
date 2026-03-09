"use client";

import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SectionReveal from "./SectionReveal";

export default function Footer() {
  const categories = [
    { name: "Gold Sets", href: "/collections?category=Gold+Sets" },
    { name: "Bridal Sets", href: "/collections?category=Bridal+Sets" },
    { name: "Bangles & Kara", href: "/collections?category=Bangles+%26+Kara" },
    { name: "Mala Sets", href: "/collections?category=Mala+Sets" },
    { name: "Choker Sets", href: "/collections?category=Choker+Sets" },
    {
      name: "Chain & Locket Sets",
      href: "/collections?category=Chain+%26+Locket+Sets",
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white pt-12 pb-6 sm:pt-16 sm:pb-8">
      <SectionReveal>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12 sm:mb-16">
            {/* About Section */}
            <div className="space-y-6">
              <Image
                src="/logo/logo-full.png"
                alt="SBJ"
                width={180}
                height={50}
                className="h-12 w-auto"
              />
              <p className="text-gray-400 text-sm leading-relaxed">
                Saleem Butt Jewellers redefines luxury with contemporary elegance.
                Each piece is a fusion of modern design and masterful
                craftsmanship. Indulge in jewellery that exudes prestige, style,
                and sophistication.
              </p>
            </div>

            {/* Contact Us Section */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold uppercase tracking-widest border-b border-[#c8a97e]/30 pb-2 inline-block">
                Contact Us
              </h4>
              <div className="space-y-4">
                <a
                  href="tel:+19059040067"
                  className="text-gray-400 hover:text-[#c8a97e] text-sm flex items-center gap-3 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-[#c8a97e] group-hover:text-black transition-all">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span>Phone: +1 905 904 0067</span>
                </a>
                <a
                  href="mailto:info@saleembuttjewellers.com"
                  className="text-gray-400 hover:text-[#c8a97e] text-sm flex items-center gap-3 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-[#c8a97e] group-hover:text-black transition-all">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span>Email: info@saleembuttjewellers.com</span>
                </a>
              </div>
            </div>

            {/* Shop by Category Section */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold uppercase tracking-widest border-b border-[#c8a97e]/30 pb-2 inline-block">
                Shop by Category
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-[#c8a97e] text-sm transition-colors"
                  >
                    Home
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.name}>
                    <Link
                      href={cat.href}
                      className="text-gray-400 hover:text-[#c8a97e] text-sm transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-[#c8a97e] text-sm transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Location Section */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold uppercase tracking-widest border-b border-[#C6A15B]/30 pb-2 inline-block">
                Location
              </h4>
              <div className="flex gap-3 text-gray-400 text-sm leading-relaxed">
                <MapPin className="h-5 w-5 text-[#C6A15B] shrink-0" />
                <p>
                  7072, Airport Road, Mississauga
                  <br />
                  on L4T 2G8, Canada
                </p>
              </div>

              <div className="pt-4">
                <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">
                  Follow Us
                </h5>
                <div className="flex gap-3">
                  {[
                    { icon: Facebook, label: "Facebook", href: "#" },
                    { icon: Instagram, label: "Instagram", href: "#" },
                    { icon: Youtube, label: "YouTube", href: "#" },
                  ].map(({ icon: Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:bg-[#C6A15B] hover:border-[#C6A15B] hover:text-black transition-all duration-300"
                      aria-label={label}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-gray-800 pt-8 mt-8 text-center">
            <p className="text-gray-500 text-xs tracking-widest uppercase">
              © 2025 All Rights Reserved. Saleem Butt Jewellers
            </p>
          </div>
        </div>
      </SectionReveal>
    </footer>
  );
}