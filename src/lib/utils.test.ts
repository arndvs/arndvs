import { describe, expect, it } from "vitest";

import { estimateReadingTime, formatDate } from "./utils";

describe("estimateReadingTime", () => {
    it("returns '1 min read' for zero characters", () => {
        expect(estimateReadingTime(0)).toBe("1 min read");
    });

    it("returns '1 min read' for short content", () => {
        expect(estimateReadingTime(500)).toBe("1 min read");
    });

    it("calculates reading time for typical content", () => {
        // 5000 chars ≈ 1000 words, at 200 wpm = 5 min
        expect(estimateReadingTime(5000)).toBe("5 min read");
    });

    it("rounds up to next minute", () => {
        // 5100 chars ≈ 1020 words, at 200 wpm = 5.1 → 6 min
        expect(estimateReadingTime(5100)).toBe("6 min read");
    });

    it("respects custom wordsPerMinute", () => {
        // 5000 chars ≈ 1000 words, at 100 wpm = 10 min
        expect(estimateReadingTime(5000, 100)).toBe("10 min read");
    });
});

describe("formatDate", () => {
    it("formats with long month by default", () => {
        expect(formatDate("2025-03-15")).toMatch(/March 15, 2025/);
    });

    it("formats with short month when style is 'short'", () => {
        expect(formatDate("2025-03-15", "short")).toMatch(/Mar 15, 2025/);
    });
});
