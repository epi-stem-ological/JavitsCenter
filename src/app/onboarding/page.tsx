"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { JavitsLogo } from "@/components/brand/JavitsLogo";
import { DotPatternAccent } from "@/components/brand/DotPatternAccent";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store";

const slides = [
  { eyebrow: "01 — Discover", title: "See what's happening today", body: "Trade shows, community days, and sponsored moments — ranked for you." },
  { eyebrow: "02 — Navigate", title: "Find your way across the campus", body: "Six city blocks, four levels, and the roof — we'll get you there." },
  { eyebrow: "03 — Book", title: "Lock in a Quiet Cove pod", body: "Paid pods for focus, calls, and downtime. Bookable in seconds." },
  { eyebrow: "04 — Explore", title: "New York, on your badge", body: "Offers from local partners — dining, attractions, transit." },
];

export default function OnboardingPage() {
  const [i, setI] = useState(0);
  const router = useRouter();
  const completeOnboarding = useApp((s) => s.completeOnboarding);

  const next = () => {
    if (i === slides.length - 1) {
      completeOnboarding();
      router.push("/role");
    } else {
      setI(i + 1);
    }
  };

  const slide = slides[i];

  return (
    <main className="relative min-h-dvh bg-javits-black text-javits-white overflow-hidden">
      <DotPatternAccent color="gold" density="sparse" className="absolute top-0 right-0 w-40 h-40 opacity-25" />
      <header className="relative z-10 flex items-center justify-between px-5 pt-10">
        <JavitsLogo variant="primary-white" size={72} />
        <button onClick={() => { completeOnboarding(); router.push("/role"); }} className="text-xs headline tracking-headline text-javits-white/70">
          Skip
        </button>
      </header>

      <section className="relative z-10 px-6 mt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-javits-gold headline tracking-headline text-xs">{slide.eyebrow}</p>
            <h1 className="headline text-5xl leading-none mt-2">{slide.title}</h1>
            <p className="text-base text-javits-white/80 mt-4 max-w-md">{slide.body}</p>
          </motion.div>
        </AnimatePresence>
      </section>

      <div className="relative z-10 px-6 mt-12 flex items-center gap-2">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`h-[3px] w-10 rounded-full transition-colors ${idx === i ? "bg-javits-gold" : "bg-javits-white/30"}`}
          />
        ))}
      </div>

      <div className="relative z-10 px-6 mt-10">
        <Button onClick={next} intent="primary" size="lg" withArrow>
          {i === slides.length - 1 ? "Choose my role" : "Next"}
        </Button>
      </div>
    </main>
  );
}
