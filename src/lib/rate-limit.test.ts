import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { checkRateLimit, getClientIp } from "./rate-limit";

describe("getClientIp", () => {
    it("prefers x-vercel-forwarded-for, then cf-connecting-ip", () => {
        const vercel = new Headers({
            "x-vercel-forwarded-for": "1.2.3.4, 5.6.7.8",
            "cf-connecting-ip": "9.9.9.9",
        });
        expect(getClientIp(vercel)).toBe("1.2.3.4");

        const cf = new Headers({ "cf-connecting-ip": "9.9.9.9" });
        expect(getClientIp(cf)).toBe("9.9.9.9");
    });

    it("falls back to a fingerprint or 'anonymous' when no IP headers exist", () => {
        const ua = new Headers({ "user-agent": "Mozilla/5.0", "accept-language": "en-US" });
        expect(getClientIp(ua)).toMatch(/^fingerprint:/);

        expect(getClientIp(new Headers())).toBe("anonymous");
    });
});

describe("checkRateLimit", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("allows requests under the limit and blocks over it", () => {
        const config = { windowMs: 60_000, maxRequests: 2 };
        const ip = `test-${Date.now()}`;

        expect(checkRateLimit(ip, config).allowed).toBe(true);
        expect(checkRateLimit(ip, config).allowed).toBe(true);
        const blocked = checkRateLimit(ip, config);
        expect(blocked.allowed).toBe(false);
        expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    });

    it("resets after the window expires", () => {
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
