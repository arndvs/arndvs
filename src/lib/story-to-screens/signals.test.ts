import { describe, expect, it } from "vitest";

import { derive } from "./engine";
import type { Product } from "./engine";
import { PRESETS } from "./presets";

const product = (texts: string[]): Product => ({
    id: "yours",
    name: "Yours",
    origin: "blank",
    aliases: {},
    stories: texts.map((text, index) => ({
        id: `st${index + 1}`,
        roleName: "Owner",
        actor: "",
        text,
    })),
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

const signal = (id: string, lemma: string) => {
    const preset = PRESETS.find((candidate) => candidate.id === id);
    const derived = derive(structuredClone(preset) as Product);

    return derived.signals.find((candidate) => candidate.lemma === lemma);
};

const signalFindings = (id: string) => {
    const preset = PRESETS.find((candidate) => candidate.id === id);

    return derive(structuredClone(preset) as Product).findings.filter(
        (finding) => finding.ruleId === "signals",
    );
};

describe("signals", () => {
    it("counts the stories a lemma appears in", () => {
        expect(signal("tester", "create")?.stories).toHaveLength(2);
        expect(signal("tester", "study")?.stories).toHaveLength(2);
    });

    it("counts a noun by the entity it resolves to", () => {
        // "requirement" and "requirements" are one signal, not two.
        expect(signal("tester", "requirement")?.stories).toHaveLength(2);
    });

    it("reaches three stories in the clinic preset", () => {
        expect(signal("clinic", "clinic")?.stories).toHaveLength(3);
        expect(signal("clinic", "number")?.stories).toHaveLength(3);
    });

    it("sorts by story count, highest first", () => {
        const preset = PRESETS.find((candidate) => candidate.id === "community");
        const counts = derive(structuredClone(preset) as Product).signals.map(
            (candidate) => candidate.stories.length,
        );

        expect(counts).toEqual([...counts].sort((a, b) => b - a));
    });

    it("reports an action in two stories as a core feature", () => {
        const finding = signalFindings("tester").find(
            (candidate) => candidate.id === "signals:create",
        );

        expect(finding?.message).toBe(
            "“create” appears in 2 stories, so it's likely a core feature.",
        );
        expect(finding?.sources).toHaveLength(2);
    });

    it("reports at most three signals", () => {
        expect(signalFindings("clinic").length).toBeLessThanOrEqual(3);
    });

    it("reports actions only, not things", () => {
        for (const id of PRESETS.map((preset) => preset.id)) {
            for (const finding of signalFindings(id)) {
                expect(finding.id).not.toBe("signals:clinic");
                expect(finding.id).not.toBe("signals:number");
            }
        }
    });

    it("says nothing when no action appears twice", () => {
        const derived = derive(
            product([
                "Sam runs the bakery and takes every order by hand.",
                "Dana drives the van and delivers every parcel by hand.",
            ]),
        );

        expect(derived.findings.filter((finding) => finding.ruleId === "signals")).toEqual([]);
    });

    it("adds no screens", () => {
        const preset = PRESETS.find((candidate) => candidate.id === "tester");
        const derived = derive(structuredClone(preset) as Product);

        expect(derived.steps.find((step) => step.ruleId === "signals")?.added).toEqual([]);
    });
});
