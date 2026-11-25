import { describe, expect, it } from "vitest";

import { derive, inProduct, splitStory } from "./engine";
import type { Judgment, Product, RuleId } from "./engine";
import { PRESETS, fromPreset } from "./presets";

const blank = (text: string, roleName = "Owner"): Product => ({
    id: "yours",
    name: "Yours",
    origin: "blank",
    aliases: {},
    stories: [{ id: "st1", roleName, actor: "", text }],
    choices: {
        corrections: {},
        cardinality: {},
        releases: {},
        judgments: {},
        guess: [],
        guessLinks: {},
        manualScreens: [],
        dismissed: [],
        rulesOff: [],
    },
});

const BAKERY =
    "Priya runs a small bakery. Every morning she checks the orders from her website and prints each order. Customers browse the cakes, choose a size and pay online.";

/**
 * What each example produces today. Every later slice is expected to change this
 * on purpose, so a diff here is a prompt to check the change, not a failure.
 */
const GOLDEN: Record<string, { screens: string[]; findings: string[] }> = {
    tester: {
        screens: [
            "edit-profile",
            "edit-study",
            "landing",
            "list-answer",
            "list-applicant",
            "list-study",
            "login",
            "new-profile",
            "new-study",
            "profile-company",
            "profile-tester",
            "signup",
            "view-answer",
            "view-applicant",
            "view-card",
            "view-message",
            "view-profile",
            "view-requirement",
            "view-study",
            "view-survey",
            "view-test",
            "view-time",
        ],
        findings: [
            "crud:profile",
            "crud:study",
            "defaults",
            "walk:answer",
            "walk:applicant",
            "walk:study",
        ],
    },
    community: {
        screens: [
            "edit-call",
            "edit-post",
            "edit-question",
            "landing",
            "login",
            "new-call",
            "new-post",
            "new-question",
            "profile-member",
            "signup",
            "view-call",
            "view-group",
            "view-link",
            "view-post",
            "view-question",
        ],
        findings: ["crud:call", "crud:post", "crud:question", "defaults"],
    },
    clinic: {
        screens: [
            "edit-count",
            "edit-number",
            "landing",
            "list-visit",
            "login",
            "new-count",
            "new-number",
            "profile-front desk",
            "profile-manager",
            "profile-owner",
            "profile-therapist",
            "signup",
            "view-clinic",
            "view-count",
            "view-number",
            "view-spreadsheet",
            "view-staff",
            "view-visit",
        ],
        findings: ["card:therapist>clinic", "crud:count", "crud:number", "defaults", "walk:visit"],
    },
};

