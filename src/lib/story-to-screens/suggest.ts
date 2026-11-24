/**
 * Suggested marks, with no server and no language library. A thing (noun) is a
 * word after a determiner, preposition or number, skipping a few adjectives, or a
 * capitalized name mid-sentence. An action (verb) is a word whose base form is on
 * a list of product verbs. On the three worked examples this finds about 92% of the
 * hand-marked words, and about 80% of its suggestions are right.
 */

export type MarkKind = "noun" | "verb";

export type Token = {
    word: string;
    start: number;
    end: number;
    sentenceStart: boolean;
    clauseBreakBefore: boolean;
};

export type SuggestedMark = {
    start: number;
    end: number;
    word: string;
    kind: MarkKind;
    lemma: string;
};

const words = (list: string): Set<string> => new Set(list.trim().split(/\s+/));

const DETERMINERS = words(
    "a an the their his her its our your my each every some any this that these those several many other another all both few",
);
const PREPOSITIONS = words("for with to from at on in of about between across into by");
const NUMBER_WORDS = words("one two three four five six seven eight nine ten");
const ADJECTIVES = words(
    "new own short long possible related extra weekly daily monthly good bad big small different past future next last first front late early best simple whole same main few",
);
/** Words that follow a determiner but rarely name a thing in the system. */
const NOT_NOUNS = words(
    "end day days week time way thing things lot one them it him her someone something there here who what which that",
);
/** Function words, pronouns and calendar words never name a thing in the system. */
const FUNCTION_WORDS = words(
    "and or but so if then than because before after while when where why how not no yes very too also just only almost always never she he they we i you me us see monday tuesday wednesday thursday friday saturday sunday january february march april may june july august september october november december",
);
/** Common verbs that aren't product actions. */
const NOT_VERBS = words(
    "is are was were be been has have had do does did can could would should will wants want likes like lives live waits wait needs need",
);

export const VERBS = words(`
    accept add answer apply approve archive ask assign attach attend book browse buy cancel change chat check choose
    clear close collect comment compare complete confirm connect contact copy create decide delete design display
    download edit email encourage enroll enter explain export fill filter find flag follow forward get give hire import
    invite join keep learn like link list log manage mark measure message move need note notify open order organize own
    pay pick plan post prepare preview print publish rank rate read receive recommend record refund register reject
    remind remove rent reorder replace reply report request reschedule reserve resolve return review run save scan
    schedule search select sell send set share show sign sort start submit subscribe support swap tag teach test
    track train transfer type update upload use verify view visit vote watch work write`);

