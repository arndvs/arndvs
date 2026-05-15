export function assertValue<T>(v: T | undefined, errorMessage: string): T {
    if (v === undefined) throw new Error(errorMessage);

    if (typeof v === "string" && v.trim().length === 0) throw new Error(errorMessage);

    return v;
}
