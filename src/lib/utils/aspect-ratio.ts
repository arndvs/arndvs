import { stegaClean } from "next-sanity";

const ALLOWED_RATIOS = ["4 / 5", "1 / 1", "16 / 9", "3 / 2"] as const;
const DEFAULT_RATIO = "4 / 5";

/**
 * Sanitize a Sanity `aspectRatio` value for use in a CSS `aspect-ratio` style.
 *
 * Stega encoding appends zero-width characters to string fields while draft
 * mode is on. Left in place they make the declaration invalid CSS, so the
 * browser drops it and the embed collapses to the iframe's 150px default
 * height — which is why previews looked squashed.
 */
export function cssAspectRatio(value: string | undefined): string {
    if (!value) return DEFAULT_RATIO;

    const normalized = stegaClean(value)
        .replace(/\s+/g, " ")
        .replace(/\s*\/\s*/g, " / ")
        .trim();

    return (ALLOWED_RATIOS as readonly string[]).includes(normalized) ? normalized : DEFAULT_RATIO;
}
