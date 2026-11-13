---
title: "The Return Visit: 15 Years of Building Machines That Bring Customers Back"
slug: marketing-engineer-lifecycle-automation
excerpt: "In 2014 I wrote a book chapter promising a marketing machine that runs itself. I didn't know how to build it yet. This is the twelve years since: Infusionsoft, a customer engagement platform built from scratch, GoHighLevel for real businesses, and now AI agents inside the machine."
tldr: "Every lifecycle system I've built is software for one idea from my 2014 book chapter: reward people after they buy, make the reward big enough to matter, and use the data to bring them back. I built it first in Infusionsoft (about 40 landing pages feeding a round-robin to a sales team), then as a SaaS platform at RipeMetrics (journeys, segments, templates, 10DLC compliance, deliverability and a SQL warehouse, all from scratch), then for real businesses on GoHighLevel (AI insurance verification, a nightly RFM engine, an A/B harness that refuses to call winners early). Now I'm putting agents inside it. The post ends with the ten checks I run before any lifecycle message ships."
categories: [Marketing Engineering, Lifecycle Marketing, AI]
metaTitle: "The Return Visit: 15 Years of Building Lifecycle Marketing Machines"
metaDescription: "A marketing engineer's field notes: loyalty consulting, Infusionsoft, a customer engagement platform built from scratch, GoHighLevel automation, and AI agents. With code, diagrams, and a pre-send checklist."
focusKeyword: marketing engineer lifecycle automation
---

In 2009, one of my longtime merchant-services clients called with a question. She wanted to know how to market her gift card program. The cards sold themselves at the holidays and sat next to the register the rest of the year.

I had no idea what to say.

I'd been selling card processing since 2006. I knew gift cards helped her cash flow through breakage and float. I had never once thought of a merchant account as a marketing tool.

Five years later I wrote a book chapter about the answer. It's Chapter 11 of _Going Up_ (2014), "How to Produce a $35.71 Return for Every $1 Invested in Marketing Your Business." In the opening pages I promised readers "a business-booming marketing machine that runs automatically 24/7/365."

I didn't know how to build that machine yet.

I've spent the years since building it. First in Infusionsoft. Then as a SaaS platform. Then for real businesses on GoHighLevel. Now with AI agents inside it. This is the whole arc: the code, the diagrams, what broke, and the checklist I run before anything ships.

## Rewards are triggers, not discounts

The chapter makes one argument. Most local businesses discount _before_ the purchase: coupon books, mailers, daily deals, 50% off, BOGO. That trains customers to show up only when there's a coupon. The chapter calls them groupies. They're loyal to the discount, not to you.

The alternative is to charge full price and reward the customer _after_ they buy. The reward has to be big enough to notice. The example I used was Home Depot. A $0.10 reward wouldn't change where you buy your next drill. A $5 or $10 reward would make you think twice before driving to Lowe's.

A reward isn't an expense. It's a trigger.

The math backs it up. A family spends $50 a visit, 20 visits a year, for five years. That's $5,000 in sales and roughly $3,000 in gross profit from one table. Lose them unhappy, and the referrals you lose with them push the real cost past $45,000. Once an owner sees that number, a $5 reward looks cheap.

From 2010 to 2016 I put this into practice as a loyalty consultant for restaurants and retailers. Cash-back rewards, gift cards, and donations to schools, churches and youth leagues that only accrued after a full-price purchase. Every program captured the customer at the point of sale, so the owner finally had a database.

Then we used it:

- A VIP list of the most frequent, highest-spending guests
- Flags for guests lapsed 30, 60 and 90+ days, each with its own win-back offer
- A text after every visit with the updated reward balance
- Announcements and progress updates segmented by customer group and partner organization

Read that list again with today's vocabulary. A VIP list is a segment. "Lapsed 60 days" is a trigger. A post-visit text with a live balance is a personalized template. A win-back sequence is a journey.

I was speccing lifecycle marketing on whiteboards before I knew what to call it.

Merchant services taught me the other half: distribution. My larger accounts included Wienerschnitzel and Original Pancake House. One yes from corporate meant I could warm-pitch 130+ franchise locations without re-selling the deal every time. Build it once, roll it out everywhere. I still think about every system that way.

## The first machine ran on Infusionsoft

At Mainstream, a merchant services company that was later acquired, I led the Infusionsoft implementation and ran the account. Infusionsoft is Keap now. Back then it was the first wave of canvas-style marketing automation for small businesses.

The website was thin. I rebuilt it as a catalog: about 40 WordPress pages, one for each product (POS systems, terminals, cash advance, gift cards, check services) and one for each niche we sold into. Every page had an opt-in form.

