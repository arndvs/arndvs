import { RELEASES } from "./engine";
import type {
    Cardinality,
    Choices,
    Correction,
    Judgment,
    Product,
    Release,
    RuleId,
    Story,
} from "./engine";
import { findPreset, fromPreset } from "./presets";
import { REQUIRED_RULES, RULE_MODULES } from "./rules";

export const MAX_STORIES = 6;
export const MAX_STORY_LENGTH = 1_000;
/** Links longer than this still work, but some chat apps and email clients cut them off. */
export const LONG_LINK = 2_000;

const EXAMPLE_PARAM = "ex";
const CHOICES_PARAM = "k";
const PRODUCT_PARAM = "p";

const RELEASE_IDS = new Set<Release>(RELEASES.map((release) => release.id));
const CORRECTIONS = new Set<Correction>(["noun", "verb", "none"]);
const CARDINALITIES = new Set<Cardinality>(["one", "many"]);
const RULE_IDS = new Set<RuleId>(RULE_MODULES.map((rule) => rule.id));

// ---------------------------------------------------------------------------
// Compression: deflate-raw and base64url, so a link with stories stays short.
// ---------------------------------------------------------------------------

const toBase64Url = (bytes: Uint8Array): string => {
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);

    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const fromBase64Url = (text: string): Uint8Array<ArrayBuffer> => {
    const binary = atob(text.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    return bytes;
};

export const compress = async (text: string): Promise<string> => {
    const stream = new Blob([new TextEncoder().encode(text)])
        .stream()
        .pipeThrough(new CompressionStream("deflate-raw"));

    return toBase64Url(new Uint8Array(await new Response(stream).arrayBuffer()));
};

/** A short link can expand a long way, so reading stops once the plain text gets this big. */
export const MAX_DECOMPRESSED_BYTES = 65_536;

export type Decompressed = { status: "ok"; text: string } | { status: "too-large" };

export const decompress = async (encoded: string): Promise<Decompressed> => {
    const reader = new Blob([fromBase64Url(encoded)])
        .stream()
        .pipeThrough(new DecompressionStream("deflate-raw"))
        .getReader();
    const decoder = new TextDecoder();
    let text = "";
    let bytes = 0;

    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > MAX_DECOMPRESSED_BYTES) {
            await reader.cancel();

            return { status: "too-large" };
        }
        text += decoder.decode(value, { stream: true });
    }

    return { status: "ok", text: text + decoder.decode() };
};

// ---------------------------------------------------------------------------
// Validation: a shared link is untrusted input, so only known shapes survive.
// ---------------------------------------------------------------------------

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const str = (value: unknown, max: number): string | null =>
    typeof value === "string" ? value.slice(0, max) : null;

const pickRecord = <T extends string>(value: unknown, allowed: Set<T>): Record<string, T> => {
    const out: Record<string, T> = {};
    if (!isRecord(value)) return out;
    for (const [key, entry] of Object.entries(value).slice(0, 500)) {
        if (key.length <= 120 && allowed.has(entry as T)) out[key] = entry as T;
    }

    return out;
};

/** A judgment is only kept when its shape is one the engine knows how to read. */
const readJudgments = (value: unknown): Record<string, Judgment> => {
    const out: Record<string, Judgment> = {};
    if (!isRecord(value)) return out;
    for (const [key, entry] of Object.entries(value).slice(0, 500)) {
        if (key.length > 120 || !isRecord(entry)) continue;
        if (entry.kind === "misfire") {
            out[key] = { kind: "misfire" };
            continue;
        }
        const of = str(entry.of, 120);
        if (entry.kind === "feature" && of) out[key] = { kind: "feature", of };
    }

    return out;
};

export const readChoices = (value: unknown): Choices => {
    const raw = isRecord(value) ? value : {};
    const manual = Array.isArray(raw.manualScreens) ? raw.manualScreens.slice(0, 30) : [];
    const dismissed = Array.isArray(raw.dismissed) ? raw.dismissed.slice(0, 100) : [];

    return {
        corrections: pickRecord(raw.corrections, CORRECTIONS),
        cardinality: pickRecord(raw.cardinality, CARDINALITIES),
        releases: pickRecord(raw.releases, RELEASE_IDS),
        judgments: readJudgments(raw.judgments),
        manualScreens: manual.flatMap((entry) => {
            if (!isRecord(entry)) return [];
            const id = str(entry.id, 60);
            const name = str(entry.name, 60);

            return id && name ? [{ id, name }] : [];
        }),
        dismissed: dismissed.flatMap((id) => (typeof id === "string" ? [id.slice(0, 120)] : [])),
        // A rule that can't be turned off is dropped here, so a hand-edited link
        // can't leave the URL claiming a rule is off when the engine ignores it.
        rulesOff: Array.isArray(raw.rulesOff)
            ? raw.rulesOff
                  .filter((id): id is RuleId => RULE_IDS.has(id as RuleId))
                  .filter((id) => !REQUIRED_RULES.has(id))
                  .slice(0, RULE_IDS.size)
            : [],
    };
};

