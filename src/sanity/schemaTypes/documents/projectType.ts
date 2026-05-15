import { ProjectsIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

// ── Nested object definitions ────────────────────────────────────────────────

const statItem = defineField({
    name: "statItem",
    title: "Stat",
    type: "object",
    fields: [
        defineField({
            name: "label",
            title: "Label",
            type: "string",
            validation: (r) => r.required(),
        }),
        defineField({
            name: "value",
            title: "Value",
            type: "string",
            validation: (r) => r.required(),
        }),
    ],
    preview: { select: { title: "label", subtitle: "value" } },
});

const ctaButton = defineField({
    name: "ctaButton",
    title: "CTA Button",
    type: "object",
    fields: [
        defineField({
            name: "text",
            title: "Text",
            type: "string",
            validation: (r) => r.required(),
        }),
        defineField({ name: "href", title: "URL", type: "url" }),
        defineField({
            name: "variant",
            title: "Variant",
            type: "string",
            options: { list: ["primary", "secondary", "outline", "ghost"] },
            initialValue: "primary",
        }),
    ],
    preview: { select: { title: "text", subtitle: "href" } },
});

const metricItem = defineField({
    name: "metricItem",
    title: "Metric",
    type: "object",
    fields: [
        defineField({
            name: "value",
            title: "Value",
            type: "number",
            validation: (r) => r.required(),
        }),
        defineField({
            name: "label",
            title: "Label",
            type: "string",
            validation: (r) => r.required(),
        }),
        defineField({ name: "prefix", title: "Prefix", type: "string" }),
        defineField({ name: "suffix", title: "Suffix", type: "string" }),
    ],
    preview: {
        select: { value: "value", label: "label", prefix: "prefix", suffix: "suffix" },
        prepare({ value, label, prefix, suffix }) {
            return { title: `${prefix ?? ""}${value}${suffix ?? ""}`, subtitle: label };
        },
    },
});

// ── Main project type ────────────────────────────────────────────────────────

export const projectType = defineType({
    name: "project",
    title: "Project",
    type: "document",
    icon: ProjectsIcon,
    groups: [
        { name: "overview", title: "Overview", default: true },
        { name: "hero", title: "Hero" },
        { name: "situation", title: "Situation" },
        { name: "architecture", title: "Architecture" },
        { name: "deepDives", title: "Deep Dives" },
        { name: "decisions", title: "Decisions" },
        { name: "learnings", title: "Learnings" },
        { name: "metrics", title: "Metrics" },
        { name: "gallery", title: "Gallery" },
        { name: "cta", title: "CTA" },
        { name: "buildLog", title: "Build Log" },
    ],
    fields: [
        // ── Overview ─────────────────────────────────────────────────────────
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            group: "overview",
            validation: (r) => r.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            group: "overview",
            options: { source: "title", maxLength: 96 },
            validation: (r) => r.required(),
        }),
        defineField({
            name: "status",
            title: "Status",
            type: "string",
            group: "overview",
            options: {
                list: [
                    { title: "Active", value: "active" },
                    { title: "Building", value: "building" },
                    { title: "Archived", value: "archived" },
                ],
                layout: "radio",
            },
            initialValue: "active",
            validation: (r) => r.required(),
        }),
        defineField({
            name: "accentColor",
            title: "Accent Color",
            type: "string",
            group: "overview",
            description: "Hex color for project theming (e.g. #6366f1).",
        }),
        defineField({
            name: "category",
            title: "Category",
            type: "string",
            group: "overview",
            options: {
                list: [
                    "Web Application",
                    "Infrastructure",
                    "Open Source",
                    "Mobile App",
                    "API / Backend",
                    "Design System",
                    "Other",
                ],
            },
        }),
        defineField({
            name: "year",
            title: "Year",
            type: "string",
            group: "overview",
            description: 'e.g. "2026" or "2025 – Present".',
        }),
        defineField({
            name: "role",
            title: "Role",
            type: "string",
            group: "overview",
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
            group: "overview",
            rows: 3,
        }),
        defineField({
            name: "tags",
            title: "Tags",
            type: "array",
            group: "overview",
            of: [defineArrayMember({ type: "string" })],
            options: { layout: "tags" },
        }),
        defineField({
            name: "thumbnail",
            title: "Thumbnail",
            type: "image",
            group: "overview",
            options: { hotspot: true },
            fields: [
                defineField({
                    name: "alt",
                    title: "Alt Text",
                    type: "string",
                    validation: (r) => r.required(),
                }),
            ],
        }),
        defineField({
            name: "externalUrl",
            title: "External URL",
            type: "url",
            group: "overview",
            description: "Live site or GitHub repo link.",
        }),

        // ── Hero ─────────────────────────────────────────────────────────────
        defineField({
            name: "hero",
            title: "Hero",
            type: "object",
            group: "hero",
            fields: [
                defineField({ name: "badge", title: "Badge", type: "string" }),
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "tagline", title: "Tagline", type: "text", rows: 3 }),
                defineField({
                    name: "stats",
                    title: "Stats",
                    type: "array",
                    of: [defineArrayMember({ ...statItem, type: "object" })],
                }),
                defineField({
                    name: "cta",
                    title: "CTA",
                    type: "object",
                    fields: [
                        defineField({ name: "text", title: "Text", type: "string" }),
                        defineField({ name: "href", title: "URL", type: "url" }),
                    ],
                }),
                defineField({
                    name: "screenshot",
                    title: "Screenshot",
                    type: "image",
                    options: { hotspot: true },
                    fields: [
                        defineField({
                            name: "alt",
                            title: "Alt Text",
                            type: "string",
                            validation: (r) => r.required(),
                        }),
                    ],
                }),
            ],
        }),

        // ── Situation ────────────────────────────────────────────────────────
        defineField({
            name: "situation",
            title: "Situation",
            type: "object",
            group: "situation",
            fields: [
                defineField({
                    name: "narrative",
                    title: "Narrative",
                    type: "array",
                    of: [defineArrayMember({ type: "text" })],
                    description: "One text block per paragraph.",
                }),
                defineField({
                    name: "context",
                    title: "Context",
                    type: "object",
                    fields: [
                        defineField({ name: "role", title: "Role", type: "string" }),
                        defineField({ name: "timeline", title: "Timeline", type: "string" }),
                        defineField({ name: "client", title: "Client", type: "string" }),
                        defineField({ name: "live", title: "Live URL", type: "url" }),
                        defineField({
                            name: "stack",
                            title: "Stack",
                            type: "array",
                            of: [defineArrayMember({ type: "string" })],
                            options: { layout: "tags" },
                        }),
                    ],
                }),
            ],
        }),

        // ── Architecture ─────────────────────────────────────────────────────
        defineField({
            name: "architecture",
            title: "Architecture",
            type: "object",
            group: "architecture",
            fields: [
                defineField({ name: "intro", title: "Intro", type: "text", rows: 4 }),
                defineField({
                    name: "diagram",
                    title: "Diagram (Mermaid)",
                    type: "text",
                    rows: 15,
                    description: "Raw Mermaid syntax — rendered by MermaidDiagram component.",
                }),
                defineField({
                    name: "secondaryDiagram",
                    title: "Secondary Diagram (Mermaid)",
                    type: "text",
                    rows: 15,
                }),
                defineField({
                    name: "secondaryDiagramTitle",
                    title: "Secondary Diagram Title",
                    type: "string",
                }),
                defineField({
                    name: "subsystems",
                    title: "Subsystems",
                    type: "array",
                    of: [
                        defineArrayMember({
                            type: "object",
                            fields: [
                                defineField({ name: "title", title: "Title", type: "string" }),
                                defineField({
                                    name: "description",
                                    title: "Description",
                                    type: "text",
                                    rows: 2,
                                }),
                            ],
                            preview: { select: { title: "title", subtitle: "description" } },
                        }),
                    ],
                }),
            ],
        }),

        // ── Deep Dives ───────────────────────────────────────────────────────
        defineField({
            name: "deepDives",
            title: "Deep Dives",
            type: "array",
            group: "deepDives",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        defineField({ name: "id", title: "ID", type: "string" }),
                        defineField({ name: "title", title: "Title", type: "string" }),
                        defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
                        defineField({ name: "problem", title: "Problem", type: "text", rows: 3 }),
                        defineField({
                            name: "beforeDiagram",
                            title: "Before Diagram (Mermaid)",
                            type: "text",
                            rows: 10,
                        }),
                        defineField({
                            name: "diagram",
                            title: "Diagram (Mermaid)",
                            type: "text",
                            rows: 10,
                        }),
                        defineField({
                            name: "walkthrough",
                            title: "Walkthrough",
                            type: "array",
                            of: [defineArrayMember({ type: "text" })],
                        }),
                        defineField({
                            name: "insight",
                            title: "Insight",
                            type: "object",
                            fields: [
                                defineField({ name: "title", title: "Title", type: "string" }),
                                defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
                            ],
                        }),
                        defineField({
                            name: "screenshot",
                            title: "Screenshot",
                            type: "image",
                            options: { hotspot: true },
                            fields: [
                                defineField({
                                    name: "alt",
                                    title: "Alt Text",
                                    type: "string",
                                    validation: (r) => r.required(),
                                }),
                            ],
                        }),
                    ],
                    preview: { select: { title: "title", subtitle: "subtitle" } },
                }),
            ],
        }),

        // ── Decisions ────────────────────────────────────────────────────────
        defineField({
            name: "decisions",
            title: "Decisions",
            type: "array",
            group: "decisions",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        defineField({ name: "decision", title: "Decision", type: "string" }),
                        defineField({
                            name: "alternatives",
                            title: "Alternatives",
                            type: "text",
                            rows: 2,
                        }),
                        defineField({
                            name: "reasoning",
                            title: "Reasoning",
                            type: "text",
                            rows: 3,
                        }),
                    ],
                    preview: { select: { title: "decision", subtitle: "reasoning" } },
                }),
            ],
        }),

        // ── Learnings ────────────────────────────────────────────────────────
        defineField({
            name: "learnings",
            title: "Learnings",
            type: "array",
            group: "learnings",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        defineField({ name: "title", title: "Title", type: "string" }),
                        defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
                    ],
                    preview: { select: { title: "title", subtitle: "body" } },
                }),
            ],
        }),

        // ── Metrics ──────────────────────────────────────────────────────────
        defineField({
            name: "metrics",
            title: "Metrics",
            type: "object",
            group: "metrics",
            fields: [
                defineField({
                    name: "hero",
                    title: "Hero Metrics",
                    type: "array",
                    of: [defineArrayMember({ ...metricItem, type: "object" })],
                }),
                defineField({
                    name: "supporting",
                    title: "Supporting Metrics",
                    type: "array",
                    of: [defineArrayMember({ ...metricItem, type: "object" })],
                }),
            ],
        }),

        // ── Gallery ──────────────────────────────────────────────────────────
        defineField({
            name: "gallery",
            title: "Gallery",
            type: "array",
            group: "gallery",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        defineField({
                            name: "image",
                            title: "Image",
                            type: "image",
                            options: { hotspot: true },
                            validation: (r) => r.required(),
                        }),
                        defineField({
                            name: "alt",
                            title: "Alt Text",
                            type: "string",
                            validation: (r) => r.required(),
                        }),
                        defineField({ name: "caption", title: "Caption", type: "string" }),
                    ],
                    preview: {
                        select: { title: "alt", media: "image" },
                    },
                }),
            ],
        }),

        // ── CTA ──────────────────────────────────────────────────────────────
        defineField({
            name: "cta",
            title: "Call to Action",
            type: "object",
            group: "cta",
            fields: [
                defineField({ name: "text", title: "Text", type: "text", rows: 2 }),
                defineField({
                    name: "buttons",
                    title: "Buttons",
                    type: "array",
                    of: [defineArrayMember({ ...ctaButton, type: "object" })],
                }),
            ],
        }),

        // ── Build Log ────────────────────────────────────────────────────────
        defineField({
            name: "buildLog",
            title: "Build Log",
            type: "array",
            group: "buildLog",
            description: "Chronological entries fed by the content pipeline.",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        defineField({
                            name: "weekOf",
                            title: "Week Of",
                            type: "date",
                            validation: (r) => r.required(),
                        }),
                        defineField({ name: "summary", title: "Summary", type: "text", rows: 3 }),
                        defineField({
                            name: "digestRef",
                            title: "Weekly Digest",
                            type: "reference",
                            to: [{ type: "weeklyDigest" }],
                        }),
                        defineField({
                            name: "stats",
                            title: "Stats",
                            type: "object",
                            fields: [
                                defineField({ name: "commits", title: "Commits", type: "number" }),
                                defineField({ name: "repos", title: "Repos", type: "number" }),
                                defineField({
                                    name: "linesAdded",
                                    title: "Lines Added",
                                    type: "number",
                                }),
                                defineField({
                                    name: "linesRemoved",
                                    title: "Lines Removed",
                                    type: "number",
                                }),
                            ],
                        }),
                    ],
                    preview: {
                        select: { weekOf: "weekOf", summary: "summary" },
                        prepare({ weekOf, summary }) {
                            return {
                                title: weekOf ?? "No date",
                                subtitle: (summary ?? "").slice(0, 60),
                            };
                        },
                    },
                }),
            ],
        }),
    ],
    orderings: [
        {
            title: "Status",
            name: "statusAsc",
            by: [{ field: "status", direction: "asc" }],
        },
        {
            title: "Title",
            name: "titleAsc",
            by: [{ field: "title", direction: "asc" }],
        },
    ],
    preview: {
        select: { title: "title", subtitle: "status", media: "thumbnail" },
    },
});
