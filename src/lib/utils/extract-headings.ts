import type { PortableTextBlock } from "next-sanity";

export interface ExtractedHeading {
    id: string;
    title: string;
    level: number;
}

/**
 * Converts a string to a URL-friendly slug for heading IDs.
 * Shared between extract-headings.ts (server) and post-body.tsx (client)
 * to ensure TOC links match rendered heading anchors.
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

function extractTextFromBlock(block: PortableTextBlock): string {
    if (!block || typeof block !== "object") return "";

    if ("children" in block && Array.isArray(block.children)) {
        return block.children
            .map((child) => ("text" in child && typeof child.text === "string" ? child.text : ""))
            .join("");
    }

    return "";
}

/**
 * Extracts h2/h3 headings from Sanity Portable Text body content.
 * Runs server-side to prevent CLS from client-side DOM queries.
 */
export function extractHeadingsFromPortableText(body: PortableTextBlock[]): ExtractedHeading[] {
    if (!body || !Array.isArray(body)) return [];

    const headings: ExtractedHeading[] = [];
    const usedIds = new Set<string>();

    body.forEach((block, index) => {
        if (!block || typeof block !== "object") return;
        if (!("_type" in block) || block._type !== "block" || !("style" in block)) return;

        const style = block.style as string;
        const headingMatch = style?.match(/^h([23])$/);

        const levelStr = headingMatch?.[1];

        if (!levelStr) return;

        const level = parseInt(levelStr, 10);
        const title = extractTextFromBlock(block);

        if (!title.trim()) return;

        const baseId = slugify(title) || `heading-${index}`;
        let id = baseId;
        let counter = 1;

        while (usedIds.has(id)) {
            id = `${baseId}-${counter}`;
            counter++;
        }
        usedIds.add(id);

        headings.push({ id, title: title.trim(), level });
    });

    return headings;
}
