export interface TranscribeApiSuccess {
    text: string;
    summary: string;
    fileName: string;
}

interface ApiErrorPayload {
    error?: string;
}

function truncateForDisplay(value: string): string {
    return value.replace(/\s+/g, " ").trim().slice(0, 220);
}

export async function parseApiResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
        const payload = (await response.json()) as T | ApiErrorPayload;

        if (!response.ok) {
            const message =
                (payload as ApiErrorPayload).error?.trim() ||
                `Request failed with status ${response.status}`;
            throw new Error(message);
        }

        return payload as T;
    }

    const raw = await response.text();
    const safePreview = truncateForDisplay(raw);

    console.error("Non-JSON /api/transcribe response:", safePreview);

    throw new Error(
        safePreview || `Server returned an unexpected response format (status ${response.status}).`,
    );
}
