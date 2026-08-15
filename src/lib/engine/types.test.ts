import { describe, expect, it } from "vitest";

import { assertValidTransition } from "./types";

describe("assertValidTransition", () => {
    it("accepts a valid transition", () => {
        expect(() => assertValidTransition("draft", "editing")).not.toThrow();
    });

    it("throws on an invalid transition", () => {
        expect(() => assertValidTransition("draft", "posted")).toThrow(
            /Invalid social draft transition/,
        );
    });

    it("throws on a terminal-state transition", () => {
        expect(() => assertValidTransition("posted", "draft")).toThrow();
        expect(() => assertValidTransition("skipped", "ready")).toThrow();
    });
});
