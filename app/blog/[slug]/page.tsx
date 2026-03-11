import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, User, Tag, ArrowLeft } from "lucide-react";
import { getBlogBySlug, getBlogs } from "@/lib/contentful";
import SectionReveal from "@/components/SectionReveal";
import RichTextRenderer from "@/components/RichTextRenderer";

export const revalidate = 60;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  // Fetch related posts (exclude self)
  let related: typeof post[] = [];
  try {
    const all = await getBlogs();
    related = all.filter((p) => p.slug !== slug).slice(0, 3);
  } catch {
    // ignore
  }

  return (
    <main className="min-h-screen bg-white pt-14 sm:pt-16 lg:pt-[73px]">

      {/* ── Hero ── */}
      <section
        className="relative h-[45vh] md:h-[55vh] flex items-end justify-center text-center px-4 pb-12"
        style={{ backgroundColor: "#111827" }}
      >
        {post.coverImage && (
          <div className="absolute inset-0 opacity-40">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <div className="relative z-10 max-w-3xl mx-auto">
          {post.category && (
            <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-[#C6A15B] mb-3 block">
              {post.category}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-[11px] text-white/70 tracking-wide">
              <User className="w-3.5 h-3.5 text-[#C6A15B]" />
              {post.author}
            </span>
            <span className="text-white/30">|</span>
            <span className="flex items-center gap-1.5 text-[11px] text-white/70 tracking-wide">
              <CalendarDays className="w-3.5 h-3.5 text-[#C6A15B]" />
              {formatDate(post.publishedAt)}
            </span>
            {post.category && (
              <>
                <span className="text-white/30">|</span>
                <span className="flex items-center gap-1.5 text-[11px] text-white/70 tracking-wide">
                  <Tag className="w-3.5 h-3.5 text-[#C6A15B]" />
                  {post.category}
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Breadcrumb ── */}
      <nav className="bg-white border-b border-gray-100 px-4 sm:px-8 lg:px-16 py-4">
        <ol className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase max-w-4xl mx-auto">
          <li>
            <Link href="/" className="text-gray-400 hover:text-[#C6A15B] transition-colors">
              Home
            </Link>
          </li>
          <li className="text-gray-200">›</li>
          <li>
            <Link href="/blog" className="text-gray-400 hover:text-[#C6A15B] transition-colors">
              Blog
            </Link>
          </li>
          <li className="text-gray-200">›</li>
          <li className="text-gray-800 font-bold truncate max-w-[200px]">{post.title}</li>
        </ol>
      </nav>

      {/* ── Body ── */}
      <SectionReveal>
        <article className="max-w-3xl mx-auto px-4 sm:px-8 py-16">
          {/* Excerpt pull-quote */}
          {post.excerpt && (
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-10 border-l-4 border-[#C6A15B] pl-6 italic font-light">
              {post.excerpt}
            </p>
          )}

          {/* Divider */}
          <div className="w-16 h-px bg-[#C6A15B] mb-10" />

          {/* Full body — rendered as rich text */}
          <RichTextRenderer
            content={post.body}
            variant="blog"
            className="max-w-none"
          />

          {/* Back link */}
          <div className="mt-16 pt-8 border-t border-gray-100">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase border border-gray-900 text-gray-900 px-6 py-3 hover:bg-gray-900 hover:text-white transition-all duration-300 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to Blog
            </Link>
          </div>
        </article>
      </SectionReveal>

      {/* ── Related Posts ── */}
      {related.length > 0 && (
        <SectionReveal>
          <section className="bg-gray-50 py-16 px-4 sm:px-8 lg:px-16">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C6A15B] mb-2">
                  Continue Reading
                </p>
                <h2 className="text-2xl font-bold text-gray-900">
                  More From Our Journal
                </h2>
                <div className="w-10 h-px bg-[#C6A15B] mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {related.map((rel) => (
                  <Link key={rel.id} href={`/blog/${rel.slug}`} className="group bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="relative h-48 overflow-hidden">
                      {rel.coverImage ? (
                        <Image
                          src={rel.coverImage}
                          alt={rel.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-200" />
                      )}
                    </div>
                    <div className="p-6">
                      <p className="text-[9px] text-[#C6A15B] font-bold tracking-widest uppercase mb-2">
                        {rel.category || "Blog"}
                      </p>
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#C6A15B] transition-colors mb-2 line-clamp-2">
                        {rel.title}
                      </h3>
                      <p className="text-[11px] text-gray-500 line-clamp-2">
                        {rel.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </SectionReveal>
      )}
    </main>
  );
}
