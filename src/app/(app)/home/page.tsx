"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BellDot, BookOpen, ChartArea, ClipboardCheck, DoorOpen, LifeBuoy, Sparkles } from "lucide-react";
import { format, isAfter } from "date-fns";
import { useApp } from "@/lib/store";
import type { Role } from "@/types/models";
import { events, featured, offers, notifications } from "@/data/seed";
import { JavitsLogo } from "@/components/brand/JavitsLogo";
import { DotPatternAccent } from "@/components/brand/DotPatternAccent";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeaturedEventCard } from "@/components/ui/FeaturedEventCard";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { Card, CardBody } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const roleGreeting: Record<Role, { hi: string; sub: string }> = {
  attendee: { hi: "Welcome to the floor.", sub: "Your event, your city — curated." },
  exhibitor: { hi: "Let's run a great show.", sub: "Booth support, logistics, and quiet space." },
  tenant: { hi: "Welcome home.", sub: "Building services, announcements, and amenities." },
  organizer: { hi: "Command center.", sub: "Placements, services, and real-time impact." },
};

const quickActions: Record<
  Role,
  { href: string; label: string; tone: "gold" | "blue" | "green" | "black"; icon: React.ComponentType<{ size?: number; className?: string }>; hint: string }[]
> = {
  attendee: [
    { href: "/quiet-cove", label: "Book Quiet Cove", tone: "gold", icon: DoorOpen, hint: "Locked focus pods" },
    { href: "/surveys", label: "Unlock a perk", tone: "green", icon: ClipboardCheck, hint: "1-min pulse survey" },
    { href: "/offers", label: "NYC Offers", tone: "blue", icon: Sparkles, hint: "Dining · Attractions" },
    { href: "/safety", label: "Safety & ADA", tone: "black", icon: LifeBuoy, hint: "Evacuation · accessibility" },
  ],
  exhibitor: [
    { href: "/map", label: "Find my booth", tone: "gold", icon: DoorOpen, hint: "Wayfinding + load-in" },
    { href: "/quiet-cove", label: "Quiet Cove", tone: "green", icon: DoorOpen, hint: "Take a call" },
    { href: "/surveys", label: "Exhibitor check-in", tone: "blue", icon: ClipboardCheck, hint: "2 min" },
    { href: "/safety", label: "Emergency map", tone: "black", icon: LifeBuoy, hint: "Exits · AEDs" },
  ],
  tenant: [
    { href: "/map", label: "Building services", tone: "gold", icon: DoorOpen, hint: "Dining · Amenities" },
    { href: "/offers", label: "Lunch deals", tone: "blue", icon: Sparkles, hint: "Partner restaurants" },
    { href: "/quiet-cove", label: "Quiet Cove", tone: "green", icon: DoorOpen, hint: "Daily rate" },
    { href: "/safety", label: "Safety info", tone: "black", icon: LifeBuoy, hint: "ADA · evacuation" },
  ],
  organizer: [
    { href: "/admin", label: "Admin dashboard", tone: "gold", icon: ChartArea, hint: "KPIs · placements" },
    { href: "/events", label: "Manage events", tone: "blue", icon: BookOpen, hint: "Featured priority" },
    { href: "/surveys", label: "Survey center", tone: "green", icon: ClipboardCheck, hint: "Participation" },
    { href: "/safety", label: "Safety protocols", tone: "black", icon: LifeBuoy, hint: "Muster + ADA" },
  ],
};

const toneBg: Record<string, string> = {
  gold: "bg-javits-gold text-javits-black",
  blue: "bg-javits-blue text-javits-black",
  green: "bg-javits-green text-javits-white",
  black: "bg-javits-black text-javits-white",
};

