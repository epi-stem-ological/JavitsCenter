# Javits Wayfinder Design System

Canonical design tokens + web React components for the Javits Wayfinder
product family (mobile app, web companion, kiosk).

## Brand direction

Professional, clear, high-trust, fast, calm under pressure. "Mission-critical
venue companion," not consumer social app.

- **Inspiration:** Apple Maps clarity · Google Maps usefulness · Cisco
  enterprise polish · NYC signage confidence
- **Never:** heavy gradients, gimmicks, cartoonish icons, playful chaos
- **Contrast:** WCAG 2.2 AA minimum for body text; large type on anything
  read while walking
- **One primary action per view.** Search is the fastest path into the app.

## What's in here

| Piece | File | Notes |
| --- | --- | --- |
| Tokens (canonical) | `src/tokens.ts` | Colors (light + dark), category tints, type scale, 4-pt spacing, radii, elevation, touch targets |
| Tokens as CSS vars | `src/tokens.css` | `--wf-*` prefix; dark via `prefers-color-scheme`. Mirror of tokens.ts — keep in sync by hand |
| Components | `src/components/` | Web React, dependency-free, styled with the CSS variables |

### Components

- `Button` — primary / secondary / ghost / danger; 52px min touch
- `Card` — raised surface, optional elevation
- `Badge` — floor/code/status chips, optional category tint
- `SearchField` — search-first entry ("Where are you headed?")
- `DestinationRow` — search result / list row, 72px min
- `CategoryChip` — home quick-access tiles (Food, Restrooms, Accessibility…)
- `NavBanner` — high-contrast turn-by-turn banner, live-region announced
- `StatusBanner` — calm state banners (location weak, rerouting, offline)
- `FloorSelector` — vertical map floor switcher
- `EventSelector` — "Currently viewing: NRF 2027" context pill
- `RouteStepCard` — route preview step, transition steps highlighted
- `AccessibleRouteToggle` — first-class accessible-route switch

## Consumers

- **Web (`apps/web`)** can import components directly plus `tokens.css`.
- **Mobile (`apps/mobile`)** imports token *values* from
  `@javits/design-system/tokens` and builds its React Native theme from them
  (`apps/mobile/src/design/tokens.ts`). RN components live in the mobile app;
  they are visual siblings of the web components here.

## Syncing to Claude Design

This package is the sync target for Claude Design's "Create using Claude
Code" flow:

```bash
cd packages/design-system
claude
› /design-handoff     # or /design-sync, whichever your Claude Code shows
```

The command reads `src/tokens.ts`, `src/tokens.css`, and the React components
and publishes the system to your org's Design systems list.

## Rules

1. Token values change **here first** (`tokens.ts`), then `tokens.css`, then
   consumers pick them up.
2. No component may hardcode a hex color — always the `--wf-*` variables (web)
   or theme lookup (mobile).
3. New components need: accessible labels, visible focus, and a minimum touch
   target (52px CTA / 44px secondary).
