import { CalendarIcon, DocumentTextIcon } from "@sanity/icons";
import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
    S.list()
        .title("Content")
        .items([
            S.listItem()
                .title("Blog")
                .icon(DocumentTextIcon)
                .child(
                    S.documentTypeList("post")
                        .title("Posts")
                        .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
                ),
            S.listItem()
                .title("Changelog")
                .icon(CalendarIcon)
                .child(
                    S.documentTypeList("changelogEntry")
                        .title("Changelog Entries")
                        .defaultOrdering([{ field: "date", direction: "desc" }]),
                ),
            S.listItem()
                .title("Weekly Digests")
                .icon(CalendarIcon)
                .child(
                    S.documentTypeList("weeklyDigest")
                        .title("Weekly Digests")
                        .defaultOrdering([{ field: "weekOf", direction: "desc" }]),
                ),
            S.listItem()
                .title("Daily Digests")
                .icon(DocumentTextIcon)
                .child(
                    S.documentTypeList("dailyDigest")
                        .title("Daily Digests")
                        .defaultOrdering([{ field: "date", direction: "desc" }]),
                ),
        ]);
