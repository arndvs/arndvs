import { describe, expect, it } from "vitest";

import { derive, splitStory } from "./engine";
import type { Product } from "./engine";
import { PRESETS, fromPreset } from "./presets";

const blank = (text: string, roleName = "Owner"): Product => ({
    id: "yours",
    name: "Yours",
    origin: "blank",
    aliases: {},
    stories: [{ id: "st1", roleName, actor: "", text }],
    choices: { corrections: {}, cardinality: {}, releases: {}, manualScreens: [], dismissed: [] },
});

const BAKERY =
    "Priya runs a small bakery. Every morning she checks the orders from her website and prints each order. Customers browse the cakes, choose a size and pay online.";

describe("derive", () => {
    it("catches the missing applicants list in the tester example", () => {
        const derived = derive(fromPreset("tester"));

        expect(derived.findings.some((finding) => finding.id === "walk:applicant")).toBe(true);
        expect(
            derived.screens.some(
                (screen) => screen.id === "list-applicant" && screen.ruleId === "walk",
            ),
        ).toBe(true);
    });

    it("points 'contacts ten of them' at the applicants, not the answers", () => {
        const derived = derive(fromPreset("tester"));
        const byId = (id: string) => derived.relationships.find((rel) => rel.id === id);

        expect(byId("company>applicant")?.verbs).toContain("contact");
        expect(byId("company>answer")?.verbs).not.toContain("contact");
    });

    it("flags the clinic's one-or-many mistake, and setting it to many clears it", () => {
        const product = fromPreset("clinic");
        const flagged = (p: Product) =>
            derive(p).findings.some((finding) => finding.id === "card:therapist>clinic");

        expect(flagged(product)).toBe(true);
        product.choices.cardinality["therapist>clinic"] = "many";
        expect(flagged(product)).toBe(false);
    });

    it.each(PRESETS.map((preset) => preset.id))(
        "gives every create screen an edit screen (%s)",
        (id) => {
            const { screens } = derive(fromPreset(id));
            for (const screen of screens.filter((candidate) => candidate.type === "create")) {
                expect(screens.map((candidate) => candidate.id)).toContain(
                    screen.id.replace("new-", "edit-"),
                );
            }
        },
    );

    it.each(PRESETS.map((preset) => preset.id))("raises no false split finding (%s)", (id) => {
        const splits = derive(fromPreset(id)).findings.filter((finding) =>
            finding.id.startsWith("split:"),
        );

        expect(splits.map((finding) => finding.message)).toEqual([]);
    });

    it("credits a second role inside a story to that role and flags it", () => {
        const derived = derive(blank(BAKERY));
        const split = derived.findings.find((finding) => finding.id === "split:st1:customer");

        expect(split?.split?.subject).toBe("customer");
        expect(
            derived.relationships.some((rel) => rel.from === "customer" && rel.to === "cake"),
        ).toBe(true);
        expect(derived.relationships.some((rel) => rel.from === "owner" && rel.to === "cake")).toBe(
            false,
        );
    });

    it("raises no split finding for a story about one role", () => {
        const derived = derive(
            blank(
                "Sam runs a bike shop. He checks the repairs every morning, calls customers when a bike is ready and sends each invoice.",
            ),
        );

        expect(derived.findings.filter((finding) => finding.id.startsWith("split:"))).toEqual([]);
    });

    it("marks dismissed findings and keeps releases chosen for screens", () => {
        const product = fromPreset("tester");
        product.choices.dismissed.push("walk:applicant");
        product.choices.releases["list-applicant"] = "r3";
        const derived = derive(product);

        expect(derived.findings.find((finding) => finding.id === "walk:applicant")?.status).toBe(
            "dismissed",
        );
        expect(derived.screens.find((screen) => screen.id === "list-applicant")?.release).toBe(
            "r3",
        );
    });
});

describe("splitStory", () => {
    it("moves the other role's sentence into a new story and clears the finding", () => {
        const product = blank(BAKERY);
        const finding = derive(product).findings.find(
            (candidate) => candidate.id === "split:st1:customer",
        );
        expect(finding).toBeDefined();

        const next = splitStory(product, finding!, "st2");

        expect(next.stories).toHaveLength(2);
        expect(next.stories[0]?.text).not.toContain("Customers");
        expect(next.stories[1]).toMatchObject({ id: "st2", roleName: "Customer" });
        expect(next.stories[1]?.text).toMatch(/^Customers browse the cakes/);
        expect(derive(next).findings.some((candidate) => candidate.id.startsWith("split:"))).toBe(
            false,
        );
        expect(product.stories).toHaveLength(1);
    });
});
