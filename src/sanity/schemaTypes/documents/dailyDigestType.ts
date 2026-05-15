import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const dailyDigestType = defineType({
    name: "dailyDigest",
    title: "Daily Digest",
    type: "document",
    icon: DocumentTextIcon,
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
            name: "date",
            title: "Date",
            type: "date",
            description: "The date this digest covers.",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "weekOf",
            title: "Week Of (Monday)",
            type: "date",
            description: "The Monday of the week this day belongs to — for grouping.",
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
            rows: 2,
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
    ],
    orderings: [
        {
            title: "Date, newest first",
            name: "dateDesc",
            by: [{ field: "date", direction: "desc" }],
        },
    ],
    preview: {
        select: { title: "title", subtitle: "date" },
    },
});
