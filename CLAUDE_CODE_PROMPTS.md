# Claude Code — Build Prompts

Sequenced prompts to finish the Javits campus companion app. Each one is self-contained. Run them in order for the smoothest path, or cherry-pick by priority.

**Recommended demo-readiness order:** 1 → 2 → 6 → 3 → 4 → 5 → 7 → 8 → 9 → 10.

---

## 1. Events list (`/events`)

> Build `src/app/(app)/events/page.tsx` as a client component. Render a search input that filters by title and tag, and a filter row with category pills (`trade-show · conference · consumer · private · community · summit`). Above the list, render a "Featured" row using `FeaturedEventCard` for each `featured` placement from `src/data/seed.ts`, sorted by `rank` ascending. Below, render a chronological list of `events` that are not expired, grouped by month with `SectionHeader`. Each list row should be a `<Link>` to `/events/{id}`. Track `analytics.track('event_view', {id})` on click. Use `clsx`/`cn` for styles. Keep the file under ~180 LOC.

## 2. Event detail (`/events/[id]`)

> Build `src/app/(app)/events/[id]/page.tsx`. Fetch the event by id from `src/data/seed.ts` (no async fetch needed). Render a hero block whose background color matches `event.heroColor` (gold/green/blue), the title in `headline` type, dates, hall, and organizer. Add two primary actions: `Save` (toggles `useApp.toggleSaveEvent(id)`) and `Share` (uses `navigator.share` when available, falls back to copying the URL). Below, add two shortcut cards: "Get directions" → `/map?dest={hallId}` and "Book Quiet Cove nearby" → `/quiet-cove?near={level}`. Include a small paragraph (event.description), attendee estimate, and tags as chips.

## 3. Campus map (`/map`)

> Build `src/app/(app)/map/page.tsx` as a client component with three mutually exclusive layers: Venues / ADA / Emergency, switched by a segmented control at the top. The map is a 100×100 SVG viewport; render markers from `venues`, `adaLocations`, or `emergencyLocations` (from seed) based on the active layer and floor. Floor switcher: `concourse · 1 · 3 · roof`. Include a search bar that calls `wayfinding.search(query)` and shows results below; clicking a result pans/zooms (use CSS transform) and shows a destination card with `Route me there` and accessible toggle. `wayfinding.getRoute(from, to, accessible)` returns a `Route` with steps — render those as an ordered list in a bottom sheet. Position markers via `xy: [x,y]` (both 0-100). Use small Lucide icons per category, tinted in brand colors.

## 4. Partner offers (`/offers`)

> Build `src/app/(app)/offers/page.tsx`. Render a category filter row (`dining · attraction · hotel · transit · retail`) and a grid of offer cards from `seed.offers`. Each card: partner name, headline, neighborhood, discount label (large, in Javits Gold on black), body, and a `Claim` button. On claim, call `useApp.claimOffer(id)` and `analytics.track('offer_claimed', {id, partner, est: estimatedTicketUSD})`. Add a small "Estimated impact · `{usd(estimatedTicketUSD)}`" subtitle on each card. Show a subtle `Claimed` ribbon on claimed offers.

## 5. Quiet Cove booking (`/quiet-cove`)

> Build a 4-step flow in `src/app/(app)/quiet-cove/page.tsx` using a state machine (useReducer is fine). Steps: (1) Pod list grouped by level from `seed.quietCovePods`, (2) Pod detail + time-slot picker (generate 9-6pm hourly slots, mark random ones unavailable for realism), (3) Contact form with firstName, lastName, email (required), phone (optional), and a `marketingOptIn` checkbox that is UNCHECKED by default — Alicia/legal require explicit opt-in, (4) Success screen with booking ID + reminder + a `Share calendar invite` button (mocked). On submit, persist a `QuietCoveBooking`. If `marketingOptIn === true`, create a `MarketingLead` and, only when `flags.crmSync()` is true, call `crm.syncLead(lead)`. Show a subtle note on step 3: "We'll add you to the Javits marketing list. You can opt out any time in Profile."

