import { describe, expect, it } from "vitest";

import { ERROR_CODES, errorCodeSchema, toReadableMessage } from "./errors";

describe("error code schema", () => {
    it("accepts only supported error codes", () => {
        expect(errorCodeSchema.parse("SEND_FAILED")).toBe("SEND_FAILED");
        expect(errorCodeSchema.safeParse("STRIPE_CARD_DECLINED").success).toBe(false);
    });

    it("exposes the canonical list", () => {
        expect(ERROR_CODES).toContain("SEND_FAILED");
        expect(ERROR_CODES).toContain("APPROVAL_INVALIDATED");
    });
});

describe("toReadableMessage", () => {
    it("returns a default message for unknown codes", () => {
        expect(toReadableMessage("UNKNOWN")).toMatch(/unexpected/i);
    });

    it("includes context for SEND_FAILED", () => {
        expect(toReadableMessage("SEND_FAILED", { reason: "rate limited" })).toMatch(
            /rate limited/,
        );
    });

    it("includes context for CONFIG_ERROR", () => {
        expect(toReadableMessage("CONFIG_ERROR", { variable: "OPENAI_API_KEY" })).toMatch(
            /OPENAI_API_KEY/,
        );
    });

    it("returns a default for APPROVAL_INVALIDATED", () => {
        expect(toReadableMessage("APPROVAL_INVALIDATED")).toMatch(/edited after approval/i);
    });
});
