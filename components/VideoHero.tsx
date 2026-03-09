"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VideoHero() {
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
          // Wait for play() to resolve before pausing to avoid AbortError
          if (playPromise !== undefined) {
            playPromise
              .then(() => video.pause())
              .catch(() => {
                // play() was already interrupted — safe to ignore
              });
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
      // Clean up on unmount
      if (playPromise !== undefined) {
        playPromise.then(() => video.pause()).catch(() => { });
      }
    };
  }, []);

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
        <source
          src="/video-hero.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Center Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl space-y-8">
          <div className="space-y-4">
            <p className="text-[10px] sm:text-sm font-semibold text-[#C6A15B] uppercase tracking-[0.4em] animate-in fade-in slide-in-from-bottom duration-700">
              The Art of Heritage
            </p>
            <h2 className="text-3xl sm:text-6xl lg:text-7xl font-fancy text-white leading-tight tracking-wider animate-in fade-in slide-in-from-bottom duration-1000">
              Where every gem has a story, <br className="hidden sm:block" />{" "}
              and every visit is a journey!
            </h2>
          </div>

          <p className="text-xs sm:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed font-light animate-in fade-in slide-in-from-bottom duration-1200">
            Discover the perfect piece of jewelry that tells your unique story.
            Our collection features exquisite designs crafted with passion and
            precision.
          </p>

          <div className="pt-6 animate-in fade-in slide-in-from-bottom duration-1400">
            <Link href="/collections">
              <Button
                size="lg"
                className="text-white font-bold px-10 py-7 text-xs sm:text-sm tracking-[0.2em] uppercase rounded-none transition-all duration-300 shadow-2xl hover:scale-105"
                style={{ backgroundColor: "#C6A15B" }}
              >
                Shop the Collection
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}