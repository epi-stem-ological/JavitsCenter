/**
 * Javits Brand Tokens (v1.0 · 2026)
 * --------------------------------
 * Single source of truth for brand values in TypeScript. Tailwind config and
 * globals.css mirror these. Import from here when you need values in JS/TS
 * (e.g., SVG fill, Framer Motion color interpolation, chart colors).
 *
 * RULE: Never hardcode brand hex elsewhere.
 */

export const palette = {
  gold: "#FFCC00",
  green: "#54B147",
  blue: "#05B8EB",
  black: "#000000",
  white: "#FFFFFF",
} as const;

/** Javits Blend gradient stops — Blue → Green (70%) → Gold (100%). Bottom-anchored only. */
export const blend = {
  stops: [
    { pos: 0, hex: palette.blue },
    { pos: 0.7, hex: palette.green },
    { pos: 1, hex: palette.gold },
  ],
  cssLinear: `linear-gradient(90deg, ${palette.blue} 0%, ${palette.green} 70%, ${palette.gold} 100%)`,
} as const;

/** Voice tokens from the brand messaging section. Use for demo copy. */
export const voice = {
  coreMessage: "BUILT TO TRANSFORM.",
  positioning: "THE TRANSFORMATION EPICENTER OF NEW YORK",
  pillars: [
    "The Center for Inspiration",
    "Connections Into Movements",
    "People-Powered Excellence",
    "Sustainability With Heart",
  ],
} as const;

export type BrandColor = keyof typeof palette;
