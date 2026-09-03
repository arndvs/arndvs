import { describe, expect, it } from "vitest";

import { extractHeadingsFromPortableText, slugify } from "./extract-headings";

describe("slugify", () => {
    it("lowercases, strips specials, and collapses hyphens", () => {
        expect(slugify("Hello World")).toBe("hello-world");
        expect(slugify("What's New?")).toBe("whats-new");
        expect(slugify("one - two -- three")).toBe("one-two-three");
        expect(slugify("café résumé")).toBe("caf-rsum");
        expect(slugify("")).toBe("");
    });
});

describe("extractHeadingsFromPortableText", () => {
    const block = (
        style: string,
        text: string,
        key = text,
    ): {
        _type: string;
        _key: string;
        style: string;
        children: Array<{ _type: string; text: string }>;
    } => ({
        _type: "block",
        _key: key,
        style,
        children: [{ _type: "span", text }],
    });

    it("extracts h2/h3 headings with slugified ids and levels", () => {
        const headings = extractHeadingsFromPortableText([
            block("h2", "Introduction"),
            block("normal", "Some text"),
            block("h3", "Sub Topic"),
        ] as never);

        expect(headings).toHaveLength(2);
        expect(headings[0]).toEqual({ id: "introduction", title: "Introduction", level: 2 });
        expect(headings[1]).toEqual({ id: "sub-topic", title: "Sub Topic", level: 3 });
    });

    it("returns empty for bodies without headings or with no body", () => {
        expect(extractHeadingsFromPortableText([block("normal", "Text")] as never)).toEqual([]);
        expect(extractHeadingsFromPortableText([])).toEqual([]);
    });

    it("deduplicates heading ids so anchors stay unique", () => {
        const headings = extractHeadingsFromPortableText([
            block("h2", "Setup"),
            block("h2", "Setup"),
        ] as never);

        expect(headings).toHaveLength(2);
        expect(headings[0]!.id).toBe("setup");
        expect(headings[1]!.id).not.toBe("setup");
    });
});
