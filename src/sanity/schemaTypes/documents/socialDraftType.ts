import { ComposeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const socialDraftType = defineType({
    name: "socialDraft",
    title: "Social Draft",
    type: "document",
    icon: ComposeIcon,
    fields: [
        defineField({
            name: "platform",
            title: "Platform",
            type: "string",
            options: {
                list: [
                    { title: "LinkedIn", value: "linkedin" },
                    { title: "Twitter", value: "twitter" },
                ],
                layout: "radio",
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "contentType",
            title: "Content Type",
            type: "string",
            options: {
                list: [
                    { title: "Post", value: "post" },
                    { title: "Thread", value: "thread" },
                    { title: "Tweet", value: "tweet" },
                ],
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "body",
            title: "Body (AI Draft)",
            type: "text",
            rows: 10,
            description: "Raw AI-generated draft before editorial pass.",
        }),
        defineField({
            name: "editedBody",
            title: "Edited Body",
            type: "text",
            rows: 10,
            description: "Post-editorial version (Halbert Editing Formula applied).",
        }),
        defineField({
            name: "editorNotes",
            title: "Editor Notes",
            type: "text",
            rows: 5,
            description: "Changelog from the AI editor — Halbert stage attribution per change.",
        }),
        defineField({
            name: "status",
            title: "Status",
            type: "string",
            options: {
                list: [
                    { title: "Draft", value: "draft" },
                    { title: "Editing", value: "editing" },
                    { title: "Ready", value: "ready" },
                    { title: "Posted", value: "posted" },
                    { title: "Skipped", value: "skipped" },
                ],
                layout: "radio",
            },
            initialValue: "draft",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "sourceDigest",
            title: "Source Digest",
            type: "reference",
            to: [{ type: "weeklyDigest" }],
            description: "The weekly digest this draft was generated from.",
        }),
        defineField({
            name: "generatedAt",
            title: "Generated At",
            type: "datetime",
        }),
        defineField({
            name: "postedAt",
            title: "Posted At",
            type: "datetime",
        }),
    ],
    orderings: [
        {
            title: "Generated, newest first",
            name: "generatedAtDesc",
            by: [{ field: "generatedAt", direction: "desc" }],
        },
    ],
    preview: {
        select: {
            platform: "platform",
            status: "status",
            body: "editedBody",
            fallbackBody: "body",
        },
        prepare({ platform, status, body, fallbackBody }) {
            const preview = (body ?? fallbackBody ?? "").slice(0, 80);
            return {
                title: `${platform ?? "?"} — ${status ?? "draft"}`,
                subtitle: preview,
            };
        },
    },
});
