# PUSH — Creative Production Package Portfolio Report

> Deep audit of `arndvs/push` — a production-ready creative package for an original comedy short film and its companion fictional universe, built entirely through AI-assisted writing and worldbuilding.

---

## Executive Summary

PUSH is a **complete pre-production package for an original ~5–7 minute comedy short film** about a man, a hangover, and a smart adjustable bed with no off button. The project spans a 909-line screenplay, a 624-line prop bible (canonical for all physical descriptions), a 55-shot AI video generation shot list with copy-paste prompts for Sora/Runway/Kling/Pika, a 54-panel storyboard handoff, and a full production design system — all written in Markdown, version-controlled with Git, and maintained through a rigorous document hierarchy with canonical source-of-truth enforcement across 7,498 lines of production documentation. 139 commits across the project's lifecycle.

The film exists inside a fully realized fictional universe: **RISE Technologies, Inc.** — a satirical tech company whose smart bed pushes you out of bed and to work whether you're ready or not. The companion project `rise-awake` is a production Next.js website (riseawake.com) that plays the fiction completely straight — investor relations, legal documents, internal security posture, and a 12-stage bed configurator. The comedy is never in the writing being funny. It's in the writing being perfectly earnest about something absurd.

---

## Project Structure

| Directory        | Contents                                                                                                       | Lines      |
| ---------------- | -------------------------------------------------------------------------------------------------------------- | ---------- |
| `01_screenplay/` | Full screenplay + gas station beat breakdown                                                                   | 1,044      |
| `02_production/` | Prop bible, visual reference, bed proportions, product line brief, cast sheet, design memo, RISE Move internal | 2,602      |
| `03_ai_video/`   | 55-shot AI shot list + RISE Move teaser script                                                                 | 1,450      |
| `04_storyboard/` | Storyboard handoff report (54 panels)                                                                          | 897        |
| `docs/`          | RISE Universe Report + screenplay craft reference                                                              | 1,396      |
| `assets/`        | Character sheet reference                                                                                      | 46         |
| **Total**        | **17 production documents**                                                                                    | **~7,500** |

---

## The Film

### Logline

A man with a hangover uses his smart adjustable bed to get himself up — and discovers it has no off button.

### Tone

Dry physical comedy. Buster Keaton meets Office Space. The world is absurd but played completely straight. Nobody mugs for the camera. Nobody screams. Dave adapts to everything with quiet resignation. The bed is professionally relentless. The humor lives in the gap between the two.

### Structure

| Act                  | Scenes            | Content                                                      | Tone                            |
| -------------------- | ----------------- | ------------------------------------------------------------ | ------------------------------- |
| Act 1: The Wreckage  | 1–3               | Wake up, flashbacks, discovers remote                        | Cold, quiet, accumulating dread |
| Act 2: The Gauntlet  | 4–8 (includes 7A) | Bed rises, bathroom, closet, hallway/tie, coffee             | Escalating physical comedy      |
| Act 3: The Commute   | 9–11              | Driveway, car, drive-through, bus, gas station, highway      | Road comedy, consequence        |
| Act 4: The Office    | 12–16A            | Lobby, elevator, Marcus reveal, meeting, Karen, Marcus/Priya | Deadpan workplace absurdism     |
| Act 5: The Wind Down | 17–18             | Afternoon recovery, group chat, departure                    | Earned warmth                   |
| Epilogue             | 19                | Next morning — cycle repeats                                 | Circular                        |
| End Credits          | —                 | Bed commutes home alone                                      | Quiet, moving                   |

21 scene headings. 55 shots. 5 acts + epilogue + credits. ~5–7 minute runtime.

### Key Characters

