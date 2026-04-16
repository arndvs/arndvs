import { describe, expect, it } from "vitest";

import { safeJsonLdStringify } from "./safe-json-ld";

describe("safeJsonLdStringify", () => {
    it("escapes </script> sequences", () => {
        const result = safeJsonLdStringify({ text: "</script><script>alert(1)</script>" });

        expect(result).not.toContain("</script>");
        expect(result).toContain("\\u003c/script\\u003e");
    });

    it("escapes angle brackets", () => {
        const result = safeJsonLdStringify({ html: "<div>test</div>" });

        expect(result).not.toContain("<");
        expect(result).not.toContain(">");
    });

    it("escapes ampersands", () => {
        const result = safeJsonLdStringify({ text: "a & b" });

        expect(result).not.toContain("&");
        expect(result).toContain("\\u0026");
    });

    it("handles nested objects", () => {
        const result = safeJsonLdStringify({
            "@context": "https://schema.org",
            name: "Test <b>bold</b>",
            nested: { value: "a & b" },
        });

        expect(result).not.toContain("<");
        expect(result).not.toContain("&");
        expect(JSON.parse(result.replace(/\\u003c/g, "<").replace(/\\u003e/g, ">").replace(/\\u0026/g, "&"))).toEqual({
            "@context": "https://schema.org",
            name: "Test <b>bold</b>",
            nested: { value: "a & b" },
        });
    });

    it("handles empty object", () => {
        expect(safeJsonLdStringify({})).toBe("{}");
    });
});
