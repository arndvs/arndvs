import OpenAI from "openai";

import type { JobCandidate, RoleFitProfile } from "./job-types";

/**
 * Drafts an application cover note for a scored job.
 *
 * Tuned to Aaron's positioning: applied AI / forward-deployed full-stack
 * builder, proof-nouns (RipeMetrics 30min→60s onboarding, HITL pipelines,
 * ctrl+shft agent infra), location + availability. Human reviews every
 * draft in the ops console — this never sends.
 */

const JOB_DRAFTER_SYSTEM_PROMPT = `You are Aaron Davis, a full-stack engineer + applied AI builder with 15+ years (8 as founder/President of Product & Engineering at RipeMetrics) and a catalog of shipped AI systems: RAG across chat/SMS/email/voice with provider fallback, an onboarding pipeline that cut client setup from ~30 min to under 60 seconds, human-in-the-loop content pipelines, and open-source agent infrastructure (ctrl+shft) that runs coding agents as CI jobs.

Write a short LinkedIn application message (not an essay) for the posted role. Rules:
- 2-4 sentences, ~120-200 words max. Direct, specific, no filler.
- Lead with the single strongest proof-noun that matches the role's ask.
- Name the stack/tool once, don't explain it.
- One line about being based in San Diego and open to the location/work-model stated.
- No emojis, no hashtags, no em dashes, no "I am excited".
- Never overclaim seniority or FDE if the title doesn't say it.
- Close with a light availability line ("Happy to walk through examples live.").

Respond with valid JSON: {"body": "the message text"}`;

export async function draftJobApplication(
    job: JobCandidate,
    profile: RoleFitProfile,
    options: { apiKey?: string; model?: string } = {},
): Promise<{ body: string }> {
    const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Missing environment variable: OPENAI_API_KEY");

    const model = options.model ?? process.env.JOB_DRAFT_MODEL ?? "gpt-4o-mini";
    const openai = new OpenAI({ apiKey });

    const userPrompt = `Role:
"""
Title: ${job.title}
Company: ${job.company ?? "?"}
Location: ${job.location ?? "?"} (${job.workType ?? "?"})
Salary: ${job.salary ?? "not listed"}
"""
Titles you're a fit for: ${profile.titles.join(", ")}.
Draft the application message now. Only the JSON body.`;

    const response = await openai.chat.completions.create({
        model,
        messages: [
            { role: "system", content: JOB_DRAFTER_SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 300,
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) throw new Error("OpenAI returned an empty response");

    try {
        const parsed = JSON.parse(raw) as { body?: string };
        if (!parsed.body?.trim()) throw new Error("Message body was empty");
        return { body: parsed.body.trim() };
    } catch (err) {
        throw new Error(
            `Failed to parse draft response: ${err instanceof Error ? err.message : String(err)}`,
        );
    }
}
