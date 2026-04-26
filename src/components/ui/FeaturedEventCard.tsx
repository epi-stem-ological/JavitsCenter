import Link from "next/link";
import { format } from "date-fns";
import type { Event, FeaturedPlacement } from "@/types/models";
import { SponsoredBadge } from "./SponsoredBadge";
import { BrandArrow } from "@/components/brand/BrandArrow";
import { cn } from "@/lib/utils";

const heroBg: Record<Event["heroColor"], string> = {
  gold: "bg-javits-gold text-javits-black",
  green: "bg-javits-green text-javits-white",
  blue: "bg-javits-blue text-javits-black",
};

export function FeaturedEventCard({
  event,
  placement,
  className,
}: {
  event: Event;
  placement?: FeaturedPlacement;
  className?: string;
}) {
  return (
    <Link
      href={`/events/${event.id}`}
      className={cn(
        "group relative flex flex-col justify-between min-h-[180px] rounded-lg overflow-hidden shadow-card transition-transform hover:-translate-y-[2px] hover:shadow-lift",
        heroBg[event.heroColor],
        className
      )}
    >
      <div className="p-4 flex items-start justify-between gap-3">
        {placement && <SponsoredBadge sponsor={placement.sponsorName} />}
        <span className="text-[10px] headline tracking-headline opacity-80 ml-auto">
          {event.hall}
        </span>
      </div>
      <div className="p-4 pt-0">
        <h3 className="headline text-2xl leading-none">{event.title}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs opacity-80">
            {format(new Date(event.startsAt), "MMM d")}–{format(new Date(event.endsAt), "MMM d, yyyy")}
          </span>
          <BrandArrow
            color={event.heroColor === "green" ? "white" : "black"}
            size={22}
            className="opacity-80 group-hover:opacity-100"
          />
        </div>
      </div>
    </Link>
  );
}
