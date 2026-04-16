import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const postType = defineType({
    name: "post",
    title: "Post",
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
            options: {
                source: "title",
                maxLength: 96,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "author",
            title: "Author",
            type: "string",
            initialValue: "Aaron Davis",
        }),
        defineField({
            name: "publishedAt",
            title: "Published At",
            type: "datetime",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "excerpt",
            title: "Excerpt",
            type: "text",
            rows: 3,
            description: "Brief summary for listing pages and meta descriptions.",
            validation: (rule) => rule.max(300),
        }),
        defineField({
            name: "tldr",
            title: "TL;DR",
            type: "text",
            rows: 3,
            description:
                "Brief summary for quick readers. Shown as a callout at the top of the post.",
            validation: (rule) => rule.max(500),
        }),
        defineField({
            name: "mainImage",
            title: "Main Image",
            type: "image",
            options: {
                hotspot: true,
            },
            fields: [
                defineField({
                    name: "alt",
                    title: "Alt Text",
                    type: "string",
                    description: "Describe the image for accessibility and SEO.",
                    validation: (rule) => rule.required(),
                }),
            ],
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
                        { title: "H4", value: "h4" },
                        { title: "Quote", value: "blockquote" },
                    ],
                    marks: {
                        decorators: [
                            { title: "Bold", value: "strong" },
                            { title: "Italic", value: "em" },
                            { title: "Code", value: "code" },
                            { title: "Strikethrough", value: "strike-through" },
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
                                                scheme: ["http", "https", "mailto"],
                                            }),
                                    },
                                    {
                                        name: "blank",
                                        type: "boolean",
                                        title: "Open in new tab",
                                        initialValue: false,
                                    },
                                ],
                            },
                        ],
                    },
                }),
                defineArrayMember({
                    type: "image",
                    name: "inlineImage",
                    options: { hotspot: true },
                    fields: [
                        defineField({
                            name: "alt",
                            type: "string",
                            title: "Alt Text",
                            validation: (rule) => rule.required(),
                        }),
                        defineField({
                            name: "caption",
                            type: "string",
                            title: "Caption",
                        }),
                    ],
                }),
                defineArrayMember({
                    type: "codeBlock",
                }),
            ],
        }),
        defineField({
            name: "categories",
            title: "Categories",
            type: "array",
            of: [{ type: "string" }],
            options: {
                layout: "tags",
            },
            description: 'Add tags like "Sanity", "Next.js", "AI", "SEO".',
        }),
        defineField({
            name: "seo",
            title: "SEO",
            type: "seo",
            description: "Search engine optimization fields. AI-populated or manual.",
        }),
        defineField({
            name: "aiEnhancement",
            title: "AI Enhancement",
            type: "object",
            description: "Tracks AI SEO enhancement status. Managed automatically.",
            readOnly: true,
            fields: [
                defineField({
                    name: "status",
                    title: "Status",
                    type: "string",
                    options: {
                        list: ["pending", "completed", "failed"],
                    },
                }),
                defineField({
                    name: "lastRunAt",
                    title: "Last Run",
                    type: "datetime",
                }),
                defineField({
                    name: "confidence",
                    title: "Confidence",
                    type: "number",
                    description: "AI confidence score (0–1).",
                    validation: (rule) => rule.min(0).max(1),
                }),
                defineField({
                    name: "model",
                    title: "Model",
                    type: "string",
                }),
            ],
        }),
    ],
    orderings: [
        {
            title: "Published Date, New",
            name: "publishedAtDesc",
            by: [{ field: "publishedAt", direction: "desc" }],
        },
    ],
    preview: {
        select: {
            title: "title",
            media: "mainImage",
            publishedAt: "publishedAt",
        },
        prepare({ title, media, publishedAt }) {
            const date = publishedAt
                ? new Date(publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                  })
                : "Draft";

            return {
                title,
                subtitle: date,
                media,
            };
        },
    },
});
