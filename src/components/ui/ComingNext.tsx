import Link from "next/link";
import { BrandArrow } from "@/components/brand/BrandArrow";
import { DotPatternAccent } from "@/components/brand/DotPatternAccent";

/**
 * ComingNext — a shared branded stub for routes not yet built.
 * Every placeholder uses this component so the Claude Code handoff can swap
 * them out one at a time without shuffling route structure.
 */
export function ComingNext({
  screen,
  description,
  nextPrompt,
}: {
  screen: string;
  description: string;
  nextPrompt: string;
}) {
  return (
    <main className="relative min-h-dvh px-5 pt-12 pb-24">
      <DotPatternAccent
        color="gold"
        density="sparse"
        className="absolute top-0 right-0 w-32 h-32 opacity-30"
      />
      <p className="text-xs headline tracking-headline text-fg-muted">Coming next</p>
      <h1 className="headline text-4xl mt-2 leading-none">{screen}</h1>
      <p className="text-sm text-fg-muted mt-3 max-w-md">{description}</p>

      <div className="mt-6 rounded-lg border border-line bg-white p-4 shadow-card">
        <div className="text-[11px] headline tracking-headline text-javits-blue">
          Claude Code prompt
        </div>
        <p className="text-sm text-fg mt-2 leading-relaxed">{nextPrompt}</p>
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm">
        <Link href="/home" className="headline tracking-headline text-fg hover:opacity-75">
          Back home
        </Link>
        <BrandArrow color="blue" size={18} />
      </div>
    </main>
  );
}
