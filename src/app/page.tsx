"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { JavitsLogo } from "@/components/brand/JavitsLogo";
import { DotPatternAccent } from "@/components/brand/DotPatternAccent";
import { GradientWave } from "@/components/brand/GradientWave";
import { Button } from "@/components/ui/Button";
import { voice } from "@/lib/tokens";
import { useApp, useHasHydrated } from "@/lib/store";

/**
 * Splash / Launch screen.
 * --------------------------------
 * Brand-first entry: core message "BUILT TO TRANSFORM", gold accent, gradient
 * wave anchored to the bottom, sparse dot pattern in the upper-right as the
 * tertiary accent (per brand rules — never full bleed).
 *
 * Returning-user redirect: if the persisted store shows the user has already
 * completed onboarding, send them onward. We only redirect AFTER hydration so
 * first-time visitors see the splash, and we don't flash the marketing hero at
 * daily users.
 *   - onboarded + role         → /home
 *   - onboarded, no role       → /role
 *   - first time               → render splash, wait for CTA
 */
export default function SplashPage() {
  const router = useRouter();
  const hydrated = useHasHydrated();
  const onboardingComplete = useApp((s) => s.onboardingComplete);
  const role = useApp((s) => s.role);

  useEffect(() => {
    if (!hydrated) return;
    if (onboardingComplete && role) {
      router.replace("/home");
    } else if (onboardingComplete) {
      router.replace("/role");
    }
  }, [hydrated, onboardingComplete, role, router]);

  // While we hydrate, render the splash's dark background so a returning user
  // doesn't see a white flash before the redirect lands.
  const willRedirect = hydrated && onboardingComplete;

  return (
    <main className="relative min-h-dvh bg-javits-black text-javits-white overflow-hidden">
      {/* Tertiary dot-pattern accent, sparse + corner-only */}
      <DotPatternAccent
        color="gold"
        density="sparse"
        className="absolute top-0 right-0 w-40 h-40 opacity-30"
      />

      {/* Brand lockup */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: willRedirect ? 0 : 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 pt-14 px-6 flex items-center"
      >
        <JavitsLogo variant="primary-white" size={96} priority />
      </motion.div>

      {/* Core message */}
      <div className="relative z-10 mt-20 px-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: willRedirect ? 0 : 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-javits-gold text-xs headline tracking-headline"
        >
          The Campus Companion
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: willRedirect ? 0 : 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="headline text-[clamp(3.25rem,11vw,5.5rem)] text-javits-white mt-2"
        >
          {voice.coreMessage}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: willRedirect ? 0 : 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-sm mt-4 text-base text-javits-white/80"
        >
          Discover events, navigate the campus, book quiet space, and explore the city —
          all from one place.
        </motion.p>
      </div>

      {/* CTA (one arrow accent per layout — used here, NOT elsewhere on splash) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: willRedirect ? 0 : 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="relative z-10 mt-10 px-6"
      >
        <Button href="/onboarding" intent="primary" size="lg" withArrow>
          Get Started
        </Button>
      </motion.div>

      {/* Bottom-anchored gradient wave — brand-mandated placement */}
      <GradientWave variant="fade-to-black" />
    </main>
  );
}
