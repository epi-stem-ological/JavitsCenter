---
description: Run the full pre-PR check — brand, a11y, analytics, project-specific review, and typecheck.
---

Run the pre-PR verification on the current branch:

1. Invoke `@javits-brand-qa` on all UI files changed in this branch.
2. Invoke `@javits-a11y-auditor` on all screen-level files changed.
3. Invoke `@javits-analytics-guard` if any analytics call sites were touched.
4. Invoke `@javits-code-reviewer` for the project-specific pre-merge review (consent, PII, hydration, adapter pattern, typed errors).
5. Run `npm run typecheck && npm run lint` and surface any failures.
6. Produce a single consolidated report: Blockers / Suggestions / Nits / What Looks Good / Verdict.

Do not approve the branch if any agent returns a "Request Changes" or "Blocked" verdict.
