/**
 * Seed script — saves the "Readable Code Was a Stand-in for Trust" LinkedIn
 * post as a socialDraft in Sanity.
 *
 * Idempotent: skips if a socialDraft with this sourceDigestId exists.
 * Run: pnpm exec tsx scripts/seed-haskell-linkedin.ts
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: "2025-03-19",
    token: process.env.SANITY_API_TOKEN!,
    useCdn: false,
});

const SOURCE_ID = "haskell-readable-vs-explainable";

const BODY = `Most of how we build software exists because a human had to read it.

Geoffrey Huntley makes that case in his latest post. The Haskell in this clip is his example: unreadable on purpose, explained by an AI in seconds. Translation isn't new. The question behind it is.

Consoles exist because mainframes had operators. Languages change slowly because people learn slowly. Python 2 to 3 took about fifteen years. Companies keep separate Ruby, .NET and Java teams because people specialize.

Take the human out of the reading seat and every one of those choices is open again.

Huntley describes a founder whose team estimated a legacy rewrite at years. He ran AI loops himself and finished in a week.

So what replaces readability? Verification. Strict types, compilers and simulators that catch an agent's mistakes on every loop. Readable code was always a stand-in for "can we trust this?" Now trust comes from checks the machine runs, plus an explanation whenever you ask for one.

The human doesn't leave. We stop reading every line and start deciding what must be true.

Which practice on your team exists only because a person had to read the code?

#SoftwareEngineering #AI #DeveloperExperience`;

async function seed() {
    console.log("Seeding LinkedIn draft...\n");

    const existing = await client.fetch<string[]>(
        `*[_type == "socialDraft" && sourceDigestId == $id][0]._id`,
        { id: SOURCE_ID },
    );

    if (existing) {
        console.log(`  ⏭ ${SOURCE_ID} (exists)`);
        return;
    }

    await client.create({
        _type: "socialDraft",
        platform: "linkedin",
        contentType: "post",
        body: BODY,
        editedBody: BODY,
        status: "draft",
        sourceType: "comment",
        sourceDigestId: SOURCE_ID,
    });

    console.log(`  ✅ ${SOURCE_ID}`);
    console.log("\nDone.");
}

seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
