import type { SanityImageSource } from "@sanity/image-url";

import type { CHANGELOG_QUERY_RESULT } from "@/sanity/types";

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

export type ChangelogEntry = CHANGELOG_QUERY_RESULT[number];

export type ChangelogEntryType = ChangelogEntry["type"];
