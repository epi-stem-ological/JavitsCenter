"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, MapPin, Tag, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/map", label: "Map", icon: MapPin },
  { href: "/offers", label: "Offers", icon: Tag },
  { href: "/profile", label: "Profile", icon: User },
];

/**
 * BottomNav — mobile primary nav, fixed to the bottom viewport.
 * Respects iOS safe area. Active tab uses Javits Gold as the accent.
 */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur"
      style={{ paddingBottom: "var(--safe-area-bottom)" }}
    >
      <ul className="grid grid-cols-5 max-w-xl mx-auto">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(href + "/");
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] headline tracking-headline transition-colors",
                  active ? "text-javits-black" : "text-fg-muted"
                )}
              >
                <span
                  className={cn(
                    "relative inline-flex h-9 w-9 items-center justify-center rounded-md",
                    active && "bg-javits-gold text-javits-black"
                  )}
                >
                  <Icon size={18} strokeWidth={2.2} />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
