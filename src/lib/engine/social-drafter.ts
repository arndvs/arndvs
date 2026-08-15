import OpenAI from "openai";

import { SOCIAL_DRAFTER_SYSTEM_PROMPT, buildSocialDrafterUserPrompt } from "./prompts";

/**
 * Input digest for the LinkedIn drafter — the shape of a weekly digest
 * (or comment-sourced material) that gets turned into a post.
 */
export interface DigestInput {
    weekLabel: string;
    summary: string;
    highlights: string[];
}

export interface LinkedInDraft {
    body: string;
}

/**
 * Generates a LinkedIn post draft from a weekly digest using the
 * "Warm Builder" writeprint. Mirrors the existing OpenAI integration
 * pattern (`ai-content-enhancement.ts`, `generate-changelog-digest.ts`).
 */
export async function generateLinkedInDraft(
    digest: DigestInput,
    options: { apiKey?: string; model?: string } = {},
): Promise<LinkedInDraft> {
    const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Missing environment variable: OPENAI_API_KEY");

    const model = options.model ?? process.env.LINKEDIN_DRAFT_MODEL ?? "gpt-4o";
    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
        model,
        messages: [
            { role: "system", content: SOCIAL_DRAFTER_SYSTEM_PROMPT },
            { role: "user", content: buildSocialDrafterUserPrompt(digest) },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 700,
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) throw new Error("OpenAI returned an empty response");

    try {
        const parsed = JSON.parse(raw) as { body?: string };
        if (!parsed.body?.trim()) throw new Error("Draft body was empty");
        return { body: parsed.body.trim() };
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(`Failed to parse LinkedIn draft: ${msg}`);
    }
}
