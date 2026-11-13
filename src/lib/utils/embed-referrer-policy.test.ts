import { describe, expect, it } from "vitest";

import { embedReferrerPolicy } from "./embed-referrer-policy";

describe("embedReferrerPolicy", () => {
    // YouTube fails with "Video player configuration error" (error 153) when the
    // embed request has no Referer, so these must not use no-referrer.
    it("sends the origin for YouTube embeds", () => {
        expect(embedReferrerPolicy("https://www.youtube-nocookie.com/embed/OnmBVC8vrwE")).toBe(
            "origin",
        );
        expect(embedReferrerPolicy("https://www.youtube.com/embed/OnmBVC8vrwE")).toBe("origin");
        expect(embedReferrerPolicy("https://youtube.com/embed/OnmBVC8vrwE")).toBe("origin");
        expect(embedReferrerPolicy("https://youtube-nocookie.com/embed/OnmBVC8vrwE")).toBe(
            "origin",
        );
    });

    it("keeps no-referrer for other embeds", () => {
        expect(
            embedReferrerPolicy(
                "https://arndvs.github.io/ai-visuals/visuals/haskell-to-typescript/",
            ),
        ).toBe("no-referrer");
        expect(embedReferrerPolicy("https://example.com/demo")).toBe("no-referrer");
    });

    it("does not treat lookalike hosts as YouTube", () => {
        expect(embedReferrerPolicy("https://notyoutube.com/embed/x")).toBe("no-referrer");
        expect(embedReferrerPolicy("https://youtube.com.evil.test/embed/x")).toBe("no-referrer");
    });

    it("falls back to no-referrer for an unparseable URL", () => {
        expect(embedReferrerPolicy("not a url")).toBe("no-referrer");
    });
});
