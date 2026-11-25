// ---------------------------------------------------------------------------
// Wording helpers and verb sets. Kept apart from `engine` so the rule modules
// can use them without importing the engine that runs them.
// ---------------------------------------------------------------------------

export const CREATE_VERBS = new Set(
    "create post write add enter type submit upload schedule record publish".split(" "),
);
export const MANY_VERBS = new Set(
    "browse search find review compare contact filter select accept reject check rank sort".split(
        " ",
    ),
);

export const titleCase = (s: string): string => s.replace(/\b\w/g, (c) => c.toUpperCase());

export type Sentence = { start: number; end: number; text: string };

/**
 * Sentences with their character offsets. `end` is the index of the closing
 * punctuation. A trailing empty sentence is kept when the text ends in
 * punctuation, so offsets line up with the marks the engine records.
 */
export const sentences = (text: string): Sentence[] => {
    const ends = [...text.matchAll(/[.!?](\s|$)/g)].map((match) => match.index);
    const starts = [0, ...ends.map((end) => end + 1)];

    return starts.map((start, index) => ({
        start,
        end: ends[index] ?? text.length - 1,
        text: text.slice(start, (ends[index] ?? text.length - 1) + 1).trim(),
    }));
};
export const capitalize = (s: string): string => (s ? s[0]!.toUpperCase() + s.slice(1) : s);
export const withArticle = (s: string): string => `${/^[aeiou]/i.test(s) ? "an" : "a"} ${s}`;
export const pluralize = (s: string): string =>
    s.endsWith("y") && !/[aeiou]y$/.test(s)
        ? `${s.slice(0, -1)}ies`
        : s.endsWith("s")
          ? s
          : `${s}s`;
