/**
 * Seed script — creates the "Programming as Theory Building" blog post as a draft in Sanity.
 * Run: npx tsx scripts/seed-naur-theory-post.ts
 */
import { createSanityClient } from "./lib/sanity";

const client = createSanityClient();

// ── Segment types for rich text ──

type PlainSegment = string;
type EmSegment = { em: string };
type StrongSegment = { strong: string };
type LinkSegment = { link: string; href: string; em?: boolean };
type Segment = PlainSegment | EmSegment | StrongSegment | LinkSegment;

const post = {
    _type: "post" as const,
    _id: "drafts.post-programming-as-theory-building",
    title: "The Real Product of Programming Isn't the Code",
    slug: { _type: "slug" as const, current: "programming-as-theory-building" },
    author: "Aaron Davis",
    publishedAt: new Date().toISOString(),
    excerpt:
        "Peter Naur argued in 1985 that the primary product of programming isn't the code — it's the theory in the programmer's mind. Forty years later, AI has made this insight more urgent than ever.",
    tldr: "The most important product of programming isn't the code — it's the understanding in the programmer's mind of why the code is the way it is. AI can generate code without building any theory, which means AI-assisted programs are often born already dead: they work until something needs to change, and then no one can respond intelligently.",
    categories: ["Programming", "AI", "Software Engineering"],
    seo: {
        _type: "seo" as const,
        metaTitle: "The Real Product of Programming Isn't the Code",
        metaDescription:
            "Peter Naur's 1985 essay argues the primary product of programming is the theory in the programmer's mind — not the code. In the age of AI, this matters more than ever.",
        focusKeyword: "programming as theory building",
    },
    body: [
        // ── Intro ──
        block(
            "normal",
            "In 1985, a computer scientist named Peter Naur wrote an essay called \"Programming as Theory Building.\" It didn't get the attention it deserved. It still hasn't.",
        ),
        richBlock(
            "normal",
            "His central claim: the primary product of programming isn't the program. It's the ",
            { em: "theory" },
            " — the understanding held in the programmer's mind of why the program is the way it is. How the real world is mapped into the system. What each structural decision means. Why this shape and not another.",
        ),
        block(
            "normal",
            "Code is a residue of that theory. Documentation is a shadow of it. The thing itself lives in a person's head.",
        ),

        // ── What "Theory" Actually Means ──
        block("h2", 'What "Theory" Actually Means'),
        richBlock(
            "normal",
            "Naur borrowed the concept from philosopher Gilbert Ryle. To ",
            { em: "have" },
            " a theory, in Ryle's sense, isn't just to know facts — it's to know how to act, explain, justify, and respond. A person with a theory can tell you why each part of the program is the way it is. They can map any piece of the real world to its corresponding place in the system. And crucially, they can respond intelligently to change — recognizing when a new requirement fits naturally into the existing structure, and when it doesn't.",
        ),
        block(
            "normal",
            "Naur illustrated this with two cases. In the first, a compiler written by Group A was handed to Group B with full documentation, annotated code, and extensive written design discussion. Group B kept proposing modifications that technically worked but destroyed the underlying architecture — adding patches where the structure had elegant built-in solutions. Group A could spot the problems instantly. The documentation couldn't convey what the theory made obvious.",
        ),
        block(
            "normal",
            "The second case was a 200,000-line real-time system. The installation team — who had lived with it for years — could diagnose faults almost intuitively. External teams with full documentation kept getting stuck on problems the installation team resolved in minutes. The difference wasn't access to information. It was possession of the theory.",
        ),

        // ── Program Death ──
        block("h2", "Program Death"),
        block("normal", "Naur introduced a useful vocabulary: program life, death, and revival."),
        richBlock(
            "normal",
            "A program is ",
            { em: "alive" },
            " when a team holding its theory is in active control. It is ",
            { em: "dead" },
            " when that team dissolves — not because the code stops running, but because no one can respond intelligently to the need for change. A dead program can keep producing results for years. The death only becomes visible when something needs to change.",
        ),
        block(
            "normal",
            "Revival — rebuilding the theory from documentation alone — is, Naur argued, strictly impossible. You can reconstruct a theory, but it won't be the original one, and the discrepancies between the new theory and the old code will create problems that are hard to trace and harder to fix. His practical recommendation was stark: in most cases, it's better to discard the existing code and rebuild from scratch than to attempt revival.",
        ),

        // ── AI Makes This Worse ──
        block("h2", "AI Makes This Worse"),
        block(
            "normal",
            'Naur was arguing against what he called the "production view" of programming — the idea that the programmer is a factory, code is the output, and the job is done when the program runs. Forty years later, AI has made the production view more seductive than ever.',
        ),
        richBlock(
            "normal",
            "You can now generate working code without building any theory at all. An LLM will write you a feature in seconds. It has read everything ever written about software — but it has no theory ",
            { em: "of your specific system" },
            ". It doesn't know how your entities map to your domain. It doesn't know why you made the architectural choices you made. It doesn't know what the thing is ",
            { em: "for" },
            " in any deep sense.",
        ),
        block(
            "normal",
            "This makes AI an extremely fast version of Naur's Group B. It produces locally correct solutions that are globally incoherent, because coherence requires a theory of the world the program is meant to model. This is why AI-generated codebases tend to accumulate debt faster than carefully considered ones — not because the code is wrong, but because there's no theory holding it together.",
        ),
        block(
            "normal",
            "More troubling: the programs being built today with AI assistance, without a theory behind them, aren't just hard to maintain. They're born already dead in Naur's sense. They run fine until a non-trivial modification is needed — and then no one can respond intelligently, because no one ever built the theory in the first place.",
        ),

        // ── What Actually Transfers ──
        block("h2", "What Actually Transfers"),
        block(
            "normal",
            "Naur's point about documentation is often misread. He wasn't anti-documentation. He was precise about what documentation can and can't do.",
        ),
        richBlock(
            "normal",
            "Documentation can jog memories. It can set up pathways of thought. It can help a new person build ",
            { em: "toward" },
            " an adequate theory. What it can't do is substitute for the theory itself — because the theory involves a kind of knowledge that can't be fully expressed in rules or text. It involves recognizing similarity, applying judgment, knowing which parts of the world matter and which don't.",
        ),
        block(
            "normal",
            "What helps most, he argued, isn't exhaustive description of the current state of the system. It's the things that help the next person build an accurate theory: the metaphors, the purpose of each major component, the map of how the pieces interact. Experienced developers often find that three things carry 80% of the value — the guiding metaphor, a description of each major component's role, and a diagram of how they connect.",
        ),
        block(
            "normal",
            'The source code itself carries theory — through naming, structure, and consistency. When people talk about "clean code," what they\'re largely describing is code from which the next reader can reconstruct a coherent theory.',
        ),

        // ── The Implication for What You Build Before the Code ──
        block("h2", "The Implication for What You Build Before the Code"),
        block(
            "normal",
            "If Naur is right — and I think he is — the most important work in software development isn't writing code. It's building and communicating the theory that makes the code coherent.",
        ),
        richBlock(
            "normal",
            "That means the work that happens ",
            { em: "before" },
            " development: naming the entities, mapping the flows, defining the relationships, articulating the purpose of each screen and decision. Not because these artifacts are the deliverable, but because building them ",
            { em: "is" },
            " how the theory gets formed — and how it survives contact with other people.",
        ),
        block(
            "normal",
            "This matters equally for founders handing off to developers and for developers handing off to each other. The failure mode is the same in both cases: someone holds the theory, the handoff happens without it, and the next person builds something that technically works but doesn't fit.",
        ),
        block(
            "normal",
            "AI makes this more urgent, not less. The faster you can generate code, the more important it is to have a clear theory before you do.",
        ),

        // ── Original Essay ──
        richBlock("normal", "Read the original essay: ", {
            link: "Programming as Theory Building (PDF)",
            href: "/assets/naur-programming-as-theory-building.pdf",
        }),

        // ── Closing ──
        richBlock(
            "normal",
            {
                em: "I've been building a tool for exactly this problem — helping founders and developers externalise the theory before they build. If this resonates: ",
            },
            { link: "foreword.design", href: "https://foreword.design", em: true },
        ),
    ],
};

