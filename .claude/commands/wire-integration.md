---
description: Swap a mock service adapter for a real integration, with fallback and tests.
---

Wire a real vendor integration into the service named in the argument:

1. Invoke `@javits-adapter-swap` to replace the mock with the real implementation. The agent must preserve the interface, keep the typed error result shape, add a feature flag fallback to the mock, and never commit secrets.

2. Invoke `@javits-test-writer` to add tests for the new adapter: happy path, each error branch, feature-flag fallback behavior.

3. Invoke `@javits-code-reviewer` on the full change.

4. Confirm `.env.example` was updated and no secrets are in the diff.

5. Summarize: what was swapped, what env vars are now required, what feature flag controls rollout, what tests were added.

Service + vendor: $ARGUMENTS
