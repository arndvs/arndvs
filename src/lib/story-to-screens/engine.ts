import { singular, suggestMarks, tokenize, verbBase } from "./suggest";
import type { MarkKind } from "./suggest";

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

export type Release = "mvp" | "r2" | "r3" | "later" | "none";

export const RELEASES: readonly { id: Release; label: string }[] = [
    { id: "mvp", label: "MVP" },
    { id: "r2", label: "Release 2" },
    { id: "r3", label: "Release 3" },
    { id: "later", label: "Later" },
    { id: "none", label: "Not needed" },
];
export type Cardinality = "one" | "many";
/** A visitor's correction to one word: mark it as a thing or an action, or unmark it. */
export type Correction = MarkKind | "none";

export type Choices = {
    /** Keyed by `${storyId}:${characterOffset}`. */
    corrections: Record<string, Correction>;
    /** Keyed by relationship id, `${from}>${to}`. */
    cardinality: Record<string, Cardinality>;
    /** Keyed by screen id. Screens missing here are in the MVP. */
    releases: Record<string, Release>;
    manualScreens: { id: string; name: string }[];
    dismissed: string[];
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
};

export type RuleId = "stories" | "defaults" | "crud" | "walk" | "cardinality";

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

export type Derived = {
    marksByStory: Record<string, Mark[]>;
    entities: Entity[];
    relationships: Relationship[];
    screens: Screen[];
    findings: Finding[];
    steps: RuleStep[];
};

// ---------------------------------------------------------------------------
// The rules, in the order the waterfall applies them.
// ---------------------------------------------------------------------------

export const RULES: readonly { id: RuleId; name: string; step: string; explain: string }[] = [
    {
        id: "stories",
        name: "From the stories",
        step: "Step 3 · list the screens",
        explain:
            "A profile for every role, a detail screen for everything a role acts on, and a create screen wherever a story creates something. One story per role.",
    },
    {
        id: "defaults",
        name: "Default screens",
        step: "Step 3 · default screens",
        explain:
            "Every product has a landing page. Products with accounts also need sign-up and log-in.",
    },
    {
        id: "crud",
        name: "Create, edit, delete",
        step: "Step 2 · the create, edit, delete rule",
        explain:
            "Anything a person can create, they'll want to edit and delete. Stories rarely say so.",
    },
    {
        id: "walk",
        name: "Walk the story",
        step: "Step 3 · validate with stories",
        explain:
            "When a story acts on many of something (reviews applicants, browses studies), there must be a list to do it from.",
    },
    {
        id: "cardinality",
        name: "One or many?",
        step: "Step 4 · one or many",
        explain:
            "If a story uses the plural but the relationship is set to one, the data model breaks the first time reality disagrees.",
    },
];

export const CREATE_VERBS = new Set(
    "create post write add enter type submit upload schedule record publish".split(" "),
);
export const MANY_VERBS = new Set(
    "browse search find review compare contact filter select accept reject check rank sort".split(
        " ",
    ),
);

// ---------------------------------------------------------------------------
// Wording helpers
// ---------------------------------------------------------------------------

export const titleCase = (s: string): string => s.replace(/\b\w/g, (c) => c.toUpperCase());
export const capitalize = (s: string): string => (s ? s[0]!.toUpperCase() + s.slice(1) : s);
const withArticle = (s: string): string => `${/^[aeiou]/i.test(s) ? "an" : "a"} ${s}`;
export const pluralize = (s: string): string =>
    s.endsWith("y") && !/[aeiou]y$/.test(s)
        ? `${s.slice(0, -1)}ies`
        : s.endsWith("s")
          ? s
          : `${s}s`;

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
        const fix = corrections[`${story.id}:${token.start}`];
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
    "verbs" | "createVerbs" | "storyIds" | "guess" | "cardinality"
> & {
    verbs: Set<string>;
    createVerbs: Set<string>;
    storyIds: Set<string>;
};

type OtherRole = {
    storyId: string;
    subject: string;
    roleOfStory: string;
    sentenceStart: number;
    sentence: string;
};

