interface RateLimitEntry {
    count: number;
    resetAt: number;
}

interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
}

const defaultConfig: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
};

// NOTE: This limiter is intentionally in-memory and best-effort per process.
// It does not provide cross-instance/global consistency, by design.
const store = new Map<string, RateLimitEntry>();
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
let lastCleanup = Date.now();

function readHeaderIp(headers: Headers, headerName: string): string | null {
    const value = headers.get(headerName)?.split(",")[0]?.trim();

    if (!value) return null;

    return value;
}

function buildFallbackClientFingerprint(headers: Headers): string | null {
    const userAgent = headers.get("user-agent")?.trim();
    const acceptedLanguage = headers.get("accept-language")?.trim();
    const clientHints = headers.get("sec-ch-ua")?.trim();
    const host = headers.get("host")?.trim();
    const fingerprintParts = [userAgent, acceptedLanguage, clientHints, host].filter(Boolean);

    if (fingerprintParts.length === 0) return null;

    return `fingerprint:${fingerprintParts.join("|")}`;
}

export function getClientIp(headers: Headers): string {
    const trustedPlatformIp =
        readHeaderIp(headers, "x-vercel-forwarded-for") ??
        readHeaderIp(headers, "cf-connecting-ip");

    if (trustedPlatformIp) return trustedPlatformIp;

    const fallbackFingerprint = buildFallbackClientFingerprint(headers);

    if (fallbackFingerprint) return fallbackFingerprint;

    return "anonymous";
}

export function checkRateLimit(
    ip: string,
    config: RateLimitConfig = defaultConfig,
): { allowed: boolean; retryAfterSeconds: number } {
    const now = Date.now();

    if (now - lastCleanup > CLEANUP_INTERVAL) {
        lastCleanup = now;
        for (const [key, entry] of store) {
            if (now > entry.resetAt) store.delete(key);
        }
    }

    const entry = store.get(ip);

    if (!entry || now > entry.resetAt) {
        store.set(ip, { count: 1, resetAt: now + config.windowMs });

        return { allowed: true, retryAfterSeconds: 0 };
    }

    if (entry.count >= config.maxRequests) {
        const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);

        return { allowed: false, retryAfterSeconds };
    }

    entry.count++;

    return { allowed: true, retryAfterSeconds: 0 };
}
