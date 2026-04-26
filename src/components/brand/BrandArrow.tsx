import { cn } from "@/lib/utils";

/**
 * BrandArrow — the Javits directional accent.
 * --------------------------------
 * Per the brand guide:
 *  - MUST always point right.
 *  - MUST NOT be rotated/reversed — there is deliberately no `direction` prop.
 *  - Only one per layout. (We can't enforce this at the component level;
 *    enforce it at the screen level and in review.)
 *  - Only approved brand colors.
 */
export function BrandArrow({
  color = "blue",
  size = 24,
  className,
}: {
  color?: "blue" | "green" | "gold" | "black" | "white";
  size?: number;
  className?: string;
}) {
  const hex = {
    blue: "#05B8EB",
    green: "#54B147",
    gold: "#FFCC00",
    black: "#000000",
    white: "#FFFFFF",
  }[color];

  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 50 30"
      fill="none"
      aria-hidden="true"
      className={cn("inline-block shrink-0", className)}
    >
      {/* Right-pointing chevron with mid shaft. NEVER rotate this component. */}
      <path
        d="M32 2 L48 15 L32 28 M48 15 L0 15"
        stroke={hex}
        strokeWidth="5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
    </svg>
  );
}
