import type { MetadataRoute } from "next"
import { client } from "@/sanity/lib/client"
import { POST_SLUGS_QUERY } from "@/sanity/lib/queries"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://arndvs.com"

  // Fetch blog post slugs from Sanity
  let blogSlugs: string[] = []
  try {
    blogSlugs = await client.fetch(POST_SLUGS_QUERY)
  } catch {
    // Silently fail — blog posts just won't be in sitemap
  }

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }))

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
      url: `${baseUrl}/projects/align-san-diego-family-chiropractic`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects/ripemetrics`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects/ctrl`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...blogEntries,
  ]
}
