import OpenAI from "openai";

import type { ConversationCandidate } from "./comment-scout-types";

/**
 * Drafts a substantive LinkedIn comment for a scored conversation.
 *
 * Engineer-flavored: a technical observation, counter-take, or related
 * example from the author's own work. Never pitches. Voice-checked against
 * the Warm Builder writeprint. Research-only — the human posts.
 */

const COMMENT_DRAFTER_SYSTEM_PROMPT = `You are an AI engineer writing a LinkedIn comment on a technical post. You are NOT selling anything.

Rules:
- Add substance: a technical observation, a counter-take, or a related example from your own shipped work.
- Engineer-flavored, peer-to-peer. Name the tool/stack once, don't explain it.
- Never pitch, never mention you're job-hunting, never "Great post!".
- Short: 1-3 sentences, under ~200 characters. A comment, not an essay.
- No emojis, no hashtags, no em dashes.
- Concrete where possible — a number or a specific failure mode beats a generalization.

Respond with valid JSON: {"body": "the comment text"}`;

export async function draftComment(
    candidate: ConversationCandidate,
    options: { apiKey?: string; model?: string } = {},
): Promise<{ body: string }> {
    const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Missing environment variable: OPENAI_API_KEY");

    const model = options.model ?? process.env.COMMENT_DRAFT_MODEL ?? "gpt-4o-mini";
    const openai = new OpenAI({ apiKey });

    const userPrompt = `Post by ${candidate.author}${candidate.authorHeadline ? ` (${candidate.authorHeadline})` : ""}:
"""
${candidate.text.slice(0, 1500)}
"""

Draft the comment now. Only the JSON body.`;

    const response = await openai.chat.completions.create({
        model,
        messages: [
            { role: "system", content: COMMENT_DRAFTER_SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 250,
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) throw new Error("OpenAI returned an empty response");

    try {
        const parsed = JSON.parse(raw) as { body?: string };
        if (!parsed.body?.trim()) throw new Error("Comment body was empty");
        return { body: parsed.body.trim() };
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(`Failed to parse comment draft: ${msg}`);
    }
}
