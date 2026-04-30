# RipeMetrics Marketing Frontend — Portfolio Report

> Deep codebase audit of `ripemetrics-ripemetrics-marketing-frontend-b7ff148a3562` — the public marketing website for the RipeMetrics platform.

---

## Executive Summary

RipeMetrics Marketing Frontend is a **full marketing website** built on **Next.js (Pages Router) + TypeScript** with a rich component library spanning 80+ components across 30+ pages. It serves as the public face of the platform — homepage, pricing, solutions, blog (WordPress CMS via WPGraphQL with ISR), landing pages, partner program, and multiple signup funnels. The site integrates **Stripe** for pricing, **Resend + React Email** for transactional emails, **Twilio** for SMS opt-in, **n8n** for workflow automation, and 6 analytics/tracking services. Deployed on **Vercel** with Sentry error monitoring and session replay.

---

## Tech Stack

| Layer            | Technology                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------- |
| Framework        | Next.js (Pages Router), React 18.2                                                           |
| Language         | TypeScript                                                                                   |
| UI Libraries     | MUI v5, Radix UI, Headless UI, shadcn/ui (new-york style)                                    |
| Styling          | Tailwind CSS 3.4 + Emotion (MUI theming)                                                     |
| Animations       | Framer Motion 8.5                                                                            |
| Email            | Resend + React Email (7 templates)                                                           |
| Payments         | Stripe (react-stripe-js, server SDK)                                                         |
| CMS              | WordPress via WPGraphQL (ISR, revalidate: 10s)                                               |
| SMS              | Twilio (opt-in + webhook with signature validation)                                          |
| Scheduling       | React Calendly                                                                               |
| Webhooks         | n8n (self-hosted), Slack                                                                     |
| Validation       | Zod                                                                                          |
| Analytics        | PostHog, Google Tag Manager, Vercel Analytics, Facebook Pixel, LinkedIn Tracking, ProfitWell |
| Error Monitoring | Sentry v8.33 (client/server/edge + Session Replay)                                           |
| Fonts            | Proxima Nova (7 weights, self-hosted OTF), Geist Sans                                        |
| Icons            | Lucide React, Heroicons                                                                      |
| Deployment       | Vercel                                                                                       |

---

## Architecture

### Pages Router + ISR

Next.js Pages Router with 30+ routes. Blog content fetched from WordPress via WPGraphQL at build time with **Incremental Static Regeneration** (revalidate every 10 seconds). Dynamic blog posts use `getStaticPaths` with `fallback: true`.

### Folder Structure

```
pages/                    # Routes (Pages Router)
  api/                    # 15+ API routes (serverless functions)
  legal/                  # 5 legal pages
  lp/                     # Landing pages
  partners/               # Partner program
  posts/[slug].tsx        # Dynamic blog posts
src/
  assets/                 # Images, logos, videos (imported via modules)
  components/
    _shared/              # Layout, navbar, footer, SEO, forms
    cta/                  # CTA components
    forms/                # 9 form components
    page-components/      # Page-specific sections (home/, about/, pricing/, etc.)
    ui/                   # shadcn/ui primitives
  emails/                 # 7 React Email templates
  lib/
    api/                  # WordPress GraphQL client
    constants/            # Pricing data with Stripe price IDs
    services/             # n8n webhook service
    utils/                # GTM, PostHog, CSRF, OG image, schema.org
```

### Layout Pattern

Shared `Layout` component wraps all pages: `<Navbar>` (shrink-on-scroll) + `<MainSidebar>` (mobile) + `<ScrollProgress>` + `<MainFooter>` + `<Seo>`.

---

## All Pages (30+)

### Core Pages

| Route           | Purpose                                                                                 |
| --------------- | --------------------------------------------------------------------------------------- |
| `/`             | Homepage — hero video, testimonials, benefits, demo, features, AI automations, FAQ, CTA |
| `/about`        | About — hero, mission, team, core values                                                |
| `/pricing`      | Pricing — 3-tier cards, monthly/annual toggle, comparison, FAQ                          |
| `/solutions`    | Solutions — hero, video, details, benefits, calendar                                    |
| `/blog`         | Blog — WordPress ISR, hero post + grid                                                  |
| `/posts/[slug]` | Blog post — WordPress content, sidebar newsletter + CTA                                 |
| `/contact`      | Contact form with CSRF protection                                                       |
| `/demo`         | Demo video + calendar card                                                              |

### Signup & Conversion

