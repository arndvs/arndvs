import { describe, expect, it } from "vitest";

import { validateHoneypotServer } from "./honeypot-server";

describe("validateHoneypotServer", () => {
    it("returns valid for clean submission", () => {
        const result = validateHoneypotServer({
            _honeypot_timestamp: String(Date.now() - 5000),
        });

        expect(result.isValid).toBe(true);
    });

    it("rejects when honeypot field 'website' is filled", () => {
        const result = validateHoneypotServer({
            website: "https://spam.com",
            _honeypot_timestamp: String(Date.now() - 5000),
        });

        expect(result.isValid).toBe(false);
        expect(result.reason).toContain("Honeypot");
    });

    it("rejects when _honeypot field is filled", () => {
        const result = validateHoneypotServer({
            _honeypot: "spam",
            _honeypot_timestamp: String(Date.now() - 5000),
        });

        expect(result.isValid).toBe(false);
    });

    it("rejects form submitted too quickly (< 3s)", () => {
        const result = validateHoneypotServer(
            { _honeypot_timestamp: "1000" },
            2000,
        );

        expect(result.isValid).toBe(false);
        expect(result.reason).toContain("too quickly");
    });

    it("rejects form submitted too slowly (> 1 hour)", () => {
        const now = Date.now();
        const result = validateHoneypotServer(
            { _honeypot_timestamp: String(now - 3_700_000) },
            now,
        );

        expect(result.isValid).toBe(false);
        expect(result.reason).toContain("expired");
    });

    it("passes when no timestamp is provided", () => {
        const result = validateHoneypotServer({});

        expect(result.isValid).toBe(true);
    });
});
