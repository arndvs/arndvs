/**
 * The one public origin every canonical, sitemap entry, JSON-LD `@id` and IndexNow call
 * is built from. Normalized so a misconfigured env var can't publish http:// canonicals:
 * the live sitemap listed `http://arndvs.com` until this existed.
 *
 * - No scheme ("arndvs.com") → https.
 * - http on any real host → https. Only localhost and 127.0.0.1 keep http, for dev.
 * - Trailing slashes removed, so `${url}/path` never doubles them.
 */
export function normalizeSiteUrl(raw: string): string {
    const trimmed = raw.trim().replace(/\/+$/, "");
    const withScheme = /^[a-z]+:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(withScheme);
    const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (url.protocol === "http:" && !isLocal) url.protocol = "https:";
    return url.origin;
}
