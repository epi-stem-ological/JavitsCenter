"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/nav/BottomNav";
import { useApp, useHasHydrated } from "@/lib/store";

/**
 * (app) route group — wraps every in-app screen with the persistent bottom
 * nav AND guards the routes behind onboarding + role selection.
 *
 * Why client-side:
 *  - Auth state lives in localStorage (no server session yet).
 *  - When real auth lands, swap this for middleware.ts with a cookie check.
 *
 * Hydration guard: `useHasHydrated` ensures we don't redirect on the
 * server's initial render (where role is always null). Otherwise every
 * returning user would briefly bounce through /role.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const hydrated = useHasHydrated();
  const role = useApp((s) => s.role);
  const onboardingComplete = useApp((s) => s.onboardingComplete);
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!onboardingComplete) {
      router.replace("/onboarding");
      return;
    }
    if (!role) {
      router.replace("/role");
    }
  }, [hydrated, onboardingComplete, role, router]);

  // Render a quiet placeholder while we hydrate or while the redirect is in
  // flight. Anything branded here would produce a visible flash.
  if (!hydrated || !onboardingComplete || !role) {
    return <div className="min-h-dvh bg-bg-subtle" aria-busy="true" />;
  }

  return (
    <div className="min-h-dvh bg-bg-subtle pb-24">
      {children}
      <BottomNav />
    </div>
  );
}
