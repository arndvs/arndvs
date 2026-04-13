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

const store = new Map<string, RateLimitEntry>();

export function getClientIp(headers: Headers): string {
    return (
        headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        headers.get("x-real-ip") ??
        headers.get("cf-connecting-ip") ??
        "unknown"
    );
}

export function checkRateLimit(
    ip: string,
    config: RateLimitConfig = defaultConfig,
): { allowed: boolean; retryAfterSeconds: number } {
    const now = Date.now();
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
