import type { FindingSource } from "../engine";
import { sentences } from "../wording";
import type { RuleModule } from "./context";

/** Phrases that describe the solution rather than what people do today. */
const SOLUTION_WORDS = [
    "the app",
    "our app",
    "the dashboard",
    "the platform",
    "the system",
    "button",
    "click",
    "screen",
];

/** Words that name a pain. The spec's list, plus the manual work that hurts in practice. */
const FRICTION_WORDS = [
    "slow",
    "late",
    "lost",
    "forget",
    "can't",
    "hard",
    "wait",
    "guilty",
    "frustrated",
    "worried",
    "exhausted",
    "busy",
    "chase",
    "again",
    "no idea",
    "too long",
    "half",
    "on paper",
    "by hand",
    "manually",
    "spreadsheet",
    "types",
    "no time",
];

/** A person acting: a name, a pronoun, or the role the story is about. */
const PERSON = /\b(he|she|they|him|her|them|his|hers|their)\b/i;
const CAPITALIZED = /\b[A-Z][a-z]{2,}\b/g;

/**
 * A name is a capitalized word that isn't just the start of a sentence. "The"
 * and "Orders" open sentences; "Lena" opens one and appears again, so it counts.
 */
const hasName = (text: string): boolean => {
    const starts = new Set(sentences(text).map((sentence) => sentence.text.split(/\s+/)[0]));
    const seen = new Map<string, number>();
    for (const [word] of text.matchAll(CAPITALIZED)) {
        seen.set(word, (seen.get(word) ?? 0) + 1);
    }

    return [...seen].some(([word, count]) => count > 1 || !starts.has(word));
};

/** A phrase as a word-boundary pattern, so "late" doesn't match "later". */
const phrase = (text: string): RegExp =>
    new RegExp(`\\b${text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");

/** A phrase, plus its plural when it's a single word that takes one. */
const forms = (text: string): string[] =>
    text.includes(" ") || text.endsWith("s") ? [text] : [text, `${text}s`, `${text}es`];

const mentions = (text: string, words: readonly string[]): boolean =>
    words.some((word) => forms(word).some((form) => phrase(form).test(text)));

const wordCount = (text: string): number => text.trim().split(/\s+/).filter(Boolean).length;

/**
 * The story check. It runs first and produces findings only: it never adds a
 * screen. A story that describes the solution, has no person, is too thin, or
 * names no pain is a story that won't produce good screens.
 */
export const storyCheck: RuleModule = {
    id: "story-check",
    name: "Story check",
    step: "Step 1 · check the stories",
    stage: "discover",
    explain:
        "Before deriving anything, read each story. A story that describes the solution, has no person, is too thin, or names no pain won't produce good screens.",
    standard: false,
    apply: ({ stories, addFinding, record }) => {
        for (const story of stories) {
            const text = story.text;
            if (!text.trim()) continue;
            const source: FindingSource = { kind: "story", id: story.id };
            const parts = sentences(text);

            for (const sentence of parts) {
                if (!sentence.text) continue;
                const solution = SOLUTION_WORDS.find((word) =>
                    forms(word).some((form) => phrase(form).test(sentence.text)),
                );
                if (!solution) continue;
                addFinding({
                    id: `story-check:solution:${story.id}:${sentence.start}`,
                    ruleId: "story-check",
                    message: `“${sentence.text}” This might describe the solution. Stories say what people do today.`,
                    sources: [source],
                });
            }

            const named =
                PERSON.test(text) ||
                hasName(text) ||
                mentions(
                    text,
                    story.roleName.split(/\s+/).filter((word) => word.length > 2),
                );
            if (!named) {
                addFinding({
                    id: `story-check:person:${story.id}`,
                    ruleId: "story-check",
                    message: "No person in this story. Say who does the work, by name or by role.",
                    sources: [source],
                });
            }

            const words = wordCount(text);
            if (parts.length < 2 || words < 20) {
                addFinding({
                    id: `story-check:thin:${story.id}`,
                    ruleId: "story-check",
                    message: `This story is thin: ${words} ${words === 1 ? "word" : "words"} in ${parts.length} ${parts.length === 1 ? "sentence" : "sentences"}. Add what happens and what gets in the way.`,
                    sources: [source],
                });
            }

            if (!mentions(text, FRICTION_WORDS)) {
                addFinding({
                    id: `story-check:friction:${story.id}`,
                    ruleId: "story-check",
                    message: "Where does it hurt? The pain is what the screens fix.",
                    sources: [source],
                });
            }
        }

        record("story-check", []);
    },
};
