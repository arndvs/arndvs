import { describe, expect, it } from "vitest";

import { validateHoneypotServer } from "./honeypot-server";

describe("validateHoneypotServer", () => {
    it("accepts clean submissions and rejects bots and out-of-window fills", () => {
        // Clean: within the window, or no timestamp at all (bot would have to fill the field).
        expect(
            validateHoneypotServer({ _honeypot_timestamp: String(Date.now() - 5000) }).isValid,
        ).toBe(true);
        expect(validateHoneypotServer({}).isValid).toBe(true);

        // Filled hidden honeypot field — reject.
        expect(
            validateHoneypotServer({
                website: "https://spam.com",
                _honeypot_timestamp: String(Date.now() - 5000),
            }).isValid,
        ).toBe(false);
        expect(
            validateHoneypotServer({
                _honeypot: "spam",
                _honeypot_timestamp: String(Date.now() - 5000),
            }).isValid,
        ).toBe(false);

        // Outside the time window — too fast or too slow — reject.
        expect(validateHoneypotServer({ _honeypot_timestamp: "1000" }, 2000).isValid).toBe(false);
        expect(
            validateHoneypotServer(
                { _honeypot_timestamp: String(Date.now() - 3_700_000) },
                Date.now(),
            ).isValid,
        ).toBe(false);
    });
});
