# Next Steps & Known Risks

## Immediate next steps (post-prototype)

1. **Validate Cisco Spaces Wayfinding SDK contract.** Read the current iOS
   and Android SDK reference, confirm: APIs for position/heading, route
   planning (if exposed), map rendering options, session lifecycle, permission
   requirements, background behavior, licensing/tier gating. Update
   `docs/05-adapter-integration.md` with the real surface.
2. **Build a thin native RN bridge for `LocationProvider`** first. That alone
   unlocks a "real blue dot, mock everything else" checkpoint — highest
   information-per-hour you can spend.
3. **Source real floor plan + venue graph** for a single pilot area (one hall,
   one level). Feed it through `BuildingProvider`.
4. **Choose the map renderer.** Decide between Cisco's native map view and
   MapLibre/Mapbox with Cisco-provided geometry. Our `MapProvider` interface
   is agnostic; the decision drives native UI work.
5. **Define analytics schema** (we stubbed events already) and wire to Segment
   or your warehouse.
6. **Observability.** Crash reporting (Sentry), route-plan telemetry, location
   availability metrics.
7. **Design pass with real brand.** The token set in the design system is
   neutral premium; run a brand + content pass before user testing.
8. **User testing on-site.** Everything reads differently under real lighting
   and crowds.

## Known risks

### Integration risks
- **R1 — No JS/RN SDK.** Cisco Spaces Wayfinding is native. The RN bridge is
  non-trivial and adds iOS/Android maintenance cost. *Mitigation:* adapter
  interfaces isolate the cost; consider whether a native-only app is cheaper
  for v1.
- **R2 — SDK surface uncertainty.** We are assuming specific capabilities
  (route planning, accessibility options) that may or may not exist today.
  *Mitigation:* validate before estimating integration timeline.
- **R3 — Map rendering mismatch.** If Cisco's renderer is prescriptive, our
  overlay/styling control may be limited. *Mitigation:* prototype an overlay
  early against real Cisco map output.

### Product risks
- **R4 — Positioning quality varies.** Indoor positioning is fingerprint +
  beacon dependent. Venue commissioning matters more than SDK.
  *Mitigation:* design for degraded states (arrow-only, "you're near X").
- **R5 — Floor detection is hard.** User tap fallback must always be present.
- **R6 — Multi-building routes** are a large UX design problem (entering a
  new building is disorienting). *Mitigation:* a dedicated "entering
  <building>" transition card.
- **R7 — Crowding invalidates ETA.** Real venues at peak are slower than 1.2
  m/s. *Mitigation:* venue-calibrated speed constants.
- **R8 — Accessibility preferences must be sticky and honored across
  reroutes.** Test explicitly.

### Data & content risks
- **R9 — POI catalog staleness.** Exhibitor booth numbers change days before
  an event. *Mitigation:* CMS + expiring cache; deep-link resolver must
  tolerate 404s gracefully.
- **R10 — Internationalization.** Not scoped in prototype; strings are
  English-only. *Mitigation:* externalize early — convention centers host
  international events.

### Engineering risks
- **R11 — Adapter drift.** Over time, mock providers can diverge from
  production contracts. *Mitigation:* a small shared test suite (contract
  tests) that both mock and production providers must pass.
- **R12 — Over-mocking.** Demos look great, production feels different.
  *Mitigation:* document mocked-vs-real explicitly in code comments and in
  `06-mock-vs-production.md`; enforce via a CI grep.
- **R13 — Native module churn** on Expo. If we stay on Expo, the
  Cisco SDK integration likely needs a config plugin and custom dev client.
  *Mitigation:* plan for `expo prebuild` and a custom dev client from day one
  of integration.

## What we explicitly left out of the prototype
- Auth and accounts.
- Saved favorites / trip planning across multiple destinations.
- Offline mode.
- Push notifications (e.g. "Session starts in 5 min").
- Localization / RTL.
- AR overlays.
- Kiosk / tablet surface.
- Admin tooling for venue configuration.
- Background navigation / screen-off instructions.

Each is a real product question; none is needed for the prototype's success
criteria.
