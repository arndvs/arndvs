/**
 * Seed script — creates the "readable vs explainable" blog post.
 * Idempotent: skips if the slug already exists.
 * Run: pnpm exec tsx scripts/seed-haskell-post.ts
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

const SLUG = "readable-vs-explainable";
const POST_ID = `post-${SLUG}`;

const HASKELL = `f :: String -> String
f = g . h
  where
    h []     = []
    h (x:xs) = h xs ++ [x]
    g x =
      let (y, z) = p x
      in if y then z else g z
    p []       = (True, [])
    p [x]      = (True, [x])
    p (x:y:xs)
      | x > y     = let (a, b) = p (x:xs) in (False, y:b)
      | otherwise = let (a, b) = p (y:xs) in (a, x:b)`;

const TYPESCRIPT = `// f: reverse the letters, then sort them
function f(s: string): string {
  const letters = s.split("");
  return g(h(letters)).join("");
}

// h: turn the line around (reverse)
function h(list: string[]): string[] {
  if (list.length === 0) return [];
  const [x, ...xs] = list;
  return [...h(xs), x];          // h xs ++ [x]
}

// p: walk down the line once, swapping neighbors that are out of order.
// Returns [nobodySwapped, newLine]
function p(list: string[]): [boolean, string[]] {
  if (list.length <= 1) return [true, list];   // empty or one kid: already fine

  const [x, y, ...xs] = list;
  if (x > y) {
    // Out of order: y steps in front, x keeps walking down the line
    const [, rest] = p([x, ...xs]);
    return [false, [y, ...rest]];              // someone swapped!
  } else {
    // In order: x stays, keep checking from y onward
    const [nobodySwapped, rest] = p([y, ...xs]);
    return [nobodySwapped, [x, ...rest]];
  }
}

// g: keep walking the line until a whole walk has no swaps
function g(list: string[]): string[] {
  const [nobodySwapped, newLine] = p(list);
  return nobodySwapped ? newLine : g(newLine);
}

console.log(f("banana"));   // "aaabnn"
console.log(f("hello"));    // "ehllo"`;

/** Build a Portable Text block from markdown-ish parts. */
let blockSeq = 0;
function block(
    type: "normal" | "h2" | "h3" | "blockquote",
    text: string,
    link?: { text: string; href: string },
): Record<string, unknown> {
    blockSeq += 1;
    const linkKey = `link-${blockSeq}`;
    const children = link
        ? [
              { _type: "span", text: text.slice(0, text.indexOf(link.text)), marks: [] },
              {
                  _type: "span",
                  text: link.text,
                  marks: [linkKey],
              },
              {
                  _type: "span",
                  text: text.slice(text.indexOf(link.text) + link.text.length),
                  marks: [],
              },
          ]
        : [{ _type: "span", text, marks: [] }];
    return {
        _type: "block",
        _key: `block-${blockSeq}`,
        style: type,
        children,
        ...(link
            ? {
                  markDefs: [
                      {
                          _key: linkKey,
                          _type: "link",
                          href: link.href,
                          blank: true,
                      },
                  ],
              }
            : {}),
    };
}

let codeSeq = 0;
function codeBlock(code: string, language: string, filename?: string): Record<string, unknown> {
    codeSeq += 1;
    return {
        _type: "codeBlock",
        _key: `code-${codeSeq}`,
        code,
        language,
        filename,
    };
}

let embedSeq = 0;
function htmlEmbed(
    url: string,
    title: string,
    aspectRatio: string,
    caption?: string,
): Record<string, unknown> {
    embedSeq += 1;
    return {
        _type: "htmlEmbed",
        _key: `embed-${embedSeq}`,
        url,
        title,
        aspectRatio,
        caption,
    };
}

