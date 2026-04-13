import type { MetadataRoute } from "next";

import { siteConfig } from "@/sanity/env";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/studio", "/studio/*", "/api/*"],
        },
        sitemap: `${siteConfig.url}/sitemap.xml`,
    };
}
