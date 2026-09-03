# Agent Review-Loop Optimization

**Status:** Permanent research
**Date:** 2026-08-07
**Related:** Blog post "I Was Burning Tokens on AI Code Reviews. Here's How I Fixed It" · LinkedIn article

## TL;DR

I was running 2–10 GitHub Copilot review rounds per feature branch. Each round re-pasted the same review comments into context, inflating token spend and creating manual triage toil. I changed the process to **one feature→dev review, then a consolidated dev→main review** that catches edge cases across all merged features at once. An independent third-party analysis of my session history reached the same conclusion without being told.

## The Problem

### The old workflow

```
feature branch → PR to dev → Copilot review → fix → re-review → fix → re-review (2–10 rounds)
                                                                        ↑ redundant
```

Each review round:

- Re-pastes the same review comments into the agent's context window
- Re-scans the full diff even when only a few lines changed
- Re-flags already-fixed items (diminishing returns)
- Costs input tokens on every round

### The evidence

Measured from session history (aggregate, anonymized):

| Month | Copilot-review-related messages | dev→main promotions |
| ----- | ------------------------------- | ------------------- |
| May   | 47                              | 1                   |
| Jun   | 78                              | 7                   |
| Jul   | 30                              | 5                   |
| Aug   | 70                              | 11                  |

- A single PR reached **round 7** of Copilot review before it was merged.
- Review-message volume stayed high through July; the shift to consolidated dev→main reviews is visible in August (promotions rose from 5 → 11 while the review pattern changed from per-feature to per-promotion).

### The token-cost realization

The cost driver was not the review itself — it was the **redundant re-pasting** of the same review comments across rounds. Each round re-supplied context the agent already held, which is the definition of context bloat.

## The Change

### The new workflow

```
feature branch → PR to dev → ONE Copilot review → fix → merge to dev
                                                          ↓
                              collect all merged features → PR dev→main → ONE consolidated Copilot review → fix → merge
```

- **Feature→dev:** one review round, catch feature-local issues.
- **Dev→main:** one larger consolidated review, catch cross-feature edge cases and integration issues that only appear when everything is merged together.

### Why it's better

1. **Fewer redundant rounds** — edge cases are caught in one consolidated pass instead of scattered across per-feature re-reviews.
2. **Lower token spend** — review comments are pasted once per promotion, not once per round.
3. **Better edge-case coverage** — integration issues are only visible at the dev→main boundary, so consolidating there catches what per-feature reviews miss.
4. **Less manual toil** — no more re-flagging already-fixed items across rounds.

## The Independent Confirmation

An independent third-party analysis (MEGA) scanned the session history and, without being told about the change, identified the same pattern:

- **Context economy** was the weakest measured trait — driven by the redundant re-pasting of review comments.
- The recommended "next step" was to **state explicit stop conditions, isolate scopes, and attach acceptance criteria to briefs** — which is exactly the discipline the consolidated-review workflow enforces.

The analysis independently converged on the same conclusion I reached on my own: the review-loop habit was inflating context cost, and the fix is to consolidate and bound the review process.

## The Reusable Framework: Review-Loop Budget

A checklist any team can apply to bound AI-review spend:

1. **Set a review-round budget.** Decide the max rounds per PR before escalation (e.g., 2). Beyond that, escalate to a consolidated review rather than continuing to re-review the same PR.
2. **Consolidate at the integration boundary.** Run the "big" review at dev→main (or equivalent), not per-feature, so cross-feature edge cases are caught where they actually appear.
3. **State stop conditions in the brief.** Tell the agent what "done" means and when to stop and check in, before it starts.
4. **Isolate scopes.** Give each concurrent worker its own branch/worktree so they don't overwrite shared state.
5. **Attach acceptance criteria to the brief.** Define checkable completion criteria up front rather than evaluating after the run.

## Metrics to Track

- Review rounds per PR (target: ≤2)
- Review-message volume per promotion cycle
- Token spend per merged feature
- Edge cases caught at dev→main vs. per-feature (should shift toward dev→main)

## Conclusion

The lesson is not "stop using AI code review" — it's **bound and consolidate it**. AI review is most valuable at the integration boundary where cross-feature edge cases appear, and least valuable as an unbounded per-feature loop. Treating agent workflows as an engineering discipline — measure, bound, consolidate — is what turns a tool into a system.
