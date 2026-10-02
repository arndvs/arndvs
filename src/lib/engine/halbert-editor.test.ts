import { beforeEach, describe, expect, it, vi } from "vitest";

import { halbertEdit } from "./halbert-editor";

const { createMock } = vi.hoisted(() => ({ createMock: vi.fn() }));

vi.mock("openai", () => {
    // OpenAI must be a constructor (used with `new OpenAI()`).
    class OpenAI {
        chat = { completions: { create: createMock } };
    }
    return { default: OpenAI };
});

describe("halbertEdit", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.OPENAI_API_KEY = "sk-test";
    });

    it("returns the edited body and editor notes with the configured model", async () => {
        createMock.mockResolvedValue({
            choices: [
                {
                    message: {
                        content: JSON.stringify({
                            editedBody: "We shipped something real.",
                            editorNotes: "Stage 2: removed 3 filler words",
                        }),
                    },
                },
            ],
        });

        const result = await halbertEdit("We shipped something real.");
        expect(result.editedBody).toBe("We shipped something real.");
        expect(result.editorNotes).toContain("Stage 2");
        expect(createMock).toHaveBeenCalledWith(
            expect.objectContaining({
                model: "gpt-4o",
                response_format: { type: "json_object" },
                temperature: 0.4,
            }),
        );

        createMock.mockResolvedValue({
            choices: [{ message: { content: JSON.stringify({ editedBody: "" }) } }],
        });
        await expect(halbertEdit("draft")).rejects.toThrow(/Edited body was empty/);
    });

    it("throws on malformed provider content", async () => {
        createMock.mockResolvedValue({ choices: [{ message: { content: null } }] });
        await expect(halbertEdit("draft")).rejects.toThrow(/empty response/);
    });

    it("throws without an API key", async () => {
        delete process.env.OPENAI_API_KEY;
        await expect(halbertEdit("draft")).rejects.toThrow(/OPENAI_API_KEY/);
    });
});