| Route                      | Purpose                                   |
| -------------------------- | ----------------------------------------- |
| `/get-started`             | Signup form with UTM attribution tracking |
| `/get-started-mobile`      | Mobile-optimized signup                   |
| `/freemium`                | Free AI ChatBot & CRM signup              |
| `/freemium-thank-you`      | Post-signup confirmation                  |
| `/chatbot-demo`            | Chatbot demo request                      |
| `/consultation`            | Consultation request                      |
| `/schedule-discovery-call` | Embedded Calendly widget                  |
| `/unsubscribe`             | Email unsubscribe                         |

### Landing Pages

| Route                                                   | Purpose                       |
| ------------------------------------------------------- | ----------------------------- |
| `/ai-chatbot-for-shopify`                               | AI chatbot for Shopify stores |
| `/growth-hack-for-shopify`                              | Growth hacking for Shopify    |
| `/free-ai-chatbot`                                      | Free AI chatbot offer         |
| `/lp/marketing-automations-without-the-monkey-business` | Full marketing automations LP |

### Partners & Legal

| Route                            | Purpose                      |
| -------------------------------- | ---------------------------- |
| `/partners`                      | Partner program              |
| `/partners/thank-you`            | Partner inquiry confirmation |
| `/fund-and-grow`                 | Fund & Grow partnership      |
| `/legal/terms-of-service`        | Terms of Service             |
| `/legal/privacy-policy`          | Privacy Policy               |
| `/legal/cookie-policy`           | Cookie Policy                |
| `/legal/service-level-agreement` | SLA                          |
| `/legal/website-accessibility`   | Accessibility Statement      |

### Utility

| Route                  | Purpose                  |
| ---------------------- | ------------------------ |
| `/sitemap.xml`         | Dynamic sitemap (SSR)    |
| `/robots.txt`          | Dynamic robots.txt (SSR) |
| `/maintenance`         | Maintenance mode         |
| `/401`, `/404`, `/500` | Error pages              |

---

## API Routes (15+ Serverless Functions)

### Form Handlers

| Route                                                     | Integrations                                                        |
| --------------------------------------------------------- | ------------------------------------------------------------------- |
| `/api/form-submitted/contact-form`                        | Resend email + audience, n8n webhook                                |
| `/api/form-submitted/newsletter-signup`                   | Resend welcome email + audience, n8n (CORS for changelog subdomain) |
| `/api/form-submitted/freemium-signup`                     | Resend + n8n                                                        |
| `/api/form-submitted/consultation-signup`                 | Resend + n8n                                                        |
| `/api/form-submitted/chatbot-demo-signup`                 | Resend + Slack webhook                                              |
| `/api/form-submitted/marketing-get-started-signup`        | Resend + n8n                                                        |
| `/api/form-submitted/marketing-get-started-mobile-signup` | Resend + n8n                                                        |
| `/api/form-submitted/special-offer-signup`                | Redirect to app                                                     |
| `/api/form-submitted/partner-signup`                      | Resend + n8n                                                        |

### Other API Routes

| Route                                  | Purpose                                   |
| -------------------------------------- | ----------------------------------------- |
| `/api/csrf`                            | CSRF token generation                     |
| `/api/email-unsubscribe`               | Resend contacts API unsubscribe           |
| `/api/og`                              | OG image generation (Edge runtime)        |
| `/api/stripe-billing/get-stripe-plans` | Stripe pricing data                       |
| `/api/sms/opt-in`                      | Twilio SMS opt-in                         |
| `/api/sms/webhook`                     | Twilio inbound SMS (signature validation) |
| `/api/preview` / `/api/exit-preview`   | WordPress preview mode                    |

---

## Email Templates (7 — React Email)

| Template                          | Trigger                |
| --------------------------------- | ---------------------- |
| `contact-form-confirmation-email` | Contact form submitted |
| `contact-form-submission-email`   | Internal notification  |
| `newsletter-welcome-email`        | Newsletter signup      |
| `freemium-signup-email`           | Freemium signup        |
| `consultation-signup-email`       | Consultation request   |
| `chatbot-demo-signup-email`       | Chatbot demo request   |
| `special-offer-signup-email`      | Special offer signup   |

---

## Forms (9 Components)

| Form                    | Fields                                      | Destination          |
| ----------------------- | ------------------------------------------- | -------------------- |
| Contact form            | Name, email, company, phone, message + CSRF | API → Resend + n8n   |
| Special offer form      | Name, email, company, phone, promo code     | API → app redirect   |
| Consultation form       | Name, email, company, phone                 | API → Resend + n8n   |
| Chatbot demo form       | Name, email, company, website               | API → Resend + Slack |
| Freemium form           | Name, email, company, phone                 | API → Resend + n8n   |
| Lead capture form       | Email                                       | API → Resend         |
| Get-started form        | Name, email, company, phone + UTM params    | API → app redirect   |
| Mobile get-started form | Same as above, mobile-optimized             | API → app redirect   |
| Newsletter signup       | Email                                       | API → Resend         |

