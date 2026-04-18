# Information Architecture

## Mobile app (primary)

```
Home
├── Featured destinations (curated per event/day)
├── Quick categories (Halls, Food, Restrooms, Help, Registration, Exits)
├── Current/Next session shortcut (event-aware)
├── Search entry point
└── Settings / Permissions

Search
├── Query input (forgiving: typo-tolerant)
├── Recent
├── Suggestions (by category)
└── Results
    └── Destination detail
        ├── Photo / icon
        ├── Floor + zone badge
        ├── Hours, description
        ├── Distance + ETA (from LocationProvider)
        ├── Amenity neighbors (nearest restroom / food)
        └── CTA: Preview route → Start navigation

Route Preview
├── Map with polyline + origin/destination markers
├── Step list (collapsed)
├── Floor-change indicator chips
├── Totals: distance, ETA, floors crossed
└── CTA: Start navigation

Active Navigation
├── Full-screen map, user-centered, auto-rotate
├── Top banner: next maneuver + distance + landmark
├── Bottom sheet: remaining ETA + next step preview + End
├── Off-route / rerouting state
├── Floor-change card (elevator / escalator / stairs choice)
└── Arrival state

Floor Selector
└── Overlay on map; buildings → floors

Permissions Explainer
└── Why we need location, Bluetooth; mock mode toggle for prototype

Settings
├── Accessibility (step-free routing preference)
├── Units (m / ft)
├── Mock mode indicator (always-on in prototype)
└── Build info
```

## Web app (secondary)

```
/                               Landing + featured
/search?q=…                     Search results
/destinations                   Browsable index (by category / floor)
/destinations/[id]              Destination detail + handoff to mobile
/events                         Event list
/events/[id]                    Event detail (+ destination link)
/exhibitors                     Exhibitor list
/exhibitors/[id]                Exhibitor detail (+ destination link)
/d/[id]                         Short deep-link landing (QR target)
/map                            Static floor-plan viewer (no live blue dot)
```

## URL + deep-link scheme

- **Web short link (for QR/print):** `https://wayfinder.example/d/{destinationId}`
  → resolves to destination detail; offers "Open in app" with a mobile deep
  link fallback.
- **Mobile deep link:** `wayfinder://destination/{destinationId}` and
  `wayfinder://event/{eventId}` and `wayfinder://exhibitor/{exhibitorId}`.
- **Universal link (prod):** `https://wayfinder.example/d/{id}` with
  `apple-app-site-association` / Android App Links (future, not in prototype).

## Navigation hierarchy (mobile)
Stack: `Home → Search → DestinationDetail → RoutePreview → ActiveNavigation`.
Modal overlays: `FloorSelector`, `PermissionsExplainer`.
Tab bar omitted for prototype — a single spine keeps focus on hero flows.