describe("derive", () => {
    it.each(PRESETS.map((preset) => preset.id))("matches the golden output (%s)", (id) => {
        const derived = derive(fromPreset(id));
        const golden = GOLDEN[id];

        expect(derived.screens.map((screen) => screen.id).sort()).toEqual(golden?.screens);
        expect(derived.findings.map((finding) => finding.id).sort()).toEqual(golden?.findings);
        expect(derived.findings.some((finding) => finding.ruleId === "story-check")).toBe(false);
    });

    it("derives a screen from a story that says 'constructor'", () => {
        const derived = derive(
            blank("Sam checks the constructor before every release.", "Developer"),
        );

        expect(derived.screens.map((screen) => screen.id)).toContain("view-constructor");
    });

    it("names a multi-word role in full and does not split it off as a second role", () => {
        const derived = derive({
            ...blank("Alex searches for walkers. The owner books a walk.", "Dog owner"),
            stories: [
                {
                    id: "st1",
                    roleName: "Dog owner",
                    actor: "Alex",
                    text: "Alex searches for walkers. The owner books a walk.",
                },
            ],
        });

        expect(derived.screens.map((screen) => screen.id)).toContain("profile-dog owner");
        expect(derived.findings.filter((finding) => finding.id.startsWith("split:"))).toEqual([]);
    });

    it("catches the missing applicants list in the tester example", () => {
        const derived = derive(fromPreset("tester"));

        expect(derived.findings.some((finding) => finding.id === "walk:applicant")).toBe(true);
        expect(
            derived.screens.some(
                (screen) => screen.id === "list-applicant" && screen.ruleId === "walk",
            ),
        ).toBe(true);
    });

    it("points 'contacts ten of them' at the applicants, not the answers", () => {
        const derived = derive(fromPreset("tester"));
        const byId = (id: string) => derived.relationships.find((rel) => rel.id === id);

        expect(byId("company>applicant")?.verbs).toContain("contact");
        expect(byId("company>answer")?.verbs).not.toContain("contact");
    });

    it("flags the clinic's one-or-many mistake, and setting it to many clears it", () => {
        const product = fromPreset("clinic");
        const flagged = (p: Product) =>
            derive(p).findings.some((finding) => finding.id === "card:therapist>clinic");

        expect(flagged(product)).toBe(true);
        product.choices.cardinality["therapist>clinic"] = "many";
        expect(flagged(product)).toBe(false);
    });

    it.each(PRESETS.map((preset) => preset.id))(
        "gives every create screen an edit screen (%s)",
        (id) => {
            const { screens } = derive(fromPreset(id));
            for (const screen of screens.filter((candidate) => candidate.type === "create")) {
                expect(screens.map((candidate) => candidate.id)).toContain(
                    screen.id.replace("new-", "edit-"),
                );
            }
        },
    );

    it.each(PRESETS.map((preset) => preset.id))("raises no false split finding (%s)", (id) => {
        const splits = derive(fromPreset(id)).findings.filter((finding) =>
            finding.id.startsWith("split:"),
        );

        expect(splits.map((finding) => finding.message)).toEqual([]);
    });

    it("credits a second role inside a story to that role and flags it", () => {
        const derived = derive(blank(BAKERY));
        const split = derived.findings.find((finding) => finding.id === "split:st1:customer");

        expect(split?.split?.subject).toBe("customer");
        expect(
            derived.relationships.some((rel) => rel.from === "customer" && rel.to === "cake"),
        ).toBe(true);
        expect(derived.relationships.some((rel) => rel.from === "owner" && rel.to === "cake")).toBe(
            false,
        );
    });

    it("raises no split finding for a story about one role", () => {
        const derived = derive(
            blank(
                "Sam runs a bike shop. He checks the repairs every morning, calls customers when a bike is ready and sends each invoice.",
            ),
        );

        expect(derived.findings.filter((finding) => finding.id.startsWith("split:"))).toEqual([]);
    });

    it("marks dismissed findings and keeps releases chosen for screens", () => {
        const product = fromPreset("tester");
        product.choices.dismissed.push("walk:applicant");
        product.choices.releases["list-applicant"] = "r3";
        const derived = derive(product);

        expect(derived.findings.find((finding) => finding.id === "walk:applicant")?.status).toBe(
            "dismissed",
        );
        expect(derived.screens.find((screen) => screen.id === "list-applicant")?.release).toBe(
            "r3",
        );
    });
});

