/**
 * Javits Wayfinder design tokens — CANONICAL SOURCE.
 *
 * These values are consumed by:
 *  - this package's web React components (via CSS variables in tokens.css,
 *    which mirror these values 1:1)
 *  - the Expo mobile app's theme (`apps/mobile/src/design/tokens.ts` imports
 *    from here and builds its RN Theme objects)
 *
 * If you change a value, change it here. tokens.css must be kept in sync by
 * hand (documented at the top of that file).
 *
 * Brand direction: professional, high-trust, calm under pressure. Apple Maps
 * clarity + NYC signage confidence. No gradients, no gimmicks. See README.
 */

export type TypeToken =
  | 'display'
  | 'title'
  | 'heading'
  | 'bodyLarge'
  | 'body'
  | 'label'
  | 'caption'
  | 'navStep';

export type CategoryColorKey =
  | 'hall'
  | 'food'
  | 'restroom'
  | 'help'
  | 'registration'
  | 'exit'
  | 'transit'
  | 'default';

export interface TypeStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: '400' | '600' | '700';
}

export interface PaletteScheme {
  bg: { base: string; raised: string; sunken: string };
  fg: { primary: string; secondary: string; tertiary: string };
  accent: { primary: string; onPrimary: string };
  status: { success: string; warning: string; danger: string };
  line: string;
  focus: string;
}

export const palette: Record<'light' | 'dark', PaletteScheme> = {
  light: {
    bg: { base: '#FFFFFF', raised: '#F5F7FA', sunken: '#E9EEF3' },
    fg: { primary: '#0B0F14', secondary: '#4A5564', tertiary: '#7D8693' },
    accent: { primary: '#0057FF', onPrimary: '#FFFFFF' },
    status: { success: '#1C8A53', warning: '#C77A00', danger: '#C2341A' },
    line: '#E2E7EC',
    focus: '#0057FF33',
  },
  dark: {
    bg: { base: '#0B0F14', raised: '#141A22', sunken: '#0A0E12' },
    fg: { primary: '#F3F6FA', secondary: '#A8B2BF', tertiary: '#6E7885' },
    accent: { primary: '#3E82FF', onPrimary: '#FFFFFF' },
    status: { success: '#2BB473', warning: '#E59A2B', danger: '#E95A3E' },
    line: '#222A33',
    focus: '#3E82FF55',
  },
};

export const categoryPalette: Record<
  'light' | 'dark',
  Record<CategoryColorKey, { bg: string; fg: string }>
> = {
  light: {
    hall: { bg: '#E8EAF6', fg: '#3949AB' },
    food: { bg: '#FFF3E0', fg: '#F57C00' },
    restroom: { bg: '#ECEFF1', fg: '#455A64' },
    help: { bg: '#F3E5F5', fg: '#6A1B9A' },
    registration: { bg: '#E0F2F1', fg: '#00695C' },
    exit: { bg: '#FFEBEE', fg: '#C2341A' },
    transit: { bg: '#EFEBE9', fg: '#5D4037' },
    default: { bg: '#E9EEF3', fg: '#4A5564' },
  },
  dark: {
    hall: { bg: '#1A1F4A', fg: '#B8C1F0' },
    food: { bg: '#3A2410', fg: '#F9C27B' },
    restroom: { bg: '#1C242A', fg: '#B8C4CD' },
    help: { bg: '#2A1235', fg: '#D7A7E8' },
    registration: { bg: '#0F2A26', fg: '#7CCFB8' },
    exit: { bg: '#3A1612', fg: '#F4A598' },
    transit: { bg: '#2A211D', fg: '#C9B4A8' },
    default: { bg: '#1A2028', fg: '#A8B2BF' },
  },
};

export const typeScale: Record<TypeToken, TypeStyle> = {
  display: { fontSize: 34, lineHeight: 40, fontWeight: '700' },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700' },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  bodyLarge: { fontSize: 17, lineHeight: 24, fontWeight: '400' },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '600' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  navStep: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
};

/** Index with 1..10; 0 is intentionally 0. */
export const spacingScale = [0, 4, 8, 12, 16, 20, 24, 32, 40, 56, 72] as const;

export const radii = { sm: 8, md: 12, lg: 20, pill: 999 } as const;

export const elevationShadows = {
  e0: 'none',
  e1: '0 1px 2px rgba(0,0,0,0.08)',
  e2: '0 8px 24px rgba(0,0,0,0.10)',
  e3: '0 16px 40px rgba(0,0,0,0.12)',
} as const;

/** Minimum touch targets (dp/px). WCAG 2.2 AA-minded. */
export const touchTargets = { minCta: 52, minRow: 72 } as const;

export const fontFamily =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', Roboto, sans-serif";
