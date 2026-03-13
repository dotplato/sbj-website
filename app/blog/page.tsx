import Image from "next/image";
import Link from "next/link";
import { CalendarDays, User, ArrowRight } from "lucide-react";
import { getBlogs } from "@/lib/contentful";
import type { BlogPost } from "@/lib/types";
import SectionReveal from "@/components/SectionReveal";
import FeaturesSection from "@/components/FeaturesSection";

export const revalidate = 60;

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

export default async function BlogListPage() {
  const posts = await getBlogs();

  return (
    <main className="min-h-screen bg-white pt-14 sm:pt-16 lg:pt-[73px]">

      {/* ── Hero Banner ── */}
      <section
        className="relative h-[35vh] flex items-center justify-center text-center px-4"
        style={{ backgroundColor: "#111827" }}
      >
        <div className="relative z-10">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#C6A15B] mb-3">
            From Our Journal
          </p>
          <h1 className="text-4xl md:text-6xl font-fancy text-white mb-4 tracking-widest">
            Our Blog
          </h1>
          <div className="w-16 h-px bg-[#C6A15B] mx-auto" />
        </div>
      </section>

      {/* ── Breadcrumb ── */}
      <nav className="bg-white border-b border-gray-100 px-4 sm:px-8 lg:px-16 py-4">
        <ol className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase max-w-7xl mx-auto">
          <li>
            <Link href="/" className="text-gray-400 hover:text-[#C6A15B] transition-colors">
              Home
            </Link>
          </li>
          <li className="text-gray-200">›</li>
          <li className="text-gray-800 font-bold">Blog</li>
        </ol>
      </nav>

      <SectionReveal>
        <section className="py-16 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">

          {posts.length === 0 ? (
            <div className="text-center py-24 bg-gray-50">
              <p className="text-xs tracking-[0.3em] uppercase text-[#C6A15B] mb-3">
                Coming Soon
              </p>
              <p className="text-gray-400 italic text-sm">
                No blog posts yet. Add entries in Contentful under the{" "}
                <code className="bg-gray-100 px-1 rounded text-gray-600">blogPost</code>{" "}
                content type.
              </p>
            </div>
          ) : (
            <>
              {/* ── Featured first post ── */}
              <FeaturedPostCard post={posts[0]} />

              {/* ── Rest of posts in grid ── */}
              {posts.length > 1 && (
                <div className="mt-16">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-10">
                    <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest">
                      All Posts
                    </h2>
                    <span className="text-xs text-gray-400 tracking-widest">
                      {posts.length} Articles
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {posts.slice(1).map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </SectionReveal>

      <SectionReveal>
        <FeaturesSection />
      </SectionReveal>
    </main>
  );
}

/* ─── Featured (large) post card ─────────────────────────────────── */
function FeaturedPostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-10 items-center border border-gray-100 hover:border-[#C6A15B]/30 transition-colors duration-300"
    >
      {/* Image */}
      <div className="relative h-72 lg:h-[420px] overflow-hidden">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200" />
        )}
      </div>

      {/* Content */}
      <div className="p-8 lg:p-12 flex flex-col justify-center">
        {post.category && (
          <span className="text-[9px] font-bold tracking-[0.35em] uppercase text-[#C6A15B] mb-4 block">
            {post.category}
          </span>
        )}

        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-[#C6A15B] transition-colors duration-300 mb-4 leading-snug">
          {post.title}
        </h2>

        <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-4 flex-wrap mb-8">
          <span className="flex items-center gap-1.5 text-[10px] text-gray-400 tracking-wide">
            <User className="w-3 h-3 text-[#C6A15B]" />
            {post.author}
          </span>
          <span className="text-gray-200">|</span>
          <span className="flex items-center gap-1.5 text-[10px] text-gray-400 tracking-wide">
            <CalendarDays className="w-3 h-3 text-[#C6A15B]" />
            {formatDate(post.publishedAt)}
          </span>
        </div>

        <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase border border-gray-900 text-gray-900 px-6 py-3 w-fit group-hover:bg-gray-900 group-hover:text-white transition-all duration-300">
          Read More
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

/* ─── Standard post card ──────────────────────────────────────────── */
function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col">
      {/* Image */}
      <div className="relative h-56 overflow-hidden mb-5 bg-gray-100">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200" />
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-end justify-center pb-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
          <span className="bg-[#C6A15B] text-white text-[9px] font-bold tracking-[0.25em] uppercase px-5 py-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            Read More
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 flex-wrap mb-3">
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

      {/* Category */}
      {post.category && (
        <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#C6A15B] mb-2">
          {post.category}
        </span>
      )}

      {/* Title */}
      <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#C6A15B] transition-colors duration-200 mb-2 leading-snug line-clamp-2">
        {post.title}
      </h3>

      {/* Excerpt */}
      <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-3 flex-1">
        {post.excerpt}
      </p>

      {/* Divider */}
      <div className="mt-5 w-8 h-px bg-[#C6A15B] group-hover:w-16 transition-all duration-500" />
    </Link>
  );
}