describe("rule toggles", () => {
    const withRulesOff = (id: string, ...rulesOff: RuleId[]): Product => {
        const product = fromPreset(id);
        product.choices.rulesOff = rulesOff;

        return product;
    };

    it("leaves the golden output alone when every rule is on", () => {
        for (const preset of PRESETS) {
            const on = derive(fromPreset(preset.id));
            const explicit = derive(withRulesOff(preset.id));

            expect(explicit.screens.map((screen) => screen.id).sort()).toEqual(
                on.screens.map((screen) => screen.id).sort(),
            );
            expect(explicit.findings.map((finding) => finding.id).sort()).toEqual(
                on.findings.map((finding) => finding.id).sort(),
            );
        }
    });

    it("drops the list screens and their findings when walk is off", () => {
        const derived = derive(withRulesOff("tester", "walk"));

        expect(derived.screens.some((screen) => screen.id.startsWith("list-"))).toBe(false);
        expect(derived.findings.some((finding) => finding.ruleId === "walk")).toBe(false);
        expect(derived.steps.some((step) => step.ruleId === "walk")).toBe(false);
    });

    it("drops the edit screens and their findings when crud is off", () => {
        const derived = derive(withRulesOff("tester", "crud"));

        expect(derived.screens.some((screen) => screen.id.startsWith("edit-"))).toBe(false);
        expect(derived.findings.some((finding) => finding.ruleId === "crud")).toBe(false);
        // The create screens come from the stories, so they stay.
        expect(derived.screens.some((screen) => screen.id === "new-study")).toBe(true);
    });

    it("drops the default screens when defaults is off", () => {
        const derived = derive(withRulesOff("tester", "defaults"));

        expect(derived.screens.map((screen) => screen.id)).not.toContain("landing");
        expect(derived.screens.map((screen) => screen.id)).not.toContain("signup");
        expect(derived.findings.some((finding) => finding.id === "defaults")).toBe(false);
    });

    it("keeps the story screens when stories is listed as off", () => {
        const on = derive(fromPreset("tester"));
        const off = derive(withRulesOff("tester", "stories"));

        expect(off.screens.map((screen) => screen.id).sort()).toEqual(
            on.screens.map((screen) => screen.id).sort(),
        );
        expect(off.findings.map((finding) => finding.id).sort()).toEqual(
            on.findings.map((finding) => finding.id).sort(),
        );
    });

    it("keeps the cardinality finding when only the screen rules are off", () => {
        const derived = derive(withRulesOff("clinic", "walk", "crud", "defaults"));

        expect(derived.findings.some((finding) => finding.id === "card:therapist>clinic")).toBe(
            true,
        );
    });
});

describe("sources", () => {
    const storyText = (product: Product, storyId: string): string =>
        product.stories.find((story) => story.id === storyId)?.text ?? "";

    it.each(PRESETS.map((preset) => preset.id))(
        "gives every screen the rules added a sentence from its story (%s)",
        (id) => {
            const product = fromPreset(id);
            const { screens } = derive(product);
            const derived = screens.filter(
                (screen) => screen.ruleId !== "defaults" && screen.ruleId !== "manual",
            );

            expect(derived.length).toBeGreaterThan(0);
            for (const screen of derived) {
                expect(screen.sources.length).toBeGreaterThan(0);
                for (const source of screen.sources) {
                    expect(storyText(product, source.storyId)).toContain(source.sentence);
                }
            }
        },
    );

    it("leaves the standard screens without a source", () => {
        const { screens } = derive(fromPreset("tester"));

        for (const screen of screens.filter((candidate) => candidate.ruleId === "defaults")) {
            expect(screen.sources).toEqual([]);
        }
    });

    it("points a profile screen at the sentence its role opens with", () => {
        const product = fromPreset("tester");
        const profile = derive(product).screens.find((screen) => screen.id === "profile-tester");

        expect(profile?.sources).toHaveLength(1);
        expect(profile?.sources[0]?.sentence).toMatch(/^Suzan likes testing new products/);
    });
});

describe("trace finding", () => {
    const withManual = (id: string, name: string): Product => {
        const product = fromPreset(id);
        product.choices.manualScreens.push({ id: "manual-1", name });

        return product;
    };

    it("reports a manual screen no story mentions", () => {
        const derived = derive(withManual("tester", "Billing"));
        const trace = derived.findings.find((finding) => finding.id === "trace:manual-1");

        expect(trace?.ruleId).toBe("trace");
        expect(trace?.message).toBe(
            "No story mentions “Billing”. Keep it, but know it isn't backed by a story.",
        );
        expect(trace?.status).toBe("open");
    });

    it("keeps the manual screen it reports", () => {
        const derived = derive(withManual("tester", "Billing"));

        expect(derived.screens.some((screen) => screen.id === "manual-1")).toBe(true);
    });

    it("says nothing about a manual screen the stories already mention", () => {
        const derived = derive(withManual("tester", "Study archive"));

        expect(derived.findings.some((finding) => finding.ruleId === "trace")).toBe(false);
    });

    it("says nothing when there are no manual screens", () => {
        expect(derive(fromPreset("tester")).findings.some((f) => f.ruleId === "trace")).toBe(false);
    });
});

