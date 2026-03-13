"use client";

import { useState, useEffect } from "react";

export default function SplashScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<"splash" | "fading" | "done">("splash");

  const finishSplash = () => {
    setPhase((prev) => {
      // Only transition from splash → fading (prevents double calls)
      if (prev !== "splash") return prev;
      setTimeout(() => {
        setPhase("done");
      }, 800);
      return "fading";
    });
  };

  useEffect(() => {
    // Safety fallback: if video doesn't end or fails to load,
    // finish the splash anyway after 6 seconds.
    const timer = setTimeout(finishSplash, 6000);
    return () => clearTimeout(timer);
  }, []);

  if (phase === "done") return <>{children}</>;

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: phase === "fading" ? 0 : 1,
          transition: "opacity 800ms ease-in-out",
        }}
      >
        <video
          autoPlay
          muted
          playsInline
          preload="auto"
          src="/sbj-logo-loading.mp4"
          onEnded={finishSplash}
          style={{
            width: "min(60vmin, 500px)",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </div>

      <div
        style={{
          opacity: phase === "fading" ? 1 : 0,
          transition: "opacity 800ms ease-in-out",
        }}
      >
        {children}
      </div>
    </>
  );
}