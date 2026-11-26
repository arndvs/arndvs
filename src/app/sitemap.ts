import type { MetadataRoute } from "next";

import { EXPERIMENTS } from "@/lib/data/experiments";
import { PAGE_LAST_MODIFIED, latestDate } from "@/lib/data/page-dates";
import { PROJECTS } from "@/lib/data/projects";
import { SERVICES } from "@/lib/data/services";
import { SHOW_LOG_PAGES } from "@/lib/data/site-sections";
import { indexedSkills, skillLastModified } from "@/lib/data/skills";
import { siteConfig } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import {
    SITEMAP_CHANGELOG_LATEST_DATE_QUERY,
    SITEMAP_POSTS_QUERY,
    SITEMAP_WEEKLY_DIGESTS_QUERY,
} from "@/sanity/lib/queries";

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

    let changelogLastModified: Date = new Date(PAGE_LAST_MODIFIED.home);
    try {
        const latestDate = await client
            .withConfig({ useCdn: false })
            .fetch(SITEMAP_CHANGELOG_LATEST_DATE_QUERY);
        if (latestDate) changelogLastModified = new Date(latestDate);
    } catch (error) {
        console.error("Failed to fetch changelog date for sitemap:", error);
    }

    const projectEntries: MetadataRoute.Sitemap = PROJECTS.map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date(project.lastModified),
        changeFrequency: "monthly",
        priority: 0.9,
    }));

    const serviceEntries: MetadataRoute.Sitemap = SERVICES.map((service) => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: new Date(service.lastModified),
        changeFrequency: "monthly",
        priority: 0.9,
    }));

    // Only skills with enough case studies; the rest are noindex (see skills.ts).
    const skillEntries: MetadataRoute.Sitemap = indexedSkills().map((skill) => ({
        url: `${baseUrl}/skills/${skill.slug}`,
        lastModified: new Date(skillLastModified(skill)),
        changeFrequency: "monthly",
        priority: 0.6,
    }));

    const experimentEntries: MetadataRoute.Sitemap = EXPERIMENTS.map((experiment) => ({
        url: `${baseUrl}/experiments/${experiment.slug}`,
        lastModified: new Date(experiment.lastModified),
        changeFrequency: "monthly",
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(PAGE_LAST_MODIFIED.home),
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(PAGE_LAST_MODIFIED.about),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: latestDate(
                PROJECTS.map((p) => p.lastModified),
                PAGE_LAST_MODIFIED.home,
            ),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: latestDate(
                blogPosts.map((p) => p._updatedAt),
                PAGE_LAST_MODIFIED.home,
            ),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/results`,
            lastModified: new Date(PAGE_LAST_MODIFIED.results),
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/speaking`,
            lastModified: new Date(PAGE_LAST_MODIFIED.speaking),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/work-with-me`,
            lastModified: new Date(PAGE_LAST_MODIFIED.workWithMe),
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/experiments`,
            lastModified: latestDate(
                EXPERIMENTS.map((e) => e.lastModified),
                PAGE_LAST_MODIFIED.home,
            ),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: latestDate(
                SERVICES.map((service) => service.lastModified),
                PAGE_LAST_MODIFIED.home,
            ),
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/skills`,
            lastModified: latestDate(
                indexedSkills().map(skillLastModified),
                PAGE_LAST_MODIFIED.home,
            ),
            changeFrequency: "monthly",
            priority: 0.6,
        },
        ...serviceEntries,
        ...skillEntries,
        ...projectEntries,
        ...experimentEntries,
        ...blogEntries,
        // Changelog and Shipped are left out until they have entries (see site-sections.ts).
        ...(SHOW_LOG_PAGES
            ? ([
                  {
                      url: `${baseUrl}/changelog`,
                      lastModified: changelogLastModified,
                      changeFrequency: "weekly",
                      priority: 0.6,
                  },
                  {
                      url: `${baseUrl}/shipped`,
                      lastModified: latestDate(
                          digestEntries.map((d) => d.lastModified ?? PAGE_LAST_MODIFIED.home),
                          PAGE_LAST_MODIFIED.home,
                      ),
                      changeFrequency: "weekly",
                      priority: 0.7,
                  },
                  ...digestEntries,
              ] satisfies MetadataRoute.Sitemap)
            : []),
    ];
}
