import OpenAI from "openai";

import { HALBERT_EDITOR_SYSTEM_PROMPT } from "./prompts";

export interface EditorResult {
    editedBody: string;
    editorNotes: string;
}

/**
 * Applies the Halbert Editing Formula to a draft in a single AI pass.
 * Returns the edited text plus a changelog with per-stage attribution.
 */
export async function halbertEdit(
    draftBody: string,
    options: { apiKey?: string; model?: string } = {},
): Promise<EditorResult> {
    const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Missing environment variable: OPENAI_API_KEY");

    const model = options.model ?? process.env.LINKEDIN_EDITOR_MODEL ?? "gpt-4o";
    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
        model,
        messages: [
            { role: "system", content: HALBERT_EDITOR_SYSTEM_PROMPT },
            {
                role: "user",
                content: `Draft to edit:\n"""\n${draftBody}\n"""\n\nApply the Halbert formula. Return the JSON only.`,
            },
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
        max_tokens: 900,
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) throw new Error("OpenAI returned an empty response");

    try {
        const parsed = JSON.parse(raw) as { editedBody?: string; editorNotes?: string };
        if (!parsed.editedBody?.trim()) throw new Error("Edited body was empty");
        return {
            editedBody: parsed.editedBody.trim(),
            editorNotes: parsed.editorNotes?.trim() ?? "",
        };
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(`Failed to parse Halbert edit: ${msg}`);
    }
}
