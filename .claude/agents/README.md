# Javits Agents — What They Are, When To Use Them

Seven project-aware Claude Code subagents that know the Javits app's architecture, brand rules, and compliance posture. They ship with the repo so anyone (including future Claude Code sessions) picks them up automatically.

## Agent directory

| Agent | Role | When to invoke |
|---|---|---|
| `javits-screen-builder` | Turn a stub screen into its real implementation | "Build /offers" / "Implement the Profile screen" |
| `javits-brand-qa` | Verify UI against strict brand rules | Before merging any UI change |
| `javits-code-reviewer` | Project-aware pre-merge review | Before every PR merge |
| `javits-adapter-swap` | Replace a mock adapter with a real integration | Phase 2 integration work (Momentous, Cisco Spaces, Stripe) |
| `javits-a11y-auditor` | WCAG 2.1 AA + ADA accessibility review | Before merging screen work, before pilot |
| `javits-test-writer` | Write unit + integration tests | When adding or changing a service or component |
| `javits-analytics-guard` | Enforce typed event registry + PII blocklist | Whenever `analytics.track(...)` is touched |

## How to invoke in Claude Code

In a Claude Code session in this repo, reference an agent by name:

```
@javits-screen-builder Build the Offers screen following its embedded prompt.
```

Or call multiple in sequence:

```
@javits-screen-builder build /events, then @javits-brand-qa verify it, then @javits-code-reviewer review before I push.
```

Claude Code will spin up the agent with its system prompt, scoped tools, and inherited project context (`CLAUDE.md`).

## Typical workflows

### Build a new screen end-to-end
```
1. @javits-screen-builder build /<route>
2. @javits-analytics-guard check the new events
3. @javits-brand-qa verify the UI
4. @javits-a11y-auditor audit the new screen
5. @javits-test-writer add coverage for the new service methods
6. @javits-code-reviewer review everything before I push
```

### Wire a real integration (Phase 2)
```
1. @javits-adapter-swap replace the <Service> mock with the real <Vendor> API
2. @javits-test-writer add tests for the new adapter
3. @javits-code-reviewer review the swap
```

### Pre-PR sanity check
```
@javits-code-reviewer review my branch
@javits-brand-qa check for brand violations
@javits-a11y-auditor audit any new UI
```

## Why this is worth doing

Agent definitions are a project asset — they encode the rules that otherwise live in someone's head. When Pooja leaves, when a contractor joins, when Claude Code rolls out a new model, the agents still know the same rules. This is how institutional knowledge survives handoffs.

They also compound. Every time the reviewer flags a violation, the next developer writes the code correctly the first time. Every time the screen-builder produces working code the first try, the team spends their review time on real decisions instead of style nits.

## How to extend

- **Add a new agent:** create `javits-<name>.md` with the same frontmatter structure. Keep the system prompt tight — 200-400 lines is the sweet spot. More than that and the agent starts forgetting its own rules.
- **Update an existing agent:** prefer small edits over rewrites. If the rule has genuinely changed (e.g., a brand guideline update), note the change in `CLAUDE.md` too.
- **Deprecate an agent:** delete the file. The agent disappears from future Claude Code sessions.

## Slash commands

See `.claude/commands/` for shortcut prompts that invoke multiple agents in a canonical order.
