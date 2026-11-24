import { REQUIRED_RULES, RULE_MODULES } from "./rules";
import type { OtherRole, RuleContext, RuleModule } from "./rules";
import { singular, suggestMarks, tokenize, verbBase } from "./suggest";
import type { MarkKind } from "./suggest";
import { CREATE_VERBS, capitalize, titleCase } from "./wording";

// ---------------------------------------------------------------------------
// Types: the attributes from Steps 4–5 of the process. Saved choices live on
// `Product.choices`; everything else here is worked out on every change.
// ---------------------------------------------------------------------------

export type Story = {
    id: string;
    roleName: string;
    /** The story's protagonist, such as "Lena". Empty for stories people write themselves. */
    actor: string;
    text: string;
    /** The answer key for worked examples. Dropped as soon as the text is edited. */
    hand?: { nouns: string[]; verbs: string[] };
};

export type Release = "mvp" | "r2" | "r3" | "later";

export const RELEASES: readonly { id: Release; label: string }[] = [
    { id: "mvp", label: "MVP" },
    { id: "r2", label: "Release 2" },
    { id: "r3", label: "Release 3" },
    { id: "later", label: "Later" },
];
export type Cardinality = "one" | "many";
/** A visitor's correction to one word: mark it as a thing or an action, or unmark it. */
export type Correction = MarkKind | "none";

/**
 * What a visitor decided about a screen the rules added. A misfire is a screen
 * the rule invented; a feature is a screen that belongs inside another one.
 */
export type Judgment = { kind: "misfire" } | { kind: "feature"; of: string };

export type Choices = {
    /** Keyed by `${storyId}:${characterOffset}`. */
    corrections: Record<string, Correction>;
    /** Keyed by relationship id, `${from}>${to}`. */
    cardinality: Record<string, Cardinality>;
    /** Keyed by screen id. Screens missing here are in the MVP. */
    releases: Record<string, Release>;
    /** Keyed by screen id. A judged screen stays in the list but leaves the product. */
    judgments: Record<string, Judgment>;
    manualScreens: { id: string; name: string }[];
    dismissed: string[];
    /** Rules the visitor turned off. `stories` is always on and is ignored here. */
    rulesOff: RuleId[];
};

export type Product = {
    id: string;
    name: string;
    origin: "example" | "copy" | "blank";
    stories: Story[];
    /** Maps words to the entity they stand for, such as "lena" to "company". */
    aliases: Record<string, string>;
    choices: Choices;
};

export type Mark = {
    start: number;
    end: number;
    word: string;
    kind: MarkKind;
    lemma: string;
    status: "suggested" | "confirmed";
};

export type Entity = { id: string; name: string; isRole: boolean };

/** A sentence in a story that a screen or finding came from. */
export type ScreenSource = { storyId: string; start: number; sentence: string };

export type Relationship = {
    id: string;
    from: string;
    to: string;
    verbs: string[];
    /** Verbs that create the target, as opposed to acting somewhere ("posts in the group"). */
    createVerbs: string[];
    /** Whether the stories use the plural for the target. */
    plural: boolean;
    guess: Cardinality;
    cardinality: Cardinality;
    sentences: string[];
    storyIds: string[];
    sources: ScreenSource[];
};

export type ScreenType = "landing" | "auth" | "view" | "create" | "edit" | "list" | "manual";

export type Screen = {
    id: string;
    name: string;
    type: ScreenType;
    entity: string | null;
    ruleId: RuleId | "manual";
    release: Release;
    needsEmptyState: boolean;
    /** The story sentences this screen came from. Empty for the screens every product needs. */
    sources: ScreenSource[];
    /** Set when the visitor judged this screen a misfire or a feature of another screen. */
    judgment?: Judgment;
};

export type RuleId = "stories" | "defaults" | "crud" | "walk" | "cardinality" | "trace";

export type FindingSource = { kind: "story" | "relationship"; id: string };

export type Finding = {
    id: string;
    ruleId: RuleId;
    message: string;
    sources: FindingSource[];
    status: "open" | "dismissed";
    /** Set when a story holds a second role that should be its own story. */
    split?: { storyId: string; subject: string; sentenceStart: number };
};

