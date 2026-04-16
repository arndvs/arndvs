import { describe, expect, it } from "vitest";

import { extractHeadingsFromPortableText, slugify } from "./extract-headings";

describe("slugify", () => {
    it("lowercases and replaces spaces with hyphens", () => {
        expect(slugify("Hello World")).toBe("hello-world");
    });

    it("strips special characters", () => {
        expect(slugify("What's New?")).toBe("whats-new");
    });

    it("collapses multiple hyphens", () => {
        expect(slugify("one - two -- three")).toBe("one-two-three");
    });

    it("returns empty string for empty input", () => {
        expect(slugify("")).toBe("");
    });

    it("handles unicode by stripping non-word chars", () => {
        expect(slugify("café résumé")).toBe("caf-rsum");
    });
});

describe("extractHeadingsFromPortableText", () => {
    it("extracts h2 and h3 headings", () => {
        const body = [
            { _type: "block", _key: "a", style: "h2", children: [{ _type: "span", text: "Introduction" }] },
            { _type: "block", _key: "b", style: "normal", children: [{ _type: "span", text: "Some text" }] },
            { _type: "block", _key: "c", style: "h3", children: [{ _type: "span", text: "Sub Topic" }] },
        ];

        const headings = extractHeadingsFromPortableText(body as any);

        expect(headings).toHaveLength(2);
        expect(headings[0]).toEqual({ id: "introduction", title: "Introduction", level: 2 });
        expect(headings[1]).toEqual({ id: "sub-topic", title: "Sub Topic", level: 3 });
    });

    it("returns empty array for no headings", () => {
        const body = [
            { _type: "block", _key: "a", style: "normal", children: [{ _type: "span", text: "Text" }] },
        ];

        expect(extractHeadingsFromPortableText(body as any)).toEqual([]);
    });

    it("returns empty array for empty body", () => {
        expect(extractHeadingsFromPortableText([])).toEqual([]);
    });

    it("deduplicates heading IDs", () => {
        const body = [
            { _type: "block", _key: "a", style: "h2", children: [{ _type: "span", text: "Setup" }] },
            { _type: "block", _key: "b", style: "h2", children: [{ _type: "span", text: "Setup" }] },
        ];

        const headings = extractHeadingsFromPortableText(body as any);

        expect(headings).toHaveLength(2);
        expect(headings[0]!.id).toBe("setup");
        expect(headings[1]!.id).not.toBe("setup");
    });
});
