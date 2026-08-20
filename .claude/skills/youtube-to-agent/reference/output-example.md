# What good output looks like

A calibration reference. The failure mode is bland, timestamp-free notes that
could have been written without watching. Compare:

**Weak** — no timestamp, no verdict, unfalsifiable:
> The speaker discusses the importance of good prompt engineering and shares
> several tips for getting better results from AI models.

**Strong** — locatable, specific, and it takes a position:
> **[8:12](https://www.youtube.com/watch?v=ID&t=492s)** `[claim]` Splitting one
> agent into a planner and an executor cut their tool-call error rate "from about
> 30% to under 5%" on internal evals. `[unverified]` — the evals are not shown
> and the benchmark is not named.

## `00-brief.md` skeleton

```markdown
# <Title>
**Type:** tutorial · **Length:** 42:17 · **Worth:** watch 8:00–24:00, skip the rest

**TL;DR** — <one sentence a reader can act on>

## Summary
- <5–8 bullets, each a distinct claim, not a topic label>

## Who this is for
<and, plainly, who should skip it>

## Verdict
<what holds up, what is oversold, what is missing>
```

## Calibration rules

- A bullet that would be true of any video on the topic is filler — cut it.
- "The speaker explains X" says nothing. What did they *say* about X?
- A verdict that never criticizes is not a verdict.
- If the video is thin, say the video is thin. Padding a weak source into a rich
  document is the single worst outcome of this pipeline — the user then trusts
  notes with nothing under them.
