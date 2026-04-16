import { Feed } from "feed";

import { siteConfig } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { CHANGELOG_QUERY } from "@/sanity/lib/queries";

export async function GET() {
    const entries = await client.withConfig({ useCdn: false }).fetch(CHANGELOG_QUERY);

    const feed = new Feed({
        title: "arndvs.com Changelog",
        description:
            "What's new on arndvs.com — features, improvements, fixes, and infrastructure updates.",
        id: `${siteConfig.url}/changelog`,
        link: `${siteConfig.url}/changelog`,
        language: "en",
        copyright: `© ${new Date().getFullYear()} Aaron Davis`,
        feedLinks: {
            rss2: `${siteConfig.url}/changelog/feed.xml`,
        },
        author: {
            name: "Aaron Davis",
            link: siteConfig.url,
        },
    });

    for (const entry of entries) {
        feed.addItem({
            title: entry.title,
            id: `${siteConfig.url}/changelog#${entry.slug}`,
            link: `${siteConfig.url}/changelog#${entry.slug}`,
            description: entry.summary,
            date: new Date(entry.date),
            category: [{ name: entry.type }],
        });
    }

    return new Response(feed.rss2(), {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
    });
}
