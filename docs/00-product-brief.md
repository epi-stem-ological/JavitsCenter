# Product Brief — Venue Wayfinding Prototype

## One-liner
A mobile-first wayfinding prototype for large convention-center attendees to find
and navigate to destinations, designed so a future **Cisco Spaces Wayfinding**
native SDK integration can replace mocked indoor positioning and routing without
refactoring screens or state.

## Who it's for
- **Primary:** attendees at a large convention center (e.g. Javits-class:
  multiple buildings, multiple floors, halls hosting 500+ booths, 30k+ visitors).
- **Secondary:** event staff and exhibitors pointing attendees to specific
  destinations via QR codes and deep links.

## What problem it solves
- "Where is booth 3481?" / "Where's the nearest coffee?" / "How do I get from
  Hall A to Meeting Room 402?"
- Navigating a venue where GPS is unreliable, signage is overloaded, and
  attendees have poor attention, low patience, and often a phone at arm's length
  in a crowd.

## Success signals (prototype)
1. An evaluator can walk through search → detail → route preview → active
   navigation with the blue dot moving, in under 20 seconds, without reading a
   tutorial.
2. A QR/deep link opens directly into a route-ready state for the linked
   destination on both surfaces.
3. A senior engineer reading the repo can identify in under 5 minutes where
   the Cisco Spaces integration would plug in, and what is mock vs real.

## Non-goals (prototype)
- Real indoor positioning accuracy. We do **not** claim production-grade
  blue-dot accuracy; blue-dot movement is scripted.
- Authentication, user accounts, back-office admin tooling, analytics backend.
- Full event/exhibitor CMS — seed data only.
- iPad/tablet/kiosk variants (could be a later surface).
- Offline-first sync (flag only; see `07-next-steps-and-risks.md`).

## Platforms
- **Mobile (hero):** Expo React Native, iOS + Android, portrait-first.
- **Web:** Next.js app for browsing, search, event/exhibitor info, and
  QR/deep-link landing pages that hand off to mobile where appropriate.

## Constraints that shaped the design
- **Cisco Spaces Wayfinding ships as native iOS/Android SDKs.** No stable,
  documented React Native / web SDK at time of writing. Therefore all
  indoor-positioning and routing behavior sits behind adapter interfaces so a
  future native bridge can replace mocks one-for-one.
- Venue data (floor plans, venue graph, POI catalog) in production is assumed
  to come from Cisco's onboarding pipeline or an internal CMS — we mock seed
  data shaped to match.
- No claim of real positioning accuracy from the prototype.

## Risks (short list; full list in `07-next-steps-and-risks.md`)
- Cisco Spaces Wayfinding SDK API surface may change between prototype and
  integration; adapter interfaces are our shock absorber but require
  validation against current Cisco documentation.
- Floor plan ingestion is a significant real-world effort we are ignoring.
- Multi-floor routing UX is deceptively hard; the prototype shows the happy
  path only.
