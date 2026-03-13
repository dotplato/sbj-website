 "use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, Menu, X, Search, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { CollectionData } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  collections: CollectionData[];
}

export default function Header({ collections }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isJwrOpen, setIsJwrOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const { openCart, totalItems } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  // Navbar is transparent only on homepage when not scrolled
  const isTransparent = isHome && !isScrolled;
  const headerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sort collections once for stable nav ordering
  const sortedCollections = [...collections].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  // Helper: filter collections by line & audience
  const byLineAndAudience = (
    line: "diamond" | "gold" | "watches",
    audience: "men" | "women" | "kids",
  ) => {
    const targetLine = line.toLowerCase();
    const targetAudience = audience.toLowerCase();
    return sortedCollections.filter((c) => {
      const cLine = (c.line || "").toLowerCase();
      const audiences = (c.audience || []).map((a) => a.toLowerCase());
      return cLine === targetLine && audiences.includes(targetAudience);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/collections?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  // Track scroll position for transparent → white transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
        setIsJwrOpen(false);
      }
    };

    if (isMenuOpen || isJwrOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, isJwrOpen]);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isTransparent
        ? "bg-transparent border-b border-transparent"
        : "bg-white border-b border-gray-200 shadow-sm"
        }`}
    >
      <div className="mx-auto px-3 sm:px-6 lg:px-8">
        {/* Top promotional bar */}


        {/* Main header */}
        <div className="flex items-center justify-between py-3 sm:py-4 lg:py-5 gap-2">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0"
            onClick={() => setIsMenuOpen(false)}
          >
            <Image
              src="/logo/logo-full.png"
              alt="SBJ"
              width={200}
              height={60}
              className="h-8 w-auto sm:h-10 lg:h-14"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors tracking-wide hover:text-[#C6A15B] ${isTransparent ? "text-white" : "text-gray-600"}`}
            >
              Home
            </Link>

            {/* Diamond menu */}
            <DropdownMenu open={isJwrOpen} onOpenChange={setIsJwrOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`flex items-center gap-1 text-sm font-medium transition-colors tracking-wide hover:text-[#C6A15B] ${
                    isTransparent ? "text-white" : "text-gray-600"
                  } focus:outline-none focus-visible:outline-none h-auto p-0 hover:bg-transparent`}
                >
                  Diamond <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {byLineAndAudience("diamond", "men").length > 0 && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Men</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {byLineAndAudience("diamond", "men").map((col) => (
                        <DropdownMenuItem key={col.id} asChild>
                          <Link href={col.href}>{col.name}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}
                {byLineAndAudience("diamond", "women").length > 0 && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Women</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {byLineAndAudience("diamond", "women").map((col) => (
                        <DropdownMenuItem key={col.id} asChild>
                          <Link href={col.href}>{col.name}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}
                {byLineAndAudience("diamond", "kids").length > 0 && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Kids</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {byLineAndAudience("diamond", "kids").map((col) => (
                        <DropdownMenuItem key={col.id} asChild>
                          <Link href={col.href}>{col.name}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Gold menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`flex items-center gap-1 text-sm font-medium transition-colors tracking-wide hover:text-[#C6A15B] ${
                    isTransparent ? "text-white" : "text-gray-600"
                  } focus:outline-none focus-visible:outline-none h-auto p-0 hover:bg-transparent`}
                >
                  Gold <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {byLineAndAudience("gold", "men").length > 0 && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Men</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {byLineAndAudience("gold", "men").map((col) => (
                        <DropdownMenuItem key={col.id} asChild>
                          <Link href={col.href}>{col.name}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}
                {byLineAndAudience("gold", "women").length > 0 && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Women</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {byLineAndAudience("gold", "women").map((col) => (
                        <DropdownMenuItem key={col.id} asChild>
                          <Link href={col.href}>{col.name}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}
                {byLineAndAudience("gold", "kids").length > 0 && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Kids</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {byLineAndAudience("gold", "kids").map((col) => (
                        <DropdownMenuItem key={col.id} asChild>
                          <Link href={col.href}>{col.name}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Watches menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`flex items-center gap-1 text-sm font-medium transition-colors tracking-wide hover:text-[#C6A15B] ${
                    isTransparent ? "text-white" : "text-gray-600"
                  } focus:outline-none focus-visible:outline-none h-auto p-0 hover:bg-transparent`}
                >
                  Watches <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {byLineAndAudience("watches", "men").length > 0 && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Men</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {byLineAndAudience("watches", "men").map((col) => (
                        <DropdownMenuItem key={col.id} asChild>
                          <Link href={col.href}>{col.name}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}
                {byLineAndAudience("watches", "women").length > 0 && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Women</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {byLineAndAudience("watches", "women").map((col) => (
                        <DropdownMenuItem key={col.id} asChild>
                          <Link href={col.href}>{col.name}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}
                {byLineAndAudience("watches", "kids").length > 0 && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Kids</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {byLineAndAudience("watches", "kids").map((col) => (
                        <DropdownMenuItem key={col.id} asChild>
                          <Link href={col.href}>{col.name}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/sale"
              className={`text-sm font-bold transition-colors tracking-wide uppercase ${isTransparent ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700"}`}
            >
              Sale
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors tracking-wide hover:text-[#C6A15B] ${isTransparent ? "text-white" : "text-gray-600"}`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors tracking-wide hover:text-[#C6A15B] ${isTransparent ? "text-white" : "text-gray-600"}`}
            >
              Contact
            </Link>
          </nav>

          {/* Right icons */}
          <div className={`flex items-center gap-2 sm:gap-3 ${isTransparent ? "text-white" : "text-gray-700"}`}>
            {/* Search Bar */}
            <div
              className={`flex items-center transition-all duration-300 ${isSearchOpen ? "w-48 sm:w-64 opacity-100" : "w-0 opacity-0 overflow-hidden"}`}
            >
              <form onSubmit={handleSearch} className="w-full relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search gems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full border rounded-full py-1.5 px-4 text-xs focus:outline-none focus:border-[#C6A15B] transition-all ${isScrolled ? "bg-gray-50 border-gray-100" : "bg-white/20 border-white/40 text-white placeholder:text-white/70"}`}
                />
              </form>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-inherit hover:text-[#C6A15B]"
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (!isSearchOpen) {
                  setTimeout(() => searchInputRef.current?.focus(), 100);
                }
              }}
            >
              {isSearchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-inherit hover:text-[#C6A15B]"
              onClick={openCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span
                  className="absolute top-1 right-1 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                  style={{ backgroundColor: "#C6A15B" }}
                >
                  {totalItems}
                </span>
              )}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-1 border-t border-gray-100 pt-3 animate-in slide-in-from-top duration-300 bg-white">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#C6A15B] transition"
            >
              Home
            </Link>
            <div className="px-4 py-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Collections
              </p>
              <div className="grid grid-cols-1 gap-2 pl-2 border-l-2 border-gray-100">
                {sortedCollections.map((col) => (
                  <Link
                    key={col.id}
                    href={col.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xs text-gray-600 py-1 hover:text-[#C6A15B]"
                  >
                    {col.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/sale"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 text-sm font-bold text-red-600 hover:text-red-700 transition"
            >
              Sale
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#C6A15B] transition"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#C6A15B] transition"
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}