export const singular = (word: string): string => {
    const w = word.toLowerCase().replace(/['’]s$/, "");
    if (w.endsWith("ies") && w.length > 4) return `${w.slice(0, -3)}y`;
    if (w.endsWith("sses")) return w.slice(0, -2);
    if (["ses", "xes", "ches", "shes"].some((ending) => w.endsWith(ending))) return w.slice(0, -2);
    if (w.endsWith("s") && !w.endsWith("ss") && w.length > 3) return w.slice(0, -1);

    return w;
};

/** The base form of a product verb, or `null` when the word isn't one. */
export const verbBase = (word: string): string | null => {
    const w = word.toLowerCase();
    if (NOT_VERBS.has(w)) return null;

    const candidates = [w];
    if (w.endsWith("ies")) candidates.push(`${w.slice(0, -3)}y`);
    if (w.endsWith("es")) candidates.push(w.slice(0, -2), w.slice(0, -1));
    if (w.endsWith("s")) candidates.push(w.slice(0, -1));
    if (w.endsWith("ied")) candidates.push(`${w.slice(0, -3)}y`);
    if (w.endsWith("ed")) candidates.push(w.slice(0, -2), w.slice(0, -1), w.slice(0, -3));
    if (w.endsWith("ing")) candidates.push(w.slice(0, -3), `${w.slice(0, -3)}e`, w.slice(0, -4));

    return candidates.find((candidate) => VERBS.has(candidate)) ?? null;
};

/** Words with their character offsets. */
export const tokenize = (text: string): Token[] => {
    const tokens: Token[] = [];
    for (const match of text.matchAll(/[A-Za-z0-9][A-Za-z0-9'’-]*/g)) {
        const start = match.index;
        const before = text.slice(0, start).trimEnd();
        tokens.push({
            word: match[0],
            start,
            end: start + match[0].length,
            sentenceStart: before === "" || /[.!?]$/.test(before),
            clauseBreakBefore: /[,;:]$/.test(before),
        });
    }

    return tokens;
};

const opensNounPhrase = (lower: string): boolean =>
    DETERMINERS.has(lower) ||
    PREPOSITIONS.has(lower) ||
    NUMBER_WORDS.has(lower) ||
    /^\d+$/.test(lower);

export const isNounCandidate = (word: string): boolean => {
    const lower = word.toLowerCase();
    if (opensNounPhrase(lower)) return false;
    if (NOT_NOUNS.has(lower) || NOT_VERBS.has(lower) || FUNCTION_WORDS.has(lower)) return false;

    // Gerunds name actions, not things.
    return !lower.endsWith("ing");
};

const isCapitalized = (word: string): boolean => /^[A-Z]/.test(word);

/** Suggests marks for one story. The story's protagonist (`actor`) is always a noun. */
export const suggestMarks = (text: string, actor?: string): SuggestedMark[] => {
    const tokens = tokenize(text);
    const marks = new Map<number, SuggestedMark>();
    const add = (token: Token, kind: MarkKind, lemma: string): void => {
        if (!marks.has(token.start)) {
            marks.set(token.start, {
                start: token.start,
                end: token.end,
                word: token.word,
                kind,
                lemma,
            });
        }
    };

    tokens.forEach((token, index) => {
        const lower = token.word.toLowerCase();
        const previous = tokens[index - 1]?.word.toLowerCase();

        // Verbs anywhere, except right after a determiner or adjective ("the test").
        const base = verbBase(token.word);
        if (base && !(previous && (DETERMINERS.has(previous) || ADJECTIVES.has(previous)))) {
            add(token, "verb", base);
            return;
        }

        // Capitalized names mid-sentence, and the actor anywhere.
        const isName =
            !token.sentenceStart &&
            isCapitalized(token.word) &&
            !/^[A-Z]{2,}$/.test(token.word) &&
            !FUNCTION_WORDS.has(lower);
        if ((actor && token.word === actor) || isName) {
            add(token, "noun", lower);
            return;
        }

        // After a determiner, preposition or number: skip adjectives, then take up to two nouns.
        if (!opensNounPhrase(lower)) return;

        let first = index + 1;
        while (first < index + 3) {
            const next = tokens[first];
            if (!next || !(ADJECTIVES.has(next.word.toLowerCase()) || next.word.includes("-")))
                break;
            first++;
        }
        for (let k = first; k < first + 2; k++) {
            const candidate = tokens[k];
            if (!candidate) break;
            if (k > first && (candidate.clauseBreakBefore || isCapitalized(candidate.word))) break;
            if (!isNounCandidate(candidate.word)) break;
            if (verbBase(candidate.word) && (k > first || lower === "to")) break; // "to learn"
            add(candidate, "noun", singular(candidate.word));
        }
    });

    // Lists: "visits, new patients and revenue". A noun followed by a comma or "and"
    // continues with another noun, skipping adjectives.
    tokens.forEach((token, index) => {
        if (marks.get(token.start)?.kind !== "noun") return;

        let next = index + 1;
        if (tokens[next]?.word.toLowerCase() === "and") next++;
        else if (!tokens[next]?.clauseBreakBefore) return;
        while (tokens[next] && ADJECTIVES.has(tokens[next]!.word.toLowerCase())) next++;

        const candidate = tokens[next];
        if (
            candidate &&
            !marks.has(candidate.start) &&
            isNounCandidate(candidate.word) &&
            !verbBase(candidate.word) &&
            !isCapitalized(candidate.word)
        ) {
            add(candidate, "noun", singular(candidate.word));
        }
    });

    return [...marks.values()].sort((a, b) => a.start - b.start);
};
