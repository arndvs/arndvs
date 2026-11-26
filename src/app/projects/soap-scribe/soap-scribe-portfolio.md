# SOAP Scribe — portfolio source

**Status: draft.** Unlisted (not in `PROJECTS` or `projects-content.tsx`) until the open items below are done.

The source material for this case study is the public repo, not this file:

- Repo: https://github.com/arndvs/soap-scribe

| Section of the page | Source                                                       |
| ------------------- | ------------------------------------------------------------ |
| Situation           | `README.md`, `docs/ux/01-user-stories.md` (Stories 1–3)      |
| System diagram      | `ARCHITECTURE.md` section 1                                  |
| The draft           | `ARCHITECTURE.md` section 2, `pipeline/compose.ts`           |
| The jobs            | `ARCHITECTURE.md` section 3                                  |
| The insert          | `ARCHITECTURE.md` section 4                                  |
| Decisions           | `docs/decisions.md`                                          |
| Learnings           | `docs/gaps.md` (G-25, G-26, G-27), `docs/ux/traceability.md` |
| Test counts         | `docs/verification.md`, CI on `main`                         |
| Images              | `docs/images/` (demo mode, synthetic patients)               |

Synthetic data. Not affiliated with Jane App or Pocket.

## Open before publishing

- [ ] D-05: does the page name the practice? Currently "a chiropractic practice" and "my wife".
- [ ] Bonnie's before/after charting time (G-13). The metrics have no time result yet.
- [ ] Facts ledger: add a SOAP Scribe section with the counts (114 unit and integration, 8 end to end) dated from CI.
- [ ] Register the slug in `src/lib/data/projects.ts` and add the card in `projects-content.tsx`.
- [ ] Optional: a blog walkthrough, like the inKind one, once a session with Bonnie has run.