/** Visitor text keyed aliases: capped, so a pasted link can't smuggle in a huge map. */
const MAX_ALIAS_ENTRIES = 50;
const MAX_ALIAS_LENGTH = 60;

const readAliases = (value: unknown): Record<string, string> =>
    isRecord(value)
        ? Object.fromEntries(
              Object.entries(value)
                  .filter((entry): entry is [string, string] => typeof entry[1] === "string")
                  .slice(0, MAX_ALIAS_ENTRIES)
                  .map(([key, entry]) => [
                      key.slice(0, MAX_ALIAS_LENGTH),
                      entry.slice(0, MAX_ALIAS_LENGTH),
                  ]),
          )
        : {};

const readStories = (value: unknown): Story[] =>
    (Array.isArray(value) ? value.slice(0, MAX_STORIES) : []).flatMap((entry, index) => {
        if (!isRecord(entry)) return [];
        const text = str(entry.text, MAX_STORY_LENGTH);
        if (text === null) return [];

        const story: Story = {
            id: str(entry.id, 20) || `s${index + 1}`,
            roleName: str(entry.roleName, 40) || "Person",
            actor: str(entry.actor, 40) ?? "",
            text,
        };
        // A copied example keeps its answer key until its text is edited.
        if (isRecord(entry.hand)) {
            const words = (value: unknown): string[] =>
                Array.isArray(value)
                    ? value
                          .slice(0, 200)
                          .flatMap((word) => (typeof word === "string" ? [word.slice(0, 40)] : []))
                    : [];
            story.hand = { nouns: words(entry.hand.nouns), verbs: words(entry.hand.verbs) };
        }

        return [story];
    });

// ---------------------------------------------------------------------------
// Encoding and decoding the page's state
// ---------------------------------------------------------------------------

/** The product someone wrote, as it travels: short keys, because the link is the budget. */
export type PackedProduct = {
    n?: unknown;
    o?: unknown;
    s?: unknown;
    a?: unknown;
    c?: unknown;
};

export const packProduct = (product: Product): PackedProduct => ({
    n: product.name,
    o: product.origin,
    s: product.stories.map(({ id, roleName, actor, text, hand }) => ({
        id,
        roleName,
        actor,
        text,
        hand,
    })),
    a: product.aliases,
    c: product.choices,
});

export type ReadProduct =
    | { status: "ok"; product: Product }
    | { status: "empty" }
    | { status: "unreadable" };

/**
 * Reads a product written by a person, from a share link or from storage.
 * `empty` means it parsed but carries no stories; `unreadable` means the shape is wrong.
 */
export const readProduct = (raw: unknown): ReadProduct => {
    if (!isRecord(raw)) return { status: "unreadable" };
    const stories = readStories(raw.s);
    if (!stories.length) return { status: "empty" };

    return {
        status: "ok",
        product: {
            id: "yours",
            name: str(raw.n, 60) || "Your product",
            origin: raw.o === "blank" ? "blank" : "copy",
            stories,
            aliases: readAliases(raw.a),
            choices: readChoices(raw.c),
        },
    };
};

const emptyChoices = (choices: Choices): boolean =>
    !Object.keys(choices.corrections).length &&
    !Object.keys(choices.cardinality).length &&
    !Object.keys(choices.releases).length &&
    !Object.keys(choices.judgments).length &&
    !choices.manualScreens.length &&
    !choices.dismissed.length &&
    !choices.rulesOff.length;

/** Two judgments are the same when they say the same thing, not when they're the same object. */
const sameJudgment = (a: Judgment | undefined, b: Judgment | undefined): boolean => {
    if (!a || !b) return a === b;
    if (a.kind !== b.kind) return false;

    return a.kind === "misfire" || a.of === (b as { kind: "feature"; of: string }).of;
};

