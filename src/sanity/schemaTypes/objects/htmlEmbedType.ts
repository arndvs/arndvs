import { ComponentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * htmlEmbed — an iframe embed for interactive HTML artifacts (animations,
 * demos, visualizations) hosted on an external static URL (e.g. GitHub Pages).
 *
 * The URL is rendered as a sandboxed iframe by the blog post body renderer.
 * Only allow-list trusted origins — the iframe is sandboxed with
 * `allow-scripts` so embedded content can run its own JS but cannot
 * navigate the parent page or open popups.
 */
export const htmlEmbedType = defineType({
    name: "htmlEmbed",
    title: "HTML Embed",
    type: "object",
    icon: ComponentIcon,
    fields: [
        defineField({
            name: "url",
            title: "URL",
            type: "url",
            description: "The static page to embed (e.g. a GitHub Pages URL). Must be HTTPS.",
            validation: (rule) =>
                rule.required().uri({
                    scheme: ["https"],
                    allowRelative: false,
                }),
        }),
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            description: "Accessible label for the embedded content.",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "aspectRatio",
            title: "Aspect Ratio",
            type: "string",
            options: {
                list: [
                    { title: "4:5 (portrait)", value: "4 / 5" },
                    { title: "1:1 (square)", value: "1 / 1" },
                    { title: "16:9 (landscape)", value: "16 / 9" },
                    { title: "3:2 (landscape)", value: "3 / 2" },
                ],
            },
            initialValue: "4 / 5",
        }),
        defineField({
            name: "caption",
            title: "Caption",
            type: "string",
            description: "Optional caption shown below the embed.",
        }),
    ],
    preview: {
        select: {
            title: "title",
            url: "url",
        },
        prepare({ title, url }) {
            return {
                title: title || "HTML Embed",
                subtitle: url || "No URL set",
            };
        },
    },
});
