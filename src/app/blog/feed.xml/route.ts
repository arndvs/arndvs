import { Feed } from "feed";

import { siteConfig } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { POSTS_QUERY } from "@/sanity/lib/queries";

export async function GET() {
    let posts;
    try {
        posts = await client.withConfig({ useCdn: false }).fetch(POSTS_QUERY);
    } catch (err) {
        console.error("Blog feed: Sanity fetch failed", err);
        return new Response("Service Unavailable", {
            status: 503,
            headers: { "Retry-After": "60" },
        });
    }

    const feed = new Feed({
        title: "Aaron Davis Blog",
        description:
            "Technical blog by Aaron Davis — full-stack engineering, AI systems, and web development.",
        id: `${siteConfig.url}/blog`,
        link: `${siteConfig.url}/blog`,
        language: "en",
        copyright: `© ${new Date().getFullYear()} Aaron Davis`,
        feedLinks: {
            rss2: `${siteConfig.url}/blog/feed.xml`,
        },
        author: {
            name: "Aaron Davis",
            link: siteConfig.url,
        },
    });

    for (const post of posts) {
        feed.addItem({
            title: post.title,
            id: `${siteConfig.url}/blog/${post.slug}`,
            link: `${siteConfig.url}/blog/${post.slug}`,
            description: post.excerpt ?? "",
            date: new Date(post.publishedAt),
        });
    }

    return new Response(feed.rss2(), {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
    });
}
