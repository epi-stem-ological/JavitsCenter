# Javits Center — Campus Companion (Prototype)

Mobile-first PWA prototype for the Javits Center app. This repository contains the scaffold, design system, brand assets, data models, mock seed, service adapters, and three hero screens wired end-to-end (Splash → Role → Home). The remaining screens ship as branded stubs with Claude Code prompts embedded so a developer or Claude Code session can finish the build one route at a time without reshuffling architecture.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Zustand (persistent client state) · Lucide icons

**Why this stack:** The authoritative spec (`/docs/App Development.docx`) calls for Next.js as a mobile-first PWA. We picked a hybrid path — ship Next.js now for the stakeholder demo and kiosk reuse, port to React Native during the 3-6 month production phase. All domain logic lives in `src/services` and `src/types`, free of Next.js/React DOM imports, so the RN port reuses it.

---

## Getting started

```bash
cd "Javits App/javits-app"
npm install
npm run dev
```

Open `http://localhost:3000`.

- `npm run dev` — dev server with hot reload
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — Next.js + ESLint

Node 20+ is expected.

---

## Route map

| Path | Status | Notes |
| --- | --- | --- |
| `/` | Built | Splash. `BUILT TO TRANSFORM.` with gradient wave + dot pattern accent. |
| `/onboarding` | Built | 4-slide walkthrough with persist-on-skip. |
| `/role` | Built | 4 personas — attendee / exhibitor / tenant / organizer. |
| `/home` | Built | Role-aware quick actions, featured carousel, upcoming list, role-specific row. Bottom nav active. |
| `/events` | Stub | Full list w/ featured placements ranked above chronological. |
| `/events/[id]` | Stub | Event detail — hero color, save/share, directions, Quiet Cove nearby. |
| `/map` | Stub | Cisco Spaces-backed wayfinding mock with three layers: venues / ADA / emergency. |
| `/offers` | Stub | Claim/redeem partner offers; writes redemption records for admin analytics. |
| `/quiet-cove` | Stub | Multi-step booking + explicit marketing opt-in → MarketingLead. |
| `/surveys` | Stub | Rating / single / multi / text; unlocks rewards. |
| `/notifications` | Stub | Grouped by category; safety-category deep-links to `/safety`. |
| `/profile` | Stub | Role switcher, marketing consent center, stats, demo reset. |
| `/safety` | Stub | Accessibility · Emergency · Evacuation tabs. Public Safety tap-to-call. |
| `/admin` | Stub | KPI snapshot + mgmt tabs (featured, offers, surveys, Quiet Cove leads). |
| `/kiosk` | Built | Large-touch kiosk home — 4 oversized tiles, bottom wave. |

Every stub embeds the next Claude Code prompt right on the screen, so handoff is mechanical.

---

## Architecture

```
src/
  app/                     Next.js App Router routes
    (app)/                 route group — wraps in-app screens with bottom nav
    admin/                 admin dashboard (separate layout, no bottom nav)
    kiosk/                 kiosk mode
    onboarding/
    role/
    page.tsx               splash
    layout.tsx             root (fonts + metadata + viewport)
    globals.css            brand CSS tokens
  components/
    brand/                 JavitsLogo, BrandArrow, DotPatternAccent, GradientWave, NycTag
    nav/                   BottomNav
    ui/                    Button, Card, SectionHeader, RoleBadge, SponsoredBadge,
                           FeaturedEventCard, ComingNext
  data/
    seed.ts                mock data: events, featured placements, venues, pods,
                           offers, surveys, notifications, ADA + emergency, integrations
  lib/
    tokens.ts              brand palette + gradient + voice (single source of truth)
    utils.ts               cn() + usd()
    store.ts               Zustand persisted store (role, consent, saves, etc.)
  services/
    wayfinding/            CiscoSpacesAdapter (mock) behind WayfindingService interface
    crm/                   MomentousAdapter (stub) behind CrmService interface
    analytics/             in-memory analytics + console log
    featureFlags.ts        toggle UI by integration status
  types/
    models.ts              platform-agnostic TS models for every spec entity
public/
  brand/                   logos, icons, dot patterns, gradient bar
  manifest.webmanifest     PWA manifest
```

### Why the route group `(app)`?

The stakeholder demo sometimes needs marketing-style full-bleed pages (splash, onboarding, role, kiosk) with no bottom nav, and sometimes in-app screens with nav. The `(app)` group owns the nav and content padding; top-level pages render without it.

