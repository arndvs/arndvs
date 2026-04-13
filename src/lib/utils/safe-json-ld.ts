/**
 * Safely stringify JSON-LD to prevent XSS via </script> injection.
 * Escapes sequences that could break out of a <script> tag.
 */
export function safeJsonLdStringify(data: Record<string, unknown>): string {
    return JSON.stringify(data)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026");
}
