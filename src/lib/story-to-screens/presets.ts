import type { Product } from "./engine";

/** A worked example. `hand` on each story is the answer key: the nouns and verbs a careful person marks. */
export type Preset = Product & { origin: "example"; question: string };

/**
 * The three worked examples, taken from the UX process handbook. The stories are
 * illustrative. Each ships with hand-confirmed marks, so visitors never see a wrong
 * suggestion on an example, and with the saved choices that set up its lesson.
 */
export const PRESETS: readonly Preset[] = [
    {
        id: "tester",
        name: "Tester marketplace",
        origin: "example",
        question: "Two sides, one study: what screens does a testing marketplace need?",
        stories: [
            {
                id: "company",
                roleName: "Company",
                actor: "Lena",
                text: "Lena is a UX manager at a company that needs testers for a new app prototype. She creates a profile for the company and posts a study with the requirements and a short survey. Three days later the study has 23 applicants. She reviews the applicants, compares their answers, and contacts ten of them with possible dates. After the tests she marks the study complete.",
                hand: {
                    nouns: [
                        "company",
                        "tester",
                        "prototype",
                        "profile",
                        "study",
                        "requirement",
                        "survey",
                        "applicant",
                        "answer",
                        "date",
                        "test",
                    ],
                    verbs: ["create", "post", "review", "compare", "contact", "mark"],
                },
            },
            {
                id: "tester",
                roleName: "Tester",
                actor: "Suzan",
                text: "Suzan likes testing new products for extra cash. She creates her own profile with her age, devices and interests. She browses the studies, reads the requirements, and applies to three of them by answering the survey. Later she gets a message from a company, picks a time, attends the test and receives a gift card.",
                hand: {
                    nouns: [
                        "product",
                        "profile",
                        "age",
                        "device",
                        "interest",
                        "study",
                        "requirement",
                        "survey",
                        "message",
                        "company",
                        "time",
                        "test",
                        "card",
                    ],
                    verbs: [
                        "create",
                        "browse",
                        "read",
                        "apply",
                        "answer",
                        "get",
                        "pick",
                        "attend",
                        "receive",
                    ],
                },
            },
        ],
        aliases: { lena: "company", suzan: "tester", testers: "tester" },
        choices: {
            corrections: {},
            cardinality: {},
            releases: {
                "view-answer": "r2",
                "list-answer": "r2",
                "view-message": "r2",
                "view-time": "r2",
                "view-test": "later",
                "view-card": "later",
            },
            // The rules invented these; the stories don't need them as screens.
            judgments: {
                "view-profile": { kind: "feature", of: "profile-company" },
                "new-profile": { kind: "feature", of: "profile-company" },
                "view-requirement": { kind: "feature", of: "view-study" },
                "view-survey": { kind: "feature", of: "view-study" },
            },
            guess: [],
            guessLinks: {},
            manualScreens: [],
            dismissed: [],
            rulesOff: [],
        },
    },
    {
        id: "community",
        name: "Community group",
        origin: "example",
        question: "Knowledge keeps getting lost in a group feed. What would fix it?",
        stories: [
            {
                id: "ian",
                roleName: "Member asking",
                actor: "Ian",
                text: "Ian is a developer in an alumni group who wants to learn about Facebook marketing. He searches the group for related posts, but the feed is too long to scan. He asks the group who can help, and several members reply with links and their own experience. He schedules a call with one of them.",
                hand: {
                    nouns: ["group", "post", "feed", "member", "link", "experience", "call"],
                    verbs: ["search", "ask", "reply", "schedule"],
                },
            },
            {
                id: "ed",
                roleName: "Member sharing",
                actor: "Ed",
                text: "Ed writes a blog post about working with developers and shares the link with the group so other members can learn from it.",
                hand: { nouns: ["post", "link", "group", "member"], verbs: ["write", "share"] },
            },
            {
                id: "geordie",
                roleName: "Member finding a skill",
                actor: "Geordie",
                text: "Geordie needs someone who is good at building a sales funnel. He posts a question to the group and waits for members with that skill to answer.",
                hand: {
                    nouns: ["funnel", "question", "group", "member", "skill"],
                    verbs: ["post", "answer"],
                },
            },
            {
                id: "john",
                roleName: "Member traveling",
                actor: "John",
                text: "John is visiting San Francisco and wants to find members who live there. He posts in the group asking who is nearby.",
                hand: { nouns: ["member", "group"], verbs: ["find", "post", "ask"] },
            },
        ],
        aliases: {
            ian: "member",
            ed: "member",
            geordie: "member",
            john: "member",
            someone: "member",
        },
        choices: {
            corrections: {},
            cardinality: {},
            releases: {
                "view-call": "later",
                "new-call": "later",
                "edit-call": "later",
                "view-question": "r2",
                "new-question": "r2",
                "edit-question": "r2",
            },
            // A group and a link are things the feed shows, not screens of their own.
            judgments: {
                "view-group": { kind: "feature", of: "view-post" },
                "view-link": { kind: "feature", of: "view-post" },
            },
            guess: [],
            guessLinks: {},
            manualScreens: [],
            dismissed: [],
            rulesOff: [],
        },
    },
    {
        id: "clinic",
        name: "Clinic analytics",
        origin: "example",
        question: "Four roles, one set of numbers. What does each person need to see?",
        stories: [
            {
                id: "owner",
                roleName: "Practice owner",
                actor: "Maria",
                text: "Maria owns four physical-therapy clinics. Every Monday she opens a spreadsheet from each clinic manager to see which locations are doing well and which need help. She compares visits, new patients and revenue across the clinics, but the numbers arrive late and in different formats.",
                hand: {
                    nouns: [
                        "clinic",
                        "spreadsheet",
                        "manager",
                        "location",
                        "visit",
                        "patient",
                        "revenue",
                        "number",
                        "format",
                    ],
                    verbs: ["own", "open", "compare"],
                },
            },
            {
                id: "manager",
                roleName: "Clinic manager",
                actor: "Tom",
                text: "Tom manages one clinic and is always busy. He checks how each therapist is doing, encourages them to improve, and reminds the staff to enter their numbers before the weekly report is due.",
                hand: {
                    nouns: ["clinic", "therapist", "staff", "number", "report"],
                    verbs: ["manage", "check", "encourage", "remind", "enter"],
                },
            },
            {
                id: "therapist",
                roleName: "Therapist",
                actor: "Kim",
                text: "Kim is a therapist who works at two of the clinics. Between patients she has almost no time at a computer, so she writes her visit counts on paper and gives them to the front desk at the end of the day.",
                hand: {
                    nouns: ["therapist", "clinic", "patient", "computer", "count", "paper", "desk"],
                    verbs: ["work", "write", "give"],
                },
            },
            {
                id: "front",
                roleName: "Front office",
                actor: "Jen",
                text: "Jen works the front desk. She types each therapist's numbers into the spreadsheet and sends it to the manager every Friday.",
                hand: {
                    nouns: ["desk", "therapist", "number", "spreadsheet", "manager"],
                    verbs: ["work", "type", "send"],
                },
            },
        ],
        aliases: {
            maria: "owner",
            tom: "manager",
            kim: "therapist",
            jen: "front desk",
            desk: "front desk",
        },
        choices: {
            corrections: {},
            // Ships with the real-world mistake: a therapist set to one clinic.
            cardinality: { "therapist>clinic": "one" },
            releases: {
                "view-staff": "later",
                "list-visit": "r2",
            },
            // The spreadsheet is what the product replaces, and the counts are a
            // field on the visit, not a screen of their own.
            judgments: {
                "view-spreadsheet": { kind: "misfire" },
                "view-count": { kind: "feature", of: "view-visit" },
                "new-count": { kind: "feature", of: "view-visit" },
                "edit-count": { kind: "feature", of: "view-visit" },
            },
            guess: [],
            guessLinks: {},
            manualScreens: [],
            dismissed: [],
            rulesOff: [],
        },
    },
];

export const DEFAULT_PRESET_ID = "tester";

export const findPreset = (id: string): Preset | undefined =>
    PRESETS.find((preset) => preset.id === id);

/** A fresh, editable copy of an example. */
export const fromPreset = (id: string): Product => {
    const preset = findPreset(id) ?? PRESETS[0];
    if (!preset) throw new Error("No presets are registered.");

    return structuredClone(preset) as Product;
};
