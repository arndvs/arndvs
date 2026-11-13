/**
 * Seed script — creates "The Return Visit" blog post as a draft in Sanity.
 * The post body lives in scripts/content/marketing-engineer-lifecycle-automation.md;
 * edit that file and re-run to replace the draft. Publish from the Studio.
 * Run: pnpm exec tsx scripts/seed-return-visit-post.ts
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { parsePost } from "./lib/markdown-to-portable-text";
import { createSanityClient } from "./lib/sanity";

const SOURCE = fileURLToPath(
    new URL("./content/marketing-engineer-lifecycle-automation.md", import.meta.url),
);

const { frontmatter: fm, body } = parsePost(readFileSync(SOURCE, "utf8"), "return-visit");

const str = (key: string) => {
    const value = fm[key];
    if (typeof value !== "string" || !value) throw new Error(`Missing frontmatter: ${key}`);
    return value;
};

const slug = str("slug");

const post = {
    _type: "post" as const,
    _id: `drafts.post-${slug}`,
    title: str("title"),
    slug: { _type: "slug" as const, current: slug },
    author: "Aaron Davis",
    publishedAt: new Date().toISOString(),
    excerpt: str("excerpt"),
    tldr: str("tldr"),
    categories: Array.isArray(fm.categories) ? fm.categories : [],
    seo: {
        _type: "seo" as const,
        metaTitle: str("metaTitle"),
        metaDescription: str("metaDescription"),
        focusKeyword: str("focusKeyword"),
    },
    body,
};

async function main() {
    console.log(`Creating draft blog post: ${post.title}`);
    const result = await createSanityClient().createOrReplace(post);
    console.log(`✓ Created draft post: ${result._id} (${body.length} blocks)`);
    console.log(`  URL (after publish): /blog/${slug}`);
}

main().catch((err) => {
    console.error("Failed to seed blog post:", err);
    process.exit(1);
});