export const derive = (product: Product): Derived => {
    const { choices, aliases } = product;
    const entityOf = (lemma: string): string => aliases[lemma] ?? lemma;
    const roleOf = (story: Story): string =>
        aliases[story.actor.toLowerCase()] ??
        singular(story.roleName.toLowerCase().split(/[\s(]/)[0] || "person");

    const marksByStory: Record<string, Mark[]> = {};
    const entityIds = new Set<string>();
    const relationships = new Map<string, RelationshipDraft>();
    const otherRoles = new Map<string, OtherRole>();

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
            };
            draft.verbs.add(mark.lemma);
            if (CREATE_VERBS.has(mark.lemma) && !located) draft.createVerbs.add(mark.lemma);
            draft.plural ||= isPlural(object);
            draft.sentences.push(sentenceText(sentence));
            draft.storyIds.add(story.id);
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
            guess,
            cardinality: choices.cardinality[draft.id] ?? guess,
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
    ): boolean => {
        if (screens.has(id)) return false;
        screens.set(id, {
            id,
            name,
            type,
            entity,
            ruleId,
            release: choices.releases[id] ?? "mvp",
            needsEmptyState: type === "list",
        });

        return true;
    };
    const record = (ruleId: RuleId, added: string[]): void => {
        steps.push({ ruleId, added, total: screens.size });
    };

    // 1 · From the stories
    {
        const added: string[] = [];
        for (const role of roles) {
            if (
                addScreen(`profile-${role}`, `${titleCase(role)} profile`, "view", role, "stories")
            ) {
                added.push(`profile-${role}`);
            }
        }
        for (const rel of rels) {
            if (roles.has(rel.to)) continue;
            if (
                addScreen(
                    `view-${rel.to}`,
                    `${titleCase(rel.to)} detail`,
                    "view",
                    rel.to,
                    "stories",
                )
            ) {
                added.push(`view-${rel.to}`);
            }
            if (
                rel.createVerbs.length &&
                addScreen(`new-${rel.to}`, `New ${rel.to}`, "create", rel.to, "stories")
            ) {
                added.push(`new-${rel.to}`);
            }
        }
        for (const other of otherRoles.values()) {
            findings.push({
                id: `split:${other.storyId}:${other.subject}`,
                ruleId: "stories",
                split: {
                    storyId: other.storyId,
                    subject: other.subject,
                    sentenceStart: other.sentenceStart,
                },
                message: `“${other.sentence}” This part is about ${pluralize(other.subject)}, not the ${other.roleOfStory}. One story per role: split it into its own ${titleCase(other.subject)} story so it can say what ${pluralize(other.subject)} do today.`,
                sources: [{ kind: "story", id: other.storyId }],
            });
        }
        record("stories", added);
    }

    // 2 · Default screens
    {
        const added: string[] = [];
        if (addScreen("landing", "Landing page", "landing", null, "defaults"))
            added.push("landing");
        if (addScreen("signup", "Sign up", "auth", null, "defaults")) added.push("signup");
        if (addScreen("login", "Log in", "auth", null, "defaults")) added.push("login");
        if (added.length) {
            findings.push({
                id: "defaults",
                ruleId: "defaults",
                message: `Added ${added.length} screens every product needs: ${added.map((id) => screens.get(id)?.name).join(", ")}.`,
                sources: [],
            });
        }
        record("defaults", added);
    }

    // 3 · Create, edit, delete
    {
        const added: string[] = [];
        for (const rel of rels) {
            if (!screens.has(`new-${rel.to}`)) continue;
            if (
                addScreen(`edit-${rel.to}`, `Edit ${rel.to} (with delete)`, "edit", rel.to, "crud")
            ) {
                added.push(`edit-${rel.to}`);
                findings.push({
                    id: `crud:${rel.to}`,
                    ruleId: "crud",
                    message: `${capitalize(rel.from)} can create ${withArticle(rel.to)}, but no story says how to edit or delete one. Added “Edit ${rel.to}”, with delete on it.`,
                    sources: [{ kind: "relationship", id: rel.id }],
                });
            }
        }
        record("crud", added);
    }

    // 4 · Walk the story
    {
        const added: string[] = [];
        for (const rel of rels) {
            if (roles.has(rel.to) || rel.cardinality !== "many") continue;
            const manyVerb = rel.verbs.find((verb) => MANY_VERBS.has(verb));
            if (!manyVerb) continue;
            const listName = `${titleCase(pluralize(rel.to))} list`;
            if (addScreen(`list-${rel.to}`, listName, "list", rel.to, "walk")) {
                added.push(`list-${rel.to}`);
                findings.push({
                    id: `walk:${rel.to}`,
                    ruleId: "walk",
                    message: `“${rel.sentences[0]}” ${capitalize(withArticle(rel.from))} ${manyVerb}s many ${pluralize(rel.to)}, but there was no list to do it from. Added “${listName}”.`,
                    sources: [
                        { kind: "relationship", id: rel.id },
                        ...rel.storyIds.map((id): FindingSource => ({ kind: "story", id })),
                    ],
                });
            }
        }
        record("walk", added);
    }

    // 5 · One or many
    for (const rel of rels) {
        if (rel.cardinality === "one" && rel.plural) {
            findings.push({
                id: `card:${rel.id}`,
                ruleId: "cardinality",
                message: `“${rel.sentences[0]}” The story says ${withArticle(rel.from)} relates to more than one ${rel.to}, but this is set to one. Set it to many, or the first customer with that setup can't use the product.`,
                sources: [{ kind: "relationship", id: rel.id }],
            });
        }
    }
    record("cardinality", []);

    for (const screen of choices.manualScreens)
        addScreen(screen.id, screen.name, "manual", null, "manual");

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
    for (const key of Object.keys(next.choices.corrections)) {
        if (key.startsWith(`${storyId}:`)) delete next.choices.corrections[key];
    }
    next.stories.push({ id: newId, roleName: capitalize(subject), actor: "", text: moved });

    return next;
};
