import { describe, expect, it } from "vitest";

import { validateHoneypotServer } from "./honeypot-server";

describe("validateHoneypotServer", () => {
    it("returns valid for a clean submission in the time window", () => {
        expect(
            validateHoneypotServer({ _honeypot_timestamp: String(Date.now() - 5000) }).isValid,
        ).toBe(true);
        // No timestamp at all — passes (bot script would have to fill the field).
        expect(validateHoneypotServer({}).isValid).toBe(true);
    });

    it("rejects when a hidden honeypot field is filled", () => {
        const websiteFill = validateHoneypotServer({
            website: "https://spam.com",
            _honeypot_timestamp: String(Date.now() - 5000),
        });
        expect(websiteFill.isValid).toBe(false);

        const honeypotFill = validateHoneypotServer({
            _honeypot: "spam",
            _honeypot_timestamp: String(Date.now() - 5000),
        });
        expect(honeypotFill.isValid).toBe(false);
    });

    it("rejects submissions outside the allowed time window", () => {
        const tooFast = validateHoneypotServer({ _honeypot_timestamp: "1000" }, 2000);
        expect(tooFast.isValid).toBe(false);

        const now = Date.now();
        const tooSlow = validateHoneypotServer(
            { _honeypot_timestamp: String(now - 3_700_000) },
            now,
        );
        expect(tooSlow.isValid).toBe(false);
    });
});
