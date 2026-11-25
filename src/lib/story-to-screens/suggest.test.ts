import { describe, expect, it } from "vitest";

import { PRESETS } from "./presets";
import { singular, suggestMarks, verbBase } from "./suggest";

describe("singular and verbBase", () => {
    it("handles the regular and irregular forms in the examples", () => {
        expect(singular("applicants")).toBe("applicant");
        expect(singular("studies")).toBe("study");
        expect(verbBase("contacts")).toBe("contact");
        expect(verbBase("browses")).toBe("browse");
    });
});

describe("suggestMarks", () => {
    // The examples' hand-confirmed marks are the answer key. The suggester only has
    // to get people most of the way: they confirm or correct every word.
    it("finds at least 85% of the hand marks, with at least 70% of its suggestions right", () => {
        let handTotal = 0;
        let suggestedTotal = 0;
        let found = 0;

        for (const preset of PRESETS) {
            for (const story of preset.stories) {
                const marks = suggestMarks(story.text, story.actor).filter(
                    (mark) => mark.word !== story.actor,
                );
                const got = {
                    nouns: new Set(marks.filter((m) => m.kind === "noun").map((m) => m.lemma)),
                    verbs: new Set(marks.filter((m) => m.kind === "verb").map((m) => m.lemma)),
                };
                for (const kind of ["nouns", "verbs"] as const) {
                    const hand = new Set(story.hand?.[kind] ?? []);
                    handTotal += hand.size;
                    suggestedTotal += got[kind].size;
                    found += [...hand].filter((word) => got[kind].has(word)).length;
                }
            }
        }

        expect(found / handTotal).toBeGreaterThanOrEqual(0.85);
        expect(found / suggestedTotal).toBeGreaterThanOrEqual(0.7);
    });
});
