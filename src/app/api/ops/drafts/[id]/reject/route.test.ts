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
const transition = vi.fn();
vi.mock("@/lib/engine/sanity", () => ({
    createSanitySocialDraftStore: () => ({ getById, transition }),
}));

function mockRequest(url = "http://localhost/api/ops/drafts/d1/reject") {
    return new Request(url, {
        method: "POST",
        body: JSON.stringify({ note: "not a fit" }),
        headers: { "Content-Type": "application/json" },
    }) as never;
}

function mockAuthed() {
    (requireApiAuth as ReturnType<typeof vi.fn>).mockResolvedValue({
        session: { user: { id: "u1" } },
    });
}

describe("POST /api/ops/drafts/[id]/reject", () => {
    beforeEach(() => vi.clearAllMocks());

    it("returns 404 when draft not found", async () => {
        mockAuthed();
        getById.mockResolvedValue(null);
        const res = await POST(mockRequest(), { params: Promise.resolve({ id: "d1" }) });
        expect(res.status).toBe(404);
    });

    it("requires a note", async () => {
        mockAuthed();
        getById.mockResolvedValue({ _id: "d1", status: "draft", body: "x" });
        const req = new Request("http://localhost/api/ops/drafts/d1/reject", {
            method: "POST",
            body: JSON.stringify({}),
            headers: { "Content-Type": "application/json" },
        }) as never;
        const res = await POST(req, { params: Promise.resolve({ id: "d1" }) });
        expect(res.status).toBe(400);
        expect(transition).not.toHaveBeenCalled();
    });

    it("rejects a draft via the policy (isRejectable) and transitions to skipped", async () => {
        mockAuthed();
        getById.mockResolvedValue({ _id: "d1", status: "editing", body: "x" });
        transition.mockResolvedValue({ _id: "d1", status: "skipped", body: "x" });

        const res = await POST(mockRequest(), { params: Promise.resolve({ id: "d1" }) });
        expect(res.status).toBe(200);
        const json = (await res.json()) as { draft: { status: string } };
        expect(json.draft.status).toBe("skipped");
        expect(transition).toHaveBeenCalledWith("d1", "skipped");
    });

    it("rejects a terminal draft via the policy (isRejectable)", async () => {
        mockAuthed();
        getById.mockResolvedValue({ _id: "d1", status: "posted", body: "x" });

        const res = await POST(mockRequest(), { params: Promise.resolve({ id: "d1" }) });
        expect(res.status).toBe(409);
        expect(transition).not.toHaveBeenCalled();
    });
});