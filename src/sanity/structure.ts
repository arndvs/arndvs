import { CalendarIcon, ComposeIcon, DocumentTextIcon, ProjectsIcon } from "@sanity/icons";
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
            S.divider(),
            S.listItem()
                .title("Projects")
                .icon(ProjectsIcon)
                .child(
                    S.list()
                        .title("Projects")
                        .items([
                            S.listItem()
                                .title("Active")
                                .child(
                                    S.documentList()
                                        .title("Active Projects")
                                        .filter('_type == "project" && status == "active"')
                                        .defaultOrdering([{ field: "title", direction: "asc" }]),
                                ),
                            S.listItem()
                                .title("Building")
                                .child(
                                    S.documentList()
                                        .title("Building")
                                        .filter('_type == "project" && status == "building"')
                                        .defaultOrdering([{ field: "title", direction: "asc" }]),
                                ),
                            S.listItem()
                                .title("Archived")
                                .child(
                                    S.documentList()
                                        .title("Archived")
                                        .filter('_type == "project" && status == "archived"')
                                        .defaultOrdering([{ field: "title", direction: "asc" }]),
                                ),
                            S.divider(),
                            S.listItem()
                                .title("All Projects")
                                .child(
                                    S.documentTypeList("project")
                                        .title("All Projects")
                                        .defaultOrdering([{ field: "title", direction: "asc" }]),
                                ),
                        ]),
                ),
            S.listItem()
                .title("Social Drafts")
                .icon(ComposeIcon)
                .child(
                    S.list()
                        .title("Social Drafts")
                        .items([
                            S.listItem()
                                .title("Draft")
                                .child(
                                    S.documentList()
                                        .title("Drafts")
                                        .filter('_type == "socialDraft" && status == "draft"')
                                        .defaultOrdering([
                                            { field: "generatedAt", direction: "desc" },
                                        ]),
                                ),
                            S.listItem()
                                .title("Editing")
                                .child(
                                    S.documentList()
                                        .title("Editing")
                                        .filter('_type == "socialDraft" && status == "editing"')
                                        .defaultOrdering([
                                            { field: "generatedAt", direction: "desc" },
                                        ]),
                                ),
                            S.listItem()
                                .title("Ready")
                                .child(
                                    S.documentList()
                                        .title("Ready to Post")
                                        .filter('_type == "socialDraft" && status == "ready"')
                                        .defaultOrdering([
                                            { field: "generatedAt", direction: "desc" },
                                        ]),
                                ),
                            S.listItem()
                                .title("Posted")
                                .child(
                                    S.documentList()
                                        .title("Posted")
                                        .filter('_type == "socialDraft" && status == "posted"')
                                        .defaultOrdering([
                                            { field: "postedAt", direction: "desc" },
                                        ]),
                                ),
                            S.divider(),
                            S.listItem()
                                .title("All Drafts")
                                .child(
                                    S.documentTypeList("socialDraft")
                                        .title("All Social Drafts")
                                        .defaultOrdering([
                                            { field: "generatedAt", direction: "desc" },
                                        ]),
                                ),
                        ]),
                ),
        ]);
