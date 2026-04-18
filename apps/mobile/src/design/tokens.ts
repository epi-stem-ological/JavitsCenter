/**
 * Design tokens — see `docs/04-design-system.md`. Kept minimal and flat so
 * they can be swapped per-theme without changing call sites.
 */
export type ThemeName = 'light' | 'dark';

export interface Theme {
  name: ThemeName;
  color: {
    bg: { base: string; raised: string; sunken: string };
    fg: { primary: string; secondary: string; tertiary: string };
    accent: { primary: string; onPrimary: string };
    status: { success: string; warning: string; danger: string };
    line: string;
    focus: string;
    category: Record<CategoryColorKey, { bg: string; fg: string }>;
  };
  type: Record<TypeToken, { fontSize: number; lineHeight: number; fontWeight: '400' | '600' | '700' }>;
  space: (n: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10) => number;
  radius: { sm: number; md: number; lg: number; pill: number };
  elevation: Record<'e0' | 'e1' | 'e2' | 'e3', string>;
  touch: { minCta: number; minRow: number };
}

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

const spaceScale = [0, 4, 8, 12, 16, 20, 24, 32, 40, 56, 72];

export const lightTheme: Theme = {
  name: 'light',
  color: {
    bg: { base: '#FFFFFF', raised: '#F5F7FA', sunken: '#E9EEF3' },
    fg: { primary: '#0B0F14', secondary: '#4A5564', tertiary: '#7D8693' },
    accent: { primary: '#0057FF', onPrimary: '#FFFFFF' },
    status: { success: '#1C8A53', warning: '#C77A00', danger: '#C2341A' },
    line: '#E2E7EC',
    focus: '#0057FF33',
    category: {
      hall: { bg: '#E8EAF6', fg: '#3949AB' },
      food: { bg: '#FFF3E0', fg: '#F57C00' },
      restroom: { bg: '#ECEFF1', fg: '#455A64' },
      help: { bg: '#F3E5F5', fg: '#6A1B9A' },
      registration: { bg: '#E0F2F1', fg: '#00695C' },
      exit: { bg: '#FFEBEE', fg: '#C2341A' },
      transit: { bg: '#EFEBE9', fg: '#5D4037' },
      default: { bg: '#E9EEF3', fg: '#4A5564' },
    },
  },
  type: {
    display: { fontSize: 34, lineHeight: 40, fontWeight: '700' },
    title: { fontSize: 24, lineHeight: 30, fontWeight: '700' },
    heading: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
    bodyLarge: { fontSize: 17, lineHeight: 24, fontWeight: '400' },
    body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
    label: { fontSize: 13, lineHeight: 18, fontWeight: '600' },
    caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
    navStep: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
  },
  space: (n) => spaceScale[n] ?? 0,
  radius: { sm: 8, md: 12, lg: 20, pill: 999 },
  elevation: {
    e0: 'none',
    e1: '0 1 2 rgba(0,0,0,0.08)',
    e2: '0 8 24 rgba(0,0,0,0.10)',
    e3: '0 16 40 rgba(0,0,0,0.12)',
  },
  touch: { minCta: 52, minRow: 72 },
};

export const darkTheme: Theme = {
  ...lightTheme,
  name: 'dark',
  color: {
    ...lightTheme.color,
    bg: { base: '#0B0F14', raised: '#141A22', sunken: '#0A0E12' },
    fg: { primary: '#F3F6FA', secondary: '#A8B2BF', tertiary: '#6E7885' },
    accent: { primary: '#3E82FF', onPrimary: '#FFFFFF' },
    status: { success: '#2BB473', warning: '#E59A2B', danger: '#E95A3E' },
    line: '#222A33',
    focus: '#3E82FF55',
    category: {
      hall: { bg: '#1A1F4A', fg: '#B8C1F0' },
      food: { bg: '#3A2410', fg: '#F9C27B' },
      restroom: { bg: '#1C242A', fg: '#B8C4CD' },
      help: { bg: '#2A1235', fg: '#D7A7E8' },
      registration: { bg: '#0F2A26', fg: '#7CCFB8' },
      exit: { bg: '#3A1612', fg: '#F4A598' },
      transit: { bg: '#2A211D', fg: '#C9B4A8' },
      default: { bg: '#1A2028', fg: '#A8B2BF' },
    },
  },
};
