import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { TALKS } from "./data";

describe("TALKS", () => {
    it("has unique, anchor-safe ids", () => {
        const ids = TALKS.map((talk) => talk.id);
        expect(new Set(ids).size).toBe(ids.length);
        for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
    });

    it("has the facts every talk needs", () => {
        expect(TALKS.length).toBeGreaterThan(0);
        for (const talk of TALKS) {
            for (const field of ["title", "host", "event", "audience", "summary"] as const) {
                expect(talk[field].trim(), `${talk.id}.${field}`).not.toBe("");
            }
            expect(talk.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            // Venue and city travel together.
            expect(Boolean(talk.venue), talk.id).toBe(Boolean(talk.city));
            expect(talk.outline.length).toBeGreaterThan(0);
            expect(talk.takeaways.length).toBeGreaterThan(0);
        }
    });

    it("lists talks newest first", () => {
        const dates = TALKS.map((talk) => talk.date);
        expect(dates).toEqual([...dates].sort().reverse());
    });

    it("points every slide at a file in public/ with alt text", () => {
        for (const talk of TALKS) {
            for (const slide of talk.slides) {
                expect(existsSync(join(process.cwd(), "public", slide.src)), slide.src).toBe(true);
                expect(slide.alt.length, slide.src).toBeGreaterThan(20);
            }
        }
    });

    it("keeps client worked examples off the page", () => {
        const text = JSON.stringify(TALKS);
        expect(text).not.toMatch(/Fischer|Story Vault -|Writeprint Result/);
    });
});
