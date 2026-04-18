# User Journeys

## Personas (thin sketches; not a substitute for real research)

- **Attendee A — first-timer, low patience.** At the main entrance, phone in
  hand, looking for "Hall 3A." Doesn't know building layout. Will bounce if the
  app makes them think.
- **Attendee B — exhibitor-seeker.** Has a booth number "4512" from a printed
  guide. Wants minimum friction between the number and arrival.
- **Attendee C — session-hopper.** Going from keynote (Hall A) to a workshop
  (Room 402, different floor). Needs to understand the floor change.
- **Attendee D — accessibility need.** Needs step-free routing; elevator over
  escalator; clear floor transitions.

## Journey 1 — Search → Navigate (Attendee A, hero)

1. Launches app at the entrance.
2. Home shows "You're at: North Entrance · Level 1" (mocked).
3. Taps search, types "hal a" (typo).
4. Suggestions show "Hall A · Level 1 · 180 m · 3 min." (fuzzy match).
5. Taps result → Destination Detail.
6. Taps "Preview Route" → map shows polyline, 3 steps, no floor change.
7. Taps "Start" → Active Navigation.
8. Blue dot starts moving along the route (scripted); step banner updates at
   each maneuver; arrives with a confirmation state.

**Success if:** steps 3–7 complete in under 15 seconds of interaction.

## Journey 2 — Deep link from QR (Attendee B)

1. Scans QR on printed guide → `https://wayfinder.example/d/booth-4512`.
2. Web landing resolves destination, shows: name, floor, distance (if app is
   installed and permitted), and two CTAs: **Open in app** / **View here**.
3. Tapping "Open in app" deep-links `wayfinder://destination/booth-4512`,
   landing in Destination Detail with origin already resolved to current
   position (mocked).
4. User taps Start → Active Navigation.

**Success if:** from scan to moving blue dot in under 10 seconds when the app
is installed; from scan to a useful static map in under 3 seconds when not.

## Journey 3 — Multi-floor route (Attendee C)

1. From Active Navigation, blue dot approaches an elevator bank.
2. The step banner flips to a **Floor Change Card**: "Take elevator to Level 4
   · step-free · next elevator: 20 m ahead."
3. When user taps "I'm on Level 4," navigation resumes on the destination
   floor with the map auto-switched.
4. Step banner shows: "Turn right after the coffee cart → Room 402."

**Prototype note:** floor transitions are driven by user tap, not by real
pressure/altimeter sensing. In production the Cisco SDK would confirm floor.

## Journey 4 — Off-route and reroute (any persona)

1. Mocked blue dot is scripted to drift off the polyline at a set point.
2. Navigation enters `rerouting` state; banner fades to "Rerouting…".
3. `RoutingProvider.reroute()` returns a fresh route; navigation resumes.

## Journey 5 — Accessibility (Attendee D)

1. User toggles "Step-free routing" in Settings.
2. Subsequent routes avoid stairs/escalators, prefer elevators.
3. Floor-change cards highlight accessible options.

**Prototype note:** the mock graph carries `isAccessible` on transition nodes
and the mock router respects the preference.