## 6. Surveys (`/surveys`)

> Build `src/app/(app)/surveys/page.tsx`. List surveys from `seed.surveys` with est. minutes and reward label; disable the card once `useApp.completedSurveyIds` contains its id. Clicking opens a player at `/surveys/[id]` (new nested route). The player renders each question by type: `rating` as 1-5 stars, `single-choice` as radio buttons, `multi-choice` as checkboxes, `text` as a textarea. Validate answers per question, show progress, and on completion persist a `SurveyResponse`, call `useApp.completeSurvey(id)`, unlock the `Reward`, and `analytics.track('survey_completed', {id})`. The final screen shows the reward label prominently with the Javits apple icon in gold.

## 7. Notifications (`/notifications`)

> Build `src/app/(app)/notifications/page.tsx`. Group `seed.notifications` by category: `event`, `system`, `offer`, `survey`, `safety`. Unread notifications show a Javits Gold dot. Add a top-bar `Mark all read` action that updates local state. `safety` notifications deep-link to `/safety`. Tapping an `offer` notification deep-links to `/offers`. Keep the empty state gentle: "You're caught up."

## 8. Profile (`/profile`)

> Build `src/app/(app)/profile/page.tsx`. Show the current role with `RoleBadge`, a `Switch role` button → `/role`. Below: a preferences card with toggles for `marketingOptIn` (bound to `useApp.setMarketingOptIn`) and a placeholder push-notifications toggle (disabled, with a "Coming soon" note since `flags.pushNotifications()` is false). Show three counters — saved events, claimed offers, completed surveys (derived from the store). Under a "Demo" section, add `Reset app` bound to `useApp.resetAll()` (confirm first).

## 9. Safety & ADA (`/safety`)

> Build `src/app/(app)/safety/page.tsx`. Three tabs: Accessibility, Emergency, Evacuation. Accessibility: list `seed.adaLocations` with a filter row (restroom · entrance · elevator · ramp · service-animal-relief · assistive-listening · wheelchair-seating · parking · tactile-signage · nursing); each row shows level and name, with a Lucide icon per category. Emergency: same pattern for `seed.emergencyLocations` (exit · aed · fire-extinguisher · fire-hose · pull-station · assistance-muster · stairwell · egress-corridor). Evacuation: render `seed.evacuation` as a hero block with muster point, a big tap-to-call Public Safety tile (`tel:{publicSafetyPhone}`), an ordered list of steps, and a second list of safety instructions with checkmarks. Source is the JKJCC evacuation egress plan.

## 10. Admin dashboard (`/admin`)

> Build `src/app/admin/page.tsx`. Top row: 6 KPI cards rendered from a single `<KpiCard>` component: Bookings, Leads captured, Offer claims, Offer redemptions, Survey completions, Estimated economic impact (sum of `offer.estimatedTicketUSD` for claimed offers). Below: tabs for Featured Placements, Offers, Surveys, Quiet Cove Leads. Featured placements table shows rank / tier / sponsor / event / window; add `Move up/down` buttons to re-rank (local state). Quiet Cove Leads table reads from `crm.listLeads()` and shows `firstName · email · createdAt · syncStatus`. Add a "Sync pending to Momentous" button, disabled when `flags.crmSync()` is false with a tooltip "Enable in seed.integrations.momentous.enabled".

---

## After the prompts

- Run `npm run typecheck` and `npm run lint`.
- Add route-level `generateStaticParams` if you plan to deploy as a static export.
- When ready for offline: add `next-pwa` (or a hand-rolled service worker) and configure cache strategies for `/map` (stale-while-revalidate) and `/events` (network-first).
- When ready for RN: port `src/services`, `src/types`, and `src/data` unchanged. Rebuild `src/components` against React Native primitives; the tokens in `src/lib/tokens.ts` are already platform-agnostic.
