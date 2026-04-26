import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * JavitsLogo — primary brand identifier.
 * --------------------------------
 * `variant` governs which approved lockup renders. Do NOT compose a new lockup
 * in code (e.g., recoloring the apple icon, or cropping the wordmark). The
 * brand guide is explicit: use one of the approved lockups, full stop.
 */
type Variant =
  | "primary"          // black wordmark + gold apple (on light bg)
  | "primary-white"    // white wordmark + gold apple (on dark bg)
  | "mono-black"
  | "apple-gold"
  | "apple-black";

const variantToSrc: Record<Variant, string> = {
  primary: "/brand/logos/Javits-Center-Logo-Black-Yellow.png",
  "primary-white": "/brand/logos/Javits-Center-Logo-White-Yellow.png",
  "mono-black": "/brand/logos/Javits-Center-Logo-Black.png",
  "apple-gold": "/brand/icons/Javits-Apple-Icon-Yellow.png",
  "apple-black": "/brand/icons/Javits-Apple-Icon-Black.png",
};

export function JavitsLogo({
  variant = "primary",
  className,
  size = 160,
  priority,
}: {
  variant?: Variant;
  className?: string;
  size?: number;
  priority?: boolean;
}) {
  const src = variantToSrc[variant];
  const isApple = variant.startsWith("apple-");
  return (
    <Image
      src={src}
      alt="Javits Center"
      width={isApple ? size : Math.round(size * 2.1)}
      height={isApple ? size : Math.round(size * 0.65)}
      priority={priority}
      className={cn("select-none", className)}
    />
  );
}
