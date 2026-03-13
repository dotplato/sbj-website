"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, User, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/types";

interface BlogSectionProps {
  posts: BlogPost[];
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function BlogSection({ posts }: BlogSectionProps) {
  // Need at least 1 post to show anything
  if (!posts || posts.length === 0) return null;

  // First post → big featured image on the right
  const featured = posts[0];
  // Remaining posts (up to 3) → left column blog cards
  const listed = posts.slice(1, 4);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* ── Header ── */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C6A15B] mb-2">
            From Our Journal
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Our Blogs
          </h2>
          <p className="text-sm text-gray-500 tracking-widest">
            Read The Blogs And Be On-Trend
          </p>
          <div className="w-10 h-px bg-[#C6A15B] mx-auto mt-4" />
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-10 items-stretch">

          {/* LEFT — blog cards stacked */}
          <div className="flex flex-col divide-y divide-gray-100 border border-gray-100 bg-white">
            {/* If only 1 post exists, show it as a card on the left too */}
            {listed.length === 0 && (
              <BlogCard post={featured} />
            )}
            {listed.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}

            {/* "All posts" link at the bottom */}
            <div className="p-6 mt-auto">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase border border-gray-900 text-gray-900 px-6 py-3 hover:bg-gray-900 hover:text-white transition-all duration-300 group"
              >
                View All Posts
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* RIGHT — big featured image */}
          {posts.length > 1 && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group relative h-[480px] lg:h-auto overflow-hidden order-first lg:order-last"
            >
              {featured.coverImage ? (
                <Image
                  src={featured.coverImage}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
              )}
              {/* Gradient overlay with title shown on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                {featured.category && (
                  <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#C6A15B] mb-2 block">
                    {featured.category}
                  </span>
                )}
                <h3 className="text-xl font-bold text-white leading-snug">
                  {featured.title}
                </h3>
              </div>
            </Link>
          )}

          {/* If only 1 post, show featured on the right still */}
          {posts.length === 1 && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group relative h-[480px] lg:h-auto overflow-hidden order-first lg:order-last"
            >
              {featured.coverImage ? (
                <Image
                  src={featured.coverImage}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200" />
              )}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex gap-5 p-6 hover:bg-gray-50 transition-colors duration-200"
    >
      {/* Thumbnail */}
      <div className="relative w-24 h-24 shrink-0 overflow-hidden bg-gray-100">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center min-w-0">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
          <span className="flex items-center gap-1 text-[10px] text-gray-400 tracking-wide">
            <User className="w-3 h-3 text-[#C6A15B]" />
            {post.author}
          </span>
          <span className="text-gray-200">|</span>
          <span className="flex items-center gap-1 text-[10px] text-gray-400 tracking-wide">
            <CalendarDays className="w-3 h-3 text-[#C6A15B]" />
            {formatDate(post.publishedAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#C6A15B] transition-colors duration-200 mb-1.5 leading-snug line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>

        {/* Read more */}
        <span className="mt-3 inline-flex items-center gap-1 text-[9px] font-bold tracking-[0.2em] uppercase border border-[#C6A15B] text-[#C6A15B] px-3 py-1.5 w-fit group-hover:bg-[#C6A15B] group-hover:text-white transition-all duration-300">
          Read More
        </span>
      </div>
    </Link>
  );
}
