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

describe("scoreConversation — hard rejections", () => {
    it("rejects a stale conversation (over max age)", () => {
        const result = scoreConversation(makeCandidate({ ageHours: 72 }), CONFIG);
        expect(result.decision).toBe("reject");
        expect(result.score).toBe(0);
        expect(result.reasons.join()).toMatch(/Stale/i);
    });

    it("rejects at default 48h max even with perfect fit", () => {
        const result = scoreConversation(
            makeCandidate({
                ageHours: 60,
                text: "forward deployed ai vector search in production",
            }),
            CONFIG,
        );
        expect(result.decision).toBe("reject");
        expect(result.score).toBe(0);
    });
});

describe("scoreConversation — fit", () => {
    it("scores 0 fit with no pillar match", () => {
        const result = scoreConversation(makeCandidate({ text: "How to brew coffee" }), CONFIG);
        expect(result.decision).not.toBe("needs-verification");
        expect(result.score).toBeLessThan(45);
    });

    it("gains fit points on a pillar match", () => {
        const base = scoreConversation(makeCandidate({ text: "Unrelated" }), CONFIG);
        const matched = scoreConversation(
            makeCandidate({ text: "Forward deployed AI in production" }),
            CONFIG,
        );
        expect(matched.score).toBeGreaterThan(base.score);
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
    it("prefers sub-24h posts (be early)", () => {
        const fresh = scoreConversation(makeCandidate({ ageHours: 12 }), CONFIG);
        const older = scoreConversation(makeCandidate({ ageHours: 45 }), CONFIG);
        expect(fresh.score).toBeGreaterThan(older.score);
    });

    it("gives no recency points when unverified", () => {
        const verified = scoreConversation(makeCandidate({ ageHours: 12 }), CONFIG);
        const unverified = scoreConversation(makeCandidate({ ageHours: undefined }), CONFIG);
        expect(unverified.score).toBeLessThan(verified.score);
    });
});

describe("scoreConversation — openness", () => {
    it("prefers low comment counts", () => {
        const open = scoreConversation(makeCandidate({ commentCount: 3 }), CONFIG);
        const crowded = scoreConversation(makeCandidate({ commentCount: 80 }), CONFIG);
        expect(open.score).toBeGreaterThan(crowded.score);
    });
});

describe("scoreConversation — decision", () => {
    it("reaches review on a strong fresh fit", () => {
        const result = scoreConversation(
            makeCandidate({
                text: "We solved vector search with a forward deployed AI architecture",
                ageHours: 12,
                commentCount: 5,
            }),
            CONFIG,
        );
        // fit 28 + recency 25 + openness 18 = 71 >= 45
        expect(result.decision).toBe("review");
        expect(result.score).toBeGreaterThanOrEqual(45);
    });

    it("flags needs-verification when review-qualifying but age unverified", () => {
        const result = scoreConversation(
            makeCandidate({
                text: "We solved vector search with a forward deployed AI architecture",
                ageHours: undefined,
                commentCount: 5,
            }),
            CONFIG,
        );
        expect(result.decision).toBe("needs-verification");
    });

    it("rejects a weak match below the minimum", () => {
        const result = scoreConversation(
            makeCandidate({ text: "Random post", ageHours: 24 }),
            CONFIG,
        );
        expect(result.decision).toBe("reject");
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
    it("scores a list", () => {
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
