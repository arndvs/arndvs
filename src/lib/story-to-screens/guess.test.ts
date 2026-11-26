import { describe, expect, it } from "vitest";

import { derive, inProduct } from "./engine";
import { matchGuess } from "./guess";
import { fromPreset } from "./presets";

const screens = () => derive(fromPreset("tester")).screens;

describe("matchGuess", () => {
    it("routes each screen-label guess to the screen it names", () => {
        const cases: Array<[string, string]> = [
            ["applicants", "list-applicant"],
            ["Edit study", "edit-study"],
            ["New study", "new-study"],
            ["Create study", "new-study"],
            ["Study detail", "view-study"],
            ["Applicant", "view-applicant"],
            ["Applicants page", "list-applicant"],
        ];

        for (const [guess, screen] of cases) {
            expect(matchGuess([guess], screens()).matched, guess).toEqual([[guess, screen]]);
        }
    });

    it("puts a guess nothing answers in onlyYours and counts a linked one as matched", () => {
        const unmatched = matchGuess(["Dashboard"], screens());

        expect(unmatched.onlyYours).toEqual(["Dashboard"]);
        expect(unmatched.matched).toEqual([]);

        const linked = matchGuess(["Dashboard"], screens(), { Dashboard: "view-study" });
        expect(linked.matched).toEqual([["Dashboard", "view-study"]]);
        expect(linked.onlyYours).toEqual([]);
    });

    it("ignores a link to a screen that is not in the product", () => {
        const { onlyYours } = matchGuess(["Dashboard"], screens(), {
            Dashboard: "no-such-screen",
        });

        expect(onlyYours).toEqual(["Dashboard"]);
    });

    it("lists every screen the visitor did not name, judged screens excluded", () => {
        const all = screens();
        const { missedByYou } = matchGuess(["Applicants"], all);

        // view-survey is folded into view-study in the tester preset, so it is not a screen to miss.
        expect(missedByYou).toHaveLength(all.filter(inProduct).length - 1);
        expect(missedByYou).not.toContain("list-applicant");
        expect(missedByYou).not.toContain("view-survey");
    });
});
