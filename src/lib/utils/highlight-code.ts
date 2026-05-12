import "server-only";
import { type BundledLanguage, codeToHtml, createCssVariablesTheme } from "shiki";

const HIGHLIGHTABLE_LANGS = [
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
] as const satisfies readonly BundledLanguage[];

export const HIGHLIGHTABLE_LANGUAGES = new Set<string>(HIGHLIGHTABLE_LANGS);

function isHighlightable(lang: string): lang is BundledLanguage {
    return HIGHLIGHTABLE_LANGUAGES.has(lang);
}

const cssVarsTheme = createCssVariablesTheme({
    name: "css-variables",
    variablePrefix: "--shiki-",
    variableDefaults: {},
});

export async function highlightCode(code: string, language?: string): Promise<string> {
    const lang = language && isHighlightable(language) ? language : "text";

    const html = await codeToHtml(code, {
        lang,
        theme: cssVarsTheme,
    });

    return html;
}
