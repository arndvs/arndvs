import { describe, expect, it } from "vitest";

import type { Product } from "./engine";
import { fromPreset } from "./presets";
import {
    LONG_LINK,
    MAX_DECOMPRESSED_BYTES,
    MAX_STORIES,
    MAX_STORY_LENGTH,
    compress,
    decodeState,
    encodeState,
} from "./url-state";

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
    choices: {
        corrections: {},
        cardinality: {},
        releases: {},
        manualScreens: [],
        dismissed: [],
        rulesOff: [],
    },
});

/** Just the product, for the tests that only care whether a link reads back. */
const read = async (params: URLSearchParams): Promise<Product | null> => {
    const decoded = await decodeState(params);

    return decoded.status === "ok" ? decoded.product : null;
};

describe("encodeState and decodeState", () => {
    it("saves an untouched example as just its id", async () => {
        const params = await encodeState(fromPreset("clinic"));

        expect(params.toString()).toBe("ex=clinic");
        expect(await read(params)).toEqual(fromPreset("clinic"));
    });

    it("round-trips changes to an example", async () => {
        const product = fromPreset("tester");
        product.choices.cardinality["company>applicant"] = "one";
        product.choices.dismissed.push("defaults");
        product.choices.manualScreens.push({ id: "manual-1", name: "Billing" });

        expect(await read(await encodeState(product))).toEqual(product);
    });

    it("round-trips rules turned off, and drops the ones that can't be", async () => {
        const product = fromPreset("tester");
        product.choices.rulesOff = ["walk", "crud"];

        expect((await read(await encodeState(product)))?.choices.rulesOff).toEqual([
            "walk",
            "crud",
        ]);

        // A hand-edited link can't turn off the rule the screens come from.
        const forged = await decodeState(
            new URLSearchParams('ex=tester&k={"rulesOff":["stories","walk"]}'),
        );
        expect(forged.status === "ok" && forged.product.choices.rulesOff).toEqual(["walk"]);
    });

    it("round-trips a product someone wrote, stories included", async () => {
        const product = yours(2, 300);
        product.choices.corrections["st1:0"] = "verb";

        const decoded = await read(await encodeState(product));

        expect(decoded?.stories).toEqual(product.stories);
        expect(decoded?.choices).toEqual(product.choices);
    });

    it("keeps typical links short and the largest under 4,000 characters", async () => {
        const length = async (p: Product) => (await encodeState(p)).toString().length;

        expect(await length(fromPreset("tester"))).toBeLessThan(50);
        expect(await length(yours(1, 400))).toBeLessThan(LONG_LINK);
        expect(await length(yours(MAX_STORIES, MAX_STORY_LENGTH))).toBeLessThan(4_000);
    });

    it("reports no state when the URL carries none", async () => {
        expect(await decodeState(new URLSearchParams(""))).toEqual({ status: "none" });
    });

    it("says why a link failed instead of failing silently", async () => {
        expect(await decodeState(new URLSearchParams("ex=nope"))).toEqual({
            status: "invalid",
            reason: "unknown-example",
        });
        expect(await decodeState(new URLSearchParams("p=not-real"))).toEqual({
            status: "invalid",
            reason: "unreadable",
        });
        expect(await decodeState(new URLSearchParams("ex=tester&k={not json"))).toEqual({
            status: "invalid",
            reason: "unreadable",
        });
        expect(
            await decodeState(new URLSearchParams('ex=tester&k={"releases":{"landing":"soon"}}')),
        ).toMatchObject({ status: "ok" });
        expect(await decodeState(new URLSearchParams("p=" + "a".repeat(20_001)))).toEqual({
            status: "invalid",
            reason: "too-large",
        });

        const empty = JSON.stringify({ n: "Untitled", o: "copy", s: [], a: {}, c: {} });
        expect(await decodeState(new URLSearchParams(`p=${await compress(empty)}`))).toEqual({
            status: "invalid",
            reason: "empty",
        });
    });

    it("caps stories when a link carries too many", async () => {
        const big = yours(MAX_STORIES + 2, MAX_STORY_LENGTH);
        big.stories[0]!.text += "x".repeat(500);
        const decoded = await read(await encodeState(big));

        expect(decoded?.stories).toHaveLength(MAX_STORIES);
        expect(decoded?.stories[0]?.text).toHaveLength(MAX_STORY_LENGTH);
    });

    it("caps aliases from a link at 50 entries and 60 characters each way", async () => {
        const product = yours(1, 120);
        product.aliases = Object.fromEntries(
            Array.from({ length: 60 }, (_, i) => [`k${i}`.repeat(20), `v${i}`.repeat(20)]),
        );

        const decoded = await read(await encodeState(product));
        const entries = Object.entries(decoded?.aliases ?? {});

        expect(entries).toHaveLength(50);
        for (const [key, value] of entries) {
            expect(key.length).toBeLessThanOrEqual(60);
            expect(value.length).toBeLessThanOrEqual(60);
        }
    });
});

describe("decompress", () => {
    it("stops a payload that expands past the cap", async () => {
        const bomb = await compress("x".repeat(MAX_DECOMPRESSED_BYTES + 1));

        expect(await decodeState(new URLSearchParams(`p=${bomb}`))).toEqual({
            status: "invalid",
            reason: "too-large",
        });
    });
});
