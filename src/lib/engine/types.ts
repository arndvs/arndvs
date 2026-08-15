import {
    SOCIAL_DRAFT_STATUSES,
    type SocialDraftStatus,
    isValidSocialDraftTransition,
    socialDraftStatusSchema,
} from "@arndvs/contracts";
import { z } from "zod";

/**
 * Input for creating a new social draft.
 */
export const createSocialDraftInputSchema = z.object({
    platform: z.enum(["linkedin", "twitter"]),
    contentType: z.enum(["post", "thread", "tweet"]),
    body: z.string().min(1),
    sourceType: z.enum(["weeklyDigest", "comment"]),
    sourceDigestId: z.string().optional(),
    targetPerson: z.string().optional(),
    score: z.number().min(0).max(100).optional(),
});

export type CreateSocialDraftInput = z.infer<typeof createSocialDraftInputSchema>;

/**
 * A social draft as stored in Sanity.
 */
export interface SocialDraftRecord {
    _id: string;
    platform: "linkedin" | "twitter";
    contentType: "post" | "thread" | "tweet";
    body: string;
    editedBody?: string;
    editorNotes?: string;
    status: SocialDraftStatus;
    sourceType: "weeklyDigest" | "comment";
    sourceDigestId?: string;
    targetPerson?: string;
    score?: number;
    generatedAt?: string;
    postedAt?: string;
}

/**
 * The store interface for social drafts.
 *
 * DAO-style (lifted from Launch Core's DbAdapter): all data access goes
 * through typed methods, so the underlying store (Sanity) is swappable and
 * testable. The state machine enforces valid transitions.
 */
export interface SocialDraftStore {
    create(input: CreateSocialDraftInput): Promise<SocialDraftRecord>;
    getById(id: string): Promise<SocialDraftRecord | null>;
    listByStatus(status: SocialDraftStatus): Promise<SocialDraftRecord[]>;
    /** List drafts in actionable states (draft/editing/ready), sorted by score desc. */
    listActionable(): Promise<SocialDraftRecord[]>;
    transition(id: string, to: SocialDraftStatus): Promise<SocialDraftRecord>;
    updateBody(id: string, body: string): Promise<SocialDraftRecord>;
    markPosted(id: string): Promise<SocialDraftRecord>;
}

/**
 * Validates a status transition using the shared state machine.
 * Throws if the transition is invalid.
 */
export function assertValidTransition(from: SocialDraftStatus, to: SocialDraftStatus): void {
    if (!isValidSocialDraftTransition(from, to)) {
        throw new Error(
            `Invalid social draft transition: ${from} → ${to}. ` +
                `Allowed: ${SOCIAL_DRAFT_STATUSES.join(", ")}`,
        );
    }
}

export { socialDraftStatusSchema };
