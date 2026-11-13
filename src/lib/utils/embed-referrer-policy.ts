/**
 * Referrer policy for an embedded iframe.
 *
 * YouTube refuses playback when the embed request carries no `Referer` header,
 * failing with "Video player configuration error" (error 153). `no-referrer`
 * strips it, so YouTube embeds must send at least the origin. Everything else
 * keeps `no-referrer`, which is the tighter default for third-party content.
 */
export function embedReferrerPolicy(url: string): "origin" | "no-referrer" {
    let hostname: string;
    try {
        hostname = new URL(url).hostname;
    } catch {
        return "no-referrer";
    }

    const isYouTube =
        hostname === "youtube.com" ||
        hostname.endsWith(".youtube.com") ||
        hostname === "youtube-nocookie.com" ||
        hostname.endsWith(".youtube-nocookie.com");

    return isYouTube ? "origin" : "no-referrer";
}
