import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireApiAuth } from "@/lib/api-auth";

import { GET } from "./route";

// Mock auth first (before route import)
vi.mock("@/lib/api-auth", () => ({
    requireApiAuth: vi.fn(),
    jsonError: (message: string, status = 400) =>
        new Response(JSON.stringify({ error: message }), {
            status,
            headers: { "Content-Type": "application/json" },
        }),
}));

// Mock the store via a factory
const listActionable = vi.fn();
vi.mock("@/lib/engine/sanity", () => ({
    createSanitySocialDraftStore: () => ({ listActionable }),
}));

function mockRequest(url = "http://localhost/api/ops/queue") {
    return new Request(url) as never;
}

describe("GET /api/ops/queue", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns 401 when unauthenticated", async () => {
        (requireApiAuth as ReturnType<typeof vi.fn>).mockResolvedValue({
            response: new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
        });

        const res = await GET(mockRequest());
        expect(res.status).toBe(401);
        expect(listActionable).not.toHaveBeenCalled();
    });

    it("returns drafts when authenticated", async () => {
        (requireApiAuth as ReturnType<typeof vi.fn>).mockResolvedValue({
            session: { user: { id: "u1" } },
        });
        listActionable.mockResolvedValue([
            { _id: "d1", status: "draft", sourceType: "comment", score: 80 },
            { _id: "d2", status: "ready", sourceType: "weeklyDigest", score: 60 },
        ]);

        const res = await GET(mockRequest());
        expect(res.status).toBe(200);
        const json = (await res.json()) as { drafts: Array<{ _id: string }> };
        expect(json.drafts).toHaveLength(2);
        expect(json.drafts[0]?._id).toBe("d1");
    });

    it("filters by sourceType", async () => {
        (requireApiAuth as ReturnType<typeof vi.fn>).mockResolvedValue({
            session: { user: { id: "u1" } },
        });
        listActionable.mockResolvedValue([
            { _id: "d1", status: "draft", sourceType: "weeklyDigest", score: 80 },
            { _id: "d2", status: "draft", sourceType: "comment", score: 60 },
        ]);

        const res = await GET(mockRequest("http://localhost/api/ops/queue?sourceType=comment"));
        const body = (await res.json()) as { drafts: Array<{ _id: string }> };
        expect(body.drafts).toHaveLength(1);
        expect(body.drafts[0]?._id).toBe("d2");
    });
});
