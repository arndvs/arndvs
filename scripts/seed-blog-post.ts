/**
 * Seed script — creates the first blog post in Sanity.
 * Run: npx tsx scripts/seed-blog-post.ts
 */
import { config } from 'dotenv'
import { createClient } from '@sanity/client'

config({ path: '.env.local' })

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: '2025-03-19',
    token: process.env.SANITY_API_TOKEN!,
    useCdn: false,
})

const post = {
    _type: 'post',
    _id: 'post-building-production-sanity-cms',
    title: 'Building a Production Sanity CMS with AI-Powered Content Ops',
    slug: { _type: 'slug', current: 'building-production-sanity-cms-ai-content-ops' },
    author: 'Aaron Davis',
    publishedAt: new Date().toISOString(),
    excerpt:
        'A deep dive into architecting a 44,000-line healthcare platform on Sanity v5 and Next.js — 18 schema types, AI-powered SEO, 81 JSON-LD schemas, and a revalidation cascade that keeps content live in under 5 seconds.',
    categories: ['Sanity', 'Next.js', 'AI', 'SEO', 'TypeScript'],
    seo: {
        _type: 'seo',
        metaTitle: 'Building a Production Sanity CMS with AI-Powered Content Ops',
        metaDescription:
            'How I built a 44k-line healthcare platform on Sanity v5 with AI-powered SEO, 81 JSON-LD schemas, and sub-5s revalidation. Full architecture breakdown.',
        focusKeyword: 'Sanity CMS developer',
    },
    body: [
        // ── The Brief ──
        block(
            'h2',
            'The Brief'
        ),
        block(
            'normal',
            'A San Diego healthcare practice with 5,000+ patients had outgrown WordPress. They needed a platform that a solo non-technical editor could manage — zero developer dependency for day-to-day content — across 158 pages, 18 content types, and 10+ integrations.'
        ),
        block(
            'normal',
            'The result: a 44,000-line Next.js 16 application powered by Sanity v5, with AI-enhanced content operations, programmatic SEO, and a structured data system that auto-generates JSON-LD for every page.'
        ),

        // ── System Overview ──
        block('h2', 'What I Built: System Overview'),
        block(
            'normal',
            'The architecture follows a clear separation: Sanity Studio handles content modeling and editing, Next.js handles rendering and caching, and an AI pipeline sits in between — processing every publish event to generate SEO metadata, classify content, and trigger cache invalidation.'
        ),
        block(
            'normal',
            'Quick stats: 18 schema types · 81 JSON-LD files · 53 API routes · 27 email templates · 5 AI integrations · 158 pages.'
        ),

        // ── Sanity Studio ──
        block('h2', 'Sanity Studio: More Than a CMS'),

        block('h3', 'Schema Architecture'),
        block(
            'normal',
            'The schema spans 18 types across four categories: document types (services, conditions, blog posts, events), object types (SEO metadata, operating hours, contact info), field-level types (rich text with custom marks), and custom components (AI enhancement buttons, status badges).'
        ),
        block(
            'normal',
            'Every content type shares a reusable SEO object — metaTitle with a 50–60 character sweet-spot indicator, metaDescription with a 110–160 character range, and a focusKeyword field. This creates consistency across 158 pages without requiring editors to understand SEO mechanics.'
        ),

        block('h3', 'Custom Document Actions'),
        block(
            'normal',
            'Community events use a multi-stage workflow: Pending → Approved/Rejected → Featured. Each transition triggers different downstream actions — approved events get JSON-LD structured data, featured events appear in the homepage carousel, and rejected events send a notification to the submitter.'
        ),

        block('h3', 'Visual Editing & Live Preview'),
        block(
            'normal',
            'The Presentation tool integration enables real-time content preview. Editors see changes instantly through stega-encoded overlays, and defineLive() from next-sanity streams updates without page refreshes. This was critical for a non-technical editor who needed immediate feedback.'
        ),

        // ── AI Pipeline ──
        block('h2', 'AI-Powered Content Enhancement'),

        block('h3', 'The Pipeline'),
        block(
            'normal',
            'Every publish event triggers a webhook that sends content to OpenAI. The AI generates SEO metadata, classifies content into the existing category taxonomy, suggests tags, and returns a confidence score with justification — all stored directly on the Sanity document.'
        ),
        block(
            'normal',
            'There are two trigger paths: automatic (webhook fires on every publish) and manual (a custom Studio action button for re-processing). Both use the same underlying pipeline.'
        ),

        block('h3', 'Technical Implementation'),
        block(
            'normal',
            'The system prompt positions the AI as an "expert SEO specialist for wellness content." It receives the full category and tag list with Sanity _ids — no hallucinated references. Structured output is validated with Zod (AIResponseSchema), and a fallback system truncates content into basic SEO if OpenAI fails.'
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
            'typescript',
            'ai-enhancement-pipeline.ts'
        ),
        block(
            'normal',
            'Notifications use Resend for email and Slack webhooks, fired via Promise.allSettled so notification failures never block the content pipeline.'
        ),

        // ── JSON-LD ──
        block('h2', 'JSON-LD Structured Data at Scale'),

        block('h3', 'The Architecture'),
        block(
            'normal',
            'Structured data follows a 5-layer composition system: Core utilities → Element builders → Schema composers → Page-level builders → Layout composers. Each layer depends only on the one below it.'
        ),
        block(
            'normal',
            'The @graph pattern links entities via @id references — a service page composes Organization + Physician + MedicalService + BreadcrumbList, all cross-referenced. New content types automatically get structured data without frontend changes.'
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
            'typescript',
            'json-ld-builder.ts'
        ),

        block('h3', 'Why It Matters'),
        block(
            'normal',
            'Medical content includes ICD-10 and SNOMED-CT codes on condition pages — details that traditional CMS setups skip entirely. The structured data validates clean in Google Rich Results Test across all 158 pages.'
        ),

        // ── Revalidation ──
        block('h2', 'Revalidation & Performance'),

        block('h3', 'Cache Strategy'),
        block(
            'normal',
            'sanityFetch uses cache tags per document type. When a webhook fires, it calls revalidateTag() for the document type and revalidatePath() for every affected route — the blog listing, the individual post, and the sitemap.'
        ),

        block('h3', 'The Cascade'),
        block(
            'normal',
            'Content changes go live in under 5 seconds: Editor publishes → Sanity webhook fires → Next.js API route validates signature → cache tags invalidated → affected paths revalidated → IndexNow pings Bing/Yandex for accelerated re-indexing. No manual cache purges, no redeploys.'
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
            'bash',
            'revalidation-cascade.ts'
        ),

        // ── Client Impact ──
        block('h2', 'What This Means for Client Operations'),
        block(
            'normal',
            'The end-to-end flow is fully automated: an editor creates a post → AI generates SEO metadata → structured data auto-composes → cache refreshes → search engines get notified. Zero developer involvement for routine content operations.'
        ),
        block(
            'normal',
            'Monitoring covers every layer: Sentry for runtime errors, Slack for content alerts, and email summaries for AI enhancement results. The client hasn\'t needed developer support for content operations since launch.'
        ),

        // ── Trade-offs ──
        block('h2', 'Technical Decisions & Trade-offs'),
        block(
            'normal',
            'Sanity v5 over alternatives: Sanity\'s real-time collaboration, GROQ query language, and Portable Text gave us the flexibility for 18 schema types without fighting the CMS. The trade-off: a steeper learning curve for the editor, mitigated by custom desk structure and contextual help text on every field.'
        ),
        block(
            'normal',
            'Composable JSON-LD over a monolithic schema file: more code up front, but new content types get structured data automatically. A single blog-schema.ts file would have been faster to ship but impossible to maintain at 81 schemas.'
        ),
        block(
            'normal',
            'In-memory rate limiter over Redis: for a single-origin deployment, an in-memory approach avoids infrastructure complexity. If the site scales to multi-region, Redis becomes the obvious next step.'
        ),

        // ── CTA ──
        block('h2', 'View the Full Case Study'),
        block(
            'normal',
            'This post covers the highlights. For architecture deep-dives, code walkthroughs, and the complete decision log, check out the full AlignSD case study on my portfolio.'
        ),
    ],
}

// ── Helpers ──

function block(style: string, text: string) {
    return {
        _type: 'block',
        _key: randomKey(),
        style,
        markDefs: [],
        children: [
            {
                _type: 'span',
                _key: randomKey(),
                text,
                marks: [],
            },
        ],
    }
}

function codeBlock(code: string, language: string, filename: string) {
    return {
        _type: 'codeBlock',
        _key: randomKey(),
        code,
        language,
        filename,
    }
}

function randomKey() {
    return Math.random().toString(36).substring(2, 14)
}

async function main() {
    console.log('Creating blog post...')
    const result = await client.createOrReplace(post)
    console.log(`✓ Created post: ${result._id}`)
    console.log(`  Slug: ${post.slug.current}`)
    console.log(`  URL: /blog/${post.slug.current}`)
}

main().catch((err) => {
    console.error('Failed to seed blog post:', err)
    process.exit(1)
})
