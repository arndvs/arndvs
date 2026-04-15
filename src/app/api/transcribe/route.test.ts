import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { transcriptionCreateMock, checkRateLimitMock, getClientIpMock, fetchMock } = vi.hoisted(
    () => {
        return {
            transcriptionCreateMock: vi.fn(),
            checkRateLimitMock: vi.fn(),
            getClientIpMock: vi.fn(),
            fetchMock: vi.fn(),
        };
    },
);

vi.mock("openai", () => {
    class OpenAI {
        audio = {
            transcriptions: {
                create: transcriptionCreateMock,
            },
        };
    }

    return { default: OpenAI };
});

vi.mock("@/lib/rate-limit", () => ({
    checkRateLimit: checkRateLimitMock,
    getClientIp: getClientIpMock,
}));

type RequestOptions = {
    password?: string;
    authCheck?: boolean;
    file?: File;
};

function createRequest({ password, authCheck, file }: RequestOptions = {}) {
    const formData = new FormData();
    if (file) formData.append("audio", file);

    const headers = new Headers();
    if (password) headers.set("x-transcribe-password", password);
    if (authCheck) headers.set("x-transcribe-auth-check", "true");

    return new Request("http://localhost/api/transcribe", {
        method: "POST",
        headers,
        body: formData,
    });
}

async function importRoute() {
    vi.resetModules();
    return import("./route");
}