export type RuleStep = { ruleId: RuleId; added: string[]; total: number };

/**
 * A screen the visitor judged a misfire or a feature of another screen stays in
 * the list so they can undo it, but it isn't part of the product: it doesn't
 * count, and it doesn't appear in the flow.
 */
export const inProduct = (screen: Screen): boolean => !screen.judgment;

/** Where a judged screen's edges should go instead: its parent, or nowhere. */
export const edgeTarget = (screen: Screen): string | null =>
    screen.judgment?.kind === "feature" ? screen.judgment.of : null;

export type Derived = {
    marksByStory: Record<string, Mark[]>;
    entities: Entity[];
    relationships: Relationship[];
    screens: Screen[];
    findings: Finding[];
    steps: RuleStep[];
};

// ---------------------------------------------------------------------------
// The rules, in the order the waterfall applies them. Defined in `rules/` so a
// rule can be read, tested and turned off on its own.
// ---------------------------------------------------------------------------

export { RULE_MODULES as RULES } from "./rules";
export { CREATE_VERBS, MANY_VERBS, capitalize, pluralize, titleCase } from "./wording";

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

/**
 * A record read by visitor text. `Object.hasOwn` stops inherited keys such as
 * "constructor" from standing in for a real entry.
 */
const own = <T>(record: Record<string, T>, key: string): T | undefined =>
    Object.hasOwn(record, key) ? record[key] : undefined;

// ---------------------------------------------------------------------------
// Marks
// ---------------------------------------------------------------------------

const PLURAL_CUE = /\b(two|three|four|several|many|ten|each|every|all|\d+)\b[^.]*$/i;

