import { beforeEach, describe, expect, it, vi } from "vitest";

import { generateLinkedInDraft } from "./social-drafter";

// Capture the mock create fn via the constructor (hoisted-safe)
const { createMock } = vi.hoisted(() => ({ createMock: vi.fn() }));

vi.mock("openai", () => {
    // OpenAI must be a constructor (used with `new OpenAI()`).
    class OpenAI {
        chat = { completions: { create: createMock } };
    }
    return { default: OpenAI };
});

const digest = {
    weekLabel: "Week of Aug 10",
    summary: "Shipped the content engine.",
    highlights: ["Added the DAO-style social draft store"],
};

describe("generateLinkedInDraft", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.OPENAI_API_KEY = "sk-test";
    });

    it("returns the parsed draft body with the configured model", async () => {
        createMock.mockResolvedValue({
            choices: [
                { message: { content: JSON.stringify({ body: "We shipped something real." }) } },
            ],
        });

        const draft = await generateLinkedInDraft(digest);
        expect(draft.body).toBe("We shipped something real.");
        expect(createMock).toHaveBeenCalledWith(
            expect.objectContaining({
                model: "gpt-4o",
                response_format: { type: "json_object" },
                temperature: 0.7,
            }),
        );
    });

    it("throws on empty, unparseable, or missing provider content", async () => {
        createMock.mockResolvedValue({
            choices: [{ message: { content: JSON.stringify({ body: "   " }) } }],
        });
        await expect(generateLinkedInDraft(digest)).rejects.toThrow(/Draft body was empty/);

        createMock.mockResolvedValue({ choices: [{ message: { content: "not json" } }] });
        await expect(generateLinkedInDraft(digest)).rejects.toThrow(/Failed to parse/);

        createMock.mockResolvedValue({ choices: [{ message: { content: null } }] });
        await expect(generateLinkedInDraft(digest)).rejects.toThrow(/empty response/);
    });

    it("throws without an API key", async () => {
        delete process.env.OPENAI_API_KEY;
        await expect(generateLinkedInDraft(digest)).rejects.toThrow(/OPENAI_API_KEY/);
    });
});
