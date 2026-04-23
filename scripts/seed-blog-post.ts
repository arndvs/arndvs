/**
 * Seed script — creates the first blog post in Sanity.
 * Run: npx tsx scripts/seed-blog-post.ts
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

const post = {
    _type: "post",
    _id: "post-building-production-sanity-cms",
    title: "Building a Production Sanity CMS with AI-Powered Content Ops",
    slug: { _type: "slug", current: "building-production-sanity-cms-ai-content-ops" },
    author: "Aaron Davis",
    publishedAt: new Date().toISOString(),
    excerpt:
        "A deep dive into architecting a 277K-line healthcare platform on Sanity v5 and Next.js — 18 schema types, AI-powered SEO, 76 JSON-LD schemas, and a revalidation cascade that keeps content live in under 5 seconds.",
    categories: ["Sanity", "Next.js", "AI", "SEO", "TypeScript"],
    seo: {
        _type: "seo",
        metaTitle: "Building a Production Sanity CMS with AI-Powered Content Ops",
        metaDescription:
            "How I built a 277K-line healthcare platform on Sanity v5 with AI-powered SEO, 76 JSON-LD schemas, and sub-5s revalidation. Full architecture breakdown.",
        focusKeyword: "Sanity CMS developer",
    },
    body: [
        // ── The Brief ──
        block("h2", "The Brief"),
        block(
            "normal",
            "A San Diego healthcare practice with 5,000+ patients had outgrown WordPress. They needed a platform that a solo non-technical editor could manage — zero developer dependency for day-to-day content — across 203 pages, 18 content types, and 12+ integrations.",
        ),
        block(
            "normal",
            "The result: a 277K-line Next.js 16 application powered by Sanity v5, with AI-enhanced content operations, programmatic SEO, and a structured data system that auto-generates JSON-LD for every page.",
        ),

        // ── System Overview ──
        block("h2", "What I Built: System Overview"),
        block(
            "normal",
            "The architecture follows a clear separation: Sanity Studio handles content modeling and editing, Next.js handles rendering and caching, and an AI pipeline sits in between — processing every publish event to generate SEO metadata, classify content, and trigger cache invalidation.",
        ),
        block(
            "normal",
            "Quick stats: 18 schema types · 76 JSON-LD files · 34 API routes · 27 email templates · 12+ integrations · 203 pages.",
        ),

        // ── Sanity Studio ──
        block("h2", "Sanity Studio: More Than a CMS"),

        block("h3", "Schema Architecture"),
        block(
            "normal",
            "The schema spans 18 types across four categories: document types (services, conditions, blog posts, events), object types (SEO metadata, operating hours, contact info), field-level types (rich text with custom marks), and custom components (AI enhancement buttons, status badges).",
        ),
        block(
            "normal",
            "Every content type shares a reusable SEO object — metaTitle with a 50–60 character sweet-spot indicator, metaDescription with a 110–160 character range, and a focusKeyword field. This creates consistency across 203 pages without requiring editors to understand SEO mechanics.",
        ),

        block("h3", "Custom Document Actions"),
        block(
            "normal",
            "Community events use a multi-stage workflow: Pending → Approved/Rejected → Featured. Each transition triggers different downstream actions — approved events get JSON-LD structured data, featured events appear in the homepage carousel, and rejected events send a notification to the submitter.",
        ),

        block("h3", "Visual Editing & Live Preview"),
        block(
            "normal",
            "The Presentation tool integration enables real-time content preview. Editors see changes instantly through stega-encoded overlays, and defineLive() from next-sanity streams updates without page refreshes. This was critical for a non-technical editor who needed immediate feedback.",
        ),

        // ── AI Pipeline ──
        block("h2", "AI-Powered Content Enhancement"),

        block("h3", "The Pipeline"),
        block(
            "normal",
            "Every publish event triggers a webhook that sends content to OpenAI. The AI generates SEO metadata, classifies content into the existing category taxonomy, suggests tags, and returns a confidence score with justification — all stored directly on the Sanity document.",
        ),
        block(
            "normal",
            "There are two trigger paths: automatic (webhook fires on every publish) and manual (a custom Studio action button for re-processing). Both use the same underlying pipeline.",
        ),

        block("h3", "Technical Implementation"),
        block(
            "normal",
            'The system prompt positions the AI as an "expert SEO specialist for wellness content." It receives the full category and tag list with Sanity _ids — no hallucinated references. Structured output is validated with Zod (AIResponseSchema), and a fallback system truncates content into basic SEO if OpenAI fails.',
        ),
        codeBlock(
            `// AI Enhancement Pipeline (simplified)
const result = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: JSON.stringify(documentContent) }
  ],
  response_format: { type: 'json_object' }
})

const validated = AIResponseSchema.parse(JSON.parse(result.choices[0].message.content))

await sanityClient.patch(documentId)
  .set({
    'seo.metaTitle': validated.metaTitle,
    'seo.metaDescription': validated.metaDescription,
    'aiMetadata.confidence': validated.confidence,
    'aiMetadata.lastProcessed': new Date().toISOString(),
  })
  .commit()`,
            "typescript",
            "ai-enhancement-pipeline.ts",
        ),
        block(
            "normal",
            "Notifications use Resend for email and Slack webhooks, fired via Promise.allSettled so notification failures never block the content pipeline.",
        ),

        // ── JSON-LD ──
        block("h2", "JSON-LD Structured Data at Scale"),

        block("h3", "The Architecture"),
        block(
            "normal",
            "Structured data follows a 5-layer composition system: Core utilities → Element builders → Schema composers → Page-level builders → Layout composers. Each layer depends only on the one below it.",
        ),
        block(
            "normal",
            "The @graph pattern links entities via @id references — a service page composes Organization + Physician + MedicalService + BreadcrumbList, all cross-referenced. New content types automatically get structured data without frontend changes.",
        ),
        codeBlock(
            `// Composable JSON-LD builder pattern
export function buildServicePageJsonLd(service: Service, org: Organization) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganization(org),
      buildMedicalService(service, org),
      buildBreadcrumbList([
        { name: 'Home', url: org.url },
        { name: 'Services', url: \`\${org.url}/services\` },
        { name: service.name, url: \`\${org.url}/services/\${service.slug}\` },
      ]),
    ],
  }
}`,
            "typescript",
            "json-ld-builder.ts",
        ),

        block("h3", "Why It Matters"),
        block(
            "normal",
            "Medical content includes ICD-10 and SNOMED-CT codes on condition pages — details that traditional CMS setups skip entirely. The structured data validates clean in Google Rich Results Test across all 158 pages.",
        ),

        // ── Revalidation ──
        block("h2", "Revalidation & Performance"),

        block("h3", "Cache Strategy"),
        block(
            "normal",
            "sanityFetch uses cache tags per document type. When a webhook fires, it calls revalidateTag() for the document type and revalidatePath() for every affected route — the blog listing, the individual post, and the sitemap.",
        ),

        block("h3", "The Cascade"),
        block(
            "normal",
            "Content changes go live in under 5 seconds: Editor publishes → Sanity webhook fires → Next.js API route validates signature → cache tags invalidated → affected paths revalidated → IndexNow pings Bing/Yandex for accelerated re-indexing. No manual cache purges, no redeploys.",
        ),
        codeBlock(
            `// Revalidation webhook handler
export async function POST(req: NextRequest) {
  const { body, isValidSignature } = await parseBody(req, secret)
  if (!isValidSignature) return new Response('Invalid signature', { status: 401 })

  revalidateTag(body._type, { expire: 0 })
  
  if (body._type === 'post') {
    revalidatePath('/blog')
    revalidatePath(\`/blog/\${body.slug?.current}\`)
    revalidatePath('/sitemap.xml')
  }
}`,
            "bash",
            "revalidation-cascade.ts",
        ),

        // ── Client Impact ──
        block("h2", "What This Means for Client Operations"),
        block(
            "normal",
            "The end-to-end flow is fully automated: an editor creates a post → AI generates SEO metadata → structured data auto-composes → cache refreshes → search engines get notified. Zero developer involvement for routine content operations.",
        ),
        block(
            "normal",
            "Monitoring covers every layer: Sentry for runtime errors, Slack for content alerts, and email summaries for AI enhancement results. The client hasn't needed developer support for content operations since launch.",
        ),

        // ── Trade-offs ──
        block("h2", "Technical Decisions & Trade-offs"),
        block(
            "normal",
            "Sanity v5 over alternatives: Sanity's real-time collaboration, GROQ query language, and Portable Text gave us the flexibility for 18 schema types without fighting the CMS. The trade-off: a steeper learning curve for the editor, mitigated by custom desk structure and contextual help text on every field.",
        ),
        block(
            "normal",
            "Composable JSON-LD over a monolithic schema file: more code up front, but new content types get structured data automatically. A single blog-schema.ts file would have been faster to ship but impossible to maintain at 76 schemas.",
        ),
        block(
            "normal",
            "In-memory rate limiter over Redis: for a single-origin deployment, an in-memory approach avoids infrastructure complexity. If the site scales to multi-region, Redis becomes the obvious next step.",
        ),

        // ── Event Approval Workflow ──
        block("h2", "Event Approval Workflow: CMS as Workflow Engine"),
        block(
            "normal",
            "Community events (workshops, health fairs, kids' spine checks) follow a structured lifecycle inside Sanity Studio. The schema enforces content quality — no publishing without a featured image, no past dates, minimum description length — so validation happens at the CMS layer, not in review meetings.",
        ),
        block(
            "normal",
            "The AI Enhance button (shared with blog posts) generates SEO metadata for events in 10 seconds. On publish, the Sanity webhook triggers Next.js revalidation for /events and /events/[slug], generates Event JSON-LD schema, and fires an IndexNow submission. The client publishes a Saturday workshop on Thursday and it's indexed by Friday morning.",
        ),

        // ── Animation & Accessibility ──
        block("h2", "Progressive Enhancement: Animations That Degrade Gracefully"),
        block(
            "normal",
            "The site uses WebGL shaders, Framer Motion scroll reveals, and animated counters — heavy visual effects that need to work for the ~5% of users with vestibular disorders. The solution is architectural, not cosmetic.",
        ),
        block(
            "normal",
            "React Server Components render full semantic HTML by default — content is readable before any JavaScript loads. Animations live in 'use client' islands layered on top. A useReducedMotion() hook disables all motion when prefers-reduced-motion is active. The WebGL shader falls back to a static gradient. The key insight: the server render IS the accessible version.",
        ),
        codeBlock(
            `// Progressive enhancement pattern
// Server Component (default) — full HTML, zero JS
export default function ServicePage({ service }) {
  return (
    <article>
      <h1>{service.title}</h1>
      <p>{service.description}</p>
      {/* Client island — animation is the enhancement */}
      <AnimatedTestimonials reviews={service.reviews} />
    </article>
  )
}

