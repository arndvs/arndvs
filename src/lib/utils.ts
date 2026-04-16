import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function estimateReadingTime(charCount: number, wordsPerMinute = 200): string {
    const wordCount = Math.round(charCount / 5);
    const minutes = Math.max(Math.ceil(wordCount / wordsPerMinute), 1);
    return `${minutes} min read`;
}

export function formatDate(dateStr: string, style: "long" | "short" = "long"): string {
    // Append time to avoid UTC midnight date-only parse shifting to previous day in local TZ
    const date = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: style === "long" ? "long" : "short",
        day: "numeric",
    });
}
