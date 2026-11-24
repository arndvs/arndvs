import { describe, expect, it } from "vitest";

import type { Product } from "./engine";
import { fromPreset } from "./presets";
import { LONG_LINK, MAX_STORIES, MAX_STORY_LENGTH, decodeState, encodeState } from "./url-state";

const yours = (stories: number, length: number): Product => ({
    id: "yours",
    name: "Your product",
    origin: "blank",
    aliases: {},
    // Varied text, so compression isn't flattered by repeats.
    stories: Array.from({ length: stories }, (_, i) => ({
        id: `st${i + 1}`,
        roleName: "Person",
        actor: "",
        text: Array.from({ length: Math.ceil(length / 8) }, (_, j) =>
            ((i * 7919 + j * 104729) % 1e6).toString(36),
        )
            .join(" ")
            .slice(0, length),
    })),
    choices: { corrections: {}, cardinality: {}, releases: {}, manualScreens: [], dismissed: [] },
});

describe("encodeState and decodeState", () => {
    it("saves an untouched example as just its id", async () => {
        const params = await encodeState(fromPreset("clinic"));

        expect(params.toString()).toBe("ex=clinic");
        expect(await decodeState(params)).toEqual(fromPreset("clinic"));
    });

    it("round-trips changes to an example", async () => {
        const product = fromPreset("tester");
        product.choices.cardinality["company>applicant"] = "one";
        product.choices.dismissed.push("defaults");
        product.choices.manualScreens.push({ id: "manual-1", name: "Billing" });

        expect(await decodeState(await encodeState(product))).toEqual(product);
    });

    it("round-trips a product someone wrote, stories included", async () => {
        const product = yours(2, 300);
        product.choices.corrections["st1:0"] = "verb";

        const decoded = await decodeState(await encodeState(product));

        expect(decoded?.stories).toEqual(product.stories);
        expect(decoded?.choices).toEqual(product.choices);
    });

    it("keeps typical links short and the largest under 4,000 characters", async () => {
        const length = async (p: Product) => (await encodeState(p)).toString().length;

        expect(await length(fromPreset("tester"))).toBeLessThan(50);
        expect(await length(yours(1, 400))).toBeLessThan(LONG_LINK);
        expect(await length(yours(MAX_STORIES, MAX_STORY_LENGTH))).toBeLessThan(4_000);
    });

    it("ignores links it can't read, and caps what it accepts", async () => {
        expect(await decodeState(new URLSearchParams("ex=nope"))).toBeNull();
        expect(await decodeState(new URLSearchParams("p=not-real"))).toBeNull();
        expect(
            await decodeState(new URLSearchParams('ex=tester&k={"releases":{"landing":"soon"}}')),
        ).toEqual(fromPreset("tester"));

        const big = yours(MAX_STORIES + 2, MAX_STORY_LENGTH);
        big.stories[0]!.text += "x".repeat(500);
        const decoded = await decodeState(await encodeState(big));

        expect(decoded?.stories).toHaveLength(MAX_STORIES);
        expect(decoded?.stories[0]?.text).toHaveLength(MAX_STORY_LENGTH);
    });
});
