import { describe, expect, it, vi } from "vitest";

import { parseApiResponse } from "./transcribe-client-utils";

describe("parseApiResponse", () => {
    it("returns parsed JSON payload for successful JSON responses", async () => {
        const response = new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "content-type": "application/json" },
        });

        const payload = await parseApiResponse<{ success: boolean }>(response);

        expect(payload.success).toBe(true);
    });

    it("throws server-provided JSON error message for non-ok responses", async () => {
        const response = new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "content-type": "application/json" },
        });

        await expect(parseApiResponse(response)).rejects.toThrow("Unauthorized");
    });

    it("throws fallback status message for non-ok JSON without an error field", async () => {
        const response = new Response(JSON.stringify({ ok: false }), {
            status: 429,
            headers: { "content-type": "application/json" },
        });

        await expect(parseApiResponse(response)).rejects.toThrow("Request failed with status 429");
    });

    it("throws non-json text preview and logs it", async () => {
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
        const response = new Response("<!DOCTYPE html><html><body>Oops</body></html>", {
            status: 500,
            headers: { "content-type": "text/html" },
        });

        await expect(parseApiResponse(response)).rejects.toThrow("<!DOCTYPE html><html><body>Oops</body></html>");
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });
});
