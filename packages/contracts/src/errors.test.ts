import { describe, expect, it } from "vitest";

import { ERROR_CODES, errorCodeSchema, toReadableMessage } from "./errors";

describe("error code schema", () => {
    it("accepts only supported error codes", () => {
        expect(errorCodeSchema.parse("SEND_FAILED")).toBe("SEND_FAILED");
        expect(errorCodeSchema.safeParse("STRIPE_CARD_DECLINED").success).toBe(false);
    });
});

describe("toReadableMessage", () => {
    it("returns a default for codes without context", () => {
        expect(toReadableMessage("UNKNOWN")).toMatch(/unexpected/i);
        expect(toReadableMessage("APPROVAL_INVALIDATED")).toMatch(/edited after approval/i);
    });

    it("includes the reason for SEND_FAILED", () => {
        expect(toReadableMessage("SEND_FAILED", { reason: "rate limited" })).toMatch(
            /rate limited/,
        );
    });

    it("includes the variable for CONFIG_ERROR", () => {
        expect(toReadableMessage("CONFIG_ERROR", { variable: "OPENAI_API_KEY" })).toMatch(
            /OPENAI_API_KEY/,
        );
    });

    it("covers every supported code", () => {
        for (const code of ERROR_CODES) {
            expect(toReadableMessage(code)).toMatch(/[a-z]/i);
        }
    });
});
