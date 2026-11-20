const wholeNumber = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const dollars = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const SUFFIXES: Record<string, number> = { k: 1e3, m: 1e6, b: 1e9 };

/**
 * Reads a whole count such as `250000`, `250,000`, `250k` or `1.5M`. Returns
 * `null` for anything else, including fractions of a token.
 */
export const parseTokenCount = (text: string): number | null => {
    const match = /^\s*(\d[\d,]*(?:\.\d+)?|\.\d+)\s*([kmb])?\s*$/i.exec(text);
    if (!match) return null;

    const [, digits = "", suffix] = match;
    const scale = suffix ? (SUFFIXES[suffix.toLowerCase()] ?? 1) : 1;
    const value = Number(digits.replaceAll(",", "")) * scale;
    // Scaling can land a hair off a whole number, such as 1.1k as 1100.0000000000002.
    const rounded = Math.round(value);

    return Number.isFinite(value) && Math.abs(value - rounded) < 1e-6 ? rounded : null;
};

export const formatTokenCount = (count: number): string => wholeNumber.format(count);

/**
 * Formats US dollars to the cent. The value is rounded to cents first, so an
 * exact half cent such as $0.335 shows as $0.34. The caller is responsible for
 * computing that value without floating-point drift.
 */
export const formatCost = (amount: number): string =>
    dollars.format(Math.round((amount + Number.EPSILON) * 100) / 100);

/** A price per million tokens, keeping up to three decimals, such as $0.042. */
export const formatPrice = (price: number): string =>
    `$${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 3 }).format(price)}`;

/** Formats a `YYYY-MM-DD` date in UTC, or anyone west of UTC sees the day before. */
export const formatCalendarDate = (date: string): string =>
    new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
        timeZone: "UTC",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
