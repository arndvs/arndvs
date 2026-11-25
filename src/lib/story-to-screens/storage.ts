import type { Product } from "./engine";
import { packProduct, readProduct } from "./url-state";

/** One key, one payload. Bump the suffix when the shape of `Product` changes. */
export const STORAGE_KEY = "story-to-screens:v1";

/**
 * A saved product never exceeds this, which is also the read cap for a share link.
 * The payload is the same JSON, minus the compression.
 */
const MAX_SAVED_CHARS = 65_536;

export type Saved = { status: "none" } | { status: "ok"; product: Product } | { status: "invalid" };

export type SaveResult = { ok: true } | { ok: false; reason: string };

/** The visitor's own product, saved in this browser only. Nothing leaves it. */
export const saveProduct = (product: Product): SaveResult => {
    try {
        const payload = JSON.stringify(packProduct(product));
        if (payload.length > MAX_SAVED_CHARS) {
            return { ok: false, reason: "too much to save" };
        }
        window.localStorage.setItem(STORAGE_KEY, payload);

        return { ok: true };
    } catch (error) {
        // Safari in private mode, and a full quota, both throw here.
        return { ok: false, reason: error instanceof Error ? error.name : "storage failed" };
    }
};

export const clearProduct = (): void => {
    try {
        window.localStorage.removeItem(STORAGE_KEY);
    } catch {
        // Nothing to do: the page has already moved on.
    }
};

export const loadProduct = (): Saved => {
    let stored: string | null;
    try {
        stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
        return { status: "invalid" };
    }
    if (stored === null) return { status: "none" };

    let raw: unknown;
    try {
        raw = JSON.parse(stored);
    } catch {
        return { status: "invalid" };
    }

    const read = readProduct(raw);

    return read.status === "ok" ? { status: "ok", product: read.product } : { status: "invalid" };
};
