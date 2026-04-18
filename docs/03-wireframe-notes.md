# Wireframe Notes

ASCII wireframes for the hero screens. These describe intent; the visual
system lives in `04-design-system.md`.

## Home

```
┌─────────────────────────────────────────┐
│  Javits Center                    ⚙     │
│  North Entrance · Level 1               │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ 🔍  Search halls, booths, food…   │   │
│ └───────────────────────────────────┘   │
│                                         │
│  Quick Access                           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│  │ Halls│ │ Food │ │  WC  │ │ Help │    │
│  └──────┘ └──────┘ └──────┘ └──────┘    │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│  │Regis.│ │ Exit │ │Elev. │ │Parking│   │
│  └──────┘ └──────┘ └──────┘ └──────┘    │
│                                         │
│  Featured                               │
│  ┌─────────────────────────────────┐    │
│  │ Hall A — Keynote                │    │
│  │ Level 1 · 180 m · 3 min         │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ Registration                    │    │
│  │ Level 1 · 60 m · 1 min          │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

- "You are at" pulls from `LocationProvider` (mocked to a fixed entrance).
- Category chips push a filtered search.
- Featured comes from `DestinationProvider.listFeatured(venueId)`.

## Search Results

```
┌─────────────────────────────────────────┐
│ ← Search                                │
│ ┌───────────────────────────────────┐   │
│ │ 🔍  hal a                         │ × │
│ └───────────────────────────────────┘   │
│                                         │
│  Results                                │
│  ─────────                              │
│  [🏛]  Hall A                           │
│       Level 1 · 180 m · 3 min           │
│  [🏛]  Hall A Lounge                    │
│       Level 1 · 210 m · 4 min           │
│  [🏛]  Hall A Registration              │
│       Level 1 · 90 m · 2 min            │
│                                         │
│  Recent                                 │
│  ─────────                              │
│  [☕]  Starbucks — Level 2              │
└─────────────────────────────────────────┘
```

- Typo-tolerant fuzzy search over destinations and exhibitors (mock uses
  simple token scoring; production swap with server search).
- Shows floor + distance + ETA inline so users don't need to tap to compare.

## Destination Detail

```
┌─────────────────────────────────────────┐
│ ← Hall A                            ⋯   │
│                                         │
│   [Banner image / icon]                 │
│                                         │
│  Hall A                                 │
│  North Building · Level 1               │
│  Open now · 8:00 AM – 6:00 PM           │
│                                         │
│  180 m · ~3 min walk                    │
│                                         │
│  Nearby amenities                       │
│  [☕ Café 42m] [🚻 WC 55m] [ℹ Info 30m] │
│                                         │
│  About                                  │
│  Main exhibition hall, 240 booths.      │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │          Preview Route            │   │
│ └───────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## Route Preview

```
┌─────────────────────────────────────────┐
│ ← Route to Hall A                   ⋯   │
│ ┌───────────────────────────────────┐   │
│ │                                   │   │
│ │      [map with polyline]          │   │
│ │        ● origin                   │   │
│ │        ● destination              │   │
│ │                                   │   │
│ └───────────────────────────────────┘   │
│                                         │
│  180 m · ~3 min · Level 1               │
│                                         │
│  Steps                                  │
│  1. ↑  Head south 40 m                  │
│  2. →  Turn right at Café 42           │
│  3. ↑  Continue 80 m to Hall A         │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │       Start Navigation            │   │
│ └───────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## Active Navigation

```
┌─────────────────────────────────────────┐
│ ┌───────────────────────────────────┐   │
│ │ ↑  In 40 m, turn right            │   │
│ │    at Café 42                     │   │
│ └───────────────────────────────────┘   │
│                                         │
│       [full-screen map, centered on     │
│            blue dot, rotating]          │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ 2 min · 120 m remaining           │   │
│ │ Next: Continue 80 m to Hall A     │   │
│ │                             [End] │   │
│ └───────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Floor-change card (variant)

```
┌───────────────────────────────────┐
│  Take the elevator to Level 4     │
│  Step-free · 20 m ahead           │
│  ○ Elevator   ○ Escalator  ○ Stairs│
│ ┌───────────────────────────────┐ │
│ │      I'm on Level 4           │ │
│ └───────────────────────────────┘ │
└───────────────────────────────────┘
```

## Deep-link Landing (web)

```
┌─────────────────────────────────────────┐
│  Javits Wayfinder                       │
│                                         │
│  Hall A                                 │
│  North Building · Level 1               │
│                                         │
│  [mini static map w/ pin]               │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │       Open in app                 │   │
│ └───────────────────────────────────┘   │
│ ┌───────────────────────────────────┐   │
│ │       View here                   │   │
│ └───────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

- If app is installed, "Open in app" deep-links and the page is essentially a
  handoff.
- "View here" shows a web-only destination page with a static floor plan.
  **No live blue dot on web** — browsers can't do reliable indoor positioning.