| Character          | Role                                                                                                            |
| ------------------ | --------------------------------------------------------------------------------------------------------------- |
| **Dave**           | Early 30s. Perpetually one bad decision from being a mess. Never fights the bed. Adapts instantly.              |
| **The Bed**        | PUSH by RISE. The real protagonist. Professional patience incarnate. Dark charcoal, tank tracks, no off button. |
| **Marcus**         | Work buddy. PUSH+ owner — same brand, premium tier, warmer colorway, seven pillows. Equal wreckage.             |
| **Karen**          | Boss. VP. Former NUDGE owner (first-gen RISE product). "I had the Nudge. Made me a VP."                         |
| **Young Employee** | Almost asks about the beds. Doesn't. Writes "beds??" in his notebook.                                           |

---

## Document System

### Document Hierarchy (Enforced)

The project operates under a strict canonical hierarchy where conflicts are resolved by document authority:

1. **Prop Bible** (v4.0) — canonical for all physical descriptions. Overrides everything.
2. **Screenplay** (v7.0) — canonical for story, dialogue, scene order.
3. **Visual Reference Guide** (v4.2) — production-facing: camera, editing, tone, staging.
4. **Bed Proportions Guide** (v4.4) — environment integration: how the bed fits in every space.
5. **AI Shot List** (v4.5) — 55 generation-ready prompts referencing all upstream docs.
6. **Storyboard Handoff** (v1.3) — panel-by-panel brief distilled from the full production package.

This hierarchy is not decorative. Version audits have been run (9 slices, 6 complete) that reconcile downstream documents against upstream sources. The README tracks canon audit status at the version level. When a prop description in the shot list conflicts with the prop bible, the prop bible wins — and the shot list gets patched.

### Canon Audit System

The project has undergone multiple canon audit remediations tracked in `working/audit-remediation-plan.md`:

- **Version 3.4**: Pillow payoff locked to "askew" (Prop Bible v3.1 canonical). Screenplay v5.0 aligned. Cast cleanup. Mechanical fixes across Move Internal and gas station breakdown.
- **Version 3.5**: PUSH/PUSH+ tier alignment across all docs. Prop Bible v4.0 canonical. Screenplay v6.0. Universe Report duplicate Part Two removed (819 lines). Design Memo tracks/engine panel marked not-adopted.
- **Current**: 9 audit slices — slices 1–3 and 6–8 complete. Slices 4, 5, 9 still open (HITL decisions needed).

---

## Key Production Documents

### 1. The Prop Bible (624 lines)

The single most important document. Defines the bed as a cinematic character through:

- **The Foundational Principle** — "The bed belongs wherever it is. The audience feels this. They do not measure it." Derived from studying Netflix's _Trash Truck_ animation series.
- **Physical construction** — Frame (brushed aluminum/powder-coated steel, storm-cloud charcoal with cool blue undertone), mattress (standard, white, fitted navy sheet), one PUSH pillow with pneumatic reshaping node, continuous tank track system beneath the frame.
- **Four states** — Flat (resting), Raised (transition, 45°→90°→120°+), Vertical (rolling on tracks, the film's signature image), Folded (taco V-shape, wedged into car back seat).
- **The hum** — Full modulation table. The hum is the bed's voice: warm, low, slightly musical. Modulates to express patience, impatience, satisfaction, and professional indifference.
- **Self-making mechanism** — Tensioning bar (fitted sheet), pneumatic pillow node (plumps and reshapes). Operates in parallel with Dave's morning routine. The bed gets dressed while Dave scrambles.
- **The PM-1 Remote** — One button labeled PUSH. Glows warm white. No off switch. Fine print on the back reads: "Push Mode cannot be manually interrupted once initiated. This is a feature, not a limitation."

### 2. The AI Shot List (893 lines)

55 shots formatted as self-contained copy-paste prompts for Sora, Runway, Kling, and Pika. Includes:

- **Character reference prompts** — Generate Dave (sleepwear), Dave (office), Marcus, and the Bed as anchor images first for cross-shot consistency.
- **Technical defaults** — 16:9, 24fps (240fps for slow-motion shots 008–009), negative prompts appended to every generation.
- **Multi-clip flagging** — Shots requiring multiple AI generations (current models max ~4–5s for complex action) are flagged with ⚠ MULTI-CLIP and suggested breakpoints.
- **Composite text flagging** — Shots requiring readable text (AI models can't render reliably) are flagged with ⚠ COMPOSITE TEXT.
- **Per-shot notes** — Director's guidance on timing, performance, and what makes each shot land.

### 3. The Visual Reference Guide (464 lines)

Collaborator-facing document covering:

- **Tone references** — Buster Keaton, Office Space, Nathan For You, I Think You Should Leave.
- **Color palette by sequence** — Blue-gray (pre-alarm) → desaturated warm (flashbacks) → increasingly golden (morning gauntlet) → flat fluorescent (office) → golden hour (wind down) → exact match to opening (epilogue).
- **Camera philosophy** — "Wide shots are the comedy." Keep both Dave and the bed in the same frame. The camera should never be as distressed as Dave. This is a documentary about a normal morning.
- **Scene-by-scene visual notes** — Specific direction for every scene: hold durations, editing rhythm (cut on the beat), what to show and not show.
- **The self-making intercut** — Dave is getting ready. So is the bed. The comedy is in the contrast. Dave is scrambling. The bed is calmer.

### 4. The Bed Proportions Guide (323 lines)

How to solve impossible geometry in every environment — the "Trash Truck Problem":

- **7 Golden Rules** — Edit around impossibility (cut before entry, cut after arrival). Frame wide or close, never medium. Light the bed like the room. Dave never looks at the space like it's wrong. The bed has weight. Design environments first. Dave's eyeline is always the bed or forward, never the doorframe.
- **Environment-by-environment breakdown** — Bedroom, hallway, bathroom (bed waits at the doorway — correct comedic choice), kitchen, car interior, elevator (never show the interior), office floor, conference room.

### 5. The Storyboard Handoff (897 lines)

A self-contained brief distilling the entire production package into a panel-by-panel storyboard specification:

- 54 panels across 21 scene headings
- Complete character and prop reference (distilled from prop bible)
- Four bed states illustrated with descriptions and when each appears
- Shot-by-shot framing notes with camera angles and emotional beats

### 6. The RISE Move Teaser Script (557 lines)

A 75-second product teaser for the next-generation PUSH that navigates stairs:

- 6 actuator beauty shots (macro, 240fps, Swiss-watch-meets-industrial-robot aesthetic)
- 12 edit beats cut to "Stand Up" by Ludacris ft. Shawnna
- Every shot change lands on a beat
- Production philosophy: "RISE is not in on the joke. RISE is the joke's straight man, and the straight man never breaks."

### 7. The Gas Station Beat Breakdown (135 lines)

Deep-dive companion for the commute sequence's climactic beat — where the bed's impatient hum causes Dave to skip the gas station, the car dies, and Dave ends up pushing the car while the bed pushes Dave:

- Editorial philosophy: why the gap between "car dies" and "parking lot arrival" is never shown — "whatever the audience imagines is funnier than anything we could show"
- Sound design direction for the warning hum
- Character analysis of the fuel gauge as accumulated poor choices, not a plot point

---

## The Fictional Universe

### RISE Technologies, Inc.

A fully realized satirical tech company built with extraordinary depth. Every document plays the fiction completely straight.

| Detail               | Value                                                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Founded**          | 2009 (implied by product history)                                                                                 |
| **CEO**              | Dr. Eleanor Voss — PhD Behavioral Sleep Science, Stanford                                                         |
| **Tagline**          | "For People Who Need A Little Push."                                                                              |
| **Core thesis**      | The problem isn't information or intention. It's the moment between deciding and doing. RISE removes that moment. |
| **Revenue (FY2024)** | $89.4M (+134% YoY)                                                                                                |
| **Waitlist**         | 340,000                                                                                                           |
| **IPO**              | S-1 filed April 2025                                                                                              |

### Product Line (15-Year Arc of Escalating Commitment)

- **The Graveyard** (2011–2019) — 13 discontinued products. Each taught RISE one lesson: people will adapt to anything gentle. RISE Tone made users sleep better. RISE NudgeTone made them sleep 23 minutes longer. RISE NudgeEdge: 100% rolled back to center.
- **The PUSH** (current) — The base model. Dave's bed. Raises, rolls, folds, self-makes, gets you to work. Compliance rate: 98% vs. 74% for the Nudge. Sold out.
- **The PUSH+** — Marcus's bed. Same chassis, everything upgraded. Seven pillows, silk/sateen, dampened tracks, Atmosphere Suite. The Toyota vs. Lexus of beds.
- **The PUSH+ Select** — Exists on the website only. The pricing page tier with the "Most Popular" badge — designed to make the PUSH+ feel like "only $X more."
- **The MOVE** — Next generation. Navigates stairs. Both directions. Requires Vertical Navigation Services (VNS) subscription. "We are aware of the stairs. All of them. Both directions. We are doing something about it."

### Brand Voice

Three words: Simple. Confident. Relentless.

- "Push Mode cannot be manually interrupted once initiated. This is a feature, not a limitation."
- "The problem is not information. The problem is not intention. The problem is the moment between deciding and doing."
- "We are not currently accepting questions about The Push Pro."
- The only exclamation point in the entire brand: "Have a productive day!" — on the remote's fine print.

### The Comedy Layer

The entire RISE universe operates on one principle: **complete institutional confidence about something that should alarm you.** Every system functions exactly as described. The horror is that it all works.

| Element              | What It Appears To Be  | What It Actually Is                                                |
| -------------------- | ---------------------- | ------------------------------------------------------------------ |
| Push Mode            | Premium feature        | Unstoppable physical intervention                                  |
| The Remote           | Elegant product design | One button. No off.                                                |
| Internal docs portal | Accidentally public    | Intentionally "accidentally" public. Arvin left.                   |
| Data request         | GDPR compliance        | 10-step Kafkaesque gauntlet. 6–18 months. $35. Delivered on USB-A. |
| Trust Center         | Transparency           | Intentional 404. "Coming Soon" since Q4 2024.                      |
| 99.97% uptime        | Reliability metric     | "Excluding periods during which monitoring was unavailable"        |
| The MOVE             | Next-gen product       | Subscription for stairs. Both directions.                          |

### The Arvin Reyes Thread

Arvin is a fictional junior developer who built the internal document management system and left on August 12, 2024 without finishing critical infrastructure. His presence permeates the companion website through TODO comments, active session tokens with no expiry, an isPublic field that defaults to true with no toggle to change it, and a secret farewell page accessible only by direct URL or a 1px invisible link on the 404 page.

### The Ludacris Thread

- **PUSH** uses "Move Bitch" — Dave's song, interrupted by the fuel gauge, completed as a whistle at 5PM.
- **The MOVE teaser** uses "Stand Up" — "when I move you move, just like that."
- Both Ludacris. Both about movement. The connection is never stated. "The universe runs on Ludacris."

---

## Design & Production Design Philosophy

### The Trash Truck Principle

The film's spatial logic is built on studying Netflix's _Trash Truck_ — an animated series where a full-size garbage truck accompanies a child everywhere without anyone questioning it. The principle: **the environment bends to accommodate the relationship, not the other way around.**

Applied to PUSH through 7 golden rules (edit around impossibility, frame wide or close never medium, light the bed like the room, Dave never looks at the space like it's wrong, the bed has weight, design environments first, Dave's eyeline is always the bed or forward).

### The Bed as Cinematic Character

The Design Memo documents a problem the prop bible didn't address: the bed is a rectangle, and rectangles don't have cinematic topography. A garbage truck has bumpers, wheel wells, a cab, an exhaust stack — every crop gives a different readable shape. The memo defines 5 distinct angle types (face, back, undercarriage, flank, texture) to make the bed photographable as a character with a body.

---

## Companion Project — riseawake.com

The RISE universe extends to a production Next.js website (`rise-awake` repo) with ~41 page components serving 50+ URLs:

- **Consumer**: Homepage, product pages (PUSH sold out, NUDGE discontinued), MOVE teaser, 12-stage configurator, FAQ
- **Investors**: Hub, Vision 2045, shareholder letter, annual report, meeting minutes, interactive financials (Recharts), press
- **Legal**: 6 legal documents (~108 sections) of perfectly earnest absurdist legalese
- **Internal**: Payload CMS simulation — 21 documents, 3 user accounts, broken uploads, settings that don't save
- **Security**: All certs pending. Bug bounty form 404s. Trust Center "Coming Soon" since Q4 2024.
- **Hidden**: PM-1 Remote interactive page, Arvin's farewell, Konami Code easter egg, "push" input listener

Tech stack: Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Sanity v5 · Recharts · Vercel

---

## Engineering Highlights (As a Writing Project)

1. **Document hierarchy with canonical enforcement** — A strict source-of-truth system where conflicts are resolved by document authority, not by which file was edited last. The Prop Bible is canonical. Everything else defers.

2. **Canon audit system** — 9-slice audit methodology that reconciles all downstream documents against upstream sources. Version-tracked remediations. The same rigor applied to code quality, applied to creative consistency.

3. **AI-generation-ready shot list** — 55 shots with copy-paste prompts formatted for 4 different AI video tools, with character anchors, multi-clip flagging, composite text flagging, and per-shot editorial notes.

4. **The Trash Truck research** — Original production design research into an under-documented animated series, reverse-engineering its spatial logic principles and codifying them into 7 reusable rules.

5. **Worldbuilding depth** — A fictional company with 15 years of product history, financial data, leadership bios, legal documents, security posture, investor relations, internal systems, and a developer who left with TODO comments scattered through the codebase.

6. **Cross-project coherence** — The PUSH production package and the riseawake.com website share a single fictional universe with consistent brand voice, product specs, and character details maintained across two separate repositories.

7. **Version-controlled creative writing** — 139 commits, pull requests with AI-assisted review, conventional commit messages, branch-based workflow. The screenplay is tracked the way production code is tracked.

---

## Portfolio Relevance

| Dimension             | Detail                                                                                                            |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Scale**             | ~7,500 lines across 17 production documents, 139 commits                                                          |
| **Writing**           | Screenplay, production design, brand voice, satirical corporate copy, technical specifications                    |
| **Production Design** | Camera philosophy, color palettes, sound design, environment integration, storyboard specs                        |
| **AI Video**          | 55-shot generation-ready prompts for Sora/Runway/Kling/Pika with multi-clip and composite text flagging           |
| **Worldbuilding**     | Fully realized fictional company spanning 15 years, with financial data, legal docs, and hidden narrative threads |
| **Systems Thinking**  | Document hierarchy, canonical enforcement, canon audit slices, version-tracked remediation                        |
| **Cross-Repo**        | Single universe maintained across PUSH (production) and rise-awake (website) repositories                         |

---

## Stats

| Metric                    | Value                                |
| ------------------------- | ------------------------------------ |
| Production Documents      | 17                                   |
| Total Lines               | ~7,500                               |
| Commits                   | 139                                  |
| Screenplay Scenes         | 21 (19 numbered + 2 inserts)         |
| AI Video Shots            | 55                                   |
| Storyboard Panels         | 54                                   |
| Prop Bible Version        | 4.0                                  |
| Screenplay Version        | 7.0                                  |
| Canon Audit Slices        | 9 (6 complete, 3 open)               |
| Fictional Products (RISE) | 17 (13 graveyard + 4 current/future) |
| riseawake.com Pages       | 50+ URLs across ~41 components       |