### Why the service layer is platform-agnostic

When this ports to React Native, `src/services/*` and `src/types/*` will move over untouched. Presentational components are Next.js/Tailwind; logic is not. This is the hinge the hybrid stack decision turns on.

---

## Data model

See `src/types/models.ts`. Every entity referenced in the spec is there: User, Event, FeaturedPlacement, VenueLocation, Route, QuietCovePod, QuietCoveBooking, MarketingLead, PartnerOffer, OfferRedemption, Survey, SurveyQuestion, SurveyResponse, Reward, Notification, IntegrationConfig, AnalyticsEvent, ADALocation, EmergencyLocation, EvacuationInfo.

Two deliberate design choices worth calling out:

1. **`MarketingLead` is separate from `QuietCoveBooking`.** The marketing team needs leads filterable even when a booking is cancelled, and legal requires explicit consent. Storing the consent + CRM destination on the lead, not the booking, keeps this clean and auditable.
2. **`FeaturedPlacement` is a join table, not a flag on `Event`.** A placement has its own lifecycle (start/end), sponsor, tier, and rank — and one event can have multiple placements over time. Admin mgmt CRUDs placements, not events.

---

## Brand rules (encoded in components)

The 2026 brand guide is strict. The component library enforces it so developers can't drift:

- `BrandArrow` — no `direction` prop. Always points right. Only brand colors. One per layout (enforced in review).
- `DotPatternAccent` — density caps at `dense`. There is no `full-bleed` mode.
- `GradientWave` — no `position` prop. Always bottom-anchored. Two variants: `fade-to-white`, `fade-to-black`. Always shows the full blue→green→gold spectrum.
- `JavitsLogo` — variants pick from approved lockups only. You cannot recolor the apple icon or compose a new lockup in code.
- Palette: only `javits-gold / green / blue / black / white` in Tailwind. Hardcoding hex elsewhere is a review flag.
- Typography: Bebas Neue (headlines) + Inter (body) via Google Fonts. When/if Titling Gothic FB is licensed, swap the `--font-display` and `--font-body` CSS vars in `globals.css` — nothing else changes.

Voice: `"BUILT TO TRANSFORM."` / `"The Transformation Epicenter of New York"` / pillars in `src/lib/tokens.ts`.

---

## Service adapters (what's real, what's mocked)

| Service | Adapter | Status |
| --- | --- | --- |
| Wayfinding | `CiscoSpacesAdapter` | Mock. Returns seed venues + synthetic routes. Swap to live Cisco Spaces + BLE in production. |
| CRM | `MomentousAdapter` | Stub. Holds leads in memory and simulates a sync. Wire to Momentous API when the contract closes. |
| Surveys deep-link | — | Flag-gated. Cultivated QR/webview handoff placeholder, off by default. |
| Notifications | local only | Web push is not wired. Seed notifications render; no service worker yet. |
| Payments | not wired | Quiet Cove checkout is mocked. Stripe/Square decision deferred. |

**No Pointr adapter.** Per the 2026-04-18 product call, wayfinding v1 is Cisco Spaces only. If/when Pointr closes, add `PointrAdapter implements WayfindingService` in `src/services/wayfinding/` — nothing else in the app needs to change.

---

## PWA notes

`public/manifest.webmanifest` is wired. A service worker is intentionally not shipped yet — `next-pwa` or a hand-rolled SW fits best once the routes and caching story settle. Icons: the gold + black Javits apple icons in `public/brand/icons`.

---

## Kiosk mode

`/kiosk` is a separate route without the bottom nav. Mount a tablet in portrait orientation. The design system carries over — oversized tiles, same brand tokens. Plan to add a 60-second idle-reset later.

---

## Known TODOs (search `TODO` in source)

- Wire real Cisco Spaces OAuth + tenant
- Wire Momentous API credentials + list ID per event context
- Ship service worker + offline cache strategy (likely `next-pwa`)
- Decide payments processor for Quiet Cove and integrate
- Legal review of marketing consent copy (Alicia owns)
- Replace mock SVG map with a real floor-plan SVG from facilities

---

## How to continue with Claude Code

See `CLAUDE_CODE_PROMPTS.md` for 10 sequenced prompts, one per remaining screen. Each prompt is self-contained: it tells Claude Code which file to edit, what imports to use, what data to render, and which store/service hooks to call.

Open the project in VS Code with Claude Code attached, and run the prompts in order (or cherry-pick by priority). The prompts are also embedded on each stub screen so you can see them in-app.
