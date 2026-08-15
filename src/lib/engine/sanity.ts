import { type SanityClient, createClient } from "@sanity/client";

import { apiVersion, dataset, projectId } from "@/sanity/env";

import {
    type CreateSocialDraftInput,
    type SocialDraftRecord,
    type SocialDraftStore,
    assertValidTransition,
} from "./types";

/**
 * Sanity-backed implementation of the SocialDraftStore.
 *
 * Uses a write client (server-only). The store interface keeps the engine
 * decoupled from Sanity — swap this for another backend without touching
 * engine logic.
 */

function getWriteClient(): SanityClient {
    const token = process.env.SANITY_API_TOKEN;
    if (!token) throw new Error("Missing environment variable: SANITY_API_TOKEN");
    return createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: false,
        token,
    });
}

function toRecord(doc: Record<string, unknown>): SocialDraftRecord {
    return {
        _id: String(doc._id),
        platform: doc.platform as SocialDraftRecord["platform"],
        contentType: doc.contentType as SocialDraftRecord["contentType"],
        body: String(doc.body ?? ""),
        editedBody: doc.editedBody as string | undefined,
        editorNotes: doc.editorNotes as string | undefined,
        status: doc.status as SocialDraftRecord["status"],
        sourceType: doc.sourceType as SocialDraftRecord["sourceType"],
        sourceDigestId: doc.sourceDigestId as string | undefined,
        targetPerson: doc.targetPerson as string | undefined,
        score: doc.score as number | undefined,
        generatedAt: doc.generatedAt as string | undefined,
        postedAt: doc.postedAt as string | undefined,
    };
}

export function createSanitySocialDraftStore(): SocialDraftStore {
    const client = getWriteClient();

    return {
        async create(input: CreateSocialDraftInput) {
            const doc = await client.create({
                _type: "socialDraft",
                platform: input.platform,
                contentType: input.contentType,
                body: input.body,
                status: "draft",
                sourceType: input.sourceType,
                sourceDigestId: input.sourceDigestId,
                targetPerson: input.targetPerson,
                score: input.score,
                generatedAt: new Date().toISOString(),
            });
            return toRecord(doc as unknown as Record<string, unknown>);
        },

        async getById(id: string) {
            const doc = await client.getDocument(id);
            if (!doc || doc._type !== "socialDraft") return null;
            return toRecord(doc as unknown as Record<string, unknown>);
        },

        async listByStatus(status) {
            const docs = await client.fetch<Array<Record<string, unknown>>>(
                `*[_type == "socialDraft" && status == $status] | order(generatedAt desc)`,
                { status },
            );
            return docs.map(toRecord);
        },

        async transition(id, to) {
            const current = await this.getById(id);
            if (!current) throw new Error(`Social draft not found: ${id}`);
            assertValidTransition(current.status, to);
            const doc = await client.patch(id).set({ status: to }).commit();
            return toRecord(doc as unknown as Record<string, unknown>);
        },

        async updateBody(id, body) {
            const doc = await client.patch(id).set({ body }).commit();
            return toRecord(doc as unknown as Record<string, unknown>);
        },

        async markPosted(id) {
            const current = await this.getById(id);
            if (!current) throw new Error(`Social draft not found: ${id}`);
            assertValidTransition(current.status, "posted");
            const doc = await client
                .patch(id)
                .set({ status: "posted", postedAt: new Date().toISOString() })
                .commit();
            return toRecord(doc as unknown as Record<string, unknown>);
        },
    };
}
