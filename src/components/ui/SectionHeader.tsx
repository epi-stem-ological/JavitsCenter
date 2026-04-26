import Link from "next/link";
import { cn } from "@/lib/utils";
import { BrandArrow } from "@/components/brand/BrandArrow";

/**
 * SectionHeader — the recurring Javits H2 pattern on scroll screens.
 * Pairs a compressed uppercase headline with an optional right-side link
 * (arrow accent reserved for one prominent use per screen).
 */
export function SectionHeader({
  title,
  subtitle,
  href,
  hrefLabel = "See all",
  className,
  showArrow = false,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
  className?: string;
  showArrow?: boolean;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-4 mb-3", className)}>
      <div>
        <h2 className="headline text-2xl text-fg">{title}</h2>
        {subtitle && <p className="text-sm text-fg-muted mt-1">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="shrink-0 inline-flex items-center gap-1 text-sm headline tracking-headline text-fg hover:opacity-75"
        >
          <span>{hrefLabel}</span>
          {showArrow && <BrandArrow color="blue" size={18} />}
        </Link>
      )}
    </div>
  );
}
