import type { Screen, ScreenType } from "./engine";
import { inProduct } from "./engine";
import { singular } from "./suggest";

/** Words that say nothing about which screen a guess means. */
const DROPPED = new Set(["page", "screen", "view", "detail", "details", "list", "form"]);

/** Words that name a create screen. */
const CREATE = new Set(["new", "create", "add"]);

/** Words that name an edit screen. */
const EDIT = new Set(["edit", "update", "manage"]);

/** Which type to prefer when a guess names an entity but not a type. */
const PREFERENCE: Record<"plural" | "singular", ScreenType[]> = {
    plural: ["list", "view", "create", "edit"],
    singular: ["view", "list", "create", "edit"],
};

const words = (text: string): string[] =>
    text
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(Boolean);

/** A guess reduced to the type it names and the entity it's about. */
type Normalized = { type: ScreenType | null; entity: string; plural: boolean };

const normalize = (text: string): Normalized => {
    let type: ScreenType | null = null;
    const kept: string[] = [];
    for (const word of words(text)) {
        if (CREATE.has(word)) {
            type = "create";
            continue;
        }
        if (EDIT.has(word)) {
            type = "edit";
            continue;
        }
        if (DROPPED.has(word)) continue;
        kept.push(word);
    }
    const last = kept.at(-1);
    const plural = Boolean(last) && singular(last!) !== last;
    const entity = kept.map(singular).join(" ");

    return { type, entity, plural };
};

/** The words in a screen's name, reduced the same way a guess is. */
const nameWords = (screen: Screen): string[] =>
    words(screen.name)
        .filter((word) => !DROPPED.has(word))
        .map(singular);

/** The screen a guess means, or `null` when nothing in the list is close. */
const pick = (guess: Normalized, screens: Screen[]): Screen | null => {
    const byEntity = guess.entity
        ? screens.filter((screen) => screen.entity && singular(screen.entity) === guess.entity)
        : [];
    const typed = guess.type ? byEntity.filter((screen) => screen.type === guess.type) : [];
    const candidates = typed.length ? typed : byEntity;
    if (candidates.length) {
        const order = PREFERENCE[guess.plural ? "plural" : "singular"];
        const ranked = [...candidates].sort(
            (a, b) => order.indexOf(a.type) - order.indexOf(b.type),
        );

        return ranked[0] ?? null;
    }

    // Screens with no entity of their own, such as "Sign up" and "Landing page",
    // are matched on their name instead.
    const wanted = words(guess.entity).map(singular).join(" ");
    if (!wanted) return null;

    return (
        screens.find((screen) => {
            if (screen.entity) return false;
            const named = nameWords(screen).join(" ");

            return named === wanted || named.startsWith(wanted);
        }) ?? null
    );
};

export type GuessMatch = {
    /** Each guess that landed, with the screen it named. */
    matched: [string, string][];
    /** Screens in the product the visitor never named. */
    missedByYou: string[];
    /** Guesses nothing in the list answers. */
    onlyYours: string[];
};

/**
 * Compares what the visitor would have built against what the rules built.
 * A guess the visitor linked to a screen counts as matched, even when the words differ.
 */
export const matchGuess = (
    guess: string[],
    screens: Screen[],
    links: Record<string, string> = {},
): GuessMatch => {
    const product = screens.filter(inProduct);
    const matched: [string, string][] = [];
    const onlyYours: string[] = [];
    const claimed = new Set<string>();

    for (const entry of guess) {
        const linked = links[entry];
        const screen = linked
            ? product.find((candidate) => candidate.id === linked)
            : pick(normalize(entry), product);
        if (screen) {
            matched.push([entry, screen.id]);
            claimed.add(screen.id);
            continue;
        }
        onlyYours.push(entry);
    }

    return {
        matched,
        missedByYou: product.filter((screen) => !claimed.has(screen.id)).map((screen) => screen.id),
        onlyYours,
    };
};
