/**
 * When each hand-built page last changed in substance, for the sitemap's <lastmod>.
 * Google uses lastmod only when it's consistently accurate: a date that's always "now"
 * teaches it to ignore the field for the whole site. Update a date here in the same
 * commit as a real content change to that page (not for typo fixes or refactors).
 * Index pages derive theirs from their entries instead (see sitemap.ts).
 */
export const PAGE_LAST_MODIFIED = {
    home: "2026-11-24",
    about: "2026-11-24",
    results: "2026-11-24",
    speaking: "2026-11-24",
    workWithMe: "2026-11-24",
} as const;

/** The latest of several ISO dates, or the fallback when there are none. */
export function latestDate(dates: (string | Date)[], fallback: string): Date {
    const times = dates.map((d) => new Date(d).getTime()).filter((t) => !Number.isNaN(t));
    return new Date(times.length ? Math.max(...times) : fallback);
}
