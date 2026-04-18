# Design System

A minimal, premium, high-contrast system optimized for large-venue glanceability.

## Design principles
1. **Glanceable over dense.** Arm's-length reading in a crowd. Big type,
   single dominant action per screen.
2. **One primary action per view.** Start, Preview, Open in app. Secondary
   actions demote to ghost buttons.
3. **State is visible.** Loading, off-route, rerouting, arrived, permission
   denied — all have distinct, non-blocking states.
4. **Never block on mock data.** Skeletons, not spinners, for data the user
   is waiting to scan.
5. **Contrast floor.** We assume the app is used in bright lobbies and dim
   hall interiors. AA minimum; AAA where feasible.

## Color tokens

Two themes. Names are semantic; values below are the default light theme.

| Token              | Light       | Dark        | Purpose                      |
| ------------------ | ----------- | ----------- | ---------------------------- |
| `bg.base`          | `#FFFFFF`   | `#0B0F14`   | Screen background            |
| `bg.raised`        | `#F5F7FA`   | `#141A22`   | Cards, sheets                |
| `bg.sunken`        | `#E9EEF3`   | `#0A0E12`   | Map backdrop                 |
| `fg.primary`       | `#0B0F14`   | `#F3F6FA`   | Headings, body               |
| `fg.secondary`     | `#4A5564`   | `#A8B2BF`   | Supporting copy              |
| `fg.tertiary`      | `#7D8693`   | `#6E7885`   | Hints, placeholders          |
| `accent.primary`   | `#0057FF`   | `#3E82FF`   | Primary CTA, route polyline  |
| `accent.onPrimary` | `#FFFFFF`   | `#FFFFFF`   | Text on primary              |
| `status.success`   | `#1C8A53`   | `#2BB473`   | Arrived, step-free           |
| `status.warning`   | `#C77A00`   | `#E59A2B`   | Slow, crowded                |
| `status.danger`    | `#C2341A`   | `#E95A3E`   | Off-route, errors            |
| `line.default`     | `#E2E7EC`   | `#222A33`   | Hairlines, dividers          |
| `focus.ring`       | `#0057FF33` | `#3E82FF55` | Focus ring                   |

Categories are tinted with semantic pairs (bg + fg):
- halls `#3949AB` / `#E8EAF6`
- food `#F57C00` / `#FFF3E0`
- restrooms `#455A64` / `#ECEFF1`
- help `#6A1B9A` / `#F3E5F5`
- registration `#00695C` / `#E0F2F1`
- exits `#C2341A` / `#FFEBEE`
- elevators/stairs/escalators `#5D4037` / `#EFEBE9`

## Type scale
System font (SF/Segoe/Inter depending on platform). One weight per step.

| Token        | Size | Line | Weight | Usage                |
| ------------ | ---- | ---- | ------ | -------------------- |
| `display`    | 34   | 40   | 700    | Hero headings        |
| `title`      | 24   | 30   | 700    | Screen titles        |
| `heading`    | 18   | 24   | 600    | Section headings     |
| `bodyLarge`  | 17   | 24   | 400    | Primary body         |
| `body`       | 15   | 22   | 400    | Secondary body       |
| `label`      | 13   | 18   | 600    | Chips, metadata      |
| `caption`    | 12   | 16   | 400    | Hints, legal         |
| `nav.step`   | 28   | 34   | 700    | Navigation banner    |

## Spacing
4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 56. Gutters default 16 mobile, 24 web.

## Radii
- `sm` 8 (chips, inputs)
- `md` 12 (cards)
- `lg` 20 (sheets, modals)
- `pill` 999 (category chips)

## Elevation
- `e0` none (flat cards on `bg.raised`)
- `e1` `0 1 2 rgba(0,0,0,0.08)` (cards in lists)
- `e2` `0 8 24 rgba(0,0,0,0.10)` (bottom sheets, floating CTAs)
- `e3` `0 16 40 rgba(0,0,0,0.12)` (nav banner)

## Components (primitives)
- `Screen` — safe-area-aware container with background token.
- `Stack` / `Inline` — flex-based layout primitives with spacing tokens.
- `Text` — typed by token (`variant="title"` etc.), not raw styles.
- `Button` — `variant`: `primary` | `secondary` | `ghost` | `danger`;
  `size`: `md` | `lg`. Always 52 px min height for touch.
- `Card` — rounded, padded container with elevation token.
- `CategoryChip` — pill with icon; 48 px min touch target.
- `SearchField` — leading icon, clear button, voice icon slot (future).
- `DestinationRow` — icon + name + meta; 72 px min row height.
- `NavBanner` — top-anchored, full-width, high-contrast, maneuver glyph.
- `FloorBadge` — e.g. "L1 · North" chip.
- `Sheet` — bottom sheet with 3 detents (peek / half / full).

## Icons
Maneuver glyphs (`straight`, `turn_left`, `turn_right`, `uturn`, `elevator`,
`escalator`, `stairs`, `arrive`). Category glyphs match the palette above.
Prototype uses `@expo/vector-icons` on mobile and a small SVG set on web to
avoid font-pack weight.

## Motion
- Screen transitions 220ms ease-out.
- Step banner 160ms fade + translate.
- Blue dot interpolates position at 20 Hz in mock mode.
- No parallax, no bouncy spring (tiring in motion).

## Accessibility
- Minimum 52×52 dp touch target on primary CTAs, 44×44 elsewhere.
- Maintain 4.5:1 contrast for body, 3:1 for large text.
- Every interactive element has an accessibility label.
- Navigation banner announces maneuver on change (screen-reader live region).
- Honors OS reduced-motion (disables dot interpolation animation).
- A "Step-free routing" preference in Settings propagates to `RoutingProvider`.
