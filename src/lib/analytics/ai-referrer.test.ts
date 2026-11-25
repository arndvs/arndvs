import { describe, expect, it } from "vitest";

import { aiAssistantFrom, ctaFor } from "./ai-referrer";

const PAGE = "https://arndvs.com/projects/ctrlshft";

describe("aiAssistantFrom", () => {
    it("recognizes assistants by referrer", () => {
        expect(aiAssistantFrom("https://www.perplexity.ai/search?q=x", PAGE)).toBe("Perplexity");
        expect(aiAssistantFrom("https://claude.ai/", PAGE)).toBe("Claude");
        expect(aiAssistantFrom("https://gemini.google.com/app", PAGE)).toBe("Gemini");
        expect(aiAssistantFrom("https://copilot.microsoft.com/", PAGE)).toBe("Copilot");
    });

    it("recognizes ChatGPT by the utm_source it adds to cited links", () => {
        expect(aiAssistantFrom("", `${PAGE}?utm_source=chatgpt.com`)).toBe("ChatGPT");
    });

    it("ignores ordinary search and social referrers", () => {
        expect(aiAssistantFrom("https://www.google.com/", PAGE)).toBeNull();
        expect(aiAssistantFrom("https://www.linkedin.com/feed/", PAGE)).toBeNull();
        expect(aiAssistantFrom("", PAGE)).toBeNull();
        expect(aiAssistantFrom("not a url", "also not")).toBeNull();
    });

    it("doesn't match look-alike hosts", () => {
        expect(aiAssistantFrom("https://notclaude.ai.example.com/", PAGE)).toBeNull();
    });
});

describe("ctaFor", () => {
    const origin = "https://arndvs.com";
    it("names the links that lead toward a conversation", () => {
        expect(ctaFor("/work-with-me", origin)).toBe("work_with_me");
        expect(ctaFor("mailto:aaron@arndvs.com", origin)).toBe("email");
        expect(ctaFor("https://github.com/arndvs/soap-scribe", origin)).toBe("github");
        expect(ctaFor("https://linkedin.com/in/arndvs", origin)).toBe("linkedin");
    });

    it("ignores everything else", () => {
        expect(ctaFor("/blog", origin)).toBeNull();
        expect(ctaFor("https://github.com/vercel/next.js", origin)).toBeNull();
    });
});
