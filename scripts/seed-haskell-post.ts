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

    block("h2", "The translation isn't the point"),

    block(
        "normal",
        "Here's the thing I almost missed: the Haskell-to-TypeScript trick is a demo, not the thesis. Translation between languages isn't new. What's new is the question underneath it.",
    ),

    block(
        "normal",
        "For forty years, nearly every design decision in computing assumed a human was reading, writing, or operating the system. Consoles exist because mainframes had human operators. Languages evolve at the speed humans can learn — LINQ took five to eight years to catch on, Python 2 to 3 took about fifteen. Companies keep separate Ruby, .NET, and Java teams because people specialize. Library ecosystems mattered because humans needed them.",
    ),

    block(
        "normal",
        "Take the human out of the reading seat, and every one of those choices is open again. That's the real argument. Readable code is just the most familiar example of a much bigger pattern.",
    ),

    block("h2", "Verification replaces readability"),

    block(
        "normal",
        "Readable code was always a stand-in for \u201ccan we trust this?\u201d In a world where an agent writes the code, trust comes from machine checks: strict types, compilers, and simulators that catch the agent's mistakes on every loop.",
    ),

    block(
        "normal",
        "That's why porting works \u201cwhen the end result is easy to verify,\u201d and why Huntley can get away with cheaper models. The human moves from reading every line to defining what must be true.",
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

    block("h2", "The human doesn't leave"),

    block(
        "normal",
        "The skill that matters is shifting from \u201ccan you read this?\u201d to \u201ccan you ask the right question and check the answer?\u201d",
    ),

    block(
        "normal",
        "The human doesn't leave. We stop reading every line and start deciding what must be true. That's a different job, and it's the one worth getting good at.",
    ),

    block(
        "normal",
        "Which practice on your team exists only because a person had to read the code?",
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
        title: "Readable Code Was a Stand-in for Trust",
        slug: { _type: "slug", current: SLUG },
        author: "Aaron Davis",
        publishedAt: "2026-10-02T12:00:00Z",
        excerpt:
            "The Haskell-to-TypeScript trick is a demo, not the thesis. The real argument: forty years of computing assumed a human was reading, writing, or operating the system. Take the human out, and every one of those choices is open again.",
        tldr: "For forty years, nearly every design decision in computing assumed a human was reading, writing, or operating the system. Take the human out of the reading seat and every one of those choices is open again. What replaces readability is verification — strict types, compilers, and simulators that catch an agent's mistakes on every loop. The human doesn't leave; we stop reading every line and start deciding what must be true.",
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
