import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { checkRateLimit, getClientIp } from "./rate-limit";

describe("getClientIp", () => {
    it("prefers x-vercel-forwarded-for", () => {
        const headers = new Headers({
            "x-vercel-forwarded-for": "1.2.3.4, 5.6.7.8",
            "cf-connecting-ip": "9.9.9.9",
        });

        expect(getClientIp(headers)).toBe("1.2.3.4");
    });

    it("falls back to cf-connecting-ip", () => {
        const headers = new Headers({ "cf-connecting-ip": "9.9.9.9" });

        expect(getClientIp(headers)).toBe("9.9.9.9");
    });

    it("builds fingerprint from user-agent when no IP headers", () => {
        const headers = new Headers({
            "user-agent": "Mozilla/5.0",
            "accept-language": "en-US",
        });

        expect(getClientIp(headers)).toMatch(/^fingerprint:/);
    });

    it("returns 'anonymous' when no identifying headers", () => {
        const headers = new Headers();

        expect(getClientIp(headers)).toBe("anonymous");
    });
});

describe("checkRateLimit", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("allows requests under the limit", () => {
        const config = { windowMs: 60_000, maxRequests: 3 };
        const ip = `test-${Date.now()}`;

        expect(checkRateLimit(ip, config).allowed).toBe(true);
        expect(checkRateLimit(ip, config).allowed).toBe(true);
        expect(checkRateLimit(ip, config).allowed).toBe(true);
    });

    it("blocks requests over the limit", () => {
        const config = { windowMs: 60_000, maxRequests: 2 };
        const ip = `test-block-${Date.now()}`;

        checkRateLimit(ip, config);
        checkRateLimit(ip, config);
        const result = checkRateLimit(ip, config);

        expect(result.allowed).toBe(false);
        expect(result.retryAfterSeconds).toBeGreaterThan(0);
    });

    it("resets after window expires", () => {
        const config = { windowMs: 60_000, maxRequests: 1 };
        const ip = `test-reset-${Date.now()}`;

        checkRateLimit(ip, config);
        expect(checkRateLimit(ip, config).allowed).toBe(false);

        vi.advanceTimersByTime(61_000);

        expect(checkRateLimit(ip, config).allowed).toBe(true);
    });

    it("tracks different IPs independently", () => {
        const config = { windowMs: 60_000, maxRequests: 1 };
        const ts = Date.now();

        checkRateLimit(`ip-a-${ts}`, config);
        expect(checkRateLimit(`ip-b-${ts}`, config).allowed).toBe(true);
    });
});
