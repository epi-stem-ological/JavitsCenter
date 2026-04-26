import { cn } from "@/lib/utils";

/**
 * DotPatternAccent — the frit-pattern tertiary accent.
 * --------------------------------
 * Per the brand guide:
 *  - Designed as a tertiary accent only.
 *  - Sparse at handheld scale, denser at large format.
 *  - NEVER as a full-bleed background — that is why `density` tops out
 *    at "dense" and the component caps opacity and size.
 */
export function DotPatternAccent({
  color = "gold",
  density = "sparse",
  className,
  "aria-hidden": ariaHidden = true,
}: {
  color?: "gold" | "green" | "blue" | "black" | "white";
  density?: "sparse" | "medium" | "dense";
  className?: string;
  "aria-hidden"?: boolean;
}) {
  const hex = {
    gold: "#FFCC00",
    green: "#54B147",
    blue: "#05B8EB",
    black: "#000000",
    white: "#FFFFFF",
  }[color];

  const gap = { sparse: 18, medium: 12, dense: 8 }[density];
  const radius = { sparse: 1.6, medium: 1.8, dense: 2 }[density];

  // Small SVG tile repeats via background-size for cheap performance
  const tile = `url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${gap}' height='${gap}'><circle cx='${gap / 2}' cy='${gap / 2}' r='${radius}' fill='${hex}'/></svg>`
  )}")`;

  return (
    <div
      aria-hidden={ariaHidden}
      className={cn("pointer-events-none opacity-60", className)}
      style={{
        backgroundImage: tile,
        backgroundRepeat: "repeat",
        backgroundSize: `${gap}px ${gap}px`,
      }}
    />
  );
}