export default function HomePage() {
  const role = useApp((s) => s.role) ?? "attendee";
  const greeting = roleGreeting[role];
  const actions = quickActions[role];

  // Merge featured placements into events, sort premium-first then chronological
  const upcoming = [...events]
    .filter((e) => isAfter(new Date(e.endsAt), new Date()))
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  const featuredEvents = featured
    .map((f) => ({ placement: f, event: events.find((e) => e.id === f.eventId) }))
    .filter((x): x is { placement: typeof featured[number]; event: (typeof events)[number] } => !!x.event)
    .sort((a, b) => a.placement.rank - b.placement.rank);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const topOffer = offers[0];

  return (
    <main className="relative">
      {/* Gold strip header — ties home to the brand at first glance */}
      <header className="relative bg-javits-black text-javits-white overflow-hidden">
        <DotPatternAccent
          color="gold"
          density="sparse"
          className="absolute top-0 right-0 w-40 h-40 opacity-25"
        />
        <div className="relative z-10 px-5 pt-10 pb-8">
          <div className="flex items-center justify-between">
            <JavitsLogo variant="primary-white" size={64} />
            <Link
              href="/notifications"
              aria-label="Notifications"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/10 hover:bg-white/20"
            >
              <BellDot size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-javits-gold" />
              )}
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <RoleBadge role={role} />
            <span className="text-[11px] headline tracking-headline text-javits-white/70">
              {format(new Date(), "EEE, MMM d")}
            </span>
          </div>
          <h1 className="headline text-4xl mt-3 leading-none">{greeting.hi}</h1>
          <p className="text-sm text-javits-white/80 mt-2 max-w-sm">{greeting.sub}</p>
        </div>
      </header>

      {/* Quick actions */}
      <section className="px-5 -mt-5">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div
                key={a.href}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={a.href}
                  className={cn(
                    "block rounded-lg p-4 h-[92px] shadow-card",
                    toneBg[a.tone]
                  )}
                >
                  <Icon size={22} className="opacity-95" />
                  <div className="mt-2 headline text-base leading-none">{a.label}</div>
                  <div className="text-[11px] mt-1 opacity-80">{a.hint}</div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured — sponsored placements clearly labeled */}
      <section className="px-5 mt-8">
        <SectionHeader title="Featured" subtitle="Sponsored placements" href="/events" hrefLabel="All events" showArrow />
        <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-2 snap-x snap-mandatory">
          {featuredEvents.map(({ event, placement }) => (
            <div key={event.id} className="snap-start min-w-[82%]">
              <FeaturedEventCard event={event} placement={placement} />
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming — chronological */}
      <section className="px-5 mt-8">
        <SectionHeader title="Upcoming" href="/events" hrefLabel="See all" />
        <ul className="space-y-3">
          {upcoming.slice(0, 4).map((e) => (
            <li key={e.id}>
              <Link
                href={`/events/${e.id}`}
                className="flex items-center gap-3 rounded-lg bg-white border border-line shadow-card p-3 hover:-translate-y-[1px] transition-transform"
              >
                <div
                  className={cn(
                    "h-12 w-12 rounded-md flex items-center justify-center headline text-lg",
                    e.heroColor === "gold" && "bg-javits-gold text-javits-black",
                    e.heroColor === "blue" && "bg-javits-blue text-javits-black",
                    e.heroColor === "green" && "bg-javits-green text-javits-white"
                  )}
                >
                  {format(new Date(e.startsAt), "d")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="headline text-base truncate">{e.title}</div>
                  <div className="text-xs text-fg-muted">
                    {e.hall} · {format(new Date(e.startsAt), "MMM d")}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Role-specific row */}
      <section className="px-5 mt-8">
        {role === "organizer" ? (
          <OrganizerSnapshot />
        ) : role === "exhibitor" ? (
          <ExhibitorServicesRow />
        ) : role === "tenant" ? (
          <TenantServicesRow />
        ) : (
          <PartnerOfferTease offer={topOffer} />
        )}
      </section>
    </main>
  );
}

function OrganizerSnapshot() {
  return (
    <Card>
      <CardBody>
        <div className="headline text-xl">Today&apos;s Snapshot</div>
        <div className="grid grid-cols-3 gap-2 mt-3 text-center">
          <StatBlock label="Bookings" value="42" />
          <StatBlock label="Leads" value="128" />
          <StatBlock label="Claims" value="76" />
        </div>
        <Link
          href="/admin"
          className="mt-4 inline-block text-xs headline tracking-headline text-javits-blue"
        >
          Open admin dashboard →
        </Link>
      </CardBody>
    </Card>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-bg-subtle py-3">
      <div className="headline text-2xl leading-none">{value}</div>
      <div className="text-[10px] headline tracking-headline text-fg-muted mt-1">{label}</div>
    </div>
  );
}

function ExhibitorServicesRow() {
  return (
    <Card>
      <CardBody>
        <div className="headline text-xl">Booth Support</div>
        <p className="text-sm text-fg-muted mt-1">
          Rigging, AV, internet, shipping, catering — request any service right from here.
        </p>
        <Link href="/map" className="mt-3 inline-block text-xs headline tracking-headline text-javits-blue">
          Open service directory →
        </Link>
      </CardBody>
    </Card>
  );
}

function TenantServicesRow() {
  return (
    <Card>
      <CardBody>
        <div className="headline text-xl">Building Services</div>
        <p className="text-sm text-fg-muted mt-1">
          Dining, mail, maintenance, and amenities tailored to tenants.
        </p>
        <Link href="/map" className="mt-3 inline-block text-xs headline tracking-headline text-javits-blue">
          See what&apos;s nearby →
        </Link>
      </CardBody>
    </Card>
  );
}

function PartnerOfferTease({ offer }: { offer: (typeof offers)[number] }) {
  return (
    <Card>
      <CardBody className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-md bg-javits-gold flex items-center justify-center headline">
          {offer.discountLabel.split(" ")[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="headline text-base">{offer.partnerName}</div>
          <div className="text-xs text-fg-muted truncate">{offer.headline}</div>
        </div>
        <Link href="/offers" className="text-xs headline tracking-headline text-javits-blue">
          Explore →
        </Link>
      </CardBody>
    </Card>
  );
}
