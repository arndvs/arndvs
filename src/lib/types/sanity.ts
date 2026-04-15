import type { SanityImageSource } from "@sanity/image-url";

import type { PortableTextBlock } from "next-sanity";

export type SanityImageWithAlt = SanityImageSource & {
    alt?: string;
    asset?: {
        _ref?: string;
        _id?: string;
        url?: string;
        metadata?: {
            dimensions?: { width: number; height: number } | null;
            lqip?: string | null;
        } | null;
    } | null;
};

export type ChangelogEntryType = "feature" | "improvement" | "fix" | "content" | "infrastructure";

export interface ChangelogEntry {
    _id: string;
    title: string;
    slug: { current: string };
    date: string;
    type: ChangelogEntryType;
    summary: string;
    body?: PortableTextBlock[] | null;
    relatedProject?: string | null;
    commitHash?: string | null;
    commitRange?: string | null;
    isHighlight?: boolean | null;
    source?: "manual" | "automated" | null;
}
