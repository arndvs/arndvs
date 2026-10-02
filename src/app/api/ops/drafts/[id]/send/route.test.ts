import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireApiAuth } from "@/lib/api-auth";

import { POST } from "./route";

vi.mock("@/lib/api-auth", () => ({
    requireApiAuth: vi.fn(),
    jsonError: (message: string, status = 400) =>
        new Response(JSON.stringify({ error: message }), {
            status,
            headers: { "Content-Type": "application/json" },
        }),
}));

const getById = vi.fn();
const markPosted = vi.fn();
vi.mock("@/lib/engine/sanity", () => ({
    createSanitySocialDraftStore: () => ({ getById, markPosted }),
}));

function mockRequest(url = "http://localhost/api/ops/drafts/d1/send") {
    return new Request(url, { method: "POST" }) as never;
}

function mockAuthed() {
    (requireApiAuth as ReturnType<typeof vi.fn>).mockResolvedValue({
        session: { user: { id: "u1" } },
    });
}

describe("POST /api/ops/drafts/[id]/send", () => {
    beforeEach(() => vi.clearAllMocks());

    it("returns 404 when draft not found", async () => {
        mockAuthed();
        getById.mockResolvedValue(null);
        const res = await POST(mockRequest(), { params: Promise.resolve({ id: "d1" }) });
        expect(res.status).toBe(404);
    });

    it("sends a ready draft via markPosted", async () => {
        mockAuthed();
        getById.mockResolvedValue({ _id: "d1", status: "ready", body: "x" });
        markPosted.mockResolvedValue({ _id: "d1", status: "posted", body: "x" });

        const res = await POST(mockRequest(), { params: Promise.resolve({ id: "d1" }) });
        expect(res.status).toBe(200);
        const json = (await res.json()) as { draft: { status: string } };
        expect(json.draft.status).toBe("posted");
        expect(markPosted).toHaveBeenCalledWith("d1");
    });

    it("rejects sending a non-ready draft via the policy (isSendable)", async () => {
        mockAuthed();
        getById.mockResolvedValue({ _id: "d1", status: "editing", body: "x" });

        const res = await POST(mockRequest(), { params: Promise.resolve({ id: "d1" }) });
        expect(res.status).toBe(409);
        expect(markPosted).not.toHaveBeenCalled();
    });

    it("rejects sending a terminal draft via the policy (isSendable)", async () => {
        mockAuthed();
        getById.mockResolvedValue({ _id: "d1", status: "posted", body: "x" });

        const res = await POST(mockRequest(), { params: Promise.resolve({ id: "d1" }) });
        expect(res.status).toBe(409);
        expect(markPosted).not.toHaveBeenCalled();
    });
});
