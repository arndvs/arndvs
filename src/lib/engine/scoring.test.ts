import { describe, expect, it } from "vitest";

import type { ConversationCandidate, ScoringConfig } from "./comment-scout-types";
import { scoreConversation, scoreConversations } from "./scoring";

const CONFIG: ScoringConfig = {
    pillars: ["forward deployed ai", "vector search", "ai architecture"],
};

function makeCandidate(overrides: Partial<ConversationCandidate> = {}): ConversationCandidate {
    return {
        url: "https://linkedin.com/posts/1",
        author: "Test Author",
        text: "Random engineering post",
        ageHours: 12,
        commentCount: 5,
        ...overrides,
    };
}

function strongFitCandidate(overrides: Partial<ConversationCandidate> = {}) {
    return makeCandidate({
        text: "We solved vector search with a forward deployed AI architecture",
        ...overrides,
    });
}

describe("scoreConversation — hard rejection of stale conversations", () => {
    it("rejects over the 48h max even with a perfect fit", () => {
        const delayed = scoreConversation(makeCandidate({ ageHours: 72 }), CONFIG);
        expect(delayed.decision).toBe("reject");
        expect(delayed.score).toBe(0);

        const strong = scoreConversation(strongFitCandidate({ ageHours: 60 }), CONFIG);
        expect(strong.decision).toBe("reject");
        expect(strong.score).toBe(0);
    });
});

describe("scoreConversation — fit and decision", () => {
    it("scores a review decision on a strong fresh fit, with the age bonus", () => {
        const fresh = scoreConversation(
            strongFitCandidate({ ageHours: 12, commentCount: 5 }),
            CONFIG,
        );
        const older = scoreConversation(
            strongFitCandidate({ ageHours: 45, commentCount: 5 }),
            CONFIG,
        );
        expect(fresh.decision).toBe("review");
        expect(fresh.score).toBeGreaterThanOrEqual(45);
        expect(fresh.score).toBeGreaterThan(older.score);
    });

    it("award less fit for a weak match", () => {
        const base = scoreConversation(makeCandidate({ text: "Unrelated" }), CONFIG);
        const matched = scoreConversation(
            makeCandidate({ text: "Forward deployed AI in production" }),
            CONFIG,
        );
        const weak = scoreConversation(
            makeCandidate({ text: "Random post", ageHours: 24 }),
            CONFIG,
        );
        expect(matched.score).toBeGreaterThan(base.score);
        expect(weak.decision).toBe("reject");
    });

    it("caps fit at 35", () => {
        const result = scoreConversation(
            makeCandidate({
                text: "forward deployed ai and vector search and ai architecture all in one building",
            }),
            CONFIG,
        );
        // fit capped at 35, plus recency 25 + openness 18 = 78 max
        expect(result.score).toBeLessThanOrEqual(78);
    });
});

describe("scoreConversation — recency", () => {
    it("prefers sub-24h posts over older ones", () => {
        const fresh = scoreConversation(makeCandidate({ ageHours: 12 }), CONFIG);
        const older = scoreConversation(makeCandidate({ ageHours: 45 }), CONFIG);
        expect(fresh.score).toBeGreaterThan(older.score);
    });

    it("flags review-qualifying candidates as needs-verification when age is unverified", () => {
        const unverified = scoreConversation(
            strongFitCandidate({ ageHours: undefined, commentCount: 5 }),
            CONFIG,
        );
        expect(unverified.decision).toBe("needs-verification");
    });

    it("respects a custom minimum review score", () => {
        const custom = { ...CONFIG, minimumReviewScore: 10 };
        const result = scoreConversation(
            makeCandidate({ text: "Random post", ageHours: 24 }),
            custom,
        );
        expect(result.decision).toBe("review");
    });
});

describe("scoreConversations", () => {
    it("scores a list into review and reject decisions", () => {
        const results = scoreConversations(
            [
                makeCandidate({ text: "forward deployed ai vector search", ageHours: 20 }),
                makeCandidate({ text: "irrelevant", ageHours: 100 }),
            ],
            CONFIG,
        );
        expect(results).toHaveLength(2);
        const decisions = results.map((r) => r.decision);
        expect(decisions).toContain("review");
        expect(decisions).toContain("reject");
    });
});
