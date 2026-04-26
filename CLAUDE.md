# Javits Campus Companion — Project Context

This file is ambient context for every Claude Code session on this repo. Read it before touching code. Every agent in `.claude/agents/` assumes the rules here.

## What this is

A campus companion PWA for the Javits Center, NYC. Four user roles — Attendee, Exhibitor, Tenant, Organizer — share one app with role-dependent home screens. The stack is Next.js 15 App Router (PWA today, architected for a React Native port later), Zustand for persisted client state, Tailwind for styling, TypeScript strict mode throughout.

## Non-negotiable rules

### Brand

- **Gold (`#B8860B`-ish) is an accent, never the background.** The black background is dominant on hero/splash surfaces. White is the document surface.
- **Dot pattern accents are sparse and corner-anchored.** Never full-bleed. Density is low. Opacity is low.
- **Gradient wave is bottom-anchored, fade-to-black.** Only on hero surfaces. Never a divider.
- **One arrow accent per layout, maximum.** The splash uses one on the primary CTA. If a screen already has one, don't add another.
- **Apple icon is reserved for the home-screen/PWA icon.** Never inline in the app.
- **Typography:** Titling Gothic FB when the license lands. Until then, the CSS variable `--font-headline` is the swap point — don't hardcode headline fonts anywhere else.

### Adapter pattern

Every external dependency lives behind a service adapter in `src/services/`. Components never call an external API directly. Adapters:

- Return typed discriminated unions for failures: `{ ok: true as const; ... } | { ok: false as const; error: string }`
- Start as mocks with realistic data shape
- Get swapped for real implementations in Phase 2 of the plan

When you add a new integration, add a new adapter — don't shove it into an existing one.

### Consent + PII

- Marketing consent is stored as `{ optIn: boolean; capturedAt: string | null }` in `src/lib/store.ts`. The `capturedAt` timestamp is load-bearing — the Momentous CRM adapter refuses to sync a lead without it. Don't bypass.
- The analytics layer (`src/services/analytics/analytics.ts`) has a PII blocklist that drops any event containing restricted keys. When you add a new event, add its type to `AnalyticsEventMap` and verify no props match the blocklist pattern. If you need to track something that might be PII, hash it upstream.
- Never log user identifiers, email, phone, or location data to the console or to Sentry breadcrumbs.

### Hydration

Zustand persists to localStorage with `skipHydration: true`. Any layout that branches on persisted state MUST wait on `useHasHydrated()` before deciding what to render, or you'll get SSR/CSR mismatches and a visible flash. The pattern is in `src/app/(app)/layout.tsx` and `src/app/admin/layout.tsx` — copy it, don't reinvent it.

### Route guards

Client-side guards in layouts are a v1 prototype. Every `/admin` and `/(app)` layout file has a `TODO` to replace with `middleware.ts` + a signed session cookie once real auth lands (Phase 2). Don't ship new protected routes without adding the same guard pattern.

## Directory map

```
src/
  app/
    page.tsx                    Splash (public)
    onboarding/                 Public onboarding flow
    role/                       Role selection
    (app)/                      Route group — gated by onboarding + role
      layout.tsx                Client-side auth gate (TODO: middleware)
      home/, events/, map/, offers/, cove/, surveys/,
      notifications/, profile/, safety/
    admin/                      Gated by role === "organizer"
      layout.tsx
  components/
    brand/                      JavitsLogo, DotPatternAccent, GradientWave
    ui/                         Button, ComingNext (prod tree-shakes), ...
    nav/                        BottomNav
  lib/
    store.ts                    Zustand persisted, versioned, migration-safe
    tokens.ts                   Brand tokens, voice/copy constants
  services/
    analytics/analytics.ts      Typed event registry, PII blocklist, ring buffer
    crm/MomentousAdapter.ts     Consent-gated CRM sync
    events/, wayfinding/, ...   Other service adapters (mocks in v1)
  types/
    models.ts                   Shared domain types (Role, etc.)
```

## Common commands

```bash
npm install
npm run dev           # http://localhost:3000
npm run dev -- -H 0.0.0.0   # expose to phones on the same wifi
npm run typecheck     # run before committing
npm run lint          # zero warnings, not just zero errors
npm run build         # catches SSR/CSR mismatches that dev hides
```

## When in doubt

- Prefer narrow types over `any` or `unknown` with casts.
- Prefer a new service adapter over inlining a fetch.
- Prefer a named constant over a magic number.
- Prefer `ComingNext` stubs with the build prompt embedded over half-built screens.
- Prefer asking in the PR over guessing what Pooja's brand review will say.

## Agents live in `.claude/agents/`

Invoke them by name when the work fits:

- `@javits-screen-builder` — build a screen from its embedded prompt
- `@javits-brand-qa` — verify a change against brand rules
- `@javits-code-reviewer` — project-aware pre-merge review
- `@javits-adapter-swap` — swap a mock adapter for a real service
- `@javits-a11y-auditor` — accessibility review (WCAG 2.1 AA + ADA)
- `@javits-test-writer` — write tests for services and components
- `@javits-analytics-guard` — verify analytics events are typed + PII-safe

Each agent's system prompt is in `.claude/agents/<name>.md`.
