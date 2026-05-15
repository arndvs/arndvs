import type { MetadataRoute } from "next";

import { PROJECTS } from "@/lib/data/projects";
import { siteConfig } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { SITEMAP_POSTS_QUERY, SITEMAP_WEEKLY_DIGESTS_QUERY } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteConfig.url;

    // Fetch blog posts with their last-updated timestamp from Sanity
    let blogPosts: Array<{ slug: string; _updatedAt: string }> = [];
    try {
        blogPosts = await client.withConfig({ useCdn: false }).fetch(SITEMAP_POSTS_QUERY);
    } catch (error) {
        console.error("Failed to fetch blog slugs for sitemap:", error);
    }

    const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post._updatedAt),
        changeFrequency: "weekly",
        priority: 0.7,
    }));

    let digestEntries: MetadataRoute.Sitemap = [];
    try {
        const digests = await client
            .withConfig({ useCdn: false })
            .fetch(SITEMAP_WEEKLY_DIGESTS_QUERY);
        digestEntries = digests.map((digest: { slug: string; _updatedAt: string }) => ({
            url: `${baseUrl}/shipped/${digest.slug}`,
            lastModified: new Date(digest._updatedAt),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }));
    } catch (error) {
        console.error("Failed to fetch digest slugs for sitemap:", error);
    }

    const projectEntries: MetadataRoute.Sitemap = PROJECTS.map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date(project.lastModified),
        changeFrequency: "monthly",
        priority: 0.9,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/changelog`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.6,
        },
        {
            url: `${baseUrl}/work-with-me`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/shipped`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
        },
        ...projectEntries,
        ...blogEntries,
        ...digestEntries,
    ];
}
