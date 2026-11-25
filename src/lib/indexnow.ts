import { siteConfig } from "@/sanity/env";

/** IndexNow tells Bing (which ChatGPT search draws on), Yandex and others a URL changed. */
export function getIndexNowKey(): string {
    const key = process.env.INDEXNOW_KEY;
    if (!key) throw new Error("Missing environment variable: INDEXNOW_KEY");
    return key;
}

/** IndexNow accepts up to 10,000 URLs per request; all must be on this host. */
export async function submitToIndexNow(urls: string[]): Promise<{ status: number; ok: boolean }> {
    const key = getIndexNowKey();
    const host = new URL(siteConfig.url).host;
    const own = urls.filter((u) => {
        try {
            return new URL(u).host === host;
        } catch {
            return false;
        }
    });
    if (own.length === 0) return { status: 204, ok: true };
    const response = await fetch("https://api.indexnow.org/IndexNow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
            host,
            key,
            keyLocation: `${siteConfig.url}/${key}.txt`,
            urlList: own.slice(0, 10_000),
        }),
    });
    return { status: response.status, ok: response.ok };
}