/** Only what differs from the example, so an untouched example has a short link. */
const choicesDiff = (choices: Choices, base: Choices): Choices => {
    const diff = <T>(mine: Record<string, T>, theirs: Record<string, T>): Record<string, T> =>
        Object.fromEntries(Object.entries(mine).filter(([key, value]) => theirs[key] !== value));
    const baseManual = new Set(base.manualScreens.map((screen) => screen.id));
    const baseDismissed = new Set(base.dismissed);

    return {
        corrections: diff(choices.corrections, base.corrections),
        cardinality: diff(choices.cardinality, base.cardinality),
        releases: diff(choices.releases, base.releases),
        judgments: Object.fromEntries(
            Object.entries(choices.judgments).filter(
                ([key, judgment]) => !sameJudgment(judgment, base.judgments[key]),
            ),
        ),
        manualScreens: choices.manualScreens.filter((screen) => !baseManual.has(screen.id)),
        dismissed: choices.dismissed.filter((id) => !baseDismissed.has(id)),
        rulesOff: choices.rulesOff.filter((id) => !base.rulesOff.includes(id)),
    };
};

/**
 * Examples are saved as their id plus what the visitor changed. Products people
 * write themselves are saved whole, compressed, because the stories are the point.
 */
export const encodeState = async (product: Product): Promise<URLSearchParams> => {
    const params = new URLSearchParams();
    const preset = product.origin === "example" ? findPreset(product.id) : undefined;

    if (preset) {
        params.set(EXAMPLE_PARAM, preset.id);
        const changed = choicesDiff(product.choices, preset.choices);
        if (!emptyChoices(changed)) {
            // Empty fields are left out; readChoices fills them back in.
            const compact = Object.fromEntries(
                Object.entries(changed).filter(([, value]) =>
                    Array.isArray(value) ? value.length : Object.keys(value as object).length,
                ),
            );
            params.set(CHOICES_PARAM, JSON.stringify(compact));
        }

        return params;
    }

    const saved = packProduct(product);
    params.set(PRODUCT_PARAM, await compress(JSON.stringify(saved)));

    return params;
};

export type InvalidReason = "unknown-example" | "unreadable" | "too-large" | "empty";

export type DecodedState =
    | { status: "none" }
    | { status: "ok"; product: Product }
    | { status: "invalid"; reason: InvalidReason };

/** Keeps the reason a shared link failed, so the page can say what went wrong. */
const invalid = (reason: InvalidReason): DecodedState => ({ status: "invalid", reason });

/** Reads a shared link. A link that doesn't parse says why, and the page keeps its default. */
export const decodeState = async (params: URLSearchParams): Promise<DecodedState> => {
    const exampleId = params.get(EXAMPLE_PARAM);
    if (exampleId !== null) {
        if (!findPreset(exampleId)) return invalid("unknown-example");
        const product = fromPreset(exampleId);
        const raw = params.get(CHOICES_PARAM);
        if (raw) {
            let changed: Choices;
            try {
                changed = readChoices(JSON.parse(raw));
            } catch {
                return invalid("unreadable");
            }
            const c = product.choices;
            Object.assign(c.corrections, changed.corrections);
            Object.assign(c.cardinality, changed.cardinality);
            Object.assign(c.releases, changed.releases);
            Object.assign(c.judgments, changed.judgments);
            c.manualScreens.push(...changed.manualScreens);
            c.dismissed.push(...changed.dismissed);
            c.rulesOff.push(...changed.rulesOff);
        }

        return { status: "ok", product };
    }

    const packed = params.get(PRODUCT_PARAM);
    if (!packed) return { status: "none" };
    if (packed.length > 20_000) return invalid("too-large");

    let text: string;
    try {
        const unpacked = await decompress(packed);
        if (unpacked.status === "too-large") return invalid("too-large");
        text = unpacked.text;
    } catch {
        return invalid("unreadable");
    }

    let raw: unknown;
    try {
        raw = JSON.parse(text);
    } catch {
        return invalid("unreadable");
    }

    const read = readProduct(raw);

    return read.status === "ok" ? { status: "ok", product: read.product } : invalid(read.status);
};

export const hasSharedState = (params: URLSearchParams): boolean =>
    params.has(EXAMPLE_PARAM) || params.has(PRODUCT_PARAM);
