---
description: Build a Javits screen end-to-end — build, analytics check, brand QA, a11y, tests, review.
---

Build the Javits screen at the route I specify, then run the full post-build verification.

1. Invoke `@javits-screen-builder` with the user's requested route. Pass any context they gave about the screen. The builder reads the `ComingNext` prompt and produces the implementation.

2. After the screen compiles:
   - Invoke `@javits-analytics-guard` to check any new `analytics.track(...)` calls.
   - Invoke `@javits-brand-qa` to verify brand rule compliance.
   - Invoke `@javits-a11y-auditor` to audit the new screen.
   - Invoke `@javits-test-writer` to add tests for any new service methods or non-trivial component logic.

3. Finally, invoke `@javits-code-reviewer` on the aggregate changeset.

4. Summarize for the user: what shipped, what each agent flagged, what's still open.

Screen to build: $ARGUMENTS