Every opt-in landed in Infusionsoft with tags for the product and the niche. The tags decided which multi-touch follow-up sequence the lead got. The strongest offer was a statement audit: send us your processing statement and we'll show you what you're overpaying. Hot leads went to a round-robin that rotated them across a team of about 15 sales agents.

Those pages brought in somewhere between 30 and 50 inbound leads a month. It was a long time ago, so treat the numbers as ballpark. The structure is what stuck with me:

- **Per-niche pages with opt-ins** are segment capture at the source
- **Tags** are custom attributes
- **Follow-up sequences** are a journey (a Canvas, if you speak Braze)
- **The statement audit** is a lead magnet
- **The round-robin** is speed-to-lead routing

The tool was clunky. The thinking held up. Segmentation and triggers were business decisions long before they were product features. And a hot lead goes cold in minutes, not days, so routing matters as much as the message.

## Then I built the platform

In 2017 I pitched a cannabis feedback platform to the Canopy accelerator in San Diego. I had no idea what I was doing.

That became RipeMetrics. It grew from feedback surveys into a CRM, business intelligence platform and omnichannel marketing tool for restaurants and retail. I ran it for eight years, first as founder and CEO, then as lead frontend and AI engineer.

The marketing automation half was a module called Engage. It's a customer engagement platform built from scratch, the same category of product as Braze or Klaviyo. Building one teaches you that every CEP is six primitives wearing a UI.

### Journeys

A journey had three tiers. The journey was the template. Its automated messages were the ordered steps, up to 100 per flow. A per-tenant store held each business's own copy, so a restaurant could edit its win-back without touching anyone else's.

Behavior triggered entry. Delays and send windows lived in JSON schedule templates. Branching was a chain of guards: before every step, check consent, eligibility and timing, then send or skip.

Most lifecycle bugs are guard bugs. The message went to someone who had already converted, or opted out, or got the same thing yesterday.

### Segments

The segment builder sat on 40+ composable query scopes. Saved segments showed a live audience count and the revenue at stake before you hit send.

Under that sat an RFM model in SQL. RFM ranks every customer by how _recently_ they bought, how _frequently_, and how much _money_ they spent. We added a fourth axis, how much discount they used, because a customer who only buys on promotion is the groupie from the chapter.

```sql title="update-rfmds.sql"
INSERT INTO rfmd_groups (store_id, customer_store_id,
  recency_score, frequency_score, monetary_score, discount_score, updated_at)
SELECT store_id, customer_store_id,
  NTILE(10) OVER (PARTITION BY store_id ORDER BY latest_purchase_at)        recency_score,
  NTILE(10) OVER (PARTITION BY store_id ORDER BY total_number_of_purchases) frequency_score,
  NTILE(10) OVER (PARTITION BY store_id ORDER BY total_sales_in_cents)      monetary_score,
  NTILE(10) OVER (PARTITION BY store_id ORDER BY total_discount_in_cents)   discount_score,
  now()
FROM rfmd;
```

Each store's customers got split into deciles on all four axes, then mapped into 13 named segments like Best Customers, New Customers and At Risk.

The part I'm proudest of is the predicted dates. From each customer's average gap between purchases, and how much that gap varied, we computed when they should come back, a date a little before that to nudge them, and a date after which they were probably slipping. My whiteboard version said "lapsed 60 days" for everyone. The software could say "lapsed for _you_."

### Templates

Personalization ran on a token engine (`{customer_first_name}` and friends) over a library of 40+ React Email content blocks, with a drag-and-drop editor for people who didn't want to touch code. A phone-mockup preview showed how a message would look on a real screen before it went out.

### Consent and compliance

If you've ever tried to get carriers to deliver texts for a cannabis brand, you know they don't take your word for anything.

In the US, every business that texts customers from a regular 10-digit number has to register its brand and its campaign with The Campaign Registry. Most platforms hand that to the customer as a console chore. We did it in code, per tenant:

```text title="10DLC registration, one tenant"
1. TrustHub        Secondary Customer Profile
2. Trust bundle    A2P Trust Bundle
3. TCR             Brand Registration
4. Messaging       Messaging Service
5. TCR             Campaign Registration

19 ordered steps across 5 phases
branches on EIN (business) vs. sole proprietor
every step idempotent, every resulting ID persisted
```

Around that sat STOP handling, 12 consent flags, and quiet hours in the customer's time zone.

### Deliverability