// Client Component — respects motion preferences
'use client'
function AnimatedTestimonials({ reviews }) {
  const prefersReducedMotion = useReducedMotion()
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
    </motion.div>
  )
}`,
            "typescript",
            "progressive-enhancement.tsx",
        ),

        // ── Real-Time IndexNow ──
        block("h2", "Real-Time Search Engine Notification with IndexNow"),
        block(
            "normal",
            "Small business sites get crawled infrequently — maybe once a week for a chiropractor. IndexNow flips the model: instead of waiting for Google/Bing to discover changes, the site proactively notifies search engines after every content change.",
        ),
        block(
            "normal",
            "The revalidation webhook handles the full cascade: cache invalidation → related page rebuild (blog index, sitemap, RSS) → IndexNow submission. Total pipeline time: under 2 seconds from publish to indexed. For time-sensitive content like community events, this is the difference between being found and being buried.",
        ),

        // ── LLMs.txt ──
        block("h2", "LLMs.txt: Optimizing for AI Discovery"),
        block(
            "normal",
            "Beyond traditional SEO, the site exposes a /llms.txt endpoint — a structured file that helps AI assistants (ChatGPT, Perplexity, Claude) understand the practice's services, locations, and specialties. Generated from the same Sanity data that powers the site, so it's always current.",
        ),
        block(
            "normal",
            "This is an early bet on AI-referral traffic. When someone asks an AI assistant 'who's a good chiropractor in Mission Valley,' the structured context in llms.txt gives the model accurate, citation-ready information. Zero maintenance cost — the data already exists in the CMS.",
        ),

        // ── Custom Audit Scripts ──
        block("h2", "Custom Audit Scripts: Catching Regressions at 277K Lines"),
        block(
            "normal",
            "Six custom audit scripts run as part of the development workflow: async waterfall detection, bundle import analysis, 'use client' boundary validation, event listener leak detection, Suspense coverage mapping, and re-render pattern analysis. Written when the codebase was 30K lines, they've caught dozens of regressions as the codebase grew to 277K.",
        ),
        block(
            "normal",
            "The 2-hour investment in audit tooling has saved 20+ hours of debugging. At scale, manual code review misses patterns that automated analysis catches consistently — especially async waterfalls across Server Components and unnecessary client-side JavaScript.",
        ),

        // ── CTA ──
        block("h2", "View the Full Case Study"),
        block(
            "normal",
            "This post covers the highlights. For architecture deep-dives, code walkthroughs, and the complete decision log, check out the full AlignSD case study on my portfolio.",
        ),
    ],
};

// ── Helpers ──

function block(style: string, text: string) {
    return {
        _type: "block",
        _key: randomKey(),
        style,
        markDefs: [],
        children: [
            {
                _type: "span",
                _key: randomKey(),
                text,
                marks: [],
            },
        ],
    };
}

function codeBlock(code: string, language: string, filename: string) {
    return {
        _type: "codeBlock",
        _key: randomKey(),
        code,
        language,
        filename,
    };
}

function randomKey() {
    return Math.random().toString(36).substring(2, 14);
}

async function main() {
    console.log("Creating blog post...");
    const result = await client.createOrReplace(post);
    console.log(`✓ Created post: ${result._id}`);
    console.log(`  Slug: ${post.slug.current}`);
    console.log(`  URL: /blog/${post.slug.current}`);
}

main().catch((err) => {
    console.error("Failed to seed blog post:", err);
    process.exit(1);
});
