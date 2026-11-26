/**
 * Which AI assistant, if any, sent a visitor. Assistants show up two ways: as the referrer
 * (perplexity.ai, claude.ai, gemini.google.com…) or, for ChatGPT, as `utm_source=chatgpt.com`
 * on the link it cites. Pure, so it's tested without a browser.
 */
const ASSISTANT_HOSTS: [RegExp, string][] = [
    [/(^|\.)chatgpt\.com$|(^|\.)chat\.openai\.com$/, "ChatGPT"],
    [/(^|\.)perplexity\.ai$/, "Perplexity"],
    [/(^|\.)claude\.ai$/, "Claude"],
    [/^gemini\.google\.com$|^bard\.google\.com$/, "Gemini"],
    [/^copilot\.microsoft\.com$|(^|\.)copilot\.cloud\.microsoft$/, "Copilot"],
    [/(^|\.)you\.com$/, "You.com"],
    [/(^|\.)phind\.com$/, "Phind"],
    [/(^|\.)meta\.ai$/, "Meta AI"],
    [/(^|\.)deepseek\.com$/, "DeepSeek"],
    [/(^|\.)grok\.com$/, "Grok"],
];

function assistantForHost(host: string): string | null {
    const h = host.toLowerCase();
    for (const [pattern, name] of ASSISTANT_HOSTS) if (pattern.test(h)) return name;
    return null;
}

export function aiAssistantFrom(referrer: string, pageUrl: string): string | null {
    try {
        const utm = new URL(pageUrl).searchParams.get("utm_source");
        if (utm) {
            const fromUtm = assistantForHost(utm.replace(/^https?:\/\//, "").split("/")[0] ?? "");
            if (fromUtm) return fromUtm;
        }
    } catch {
        /* not a URL: fall through to the referrer */
    }
    if (!referrer) return null;
    try {
        return assistantForHost(new URL(referrer).hostname);
    } catch {
        return null;
    }
}

/** Links worth counting as a conversion step, by where they go. */
export function ctaFor(href: string, origin: string): string | null {
    let url: URL;
    try {
        url = new URL(href, origin);
    } catch {
        return null;
    }
    if (url.protocol === "mailto:") return "email";
    if (url.protocol === "tel:") return "phone";
    if (url.origin === origin) {
        if (url.pathname === "/work-with-me") return "work_with_me";
        if (url.pathname === "/results") return "results";
        return null;
    }
    if (url.hostname === "github.com" && url.pathname.startsWith("/arndvs")) return "github";
    if (/(^|\.)linkedin\.com$/.test(url.hostname)) return "linkedin";
    return null;
}
