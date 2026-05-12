import { describe, expect, it, vi } from "vitest";

// Mock server-only — it throws when imported outside a React Server Component context
vi.mock("server-only", () => ({}));

const { highlightCode, HIGHLIGHTABLE_LANGUAGES } = await import("./highlight-code");

describe("highlightCode", () => {
    it("returns HTML containing <pre> and <code> for a supported language", async () => {
        const html = await highlightCode("const x = 1;", "typescript");

        expect(html).toContain("<pre");
        expect(html).toContain("<code");
    });

    it("falls back to 'text' for an unknown language without throwing", async () => {
        const html = await highlightCode("SELECT * FROM users", "groq");

        expect(html).toContain("<pre");
        expect(html).toBeTruthy();
    });

    it("falls back to 'text' when no language is provided", async () => {
        const html = await highlightCode("hello world");

        expect(html).toContain("<pre");
        expect(html).toBeTruthy();
    });

    it("returns non-empty HTML", async () => {
        const html = await highlightCode("fn main() {}", "python");

        expect(html.length).toBeGreaterThan(0);
    });

    it("escapes HTML entities in code input to prevent XSS", async () => {
        const malicious = '<script>alert("xss")</script>';
        const html = await highlightCode(malicious, "typescript");

        expect(html).not.toContain("<script>");
        expect(html).not.toContain("</script>");
        // Shiki escapes < — accept any standard HTML entity form
        expect(html).toMatch(/&lt;|&#60;|&#x3[Cc];/);
    });
});

describe("HIGHLIGHTABLE_LANGUAGES", () => {
    it("contains expected languages", () => {
        expect(HIGHLIGHTABLE_LANGUAGES.has("typescript")).toBe(true);
        expect(HIGHLIGHTABLE_LANGUAGES.has("javascript")).toBe(true);
        expect(HIGHLIGHTABLE_LANGUAGES.has("tsx")).toBe(true);
    });

    it("does not contain non-highlightable languages", () => {
        expect((HIGHLIGHTABLE_LANGUAGES as ReadonlySet<string>).has("groq")).toBe(false);
        expect((HIGHLIGHTABLE_LANGUAGES as ReadonlySet<string>).has("text")).toBe(false);
    });
});