/** A story's marks: the answer key when it has one, suggestions otherwise, then the visitor's corrections. */
export const storyMarks = (story: Story, corrections: Record<string, Correction>): Mark[] => {
    const byStart = new Map<number, Mark>();

    if (story.hand) {
        const nouns = new Set(story.hand.nouns);
        const verbs = new Set(story.hand.verbs);
        for (const token of tokenize(story.text)) {
            if (/['’]s$/.test(token.word)) continue;
            const noun = singular(token.word);
            const verb = verbBase(token.word) ?? token.word.toLowerCase();
            const kind: MarkKind | null =
                verbs.has(verb) && !nouns.has(noun)
                    ? "verb"
                    : nouns.has(noun)
                      ? "noun"
                      : verbs.has(verb)
                        ? "verb"
                        : null;
            if (kind) {
                byStart.set(token.start, {
                    start: token.start,
                    end: token.end,
                    word: token.word,
                    kind,
                    lemma: kind === "noun" ? noun : verb,
                    status: "confirmed",
                });
            }
        }
        const at = story.actor ? story.text.indexOf(story.actor) : -1;
        if (at >= 0) {
            byStart.set(at, {
                start: at,
                end: at + story.actor.length,
                word: story.actor,
                kind: "noun",
                lemma: story.actor.toLowerCase(),
                status: "confirmed",
            });
        }
    } else {
        for (const mark of suggestMarks(story.text, story.actor || undefined)) {
            byStart.set(mark.start, { ...mark, status: "suggested" });
        }
    }

    for (const token of tokenize(story.text)) {
        const fix = own(corrections, `${story.id}:${token.start}`);
        if (!fix) continue;
        if (fix === "none") {
            byStart.delete(token.start);
            continue;
        }
        byStart.set(token.start, {
            start: token.start,
            end: token.end,
            word: token.word,
            kind: fix,
            status: "confirmed",
            lemma:
                fix === "noun"
                    ? singular(token.word)
                    : (verbBase(token.word) ?? token.word.toLowerCase()),
        });
    }

    return [...byStart.values()].sort((a, b) => a.start - b.start);
};

// ---------------------------------------------------------------------------
// derive: stories and choices in, everything else out
// ---------------------------------------------------------------------------

type RelationshipDraft = Omit<
    Relationship,
    "verbs" | "createVerbs" | "storyIds" | "sources" | "guess" | "cardinality"
> & {
    verbs: Set<string>;
    createVerbs: Set<string>;
    storyIds: Set<string>;
    sources: ScreenSource[];
};

export type { OtherRole } from "./rules";

export const derive = (product: Product): Derived => {
    const { choices } = product;

    /** The whole role name, singular: "Dog owner", not just "dog". */
    const roleNameOf = (story: Story): string =>
        singular(
            story.roleName
                .replace(/\([^)]*\)/g, " ")
                .replace(/\s+/g, " ")
                .trim()
                .toLowerCase(),
        ) || "person";

    // Each role's last word joins this derive's aliases, so "the owner" in a story
    // is the "Dog owner" role, not a second one. `product.aliases` is left alone.
    const aliases: Record<string, string> = { ...product.aliases };
    for (const story of product.stories) {
        const role = own(product.aliases, story.actor.toLowerCase()) ?? roleNameOf(story);
        const last = role.split(" ").at(-1) ?? "";
        if (last && last !== role && !last.endsWith("ing") && !Object.hasOwn(aliases, last)) {
            aliases[last] = role;
        }
    }

    const entityOf = (lemma: string): string => own(aliases, lemma) ?? lemma;
    const roleOf = (story: Story): string =>
        own(aliases, story.actor.toLowerCase()) ?? roleNameOf(story);

    const marksByStory: Record<string, Mark[]> = {};
    const entityIds = new Set<string>();
    const relationships = new Map<string, RelationshipDraft>();
    const otherRoles = new Map<string, OtherRole>();
    /** The first sentence each role speaks in, so a profile screen can point at its story. */
    const roleSources = new Map<string, ScreenSource>();

    for (const story of product.stories) {
        const marks = storyMarks(story, choices.corrections);
        marksByStory[story.id] = marks;
        const actor = roleOf(story);
        entityIds.add(actor);

        const text = story.text;
        const sentenceEnds = [...text.matchAll(/[.!?](\s|$)/g)].map((match) => match.index);
        const sentenceStarts = [0, ...sentenceEnds.map((end) => end + 1)];
        const sentenceOf = (position: number): number =>
            sentenceEnds.findIndex((end) => position <= end);
        const sentenceText = (index: number): string =>
            text
                .slice(sentenceStarts[index] ?? 0, (sentenceEnds[index] ?? text.length - 1) + 1)
                .trim();

        if (!roleSources.has(actor) && text.trim())
            roleSources.set(actor, {
                storyId: story.id,
                start: sentenceStarts[0] ?? 0,
                sentence: sentenceText(0),
            });

        // Who is acting. A sentence that opens with another noun followed by a verb
        // ("Customers browse the cakes") is about that noun, not the story's role.
        const subjects = new Map<number, string | null>();
        const subjectOf = (index: number): string | null => {
            const cached = subjects.get(index);
            if (cached !== undefined) return cached;

            const from = sentenceStarts[index] ?? 0;
            const tokens = tokenize(text.slice(from, (sentenceEnds[index] ?? text.length - 1) + 1));
            let k = 0;
            while (tokens[k] && /^(the|their|our|some|many|all|most|other)$/i.test(tokens[k]!.word))
                k++;
            const noun = tokens[k];
            const verb = tokens[k + 1];
            let subject: string | null = null;
            if (
                noun &&
                verb &&
                verbBase(verb.word) &&
                !/^(he|she|they|we|i|you|it|someone|everyone)$/i.test(noun.word)
            ) {
                const lemma = singular(noun.word);
                const looksLikeName =
                    k === 0 && /^[A-Z][a-z]+$/.test(noun.word) && lemma === noun.word.toLowerCase();
                if (
                    !looksLikeName &&
                    entityOf(lemma) !== actor &&
                    lemma !== story.actor.toLowerCase()
                ) {
                    subject = entityOf(lemma);
                }
            }
            subjects.set(index, subject);

            return subject;
        };

        // "Contacts ten of them": a pronoun points back to the first plural object in
        // the sentence (its topic), not simply the last one mentioned.
        const isPlural = (mark: Mark): boolean =>
            singular(mark.word) !== mark.word.toLowerCase() ||
            PLURAL_CUE.test(text.slice(Math.max(0, mark.start - 30), mark.start));
        const objectsBySentence = new Map<number, Mark[]>();
        let lastObject: Mark | null = null;

        marks.forEach((mark, index) => {
            if (mark.kind !== "verb") return;

            const sentence = sentenceOf(mark.start);
            const nextVerb = marks
                .slice(index + 1)
                .find((other) => other.kind === "verb" && sentenceOf(other.start) === sentence);
            const limit = nextVerb ? nextVerb.start : text.length;
            const pronoun = /\b(them|it)\b/.exec(text.slice(mark.end, limit));

            let object: Mark | null =
                marks
                    .slice(index + 1)
                    .find(
                        (other) =>
                            other.kind === "noun" &&
                            sentenceOf(other.start) === sentence &&
                            other.start < limit &&
                            !/['’]s$/.test(other.word) &&
                            other.lemma !== story.actor.toLowerCase(),
                    ) ?? null;
            if (pronoun && (!object || mark.end + pronoun.index < object.start)) {
                const seen = objectsBySentence.get(sentence) ?? [];
                object = seen.find(isPlural) ?? seen.at(-1) ?? lastObject;
            }
            if (!object) return;

            lastObject = object;
            objectsBySentence.set(sentence, [...(objectsBySentence.get(sentence) ?? []), object]);

            const subject = subjectOf(sentence);
            const from = subject ?? actor;
            if (subject) {
                entityIds.add(subject);
                otherRoles.set(`${story.id}:${subject}`, {
                    storyId: story.id,
                    subject,
                    roleOfStory: actor,
                    sentenceStart: sentenceStarts[sentence] ?? 0,
                    sentence: sentenceText(sentence),
                });
            }

            const to = entityOf(object.lemma);
            if (to === from) return;
            entityIds.add(to);

            // "Posts in the group" acts somewhere; it doesn't create a group.
            const located =
                /\b(in|into|at|to|from|across|on)\s+(the\s+|a\s+|an\s+|two\s+of\s+the\s+)?$/i.test(
                    text
                        .slice(mark.end, object.start)
                        .replace(/\b(several|many|each|every|their|her|his)\s+$/i, ""),
                );

            const id = `${from}>${to}`;
            const draft: RelationshipDraft = relationships.get(id) ?? {
                id,
                from,
                to,
                verbs: new Set(),
                createVerbs: new Set(),
                plural: false,
                sentences: [],
                storyIds: new Set(),
                sources: [],
            };
            draft.verbs.add(mark.lemma);
            if (CREATE_VERBS.has(mark.lemma) && !located) draft.createVerbs.add(mark.lemma);
            draft.plural ||= isPlural(object);
            draft.sentences.push(sentenceText(sentence));
            draft.storyIds.add(story.id);
            const source: ScreenSource = {
                storyId: story.id,
                start: sentenceStarts[sentence] ?? 0,
                sentence: sentenceText(sentence),
            };
            if (
                !draft.sources.some(
                    (seen) => seen.storyId === source.storyId && seen.start === source.start,
                )
            )
                draft.sources.push(source);
            relationships.set(id, draft);
        });
    }

    const rels: Relationship[] = [...relationships.values()].map((draft) => {
        const guess: Cardinality = draft.plural ? "many" : "one";
        return {
            ...draft,
            verbs: [...draft.verbs],
            createVerbs: [...draft.createVerbs],
            storyIds: [...draft.storyIds],
            sources: draft.sources,
            guess,
            cardinality: own(choices.cardinality, draft.id) ?? guess,
        };
    });

    const roles = new Set([
        ...product.stories.map(roleOf),
        ...[...otherRoles.values()].map((other) => other.subject),
    ]);

    // ---- Screens, rule by rule ----
    const screens = new Map<string, Screen>();
    const findings: Omit<Finding, "status">[] = [];
    const steps: RuleStep[] = [];
    const addScreen = (
        id: string,
        name: string,
        type: ScreenType,
        entity: string | null,
        ruleId: Screen["ruleId"],
        sources: ScreenSource[] = [],
    ): boolean => {
        if (screens.has(id)) return false;
        screens.set(id, {
            id,
            name,
            type,
            entity,
            ruleId,
            release: own(choices.releases, id) ?? "mvp",
            needsEmptyState: type === "list",
            sources,
        });

        return true;
    };
    const record = (ruleId: RuleId, added: string[]): void => {
        steps.push({ ruleId, added, total: screens.size });
    };

    const context: RuleContext = {
        roles,
        rels,
        otherRoles,
        roleSources,
        manualScreens: choices.manualScreens,
        screens,
        addScreen,
        addFinding: (finding) => findings.push(finding),
        record,
    };

    // Rules run in order. A rule the visitor turned off is skipped, except the
    // ones that cannot be: without `stories` there is nothing to derive from.
    const off = new Set(choices.rulesOff);
    const deferred: RuleModule[] = [];
    for (const rule of RULE_MODULES) {
        if (off.has(rule.id) && !REQUIRED_RULES.has(rule.id)) continue;
        if (rule.afterManualScreens) {
            deferred.push(rule);
            continue;
        }
        rule.apply(context);
    }

    for (const screen of choices.manualScreens)
        addScreen(screen.id, screen.name, "manual", null, "manual");

    for (const rule of deferred) rule.apply(context);

    // Judgments are applied last, once every screen exists, so a "feature of"
    // target can be checked against the real list. A judgment pointing at a
    // screen that isn't there is dropped and reported rather than silently kept.
    for (const [screenId, judgment] of Object.entries(choices.judgments)) {
        const screen = screens.get(screenId);
        if (!screen) continue;
        if (judgment.kind === "feature" && !screens.has(judgment.of)) {
            findings.push({
                id: `judgment:${screenId}`,
                ruleId: "trace",
                message: `“${screen.name}” was folded into a screen that no longer exists. It's back in the product.`,
                sources: [],
            });
            continue;
        }
        screen.judgment = judgment;
    }

    const dismissed = new Set(choices.dismissed);

    return {
        marksByStory,
        entities: [...entityIds].map((id) => ({ id, name: titleCase(id), isRole: roles.has(id) })),
        relationships: rels,
        screens: [...screens.values()],
        findings: findings.map((finding) => ({
            ...finding,
            status: dismissed.has(finding.id) ? "dismissed" : "open",
        })),
        steps,
    };
};

/**
 * A story's corrections, dropped when its text changes or the story goes: the
 * offsets they were keyed by no longer mean anything.
 */
export const clearStoryCorrections = (choices: Choices, storyId: string): void => {
    for (const key of Object.keys(choices.corrections)) {
        if (key.startsWith(`${storyId}:`)) delete choices.corrections[key];
    }
};

/** Moves the sentence a split finding points at, and any that follow starting with "They", into a new story. */
export const splitStory = (product: Product, finding: Finding, newId: string): Product => {
    if (!finding.split) return product;

    const { storyId, subject, sentenceStart } = finding.split;
    const next = structuredClone(product);
    const story = next.stories.find((candidate) => candidate.id === storyId);
    if (!story) return product;

    const text = story.text;
    const sentenceEnd = (from: number): number => {
        const offset = text.slice(from).search(/[.!?](\s|$)/);
        return offset < 0 ? text.length : from + offset + 1;
    };
    let end = sentenceEnd(sentenceStart);
    while (/^\s*They\b/.test(text.slice(end))) end = sentenceEnd(end);

    const moved = text.slice(sentenceStart, end).trim();
    story.text = `${text.slice(0, sentenceStart)}${text.slice(end)}`.replace(/\s{2,}/g, " ").trim();
    delete story.hand;
    clearStoryCorrections(next.choices, storyId);
    next.stories.push({ id: newId, roleName: capitalize(subject), actor: "", text: moved });

    return next;
};
