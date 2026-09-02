import { describe, expect, it, vi } from "vitest";

// Mock server-only — it throws when imported outside a React Server Component context
vi.mock("server-only", () => ({}));

const { highlightCode, HIGHLIGHTABLE_LANGUAGES } = await import("./highlight-code");

describe("highlightCode", () => {
    it("returns highlighted HTML for a supported language", async () => {
        const html = await highlightCode("const x = 1;", "typescript");

        expect(html).toContain("<pre");
        expect(html).toContain("<code");
    });

    it("falls back to 'text' for unknown or missing languages", async () => {
        const unknown = await highlightCode("SELECT * FROM users", "not-a-language");
        const missing = await highlightCode("hello world");

        expect(unknown).toContain("<pre");
        expect(unknown).not.toBe("");
        expect(missing).toContain("<pre");
        expect(missing).not.toBe("");
    });

    it("escapes HTML in code input to prevent XSS", async () => {
        const html = await highlightCode('<script>alert("xss")</script>', "typescript");

        expect(html).not.toContain("<script>");
        expect(html).not.toContain("</script>");
        // Shiki escapes < — accept any standard HTML entity form
        expect(html).toMatch(/&lt;|&#60;|&#x3[Cc];/);
    });
});

describe("HIGHLIGHTABLE_LANGUAGES", () => {
    it("exposes a supported-language allowlist", () => {
        expect(HIGHLIGHTABLE_LANGUAGES.has("typescript")).toBe(true);
        const languages = HIGHLIGHTABLE_LANGUAGES as ReadonlySet<string>;
        expect(languages.has("groq")).toBe(false);
        expect(languages.has("text")).toBe(false);
    });
});
