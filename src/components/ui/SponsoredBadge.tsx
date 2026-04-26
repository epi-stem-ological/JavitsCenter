import { cn } from "@/lib/utils";

/**
 * SponsoredBadge — labels paid/featured placements clearly.
 * Required by the spec ("featured/sponsored event cards clearly labeled")
 * and by basic user-trust norms around paid prioritization.
 */
export function SponsoredBadge({
  sponsor,
  className,
}: {
  sponsor?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xs bg-javits-black text-javits-gold px-2 py-[2px] text-[10px] headline tracking-headline",
        className
      )}
    >
      Featured{sponsor ? ` · ${sponsor}` : ""}
    </span>
  );
}
