import type { PageData } from "@/lib/types/case-study";

import type { DiagramKey } from "./diagrams";

// DRAFT: see soap-scribe-portfolio.md for what's open before this page is listed.
const REPO = "https://github.com/arndvs/soap-scribe";

export const pageData: PageData<DiagramKey> = {
    hero: {
        badge: "Applied AI · Built for one practice · Synthetic data, not affiliated with Jane App",
        title: "SOAP Scribe",
        tagline:
            "My wife is a chiropractor, and her EMR's AI scribe doesn't fit how her visits work. So she charts after dinner. This drafts her SOAP notes from the visits she already records, carries forward what didn't change, and writes into her chart only when she clicks, and only into the right patient.",
        stats: [
            { label: "Unit + Integration Tests", value: "114" },
            { label: "End-to-End Tests", value: "8" },
            { label: "Invented Findings Allowed", value: "0" },
            { label: "Decisions Logged", value: "38" },
        ],
        cta: { text: "View the Repo", href: REPO },
        screenshotSrc: "/projects/soap-scribe/hero.jpg",
        screenshotAlt:
            "A draft note in the side panel beside a fake Jane chart for a synthetic patient, inserted and waiting to be signed",
    },

    situation: {
        narrative: [
            "After each visit she opens the patient's chart, duplicates the last note, scrolls back to remember what she found and what she already recommended, edits the findings, then copies her recommendations one at a time from a Google Doc and dates them by hand. Ten patients a day. Her own estimate is 5 to 15 extra minutes a visit.",
            "Most of a chiropractic note is never said out loud: the segments adjusted, the technique, the range of motion. So she already ends each visit with a short spoken recap on a Pocket recorder. That recording, her previous notes, and her own recommendation library are everything a draft needs.",
            'The user stories came first, in her words, and every "the system needs to…" line is traced to the code and a test. That audit found the most important gap before she ever saw it: showing what each patient was already given, and when.',
        ],
        context: {
            role: "Solo: user stories, architecture, backend, extension, tests",
            timeline: "November 2026",
            client: "One chiropractic practice (my wife's)",
            live: "github.com/arndvs/soap-scribe",
            stack: [
                "TypeScript",
                "Node + Express",
                "MongoDB",
                "React",
                "Chrome MV3",
                "Amazon Bedrock",
                "zod",
                "Vitest",
                "Playwright",
                "GitHub Actions",
            ],
        },
    },

    architecture: {
        intro: "Recordings flow through a background pipeline; she only touches a side panel next to her chart. The API and the worker talk only through MongoDB, so either can restart without losing work, and every vendor that sees patient data needs a BAA.",
        diagramKey: "system",
        subsystems: [
            {
                title: "Capture",
                description: "Pocket records and transcribes; a signed webhook starts a job",
            },
            {
                title: "Jobs",
                description: "One job per recording, a state machine, leases and retries",
            },
            {
                title: "Drafting",
                description: "Facts that cite the transcript, then a note with rules in code",
            },
            {
                title: "Side Panel",
                description: "Today's visits, the draft, her settings and library",
            },
            {
                title: "Safe Insert",
                description: "Right patient, all fields or none, read back, never signs",
            },
            {
                title: "Her Data",
                description: "Templates and library in her database; visit data deleted in days",
            },
        ],
    },

    deepDives: [
        {
            id: "draft",
            title: "The Draft",
            subtitle: "Carry Forward, Visibly",
            problem:
                "Copying the last note forward is most of what saves her time, and it's also how a stale finding ends up in today's note. A model writing freely would be worse: a spinal level nobody mentioned is worse than no note at all.",
            diagramKey: "draft",
            walkthrough: [
                "Drafting runs in two stages. In the background, the model pulls facts from the transcript, and each fact must cite the lines it came from. When she opens the chart, a second pass writes the note from those facts and the last three notes on the page, which are never stored.",
                "Every sentence is tagged: new today, carried from a dated note, or updated, with the old wording on hover. Her carry rules per section are enforced in code after the model replies, so a model mistake can't break them.",
                'Her recommendations come from her own library, word for word, matched without the model, and dated the way she dates them: "given" the first time, "since" when the patient had it before. Everything given on earlier visits sits above the Plan with a one-click re-add.',
                'Each new or changed sentence shows "What was said": the transcript lines behind it, linked by code. When unsure, it links nothing rather than the wrong line.',
                "A test set scores drafts deterministically. A run fails on any invented finding or a citation to the wrong line.",
            ],
            screenshotSrc: "/projects/soap-scribe/chart-draft.jpg",
            screenshotAlt:
                "The side panel's draft with tagged sentences, a transcript line and the Given before list",
            insight: {
                title: "Let the model write; let code decide",
                body: "The model writes sentences. Code decides what may be carried, what counts as her wording, and what a sentence can cite. Every one of those rules has a test that a model change can't argue with.",
            },
        },
        {
            id: "jobs",
            title: "The Jobs",
            subtitle: "Webhooks Arrive Twice, Workers Die",
            problem:
                "Pocket delivers webhooks at least once, a worker can crash halfway through, and a recording can arrive before she has synced the day's schedule. Every step has to be safe to run twice, and a missed recording has to turn up anyway.",
            diagramKey: "jobs",
            walkthrough: [
                "One job per recording, keyed by its ID, so a duplicate webhook does nothing. The signature is checked against the raw body, with a five-minute window against replays.",
                "Workers claim jobs with a ten-minute lease instead of a stuck-job sweep. Failures retry after 1, 5 and 15 minutes, then email an alert with the job ID only. An hourly catch-up lists recent recordings in case a webhook never came.",
                "Nothing is drafted until she confirms which patient a recording belongs to, so the wrong patient's history never reaches the prompt.",
                "A visit that wasn't recorded still shows in Today. She can draft it from previous notes only: every sentence is carried and the draft says so.",
            ],
            screenshotSrc: "/projects/soap-scribe/today.jpg",
            screenshotAlt:
                "The Today view: every appointment and its state, including one with no recording",
            insight: {
                title: "The tests found what users would have",
                body: "Demo mode runs the real API, worker and extension against a fake Pocket and a fake Jane. Its first end-to-end run found that re-syncing the schedule detached confirmed recordings; CI, on a UTC clock, found the schedule filed under the browser's date instead of the practice's. Both were fixed before anyone used it.",
            },
        },
        {
            id: "insert",
            title: "The Insert",
            subtitle: "The One Step That Writes to a Medical Record",
            problem:
                "Inserting a note into the wrong patient's chart is the worst bug this product can have, and Jane offers no API to write through, only its pages.",
            diagramKey: "insert",
            walkthrough: [
                "The extension checks the patient ID in the URL against the one on the page, and the server checks again. If anything differs, nothing is written and both patients are named.",
                "It fills all four sections or none, the way the page's own code expects, then reads all four back. It never clicks Save or Sign: she does that in Jane.",
                "Everything Jane-specific lives in one file. A console tool captures a de-identified copy of a real page to map it, and a test proves no patient text leaves the page.",
                "An end-to-end test changes the patient under the side panel mid-draft and checks that nothing is written.",
            ],
            screenshotSrc: "/projects/soap-scribe/jane-inserted.jpg",
            screenshotAlt:
                "A fake Jane chart for a synthetic patient with all four sections filled, waiting for her to save and sign",
            insight: {
                title: "Fail closed, and say why",
                body: "Every way the insert can refuse ends with her knowing what happened and what to do, usually Copy instead. A blocked insert costs her ten seconds; a wrong one costs a correction in a medical record.",
            },
        },
    ],

    decisions: [
        {
            decision: "Process recordings after the visit, not live",
            alternatives: "Capture audio live in the browser",
            reasoning:
                "She already records on Pocket and charts between visits. Live capture is the hardest part of an MV3 extension and isn't needed for her workflow. The repo has a design note for a live version.",
        },
        {
            decision: "Two stages: cited facts first, then the note",
            alternatives: "One prompt from transcript to note",
            reasoning:
                "The slow step runs before she opens the chart, and every fact can be traced to what was said. Two model calls per visit is the cost.",
        },
        {
            decision: "Her recommendations from her library, never from the model",
            alternatives: "Let the model write the Plan",
            reasoning:
                "Her wording is clinical instruction she has already chosen. Verbatim is safer, and easier to audit, than a paraphrase.",
        },
        {
            decision: "Show what was given before; don't carry it in automatically",
            alternatives: "Copy every earlier recommendation into today's Plan",
            reasoning:
                "Whether a recommendation continues is her call each visit. Showing it saves the search without making the call for her.",
        },
        {
            decision: "MongoDB behind repository interfaces with a shared contract test",
            alternatives: "Write MongoDB queries in the handlers",
            reasoning:
                "It matches the stack I was preparing for, and moving to Postgres becomes a new implementation that passes the same tests.",
        },
        {
            decision: "Public code; her templates and library in her database",
            alternatives: "A private repo with her settings in config files",
            reasoning:
                "The code can be shown. Her wording, recordings and configuration can't, and she edits them in the app.",
        },
    ],

    learnings: [
        {
            title: "User stories found the real gap",
            body: "Tracing every need in her stories to the code showed that what she most does by hand, dating and tracking recommendations, wasn't met. It was built before she saw a single draft.",
        },
        {
            title: "Open: not yet used on real patients",
            body: "Every vendor that sees patient data needs a BAA, patients have to consent to recording (California requires everyone recorded to agree), and the Jane page mapping needs a test patient. All of it is listed in the repo's gap register.",
        },
        {
            title: "Open: no time result yet",
            body: "The goal is minutes per note. A timing sheet is ready for a before-and-after day; until it's run, the page makes no claim about time saved.",
        },
    ],

    metrics: {
        hero: [
            { value: 114, label: "Unit + Integration Tests" },
            { value: 8, label: "End-to-End Tests" },
            { value: 7, label: "Draft Test Cases" },
            { value: 0, label: "Invented Findings Allowed" },
        ],
        supporting: [
            { value: 21, label: "Needs Traced to Code" },
            { value: 3, label: "Bugs Found by Tests First" },
            { value: 38, label: "Decisions Logged" },
            { value: 2, label: "Design Notes" },
        ],
    },

    gallery: [
        {
            src: "/projects/soap-scribe/hero.jpg",
            alt: "The side panel beside a fake Jane chart",
            caption: "The draft beside the chart, after Insert. Synthetic patient, fake Jane.",
        },
        {
            src: "/projects/soap-scribe/today.jpg",
            alt: "The Today view",
            caption: "Today: every visit and its state, including one that wasn't recorded",
        },
        {
            src: "/projects/soap-scribe/chart-draft.jpg",
            alt: "The draft with tagged sentences",
            caption:
                "The draft: carried, updated and new sentences, what was said, what was given before",
        },
    ],

    cta: {
        text: "The repo has the code, the user stories and their traceability, the decision log and the gap register. Demo mode runs the whole thing locally with synthetic patients. Not affiliated with Jane App or Pocket.",
        buttons: [
            { text: "View the Repo", href: REPO, variant: "default" },
            { text: "View More Projects", href: "/projects", variant: "outline" },
        ],
    },
};
