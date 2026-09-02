import { describe, expect, it } from "vitest";

import { safeJsonLdStringify } from "./safe-json-ld";

describe("safeJsonLdStringify", () => {
    it("escapes characters that could break out of a <script> tag", () => {
        const result = safeJsonLdStringify({
            text: "</script><script>alert(1)</script>",
            html: "<div>a & b</div>",
        });

        expect(result).not.toContain("</script>");
        expect(result).toContain("\\u003c/script\\u003e");
        expect(result).not.toContain("<");
        expect(result).not.toContain("&");
    });

    it("round-trips escaped output back to the original JSON", () => {
        const input = {
            "@context": "https://schema.org",
            name: "Test <b>bold</b>",
            nested: { value: "a & b" },
        };
        const result = safeJsonLdStringify(input);

        expect(
            JSON.parse(
                result
                    .replace(/\\u003c/g, "<")
                    .replace(/\\u003e/g, ">")
                    .replace(/\\u0026/g, "&"),
            ),
        ).toEqual(input);
    });

    it("handles an empty object", () => {
        expect(safeJsonLdStringify({})).toBe("{}");
    });
});
