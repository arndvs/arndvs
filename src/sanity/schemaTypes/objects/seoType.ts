import { defineField, defineType } from "sanity";

export const seoType = defineType({
    name: "seo",
    title: "SEO",
    type: "object",
    fields: [
        defineField({
            name: "metaTitle",
            title: "Meta Title",
            type: "string",
            description: "Optimal: 50-60 characters. Used in browser tab and search results.",
            validation: (rule) =>
                rule
                    .max(70)
                    .warning("Meta titles over 60 characters may be truncated in search results."),
        }),
        defineField({
            name: "metaDescription",
            title: "Meta Description",
            type: "text",
            rows: 3,
            description: "Optimal: 110-160 characters. Shown below the title in search results.",
            validation: (rule) =>
                rule.max(200).warning("Meta descriptions over 160 characters may be truncated."),
        }),
        defineField({
            name: "focusKeyword",
            title: "Focus Keyword",
            type: "string",
            description: "The primary keyword this content targets.",
            validation: (rule) => rule.max(50),
        }),
        defineField({
            name: "keywords",
            title: "Keywords",
            type: "array",
            of: [{ type: "string" }],
            options: { layout: "tags" },
            description: "Additional SEO keywords. Aim for 3–5 relevant terms.",
            validation: (rule) => rule.max(10).warning("More than 10 keywords dilutes relevance."),
        }),
    ],
});