Every tenant got its own SendGrid subuser through an 8-stage provisioning pipeline, with SPF, DKIM and DMARC records generated automatically, a dedicated IP, and bounce suppression. One restaurant's bad list couldn't sink another restaurant's inbox placement.

### The warehouse

46 hand-written SQL scripts fed a 16-table analytics warehouse: the RFM deciles above, retention curves, cohort heatmaps by first-purchase month, market-basket analysis, and campaign attribution.

On top of all six primitives sat the AI layer. One agent answered chat, SMS, email and voice with the full purchase history in context. AI automation cut customer service costs by 40%. Client onboarding used to be a 30-minute call, walking each new client through entering their logo, brand colors, voice and copy. An AI pipeline that scraped their site did it in under 60 seconds. The full build is in the [RipeMetrics case study](/projects/ripemetrics).

Then it ended. We built too broad without enough resources. Eight codebases. Ten to twelve developers at peak. The board shut it down.

What I kept is a map of where every primitive breaks. Building the guard chain taught me where double-sends come from. Building the 10DLC pipeline taught me why texts quietly stop delivering. Now when I open someone else's CRM, I know where to look first.

## Running the machine for real businesses

Lately I've been doing this work for operators directly, mostly on GoHighLevel. Two projects show the range.

### AlignSD: an appointment business

AlignSD is a San Diego chiropractic practice: 17 years, 5,000+ patients. The first problem they brought me wasn't marketing. It was insurance verification.

A patient called to check their coverage. If the office was closed, they left a voicemail. A Thursday voicemail stacked three "next business day" delays before anyone did anything. When the front desk did pick up, the call took 15 to 20 minutes, then went to the biller, who had her own one-to-two-day queue. Worst case: seven days, four hand-offs, and no visibility for the patient in between.

@embed https://arndvs.github.io/ai-visuals/visuals/phone-tag-to-pipeline/ | Phone tag to pipeline animation | 4 / 5 | Voicemails and email chains become one upload.

I replaced it with a five-step form. The patient uploads their card and license once. GPT-4o Vision reads the card into a strict JSON schema, so the model can't invent fields. Clean submissions go straight to the biller. Anything unclear goes to the front desk for a human look. Junk goes to an ops inbox. Every downstream service (the CRM, four emails, Slack) fails on its own, so a CRM outage never leaves a patient wondering whether their card arrived.

The junk part mattered more than I expected. A public form with an upload field attracts bots, proxy traffic and cleaning-service pitches. If the biller had to wade through that, the automation would have saved nothing. So every submission passes seven checks, cheapest first:

@embed https://arndvs.github.io/ai-visuals/visuals/spam-gauntlet/ | Spam gauntlet animation | 4 / 5 | Seven checks, ordered by cost. Only real patients reach the biller.

1. A honeypot field, plus a two-second minimum fill time
2. Rate limits (two insurance submissions per IP per day)
3. Proxy and VPN detection
4. US-only geography
5. A CIDR blocklist
6. Email validation
7. An AI check for sales pitches dressed up as patients

The first two are free. The paid API calls only run on what survives them.

On the lifecycle side, I built a lead-magnet funnel: ad click, landing page, capture, PDF by email, CRM sync, then a fork toward booking. Adding a new magnet is four files, three of them one-liners. It's the Mainstream statement audit again, ten years later, with types. Behind it sits a 26-template email library built on 44 shared components, a pre-launch QA harness that checks rendering, accessibility, personalization and unsubscribe links, and one-click unsubscribe headers (RFC 8058) on every send. When patient emails started landing in spam, I traced it to a missing DKIM record.

More in the [AlignSD case study](/projects/align-san-diego-family-chiropractic) and [how the content side runs](/blog/building-production-sanity-cms-ai-content-ops).

### MCRDSE: a direct-to-consumer brand

MCRDSE sells functional mushroom products across three storefronts. GoHighLevel is the journey engine. Underneath it, Cloudflare Workers and a D1 database are the system of record for orders, customers and loyalty.

I wanted lifecycle stages computed from real order data, not from whatever the CRM happened to know. So I wrote a nightly segment engine that re-scores every buyer:

```typescript title="segment-engine.ts"
export function classifyLifecycle(rdays: number, orders: number, vip: boolean): string {
    if (rdays <= 90 && orders === 1) return "lifecycle-new";
    if (vip && rdays <= 180) return "lifecycle-vip"; // 3+ orders or $300+ lifetime
    if (orders >= 2 && rdays <= 90) return "lifecycle-active";
    if (rdays <= 180) return "lifecycle-at-risk";
    if (rdays <= 365) return "lifecycle-lapsed";
    return "lifecycle-dormant";
}
```

