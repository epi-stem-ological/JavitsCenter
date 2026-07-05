/**
 * Mobile theme built from the CANONICAL tokens in `@javits/design-system`.
 * Do not add raw color/size values here — change them in
 * `packages/design-system/src/tokens.ts` so web and mobile stay in sync.
 */
import {
  palette,
  categoryPalette,
  typeScale,
  spacingScale,
  radii,
  elevationShadows,
  touchTargets,
  type TypeToken,
  type CategoryColorKey,
} from '@javits/design-system/tokens';

export type { TypeToken, CategoryColorKey };

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

function buildTheme(name: ThemeName): Theme {
  return {
    name,
    color: {
      ...palette[name],
      category: categoryPalette[name],
    },
    type: typeScale,
    space: (n) => spacingScale[n] ?? 0,
    radius: radii,
    elevation: elevationShadows,
    touch: touchTargets,
  };
}

export const lightTheme: Theme = buildTheme('light');
export const darkTheme: Theme = buildTheme('dark');
