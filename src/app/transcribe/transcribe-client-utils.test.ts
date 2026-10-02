import { describe, expect, it, vi } from "vitest";

import { parseApiResponse } from "./transcribe-client-utils";

describe("parseApiResponse", () => {
    it("parses successful responses and surfaces JSON, status-text, and raw errors", async () => {
        const success = new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "content-type": "application/json" },
        });
        expect((await parseApiResponse<{ success: boolean }>(success)).success).toBe(true);

        const serverError = new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "content-type": "application/json" },
        });
        await expect(parseApiResponse(serverError)).rejects.toThrow("Unauthorized");

        const fallback = new Response(JSON.stringify({ ok: false }), {
            status: 429,
            headers: { "content-type": "application/json" },
        });
        await expect(parseApiResponse(fallback)).rejects.toThrow("Request failed with status 429");

        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
        const raw = new Response("<!DOCTYPE html><html><body>Oops</body></html>", {
            status: 500,
            headers: { "content-type": "text/html" },
        });
        await expect(parseApiResponse(raw)).rejects.toThrow(
            "<!DOCTYPE html><html><body>Oops</body></html>",
        );
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });
});
