import { SearchIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Job Posting — a LinkedIn role surfaced by the job scout.
 *
 * Persisted by scripts/job-scout.ts after discovery + scoring. Statuses
 * are driven by the pure state machine in lib/engine/job-types.ts.
 * Never auto-applies — applications flow into socialDraft for review.
 */
export const jobPostingType = defineType({
    name: "jobPosting",
    title: "Job Posting",
    type: "document",
    icon: SearchIcon,
    fields: [
        defineField({
            name: "title",
            title: "Role Title",
            type: "string",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "company",
            title: "Company",
            type: "string",
        }),
        defineField({
            name: "level",
            title: "Level",
            type: "string",
        }),
        defineField({
            name: "workType",
            title: "Work Type",
            type: "string",
            options: {
                list: [
                    { title: "On-site", value: "on-site" },
                    { title: "Hybrid", value: "hybrid" },
                    { title: "Remote", value: "remote" },
                ],
            },
        }),
        defineField({
            name: "location",
            title: "Location",
            type: "string",
        }),
        defineField({
            name: "salary",
            title: "Salary",
            type: "string",
            description: "Salary band as posted (raw text).",
        }),
        defineField({
            name: "url",
            title: "Job URL",
            type: "url",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "status",
            title: "Status",
            type: "string",
            options: {
                list: [
                    { title: "Discovered", value: "discovered" },
                    { title: "Saved", value: "saved" },
                    { title: "Applied", value: "applied" },
                    { title: "Skip", value: "skip" },
                    { title: "Expired", value: "expired" },
                ],
                layout: "radio",
            },
            initialValue: "discovered",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "score",
            title: "Fit Score",
            type: "number",
            description: "Role-fit score from the job scout (0–100).",
            validation: (rule) => rule.min(0).max(100),
        }),
        defineField({
            name: "reasons",
            title: "Score Reasons",
            type: "array",
            of: [{ type: "string" }],
            description: "Why it scored this way — for the review queue.",
        }),
        defineField({
            name: "ageHours",
            title: "Age (hours)",
            type: "number",
            description: "Posting age in hours at discovery time.",
        }),
        defineField({
            name: "easyApply",
            title: "Easy Apply",
            type: "boolean",
        }),
        defineField({
            name: "source",
            title: "Source",
            type: "string",
            description: "Search context (e.g. search result text).",
        }),
        defineField({
            name: "discoveredAt",
            title: "Discovered At",
            type: "datetime",
        }),
        defineField({
            name: "applicationDraft",
            title: "Application Draft",
            type: "reference",
            to: [{ type: "socialDraft" }],
        }),
    ],
    orderings: [
        {
            title: "Fit score, best first",
            name: "scoreDesc",
            by: [{ field: "score", direction: "desc" }],
        },
        {
            title: "Discovered, newest first",
            name: "discoveredAtDesc",
            by: [{ field: "discoveredAt", direction: "desc" }],
        },
    ],
    preview: {
        select: {
            title: "title",
            company: "company",
            status: "status",
            score: "score",
        },
        prepare({ title, company, status, score }) {
            return {
                title: `${title ?? "?"}${company ? ` — ${company}` : ""}`,
                subtitle: `${status ?? "discovered"} ${score != null ? `· ${score}` : ""}`,
            };
        },
    },
});