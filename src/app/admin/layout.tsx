"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp, useHasHydrated } from "@/lib/store";

/**
 * Admin layout — organizer-only.
 * --------------------------------
 * v1 guard: blocks anyone whose local role isn't "organizer". This is a
 * prototype-level check; production must gate /admin behind real SSO +
 * server-side role claims, not client state.
 *
 * TODO:
 *  - Replace with middleware.ts that inspects a signed session cookie.
 *  - Add audit logging on admin-route access (who, when, what).
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const hydrated = useHasHydrated();
  const role = useApp((s) => s.role);
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (role !== "organizer") {
      router.replace("/home");
    }
  }, [hydrated, role, router]);

  if (!hydrated || role !== "organizer") {
    return <div className="min-h-dvh bg-bg-subtle" aria-busy="true" />;
  }

  return <div className="min-h-dvh bg-bg-subtle pb-16">{children}</div>;
}
