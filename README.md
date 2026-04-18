# Javits Wayfinder — Prototype

A production-minded prototype for an indoor wayfinding app targeting a
large convention-center venue. Built so a future **Cisco Spaces Wayfinding**
native SDK integration can replace mocked indoor positioning and routing
**without touching screens or domain logic**.

> ⚠️ **This is a prototype.** Every location and routing behavior is mocked.
> The app must not be shipped to real attendees in its current state.

## Read this first

1. [`docs/00-product-brief.md`](docs/00-product-brief.md) — what and why
2. [`docs/01-information-architecture.md`](docs/01-information-architecture.md) — screens and URLs
3. [`docs/02-user-journeys.md`](docs/02-user-journeys.md) — flows through the app
4. [`docs/03-wireframe-notes.md`](docs/03-wireframe-notes.md) — hero screens
5. [`docs/04-design-system.md`](docs/04-design-system.md) — tokens, components, motion
6. [`docs/05-adapter-integration.md`](docs/05-adapter-integration.md) — **the Cisco seam**
7. [`docs/06-mock-vs-production.md`](docs/06-mock-vs-production.md) — running gap list
8. [`docs/07-next-steps-and-risks.md`](docs/07-next-steps-and-risks.md) — what's left

## Repository layout

```
apps/
  mobile/      Expo React Native prototype (hero screens)
  web/         Next.js app (browse, search, QR/deep-link landing)
packages/
  domain/      TypeScript types: Venue, Destination, Route, etc.
  providers/   Adapter interfaces + mock implementations
  mock-data/   Seed venue, destinations, events, exhibitors, graph
docs/          Product + engineering docs
```

## The five provider interfaces (the Cisco seam)

Screens consume these, **never** concrete implementations:

- `BuildingProvider` — static venue/building/floor data
- `DestinationProvider` — list / search / featured / by-category
- `LocationProvider` — user position + permissions (**Cisco-backed later**)
- `RoutingProvider` — route plan + navigation session (**Cisco-backed later**)
- `MapProvider` — map rendering + viewport + markers

Full details in [`docs/05-adapter-integration.md`](docs/05-adapter-integration.md).

## Running the prototype

> The prototype ships as a scaffold. Install deps and start a surface:

```bash
# install
npm install

# typecheck everything
npm run typecheck

# mobile (Expo)
npm run mobile

# web (Next.js)
npm run web
```

Both apps boot with the mock registry (`createMockRegistry()`) and
deterministic seed data.

## What's mocked and why

| Behavior                  | Status  | Notes                                                      |
| ------------------------- | ------- | ---------------------------------------------------------- |
| User indoor position      | MOCKED  | Scripted path simulator, not real positioning              |
| Route planning            | MOCKED  | A* over seed venue graph                                   |
| Floor plans               | MOCKED  | Simple SVG placeholders                                    |
| Search                    | MOCKED  | In-memory token/trigram scoring                            |
| Exhibitors / events       | MOCKED  | Small seed set                                             |
| Analytics                 | MOCKED  | Console logger implements the production event contract    |

See [`docs/06-mock-vs-production.md`](docs/06-mock-vs-production.md) for the
full running list.

## License
Internal prototype — not licensed for distribution.
