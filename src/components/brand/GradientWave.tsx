import { cn } from "@/lib/utils";

/**
 * GradientWave — bottom-anchored Javits brand blend.
 * --------------------------------
 * Per the brand guide:
 *  - MUST always live at the base of the layout.
 *  - MUST NOT rotate/tilt/top-position — we don't expose a `position` prop.
 *  - Always displays the full spectrum (Blue → Green → Gold). Monochromatic
 *    applications of the dot matrix are prohibited.
 *  - Two variants: fade-to-white, fade-to-black.
 */
export function GradientWave({
  variant = "fade-to-black",
  className,
  "aria-hidden": ariaHidden = true,
}: {
  variant?: "fade-to-white" | "fade-to-black";
  className?: string;
  "aria-hidden"?: boolean;
}) {
  const isLight = variant === "fade-to-white";

  return (
    <div
      aria-hidden={ariaHidden}
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 h-48 overflow-hidden",
        className
      )}
    >
      {/* Fade layer — background color the wave fades out into */}
      <div
        className="absolute inset-0"
        style={{
          background: isLight
            ? "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 100%)"
            : "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)",
        }}
      />
      {/* The blend: blue → green → gold. Always this order. */}
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,184,235,0.85) 0%, rgba(84,177,71,0.85) 65%, rgba(255,204,0,0.9) 100%)",
          mixBlendMode: isLight ? "multiply" : "screen",
          filter: "blur(32px)",
          transform: "translateY(20%)",
        }}
      />
      {/* Dot-matrix suggestion layered on top to hint at the wave without the photo */}
      <svg
        className="absolute inset-0 w-full h-full opacity-80"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveBlend" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#05B8EB" />
            <stop offset="70%" stopColor="#54B147" />
            <stop offset="100%" stopColor="#FFCC00" />
          </linearGradient>
        </defs>
        {Array.from({ length: 26 }).map((_, row) => (
          <g key={row} opacity={0.35 + (row / 26) * 0.5}>
            {Array.from({ length: 40 }).map((__, col) => {
              const x = 5 + col * 10;
              const wave = Math.sin((col / 40) * Math.PI * 2 + row * 0.2) * 6;
              const y = 110 + row * 3 + wave;
              return <circle key={col} cx={x} cy={y} r={0.9} fill="url(#waveBlend)" />;
            })}
          </g>
        ))}
      </svg>
    </div>
  );
}
