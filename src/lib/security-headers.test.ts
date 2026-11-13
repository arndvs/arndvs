import { describe, expect, it } from "vitest";

import nextConfig from "../../next.config";

type HeaderRule = { source: string; headers: { key: string; value: string }[] };

async function headerRules(): Promise<HeaderRule[]> {
    return (await nextConfig.headers?.()) ?? [];
}

function frameOptionsFor(rules: HeaderRule[], path: string): string | undefined {
    const rule = rules.find((r) => new RegExp(`^${r.source}$`).test(path));
    return rule?.headers.find((h) => h.key === "X-Frame-Options")?.value;
}

describe("X-Frame-Options", () => {
    // The Studio's Presentation tool previews pages in a same-origin iframe.
    // DENY makes the browser refuse that iframe, so the overlays never connect.
    it("allows same-origin framing of previewed pages", async () => {
        const rules = await headerRules();

        expect(frameOptionsFor(rules, "/blog/inkind-first-reward-journey")).toBe("SAMEORIGIN");
        expect(frameOptionsFor(rules, "/")).toBe("SAMEORIGIN");
    });

    it("still refuses third-party framing", async () => {
        const rules = await headerRules();

        for (const path of ["/", "/blog/inkind-first-reward-journey", "/studio"]) {
            expect(frameOptionsFor(rules, path)).not.toBe("ALLOWALL");
            expect(frameOptionsFor(rules, path)).toBeDefined();
        }
    });
});
