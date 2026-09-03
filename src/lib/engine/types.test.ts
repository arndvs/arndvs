import { describe, expect, it } from "vitest";

import { assertValidTransition } from "./types";

describe("assertValidTransition", () => {
    it("accepts valid transitions and rejects gated or terminal moves", () => {
        expect(() => assertValidTransition("draft", "editing")).not.toThrow();
        expect(() => assertValidTransition("draft", "posted")).toThrow(
            /Invalid social draft transition/,
        );
        expect(() => assertValidTransition("posted", "draft")).toThrow();
        expect(() => assertValidTransition("skipped", "ready")).toThrow();
    });
});
