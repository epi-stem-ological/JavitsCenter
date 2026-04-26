import type { Role } from "@/types/models";
import { cn } from "@/lib/utils";

const labels: Record<Role, string> = {
  attendee: "Attendee",
  exhibitor: "Exhibitor",
  tenant: "Tenant",
  organizer: "Organizer",
};

const colors: Record<Role, string> = {
  attendee: "bg-javits-blue/15 text-javits-blue",
  exhibitor: "bg-javits-gold/20 text-[#8a6b00]",
  tenant: "bg-javits-green/15 text-javits-green",
  organizer: "bg-javits-black text-javits-white",
};

export function RoleBadge({ role, className }: { role: Role; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xs px-2 py-1 text-xs headline tracking-headline",
        colors[role],
        className
      )}
    >
      {labels[role]}
    </span>
  );
}
