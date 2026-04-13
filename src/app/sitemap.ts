import type { MetadataRoute } from "next";

import { PROJECTS } from "@/lib/data/projects";
import { siteConfig } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { POST_SLUGS_QUERY } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteConfig.url;

    // Fetch blog post slugs from Sanity
    let blogSlugs: string[] = [];
    try {
        blogSlugs = await client.fetch(POST_SLUGS_QUERY);
    } catch (error) {
        console.error("Failed to fetch blog slugs for sitemap:", error);
    }

    const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
    }));

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
        ...projectEntries,
        ...blogEntries,
    ];
}