---

## Pricing Tiers

| Tier           | Monthly  | Annual   | Key Features                                                        |
| -------------- | -------- | -------- | ------------------------------------------------------------------- |
| **RipeCRM**    | FREE     | FREE     | AI ChatBot, CRM, Contact Manager, Sales Workflow, 500 msgs/mo       |
| **RipeEngage** | $75/user | $63/user | + Marketing Workflow, Campaigns, Landing Pages, Loyalty, 5K msgs/mo |
| **RipeIntel**  | $85/user | $71/user | + AI Recommendations, RevOps Reporting, Analytics, 10K msgs/mo      |

Stripe price IDs configured via environment variables.

---

## Styling & Design

- **Tailwind CSS 3.4** with plugins: `aspect-ratio`, `typography`, `forms`, `animate`
- **Primary color**: Orange (HSL `24.6 95% 53.1%` ≈ `#FF792A`)
- **Typography**: Proxima Nova (7 weights: thin → black, self-hosted OTF), Geist Sans
- **Custom animations**: border-beam, fade-in, marquee, spin variants, accordion transitions
- **Responsive**: Custom breakpoints (`xs: 475px` through `2xl: 1440px`)
- **Dark mode**: Supported via class strategy `[data-mode="dark"]`
- **MUI theming**: Emotion cache for MUI + Tailwind coexistence

---

## SEO & Metadata

- **Global Open Graph**: Full suite (title, description, image, URL, type)
- **JSON-LD structured data**: Organization, SoftwareApplication, WebSite schemas
- **Dynamic OG images**: Edge runtime API generating branded PNG images
- **Dynamic sitemap**: SSR at `/sitemap.xml` (18+ pages)
- **Dynamic robots.txt**: SSR, disallows `/api/`, `/admin/`, `/maintenance`
- **Canonical URL**: `https://ripemetrics.com`

---

## Analytics Stack (6 Services)

| Service            | Purpose                             |
| ------------------ | ----------------------------------- |
| PostHog            | Product analytics, page views       |
| Google Tag Manager | Tag management, conversion tracking |
| Vercel Analytics   | Web vitals, performance             |
| Facebook Pixel     | Ad conversion tracking              |
| LinkedIn Tracking  | B2B ad attribution                  |
| ProfitWell         | Revenue analytics                   |

---

## Security

- **CSRF protection** on contact form (token generation + verification)
- **Security headers**: X-Frame-Options (DENY), CSP (frame-ancestors none), X-Content-Type-Options (nosniff), X-XSS-Protection, Referrer-Policy
- **Twilio webhook signature validation**
- **Sentry source maps** deleted after upload

---

## Key Technical Achievements

1. **Multi-funnel conversion engine** — 9 distinct form components feeding 9 API routes with Resend emails, n8n workflows, Slack notifications, and Stripe integration
2. **WordPress headless CMS** — WPGraphQL + ISR for performant blog with preview mode and draft support
3. **React Email templating** — 7 branded transactional email templates using React components
4. **6-service analytics stack** — PostHog, GTM, Vercel Analytics, Facebook Pixel, LinkedIn Tracking, ProfitWell
5. **UTM attribution tracking** — Full-funnel attribution with localStorage persistence through signup flows
6. **SMS opt-in system** — Twilio integration with webhook signature validation and context-based state management
7. **Dynamic SEO** — JSON-LD structured data, OG image generation (Edge runtime), dynamic sitemap/robots.txt
8. **n8n workflow automation** — Self-hosted webhook orchestration for form submission processing
9. **Multi-UI-library design system** — MUI + Radix UI + shadcn/ui + Tailwind coexisting with Emotion theming bridge
10. **Landing page system** — Reusable LP components (hero, features, testimonials) for rapid campaign page creation

---

## Relationship to Other Repos

| Repo                                 | Role                                          |
| ------------------------------------ | --------------------------------------------- |
| `ripemetrics-prod`                   | Backend API — serves chatbot, CRM, campaigns  |
| `ripemetrics-reputation`             | Consumer frontend — surveys, reviews, chatbot |
| `ripemetrics-app-frontend`           | Admin dashboard (signup redirects here)       |
| `ripemetrics-preact-islands`         | Chat widget embedded on this site             |
| `ripemetrics-ripe-changelog`         | Product changelog (newsletter API shared)     |
| `ripemetrics-ripe-extractors`        | Content extraction pipeline                   |
| `ripemetrics-ripe-wp-plugin`         | WordPress plugin for chat widget              |
| **`ripemetrics-marketing-frontend`** | **This repo — public marketing website**      |
