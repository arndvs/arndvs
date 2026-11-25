import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { Product } from "./engine";
import { STORAGE_KEY, clearProduct, loadProduct, saveProduct } from "./storage";

const yours = (text: string): Product => ({
    id: "yours",
    name: "Your product",
    origin: "blank",
    aliases: {},
    stories: [{ id: "st1", roleName: "Person", actor: "", text }],
    choices: {
        corrections: {},
        cardinality: {},
        releases: {},
        judgments: {},
        merges: {},
        guess: [],
        guessLinks: {},
        manualScreens: [],
        dismissed: [],
        rulesOff: [],
    },
});

/** A Map standing in for localStorage, so the tests don't need a browser. */
const stubStorage = (): Map<string, string> => {
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

    return store;
};

describe("storage", () => {
    beforeEach(() => {
        stubStorage();
    });

    afterEach(() => {
        Reflect.deleteProperty(globalThis, "window");
    });

    it("round-trips a product", () => {
        const product = yours("Sam checks the constructor every morning.");
        product.choices.releases["landing"] = "later";

        expect(saveProduct(product)).toEqual({ ok: true });
        expect(loadProduct()).toEqual({ status: "ok", product });
    });

    it("reports no saved product when there's nothing stored", () => {
        expect(loadProduct()).toEqual({ status: "none" });
    });

    it("reports corrupt JSON instead of throwing", () => {
        window.localStorage.setItem(STORAGE_KEY, "{not json");

        expect(loadProduct()).toEqual({ status: "invalid" });
    });

    it("reports a saved product with no stories as invalid", () => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ n: "Untitled", s: [] }));

        expect(loadProduct()).toEqual({ status: "invalid" });
    });

    it("returns the reason when saving throws", () => {
        const store = stubStorage();
        const denied = Object.assign(new Error("denied"), { name: "SecurityError" });
        window.localStorage.setItem = () => {
            throw denied;
        };
        void store;

        expect(saveProduct(yours("Anything."))).toEqual({
            ok: false,
            reason: "SecurityError",
        });
    });

    it("clears the saved product", () => {
        saveProduct(yours("Anything."));
        clearProduct();

        expect(loadProduct()).toEqual({ status: "none" });
    });
});
