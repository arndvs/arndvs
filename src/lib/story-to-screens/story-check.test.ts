import { describe, expect, it } from "vitest";

import { derive } from "./engine";
import type { Product } from "./engine";
import { PRESETS } from "./presets";

const product = (text: string, roleName = "Owner"): Product => ({
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
        merges: {},
        guess: [],
        guessLinks: {},
        manualScreens: [],
        dismissed: [],
        rulesOff: [],
    },
});

const storyCheck = (text: string, roleName?: string) =>
    derive(product(text, roleName)).findings.filter((finding) => finding.ruleId === "story-check");

const ids = (text: string, roleName?: string) =>
    storyCheck(text, roleName).map((finding) => finding.id);

/** A story that passes every check: a person, two sentences, enough words, and a pain. */
const GOOD =
    "Priya runs a small bakery and takes every order by hand. She loses track of the custom cakes when the orders arrive late.";

describe("story check", () => {
    it("says nothing about a story that passes every check", () => {
        expect(storyCheck(GOOD)).toEqual([]);
    });

    it("runs first and adds no screens", () => {
        const derived = derive(product(GOOD));
        const step = derived.steps.find((candidate) => candidate.ruleId === "story-check");

        expect(derived.steps[0]?.ruleId).toBe("story-check");
        expect(step?.added).toEqual([]);
        expect(step?.total).toBe(0);
    });

    it("points at the sentence that describes the solution", () => {
        const findings = storyCheck(
            "Priya runs a small bakery and takes every order by hand. She opens the dashboard to check the orders.",
        );
        const solution = findings.find((finding) => finding.id.startsWith("story-check:solution:"));

        expect(solution?.message).toBe(
            "“She opens the dashboard to check the orders.” This might describe the solution. Stories say what people do today.",
        );
        expect(solution?.sources).toEqual([{ kind: "story", id: "st1" }]);
    });

    it.each(["the app", "the platform", "the dashboard", "button", "click", "screen"])(
        "catches the solution word %s",
        (word) => {
            expect(
                ids(
                    `Priya runs a small bakery and takes every order by hand. She uses ${word} to check the orders.`,
                ).some((id) => id.startsWith("story-check:solution:")),
            ).toBe(true);
        },
    );

    it("does not match a solution word inside a longer word", () => {
        expect(
            ids(
                "Priya runs a small bakery and takes every order by hand. She clicks the order and taps the screen.",
            ).filter((id) => id.startsWith("story-check:solution:")),
        ).toHaveLength(1);
    });

    it("reports a story with no person", () => {
        expect(
            ids(
                "Orders arrive every morning and get written into a book. The book is checked at the end of the day.",
                "Baker",
            ),
        ).toContain("story-check:person:st1");
    });

    it("accepts a role noun as the person", () => {
        expect(
            ids(
                "The baker takes every order by hand. The baker loses track when the orders arrive late.",
                "Baker",
            ),
        ).not.toContain("story-check:person:st1");
    });

    it("reports a story that is one sentence", () => {
        expect(
            ids(
                "Priya runs a small bakery and takes every order by hand and loses track when the orders arrive late.",
            ),
        ).toContain("story-check:thin:st1");
    });

    it("reports a story under 20 words", () => {
        expect(ids("Priya takes orders by hand. She loses track.")).toContain(
            "story-check:thin:st1",
        );
    });

    it("says nothing about a story at 20 words in two sentences", () => {
        const text =
            "Priya takes every order by hand and writes it in a book. She loses track when the orders arrive late.";

        expect(ids(text)).not.toContain("story-check:thin:st1");
    });

    it("reports a story with no friction", () => {
        expect(
            ids(
                "Priya runs a small bakery and takes every order. She writes each order in a book and gives the book to the kitchen.",
            ),
        ).toContain("story-check:friction:st1");
    });

    it.each(["slow", "late", "lost", "forget", "can't", "hard", "wait", "guilty", "busy", "again"])(
        "accepts the friction word %s",
        (word) => {
            expect(
                ids(
                    `Priya runs a small bakery and takes every order by hand. Every order is ${word} and she writes it in a book.`,
                ),
            ).not.toContain("story-check:friction:st1");
        },
    );

    it("accepts a plural friction word", () => {
        expect(
            ids(
                "Priya runs a small bakery and takes every order by hand. She waits for the kitchen to confirm each order.",
            ),
        ).not.toContain("story-check:friction:st1");
    });

    it("accepts manual work as friction", () => {
        expect(
            ids(
                "Priya runs a small bakery and takes every order by hand. She writes each order on paper for the kitchen.",
            ),
        ).not.toContain("story-check:friction:st1");
    });

    it("says nothing about an empty story", () => {
        expect(storyCheck("")).toEqual([]);
    });

    it("reports every problem in one story", () => {
        expect(ids("The dashboard shows orders.", "Baker")).toEqual([
            "story-check:solution:st1:0",
            "story-check:person:st1",
            "story-check:thin:st1",
            "story-check:friction:st1",
        ]);
    });

    it.each(PRESETS.map((preset) => preset.id))("says nothing about the %s preset", (id) => {
        const preset = PRESETS.find((candidate) => candidate.id === id);
        const findings = derive(structuredClone(preset) as Product).findings.filter(
            (finding) => finding.ruleId === "story-check",
        );

        expect(findings).toEqual([]);
    });
});
