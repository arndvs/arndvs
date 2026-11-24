import type { Cardinality, Choices, Correction, Product, Release, Story } from "./engine";
import { findPreset, fromPreset } from "./presets";

export const MAX_STORIES = 6;
export const MAX_STORY_LENGTH = 1_000;
/** Links longer than this still work, but some chat apps and email clients cut them off. */
export const LONG_LINK = 2_000;

const EXAMPLE_PARAM = "ex";
const CHOICES_PARAM = "k";
const PRODUCT_PARAM = "p";

const RELEASES = new Set<Release>(["mvp", "r2", "r3", "later", "none"]);
const CORRECTIONS = new Set<Correction>(["noun", "verb", "none"]);
const CARDINALITIES = new Set<Cardinality>(["one", "many"]);

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

const pipe = async (
    bytes: Uint8Array<ArrayBuffer>,
    stream: CompressionStream | DecompressionStream,
): Promise<Uint8Array<ArrayBuffer>> =>
    new Uint8Array(
        await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer(),
    );

export const compress = async (text: string): Promise<string> =>
    toBase64Url(await pipe(new TextEncoder().encode(text), new CompressionStream("deflate-raw")));

export const decompress = async (encoded: string): Promise<string> =>
    new TextDecoder().decode(
        await pipe(fromBase64Url(encoded), new DecompressionStream("deflate-raw")),
    );

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

export const readChoices = (value: unknown): Choices => {
    const raw = isRecord(value) ? value : {};
    const manual = Array.isArray(raw.manualScreens) ? raw.manualScreens.slice(0, 30) : [];
    const dismissed = Array.isArray(raw.dismissed) ? raw.dismissed.slice(0, 100) : [];

    return {
        corrections: pickRecord(raw.corrections, CORRECTIONS),
        cardinality: pickRecord(raw.cardinality, CARDINALITIES),
        releases: pickRecord(raw.releases, RELEASES),
        manualScreens: manual.flatMap((entry) => {
            if (!isRecord(entry)) return [];
            const id = str(entry.id, 60);
            const name = str(entry.name, 60);

            return id && name ? [{ id, name }] : [];
        }),
        dismissed: dismissed.flatMap((id) => (typeof id === "string" ? [id.slice(0, 120)] : [])),
    };
};

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

const emptyChoices = (choices: Choices): boolean =>
    !Object.keys(choices.corrections).length &&
    !Object.keys(choices.cardinality).length &&
    !Object.keys(choices.releases).length &&
    !choices.manualScreens.length &&
    !choices.dismissed.length;

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
        manualScreens: choices.manualScreens.filter((screen) => !baseManual.has(screen.id)),
        dismissed: choices.dismissed.filter((id) => !baseDismissed.has(id)),
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

    const saved = {
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
    };
    params.set(PRODUCT_PARAM, await compress(JSON.stringify(saved)));

    return params;
};

/** Reads a shared link. Anything that doesn't parse gives null, and the page keeps its default. */
export const decodeState = async (params: URLSearchParams): Promise<Product | null> => {
    try {
        const exampleId = params.get(EXAMPLE_PARAM);
        if (exampleId !== null) {
            if (!findPreset(exampleId)) return null;
            const product = fromPreset(exampleId);
            const raw = params.get(CHOICES_PARAM);
            if (raw) {
                const changed = readChoices(JSON.parse(raw));
                const c = product.choices;
                Object.assign(c.corrections, changed.corrections);
                Object.assign(c.cardinality, changed.cardinality);
                Object.assign(c.releases, changed.releases);
                c.manualScreens.push(...changed.manualScreens);
                c.dismissed.push(...changed.dismissed);
            }

            return product;
        }

        const packed = params.get(PRODUCT_PARAM);
        if (!packed || packed.length > 20_000) return null;
        const raw: unknown = JSON.parse(await decompress(packed));
        if (!isRecord(raw)) return null;
        const stories = readStories(raw.s);
        if (!stories.length) return null;

        return {
            id: "yours",
            name: str(raw.n, 60) || "Your product",
            origin: raw.o === "blank" ? "blank" : "copy",
            stories,
            aliases: isRecord(raw.a)
                ? Object.fromEntries(
                      Object.entries(raw.a)
                          .filter(
                              (entry): entry is [string, string] => typeof entry[1] === "string",
                          )
                          .slice(0, 50),
                  )
                : {},
            choices: readChoices(raw.c),
        };
    } catch {
        return null;
    }
};

export const hasSharedState = (params: URLSearchParams): boolean =>
    params.has(EXAMPLE_PARAM) || params.has(PRODUCT_PARAM);
