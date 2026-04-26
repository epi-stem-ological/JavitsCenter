"use client";

import { Calendar, MapPin, LifeBuoy, Sparkles } from "lucide-react";
import Link from "next/link";
import { JavitsLogo } from "@/components/brand/JavitsLogo";
import { GradientWave } from "@/components/brand/GradientWave";
import { DotPatternAccent } from "@/components/brand/DotPatternAccent";
import { voice } from "@/lib/tokens";

/**
 * Kiosk home — oversized tiles tuned for a touchscreen ≥10".
 */
const tiles = [
  { href: "/events", label: "Today's Events", icon: Calendar, tone: "bg-javits-blue text-javits-black" },
  { href: "/map", label: "Wayfinding", icon: MapPin, tone: "bg-javits-gold text-javits-black" },
  { href: "/offers", label: "Explore NYC", icon: Sparkles, tone: "bg-javits-green text-javits-white" },
  { href: "/safety", label: "Safety & ADA", icon: LifeBuoy, tone: "bg-white text-javits-black" },
];

export default function KioskHome() {
  return (
    <main className="relative min-h-dvh overflow-hidden">
      <DotPatternAccent color="gold" density="sparse" className="absolute top-0 right-0 w-64 h-64 opacity-30" />
      <header className="relative z-10 px-10 pt-16 flex items-center justify-between">
        <JavitsLogo variant="primary-white" size={120} />
        <p className="headline tracking-headline text-javits-gold text-xl">Campus Kiosk</p>
      </header>
      <section className="relative z-10 px-10 mt-16">
        <p className="text-javits-gold text-sm headline tracking-headline">{voice.positioning}</p>
        <h1 className="headline text-[clamp(3.5rem,7vw,6rem)] leading-none mt-2">
          {voice.coreMessage}
        </h1>
      </section>

      <section className="relative z-10 grid grid-cols-2 gap-6 px-10 mt-16 pb-64">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`rounded-xl p-10 ${t.tone} shadow-lift flex flex-col gap-4`}
            >
              <Icon size={56} strokeWidth={2} />
              <div className="headline text-4xl leading-none">{t.label}</div>
            </Link>
          );
        })}
      </section>

      <GradientWave variant="fade-to-black" className="h-64" />
    </main>
  );
}
