import { describe, expect, it } from "vitest";

import { buildSocialDrafterUserPrompt } from "./prompts";

describe("buildSocialDrafterUserPrompt", () => {
    it("includes the week label, summary, and highlights", () => {
        const prompt = buildSocialDrafterUserPrompt({
            weekLabel: "Week of Aug 10",
            summary: "Shipped the content engine.",
            highlights: ["Added socialDraft store", "Wired workspace packages"],
        });
        expect(prompt).toContain("Week of Aug 10");
        expect(prompt).toContain("Shipped the content engine.");
        expect(prompt).toContain("- Added socialDraft store");
        expect(prompt).toContain("- Wired workspace packages");
    });

    it("handles empty highlights", () => {
        const prompt = buildSocialDrafterUserPrompt({
            weekLabel: "Week of Aug 3",
            summary: "Maintenance week.",
            highlights: [],
        });
        expect(prompt).toContain("Maintenance week.");
    });
});
