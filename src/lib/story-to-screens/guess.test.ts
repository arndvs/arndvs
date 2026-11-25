import { describe, expect, it } from "vitest";

import { derive, inProduct } from "./engine";
import { matchGuess } from "./guess";
import { fromPreset } from "./presets";

const screens = () => derive(fromPreset("tester")).screens;

describe("matchGuess", () => {
    it("matches a plural guess to the list screen", () => {
        const { matched } = matchGuess(["applicants"], screens());

        expect(matched).toEqual([["applicants", "list-applicant"]]);
    });

    it("matches an edit guess to the edit screen", () => {
        const { matched } = matchGuess(["Edit study"], screens());

        expect(matched).toEqual([["Edit study", "edit-study"]]);
    });

    it("matches a create guess to the create screen", () => {
        const { matched } = matchGuess(["New study"], screens());

        expect(matched).toEqual([["New study", "new-study"]]);
    });

    it("matches a create guess written as 'create'", () => {
        const { matched } = matchGuess(["Create study"], screens());

        expect(matched).toEqual([["Create study", "new-study"]]);
    });

    it("matches a guess that names a screen the rules built", () => {
        const { matched } = matchGuess(["Study detail"], screens());

        expect(matched).toEqual([["Study detail", "view-study"]]);
    });

    it("puts a guess nothing answers in onlyYours", () => {
        const { onlyYours, matched } = matchGuess(["Dashboard"], screens());

        expect(onlyYours).toEqual(["Dashboard"]);
        expect(matched).toEqual([]);
    });

    it("counts a linked guess as matched", () => {
        const { matched, onlyYours } = matchGuess(["Dashboard"], screens(), {
            Dashboard: "view-study",
        });

        expect(matched).toEqual([["Dashboard", "view-study"]]);
        expect(onlyYours).toEqual([]);
    });

    it("ignores a link to a screen that is not in the product", () => {
        const { onlyYours } = matchGuess(["Dashboard"], screens(), {
            Dashboard: "no-such-screen",
        });

        expect(onlyYours).toEqual(["Dashboard"]);
    });

    it("lists every screen the visitor did not name", () => {
        const all = screens();
        const { missedByYou } = matchGuess(["Applicants"], all);

        expect(missedByYou).toHaveLength(all.filter(inProduct).length - 1);
        expect(missedByYou).not.toContain("list-applicant");
    });

    it("leaves judged screens out of the comparison", () => {
        const all = screens();
        const { missedByYou } = matchGuess(["Applicants"], all);

        // view-survey is folded in the tester preset, so it is not a screen to miss.
        expect(missedByYou).not.toContain("view-survey");
    });

    it("matches a guess with no type to the detail screen", () => {
        const { matched } = matchGuess(["Applicant"], screens());

        expect(matched).toEqual([["Applicant", "view-applicant"]]);
    });

    it("matches a guess that drops the word 'page'", () => {
        const { matched } = matchGuess(["Applicants page"], screens());

        expect(matched).toEqual([["Applicants page", "list-applicant"]]);
    });
});
