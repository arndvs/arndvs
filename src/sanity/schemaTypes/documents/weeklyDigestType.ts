import { CalendarIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const weeklyDigestType = defineType({
    name: "weeklyDigest",
    title: "Weekly Digest",
    type: "document",
    icon: CalendarIcon,
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "title", maxLength: 96 },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "weekOf",
            title: "Week Of (Monday)",
            type: "date",
            description: "Always the Monday of the week this covers.",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "weekLabel",
            title: "Week Label",
            type: "string",
            description: 'e.g. "Week of January 6, 2025"',
        }),
        defineField({
            name: "publishedAt",
            title: "Published At",
            type: "datetime",
        }),
        defineField({
            name: "excerpt",
            title: "Excerpt",
            type: "text",
            rows: 3,
        }),
        defineField({
            name: "tags",
            title: "Tags",
            type: "array",
            of: [defineArrayMember({ type: "string" })],
            options: { layout: "tags" },
        }),
        defineField({
            name: "body",
            title: "Body",
            type: "array",
            of: [
                defineArrayMember({
                    type: "block",
                    styles: [
                        { title: "Normal", value: "normal" },
                        { title: "H2", value: "h2" },
                        { title: "H3", value: "h3" },
                    ],
                    lists: [{ title: "Bullet", value: "bullet" }],
                    marks: {
                        decorators: [
                            { title: "Strong", value: "strong" },
                            { title: "Em", value: "em" },
                            { title: "Code", value: "code" },
                        ],
                    },
                }),
            ],
        }),
        defineField({
            name: "stats",
            title: "Stats",
            type: "object",
            fields: [
                defineField({ name: "totalCommits", title: "Total Commits", type: "number" }),
                defineField({ name: "reposActive", title: "Repos Active", type: "number" }),
                defineField({ name: "linesAdded", title: "Lines Added", type: "number" }),
                defineField({ name: "linesRemoved", title: "Lines Removed", type: "number" }),
            ],
        }),
        defineField({
            name: "projects",
            title: "Projects",
            type: "array",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        defineField({ name: "repoName", title: "Repo Name", type: "string" }),
                        defineField({
                            name: "projectType",
                            title: "Project Type",
                            type: "string",
                            options: {
                                list: [
                                    "web app",
                                    "CLI tool",
                                    "library",
                                    "config/dotfiles",
                                    "data pipeline",
                                    "API",
                                    "mobile app",
                                    "other",
                                ],
                            },
                        }),
                        defineField({
                            name: "summary",
                            title: "Summary",
                            type: "text",
                            rows: 3,
                        }),
                        defineField({
                            name: "skillsDemonstrated",
                            title: "Skills",
                            type: "array",
                            of: [defineArrayMember({ type: "string" })],
                        }),
                        defineField({ name: "url", title: "GitHub URL", type: "url" }),
                    ],
                    preview: { select: { title: "repoName", subtitle: "projectType" } },
                }),
            ],
        }),
        defineField({
            name: "dailyRefs",
            title: "Daily Digests (rollup source)",
            type: "array",
            of: [
                defineArrayMember({
                    type: "reference",
                    to: [{ type: "dailyDigest" }],
                }),
            ],
        }),
    ],
    orderings: [
        {
            title: "Week, newest first",
            name: "weekOfDesc",
            by: [{ field: "weekOf", direction: "desc" }],
        },
    ],
    preview: {
        select: { title: "title", subtitle: "weekLabel" },
    },
});
