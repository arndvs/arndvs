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

    it("creates a draft stamped with the 'draft' status", async () => {
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

        const result = await createSanitySocialDraftStore().create({
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

        mockClient.getDocument.mockResolvedValue({ _id: "x", _type: "post" });
        expect(await createSanitySocialDraftStore().getById("x")).toBeNull();
    });

    it("throws on an invalid status transition", async () => {
        mockClient.getDocument.mockResolvedValue({
            _id: "draft-1",
            _type: "socialDraft",
            platform: "linkedin",
            contentType: "post",
            body: "Hello",
            status: "draft",
            sourceType: "weeklyDigest",
        });

        await expect(
            createSanitySocialDraftStore().transition("draft-1", "posted"),
        ).rejects.toThrow(/Invalid social draft transition/);
    });
});
