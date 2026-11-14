import type { PageData } from "@/lib/types/case-study";

import type { DiagramKey } from "./diagrams";

const REPO = "https://github.com/arndvs/inkind-first-reward-journey";

export const pageData: PageData<DiagramKey> = {
    hero: {
        badge: "Lifecycle Marketing · Work Sample · Not affiliated with inKind",
        title: "First-Reward Journey",
        tagline:
            "A restaurant rewards app was holding $25 for me, and I still ended up on Google Maps. This is the message that should have reached me, built end to end: a Snowflake data contract, a Braze Canvas, Liquid that stops itself when the data is wrong, and a Rails outbox.",
        stats: [
            { label: "Liquid Tests", value: "184" },
            { label: "Rails Tests", value: "146" },
            { label: "SQL Checks Passing", value: "11/11" },
            { label: "Content Blocks", value: "17" },
            { label: "Walkthrough Videos", value: "3" },
        ],
        cta: { text: "Read the Walkthrough", href: "/blog/inkind-first-reward-journey" },
        screenshotSrc: "/projects/inkind-first-reward-journey/hero.jpg",
        screenshotAlt:
            "A phone showing a message sent Friday at 4:30 PM: Your $25 is waiting at Lantern Row, a fictional restaurant",
    },

    situation: {
        narrative: [
            "I signed up for inKind through a referral on October 8, with $25 toward my first $50+ meal. I browsed San Diego's neighborhoods that day, came back a few days later, and saved a restaurant or two. Then I forgot about it. Two weeks later, on a Saturday night, my wife and I spent a while on Google Maps deciding where to order from. inKind never came to mind.",
            "After the welcome email I got two more emails, both general brand messages. Neither mentioned my $25 or the restaurants I had saved, and I got no push notification with notifications turned on. Everything a useful message needed was already in my account: the restaurants I saved and the reward I hadn't used. This project is how I would get those signals onto the Braze profile and act on them.",
            "Every event, attribute, table, and threshold name is illustrative. I don't have access to inKind's data model, so this is a best guess built from the public Braze docs and my experience as one new user. The data is fictional, and nothing in the repo sends a real message.",
        ],
        context: {
            role: "Solo: journey design, data contract, Liquid, Rails, tests",
            timeline: "October – November 2026",
            client: "Self-directed work sample for a marketing automation role",
            live: "github.com/arndvs/inkind-first-reward-journey",
            stack: [
                "Braze Canvas",
                "Liquid",
                "Braze Catalogs",
                "Connected Content",
                "Snowflake",
                "Cloud Data Ingestion",
                "Ruby on Rails",
                "SQLite",
                "pytest",
                "GitHub Actions",
            ],
        },
    },

    architecture: {
        intro: "Two paths reach Braze. Events that start or end the journey go in real time through /users/track. Values computed in the warehouse go through Cloud Data Ingestion, which only reads rows with a newer UPDATED_AT. One system owns each profile field, so two writers never race.",
        diagramKey: "system",
        subsystems: [
            {
                title: "Data Contract",
                description: "Every profile field, its type, and which path it takes",
            },
            {
                title: "Journey",
                description: "Entry, filters, timing, exits, and a 10% control group",
            },
            {
                title: "Message",
                description: "17 Content Blocks shared by the push and the email",
            },
            {
                title: "Warehouse",
                description: "Sample data, the sync view, and 11 pass/fail checks",
            },
            {
                title: "Backend",
                description: "An outbox that records each event once, and the export",
            },
            {
                title: "Design Record",
                description: "A decision log and a gap register, kept as the work went",
            },
        ],
    },

    deepDives: [
        {
            id: "journey",
            title: "The Journey",
            subtitle: "One Save, Two Chances",
            problem:
                "A referred user who saves a restaurant has shown intent, has never paid, and still has a reward to use. The general brand emails treat that person the same as everyone else. The journey needs to reach them once at the moment dinner plans get made, follow up once, and stop the moment they buy.",
            diagramKey: "canvas",
            walkthrough: [
                "Users enter when they save a restaurant while their referral reward is unused and they have no first purchase. Ten percent are held out as a control group to measure lift, and a re-entering user stays in the same group.",
                "The first message waits until 4:30 PM in the user's local time. Push carries it when push is enabled, and email carries the same message when it isn't.",
                "Anyone who has not bought within three days gets one follow-up on the next Friday at 4:30 PM, on the other channel when that is allowed. Any purchase exits the journey, and a user is eligible again after 30 days.",
                "A second, smaller Canvas catches new users who keep opening the app without saving. It is separate because entry filters apply to every trigger in a Canvas, so a session filter on the save Canvas would also block savers.",
                "The timings and thresholds are starting points to test, not conclusions. The repo lists what I would confirm with the team first.",
            ],
            insight: {
                title: "Message people on what they did and didn't do",
                body: "It is the same idea as the recency and frequency segments I have built before. The save is what they did. The missing first purchase is what they didn't. The message is about the gap between the two.",
            },
        },
        {
            id: "message",
            title: "The Message",
            subtitle: "Liquid That Stops Itself",
            problem:
                "A message that promises $25 to someone whose reward is already used, or leaves out the minimum spend, sets up a disappointment at checkout. Audience filters catch most of this, but the profile can change between entry and send. The message has to check for itself.",
            diagramKey: "message",
            walkthrough: [
                "The message reads the reward attributes before anything else. If there is no unused reward, the amount is zero, or the minimum is missing, it calls abort_message with the reason and nothing is sent.",
                "The abort sits in the message, not in a Content Block, so anyone reading the message sees the stop.",
                "If the saved restaurant is found in the Catalog, the message features it. If not, it falls back to a generic hero and a Connected Content call for places nearby. That call is not retried, because with a retry Braze aborts the message after repeated failures instead of falling back.",
                "The push and the email use the same logic blocks, and a parity test checks that both make the same offer. The repo has 184 Liquid tests covering blocks, messages, parity, nesting, and golden cards.",
                "I loaded the blocks into a Braze trial by hand and previewed them against test users: the $25 user, a $12.50 user, and a zero-reward user that aborts with its reason. Preview only, nothing was sent.",
            ],
            embed: {
                src: "/visuals/inkind-message-logic/index.html?embed=1",
                title: "Animation: the message checks the reward and aborts when the amount is zero",
            },
            insight: {
                title: "The copy always states the minimum",
                body: "Copy that hides the minimum spend reads better and performs worse at checkout. A missing minimum aborts the send instead of sending a message that can't be honored.",
            },
        },
        {
            id: "backend",
            title: "The Backend",
            subtitle: "Where a Purchase Clears the Reward",
            problem:
                "The journey is only as good as the events behind it. If a purchase is recorded twice, or a retry rebuilds a payload that differs from the one already sent, the profile is wrong and so is every message that reads it.",
            diagramKey: "outbox",
            walkthrough: [
                "A payment and its reward redemption are written in one transaction. After commit, a job writes the Braze event to an outbox table with a unique idempotency key.",
                "Each delivery is built once and stored. A retry resends the stored payload, so a second attempt can't differ from the first or double-count.",
                "The client's default mode is record. Nothing in the repo calls Braze, because no live send has been approved.",
                "Every 10 minutes an export job MERGEs new and changed rows into Snowflake, and the sync view reads them. The export marks a row as exported only after a successful MERGE, so a failed export is retried and not skipped.",
                "The repo has 146 Rails tests, plus Brakeman and RuboCop, and 11 pass/fail SQL checks that run in a Snowflake worksheet.",
            ],
            insight: {
                title: "Agents draft, tests decide",
                body: "I built this in about a week with coding agents doing the drafting. Nothing merged on the model's say-so. At the end I ran a separate agent as an auditor with no context from the build, and checked each finding by hand against the code. Some of its findings were wrong.",
            },
        },
    ],

    decisions: [
        {
            decision: "One system owns each profile field",
            alternatives: "Let both the backend and the warehouse write a field",
            reasoning:
                "Two writers race, and the profile keeps whichever arrived last. Events that start or end the journey go through the real-time path; computed values go through the warehouse.",
        },
        {
            decision: "Saved restaurants are stored as keys, not names",
            alternatives: "Store the restaurant name on the profile",
            reasoning:
                "Keys stay stable when a name changes. The message reads the current name from the Catalog at send time.",
        },
        {
            decision: "Two Canvases: one on saves, one on browsing without saves",
            alternatives: "One Canvas with both triggers",
            reasoning:
                "Entry filters apply to every trigger in a Canvas, so a session filter on the save Canvas would also block savers.",
        },
        {
            decision: "A saved restaurant must be removable",
            alternatives: "Treat saves as append-only",
            reasoning:
                "Without removal, the saved list on the profile only grows, and a message can name a place the user no longer wants. A removal is recorded as its own event.",
        },
        {
            decision: "The nearby call is not retried",
            alternatives: "Retry the Connected Content call on failure",
            reasoning:
                "With a retry, Braze aborts the message after repeated failures. Without one, the message falls back to the generic copy and still goes out.",
        },
        {
            decision: "Record mode is the default",
            alternatives: "Send to a Braze workspace from the repo",
            reasoning: "No live send has been approved. The Braze trial covers rendering only.",
        },
    ],

    learnings: [
        {
            title: "What the Braze trial taught me",
            body: "The trial pushed back in useful places: importing array attributes by CSV, Connected Content being blocked, and a cap of 8 Content Blocks against the 17 in the repo. Each limit changed how I tested, and each is written down in the repo.",
        },
        {
            title: "Open: a payment can't be reversed yet",
            body: "A refund leaves the first-purchase date set, which keeps the user out of the audience. The decision is made (a reversal record, not a deleted row), but it is not built. It is logged as an open gap.",
        },
        {
            title: "Open: customer validation has not run",
            body: "The design is tested for correctness, not for whether people want the message. The repo has a validation plan and no session notes yet. I would run it before trusting any of the timings.",
        },
    ],

    metrics: {
        hero: [
            { value: 184, label: "Liquid Tests" },
            { value: 146, label: "Rails Tests" },
            { value: 11, label: "SQL Checks" },
            { value: 17, label: "Content Blocks" },
        ],
        supporting: [
            { value: 2, label: "Canvases" },
            { value: 2, label: "Channels" },
            { value: 10, label: "Control Group", suffix: "%" },
            { value: 3, label: "Walkthrough Videos" },
        ],
    },

    gallery: [
        {
            src: "/projects/inkind-first-reward-journey/hero.jpg",
            alt: "Concept mockup of the Friday 4:30 PM message for a fictional restaurant",
            caption: "The message — a concept mockup with a fictional restaurant",
        },
        {
            src: "/projects/inkind-first-reward-journey/journey.jpg",
            alt: "Diagram of the Canvas from entry to exit",
            caption: "The journey — one save, two chances, and an exit on any purchase",
        },
        {
            src: "/projects/inkind-first-reward-journey/two-paths.jpg",
            alt: "Diagram of the two data paths into Braze",
            caption: "Two paths — real-time events and warehouse-computed attributes",
        },
    ],

    cta: {
        text: "The blog post walks through the whole build, with three short videos of it running. The repo has the code, the decision log, and the gap register. Fictional data, not affiliated with inKind.",
        buttons: [
            {
                text: "Read the Walkthrough",
                href: "/blog/inkind-first-reward-journey",
                variant: "default",
            },
            { text: "View the Repo", href: REPO, variant: "outline" },
            { text: "View More Projects", href: "/projects", variant: "outline" },
        ],
    },
};
