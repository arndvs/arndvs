import { CalendarIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const changelogEntryType = defineType({
    name: "changelogEntry",
    title: "Changelog Entry",
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
            options: {
                source: "title",
                maxLength: 96,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "date",
            title: "Date",
            type: "datetime",
            initialValue: () => new Date().toISOString(),
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "type",
            title: "Type",
            type: "string",
            options: {
                list: [
                    { title: "Feature", value: "feature" },
                    { title: "Improvement", value: "improvement" },
                    { title: "Fix", value: "fix" },
                    { title: "Content", value: "content" },
                    { title: "Infrastructure", value: "infrastructure" },
                ],
                layout: "radio",
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "summary",
            title: "Summary",
            type: "text",
            rows: 2,
            description: "Brief 1-2 sentence summary for the timeline view.",
            validation: (rule) => rule.required().max(300),
        }),
        defineField({
            name: "body",
            title: "Body",
            type: "array",
            description: "Optional detailed breakdown with grouped bullet points.",
            of: [
                defineArrayMember({
                    type: "block",
                    styles: [
                        { title: "Normal", value: "normal" },
                        { title: "H3", value: "h3" },
                        { title: "H4", value: "h4" },
                    ],
                    marks: {
                        decorators: [
                            { title: "Bold", value: "strong" },
                            { title: "Italic", value: "em" },
                            { title: "Code", value: "code" },
                        ],
                        annotations: [
                            {
                                name: "link",
                                type: "object",
                                title: "Link",
                                fields: [
                                    {
                                        name: "href",
                                        type: "url",
                                        title: "URL",
                                        validation: (rule) =>
                                            rule.uri({
                                                allowRelative: true,
                                                scheme: ["http", "https"],
                                            }),
                                    },
                                ],
                            },
                        ],
                    },
                }),
            ],
        }),
        defineField({
            name: "relatedProject",
            title: "Related Project",
            type: "string",
            options: {
                list: [
                    { title: "AlignSD", value: "alignsd" },
                    { title: "Ctrl", value: "ctrl" },
                    { title: "RipeMetrics", value: "ripemetrics" },
                    { title: "arndvs.com", value: "arndvs" },
                ],
            },
        }),
        defineField({
            name: "commitHash",
            title: "Commit Hash",
            type: "string",
            description: "First commit in the batch — links to GitHub.",
        }),
        defineField({
            name: "commitRange",
            title: "Commit Range",
            type: "string",
            description: "Git range (abc123..def456) for the full batch.",
        }),
        defineField({
            name: "isHighlight",
            title: "Highlight",
            type: "boolean",
            description: "Featured entries get a card-style background.",
            initialValue: false,
        }),
        defineField({
            name: "source",
            title: "Source",
            type: "string",
            hidden: true,
            initialValue: "manual",
            options: {
                list: [
                    { title: "Manual", value: "manual" },
                    { title: "Automated", value: "automated" },
                ],
            },
        }),
    ],
    orderings: [
        {
            title: "Date (Newest)",
            name: "dateDesc",
            by: [{ field: "date", direction: "desc" }],
        },
    ],
    preview: {
        select: {
            title: "title",
            date: "date",
            type: "type",
        },
        prepare({ title, date, type }) {
            const typeLabels: Record<string, string> = {
                feature: "✨",
                improvement: "⚡",
                fix: "🔧",
                content: "✏️",
                infrastructure: "🏗️",
            };
            const emoji = typeLabels[type] ?? "";
            const dateStr = date
                ? new Date(date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                  })
                : "";

            return {
                title: `${emoji} ${title}`,
                subtitle: dateStr,
            };
        },
    },
});
