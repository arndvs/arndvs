import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSanitySocialDraftStore } from "./sanity";

// Mock the Sanity env + client
vi.mock("@/sanity/env", () => ({
    apiVersion: "2025-03-19",
    dataset: "production",
    projectId: "test-project",
}));

vi.mock("@sanity/client", () => {
    const createClient = vi.fn(() => mockClient);
    return { createClient };
});

// A capturing mock client
const mockClient = {
    create: vi.fn(),
    getDocument: vi.fn(),
    fetch: vi.fn(),
    patch: vi.fn(() => ({
        set: vi.fn(() => ({
            commit: vi.fn(),
        })),
    })),
};

describe("createSanitySocialDraftStore", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.SANITY_API_TOKEN = "test-token";
    });

    it("creates a draft with status 'draft'", async () => {
        mockClient.create.mockResolvedValue({
            _id: "draft-1",
            _type: "socialDraft",
            platform: "linkedin",
            contentType: "post",
            body: "Hello world",
            status: "draft",
            sourceType: "weeklyDigest",
            generatedAt: "2026-08-14T00:00:00.000Z",
        });

        const store = createSanitySocialDraftStore();
        const result = await store.create({
            platform: "linkedin",
            contentType: "post",
            body: "Hello world",
            sourceType: "weeklyDigest",
        });

        expect(result.status).toBe("draft");
        expect(result._id).toBe("draft-1");
        expect(mockClient.create).toHaveBeenCalledWith(
            expect.objectContaining({
                _type: "socialDraft",
                status: "draft",
                platform: "linkedin",
            }),
        );
    });

    it("returns null when a document is not a socialDraft", async () => {
        mockClient.getDocument.mockResolvedValue({ _id: "x", _type: "post" });
        const store = createSanitySocialDraftStore();
        const result = await store.getById("x");
        expect(result).toBeNull();
    });

    it("throws on an invalid transition", async () => {
        mockClient.getDocument.mockResolvedValue({
            _id: "draft-1",
            _type: "socialDraft",
            platform: "linkedin",
            contentType: "post",
            body: "Hello",
            status: "draft",
            sourceType: "weeklyDigest",
        });

        const store = createSanitySocialDraftStore();
        await expect(store.transition("draft-1", "posted")).rejects.toThrow(
            /Invalid social draft transition/,
        );
    });
});