// ── Helpers ──

function block(style: string, text: string) {
    return {
        _type: "block",
        _key: randomKey(),
        style,
        markDefs: [] as Record<string, unknown>[],
        children: [
            {
                _type: "span",
                _key: randomKey(),
                text,
                marks: [] as string[],
            },
        ],
    };
}

function richBlock(style: string, ...segments: Segment[]) {
    const markDefs: Record<string, unknown>[] = [];
    const children: Record<string, unknown>[] = [];

    for (const seg of segments) {
        if (typeof seg === "string") {
            children.push({
                _type: "span",
                _key: randomKey(),
                text: seg,
                marks: [],
            });
        } else if ("em" in seg && typeof seg.em === "string") {
            children.push({
                _type: "span",
                _key: randomKey(),
                text: seg.em,
                marks: ["em"],
            });
        } else if ("strong" in seg && typeof seg.strong === "string") {
            children.push({
                _type: "span",
                _key: randomKey(),
                text: seg.strong,
                marks: ["strong"],
            });
        } else if ("link" in seg) {
            const linkKey = randomKey();
            markDefs.push({
                _type: "link",
                _key: linkKey,
                href: seg.href,
            });
            const marks: string[] = [];
            if (seg.em) marks.push("em");
            marks.push(linkKey);
            children.push({
                _type: "span",
                _key: randomKey(),
                text: seg.link,
                marks,
            });
        }
    }

    return {
        _type: "block",
        _key: randomKey(),
        style,
        markDefs,
        children,
    };
}

function randomKey() {
    return Math.random().toString(36).substring(2, 14);
}

async function main() {
    console.log("Creating draft blog post: Programming as Theory Building...");
    const result = await client.createOrReplace(post);
    console.log(`✓ Created draft post: ${result._id}`);
    console.log(`  Slug: ${post.slug.current}`);
    console.log(`  URL (after publish): /blog/${post.slug.current}`);
}

main().catch((err) => {
    console.error("Failed to seed blog post:", err);
    process.exit(1);
});
