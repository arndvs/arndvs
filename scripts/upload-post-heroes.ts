/**
 * Uploads a hero image for each blog post that has none and sets it as the post's mainImage.
 * Run: pnpm exec tsx scripts/upload-post-heroes.ts
 *
 * Posts are matched by slug. Both the published document and its draft, if one exists, are patched.
 * A post that already has a mainImage is left alone unless you pass --force.
 */
import { createReadStream } from "node:fs";
import { join } from "node:path";

import { createSanityClient } from "./lib/sanity";

const client = createSanityClient();
const ASSET_DIR = join(__dirname, "assets", "blog-heroes");
const force = process.argv.includes("--force");

const HEROES: { slug: string; file: string; alt: string }[] = [
    {
        slug: "readable-vs-explainable",
        file: "readable-vs-explainable.jpg",
        alt: "Title card reading We stop reading every line, beside a panel where the letters of banana are sorted into aaabnn with a check mark.",
    },
    {
        slug: "programming-as-theory-building",
        file: "programming-as-theory-building.jpg",
        alt: "Title card reading The real product isn't the code, beside a small block labelled code inside a larger dashed outline labelled theory.",
    },
    {
        slug: "tailwind-indicator",
        file: "tailwind-indicator.jpg",
        alt: "Title card reading Know your breakpoint, beside a page layout with a badge showing lg, 1280 by 720.",
    },
    {
        slug: "building-production-sanity-cms-ai-content-ops",
        file: "building-production-sanity-cms-ai-content-ops.jpg",
        alt: "Title card reading Production Sanity, AI content ops, beside a document with an Enhance button and four checked fields.",
    },
];

async function main() {
    for (const hero of HEROES) {
        const docs = await client.fetch<{ _id: string; hasImage: boolean }[]>(
            `*[_type == "post" && slug.current == $slug]{ _id, "hasImage": defined(mainImage.asset) }`,
            { slug: hero.slug },
        );
        if (docs.length === 0) {
            console.log(`skip ${hero.slug}: no post with this slug`);
            continue;
        }
        const targets = force ? docs : docs.filter((doc) => !doc.hasImage);
        if (targets.length === 0) {
            console.log(`skip ${hero.slug}: already has a mainImage (use --force to replace)`);
            continue;
        }
        const asset = await client.assets.upload(
            "image",
            createReadStream(join(ASSET_DIR, hero.file)),
            { filename: `blog-hero-${hero.file}` },
        );
        for (const doc of targets) {
            await client
                .patch(doc._id)
                .set({
                    mainImage: {
                        _type: "image",
                        asset: { _type: "reference", _ref: asset._id },
                        alt: hero.alt,
                    },
                })
                .commit();
            console.log(`set mainImage on ${doc._id}`);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
