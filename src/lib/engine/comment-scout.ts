import type {
    ConversationCandidate,
    ScoredConversation,
    ScoringConfig,
} from "./comment-scout-types";
import type { LinkedInClient } from "./linkedin-client";
import { scoreConversations } from "./scoring";

/**
 * The comment scout — System B orchestration.
 *
 * discover → score → (human reviews the queue) → human posts.
 * Research-only in v1: this module never sends anything.
 */

export interface ScoutTarget {
    /** Authority-pillar keyword to search for. */
    keyword: string;
    /** Optional company-scoped search. */
    company?: string;
    /** Optional person usernames to watch directly. */
    usernames?: string[];
}

export interface ScoutConfig {
    scoring: ScoringConfig;
    targets: ScoutTarget[];
    /** Recency window for discovery (default past-24h — "be early"). */
    datePosted?: "past-24h" | "past-week" | "past-month";
}

export interface ScoutResult {
    candidates: ConversationCandidate[];
    scored: ScoredConversation[];
    /** Drafted comments keyed by candidate url. */
    drafts: Record<string, string>;
}

export async function runScout(
    client: LinkedInClient,
    config: ScoutConfig,
    draft: (candidate: ConversationCandidate) => Promise<{ body: string }>,
): Promise<ScoutResult> {
    const candidates: ConversationCandidate[] = [];
    const seen = new Set<string>();

    for (const target of config.targets) {
        // 1. Keyword search across posts.
        const keywordResults = await client.searchPosts({
            keywords: target.keyword,
            datePosted: config.datePosted ?? "past-24h",
        });
        for (const c of keywordResults) {
            if (!seen.has(c.url)) {
                seen.add(c.url);
                candidates.push(c);
            }
        }

        // 2. Direct person watch.
        for (const username of target.usernames ?? []) {
            const personPosts = await client.getPersonPosts(username);
            for (const c of personPosts) {
                if (!seen.has(c.url)) {
                    seen.add(c.url);
                    candidates.push(c);
                }
            }
        }
    }

    // 3. Score everything.
    const scored = scoreConversations(candidates, config.scoring);

    // 4. Draft comments only for review-qualifying conversations.
    const drafts: Record<string, string> = {};
    for (const s of scored) {
        if (s.decision === "review" || s.decision === "needs-verification") {
            const { body } = await draft(s.candidate);
            drafts[s.candidate.url] = body;
        }
    }

    return { candidates, scored, drafts };
}
