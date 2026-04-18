# Mock vs Production Gaps

A running list. Any mock behavior that would be dishonest to ship is listed
here. This file should be **kept current** as integration work proceeds.

## Legend
- 🟥 **Hard gap** — real Cisco SDK or external service required.
- 🟨 **Soft gap** — content/data work; no SDK dependency.
- 🟩 **Parity** — prototype behavior matches production intent.

---

## Location & positioning

| Area                       | Mock behavior                                                                 | Production requirement                                                                 | Gap |
| -------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | --- |
| User position              | Scripted path simulator advances along the active route polyline at a fixed speed | Live indoor position from Cisco Spaces Wayfinding SDK (BLE + Wi-Fi + sensor fusion)    | 🟥  |
| Position accuracy          | Constant `accuracyMeters: 3`                                                  | Variable; depends on venue fingerprinting, beacon density, hardware                    | 🟥  |
| Heading                    | Derived from next segment direction                                           | From device compass / SDK heading                                                      | 🟥  |
| Off-route detection        | Scripted deviation at a chosen step                                           | SDK-reported position compared against route polyline within a threshold               | 🟥  |
| Floor detection            | User-confirmed via "I'm on Level N" button                                    | SDK pressure/altimeter + beacon-based confirmation                                     | 🟥  |
| Permission handling        | Fake permission dialog; always succeeds in mock mode                          | Real OS permission flows, with graceful degradation                                    | 🟨  |

## Routing

| Area                       | Mock behavior                                                                 | Production requirement                                                                 | Gap |
| -------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | --- |
| Route planning             | A* over our mock venue graph with accessibility constraints                   | Cisco routing engine; may differ on path selection and constraints                     | 🟥  |
| Rerouting                  | Triggered deterministically in mock; re-plans from current mock position      | Triggered by off-route detection from live SDK position                                | 🟥  |
| Turn-by-turn instructions  | Generated from graph segment geometry + nearby landmarks in seed data         | Validate Cisco's instruction formatting OR regenerate on our side from their polyline | 🟥  |
| ETA                        | Assumes 1.2 m/s walking + 30 s per floor change                               | Validate with Cisco's time estimate or measured venue averages                         | 🟨  |
| Step-free routing          | Graph edges carry `isAccessible`; router filters                              | Cisco SDK should expose an accessibility option; confirm                               | 🟥  |
| Multi-building routes      | Graph supports; seed data wires two buildings                                 | Cisco needs the full cross-building network modeled in onboarding                      | 🟨  |

## Map

| Area                       | Mock behavior                                                                 | Production requirement                                                                 | Gap |
| -------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | --- |
| Floor plan rendering       | Static SVG/PNG per floor (placeholder geometry)                               | Vector floor plan from Cisco onboarding or converted from CAD/DWG                      | 🟥  |
| Blue dot                   | CSS/RN transform interpolation                                                | Native map layer driven by SDK position stream                                         | 🟥  |
| Polyline overlay           | Drawn from graph node coordinates                                             | Drawn from Cisco route response geometry                                               | 🟥  |
| Floor switcher             | Instant tab switch                                                            | Same, potentially auto-triggered by floor detection                                    | 🟩  |

## Data

| Area                       | Mock behavior                                                                 | Production requirement                                                                 | Gap |
| -------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | --- |
| Venue/Buildings/Floors     | Seed JSON for one venue, two buildings, three floors                          | Real venue export from Cisco onboarding + CMS layer                                    | 🟨  |
| Destinations / POIs        | ~40 seed POIs across categories                                               | Hundreds to thousands; needs CMS + editorial                                           | 🟨  |
| Exhibitors                 | 10 seed exhibitors linked to destinations                                     | Event-provided exhibitor feed; lives in CMS                                            | 🟨  |
| Events / sessions          | 6 seed events                                                                 | Event CMS feed                                                                         | 🟨  |
| Search                     | In-memory token + trigram scoring                                             | Server search index for scale and synonyms                                             | 🟨  |
| Analytics                  | Logs to console                                                               | Pipe to Segment / your warehouse; define event schema as contract                      | 🟨  |

## UX / state

| Area                       | Mock behavior                                                                 | Production requirement                                                                 | Gap |
| -------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | --- |
| Offline                    | Not modeled                                                                   | Offline venue data + cached last-known position; route plan graceful failure           | 🟥  |
| Background location        | Not modeled                                                                   | Required for continued navigation when phone is pocketed; OS caveats apply             | 🟥  |
| Battery                    | Not modeled                                                                   | Must test real SDK battery impact; wake-on-nav patterns                                | 🟥  |
| Multi-venue                | Single venue only                                                             | Venue picker, per-venue config, per-venue licensing                                    | 🟨  |

## What we deliberately do NOT claim
- Positioning accuracy numbers.
- ETA accuracy.
- Any Cisco API contract. Every Cisco reference here is an **integration
  hypothesis** that must be validated against current Cisco Spaces documentation
  before implementation begins.