describe("judgments", () => {
    const judged = (id: string, screenId: string, judgment: Judgment): Product => {
        const product = fromPreset(id);
        product.choices.judgments[screenId] = judgment;

        return product;
    };

    it("keeps a judged screen in the list but out of the product", () => {
        const derived = derive(judged("tester", "view-survey", { kind: "misfire" }));
        const screen = derived.screens.find((candidate) => candidate.id === "view-survey");

        expect(screen).toBeDefined();
        expect(screen?.judgment).toEqual({ kind: "misfire" });
        expect(inProduct(screen!)).toBe(false);
    });

    it("leaves an unjudged screen in the product", () => {
        const derived = derive(fromPreset("tester"));
        const screen = derived.screens.find((candidate) => candidate.id === "view-study");

        expect(screen?.judgment).toBeUndefined();
        expect(inProduct(screen!)).toBe(true);
    });

    it("drops a judgment whose screen no longer exists", () => {
        const derived = derive(judged("tester", "no-such-screen", { kind: "misfire" }));

        expect(derived.screens.some((screen) => screen.id === "no-such-screen")).toBe(false);
        expect(derived.findings.some((finding) => finding.id.startsWith("judgment:"))).toBe(false);
    });

    it("reports a feature judgment whose parent screen is gone, and keeps the screen", () => {
        const derived = derive(
            judged("tester", "view-survey", { kind: "feature", of: "no-such-screen" }),
        );
        const screen = derived.screens.find((candidate) => candidate.id === "view-survey");
        const finding = derived.findings.find(
            (candidate) => candidate.id === "judgment:view-survey",
        );

        expect(screen?.judgment).toBeUndefined();
        expect(finding?.message).toBe(
            "“Survey detail” was folded into a screen that no longer exists. It's back in the product.",
        );
    });

    it("folds a feature judgment into its parent without removing the screen", () => {
        const derived = derive(
            judged("tester", "view-survey", { kind: "feature", of: "view-study" }),
        );

        expect(derived.screens.find((screen) => screen.id === "view-survey")?.judgment).toEqual({
            kind: "feature",
            of: "view-study",
        });
    });

    it("ships no preset with a hidden release", () => {
        for (const preset of PRESETS) {
            const derived = derive(fromPreset(preset.id));
            const hidden = derived.screens.filter((screen) => !inProduct(screen));

            expect(hidden.length).toBeGreaterThan(0);
            for (const screen of hidden) expect(screen.judgment).toBeDefined();
        }
    });
});

describe("splitStory", () => {
    it("moves the other role's sentence into a new story and clears the finding", () => {
        const product = blank(BAKERY);
        const finding = derive(product).findings.find(
            (candidate) => candidate.id === "split:st1:customer",
        );
        expect(finding).toBeDefined();

        const next = splitStory(product, finding!, "st2");

        expect(next.stories).toHaveLength(2);
        expect(next.stories[0]?.text).not.toContain("Customers");
        expect(next.stories[1]).toMatchObject({ id: "st2", roleName: "Customer" });
        expect(next.stories[1]?.text).toMatch(/^Customers browse the cakes/);
        expect(derive(next).findings.some((candidate) => candidate.id.startsWith("split:"))).toBe(
            false,
        );
        expect(product.stories).toHaveLength(1);
    });
});
