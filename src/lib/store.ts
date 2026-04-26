"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Role } from "@/types/models";

/**
 * App-level Zustand store.
 * --------------------------------
 * Persists role selection, marketing consent (with capture timestamp), and
 * onboarding state to localStorage so a returning visitor skips the splash
 * and role screens.
 *
 * Notes:
 *  - `skipHydration: true` — Next.js SSRs with the initial state, then we
 *    rehydrate on the client via `useHasHydrated`. Without this, layouts
 *    that branch on role would flash the "null role" state for one frame
 *    and trip hydration mismatch warnings.
 *  - Consent is stored as `{ optIn, capturedAt }` so it's auditable. The
 *    CRM adapter refuses to sync leads without a capture timestamp; this
 *    is the source of truth for that timestamp.
 *  - Domain data (events, offers, bookings) lives behind service adapters,
 *    not in global state.
 */

export type MarketingConsent = {
  optIn: boolean;
  capturedAt: string | null; // ISO timestamp; null means user has never answered
};

type AppState = {
  role: Role | null;
  onboardingComplete: boolean;
  marketingConsent: MarketingConsent;
  savedEventIds: string[];
  claimedOfferIds: string[];
  completedSurveyIds: string[];

  setRole: (role: Role) => void;
  clearRole: () => void;
  completeOnboarding: () => void;
  setMarketingOptIn: (v: boolean) => void;
  toggleSaveEvent: (id: string) => void;
  claimOffer: (id: string) => void;
  completeSurvey: (id: string) => void;
  resetAll: () => void;
};

const initialState = {
  role: null,
  onboardingComplete: false,
  marketingConsent: { optIn: false, capturedAt: null } as MarketingConsent,
  savedEventIds: [],
  claimedOfferIds: [],
  completedSurveyIds: [],
};

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setRole: (role) => set({ role }),
      clearRole: () => set({ role: null }),
      completeOnboarding: () => set({ onboardingComplete: true }),
      setMarketingOptIn: (v) =>
        set({
          marketingConsent: {
            optIn: v,
            capturedAt: new Date().toISOString(),
          },
        }),
      toggleSaveEvent: (id) =>
        set({
          savedEventIds: get().savedEventIds.includes(id)
            ? get().savedEventIds.filter((x) => x !== id)
            : [...get().savedEventIds, id],
        }),
      claimOffer: (id) =>
        set({
          claimedOfferIds: Array.from(new Set([...get().claimedOfferIds, id])),
        }),
      completeSurvey: (id) =>
        set({
          completedSurveyIds: Array.from(
            new Set([...get().completedSurveyIds, id])
          ),
        }),
      resetAll: () => set(initialState),
    }),
    {
      name: "javits-app-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      version: 2,
      // v1 → v2: `marketingOptIn: boolean` became `marketingConsent: {...}`
      migrate: (persisted, version) => {
        if (!persisted || typeof persisted !== "object") return persisted;
        if (version < 2) {
          const legacy = persisted as { marketingOptIn?: boolean };
          return {
            ...persisted,
            marketingConsent: {
              optIn: !!legacy.marketingOptIn,
              capturedAt: legacy.marketingOptIn ? new Date().toISOString() : null,
            },
          };
        }
        return persisted;
      },
    }
  )
);

/**
 * Hook: `true` once the persisted store has rehydrated from localStorage.
 * Guards any UI that branches on role/consent to avoid SSR/CSR mismatches
 * and the "I see attendee home for one frame" flash.
 */
export function useHasHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // Rehydrate on mount (we set skipHydration above).
    useApp.persist.rehydrate();
    const unsub = useApp.persist.onFinishHydration(() => setHydrated(true));
    // If hydration already finished before we subscribed, catch that.
    if (useApp.persist.hasHydrated()) setHydrated(true);
    return () => unsub();
  }, []);
  return hydrated;
}
