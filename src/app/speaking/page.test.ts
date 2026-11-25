import { describe, expect, it, vi } from "vitest";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("@/sanity/env", () => ({
    siteConfig: { url: "https://arndvs.com", studioUrl: "/studio" },
}));

const { default: SpeakingPage } = await import("./page");
const { TALKS, TOPICS } = await import("./data");

describe("/speaking page", () => {
    const html = renderToStaticMarkup(createElement(SpeakingPage)).replace(/&#x27;|&#39;/g, "'");

    it("renders every talk with an anchor", () => {
        for (const talk of TALKS) {
            expect(html).toContain(`id="${talk.id}"`);
            expect(html).toContain(talk.title);
        }
    });

    it("emits an EducationEvent for every talk", () => {
        expect(html.match(/"@type":"EducationEvent"/g)?.length).toBe(TALKS.length);
    });

    it("renders every topic and the event links", () => {
        for (const topic of TOPICS) expect(html).toContain(topic.title);
        expect(html).toContain("linkedin.com/events/");
        expect(html).not.toContain("Andrew");
    });
});
