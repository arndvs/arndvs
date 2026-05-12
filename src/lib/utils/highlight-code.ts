import "server-only";
import { type BundledLanguage, codeToHtml, createCssVariablesTheme } from "shiki";

export const HIGHLIGHTABLE_LANGUAGES = new Set<string>([
    "typescript",
    "javascript",
    "tsx",
    "html",
    "css",
    "json",
    "bash",
    "markdown",
    "yaml",
    "graphql",
    "sql",
    "python",
]);

/** Sanity schema languages that aren't Shiki-highlightable — render as plain text. */
export const PLAIN_TEXT_LANGUAGES = new Set<string>(["text", "groq"]);

const cssVarsTheme = createCssVariablesTheme({
    name: "css-variables",
    variablePrefix: "--shiki-",
    variableDefaults: {},
});

export async function highlightCode(code: string, language?: string): Promise<string> {
    const lang =
        language && HIGHLIGHTABLE_LANGUAGES.has(language) ? (language as BundledLanguage) : "text";

    const html = await codeToHtml(code, {
        lang,
        theme: cssVarsTheme,
    });

    return html;
}