const body = [
    block(
        "normal",
        "Geoffrey Huntley shared a deliberately obfuscated Haskell function in his newsletter. Single-letter names. Recursion everywhere. My first reaction: no idea.",
        {
            text: "Geoffrey Huntley",
            href: "https://ghuntley.com/readable/",
        },
    ),

    block("h2", "The 12 lines I couldn't read"),

    codeBlock(HASKELL, "haskell", "mystery.hs"),

    block(
        "normal",
        "So I tried his experiment. I asked Claude to explain it like it was talking to my kid, with TypeScript as a reference.",
    ),

    block("h2", "The experiment"),

    block(
        "normal",
        "It came back with a row of kids holding letter cards, swapping places until they were lined up A to Z. Plus clean TypeScript I could actually run.",
    ),

    htmlEmbed(
        "https://arndvs.github.io/ai-visuals/visuals/haskell-to-typescript/",
        "Haskell to TypeScript morph animation",
        "4 / 5",
        "Each Haskell token flies to its TypeScript twin. It's bubble sort the whole time.",
    ),

    block("normal", "It was bubble sort the whole time."),

    codeBlock(TYPESCRIPT, "typescript", "explained.ts"),

    block("h2", "The animation is the explanation"),

    block(
        "normal",
        "The embed above is the point of this whole exercise. I didn't write a paragraph explaining the morph — I built an animation that does it. Each Haskell token flies to its TypeScript twin, the background shifts from purple to blue, and the banana tiles hop into aaabnn. You watched the idea become legible.",
    ),

    block(
        "normal",
        "This is AI-assisted animation: using a well-designed visual to make a complex idea comprehensible in seconds. The animation was written by Claude using the motion-graphics skill stack — HyperFrames for the MP4 render, GSAP and Remotion skill packs for motion reference, ffmpeg for post-work. The file itself is hand-built HTML/CSS/JS with zero dependencies, so it embeds anywhere.",
    ),

    block(
        "normal",
        "This visual is one output of a small hub I keep — a repo that houses the rules, tools, skills, and templates for making these visuals, with each visual as a folder of outputs. The point is that the next visual is faster to make: the machinery is already there, documented, and reusable.",
    ),

    block(
        "normal",
        "The bet is that when an idea is hard to hold in your head, a few seconds of well-designed motion can compress a page of reasoning into something you instantly get. The morph from Haskell to TypeScript is the \u201cexplainable on demand\u201d argument made visible — the animation is the explanation, not a decoration on top of it.",
    ),

    block("h2", "Readable vs. explainable"),

    block(
        "normal",
        "Huntley's argument is that code no longer needs to be readable to a human reading it cold. It needs to be explainable on demand. The artifact doesn't need to be optimized for a human to read cold — it needs to be something a model can explain to a human on demand.",
    ),

    block("normal", "I'm not fully sold. Someone still has to own what ships."),

    block(
        "normal",
        "But his second point hit home: strict types are guardrails. Compiler errors give AI agents feedback on every loop, so a typed codebase stays on the rails better than a loose one.",
    ),

    block(
        "blockquote",
        "This is also why I can get away with cheaper models. Pick a language that does the verification for you, and you need less intelligence to stay on the rails.",
    ),

    block("h2", "What guardrails actually look like"),

    block(
        "normal",
        "This is where I have something concrete to add, because I run an agent engine — ctrl+shft — that ships code autonomously. Types are one form of guardrail. They're not the only one, and they're not the most important one.",
    ),

    block(
        "normal",
        "The pipeline is autonomous between two human gates and deliberately stops at them. A human applies the start label to launch the work. A human applies the verdict label to ship it. There is no auto-merge by design. The agent can plan, implement, and open a PR on its own — but it cannot merge its own work.",
    ),

    block(
        "normal",
        "Every fix PR must state its regression-guard verdict: added a test, covered by an existing test, or not warranted with a reason. A convention is only real when a machine enforces it — this check runs in CI with zero permissions.",
    ),

    block(
        "normal",
        "A hook blocks committing infrastructure changes directly to main. Infra changes must flow feature → dev → main, or the dev branch drifts and workflows break. The guard fails open on missing context but blocks the explicit pattern.",
    ),

    block(
        "normal",
        "Code-health findings carry path allowlists — the exact globs the implementer may modify, enforced in CI. The agent can only touch what it's been handed. And if the automation token is missing, the first chaining hop fails closed: the issue lands in blocked. There is no silent failure.",
    ),

    block(
        "normal",
        "The pattern across all of these: guardrails aren't about restricting the AI. They're about making the boundaries explicit and machine-enforced. Types do this at the language level. Process gates do it at the system level. Both give the agent feedback on every loop.",
    ),

    block("h2", "The skill that matters"),

    block(
        "normal",
        "The skill that matters is shifting from \u201ccan you read this?\u201d to \u201ccan you ask the right question and check the answer?\u201d",
    ),

    block(
        "normal",
        "Would you ship code your team can't read, as long as an AI can explain it? That's the question. I don't have a clean answer. But I know the guardrails are what make the question worth asking — and the animation above is what makes the answer worth seeing.",
    ),
];

async function seed() {
    console.log("Seeding blog post...\n");

    const existing = await client.fetch<string[]>(
        `*[_type == "post" && slug.current == $slug][0]._id`,
        { slug: SLUG },
    );

    if (existing) {
        console.log(`  ⏭ ${SLUG} (exists) — updating body with _keys`);
    }

    await client.createOrReplace({
        _id: POST_ID,
        _type: "post",
        title: "Readable vs. Explainable: 12 Lines of Haskell Changed How I Think About Code",
        slug: { _type: "slug", current: SLUG },
        author: "Aaron Davis",
        publishedAt: "2026-10-02T12:00:00Z",
        excerpt:
            "I pasted 12 lines of Haskell I couldn't read into an AI. Thirty seconds later I understood them — and it made me rethink what code is actually for.",
        tldr: "Code no longer needs to be readable by a human reading it cold — it needs to be explainable on demand. But explainable isn't a license to write garbage. It's a contract: the artifact must be verifiable, and the process around it must have guardrails. Here's how I think about both.",
        categories: ["AI", "Software Engineering", "Developer Experience"],
        body,
    });

    console.log(`  ✅ ${SLUG}`);
    console.log("\nDone.");
}

seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
