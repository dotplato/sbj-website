"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { VideoHeroData } from "@/lib/types";

// ─── Hardcoded button (never changes) ───────────────────────────────────────
const BUTTON_TEXT = "Shop the Collection";
const BUTTON_LINK = "/collections";

// ─── Fallback data (video + text only) ──────────────────────────────────────
const fallbackData: VideoHeroData = {
  subtitle: "The Art of Heritage",
  title: "Where every gem has a story, and every visit is a journey!",
  description:
    "Discover the perfect piece of jewelry that tells your unique story. Our collection features exquisite designs crafted with passion and precision.",
  video: "/video-hero.mp4",
};

interface VideoHeroProps {
  data?: VideoHeroData | null;
}

export default function VideoHero({ data }: VideoHeroProps) {
  const content = data || fallbackData;

  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for auto-play when in view
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let playPromise: Promise<void> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          playPromise = video.play();
        } else {
          setIsVisible(false);
          if (playPromise !== undefined) {
            playPromise.then(() => video.pause()).catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.5 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      if (playPromise !== undefined) {
        playPromise.then(() => video.pause()).catch(() => {});
      }
    };
  }, []);

  // Split title at <br> or \n for line breaks
  const titleParts = content.title.split(/\\n|\n/);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[80vh] sm:h-[70vh] min-h-[500px] overflow-hidden bg-black"
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source src={content.video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Center Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl space-y-8">
          <div className="space-y-4">
            <p className="text-[10px] sm:text-sm font-semibold text-[#C6A15B] uppercase tracking-[0.4em] animate-in fade-in slide-in-from-bottom duration-700">
              {content.subtitle}
            </p>
            <h2 className="text-3xl sm:text-6xl lg:text-7xl font-fancy text-white leading-tight tracking-wider animate-in fade-in slide-in-from-bottom duration-1000">
              {titleParts.map((part, i) => (
                <span key={i}>
                  {part}
                  {i < titleParts.length - 1 && (
                    <br className="hidden sm:block" />
                  )}
                  {i < titleParts.length - 1 && " "}
                </span>
              ))}
            </h2>
          </div>

          <p className="text-xs sm:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed font-light animate-in fade-in slide-in-from-bottom duration-1200">
            {content.description}
          </p>

          <div className="pt-6 animate-in fade-in slide-in-from-bottom duration-1400">
            <Link href={BUTTON_LINK}>
              <Button
                size="lg"
                className="text-white font-bold px-10 py-7 text-xs sm:text-sm tracking-[0.2em] uppercase rounded-none transition-all duration-300 shadow-2xl hover:scale-105"
                style={{ backgroundColor: "#C6A15B" }}
              >
                {BUTTON_TEXT}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
