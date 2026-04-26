import { cn } from "@/lib/utils";

/**
 * NycTag — geo identifier used ONLY on external-facing collateral/ads.
 * Only two colorways per the brand guide: dark and light.
 */
export function NycTag({
  variant = "dark",
  className,
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  const isDark = variant === "dark";
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-2 py-1 text-xs headline font-semibold",
        isDark ? "bg-javits-black text-javits-gold" : "bg-javits-gold text-javits-black",
        className
      )}
      aria-label="New York City"
    >
      NYC
    </span>
  );
}
