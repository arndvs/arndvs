import type { DiagramKey } from "./diagrams"
import type {
  PageData,
  HeroData,
  SituationData,
  SubsystemCard,
  ArchitectureData,
  DeepDive,
  Decision,
  Learning,
  Metric,
  CTAData,
  GalleryImage,
} from "@/lib/types/case-study"

export type {
  HeroData,
  SituationData,
  SubsystemCard,
  ArchitectureData,
  DeepDive,
  Decision,
  Learning,
  Metric,
  CTAData,
  GalleryImage,
  PageData,
}

export const pageData: PageData<DiagramKey> = {
  hero: {
    badge: "Healthcare / Web · In Production",
    title: "Align San Diego Family Chiropractic",
    tagline:
      "A 44,000-line Next.js healthcare platform serving 5,000+ families — built solo from schema design to production deployment.",
    stats: [
      { label: "Pages", value: "158" },
      { label: "JSON-LD Schemas", value: "81" },
      { label: "Email Templates", value: "27" },
      { label: "Integrations", value: "10+" },
      { label: "Commits", value: "1,800" },
    ],
    cta: { text: "Visit Live Site", href: "https://alignsd.com" },
    screenshotSrc: "/projects/alignsd/hero-webgl-shader.png",
    screenshotAlt: "AlignSD homepage with WebGL shader hero section",
  },

  situation: {
    narrative: [
      "A San Diego chiropractor with 17 years of practice and 5,000+ patients had outgrown her WordPress site. She needed a platform that could handle insurance verification with document upload, programmatic SEO for 15+ neighborhoods, a Sanity-powered blog with AI-assisted content, and a transactional email system that replaced three separate tools.",
      "The constraint: she's the only person who edits content. The CMS had to be intuitive enough that a non-technical practitioner could manage 158 pages of content without developer support. Every architectural decision flowed from that constraint.",
    ],
    context: {
      role: "Solo Developer (design → deploy)",
      timeline: "2025 – Present",
      client: "Healthcare practice · San Diego, CA",
      live: "alignsd.com",
      stack: [
        "Next.js 16",
        "React 19",
        "Sanity v5",
        "Vercel",
        "OpenAI",
        "GoHighLevel",
        "Stripe",
        "Resend",
        "Sentry",
      ],
    },
  },

  architecture: {
    intro:
      "The system coordinates 10+ external services through 53 API routes. The core architectural principle: every form submission passes through the same security pipeline (honeypot → rate limit → geo-block → validate → process) regardless of which integration it triggers downstream.",
    diagramKey: "systemArchitecture",
    subsystems: [
      {
        title: "Content & CMS",
        description:
          "Sanity v5 with TypeGen, GROQ, Visual Editing",
      },
      {
        title: "Security Pipeline",
        description:
          "3-layer spam prevention before any data reaches the server",
      },
      {
        title: "SEO Engine",
        description:
          "81 JSON-LD schemas + programmatic area pages",
      },
      {
        title: "AI Services",
        description:
          "OpenAI structured output for document OCR + content enhancement",
      },
      {
        title: "Email System",
        description:
          "27 React Email templates triggered by 8 different events",
      },
      {
        title: "Observability",
        description:
          "Sentry (edge + server), PostHog analytics, Slack notifications, custom audit scripts",
      },
    ],
  },

  deepDives: [
    {
      id: "insurance-verification",
      title: "Insurance Verification",
      subtitle: "Orchestrating 7 Services in 60 Seconds",
      problem:
        "Patients called the front desk to verify insurance coverage, consuming 15-20 minutes of staff time per inquiry. The practice needed a self-service flow that collected patient data, verified insurance documents with AI, created a CRM contact, sent confirmation emails, and notified staff — all without the patient picking up the phone.",
      diagramKey: "insuranceVerification",
      walkthrough: [
        "The form collects patient info, insurance details, and card photos across a multi-step UX with per-step validation using React Hook Form and Zod. Each step validates independently before advancing.",
        "Uploaded insurance card images are sent to OpenAI GPT-4o Vision with response_format: json_schema — not free-text extraction, but Zod-validated structured output. The schema constrains what the model can return, eliminating hallucinated fields entirely.",
        "Downstream orchestration runs in parallel: CRM contact creation in GoHighLevel with deduplication by email, 4 separate emails (patient confirmation, staff notification, bizops summary, failure alerts), and a Slack notification — all wrapped in a 60-second maxDuration API route.",
        "The security pipeline runs before any of this: honeypot multi-field validation, rate limiting, IPHub geo-blocking. A spam submission never touches OpenAI or the CRM.",
      ],
      insight: {
        title: "Partial Success > Total Rollback",
        body: "The hardest part of multi-service orchestration isn't calling the APIs — it's deciding what happens when service #4 of 7 fails. I built each downstream call to be independently failable: if the CRM call fails, the patient still gets their confirmation email and staff still gets the Slack notification. Partial success is better than total rollback for a non-transactional flow.",
      },
      screenshotSrc: "/projects/alignsd/start-here-hero.png",
      screenshotAlt: "AlignSD insurance verification start-here page",
    },
    {
      id: "json-ld-composer",
      title: "JSON-LD @graph Composer",
      subtitle: "81 Files That Google Actually Reads",
      problem:
        "Healthcare SEO depends heavily on structured data — Google uses it to display rich results, verify medical authority (E-E-A-T), and understand service areas. Most sites inline a single JSON-LD block per page. AlignSD needed 25+ Schema.org types (Organization, Physician, MedicalOrganization, FAQPage, etc.) composed dynamically per page, with medical codes (ICD-10, SNOMED-CT) attached to condition pages.",
      diagramKey: "jsonldComposer",
      walkthrough: [
        "A 5-layer architecture instead of a single generateJsonLd() utility: the service page for \"Prenatal Chiropractic\" needs Organization + Physician + MedicalBusiness + Service + BreadcrumbList + FAQPage, while a blog post needs BlogPosting + Author + BreadcrumbList. Different pages compose different subsets.",
        "Layer 1 (Core) defines TypeScript interfaces matching Schema.org spec plus business constants like address, phone, and coordinates. Layer 2 (Elements) provides reusable fragments — openingHours(), address(), aggregateRating() — called by multiple schemas.",
        "Layer 3 (Schemas) contains full entity generators — organizationSchema(), physicianSchema(), etc. Layer 4 (Builders) maps Sanity documents to the right schema combinations. Layer 5 (Composers) assembles a @graph array from multiple schemas and deduplicates by @id.",
        "The test suite validates every schema against Schema.org spec before deployment. Adding a new page type means adding a builder — the schemas, elements, and composer layers are untouched.",
      ],
      insight: {
        title: "The Abstraction That Pays For Itself",
        body: "The composable architecture cost ~3x more upfront time than inlining JSON-LD per page. It paid for itself the first time the client added a new service category: zero frontend changes, the builder + composer automatically generated the right structured data from the Sanity schema. The abstraction boundary is \"what data exists\" (Sanity) vs. \"what Google needs to see\" (JSON-LD) — and those two things should never be coupled.",
      },
      screenshotSrc: "/projects/alignsd/services-categories.png",
      screenshotAlt: "AlignSD services categories with structured data",
    },
    {
      id: "programmatic-seo",
      title: "Programmatic Area SEO",
      subtitle: "Owning Local Search Without Duplicate Content",
      problem:
        "The practice serves 15+ San Diego neighborhoods but has one physical location. Traditional location pages are thin content farms — same text with the city name swapped. Google penalizes this. The challenge: generate unique, useful pages for each neighborhood that rank for [service] in [neighborhood] queries without triggering duplicate content penalties.",
      diagramKey: "programmaticSeo",
      walkthrough: [
        "A hub page at /areas indexes all neighborhoods with a map. Spoke pages like /areas/mission-valley contain neighborhood-specific hero imagery from Sanity, local driving directions, embedded Google Map, tabbed local guide (Parks, Health & Wellness, Food, Landmarks — all unique per area), filtered patient reviews from that area, and service keyword links.",
        "Sub-spoke pages like /areas/mission-valley/chiropractor target specific [service] + [area] long-tail keywords with unique content per combination. Each page gets its own JSON-LD (LocalBusiness + BreadcrumbList + WebPage) via the composer system.",
        "Internal linking is bidirectional: area pages link to service pages, service pages link back to relevant areas. This creates a dense internal link graph that distributes authority across the entire programmatic SEO layer.",
      ],
      insight: {
        title: "Content That Proves You Know the Neighborhood",
        body: "The tabbed local guide (Parks, Health, Food, Landmarks) is what differentiates this from a content farm. Each tab contains hand-curated places with addresses and Google Maps links. This is the kind of content Google rewards — it's genuinely useful to someone searching \"chiropractor near Mission Valley\" because it proves the business actually knows the neighborhood. The CMS schema stores these as structured Sanity documents so the client can update them without touching code.",
      },
      screenshotSrc: "/projects/alignsd/services-hero.png",
      screenshotAlt: "AlignSD services page with programmatic area SEO",
    },
    {
      id: "spam-prevention",
      title: "Spam Prevention",
      subtitle: "Three Walls Before the Front Door",
      problem:
        "Healthcare contact forms are spam magnets — bots target them 24/7, and every spam submission that reaches the CRM or triggers an email costs real money (API calls, Resend sends, staff time triaging). Third-party CAPTCHA services add friction for real patients. The goal: block 99%+ of spam with zero visible user friction.",
      diagramKey: "spamPrevention",
      walkthrough: [
        "Wall 1 — Honeypot (client-side): Three invisible traps. A hidden text field (bots fill it; humans don't see it). A timing check (submissions faster than 3 seconds = bot). A hidden checkbox (bots check everything; humans never see it). Any trigger = silent rejection + spam alert email to staff.",
        "Wall 2 — Rate Limiter (server-side): In-memory store tracking submissions per IP per time window. Exceeding the limit returns 429. No database dependency — survives cold starts.",
        "Wall 3 — IPHub Geo-Blocking (external API): Checks the IP against IPHub's database of proxies, VPNs, datacenter IPs, and high-risk geolocations. A chiropractor in San Diego doesn't need insurance verifications from a Russian datacenter.",
        "Only after all three walls pass does the request reach Zod validation and the actual form processing pipeline.",
      ],
      insight: {
        title: "Silent Rejection Is the Whole Strategy",
        body: "The silent rejection on Wall 1 is critical. Returning an error message tells the bot it was caught — it adapts. Returning a fake success response makes the bot think it worked. Meanwhile, the spam alert email gives staff visibility without manual triage. The three walls are ordered by cost: honeypot is free (client-side), rate limiting is cheap (in-memory), and IPHub costs an API call — so you only pay for the call on submissions that passed the first two walls.",
      },
      screenshotSrc: "/projects/alignsd/contact-page.png",
      screenshotAlt: "AlignSD contact page with honeypot spam prevention",
    },
  ],

  decisions: [
    {
      decision: "Sanity v5 over Contentful, Payload, WordPress",
      alternatives:
        "Contentful (too expensive at scale), Payload (self-hosted ops burden), WordPress (not composable)",
      reasoning:
        "Non-technical solo editor needs: Presentation mode for visual editing, GROQ for flexible queries, TypeGen for type safety. Sanity's free tier covers the use case.",
    },
    {
      decision: "81-file JSON-LD system over a single utility",
      alternatives:
        "Single generateJsonLd() function, third-party schema plugin",
      reasoning:
        "New service categories added via CMS shouldn't require frontend deploys. The composable pattern decouples \"what data exists\" from \"what Google sees.\"",
    },
    {
      decision: "In-memory rate limiter over Redis/Upstash",
      alternatives:
        "Redis (additional infra), Upstash (cost per call), Vercel KV (cold start latency)",
      reasoning:
        "A chiropractic website gets ~100 form submissions/month. In-memory with IP-based windows is sufficient. If traffic grew 100x, I'd migrate to Upstash — but premature infrastructure is a form of technical debt too.",
    },
    {
      decision: "3-layer honeypot over reCAPTCHA/Turnstile",
      alternatives:
        "Google reCAPTCHA (privacy concerns for healthcare), Cloudflare Turnstile (additional dependency), hCaptcha",
      reasoning:
        "Zero friction for patients. Healthcare users skew older — CAPTCHA challenges have measurably higher abandonment rates. The honeypot catches bots; the rate limiter + IPHub catch the rest.",
    },
    {
      decision: "React Email over MJML, Handlebars, SendGrid templates",
      alternatives:
        "MJML (no component model), Handlebars (no TypeScript), SendGrid drag-and-drop (no version control)",
      reasoning:
        "27 templates sharing 30+ components. When the practice updated their logo, one component change propagated to all 27 templates. That's not possible with HTML templates or drag-and-drop builders.",
    },
    {
      decision: "GoHighLevel CRM over HubSpot, Salesforce",
      alternatives:
        "HubSpot (expensive for small practice), Salesforce (overkill), custom DB",
      reasoning:
        "Client was already paying for GoHighLevel. Wrapping their existing CRM with typed API routes + Sentry gives observability without asking them to switch tools.",
    },
  ],

  learnings: [
    {
      title: "Partial Success > Total Rollback",
      body: "When orchestrating 7 external services (OpenAI, CRM, 4 emails, Slack), I stopped trying to make the entire pipeline transactional. Instead, each downstream call is independently failable. If the CRM call fails, the patient still gets their confirmation email. This reduced support tickets from \"my form didn't work\" to zero.",
    },
    {
      title: "The Abstraction That Pays For Itself",
      body: "The JSON-LD composer system took 3x longer to build than inlining structured data. It paid for itself the first time the client added a new service category — zero frontend changes, the builder automatically generated the right @graph output. The rule: if the client can create new content types in the CMS, the structured data layer must handle them without a deploy.",
    },
    {
      title: "Build the Audit Tools First",
      body: "I wrote 6 custom code audit scripts (async waterfalls, bundle imports, client component boundaries, event listeners, suspense coverage, re-render patterns) before the codebase hit 30K lines. At 44K lines, those scripts catch regressions I'd never find manually. The 2 hours invested in tooling saved 20+ hours of debugging.",
    },
  ],

  metrics: {
    hero: [
      { value: 44186, label: "Lines of Code" },
      { value: 158, label: "Pages" },
      { value: 1800, label: "Commits" },
      { value: 10, label: "External Integrations", suffix: "+" },
    ],
    supporting: [
      { value: 81, label: "JSON-LD Schema Files" },
      { value: 27, label: "Email Templates" },
      { value: 53, label: "API Routes" },
      { value: 55, label: "Test Files" },
    ],
  },

  gallery: [
    {
      src: "/projects/alignsd/hero-webgl-shader.png",
      alt: "AlignSD homepage with WebGL shader hero animation",
      caption: "Homepage — WebGL paper shader hero with animated particle system",
    },
    {
      src: "/projects/alignsd/reviews-grid.png",
      alt: "AlignSD patient reviews grid layout",
      caption: "Reviews — AI-curated patient testimonial grid",
    },
    {
      src: "/projects/alignsd/services-hero.png",
      alt: "AlignSD services page hero section",
      caption: "Services — Dynamic service categories with structured data",
    },
    {
      src: "/projects/alignsd/start-here-wellness-system.png",
      alt: "AlignSD wellness system onboarding flow",
      caption: "Start Here — Multi-step wellness assessment with insurance verification",
    },
    {
      src: "/projects/alignsd/testimonial-carousel.png",
      alt: "AlignSD testimonial carousel component",
      caption: "Testimonials — Animated carousel with AI-generated review insights",
    },
    {
      src: "/projects/alignsd/services-pricing.png",
      alt: "AlignSD services and pricing section",
      caption: "Pricing — Dynamic pricing cards pulled from Sanity CMS",
    },
  ],

  cta: {
    text: "Interested in what I could build for your business? I'm currently taking on full-stack web development and AI integration projects.",
    buttons: [
      { text: "Get in Touch", href: "/#contact", variant: "default" },
      { text: "View More Projects", href: "/projects", variant: "outline" },
    ],
  },
}
