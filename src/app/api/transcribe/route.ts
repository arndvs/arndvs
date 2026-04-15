import OpenAI from "openai";

import { NextRequest, NextResponse } from "next/server";

import { safeCompare } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const ALLOWED_MIME_TYPES = new Set([
    "audio/mpeg",
    "audio/mp4",
    "audio/wav",
    "audio/ogg",
    "audio/webm",
    "audio/flac",
    "audio/aac",
    "video/mp4",
    "video/webm",
]);

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

type TranscriptionResult = {
    text: string;
    warnings?: string[];
};

type PythonApiConfig = {
    url: string;
    token?: string;
};

function slugify(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60);
}

function createTimestamp(): string {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day = String(now.getUTCDate()).padStart(2, "0");
    const hours = String(now.getUTCHours()).padStart(2, "0");
    const minutes = String(now.getUTCMinutes()).padStart(2, "0");
    const seconds = String(now.getUTCSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}Z`;
}

function buildSummary(transcription: string): string {
    const firstSentence = transcription
        .replace(/\s+/g, " ")
        .trim()
        .split(/[.!?\n]/)[0]
        ?.trim();

    if (!firstSentence) return "audio transcription";

    const words = firstSentence.split(" ").filter(Boolean).slice(0, 7);

    if (words.length === 0) return "audio transcription";

    return words.join(" ");
}

function guessMimeType(filename: string): string {
    const ext = filename.split(".").pop()?.toLowerCase();
    const map: Record<string, string> = {
        mp3: "audio/mpeg",
        mp4: "audio/mp4",
        m4a: "audio/mp4",
        wav: "audio/wav",
        ogg: "audio/ogg",
        webm: "audio/webm",
        flac: "audio/flac",
        aac: "audio/aac",
    };

    return map[ext ?? ""] ?? "audio/mpeg";
}

function getPublicTranscriptionError(error: unknown): string {
    const status =
        typeof error === "object" && error !== null && "status" in error
            ? (error as { status?: number }).status
            : undefined;

    if (status === 401)
        return "Transcription provider authentication failed. Check OPENAI_API_KEY.";

    if (status === 429)
        return "Transcription provider rate limit reached. Please try again shortly.";

    if (typeof status === "number" && status >= 500)
        return "Transcription provider is currently unavailable. Please try again.";

    return "Transcription failed. Check server logs for details.";
}

function getTranscriptionText(response: unknown): string {
    if (typeof response === "string") return response.trim();

    if (
        typeof response === "object" &&
        response !== null &&
        "text" in response &&
        typeof (response as { text?: unknown }).text === "string"
    )
        return (response as { text: string }).text.trim();

    return "";
}

function getPythonApiConfig(): PythonApiConfig | null {
    const baseUrl = process.env.PY_API_BASE_URL?.trim();
    const transcribePath = process.env.PY_API_TRANSCRIBE_PATH?.trim() || "/v1/transcribe";
    const legacyUrl = process.env.OSS_TRANSCRIBE_URL?.trim();

    const url = baseUrl
        ? `${baseUrl.replace(/\/$/, "")}${transcribePath.startsWith("/") ? transcribePath : `/${transcribePath}`}`
        : legacyUrl;

    if (!url) return null;

    const token = process.env.PY_API_TOKEN?.trim() || process.env.OSS_TRANSCRIBE_TOKEN?.trim();

    return { url, token };
}

function toSuccessResponse(text: string, warnings?: string[]) {
    const summary = buildSummary(text);
    const timestamp = createTimestamp();
    const summarySlug = slugify(summary);
    const fileName = `${timestamp}_${summarySlug || "transcription"}.txt`;

    return NextResponse.json({ text, summary, fileName, warnings: warnings ?? [] });
}

async function transcribeWithOpenSourceService(params: {
    file: File;
    mimeType: string;
}): Promise<TranscriptionResult | null> {
    const pythonApi = getPythonApiConfig();

    if (!pythonApi) return null;

    const form = new FormData();
    form.append("audio", params.file);
    form.append("mime_type", params.mimeType);

    const headers = new Headers();

    if (pythonApi.token) headers.set("Authorization", `Bearer ${pythonApi.token}`);

    const response = await fetch(pythonApi.url, {
        method: "POST",
        headers,
        body: form,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");
    const payload = isJson
        ? ((await response.json()) as { text?: string; transcript?: string; error?: string })
        : undefined;

    if (!response.ok) {
        const providerMessage = payload?.error?.trim();
        throw new Error(
            providerMessage || `Open-source transcriber failed with status ${response.status}`,
        );
    }

    const transcriptionText = (payload?.text ?? payload?.transcript ?? "").trim();

    if (!transcriptionText) throw new Error("Open-source transcriber returned empty transcript");

    return { text: transcriptionText };
}

export async function POST(request: NextRequest) {
    const ip = getClientIp(request.headers);

    try {
        const { allowed, retryAfterSeconds } = checkRateLimit(ip, {
            windowMs: 60 * 60 * 1000,
            maxRequests: 20,
        });

        if (!allowed)
            return NextResponse.json(
                { error: "Too many requests. Try again later." },
                { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
            );
    } catch (error) {
        console.error("Rate limit check failed, allowing request:", error);
    }

    const transcribePassword = process.env.TRANSCRIBE_PASSWORD;

    if (!transcribePassword) {
        console.error("Missing environment variable: TRANSCRIBE_PASSWORD");

        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    const password = request.headers.get("x-transcribe-password");

    if (!password || !safeCompare(password, transcribePassword))
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (request.headers.get("x-transcribe-auth-check") === "true")
        return NextResponse.json({ success: true }, { status: 200 });

    let formData: FormData;
    try {
        formData = await request.formData();
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const file = formData.get("audio") as File | null;

    if (!file) return NextResponse.json({ error: "No audio file provided" }, { status: 400 });

    if (file.size > MAX_FILE_SIZE)
        return NextResponse.json(
            { error: `File too large. Maximum ${MAX_FILE_SIZE / 1024 / 1024}MB.` },
            { status: 400 },
        );

    const rawMime = file.type || guessMimeType(file.name);
    const parsedMime = rawMime.split(";")[0]?.trim();

    if (!parsedMime)
        return NextResponse.json({ error: `Unsupported file type: ${rawMime}` }, { status: 400 });

    const mimeType = parsedMime === "audio/x-m4a" ? "audio/mp4" : parsedMime;

    if (!ALLOWED_MIME_TYPES.has(mimeType))
        return NextResponse.json({ error: `Unsupported file type: ${mimeType}` }, { status: 400 });

    let fallbackWarnings: string[] = [];

    try {
        const openSourceResult = await transcribeWithOpenSourceService({ file, mimeType });

        if (openSourceResult?.text)
            return toSuccessResponse(openSourceResult.text, openSourceResult.warnings);
    } catch (error) {
        console.warn(
            "Python API transcriber failed, falling back to OpenAI:",
            error instanceof Error ? error.message : error,
        );
        fallbackWarnings = ["Python API transcription unavailable. Used fallback provider."];
    }

    const openAiApiKey = process.env.OPENAI_API_KEY;

    if (!openAiApiKey) {
        console.error("Missing environment variable: OPENAI_API_KEY");

        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey: openAiApiKey });

    try {
        const transcriptionResponse = await openai.audio.transcriptions.create({
            file,
            model: "whisper-1",
            response_format: "text",
            prompt: "Transcribe the complete audio verbatim from start to finish. Do not summarize, shorten, or omit spoken content.",
        });

        const transcriptionText = getTranscriptionText(transcriptionResponse);

        if (!transcriptionText)
            return NextResponse.json({ error: "Empty transcription returned" }, { status: 502 });

        return toSuccessResponse(transcriptionText, fallbackWarnings);
    } catch (error) {
        console.error("Transcription API error:", error instanceof Error ? error.message : error);

        return NextResponse.json({ error: getPublicTranscriptionError(error) }, { status: 502 });
    }
}