describe("POST /api/transcribe", () => {
    beforeEach(() => {
        process.env.TRANSCRIBE_PASSWORD = "correct-pass";
        process.env.OPENAI_API_KEY = "test-openai-key";
        delete process.env.PY_API_BASE_URL;
        delete process.env.PY_API_TRANSCRIBE_PATH;
        delete process.env.PY_API_TOKEN;
        delete process.env.OSS_TRANSCRIBE_URL;
        delete process.env.OSS_TRANSCRIBE_TOKEN;

        transcriptionCreateMock.mockReset();
        checkRateLimitMock.mockReset();
        getClientIpMock.mockReset();
        fetchMock.mockReset();

        checkRateLimitMock.mockReturnValue({ allowed: true, retryAfterSeconds: 0 });
        getClientIpMock.mockReturnValue("127.0.0.1");

        vi.stubGlobal("fetch", fetchMock);
    });

    afterEach(() => {
        delete process.env.TRANSCRIBE_PASSWORD;
        delete process.env.OPENAI_API_KEY;
        delete process.env.PY_API_BASE_URL;
        delete process.env.PY_API_TRANSCRIBE_PATH;
        delete process.env.PY_API_TOKEN;
        delete process.env.OSS_TRANSCRIBE_URL;
        delete process.env.OSS_TRANSCRIBE_TOKEN;

        vi.unstubAllGlobals();
    });

    it("returns 401 when password header is missing", async () => {
        const { POST } = await importRoute();
        const response = await POST(createRequest() as never);

        expect(response.status).toBe(401);
    });

    it("returns 500 JSON when TRANSCRIBE_PASSWORD is missing", async () => {
        delete process.env.TRANSCRIBE_PASSWORD;

        const { POST } = await importRoute();
        const response = await POST(createRequest({ password: "correct-pass" }) as never);
        const body = (await response.json()) as { error: string };

        expect(response.status).toBe(500);
        expect(body.error).toBe("Internal server error");
    });

    it("returns 401 when password is invalid", async () => {
        const { POST } = await importRoute();
        const response = await POST(createRequest({ password: "bad-pass" }) as never);

        expect(response.status).toBe(401);
    });

    it("returns 200 for auth-check and does not call transcription provider", async () => {
        const { POST } = await importRoute();
        const response = await POST(
            createRequest({ password: "correct-pass", authCheck: true }) as never,
        );

        expect(response.status).toBe(200);
        expect(transcriptionCreateMock).not.toHaveBeenCalled();
    });

    it("returns 400 when audio file is missing", async () => {
        const { POST } = await importRoute();
        const response = await POST(createRequest({ password: "correct-pass" }) as never);

        expect(response.status).toBe(400);
    });

    it("returns 400 when file exceeds size limit", async () => {
        const bigPayload = new Uint8Array(26 * 1024 * 1024);
        const bigFile = new File([bigPayload], "big.wav", { type: "audio/wav" });

        const { POST } = await importRoute();
        const response = await POST(
            createRequest({ password: "correct-pass", file: bigFile }) as never,
        );

        expect(response.status).toBe(400);
    });

    it("returns 500 JSON when OPENAI_API_KEY is missing", async () => {
        delete process.env.OPENAI_API_KEY;

        const file = new File(["audio"], "recording.wav", { type: "audio/wav" });

        const { POST } = await importRoute();
        const response = await POST(createRequest({ password: "correct-pass", file }) as never);
        const body = (await response.json()) as { error: string };

        expect(response.status).toBe(500);
        expect(body.error).toBe("Internal server error");
    });

    it("uses open-source transcriber when configured", async () => {
        process.env.PY_API_BASE_URL = "http://localhost:8000";
        process.env.PY_API_TOKEN = "py-api-token";
        fetchMock.mockResolvedValue(
            new Response(
                JSON.stringify({ text: "Speaker one said hello and speaker two replied." }),
                {
                    status: 200,
                    headers: { "content-type": "application/json" },
                },
            ),
        );

        const file = new File(["audio"], "recording.wav", { type: "audio/wav" });

        const { POST } = await importRoute();
        const response = await POST(createRequest({ password: "correct-pass", file }) as never);
        const body = (await response.json()) as {
            text: string;
            summary: string;
            fileName: string;
            warnings: string[];
        };

        expect(response.status).toBe(200);
        expect(body.text).toBe("Speaker one said hello and speaker two replied.");
        expect(body.warnings).toEqual([]);
        expect(transcriptionCreateMock).not.toHaveBeenCalled();
        expect(fetchMock).toHaveBeenCalledWith(
            "http://localhost:8000/v1/transcribe",
            expect.objectContaining({ method: "POST" }),
        );
    });

    it("falls back to OpenAI when open-source transcriber fails", async () => {
        process.env.PY_API_BASE_URL = "http://localhost:8000";
        fetchMock.mockResolvedValue(
            new Response(JSON.stringify({ error: "service unavailable" }), {
                status: 503,
                headers: { "content-type": "application/json" },
            }),
        );
        transcriptionCreateMock.mockResolvedValue("Fallback transcript from OpenAI.");

        const file = new File(["audio"], "recording.wav", { type: "audio/wav" });

        const { POST } = await importRoute();
        const response = await POST(createRequest({ password: "correct-pass", file }) as never);
        const body = (await response.json()) as {
            text: string;
            warnings: string[];
        };

        expect(response.status).toBe(200);
        expect(body.text).toBe("Fallback transcript from OpenAI.");
        expect(body.warnings).toEqual([
            "Python API transcription unavailable. Used fallback provider.",
        ]);
        expect(transcriptionCreateMock).toHaveBeenCalledTimes(1);
    });

    it("supports legacy OSS transcriber env vars for backwards compatibility", async () => {
        process.env.OSS_TRANSCRIBE_URL = "http://legacy-host/transcribe";
        process.env.OSS_TRANSCRIBE_TOKEN = "legacy-token";
        fetchMock.mockResolvedValue(
            new Response(JSON.stringify({ text: "Legacy OSS transcript response." }), {
                status: 200,
                headers: { "content-type": "application/json" },
            }),
        );

        const file = new File(["audio"], "recording.wav", { type: "audio/wav" });

        const { POST } = await importRoute();
        const response = await POST(createRequest({ password: "correct-pass", file }) as never);
        const body = (await response.json()) as { text: string; warnings: string[] };

        expect(response.status).toBe(200);
        expect(body.text).toBe("Legacy OSS transcript response.");
        expect(body.warnings).toEqual([]);
        expect(fetchMock).toHaveBeenCalledWith(
            "http://legacy-host/transcribe",
            expect.objectContaining({ method: "POST" }),
        );
    });

    it("accepts codec-suffixed MIME and returns text, summary, and unique filename", async () => {
        transcriptionCreateMock.mockResolvedValue(
            "Discussed launch checklist and onboarding tasks for this week.",
        );

        const file = new File(["audio"], "recording.webm", { type: "audio/webm;codecs=opus" });

        const { POST } = await importRoute();
        const response = await POST(createRequest({ password: "correct-pass", file }) as never);
        const body = (await response.json()) as {
            text: string;
            summary: string;
            fileName: string;
        };

        expect(response.status).toBe(200);
        expect(body.text).toBe("Discussed launch checklist and onboarding tasks for this week.");
        expect(body.summary).toBe("Discussed launch checklist and onboarding tasks for");
        expect(body.fileName).toMatch(/^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}Z_[a-z0-9-]+\.txt$/);
    });

    it("returns 502 when provider returns empty transcription", async () => {
        transcriptionCreateMock.mockResolvedValue("   ");

        const file = new File(["audio"], "recording.wav", { type: "audio/wav" });

        const { POST } = await importRoute();
        const response = await POST(createRequest({ password: "correct-pass", file }) as never);

        expect(response.status).toBe(502);
    });

    it("returns 502 when provider throws", async () => {
        transcriptionCreateMock.mockRejectedValue(new Error("upstream error"));

        const file = new File(["audio"], "recording.wav", { type: "audio/wav" });

        const { POST } = await importRoute();
        const response = await POST(createRequest({ password: "correct-pass", file }) as never);
        const body = (await response.json()) as { error: string };

        expect(response.status).toBe(502);
        expect(body.error).toBe("Transcription failed. Check server logs for details.");
    });

    it("returns sanitized auth error when provider rejects API key", async () => {
        transcriptionCreateMock.mockRejectedValue({
            status: 401,
            message: "Incorrect API key provided",
        });

        const file = new File(["audio"], "recording.wav", { type: "audio/wav" });

        const { POST } = await importRoute();
        const response = await POST(createRequest({ password: "correct-pass", file }) as never);
        const body = (await response.json()) as { error: string };

        expect(response.status).toBe(502);
        expect(body.error).toBe(
            "Transcription provider authentication failed. Check OPENAI_API_KEY.",
        );
    });

    it("returns 429 when rate limit is exceeded", async () => {
        checkRateLimitMock.mockReturnValue({ allowed: false, retryAfterSeconds: 30 });

        const { POST } = await importRoute();
        const response = await POST(createRequest({ password: "correct-pass" }) as never);

        expect(response.status).toBe(429);
        expect(response.headers.get("Retry-After")).toBe("30");
    });
});