@embed https://arndvs.github.io/ai-visuals/visuals/overnight-resort/ | Overnight re-sort animation | 4 / 5 | Every night, customers re-sort into lifecycle stages. Only the ones that moved get synced.

The important part is what it _doesn't_ do. It diffs tonight's answer against last night's and only touches contacts that changed. It saves its state only after every CRM write succeeds, so a failed write gets retried tomorrow instead of silently skipped. The tags it writes are what trigger the win-back, post-purchase and VIP journeys in GoHighLevel.

The rest of the stack follows the same habit: decide what "safe" means before you send.

- **An A/B harness that won't call it early.** Customers are hashed into a variant, so the same person always lands in the same arm. The report refuses to name a winner before 14 full days, and blocks one outright if complaints pass 0.1% or unsubscribes pass 2%.
- **Abort thresholds on every send wave.** Hard bounces at 2% or spam complaints at 0.3% stop the wave before the next batch goes out.
- **A day-4 and day-10 drip with idempotent send guards.** A retry can never send the same email twice.
- **An append-only loyalty ledger with VIP tiers and referral credit.** It's the 2014 chapter in code: the reward is earned after a purchase, tracked per transaction, and tiered so it's big enough to notice.

During pre-launch QA I also caught a bug in shared template code that broke the physical mailing address in the email footer. CAN-SPAM requires it. Nobody would have noticed until a complaint did.

More in the case studies for [MCRDSE commerce](/projects/mcrdse-commerce) and [MCRDSE content](/projects/mcrdse-content).

## Putting agents inside the machine

The insurance flow was already agent-shaped: a model reads something messy, returns structured output, and deterministic code decides where it goes. That's the pattern I keep reaching for. Let the model handle the reading. Keep the routing boring.

I run my own distribution the same way. A weekly digest of what I shipped becomes a LinkedIn draft, written against a style guide built from my own writing and then cut by an editor pass. A comment-scout agent finds the conversations worth joining. The three animations in this post came out of a skills-driven pipeline in my [ai-visuals](https://github.com/arndvs/ai-visuals) repo.

Underneath all of it is [ctrl+shft](/projects/ctrlshft), the dotfiles and hooks that give my agents the same rules on every machine, block dangerous commands before they run, and keep credentials out of their reach.

The human doesn't leave. The job moves. At MCRDSE, content approvals are locked with a SHA-256 hash: change the content after approval and the lock breaks. At AlignSD, anything the model isn't sure about goes to a person at the front desk. Agents can draft, score, route and send. A person still decides what's true and what's allowed. I wrote more about that shift in [The Human Doesn't Leave](/blog/readable-vs-explainable) and [The Real Product of Programming Isn't the Code](/blog/programming-as-theory-building).

## Ten checks before a lifecycle message ships

Fifteen years of this boils down to a list. I run it on every send, mine or a client's.

1. **Read 20 raw rows from the segment.** Counts lie. Rows don't.
2. **Treat unknown as unknown, not zero.** A dashboard showing zero bookings might mean zero bookings, or a sync that never ran.
3. **Check consent at send time, not when the segment was built.** People opt out between Tuesday and Thursday.
4. **Make every send idempotent.** Claim the send, then send. A retry should never mean a second email.
5. **Respect quiet hours in the recipient's time zone,** not yours.
6. **Cap frequency across journeys, not just inside one.** Three well-built journeys can still add up to spam.
7. **Render it where it lands.** Real inboxes, real phones, plain text, dark mode. One curly quote can switch a text from GSM-7 to Unicode and cut a segment from 160 characters to 70.
8. **Set abort thresholds before you send.** Mine are a 2% hard bounce rate and a 0.3% complaint rate.
9. **Don't call an experiment early.** Fourteen days minimum, with guardrails on complaints and unsubscribes.
10. **Click every link in the final rendered message,** including the unsubscribe. Then check the footer address.

## What I'd do differently

I'd measure the return visit, not the send.

At RipeMetrics we could tell you exactly who was at risk and exactly what went out to them. We were much weaker at proving how many of them came back because of it. Most of what I can show from those years is what we built, not the lift it produced. Every system I build now starts from the outcome metric and works backward to the message.

In 2009 I didn't know what to tell my friend about her gift cards. Now I'd tell her the cards were never the point. The return visit was.

Right now I'm putting agents into the parts of that machine that still run on someone's memory: the follow-up nobody sent, the lapsed list nobody pulled, the form nobody checked over the weekend. If you're building the thing that brings customers back, I'd like to hear about it. [Here's how I work](/work-with-me).
