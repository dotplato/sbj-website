"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import type { HeroSlide } from "@/lib/types";

// ─── Fallback data (used when CMS returns nothing) ─────────────────────────
const fallbackSlides: HeroSlide[] = [
  {
    id: "1",
    video: "/slider-video-1.mp4",
    subtitle: "Timeless Elegance",
    title: "Heritage Bridal\nCollection",
    description:
      "Experience the grandeur of royalty with our hand-picked heritage bridal pieces, crafted to perfection.",
  },
  {
    id: "2",
    video: "/slider-video-2.mp4",
    subtitle: "Magnificent Luxury",
    title: "Exquisite\nGold Sets",
    description:
      "Discover our exclusive collection of gold sets crafted with passion and precision for every occasion.",
  },
  {
    id: "3",
    video: "/slider-video-3.mp4",
    subtitle: "Classic Grace",
    title: "Timeless\nMala Designs",
    description:
      "Find the perfect mala set to complement your style and make a lasting statement wherever you go.",
  },
];

const SWIPE_THRESHOLD = 50;

interface HeroBannerProps {
  slides?: HeroSlide[];
}

export default function HeroBanner({ slides }: HeroBannerProps) {
  const heroSlides = slides && slides.length > 0 ? slides : fallbackSlides;

  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Drag / swipe tracking
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const goTo = useCallback(
    (index: number) => {
      if (animating) return;
      setAnimating(true);
      setCurrent(index);
      setTimeout(() => setAnimating(false), 700);
    },
    [animating],
  );

  const next = useCallback(() => {
    goTo((current + 1) % heroSlides.length);
  }, [current, goTo, heroSlides.length]);

  const prev = useCallback(() => {
    goTo((current - 1 + heroSlides.length) % heroSlides.length);
  }, [current, goTo, heroSlides.length]);

  // Handle playing the current video
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (video) {
        if (i === current) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
  }, [current]);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next]);

  /* ── Mouse drag handlers (desktop) ── */
  const onMouseDown = (e: React.MouseEvent) => {
    dragStartX.current = e.clientX;
    isDragging.current = true;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current || dragStartX.current === null) return;
    isDragging.current = false;
    const delta = dragStartX.current - e.clientX;
    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      delta > 0 ? next() : prev();
    }
    dragStartX.current = null;
  };
  const onMouseLeave = () => {
    isDragging.current = false;
    dragStartX.current = null;
  };

  /* ── Touch swipe handlers (mobile) ── */
  const onTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (dragStartX.current === null) return;
    const delta = dragStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      delta > 0 ? next() : prev();
    }
    dragStartX.current = null;
  };

  return (
    <section className="hero-outer relative w-full overflow-hidden bg-black select-none -mt-14 sm:-mt-16 lg:-mt-[73px]">
      <style>{`
        .hero-outer {
          height: 0;
          padding-bottom: calc(100% + 56px);
        }
        @media (min-width: 640px) {
          .hero-outer { padding-bottom: calc(60% + 64px); }
        }
        @media (min-width: 1024px) {
          .hero-outer { padding-bottom: calc(50% + 73px); max-height: 750px; }
        }
        .hero-drag { cursor: grab; }
        .hero-drag:active { cursor: grabbing; }
      `}</style>

      {/* Full-size drag/swipe surface */}
      <div
        className="hero-drag absolute inset-0 w-full h-full"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* ── Slides (videos + overlays) ── */}
        {heroSlides.map((slide, i) => (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{
              opacity: i === current ? 1 : 0,
              zIndex: i === current ? 1 : 0,
            }}
            aria-hidden={i !== current}
          >
            <video
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              src={slide.video}
              autoPlay={i === current}
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.7)" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.08) 100%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 48%)",
              }}
            />
          </div>
        ))}

        {/* ── Slide Content ── */}
        {heroSlides.map((slide, i) => (
          <div
            key={slide.id}
            className="absolute inset-0 flex flex-col justify-center"
            style={{
              paddingLeft: "clamp(56px, 10%, 120px)",
              paddingRight: "clamp(56px, 8%,  80px)",
              paddingTop: "clamp(4.5rem, 6vw, 6rem)",
              paddingBottom: "clamp(2.5rem, 4vw, 4rem)",
              opacity: i === current ? 1 : 0,
              transform: i === current ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
              zIndex: i === current ? 2 : 0,
              pointerEvents: i === current ? "auto" : "none",
            }}
          >
            <div style={{ maxWidth: "min(520px, 100%)" }}>
              {/* Subtitle */}
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <span
                  className="block h-px flex-shrink-0"
                  style={{
                    width: "clamp(20px, 3vw, 36px)",
                    backgroundColor: "#C6A15B",
                  }}
                />
                <p
                  className="font-semibold uppercase"
                  style={{
                    color: "#C6A15B",
                    fontSize: "clamp(0.55rem, 1.4vw, 0.85rem)",
                    letterSpacing: "0.22em",
                  }}
                >
                  {slide.subtitle}
                </p>
              </div>

              {/* Title */}
              <h1
                className="font-fancy text-white mb-2 sm:mb-4"
                style={{
                  fontSize: "clamp(2rem, 7vw, 6.5rem)",
                  whiteSpace: "pre-line",
                  lineHeight: 1.08,
                }}
              >
                {slide.title}
              </h1>

              {/* Description */}
              <p
                className="text-gray-300 leading-relaxed mb-3 sm:mb-6"
                style={{
                  fontSize: "clamp(0.72rem, 1.4vw, 0.98rem)",
                  maxWidth: "400px",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {slide.description}
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Link href="/collections" draggable={false}>
                  <button
                    className="font-semibold uppercase tracking-widest transition-all duration-300 whitespace-nowrap"
                    style={{
                      backgroundColor: "#C6A15B",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "clamp(0.58rem, 1.1vw, 0.78rem)",
                      padding:
                        "clamp(0.38rem, 1vw, 0.65rem) clamp(0.9rem, 2vw, 1.4rem)",
                      letterSpacing: "0.12em",
                    }}
                    onMouseEnter={(e) => {
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "#b8904d";
                    }}
                    onMouseLeave={(e) => {
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "#C6A15B";
                    }}
                  >
                    Explore Now
                  </button>
                </Link>

                <Link
                  href="https://wa.me/19059040067"
                  target="_blank"
                  rel="noopener noreferrer"
                  draggable={false}
                >
                  <button
                    className="font-semibold uppercase tracking-widest transition-all duration-300 whitespace-nowrap"
                    style={{
                      backgroundColor: "transparent",
                      color: "#fff",
                      border: "1.5px solid rgba(255,255,255,0.65)",
                      cursor: "pointer",
                      fontSize: "clamp(0.58rem, 1.1vw, 0.78rem)",
                      padding:
                        "clamp(0.38rem, 1vw, 0.65rem) clamp(0.9rem, 2vw, 1.4rem)",
                      letterSpacing: "0.12em",
                    }}
                    onMouseEnter={(e) => {
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "rgba(255,255,255,0.1)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "#fff";
                    }}
                    onMouseLeave={(e) => {
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "transparent";
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "rgba(255,255,255,0.65)";
                    }}
                  >
                    Book Appointment
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* ── Prev Arrow ── */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          aria-label="Previous slide"
          className="absolute left-1.5 sm:left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center transition-all duration-200"
          style={{
            width: "28px",
            height: "28px",
            backgroundColor: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            cursor: "pointer",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "rgba(208,170,107,0.9)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "rgba(0,0,0,0.35)";
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* ── Next Arrow ── */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          aria-label="Next slide"
          className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center transition-all duration-200"
          style={{
            width: "28px",
            height: "28px",
            backgroundColor: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            cursor: "pointer",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "rgba(208,170,107,0.9)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "rgba(0,0,0,0.35)";
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* ── Dot Indicators ── */}
        <div className="absolute bottom-3 sm:bottom-9 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="transition-all duration-300"
              style={{
                width: i === current ? "22px" : "6px",
                height: "6px",
                borderRadius: i === current ? "3px" : "50%",
                backgroundColor:
                  i === current ? "#C6A15B" : "rgba(255,255,255,0.4)",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* ── Slide Counter (sm+) ── */}
        <div
          className="absolute bottom-3 sm:bottom-5 right-3 sm:right-5 z-20 hidden sm:flex items-center gap-1.5"
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
          }}
        >
          <span style={{ color: "#C6A15B", fontWeight: 700 }}>
            {String(current + 1).padStart(2, "0")}
          </span>
          <span>/</span>
          <span>{String(heroSlides.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}
