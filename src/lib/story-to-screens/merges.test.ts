import { describe, expect, it } from "vitest";

import { derive } from "./engine";
import type { Product } from "./engine";
import { fromPreset } from "./presets";
import { loadProduct, saveProduct } from "./storage";
import { decodeState, encodeState, readChoices } from "./url-state";

const merged = (word: string, target: string): Product => {
    const product = fromPreset("tester");
    product.choices.merges[word] = target;

    return product;
};

const screenIds = (product: Product) =>
    derive(product)
        .screens.map((screen) => screen.id)
        .sort();

const relationshipIds = (product: Product) =>
    derive(product)
        .relationships.map((rel) => rel.id)
        .sort();

describe("merges", () => {
    it("removes the screen for the merged word", () => {
        expect(screenIds(fromPreset("tester"))).toContain("view-requirement");
        expect(screenIds(merged("requirement", "study"))).not.toContain("view-requirement");
    });

    it("moves the merged word's relationships to the thing it joined", () => {
        expect(relationshipIds(fromPreset("tester"))).toContain("tester>requirement");
        expect(relationshipIds(merged("requirement", "study"))).not.toContain("tester>requirement");
        expect(relationshipIds(merged("requirement", "study"))).toContain("tester>study");
    });

    it("drops the merged word from the entities", () => {
        const entities = derive(merged("requirement", "study")).entities.map((entity) => entity.id);

        expect(entities).not.toContain("requirement");
        expect(entities).toContain("study");
    });

    it("exposes the merges in force", () => {
        expect(derive(merged("requirement", "study")).merges).toEqual({ requirement: "study" });
    });

    it("restores the golden output when the merge is removed", () => {
        const product = merged("requirement", "study");
        delete product.choices.merges.requirement;

        expect(screenIds(product)).toEqual(screenIds(fromPreset("tester")));
        expect(relationshipIds(product)).toEqual(relationshipIds(fromPreset("tester")));
    });

    it("leaves the presets unmerged", () => {
        expect(derive(fromPreset("tester")).merges).toEqual({});
    });
});

describe("merges in a share link", () => {
    it("survives a round trip", async () => {
        const decoded = await decodeState(await encodeState(merged("requirement", "study")));

        expect(decoded.status).toBe("ok");
        if (decoded.status !== "ok") return;
        expect(decoded.product.choices.merges).toEqual({ requirement: "study" });
    });

    it("keeps the merged screen out after a round trip", async () => {
        const decoded = await decodeState(await encodeState(merged("requirement", "study")));

        expect(decoded.status).toBe("ok");
        if (decoded.status !== "ok") return;
        expect(screenIds(decoded.product)).not.toContain("view-requirement");
    });

    it("leaves merges out of a link when there are none", async () => {
        const params = await encodeState(fromPreset("tester"));

        expect(params.get("c")).toBeNull();
    });
});

describe("merges in saved work", () => {
    it("survives a save and load", () => {
        const store = new Map<string, string>();
        Object.defineProperty(globalThis, "window", {
            configurable: true,
            value: {
                localStorage: {
                    getItem: (key: string) => store.get(key) ?? null,
                    setItem: (key: string, value: string) => store.set(key, value),
                    removeItem: (key: string) => store.delete(key),
                },
            },
        });

        expect(saveProduct(merged("requirement", "study"))).toEqual({ ok: true });
        const saved = loadProduct();
        expect(saved.status).toBe("ok");
        if (saved.status !== "ok") return;
        expect(saved.product.choices.merges).toEqual({ requirement: "study" });
        expect(screenIds(saved.product)).not.toContain("view-requirement");

        Reflect.deleteProperty(globalThis, "window");
    });
});

describe("readMerges", () => {
    const read = (value: unknown) => readChoices({ merges: value }).merges;

    it("sanitizes merges from a shared link against loops, limits and types", () => {
        expect(read({ requirement: "study" })).toEqual({ requirement: "study" });

        // A merge onto itself drops.
        expect(read({ study: "study" })).toEqual({});
        // Two- and three-step cycles break: the cycle member is dropped.
        expect(read({ a: "b", b: "a" })).toEqual({ a: "b" });
        expect(read({ a: "b", b: "c", c: "a" })).toEqual({ a: "b", b: "c" });
        // A chain that does not loop is kept whole.
        expect(read({ a: "b", b: "c" })).toEqual({ a: "b", b: "c" });

        // Over-long keys and targets are dropped or truncated.
        expect(read({ ["x".repeat(61)]: "study" })).toEqual({});
        expect(read({ requirement: "y".repeat(61) })).toEqual({
            requirement: "y".repeat(60),
        });

        // Entry count is capped.
        const many = Object.fromEntries(
            Array.from({ length: 60 }, (_, index) => [`word${index}`, "study"]),
        );
        expect(Object.keys(read(many))).toHaveLength(50);

        // Anything that is not a map is ignored.
        expect(read("requirement")).toEqual({});
        expect(read(null)).toEqual({});
        expect(read([1, 2, 3])).toEqual({});
    });
});
