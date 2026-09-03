import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireApiAuth } from "@/lib/api-auth";

import { GET, PATCH, POST } from "./route";

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
const updateBody = vi.fn();
const markPosted = vi.fn();
vi.mock("@/lib/engine/sanity", () => ({
    createSanitySocialDraftStore: () => ({ getById, transition, updateBody, markPosted }),
}));

function mockRequest(url = "http://localhost/api/ops/drafts/d1") {
    return new Request(url, { method: "POST" }) as never;
}

function mockAuthed() {
    (requireApiAuth as ReturnType<typeof vi.fn>).mockResolvedValue({
        session: { user: { id: "u1" } },
    });
}

describe("GET /api/ops/drafts/[id]", () => {
    beforeEach(() => vi.clearAllMocks());

    it("returns 404 when draft not found", async () => {
        mockAuthed();
        getById.mockResolvedValue(null);
        const res = await GET(mockRequest(), { params: Promise.resolve({ id: "d1" }) });
        expect(res.status).toBe(404);
    });

    it("returns the draft", async () => {
        mockAuthed();
        getById.mockResolvedValue({ _id: "d1", status: "draft", body: "hello" });
        const res = await GET(mockRequest(), { params: Promise.resolve({ id: "d1" }) });
        expect(res.status).toBe(200);
        const json = (await res.json()) as { draft: { _id: string } };
        expect(json.draft._id).toBe("d1");
    });
});

describe("POST /api/ops/drafts/[id] (approve)", () => {
    beforeEach(() => vi.clearAllMocks());

    it("approves an editing draft to ready via the state machine", async () => {
        mockAuthed();
        getById.mockResolvedValue({ _id: "d1", status: "editing", body: "x" });
        transition.mockResolvedValue({ _id: "d1", status: "ready", body: "x" });

        const res = await POST(mockRequest(), { params: Promise.resolve({ id: "d1" }) });
        expect(res.status).toBe(200);
        const json = (await res.json()) as { draft: { status: string } };
        expect(json.draft.status).toBe("ready");
        expect(transition).toHaveBeenCalledWith("d1", "ready");
    });

    it("rejects approving a draft in a non-approvable state", async () => {
        mockAuthed();
        getById.mockResolvedValue({ _id: "d1", status: "skipped", body: "x" });
        const res = await POST(mockRequest(), { params: Promise.resolve({ id: "d1" }) });
        expect(res.status).toBe(409);
    });
});

describe("PATCH /api/ops/drafts/[id] (edit)", () => {
    beforeEach(() => vi.clearAllMocks());

    it("edits a body and transitions draft → editing", async () => {
        mockAuthed();
        getById.mockResolvedValue({ _id: "d1", status: "draft", body: "old" });
        transition.mockResolvedValue({ _id: "d1", status: "editing", body: "old" });
        updateBody.mockResolvedValue({ _id: "d1", status: "editing", body: "new" });

        const req = new Request("http://localhost/api/ops/drafts/d1", {
            method: "PATCH",
            body: JSON.stringify({ body: "new" }),
            headers: { "Content-Type": "application/json" },
        }) as never;

        const res = await PATCH(req, { params: Promise.resolve({ id: "d1" }) });
        expect(res.status).toBe(200);
        const json = (await res.json()) as { draft: { body: string } };
        expect(json.draft.body).toBe("new");
        expect(transition).toHaveBeenCalledWith("d1", "editing");
    });
});
