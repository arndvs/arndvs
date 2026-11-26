import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/sanity/env", () => ({
    siteConfig: { url: "https://arndvs.com", studioUrl: "/studio" },
}));

const { personJsonLd, ripemetricsJsonLd } = await import("./json-ld");

describe("Person JSON-LD", () => {
    it("places Aaron in San Diego, which tells him apart from other Aaron Davises", () => {
        expect(personJsonLd.homeLocation.address).toMatchObject({
            addressLocality: "San Diego",
            addressRegion: "CA",
        });
        expect(personJsonLd.alternateName).toBe("arndvs");
    });

    it("lists only credentials that the facts ledger records", () => {
        const ledger = readFileSync(
            resolve(__dirname, "../../../docs/reference/facts-ledger.md"),
            "utf8",
        );
        for (const c of personJsonLd.hasCredential) expect(ledger).toContain(c.name);
    });

    it("links RipeMetrics back to Aaron as founder", () => {
        expect(ripemetricsJsonLd.founder["@id"]).toBe(personJsonLd["@id"]);
    });

    it("uses https identifiers", () => {
        expect(personJsonLd["@id"]).toBe("https://arndvs.com/#person");
        expect(personJsonLd.image.startsWith("https://")).toBe(true);
    });
});
