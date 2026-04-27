"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, Megaphone, Building2, ClipboardList } from "lucide-react";
import { useApp } from "@/lib/store";
import type { Role } from "@/types/models";
import { JavitsLogo } from "@/components/brand/JavitsLogo";
import { analytics } from "@/services/analytics/analytics";
import { cn } from "@/lib/utils";

/**
 * Role selection.
 * --------------------------------
 * Four personas per spec. Chosen role is persisted to localStorage so the
 * user skips this screen on subsequent visits. The home dashboard branches
 * on this value.
 */
const roles: {
  key: Role;
  title: string;
  blurb: string;
  accent: "blue" | "gold" | "green" | "black";
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}[] = [
  {
    key: "attendee",
    title: "Attendee",
    blurb: "I'm here for an event — help me find my way and make the most of NYC.",
    accent: "blue",
    icon: Users,
  },
  {
    key: "exhibitor",
    title: "Exhibitor / Vendor",
    blurb: "I'm running a booth — I need logistics, services, and quiet space.",
    accent: "gold",
    icon: Megaphone,
  },
  {
    key: "tenant",
    title: "Tenant",
    blurb: "I work in the building — I want services, announcements, and wayfinding.",
    accent: "green",
    icon: Building2,
  },
  {
    key: "organizer",
    title: "Organizer",
    blurb: "I'm producing an event — I need controls, placements, and analytics.",
    accent: "black",
    icon: ClipboardList,
  },
];

const accentBg: Record<string, string> = {
  blue: "bg-javits-blue text-javits-black",
  gold: "bg-javits-gold text-javits-black",
  green: "bg-javits-green text-javits-white",
  black: "bg-javits-black text-javits-white",
};

export default function RolePage() {
  const router = useRouter();
  const setRole = useApp((s) => s.setRole);

  const pick = (role: Role) => {
    setRole(role);
    analytics.track("role_selected", { role });
    router.push("/home");
  };

  return (
    <main className="relative min-h-dvh bg-white">
      <header className="flex items-center justify-between px-5 pt-10 pb-6">
        <JavitsLogo variant="primary" size={72} />
        <span className="text-[11px] headline tracking-headline text-fg-muted">
          Choose role
        </span>
      </header>

      <section className="px-5">
        <h1 className="headline text-4xl leading-none">Who&apos;s using the app?</h1>
        <p className="text-sm text-fg-muted mt-2 max-w-sm">
          The home screen adapts to you. You can switch roles anytime from Profile.
        </p>
      </section>

      <ul className="px-5 mt-6 grid gap-3 pb-10">
        {roles.map((r, i) => {
          const Icon = r.icon;
          return (
            <motion.li
              key={r.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <button
                onClick={() => pick(r.key)}
                className={cn(
                  "w-full text-left rounded-lg overflow-hidden border border-line bg-white shadow-card hover:-translate-y-[2px] hover:shadow-lift transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-javits-gold"
                )}
              >
                <div className="flex">
                  <div
                    className={cn(
                      "w-20 flex items-center justify-center",
                      accentBg[r.accent]
                    )}
                  >
                    <Icon size={26} strokeWidth={2} />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="headline text-xl">{r.title}</div>
                    <p className="text-sm text-fg-muted mt-1">{r.blurb}</p>
                  </div>
                </div>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </main>
  );
}
