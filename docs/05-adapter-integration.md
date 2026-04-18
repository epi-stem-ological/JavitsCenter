# Adapter & Integration Seam

This document describes how the prototype is structured so that the future
**Cisco Spaces Wayfinding** integration can replace mock behavior without
touching screens, navigation, or domain logic.

## The five interfaces

All live in `packages/providers/src/interfaces/`.

```
BuildingProvider     — static venue/building/floor data
DestinationProvider  — list / search / featured / by-category
LocationProvider     — live user position + permissions
RoutingProvider      — plan route, start/track navigation session
MapProvider          — map rendering + viewport + markers
```

Screens never import implementations. They consume a `ProviderRegistry` via
React context:

```
useProviders().destinations.search("hall a")
useProviders().location.subscribe(onPositionUpdate)
useProviders().routing.planRoute({ originId, destinationId })
```

## Bootstrapping

Two factory functions exist:

```
createMockRegistry(config?): ProviderRegistry    // used today
createProductionRegistry(config): ProviderRegistry // stub, throws until wired
```

- Apps pick **one** registry at bootstrap. We do not mix.
- `createProductionRegistry` intentionally throws on every method until its
  concrete implementations are provided. This makes integration work discrete
  and testable.

## Where Cisco Spaces actually plugs in (and where it doesn't)

### Needs real Cisco work

| Interface            | Cisco surface                                              | Integration form                 |
| -------------------- | ---------------------------------------------------------- | -------------------------------- |
| `LocationProvider`   | Cisco Spaces Wayfinding native SDK (iOS/Android)           | **Native RN bridge** (Swift/Kotlin) exposing `startTracking`, `stopTracking`, position callbacks |
| `RoutingProvider`    | Cisco Spaces Wayfinding routing API (native SDK)           | **Native RN bridge** or server-side route planner backed by the same venue graph Cisco uses |
| `MapProvider`        | Cisco map renderer (native) OR MapLibre/Mapbox with Cisco-provided floor geometry | Depends on Cisco's current render options — **validate with Cisco docs** |

### Can be external-to-Cisco

| Interface             | Likely prod backing                                        |
| --------------------- | ---------------------------------------------------------- |
| `BuildingProvider`    | Exported venue/building/floor JSON from Cisco onboarding **OR** internal CMS |
| `DestinationProvider` | CMS (exhibitors, events), search index (Algolia/Typesense/OpenSearch) |

## Integration checklist (once Cisco work starts)

> ⚠️ Every item below requires **validation against current Cisco Spaces
> documentation and support**. Do not assume anything here is a stable contract.

1. Confirm Cisco Spaces Wayfinding SDK availability for your target iOS +
   Android versions and licensing terms.
2. Confirm whether a React Native wrapper is officially supported or whether
   a custom bridge is needed (as of this writing, assume custom).
3. Confirm the venue data format Cisco expects for floor plans, the POI
   catalog, and the venue graph; reconcile with our mock shapes and add any
   necessary adapter transforms in `packages/providers/src/mock/transforms.ts`.
4. Build two native modules (iOS + Android) exposing:
   - `start()`, `stop()`, position event stream
   - `planRoute(originId, destinationId, options)` returning the same
     `Route` shape our domain uses (or a shape we can transform)
   - `startNavigation(...)` returning a session id + session event stream
5. Implement `CiscoLocationProvider`, `CiscoRoutingProvider`,
   `CiscoMapProvider` that wrap the bridges and **return our domain types**.
   No Cisco-native types should leak outside these files.
6. Switch bootstrap from `createMockRegistry()` to `createProductionRegistry()`
   in the mobile app when a feature flag is on; keep mock available for dev
   and demos.

## Seam test
Run `npm run lint:cisco-leak` to verify that no Cisco-branded SDK module is
imported outside of `packages/providers/src/production/` or
`apps/mobile/plugins/`. Prose mentioning Cisco (docs, disclaimers, interface
JSDoc describing the future seam) is fine and expected — what we enforce is
that no Cisco *code* leaks into screens, domain types, or mock providers.

If the check fails, the import should move into a provider implementation
under `packages/providers/src/production/` and be wrapped by the adapter so
that screens continue to depend only on `ProviderRegistry`.
